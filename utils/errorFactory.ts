import { ApiResponse } from "../models";

export function errorResponse(message: string): ApiResponse<string, string> {
    return { data: "", error: message };
}
