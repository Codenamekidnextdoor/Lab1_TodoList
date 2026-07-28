import { getTaskController } from '../../../backend/controller/task-controller';

export function GET(request: Request): Promise<Response> {
    return getTaskController().list(request);
}

export function POST(request: Request): Promise<Response> {
    return getTaskController().create(request);
}