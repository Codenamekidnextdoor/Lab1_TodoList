import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TaskController } from '../../../src/backend/controller/task-controller';
import { openDatabase, type SqliteDatabase } from '../../../src/backend/database';
import { TaskRepository } from '../../../src/backend/repository/task-repository';
import { TaskService } from '../../../src/backend/service/task-service';

describe('TaskController', () => {
    let controller: TaskController;
    let database: SqliteDatabase;

    beforeEach(() => {
        database = openDatabase({ databasePath: ':memory:' });
        controller = new TaskController(new TaskService(new TaskRepository(database)));
    });

    afterEach(() => {
        database.close();
    });

    it('creates and lists tasks through HTTP requests', async () => {
        const createResponse = await controller.create(new Request('http://localhost/api/tasks', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                title: 'Controller task',
                description: '',
                dueDate: '2026-08-04',
                topic: 'University',
                status: 'TODO',
            }),
        }));
        const listResponse = await controller.list(
            new Request('http://localhost/api/tasks?archived=false&sort=dueDate'),
        );

        expect(createResponse.status).toBe(201);
        expect(await listResponse.json()).toMatchObject([
            { title: 'Controller task', status: 'TODO' },
        ]);
    });

    it('returns a typed error response for invalid input', async () => {
        const response = await controller.create(new Request('http://localhost/api/tasks', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                description: '',
                dueDate: '2026-08-04',
                topic: 'University',
                status: 'TODO',
            }),
        }));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'Title is required' });
    });

    it('updates and archives a task through item requests', async () => {
        const created = await controller.create(new Request('http://localhost/api/tasks', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                title: 'Draft',
                description: '',
                dueDate: '2026-08-04',
                topic: 'University',
                status: 'TODO',
            }),
        }));
        const task = await created.json() as { id: number };

        const updateResponse = await controller.update(
            new Request(`http://localhost/api/tasks/${task.id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    title: 'Final',
                    description: 'Ready',
                    dueDate: '2026-08-03',
                    topic: 'University',
                    status: 'IN_PROGRESS',
                }),
            }),
            String(task.id),
        );
        const archiveResponse = await controller.archive(String(task.id));

        expect(updateResponse.status).toBe(200);
        expect(await updateResponse.json()).toMatchObject({ id: task.id, title: 'Final' });
        expect(archiveResponse.status).toBe(200);
        expect(await archiveResponse.json()).toMatchObject({ id: task.id });
        expect((await controller.archive('not-a-number')).status).toBe(400);
    });
});