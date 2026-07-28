import Database from 'better-sqlite3';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { logger } from './utils/logger';

const DEFAULT_DATABASE_PATH = path.join('data', 'todo.db');
const DEFAULT_MIGRATIONS_PATH = path.join(process.cwd(), 'migrations');

export type SqliteDatabase = Database.Database;

export interface DatabaseOptions {
    databasePath?: string;
    migrationsPath?: string;
}

function resolveDatabasePath(databasePath?: string): string {
    const configuredPath = databasePath ?? process.env.DATABASE_PATH ?? DEFAULT_DATABASE_PATH;
    return configuredPath === ':memory:' ? configuredPath : path.resolve(process.cwd(), configuredPath);
}

function ensureDatabaseDirectory(databasePath: string): void {
    if (databasePath !== ':memory:') {
        mkdirSync(path.dirname(databasePath), { recursive: true });
    }
}

export function runMigrations(
    database: SqliteDatabase,
    migrationsPath = DEFAULT_MIGRATIONS_PATH,
): void {
    database.exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            name TEXT PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        )
    `);

    const appliedMigrations = database
        .prepare('SELECT name FROM schema_migrations')
        .all()
        .map((row) => (row as { name: string }).name);
    const appliedNames = new Set(appliedMigrations);
    const migrationNames = readdirSync(migrationsPath)
        .filter((name) => /^\d+_[a-z0-9_]+\.sql$/i.test(name))
        .sort();
    const recordMigration = database.prepare(
        'INSERT INTO schema_migrations (name) VALUES (?)',
    );

    for (const migrationName of migrationNames) {
        if (appliedNames.has(migrationName)) {
            continue;
        }

        const sql = readFileSync(path.join(migrationsPath, migrationName), 'utf8');
        database.transaction(() => {
            database.exec(sql);
            recordMigration.run(migrationName);
        })();
        logger.info('Database migration applied', { migration: migrationName });
    }
}

export function openDatabase(options: DatabaseOptions = {}): SqliteDatabase {
    const databasePath = resolveDatabasePath(options.databasePath);
    ensureDatabaseDirectory(databasePath);

    const database = new Database(databasePath);
    database.pragma('foreign_keys = ON');
    database.pragma('busy_timeout = 5000');

    try {
        runMigrations(database, options.migrationsPath);
        return database;
    } catch (error) {
        database.close();
        logger.error('Database initialization failed', {
            databasePath,
            error: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
}

let applicationDatabase: SqliteDatabase | undefined;

export function getDatabase(): SqliteDatabase {
    applicationDatabase ??= openDatabase();
    return applicationDatabase;
}