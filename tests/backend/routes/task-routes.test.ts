import { beforeAll, describe, expect, it } from 'vitest';

beforeAll(() => {
    process.env.DATABASE_PATH = ':memory:';
});

describe('task route handlers', () => {
    it('creates, lists, updates, and archives through thin adapters', async () => {
        const collectionRoute = await import('../../../src/app/api/tasks/route');
        const itemRoute = await import('../../../src/app/api/tasks/[id]/route');

        const createResponse = await collectionRoute.POST(new Request('http://localhost/api/tasks', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                title: 'Route task',
                description: '',
                dueDate: '2026-08-04',
                topic: 'University',
                status: 'TODO',
            }),
        }));
        const created = await createResponse.json() as { id: number };
        const context = { params: Promise.resolve({ id: String(created.id) }) };

        const listResponse = await collectionRoute.GET(
            new Request('http://localhost/api/tasks?archived=false&sort=dueDate'),
        );
        const updateResponse = await itemRoute.PATCH(new Request(
            `http://localhost/api/tasks/${created.id}`,
            {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    title: 'Updated route task',
                    description: '',
                    dueDate: '2026-08-03',
                    topic: 'University',
                    status: 'IN_PROGRESS',
                }),
            },
        ), context);
        const archiveResponse = await itemRoute.POST(
            new Request(`http://localhost/api/tasks/${created.id}`, { method: 'POST' }),
            context,
        );

        expect(createResponse.status).toBe(201);
        expect(await listResponse.json()).toHaveLength(1);
        expect(await updateResponse.json()).toMatchObject({ title: 'Updated route task' });
        expect(archiveResponse.status).toBe(200);
    });
});