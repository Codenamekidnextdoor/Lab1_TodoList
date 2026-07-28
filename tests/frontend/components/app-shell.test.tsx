// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppShell } from '../../../src/frontend/components/layout/AppShell';
import * as taskApi from '../../../src/frontend/lib/task-api';

vi.mock('../../../src/frontend/lib/task-api');

const createdTask = {
    id: 1,
    title: 'Submit lab',
    description: 'Finish the implementation',
    dueDate: '2026-08-04',
    topic: 'University',
    status: 'TODO' as const,
    archivedAt: null,
    createdAt: '2026-07-28T12:00:00.000Z',
    updatedAt: '2026-07-28T12:00:00.000Z',
    isOverdue: false,
};

describe('AppShell', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(taskApi.listTasks).mockResolvedValue([]);
        vi.mocked(taskApi.createTask).mockResolvedValue(createdTask);
        vi.mocked(taskApi.updateTask).mockResolvedValue({
            ...createdTask,
            title: 'Submit final lab',
        });
        vi.mocked(taskApi.archiveTask).mockResolvedValue({
            ...createdTask,
            archivedAt: '2026-07-28T14:00:00.000Z',
        });
    });

    it('loads active tasks and adds a newly created task', async () => {
        render(<AppShell />);

        expect(await screen.findByText('No active tasks')).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Submit lab' } });
        fireEvent.change(screen.getByLabelText('Description'), {
            target: { value: 'Finish the implementation' },
        });
        fireEvent.change(screen.getByLabelText('Due date'), {
            target: { value: '2026-08-04' },
        });
        fireEvent.change(screen.getByLabelText('Topic'), { target: { value: 'University' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create task' }));

        await waitFor(() => expect(taskApi.createTask).toHaveBeenCalled());
        expect(await screen.findByRole('heading', { name: 'Submit lab' })).toBeTruthy();
        expect(taskApi.listTasks).toHaveBeenCalledWith({ archived: false, sort: 'dueDate' });
    });

    it('edits and archives an active task', async () => {
        vi.mocked(taskApi.listTasks).mockResolvedValue([createdTask]);
        render(<AppShell />);

        expect(await screen.findByRole('heading', { name: 'Submit lab' })).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: 'Edit Submit lab' }));
        fireEvent.change(screen.getByLabelText('Title'), {
            target: { value: 'Submit final lab' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

        await waitFor(() => expect(taskApi.updateTask).toHaveBeenCalledWith(
            1,
            expect.objectContaining({ title: 'Submit final lab' }),
        ));
        expect(await screen.findByRole('heading', { name: 'Submit final lab' })).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: 'Archive Submit final lab' }));
        await waitFor(() => expect(taskApi.archiveTask).toHaveBeenCalledWith(1));
        expect(screen.getByText('No active tasks')).toBeTruthy();
    });

    it('switches views, applies sorting, and identifies overdue tasks', async () => {
        vi.mocked(taskApi.listTasks)
            .mockResolvedValueOnce([{ ...createdTask, isOverdue: true }])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([{ ...createdTask, isOverdue: true }]);
        render(<AppShell />);

        expect(await screen.findByText('Overdue')).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: 'Archived' }));
        await waitFor(() => expect(taskApi.listTasks).toHaveBeenCalledWith({
            archived: true,
            sort: 'dueDate',
        }));
        expect(await screen.findByText('No archived tasks')).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: 'Active' }));
        fireEvent.change(screen.getByLabelText('Sort tasks'), { target: { value: 'topic' } });
        await waitFor(() => expect(taskApi.listTasks).toHaveBeenCalledWith({
            archived: false,
            sort: 'topic',
        }));
    });
});