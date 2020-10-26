import { ApiResponse } from "./index";

/**
 * POST api/signup, response.
 */
export type SignUpResponse = ApiResponse<string, string>;

/**
 * POST api/signup, request.
 */
export interface NewUser {
    username: string;
    password: string;
    phone: number;
    address: string;
    email: string;
    avatarUrl?: string;
};


/**
 * POST api/signin, request.
 */
export interface SignInRequest {
    email: string;
    password: string;
}


/**
 * POST api/signin, response.
 */
export type SignInResponse =
    ApiResponse<Record<'email' | 'username' | 'avatarUrl' | 'accessToken', string>, string>;



