
export type CookiePayload = {
    userId: string,
    email : string,
    role? : "user" | "admin",
    type  : "access" | "refresh"
}
