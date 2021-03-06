import { ApiResponse } from "./index";
import * as yup from "yup";

/**
 * POST api/pets, request;
 * PATCH api/pets/:owner/:name, request;
 */
export interface Pet {
    name: string;
    owner: string;
    category: string;
    requirements: string;
    description: string;
}

export const PetSchema: yup.ObjectSchema<Pet> = yup
    .object({
        name: yup.string().defined(),
        owner: yup.string().defined(),
        category: yup.string().defined(),
        requirements: yup.string().defined(),
        description: yup.string().defined()
    })
    .defined();

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

export const PetCategorySchema: yup.ObjectSchema<PetCategory> = yup
    .object({
        typeName: yup.string().defined(),
        baseDailyPrice: yup.number().defined()
    })
    .defined();
/**
 * GET api/pets/categories
 */
export type PetCategoriesResponse = ApiResponse<PetCategory[], string>;
