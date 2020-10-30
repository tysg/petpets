import { ApiResponse } from "./index";

/**
 * POST api/signin, request.
 */
export interface Administrator {
  email: string;
}
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * POST api/signin, response.
 */
export type SignInPayload = Record<
  "email" | "accessToken",
  string
>;
export type SignInResponse = ApiResponse<SignInPayload, string>;
