import { ACCESS_COOKIE } from "../utils/auth-cookies/cookie-options";
import { async_handler } from "../utils/async-handler";
import { error } from "../utils/api-response";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { EXTRACT_SAFE_USER_SELECT_OPTIONS } from "../lib/constants";
import { CookiePayload } from "../types/cookie.type";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


/**
 * @middleare User authentication validdation
 * @cookie    ACCESS_TOKEN
 */

export const authValidation = async_handler(async (req, res, next) => {
  const accessToken = req.cookies?.[ACCESS_COOKIE];
  if (!accessToken) return error(res, "Unauthorized request access token not provided", 401);

  const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET!) as CookiePayload;

  if (decodedToken.type !== "access") return error(res, "Unauthorized request invalid access token", 401);

  const user = await User.findById(decodedToken.userId).select(EXTRACT_SAFE_USER_SELECT_OPTIONS);
  if (!user) return error(res, "Unauthorized request invalid access token", 401);

  req.user = { userId: String(user._id), email: user.email, role: user.role };
  return next();
});


/**
 * @middleare Role base access controll routes
 */

export const roleValidation = (role = ["admin"]) => {
    return async_handler(async (req, res, next) => {
        if (req.user && role.includes(req.user.role)) return next()
        return error(res, "Forbidden or Unauthorized to access", 403)
    })
}
