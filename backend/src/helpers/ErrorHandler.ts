class ErrorHandler {
    public handleError(error: unknown): { status: number; message: string } {
        const unexpectedError = {
            status: 500,
            message: "Something unexpected happened",
        };

        if (error instanceof Error) {
            return { status: 400, message: error.message };
        }

        return unexpectedError;
    }
}

export default new ErrorHandler();
