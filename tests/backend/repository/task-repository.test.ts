import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { openDatabase, type SqliteDatabase } from '../../../src/backend/database';
import { TaskRepository } from '../../../src/backend/repository/task-repository';

describe('TaskRepository', () => {
    let database: SqliteDatabase;
    let repository: TaskRepository;

    beforeEach(() => {
        database = openDatabase({ databasePath: ':memory:' });
        repository = new TaskRepository(database);
    });

    afterEach(() => {
        database.close();
    });

    it('creates and retrieves a task', () => {
        const created = repository.create({
            title: 'Submit lab',
            description: 'Push the final implementation',
            dueDate: '2026-08-04',
            topic: 'University',
            status: 'TODO',
        });

        expect(created).toMatchObject({
            id: 1,
            title: 'Submit lab',
            description: 'Push the final implementation',
            dueDate: '2026-08-04',
            topic: 'University',
            status: 'TODO',
            archivedAt: null,
        });
        expect(repository.findById(created.id)).toEqual(created);
    });

    it('sorts active tasks and lists archived tasks separately', () => {
        const laterTask = repository.create({
            title: 'Later task',
            description: '',
            dueDate: '2026-08-04',
            topic: 'University',
            status: 'TODO',
        });
        repository.create({
            title: 'Earlier task',
            description: '',
            dueDate: '2026-08-01',
            topic: 'Personal',
            status: 'IN_PROGRESS',
        });

        repository.archive(laterTask.id, '2026-07-28T12:00:00.000Z');

        expect(repository.list({ archived: false, sort: 'dueDate' }).map(({ title }) => title))
            .toEqual(['Earlier task']);
        expect(repository.list({ archived: true, sort: 'dueDate' }).map(({ title }) => title))
            .toEqual(['Later task']);
    });

    it('updates a task without changing its identity', () => {
        const created = repository.create({
            title: 'Draft title',
            description: '',
            dueDate: '2026-08-04',
            topic: 'University',
            status: 'TODO',
        });

        const updated = repository.update(created.id, {
            title: 'Final title',
            description: 'Ready to submit',
            dueDate: '2026-08-03',
            topic: 'Coursework',
            status: 'COMPLETE',
        }, '2026-07-28T13:00:00.000Z');

        expect(updated).toMatchObject({
            id: created.id,
            title: 'Final title',
            description: 'Ready to submit',
            dueDate: '2026-08-03',
            topic: 'Coursework',
            status: 'COMPLETE',
            updatedAt: '2026-07-28T13:00:00.000Z',
        });
    });
});