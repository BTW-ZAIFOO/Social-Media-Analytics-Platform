"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    console.error("[Error]", err);
    res.status(statusCode).json({
        success: false,
        message,
    });
}
exports.default = errorHandler;
