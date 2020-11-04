import { ApiResponse } from "./index";

export enum CaretakerStatus {
    notCt = 0,
    partTimeCt = 1,
    fullTimeCt = 2
}

export interface SpecializesIn {
    typeName: string;
    ctPriceDaily: number;
}

/**
 * PATCH api/caretakers/
 * ^ For updating specalizesIn, but just give all specializes, not just deleted/added
 * POST api/caretakers/part_timer
 * POST api/caretakers/full_timer
 */
export interface CareTaker {
    email: string;
    allSpecializes: SpecializesIn[];
}

/**
 * GET api/caretakers/
 */
export interface CareTakerDetails {
    fullname: string;
    phone: number;
    address: string;
    email: string;
    avatarUrl?: string;
    caretakerStatus: CaretakerStatus;
    rating: number;
}

/**
 * GET api/caretakers/:email
 */
export interface CareTakerSpecializesDetails extends CareTakerDetails {
    allSpecializes: SpecializesIn[];
}

export interface SpecializesDetails extends CareTakerDetails {
    typeName: string;
    ctPriceDaily: number;
}

/**
 * GET api/caretakers/
 */
export type IndexResponse = ApiResponse<CareTakerDetails[], string>;

/**
 * GET api/caretakers/search?start_date=2020-11-06&end_date=2020-11-08&pet_category=dog
 */
export type SpecializesIndexResponse = ApiResponse<
    SpecializesDetails[],
    string
>;

/**
 * GET api/caretakers/:email
 */
export type GetResponse = ApiResponse<CareTakerSpecializesDetails, string>;

export type StringResponse = ApiResponse<string, string>;
