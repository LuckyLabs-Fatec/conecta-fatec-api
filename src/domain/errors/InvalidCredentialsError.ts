export class InvalidCredentialsError extends Error {
    readonly code = 'INVALID_CREDENTIALS';
    readonly statusCode = 401;
    
    constructor(message = 'Invalid credentials') {
        super(message);
        this.name = 'InvalidCredentialsError';
    }
}