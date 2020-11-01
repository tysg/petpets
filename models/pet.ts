import { ApiResponse } from "./index";

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
 *
 */
export type StringResponse = ApiResponse<string, string>;
