import { 
    ACCESS_COOKIE, accessTokenOptions, 
    CSRF_COOKIE, csrfTokenOptions, 
    REFRESH_COOKIE, refreshTokenOptions,
    clearCookieOptions,
} from "./cookie-options";
import { createAccessToken, createCsrfToken, createRefreshToken } from "./token";
import { type Response } from "express"

type Params = {
    res: Response,
    user: { userId: string, role: "user" | "admin" }
}

export function setAuthCookies ({ res, user }: Params) {
    const accessToken  = createAccessToken(user.userId, user.role)
    const refreshToken = createRefreshToken(user.userId)
    const csrfToken    = createCsrfToken()

    const ACCESS_TOKEN_MAX_AGE =  15 * 60 * 1000
    const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

    res.cookie(ACCESS_COOKIE,  accessToken,  accessTokenOptions(ACCESS_TOKEN_MAX_AGE))
    res.cookie(REFRESH_COOKIE, refreshToken, refreshTokenOptions(REFRESH_TOKEN_MAX_AGE))
    res.cookie(CSRF_COOKIE,    csrfToken,    csrfTokenOptions(REFRESH_TOKEN_MAX_AGE))
}

export function clearAuthCookies (res: Response) {
    res.clearCookie(ACCESS_COOKIE,  { ...clearCookieOptions() })
    res.clearCookie(REFRESH_COOKIE, { ...clearCookieOptions() })
    res.clearCookie(CSRF_COOKIE,    { ...clearCookieOptions() })
}
