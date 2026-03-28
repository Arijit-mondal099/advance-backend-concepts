import jwt from "jsonwebtoken"
import { randomUUID, randomBytes } from "node:crypto"
import { StringValue } from "ms"


/**
 * @method createAccessToken (userId, role): string
 * Signs a short-lived access token carrying userId and role
 */

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
if (!ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET is not set")
const ACCESS_TOKEN_EXPIRY = (process.env.ACCESS_TOKEN_EXPIRY ?? "15m") as StringValue

export function createAccessToken (userId: string, role: "user" | "admin"): string {
    return jwt.sign(
        { userId, role, type: "access", jti: randomUUID() },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    )
}


/**
 * @method createRefreshToken (userId): string
 * Signs a long-lived refresh token, for revalidate access token
 */

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
if (!REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is not set")
const REFRESH_TOKEN_EXPIRY = (process.env.REFRESH_TOKEN_EXPIRY ?? "7d") as StringValue

export function createRefreshToken (userId: string): string {
    return jwt.sign(
        { userId, type: "refresh", jti: randomUUID() },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    )
}


/**
 * @method createCsrfToken (): string
 * CSRF token verify user requests
 */

export function createCsrfToken(): string {
    return randomBytes(32).toString("hex")
}
