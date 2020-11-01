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
export interface UserInterface {
    email: string;
    fullname: string;
    passwordHash: string;
    address: string;
    phone: number;
    role: string;
    avatarUrl?: string;
}
export class User {
    fullname: string;
    phone: number;
    address: string;
    email: string;
    role: string;
    avatarUrl: string;

    constructor(user: UserInterface) {
        this.fullname = user.fullname;
        this.phone = user.phone;
        this.address = user.address;
        this.email = user.address;
        this.role = user.role;
        this.avatarUrl = user.avatarUrl || "";
    }

    isAdmin() {
        return this.role === "admin";
    }
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
export type SignInResponse = ApiResponse<SignInPayload, string>;
