import { ApiResponse } from "./index";

/**
 * POST api/signup, response.
 */
export type SignUpResponse = ApiResponse<string, string>;

/**
 * POST api/signup, request.
 */
export interface NewUser {
  fullname: string;
  password: string;
  phone: number;
  address: string;
  email: string;
  avatarUrl?: string;
}

/**
 * POST api/signin, request.
 */
export interface User {
  fullname: string;
  phone: number;
  address: string;
  email: string;
  avatarUrl?: string;
}
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * POST api/signin, response.
 */
export type SignInPayload = Record<
  "email" | "username" | "avatarUrl" | "accessToken",
  string
>;
export type SignInResponse = ApiResponse<SignInPayload, string>;
