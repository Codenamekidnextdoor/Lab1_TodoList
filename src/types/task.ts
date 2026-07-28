export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETE'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    topic: string;
    status: TaskStatus;
    archivedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TaskInput {
    title: string;
    description: string;
    dueDate: string;
    topic: string;
    status: TaskStatus;
}

export interface TaskWithOverdue extends Task {
    isOverdue: boolean;
}

export type TaskSort = 'topic' | 'status' | 'dueDate';