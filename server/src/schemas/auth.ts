import { z } from "zod"

export const signupSchema = z.object({
    name: z.string().min(4, { message: "Name must be 4 characters long" }).max(30, "Name must be under 30 characters"),
    email: z.email(),
    password: z.string().min(6, { message: "Password must be 6 characters long" }).max(16, { message: "Password must be under 16 characters" })
}).strict()

export const signinSchema = z.object({
    email: z.string(),
    password: z.string()
}).strict()

export type SignupBody = z.infer<typeof signupSchema>
export type SigninBody = z.infer<typeof signinSchema>
