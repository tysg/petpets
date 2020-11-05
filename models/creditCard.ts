import { ApiResponse } from "./index";
import * as yup from "yup";

export const CreditCardSchema: yup.ObjectSchema<CreditCard> = yup
    .object({
        cardNumber: yup.number().defined(),
        securityCode: yup.number().defined(),
        expiryDate: yup.date().defined(),
        cardholder: yup.string().defined()
    })
    .defined();
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
