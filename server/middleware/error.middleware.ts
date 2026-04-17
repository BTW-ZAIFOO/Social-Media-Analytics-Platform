import type { Request, Response, NextFunction } from "express";

function errorHandler(
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  console.error("[Error]", err);

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export default errorHandler;
