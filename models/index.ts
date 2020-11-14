export interface ApiResponse<D, E = {}> {
    data: D;
    error: E;
}

export type StringResponse = ApiResponse<string, string>;

export const CheckNotUndefined = (object: Object) => {
    for (var [key, value] of Object.entries(object)) {
        if (value === undefined) {
            throw new Error(`Missing attribute: ${key}`);
        }
    }
};