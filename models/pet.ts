import { ApiResponse } from "./index";


export interface Pet {
    name: string;
    owner: string;
    category: number;
    requirements: string;
    remarks: string;
};

export const sqlify = (pet:Pet) => [pet.name, pet.owner, pet.category, pet.requirements, pet.remarks];
export type IndexResponse = ApiResponse<Pet[], string>;
export type PetResponse = ApiResponse<Pet, string>;
export type StringResponse = ApiResponse<string, string>;