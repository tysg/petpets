import { ApiResponse } from "./index";

/**
 * POST api/signup, response.
 */
export type SignUpResponse = ApiResponse<string, string>;

/**
 * POST api/profile/:email
 */
export interface NewProfile {
    fullname: string;
    phone: number;
    address: string;
    avatarUrl: string;
}

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
export interface UserInterface {
    email: string;
    fullname: string;
    passwordHash: string;
    address: string;
    phone: number;
    role: string;
    avatarUrl?: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

/**
 * POST api/signin, response.
 */
interface SignInPayload {
    accessToken: string;
    user: UserInterface;
}

export const sqlifyProfile = (p: NewProfile) => [
    p.fullname,
    p.address,
    p.phone,
    p.avatarUrl
];

export type SignInResponse = ApiResponse<SignInPayload, string>;
