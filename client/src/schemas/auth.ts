import { z } from "zod"

export const signupSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6, "Password must be 6 characters long").max(16, "Password must be 16 characters")
}).strict()

export const signinSchema = z.object({
    email: z.email(),
    password: z.string()
}).strict()

export type SignUpType = z.infer<typeof signupSchema>
export type SignInType = z.infer<typeof signinSchema>
