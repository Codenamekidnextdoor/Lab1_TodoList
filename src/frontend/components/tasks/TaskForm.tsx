'use client';

import type { FormEvent } from 'react';

import { TASK_STATUSES, type TaskInput, type TaskStatus } from '../../../types/task';
import { Button } from '../ui/Button';

interface TaskFormProps {
    initialValues?: TaskInput;
    onSubmit: (input: TaskInput) => void;
    submitLabel: string;
}

const EMPTY_TASK: TaskInput = {
    title: '',
    description: '',
    dueDate: '',
    topic: '',
    status: 'TODO',
};

export function TaskForm({ initialValues = EMPTY_TASK, onSubmit, submitLabel }: TaskFormProps) {
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        onSubmit({
            title: String(form.get('title') ?? ''),
            description: String(form.get('description') ?? ''),
            dueDate: String(form.get('dueDate') ?? ''),
            topic: String(form.get('topic') ?? ''),
            status: String(form.get('status') ?? 'TODO') as TaskStatus,
        });
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <label>
                <span>Title</span>
                <input name="title" defaultValue={initialValues.title} required />
            </label>
            <label>
                <span>Description</span>
                <textarea name="description" defaultValue={initialValues.description} />
            </label>
            <label>
                <span>Due date</span>
                <input name="dueDate" type="date" defaultValue={initialValues.dueDate} required />
            </label>
            <label>
                <span>Topic</span>
                <input name="topic" defaultValue={initialValues.topic} required />
            </label>
            <label>
                <span>Status</span>
                <select name="status" defaultValue={initialValues.status}>
                    {TASK_STATUSES.map((status) => (
                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                </select>
            </label>
            <Button type="submit">{submitLabel}</Button>
        </form>
    );
}