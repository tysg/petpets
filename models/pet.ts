import { ApiResponse } from "./index";

/**
 * POST api/pets, request;
 * PATCH api/pets/:owner/:name, request;
 */
export interface Pet {
    name: string;
    owner: string;
    category: number;
    requirements: string;
    description: string;
}

export const sqlify = (pet: Pet) => [
    pet.name,
    pet.owner,
    pet.category,
    pet.requirements,
    pet.description
];

/**
 * GET api/pets/:owner
 */
export type IndexResponse = ApiResponse<Pet[], string>;

/**
 * GET api/pets/:owner/:name;
 * POST api/pets/:owner/:name, response;
 */
export type PetResponse = ApiResponse<Pet, string>;

/**
 * DELETE api/pets/:owner/:name, response;
 */
export type StringResponse = ApiResponse<string, string>;

export interface PetCategory {
    typeName: string;
    baseDailyPrice: number;
}

/**
 * GET api/pets/categories
 */
export type PetCategoriesResponse = ApiResponse<PetCategory[], string>;
