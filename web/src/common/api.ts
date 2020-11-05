import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, getUser } from "./token";
import {
    IndexResponse as PetIndexResponse,
    PetCategoriesResponse,
    PetCategory,
    StringResponse,
    Pet
} from "./../../../models/pet";
import {
    IndexResponse as CreditCardIndexResponse,
    CreditCardResponse,
    StringResponse as CreditCardStringIndexResponse,
    CreditCard
} from "./../../../models/creditCard";
import { IndexResponse as CareTakerIndexResponse } from "./../../../models/careTaker";
import { IndexResponse as CreditCardIndexResponse } from "./../../../models/creditCard";
import { Bid } from "./../../../models/index";
import { Moment } from "moment";

export const formatDate = (date: Moment) => date.format("YYYY-MM-DD");
const token = getToken();
const email = getUser()?.email!;
const authHeaderConfig: AxiosRequestConfig = {
    headers: { "x-access-token": token }
};

function addOwnerField(pet: Omit<Pet, "owner">): Pet {
    return { ...pet, owner: email };
}

function addCardHolderField(creditCard: Omit<CreditCard, "cardholder">): CreditCard {
    return { ...creditCard, cardholder: email };
}

const remove = (endpoint: string) => axios.delete(endpoint, authHeaderConfig);
const post = (endpoint: string, data: any) =>
    axios.post(endpoint, data, authHeaderConfig);
const patch = (endpoint: string, data: any) =>
    axios.patch(endpoint, data, authHeaderConfig);

const get = (endpoint: string) => axios.get(endpoint, authHeaderConfig);

export const user = {
    verify: () => axios.post("/api/verifyToken", token, authHeaderConfig),
    post: (endpoint: string, data: any) =>
        axios.post("/api" + endpoint, data, authHeaderConfig),
    get: (endpoint: string) => axios.get("/api" + endpoint, authHeaderConfig),
    getCreditCards: (): Promise<AxiosResponse<CreditCardIndexResponse>> =>
        axios.get(`/api/credit_cards/${email}`)
};

const PET_CATEGORY_ENDPOINT = "/api/petCategories";
export const pets = {
    getCategories: (): Promise<AxiosResponse<PetCategoriesResponse>> =>
        axios.get(PET_CATEGORY_ENDPOINT, authHeaderConfig),
    putCategory: (
        data: PetCategory
    ): Promise<AxiosResponse<PetCategoriesResponse>> =>
        axios.put(PET_CATEGORY_ENDPOINT, data, authHeaderConfig),
    removeCategory: ({
        typeName
    }: PetCategory): Promise<AxiosResponse<StringResponse>> =>
        axios.delete(`${PET_CATEGORY_ENDPOINT}/${typeName}`),
    getUserPets: (): Promise<AxiosResponse<PetIndexResponse>> =>
        get(`/api/pets/${email}`),

    getAvailableCareTakers: (
        startDate: Moment,
        endDate: Moment,
        petCategory: string
    ): Promise<AxiosResponse<CareTakerIndexResponse>> =>
        get(
            `/api/caretakers/search?start_date=${formatDate(
                startDate
            )}&end_date=${formatDate(endDate)}&pet_category=${petCategory}`
        ),

    postPet: (
        pet: Omit<Pet, "owner">
    ): Promise<AxiosResponse<StringResponse>> => {
        return post(`/api/pets`, addOwnerField(pet));
    },
    putPet: (
        pet: Omit<Pet, "owner">
    ): Promise<AxiosResponse<StringResponse>> => {
        return patch(`/api/pets/${email}/${pet.name}`, addOwnerField(pet));
    },

    deletePet: (
        pet: Omit<Pet, "owner">
    ): Promise<AxiosResponse<StringResponse>> => {
        return remove(`/api/pets/${email}/${pet.name}`);
    }
};

<<<<<<< HEAD
export const creditCards = {
    getUserCreditCards: (): Promise<AxiosResponse<CreditCardIndexResponse>> =>
        get(`/api/creditCards/${email}`),
    postCreditCard: (
        creditCard: Omit<CreditCard, "cardholder">
    ): Promise<AxiosResponse<CreditCardStringIndexResponse>> => {
        return post(`/api/creditCards`, addCardHolderField(creditCard));
    },
    putCreditCard: (
        creditCard: Omit<CreditCard, "cardholder">
    ): Promise<AxiosResponse<CreditCardStringIndexResponse>> => {
        return patch(`/api/creditCards/${email}/${creditCard.cardNumber}`, addCardHolderField(creditCard));
    },
    deleteCreditCard: (
        creditCard: Omit<CreditCard, "cardholder">
    ): Promise<AxiosResponse<CreditCardStringIndexResponse>> => {
        return remove(`/api/creditCards/${email}/${creditCard.cardNumber}`);
    }
};

=======
export const bid = {
    createBid: (body: Bid) => {
        console.log(body);
        return Promise.resolve();
        // return Promise.reject();
        // return post(`/api/bids`, body);
    }
};
>>>>>>> master
