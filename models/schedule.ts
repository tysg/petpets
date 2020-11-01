import { ApiResponse } from "./index";

/**
 * POST api/full_timer/
 * POST api/full_timer/
 */
export interface Schedule {
    email: string;
    start_date: Date;
    end_date: Date;
}

export type StringResponse = ApiResponse<string, string>;

/**
 * GET api/part_timer/:email
 * GET api/full_timer/:email
 */
export type IndexResponse = ApiResponse<Schedule[], string>;
export type GetResponse = ApiResponse<Schedule, string>;
