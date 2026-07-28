// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TaskForm } from '../../../src/frontend/components/tasks/TaskForm';

describe('TaskForm', () => {
    it('submits every required task field', () => {
        const onSubmit = vi.fn();

        render(<TaskForm onSubmit={onSubmit} submitLabel="Create task" />);

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Submit lab' } });
        fireEvent.change(screen.getByLabelText('Description'), {
            target: { value: 'Finish the implementation' },
        });
        fireEvent.change(screen.getByLabelText('Due date'), {
            target: { value: '2026-08-04' },
        });
        fireEvent.change(screen.getByLabelText('Topic'), { target: { value: 'University' } });
        fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'IN_PROGRESS' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create task' }));

        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Submit lab',
            description: 'Finish the implementation',
            dueDate: '2026-08-04',
            topic: 'University',
            status: 'IN_PROGRESS',
        });
    });
});