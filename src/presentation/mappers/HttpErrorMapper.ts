export class HttpErrorMapper {
    static getStatusCode(error: unknown): number {
        if (error instanceof Error && 'statusCode' in error) {
            const customError = error as { statusCode: number };
            return customError.statusCode;
        }
        return 500;
    }

    static getMessage(error: unknown): string {
        if (error instanceof Error && error.message.trim().length > 0) {
            return error.message;
        }

        return "Internal server error";
    }
}