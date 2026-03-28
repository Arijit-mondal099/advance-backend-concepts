import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export default async function dbConnection() {
    if (!MONGODB_URI) {
        console.error("DB connection string not provided error");
        process.exit(1);
    }

    try {
        const res = await mongoose.connect(MONGODB_URI);
        console.log("DB connected -> ", res.connection.host);
    } catch (error: unknown) {
        console.error("DB connection error :: ", error);
        process.exit(1)
    }
}
