import { ApiResponse } from "./index";
import * as yup from "yup";

<<<<<<< HEAD
/**
 * POST api/creditCards, request;
 * PATCH api/creditCards/:cardholder/:cardNumber, request;
 */
=======
export const CreditCardSchema: yup.ObjectSchema<CreditCard> = yup
    .object({
        cardNumber: yup.number().defined(),
        securityCode: yup.number().defined(),
        expiryDate: yup.date().defined(),
        cardholder: yup.string().defined()
    })
    .defined();
>>>>>>> master
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
/**
 * GET api/creditCards/:cardholder
 */
export type IndexResponse = ApiResponse<CreditCard[], string>;

/**
 * GET api/creditCards/:cardholder/:cardNumber;
 * POST api/creditCards/:cardholder/:cardNumber, response;
 */
export type CreditCardResponse = ApiResponse<CreditCard, string>;
export type StringResponse = ApiResponse<string, string>;
