import { ApiResponse } from "./index";

export enum CaretakerStatus {
    not_ct = 0,
    part_time_ct = 1,
    full_time_ct = 2,
}

export interface CareTaker {
    email: string;
    caretaker_status: CaretakerStatus;
}

export interface CareTakerDetails {
    username: string;
    phone: number;
    address: string;
    email: string;
    avatarUrl?: string;
    caretaker_status: CaretakerStatus;
}

export type IndexResponse = ApiResponse<CareTakerDetails[], string>;
export type GetResponse = ApiResponse<CareTakerDetails, string>;
export type StringResponse = ApiResponse<string, string>;
