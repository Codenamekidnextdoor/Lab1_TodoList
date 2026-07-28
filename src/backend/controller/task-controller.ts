import type { TaskInput, TaskSort } from '../../types/task';
import { getDatabase } from '../database';
import { TaskRepository } from '../repository/task-repository';
import { TaskService } from '../service/task-service';
import { BadRequestError, isAppError } from '../utils/error';
import { logger } from '../utils/logger';

const TASK_SORTS = ['topic', 'status', 'dueDate'] as const;

export class TaskController {
    constructor(private readonly service: TaskService) {}

    async create(request: Request): Promise<Response> {
        return this.respond(async () => {
            const input = await request.json() as TaskInput;
            return Response.json(this.service.createTask(input), { status: 201 });
        });
    }

    async list(request: Request): Promise<Response> {
        return this.respond(() => {
            const search = new URL(request.url).searchParams;
            const archived = search.get('archived') ?? 'false';
            const sort = search.get('sort') ?? 'dueDate';

            if (archived !== 'true' && archived !== 'false') {
                throw new BadRequestError('Archived must be true or false');
            }
            if (!TASK_SORTS.includes(sort as TaskSort)) {
                throw new BadRequestError('Invalid task sort');
            }

            return Response.json(this.service.listTasks({
                archived: archived === 'true',
                sort: sort as TaskSort,
            }));
        });
    }

    async update(request: Request, idValue: string): Promise<Response> {
        return this.respond(async () => {
            const id = this.parseId(idValue);
            const input = await request.json() as TaskInput;
            return Response.json(this.service.updateTask(id, input));
        });
    }

    async archive(idValue: string): Promise<Response> {
        return this.respond(() => {
            const id = this.parseId(idValue);
            return Response.json(this.service.archiveTask(id));
        });
    }

    private parseId(value: string): number {
        const id = Number(value);
        if (!Number.isInteger(id) || id < 1) {
            throw new BadRequestError('Task ID must be a positive integer');
        }
        return id;
    }

    private async respond(action: () => Response | Promise<Response>): Promise<Response> {
        try {
            return await action();
        } catch (error) {
            if (isAppError(error)) {
                return Response.json({ error: error.message }, { status: error.statusCode });
            }

            if (error instanceof SyntaxError) {
                return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
            }

            logger.error('Unhandled task request error', {
                error: error instanceof Error ? error.message : String(error),
            });
            return Response.json({ error: 'Internal server error' }, { status: 500 });
        }
    }
}

let taskController: TaskController | undefined;

export function getTaskController(): TaskController {
    taskController ??= new TaskController(
        new TaskService(new TaskRepository(getDatabase())),
    );
    return taskController;
}