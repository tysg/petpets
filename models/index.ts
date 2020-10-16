export interface ApiResponse<D, E = {}> {
    data: D;
    error: E;
}

// const a: ApiResponse<string> = { data: "help", error: {} }

