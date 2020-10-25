import { ApiResponse } from "./index";


export interface CreditCard {
    cardNumber: number;
    cardholder: string;
    expiryDate: Date;
    secutiryCode: number;
};

export const sqlify = (creditCard:CreditCard) => [creditCard.cardNumber, creditCard.cardholder, creditCard.expiryDate, creditCard.secutiryCode];
export type IndexResponse = ApiResponse<CreditCard[], string>;
export type CreditCardResponse = ApiResponse<CreditCard, string>;
export type StringResponse = ApiResponse<string, string>;