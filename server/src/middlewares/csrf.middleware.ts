import { type NextFunction, Request, Response } from "express"
import { CSRF_COOKIE } from "../utils/auth-cookies/cookie-options"
import { timingSafeEqual } from "node:crypto"

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"]

function safeCompare (a: string, b: string): boolean {
    if (a.length !== b.length) return false
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
    if (SAFE_METHODS.includes(req.method)) return next()

    const csrfCookie = req.cookies?.[CSRF_COOKIE]
    const csrfHeader = req.header("x-csrf-token")

    if (!csrfCookie || !csrfHeader || !safeCompare(csrfCookie, csrfHeader)) {
        return res.status(403).json({
            success: false,
            message: "Invalid CSRF token"
        })
    }

    return next()
}
