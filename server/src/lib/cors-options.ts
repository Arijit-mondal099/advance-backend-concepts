import cors from "cors";

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(",").map(o => o.trim()) ?? [];

export const corsOptions = cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-csrf-token"],
    exposedHeaders: ["X-Total-Count", "X-RateLimit-Remaining"],
    maxAge: 86400, 
    optionsSuccessStatus: 200,     
});
