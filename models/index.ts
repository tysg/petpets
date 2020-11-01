export interface ApiResponse<D, E = {}> {
    data: D;
    error: E;
}
