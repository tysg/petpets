import { ApiResponse } from "./index";
import { SpecializesIn, CaretakerStatus } from "./careTaker";

export interface MonthlyRevenue {
    startmonth: string;
    earnings: number;
}

export interface MonthlyBestCareTaker {
    fullname: string;
    phone: number;
    address: string;
    ct_email: string;
    avatar_url?: string;
    caretaker_status: CaretakerStatus;
    rating: number;
    startmonth: string;
    ct_earnings: number;
    ct_bid_count: number;
}

export interface MonthlyBestCareTakerDetails extends MonthlyBestCareTaker {
    all_specializes: SpecializesIn[];
}

/**
 * GET api/admin/monthly_earnings
 */
export type MonthlyRevenueIndexResponse = ApiResponse<MonthlyRevenue[], string>;

/**
 * GET api/admin/best_caretakers_monthly
 */
export type MonthlyBestCareTakerIndexResponse = ApiResponse<
    MonthlyBestCareTakerDetails[],
    string
>;
