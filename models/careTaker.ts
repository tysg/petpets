import { ApiResponse } from "./index";
import * as yup from "yup";

export enum CaretakerStatus {
    notCt = 0,
    partTimeCt = 1,
    fullTimeCt = 2
}

export interface PetCountPerDay {
    count: number;
}

/**
 * GET api/caretakers/payment
 */
export interface MonthlyPayment {
    monthYear: Date;
    bonus: number;
    fullPay: number;
}

/**
 * GET api/caretakers/payment
 */
export interface CareTakerPayment {
    monthly_payment: MonthlyPayment[];
    created_at: Date;
}

export interface SpecializesIn {
    typeName: string;
    ctPriceDaily: number;
}
export const SpecializesInSchema: yup.ObjectSchema<SpecializesIn> = yup
    .object({
        typeName: yup.string().defined(),
        ctPriceDaily: yup.number().defined()
    })
    .defined();

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

export const CareTakerSchema: yup.ObjectSchema<CareTaker> = yup
    .object({
        email: yup.string().defined(),
        allSpecializes: yup.array(SpecializesInSchema).defined()
    })
    .defined();

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

export const CareTakerDetailsSchema: yup.ObjectSchema<CareTakerDetails> = yup
    .object({
        fullname: yup.string().defined(),
        phone: yup.number().defined(),
        address: yup.string().defined(),
        email: yup.string().defined(),
        avatarUrl: yup.string().optional(),
        caretakerStatus: yup.number().defined(),
        rating: yup.number().defined()
    })
    .defined();

/**
 * GET api/caretakers/:email
 */
export interface CareTakerSpecializesDetails extends CareTakerDetails {
    allSpecializes: SpecializesIn[];
}

export interface CareTakerSpecializesInCategory
    extends CareTakerDetails,
        SpecializesIn {}

export const CareTakerSpecializesInCategorySchema: yup.ObjectSchema<CareTakerSpecializesInCategory> = CareTakerDetailsSchema.concat(
    SpecializesInSchema
).defined();

export interface SpecializesIn {
    typeName: string;
    ctPriceDaily: number;
}

export const CareTakerSpecializesDetailsSchema: yup.ObjectSchema<CareTakerSpecializesDetails> = yup
    .object({
        allSpecializes: yup.array(SpecializesInSchema).defined()
    })
    .concat(CareTakerDetailsSchema)
    .defined();

/**
 * GET api/caretakers/payment
 */
export type MonthlyPaymentsResponse = ApiResponse<CareTakerPayment, string>;

/**
 * GET api/caretakers/
 */
export type IndexResponse = ApiResponse<CareTakerDetails[], string>;

/**
 * GET api/caretakers/search?start_date=2020-11-06&end_date=2020-11-08&pet_category=dog
 */
export type SearchResponse = ApiResponse<
    CareTakerSpecializesInCategory[],
    string
>;

/**
 * GET api/caretakers/:email
 */
export type GetResponse = ApiResponse<CareTakerSpecializesDetails, string>;

export type StringResponse = ApiResponse<string, string>;
