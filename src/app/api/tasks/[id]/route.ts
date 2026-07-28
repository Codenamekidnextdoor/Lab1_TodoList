import { getTaskController } from '../../../../backend/controller/task-controller';

interface TaskRouteContext {
    params: Promise<{ id: string }>;
}

export async function PATCH(
    request: Request,
    { params }: TaskRouteContext,
): Promise<Response> {
    const { id } = await params;
    return getTaskController().update(request, id);
}

export async function POST(
    _request: Request,
    { params }: TaskRouteContext,
): Promise<Response> {
    const { id } = await params;
    return getTaskController().archive(id);
}