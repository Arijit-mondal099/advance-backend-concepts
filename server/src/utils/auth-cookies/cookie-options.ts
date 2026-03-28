import { CookieOptions } from "express"

// __Host- only makes sense when frontend and backend share the same domain
// const PREFIX = process.env.NODE_ENV === "production" ? "__Host-" : ""

// For Vercel + Render (different domains), it adds no security benefit
const PREFIX = ""

export const ACCESS_COOKIE  = `${PREFIX}access_token`
export const REFRESH_COOKIE = "refresh_token"
export const CSRF_COOKIE    = "csrf_token" 

type SameSite = "lax" | "strict" | "none"

const COOKIE_SECURE = process.env.NODE_ENV === "production"

const validSameSite: SameSite[] = ["lax", "strict", "none"]
const COOKIE_SAME_SITE: SameSite = validSameSite.includes(process.env.COOKIE_SAME_SITE as SameSite)
  ? (process.env.COOKIE_SAME_SITE as SameSite)
  : "lax";

function base (): CookieOptions {
    return {
        secure: COOKIE_SECURE || COOKIE_SAME_SITE === "none",
        sameSite: COOKIE_SAME_SITE,
        path: "/",
    }
}

export const accessTokenOptions  = (maxAge: number): CookieOptions => ({ ...base(), httpOnly: true,  maxAge })
export const refreshTokenOptions = (maxAge: number): CookieOptions => ({ ...base(), httpOnly: true,  maxAge })
export const csrfTokenOptions    = (maxAge: number): CookieOptions => ({ ...base(), httpOnly: false, maxAge })
export const clearCookieOptions  = ()              : CookieOptions => ({ ...base() })
