import { type Response } from "express";

export function success<T>(
  res: Response,
  message = "Success",
  statusCode = 200,
  data?: T
) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function error<T>(
  res: Response,
  message = "Internal Server Error",
  statusCode = 500,
  errors?: T
) {
  return res.status(statusCode).json({ success: false, message, errors });
}
