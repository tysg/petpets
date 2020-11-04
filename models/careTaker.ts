import { ApiResponse } from "./index";

export enum CaretakerStatus {
    notCt = 0,
    partTimeCt = 1,
    fullTimeCt = 2
}

/**
 * PATCH api/caretakers/
 * ^ For updating specalizesIn, but just give the new specializesIn, not just deleted/added
 * POST api/caretakers/part_timer
 * POST api/caretakers/full_timer
 */
export interface CareTaker {
    email: string;
    specializesIn: string[];
}

export interface CareTakerDetails {
    fullname: string;
    phone: number;
    address: string;
    email: string;
    avatarUrl?: string;
    caretakerStatus: CaretakerStatus;
    rating: number;
    ctPriceDaily: number;
}

/**
 * GET api/caretakers/index
 * GET api/caretakers/search?start_date=2020-11-06&end_date=2020-11-08&pet_category=dog
 */
export type IndexResponse = ApiResponse<CareTakerDetails[], string>;

/**
 * GET api/caretakers/:email
 */
export type GetResponse = ApiResponse<CareTakerDetails, string>;

export type StringResponse = ApiResponse<string, string>;
