export interface ApiResponse<D, E = {}> {
    data: D;
    error: E;
}

export type StringResponse = ApiResponse<string, string>;
