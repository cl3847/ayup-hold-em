class UnknownCardError extends Error {
    code: string;

    constructor(cardCode: string) {
        super(`Unknown card code found: ${cardCode}`);
        this.code = cardCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnknownCardError);
        }
        Object.setPrototypeOf(this, UnknownCardError.prototype);
        this.name = "UnknownCardError";
    }
}

export default UnknownCardError;