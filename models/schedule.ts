import { ApiResponse } from "./index";

export interface Schedule {
    start_time: Date;
    end_time: Date;
}

export type StringResponse = ApiResponse<string, string>;
export type IndexResponse = ApiResponse<Schedule[], string>;
export type GetResponse = ApiResponse<Schedule, string>;
