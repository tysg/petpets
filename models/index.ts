export interface ApiResponse<D, E = {}> {
    data: D;
    error: E;
}

export interface Bid {
    ct_email: string;
    owner_email: string;
    pet_name: string;
    pet_category: string;
    ct_price: number;
    start_date: string;
    end_date: string;
    is_cash: boolean;
    credit_card?: string;
    transport_method: "pickup" | "deliver" | "pcs";
}
