import { ApiResponse } from "./index";

export type SignUpResponse = ApiResponse<string, string>;

export interface NewUser {
    username: string;
    password: string;
    phone: number;
    address: string;
    email: string;
    avatarUrl: string;
};

