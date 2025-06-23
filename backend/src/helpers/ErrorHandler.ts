class ErrorHandler {
    public handleError(error: unknown): { status: number; message: string } {
        if (error instanceof Error) {
            return { status: 400, message: error.message };
        }

        return { status: 500, message: "Something unexpected happened" };
    }
}

export default new ErrorHandler();
