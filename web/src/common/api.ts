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
import {
    CareTakerSpecializesDetails,
    CaretakerStatus,
    SearchResponse,
    SpecializesIn,
    MonthlyPaymentsResponse
} from "./../../../models/careTaker";
import {
    MonthlyBestCareTakerIndexResponse,
    MonthlyRevenueIndexResponse
} from "./../../../models/admin";
import {
    CreateBidRequest,
    Bid,
    CareTakerResponse,
    OwnerResponse
} from "../../../models/bid";
import {
    IndexResponse as ScheduleIndexResponse,
    Schedule
} from "./../../../models/schedule";
import { Moment } from "moment";
import { ApiResponse } from "../../../models";
import { NewProfile, NewUser, UserInterface } from "../../../models/user";

export const formatDate = (date: Moment) => date.format("YYYY-MM-DD");
const token = () => getToken();
const email = () => getUser()?.email!;
const authHeaderConfig: AxiosRequestConfig = {
    headers: { "x-access-token": token() }
};

const authHeader = () => ({
    headers: { "x-access-token": token() }
});
function addOwnerField(pet: Omit<Pet, "owner">): Pet {
    return { ...pet, owner: email() };
}

function addCardHolderField(
    creditCard: Omit<CreditCard, "cardholder">
): CreditCard {
    return { ...creditCard, cardholder: email() };
}

const remove = (endpoint: string) => {
    return axios.delete(endpoint, authHeader());
};
const post = (endpoint: string, data: any) => {
    return axios.post(endpoint, data, authHeader());
};
const patch = (endpoint: string, data: any) =>
    axios.patch(endpoint, data, authHeaderConfig);

const get = (endpoint: string) => {
    return axios.get(endpoint, authHeader());
};

export const user = {
    verify: () => axios.post("/api/verifyToken", token(), authHeaderConfig),
    post: (endpoint: string, data: any) =>
        axios.post("/api" + endpoint, data, authHeaderConfig),
    get: (endpoint: string) => axios.get("/api" + endpoint, authHeaderConfig),
    updateProfile: (
        newProfile: NewProfile
    ): Promise<AxiosResponse<ApiResponse<UserInterface, string>>> =>
        axios.patch("/api/profile/" + email(), newProfile, authHeaderConfig)
};

const PET_CATEGORY_ENDPOINT = "/api/petCategories";
export const pets = {
    getCategories: (): Promise<AxiosResponse<PetCategoriesResponse>> =>
        axios.get(PET_CATEGORY_ENDPOINT, authHeaderConfig),
    postCategory: (
        data: PetCategory
    ): Promise<AxiosResponse<PetCategoriesResponse>> =>
        axios.post(PET_CATEGORY_ENDPOINT, data, authHeaderConfig),
    patchCategory: (
        oldData: PetCategory,
        newData: PetCategory
    ): Promise<AxiosResponse<PetCategoriesResponse>> =>
        axios.patch(
            PET_CATEGORY_ENDPOINT + `/${oldData.typeName}`,
            newData,
            authHeaderConfig
        ),
    removeCategory: ({
        typeName
    }: PetCategory): Promise<AxiosResponse<StringResponse>> =>
        axios.delete(`${PET_CATEGORY_ENDPOINT}/${typeName}`),
    getUserPets: (): Promise<AxiosResponse<PetIndexResponse>> =>
        get(`/api/pets/${email()}`),

    getAvailableCareTakers: (
        startDate: Moment,
        endDate: Moment,
        petCategory: string
    ): Promise<AxiosResponse<SearchResponse>> =>
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
        return patch(`/api/pets/${email()}/${pet.name}`, addOwnerField(pet));
    },

    deletePet: (
        pet: Omit<Pet, "owner">
    ): Promise<AxiosResponse<StringResponse>> => {
        return remove(`/api/pets/${email()}/${pet.name}`);
    }
};

