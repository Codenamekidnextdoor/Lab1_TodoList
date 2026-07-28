import type { TaskInput, TaskSort, TaskWithOverdue } from '../../types/task';

interface ListTaskOptions {
    archived: boolean;
    sort: TaskSort;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, init);
    const data: unknown = await response.json();

    if (!response.ok) {
        const message = typeof data === 'object'
            && data !== null
            && 'error' in data
            && typeof data.error === 'string'
            ? data.error
            : 'Task request failed';
        throw new Error(message);
    }

    return data as T;
}

export function listTasks(options: ListTaskOptions): Promise<TaskWithOverdue[]> {
    const query = new URLSearchParams({
        archived: String(options.archived),
        sort: options.sort,
    });
    return request(`/api/tasks?${query}`, undefined);
}

export function createTask(input: TaskInput): Promise<TaskWithOverdue> {
    return request('/api/tasks', jsonRequest('POST', input));
}

export function updateTask(id: number, input: TaskInput): Promise<TaskWithOverdue> {
    return request(`/api/tasks/${id}`, jsonRequest('PATCH', input));
}

export function archiveTask(id: number): Promise<TaskWithOverdue> {
    return request(`/api/tasks/${id}`, { method: 'POST' });
}

function jsonRequest(method: string, input: TaskInput): RequestInit {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    };
}