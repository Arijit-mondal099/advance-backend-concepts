import { type Request, Response, NextFunction } from "express";
import { z } from "zod";
import { error } from "./api-response";

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) 
    return error(res, "Invalid request body", 400, result.error.issues.map((issue) => issue.message))

    req.body = result.data;
    return next();
  };
}


/**
 * RATE LIMITING UTILS
 */

export type User = {
  attempts   : number,
  lockUntil? : Date | null,
  save       : () => Promise<unknown>
}

export async function registerFailedAttemps (user: User): Promise<void> {
  const NEXT_ATTEMPS = user.attempts + 1
  const MAX_ATTEMPS  = 5
  const LOCK_UNTIL   = 15 * 60 * 1000

  if (NEXT_ATTEMPS >= MAX_ATTEMPS) {
    user.attempts    = 0
    user.lockUntil   = new Date(Date.now() + LOCK_UNTIL)
  } else {
    user.attempts    = NEXT_ATTEMPS
  }

  await user.save()
}

export async function clearFaildAttemps (user: User): Promise<void> {
  if (user.attempts === 0 && !user.lockUntil) return

  user.attempts   = 0
  user.lockUntil = null
  await user.save()
}

export async function isAccountLocked (user: { lockUntil? : Date | null }): Promise<boolean> {
  if (!user.lockUntil) return false
  return user.lockUntil.getTime() > Date.now();
}
