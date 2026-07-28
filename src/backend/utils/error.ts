export class AppError extends Error {
    constructor(
        
        public message: string,
        public statusCode: number,
        public isOperational = true

    ){

        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);

    }
}

export class NotFoundError extends AppError{
    constructor(msg = 'Not Found'){
        super(msg, 404);
    }
}

export class ConflictError extends AppError{
    constructor(msg = 'Conflict'){
        super(msg, 409)
    }
}

export class BadRequestError extends AppError {
    constructor(msg = 'Bad request'){
        super(msg, 400);
    }
}