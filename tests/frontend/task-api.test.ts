import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTask, listTasks } from '../../src/frontend/lib/task-api';

describe('task API client', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('encodes list options and sends task JSON', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Title is required' }), {
                status: 400,
            }));
        vi.stubGlobal('fetch', fetchMock);

        await listTasks({ archived: true, sort: 'status' });
        await expect(createTask({
            title: '',
            description: '',
            dueDate: '2026-08-04',
            topic: 'University',
            status: 'TODO',
        })).rejects.toThrow('Title is required');

        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            '/api/tasks?archived=true&sort=status',
            undefined,
        );
        expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: '',
                description: '',
                dueDate: '2026-08-04',
                topic: 'University',
                status: 'TODO',
            }),
        });
    });
});