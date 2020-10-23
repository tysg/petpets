import { ApiResponse } from "./index";


export interface Pet {
    name: string;
    owner: string;
    cateogry: number;
    requirements: string;
    remarks: string;
};

export type ModelResponse = ApiResponse<Pet, string>;
export type StringResponse = ApiResponse<string, string>;