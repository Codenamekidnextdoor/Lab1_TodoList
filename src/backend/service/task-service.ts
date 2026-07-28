import { TASK_STATUSES, type TaskInput, type TaskSort, type TaskWithOverdue } from '../../types/task';
import { TaskRepository } from '../repository/task-repository';
import { BadRequestError, NotFoundError } from '../utils/error';

interface ListTaskOptions {
    archived: boolean;
    sort: TaskSort;
}

function localDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export class TaskService {
    constructor(
        private readonly repository: TaskRepository,
        private readonly now: () => Date = () => new Date(),
    ) {}

    createTask(input: TaskInput): TaskWithOverdue {
        const validated = this.validateInput(input);
        return this.withOverdue(this.repository.create(validated));
    }

    listTasks(options: ListTaskOptions): TaskWithOverdue[] {
        return this.repository.list(options).map((task) => this.withOverdue(task));
    }

    updateTask(id: number, input: TaskInput): TaskWithOverdue {
        const task = this.repository.update(
            id,
            this.validateInput(input),
            this.now().toISOString(),
        );

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        return this.withOverdue(task);
    }

    archiveTask(id: number): TaskWithOverdue {
        const task = this.repository.archive(id, this.now().toISOString());

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        return this.withOverdue(task);
    }

    private validateInput(input: TaskInput): TaskInput {
        if (typeof input?.title !== 'string') {
            throw new BadRequestError('Title is required');
        }
        if (typeof input.description !== 'string') {
            throw new BadRequestError('Description must be text');
        }
        if (typeof input.topic !== 'string') {
            throw new BadRequestError('Topic is required');
        }
        if (typeof input.dueDate !== 'string') {
            throw new BadRequestError('Due date must use YYYY-MM-DD');
        }

        const title = input.title.trim();
        const topic = input.topic.trim();

        if (!title) {
            throw new BadRequestError('Title is required');
        }
        if (!topic) {
            throw new BadRequestError('Topic is required');
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) {
            throw new BadRequestError('Due date must use YYYY-MM-DD');
        }
        if (!TASK_STATUSES.includes(input.status)) {
            throw new BadRequestError('Invalid task status');
        }

        return { ...input, title, topic };
    }

    private withOverdue(task: ReturnType<TaskRepository['create']>): TaskWithOverdue {
        return {
            ...task,
            isOverdue:
                task.archivedAt === null
                && task.status !== 'COMPLETE'
                && task.dueDate < localDate(this.now()),
        };
    }
}