import { z } from 'zod'

export const filtersSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    role: z.enum(["user", "admin"]).optional()
}).strict()

export type FilterData = z.infer<typeof filtersSchema>
