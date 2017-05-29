const http = require('http');

module.exports = class HttpError extends Error {
    constructor (status, message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;

        this.status = status;
        this.message = message || http.STATUS_CODES[status] || "Error";
    }
};