import mongoose, { Document } from "mongoose";

export interface UserType extends Document {
    name     : string;
    email    : string;
    password : string;
    role     : "user" | "admin";
    attempts  : number;
    lockUntil: Date | null;
}

const userSchema: mongoose.Schema<UserType> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        attempts: {
            type   : Number,
            default: 0
        },
        lockUntil: {
            type   : Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

export const User = (mongoose.models.User as mongoose.Model<UserType>) || 
                    mongoose.model<UserType>("User", userSchema)