export const creditCards = {
    getUserCreditCards: (): Promise<AxiosResponse<CreditCardIndexResponse>> =>
        get(`/api/creditCards/${email()}`),
    postCreditCard: (
        creditCard: Omit<CreditCard, "cardholder">
    ): Promise<AxiosResponse<CreditCardStringIndexResponse>> => {
        return post(`/api/creditCards`, addCardHolderField(creditCard));
    },
    putCreditCard: (
        creditCard: Omit<CreditCard, "cardholder">
    ): Promise<AxiosResponse<CreditCardStringIndexResponse>> => {
        return patch(
            `/api/creditCards/${email()}/${creditCard.cardNumber}`,
            addCardHolderField(creditCard)
        );
    },
    deleteCreditCard: (
        creditCard: Omit<CreditCard, "cardholder">
    ): Promise<AxiosResponse<CreditCardStringIndexResponse>> => {
        return remove(`/api/creditCards/${email()}/${creditCard.cardNumber}`);
    }
};

const getBidIdentity = (bid: Bid) => {
    const { ct_email, pet_owner, pet_name, start_date, end_date } = bid;
    return `${ct_email}/${pet_owner}/${pet_name}/${start_date}/${end_date}/`;
};
export const bid = {
    createBid: (body: CreateBidRequest) => {
        console.log(body);
        // return Promise.resolve();
        // return Promise.reject();
        return post(`/api/bids`, body);
    },
    getForCareTaker: (): Promise<AxiosResponse<CareTakerResponse>> => {
        return get("/api/bids/caretaker/" + email());
    },
    getForOwner: (): Promise<AxiosResponse<OwnerResponse>> => {
        return get("/api/bids/owner/" + email());
    },
    updateBid: (bid: Bid) => patch(`/api/bids/${getBidIdentity(bid)}`, bid)
};

const CARETAKER_ENDPOINT = "/api/caretakers/";
export const careTaker = {
    getCareTaker: (): Promise<
        AxiosResponse<ApiResponse<CareTakerSpecializesDetails, string>>
    > => {
        return get(CARETAKER_ENDPOINT + email());
    },
    patchCareTaker: (
        spec: CareTakerSpecializesDetails,
        status: CaretakerStatus
    ) => patch(CARETAKER_ENDPOINT + getStatus(status) + email(), spec),
    newFulltimer: (
        allSpecializes: SpecializesIn[]
    ): Promise<AxiosResponse<StringResponse>> => {
        return post(CARETAKER_ENDPOINT + "full_timer", {
            email: email(),
            allSpecializes
        });
    },
    newParttimer: (
        allSpecializes: SpecializesIn[]
    ): Promise<AxiosResponse<StringResponse>> => {
        return post(CARETAKER_ENDPOINT + "part_timer", {
            email: email(),
            allSpecializes
        });
    },

    getPayment: (): Promise<AxiosResponse<MonthlyPaymentsResponse>> => {
        return get(`/api/caretakers/payment/${email()}`);
    }
};

const getStatus = (status: CaretakerStatus) => {
    const mapping = ["not_caretaker", "part_timer", "full_timer"];
    return mapping[status] + "/";
};

export const admin = {
    getMonthlyRevenues: (): Promise<
        AxiosResponse<MonthlyRevenueIndexResponse>
    > => {
        return get("/api/admin/monthly_revenue");
    },
    getMonthlyBestCareTaker: (
        yearMonth: moment.Moment
    ): Promise<AxiosResponse<MonthlyBestCareTakerIndexResponse>> => {
        return get(
            `/api/admin/best_caretakers_monthly/${yearMonth.format("YYYY-MM")}`
        );
    }
};

export const schedule = {
    getSchedule: (
        type: "part_timer" | "full_timer"
    ): Promise<AxiosResponse<ScheduleIndexResponse>> => {
        return get(`/api/schedules/${type}/${email()}`);
    },

    postSchedule: (
        startEnd: [moment.Moment, moment.Moment],
        type: "part_timer" | "full_timer"
    ): Promise<AxiosResponse<StringResponse>> => {
        const payload: Schedule = {
            email: email(),
            start_date: startEnd[0].toDate(),
            end_date: startEnd[1].toDate()
        };

        return post(`/api/schedules/${type}`, payload);
    }
};
