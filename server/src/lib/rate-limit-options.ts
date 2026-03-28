import { rateLimit } from "express-rate-limit"

export const apiLimiter = rateLimit({
    windowMs       : 15 * 60 * 1000, // 15m of per IP window
    limit          : 100,            // Limit each IP to 100 requests per window
    standardHeaders: true,           // Return rate limit info in RateLimit-* headers
    legacyHeaders  : false,          // Disable the X-RateLimit-* headers
    skip           : (req) => req.originalUrl.startsWith("/api/v1/auth/") || req.originalUrl.startsWith("/api/v1/health"),
    message        : { error: "Too many requests, slow down!" }
})

export const authLimiter = rateLimit({
    windowMs       : 15 * 60 * 1000, // 15m of per IP window
    limit          : 20,             // Limit each IP to 10 requests per window
    standardHeaders: true,           // Return rate limit info in RateLimit-* headers
    legacyHeaders  : false,          // Disable the X-RateLimit-* headers
    message        : { error: "Too many requests, slow down!" }
})
