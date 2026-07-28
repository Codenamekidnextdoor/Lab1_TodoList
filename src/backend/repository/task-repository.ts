import type { SqliteDatabase } from '../database';
import type { Task, TaskInput, TaskSort, TaskStatus } from '../../types/task';

const SORT_COLUMNS: Record<TaskSort, string> = {
    topic: 'topic',
    status: 'status',
    dueDate: 'due_date',
};

interface ListOptions {
    archived: boolean;
    sort: TaskSort;
}

interface TaskRow {
    id: number;
    title: string;
    description: string;
    due_date: string;
    topic: string;
    status: TaskStatus;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
}

function mapTask(row: TaskRow): Task {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        dueDate: row.due_date,
        topic: row.topic,
        status: row.status,
        archivedAt: row.archived_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export class TaskRepository {
    constructor(private readonly database: SqliteDatabase) {}

    create(input: TaskInput): Task {
        const result = this.database.prepare(`
            INSERT INTO tasks (title, description, due_date, topic, status)
            VALUES (@title, @description, @dueDate, @topic, @status)
        `).run(input);

        return this.findById(Number(result.lastInsertRowid)) as Task;
    }

    findById(id: number): Task | null {
        const row = this.database
            .prepare('SELECT * FROM tasks WHERE id = ?')
            .get(id) as TaskRow | undefined;

        return row ? mapTask(row) : null;
    }

    list(options: ListOptions): Task[] {
        const archiveFilter = options.archived
            ? 'archived_at IS NOT NULL'
            : 'archived_at IS NULL';
        const rows = this.database
            .prepare(`SELECT * FROM tasks WHERE ${archiveFilter} ORDER BY ${SORT_COLUMNS[options.sort]} ASC, id ASC`)
            .all() as TaskRow[];

        return rows.map(mapTask);
    }

    archive(id: number, archivedAt: string): Task | null {
        const result = this.database
            .prepare(`
                UPDATE tasks
                SET archived_at = ?, updated_at = ?
                WHERE id = ? AND archived_at IS NULL
            `)
            .run(archivedAt, archivedAt, id);

        return result.changes === 0 ? null : this.findById(id);
    }

    update(id: number, input: TaskInput, updatedAt: string): Task | null {
        const result = this.database.prepare(`
            UPDATE tasks
            SET title = @title,
                description = @description,
                due_date = @dueDate,
                topic = @topic,
                status = @status,
                updated_at = @updatedAt
            WHERE id = @id AND archived_at IS NULL
        `).run({ ...input, id, updatedAt });

        return result.changes === 0 ? null : this.findById(id);
    }
}