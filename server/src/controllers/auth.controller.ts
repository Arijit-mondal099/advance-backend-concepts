import { User } from "../models/user.model";
import { error, success } from "../utils/api-response";
import { async_handler } from "../utils/async-handler";
import bcrypt from "bcryptjs";
import { clearAuthCookies, setAuthCookies } from "../utils/auth-cookies/cookie";
import { EXTRACT_SAFE_USER_SELECT_OPTIONS } from "../lib/constants";
import { CSRF_COOKIE, REFRESH_COOKIE } from "../utils/auth-cookies/cookie-options";
import jwt from "jsonwebtoken";
import { CookiePayload } from "../types/cookie.type";
import { SigninBody, SignupBody } from "../schemas/auth";
import { clearFaildAttemps, isAccountLocked, registerFailedAttemps } from "../utils/helpers";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;


/**
 * @access      PUBLIC
 * @description User sign up controller
 * @body        { name, email, password }
 */

export const signup = async_handler(async (req, res) => {
  const { name, email, password } = req.body as SignupBody;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) return error(res, "Oops invalid creadentails", 400);

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ name, email, password: hashPassword });
  if (!newUser?._id) return error(res, "Oops faild to signup please try again later", 500);

  return success(res, "Sign up successfully", 201, { id: newUser._id });
});


/**
 * @access      PUBLIC 
 * @description User sign in controller
 * @body        { email, password }
 */

export const signin = async_handler(async (req, res) => {
  const { email, password } = req.body as SigninBody;

  const user = await User.findOne({ email });
  if (!user) return error(res, "Oops invalid creadentails", 401);

  // ckecking is account lock or not
  if (await isAccountLocked(user)) {
    return error(res, `Account locked. Try again after ${user.lockUntil?.toISOString()}`, 423);
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    await registerFailedAttemps(user); // track faild attemps logs
    return error(res, "Oops invalid creadentails", 401);
  }

  // clear all attemps logs
  await clearFaildAttemps(user)

  // Cookie set up for e.g. access-token, refresh-token, and csrf-toen
  const { csrfToken } = setAuthCookies({ res, user: { userId: String(user._id), role: user.role }});

  return success(res, "Sign in successfully", 200, { id: user._id, csrfToken });
});


/**
 * @access      PROCETED 
 * @description User profile controller
 */

export const me = async_handler(async (req, res) => {
  const user = await User.findById(req.user?.userId).select(EXTRACT_SAFE_USER_SELECT_OPTIONS);
  if (!user) return error(res, "Oops user not found", 404)
  return success(res, "Success", 200, { user, csrfToken: req.cookies?.[CSRF_COOKIE] })
});


/**
 * @access      PROCETED
 * @description Logout user controller
 */

export const logout = async_handler(async (_req, res) => {
  // clear all auth related cookies for e.g. access-token, refresh-token, and csrf-token
  clearAuthCookies(res);
  return success(res, "User logout successfully", 200)
});


/**
 * @access      PUBLIC
 * @description Generate access token via refresh token
 */

export const generateAccessToekn = async_handler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (!refreshToken) return error(res, "Refresh toekn not provided", 401);

  const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!) as CookiePayload;

  if (!decode || decode.type !== "refresh") 
    return error(res, "Invalid refresh token provided", 401);

  const user = await User.findById(decode.userId).select(EXTRACT_SAFE_USER_SELECT_OPTIONS);

  if (!user) return error(res, "User not found invalid token", 404);

  // set new cookies
  setAuthCookies({ res, user: { userId: String(user._id), role: user.role }});

  return success(res, "Access token generated successfully", 200);
});
