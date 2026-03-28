import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { corsOptions } from "./lib/cors-options";
import { authLimiter, apiLimiter } from "./lib/rate-limit-options";

// middlewares
import { errorHandler, notFound } from "./middlewares/error.middleware";

// routes
import authRouter from "./routes/auth.route"
import adminRouter from "./routes/admin.route"

const app: Application = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet());
app.use(corsOptions);
app.use("/api/v1/auth", authLimiter);
app.use("/api/v1",      apiLimiter);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is working...",
  });
});

app.use("/api/v1/auth",  authRouter);
app.use("/api/v1/admin", adminRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
