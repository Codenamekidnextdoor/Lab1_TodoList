import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { openDatabase, type SqliteDatabase } from '../../../src/backend/database';
import { TaskRepository } from '../../../src/backend/repository/task-repository';
import { TaskService } from '../../../src/backend/service/task-service';
import { BadRequestError, NotFoundError } from '../../../src/backend/utils/error';

describe('TaskService', () => {
    let database: SqliteDatabase;
    let service: TaskService;

    beforeEach(() => {
        database = openDatabase({ databasePath: ':memory:' });
        service = new TaskService(
            new TaskRepository(database),
            () => new Date('2026-07-28T12:00:00.000Z'),
        );
    });

    afterEach(() => {
        database.close();
    });

    it('rejects a blank task title', () => {
        expect(() => service.createTask({
            title: '   ',
            description: '',
            dueDate: '2026-08-04',
            topic: 'University',
            status: 'TODO',
        })).toThrow(BadRequestError);
    });

    it('derives overdue without storing it as a status', () => {
        service.createTask({
            title: 'Past task',
            description: '',
            dueDate: '2026-07-27',
            topic: 'Personal',
            status: 'TODO',
        });
        service.createTask({
            title: 'Completed task',
            description: '',
            dueDate: '2026-07-27',
            topic: 'University',
            status: 'COMPLETE',
        });

        expect(service.listTasks({ archived: false, sort: 'dueDate' })).toMatchObject([
            { title: 'Past task', isOverdue: true },
            { title: 'Completed task', isOverdue: false },
        ]);
    });

    it('edits and archives an existing task', () => {
        const created = service.createTask({
            title: 'Draft',
            description: '',
            dueDate: '2026-08-04',
            topic: 'University',
            status: 'TODO',
        });

        const updated = service.updateTask(created.id, {
            title: 'Final',
            description: 'Ready',
            dueDate: '2026-08-03',
            topic: 'University',
            status: 'IN_PROGRESS',
        });
        const archived = service.archiveTask(created.id);

        expect(updated).toMatchObject({ id: created.id, title: 'Final' });
        expect(archived).toMatchObject({ id: created.id, archivedAt: '2026-07-28T12:00:00.000Z' });
        expect(service.listTasks({ archived: false, sort: 'dueDate' })).toEqual([]);
        expect(() => service.updateTask(created.id, {
            title: 'Too late',
            description: '',
            dueDate: '2026-08-03',
            topic: 'University',
            status: 'TODO',
        })).toThrow(NotFoundError);
    });
});