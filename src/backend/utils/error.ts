export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public readonly isOperational = true,
        options?: ErrorOptions,
    ) {
        super(message, options);
        this.name = this.constructor.name;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found', options?: ErrorOptions) {
        super(message, 404, true, options);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict', options?: ErrorOptions) {
        super(message, 409, true, options);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad request', options?: ErrorOptions) {
        super(message, 400, true, options);
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}