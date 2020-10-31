import { ApiResponse } from "./index";
import { CaretakerStatus } from "./careTaker";

export interface Schedule {
    email: string;
    caretaker_status: CaretakerStatus;
    start_date: Date;
    end_date: Date;
}

export type StringResponse = ApiResponse<string, string>;
export type IndexResponse = ApiResponse<Schedule[], string>;
export type GetResponse = ApiResponse<Schedule, string>;
