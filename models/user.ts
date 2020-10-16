import { ApiResponse } from "./index";

export interface SignUpRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export type SignUpResponse = ApiResponse<string, string>

