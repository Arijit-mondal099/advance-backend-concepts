import { type Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: unknown = null;

    if (err instanceof jwt.TokenExpiredError) { // jwt
        statusCode = 401;
        message = "Access token expired";
    } else if (err instanceof jwt.JsonWebTokenError) {
        statusCode = 401;
        message = "Invalid access token";
    } else if (err instanceof Error && err.name === "ValidationError") { // mongodb
        statusCode = 400;
        message = "Validation Error";
        errors = (err as any).errors;
    } else if (err instanceof Error && (err as any).code === 11000) {
        statusCode = 409;
        message = "Duplicate key error";
        errors = (err as any).keyValue;
    }

    res.status(statusCode).json({ success: false, status: "error", message, errors });
};
