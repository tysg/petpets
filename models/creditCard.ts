import { ApiResponse } from "./index";

export interface CreditCard {
    cardnumber: number;
    cardholder: string;
    expirydate: Date;
    securitycode: number;
}

export const sqlify = (creditCard: CreditCard) => [
    creditCard.cardnumber,
    creditCard.cardholder,
    creditCard.expirydate,
    creditCard.securitycode
];
export type IndexResponse = ApiResponse<CreditCard[], string>;
export type CreditCardResponse = ApiResponse<CreditCard, string>;
export type StringResponse = ApiResponse<string, string>;
