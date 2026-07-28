import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { openDatabase } from '../../src/backend/database';

const temporaryDirectories: string[] = [];

afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) {
        rmSync(directory, { force: true, recursive: true });
    }
});

describe('database migrations', () => {
    it('creates the task schema and remains idempotent', () => {
        const directory = mkdtempSync(path.join(tmpdir(), 'todo-app-'));
        temporaryDirectories.push(directory);
        const databasePath = path.join(directory, 'test.db');

        const firstConnection = openDatabase({ databasePath });
        const columns = firstConnection.pragma('table_info(tasks)') as Array<{ name: string }>;
        firstConnection.close();

        const secondConnection = openDatabase({ databasePath });
        const migrations = secondConnection
            .prepare('SELECT name FROM schema_migrations ORDER BY name')
            .pluck()
            .all();
        secondConnection.close();

        expect(columns.map(({ name }) => name)).toEqual([
            'id',
            'title',
            'description',
            'due_date',
            'topic',
            'status',
            'archived_at',
            'created_at',
            'updated_at',
        ]);
        expect(migrations).toEqual(['001_create_tasks.sql']);
    });
});