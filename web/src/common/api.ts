import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, getUser } from "./token";
import {
    IndexResponse as PetIndexResponse,
    PetCategoriesResponse
} from "./../../../models/pet";
import { IndexResponse as CareTakerIndexResponse } from "./../../../models/careTaker";
import { Moment } from "moment";

const formatDate = (date: Moment) => date.format("YYYY-MM-DD");
const token = getToken();
const email = getUser()?.email;
const authHeaderConfig: AxiosRequestConfig = {
    headers: { "x-access-token": token }
};

const post = (endpoint: string, data: any) =>
    axios.post(endpoint, data, authHeaderConfig);
const get = (endpoint: string) => axios.get(endpoint, authHeaderConfig);

export const user = {
    verify: () => axios.post("/api/verifyToken", token, authHeaderConfig),
    post: (endpoint: string, data: any) =>
        axios.post("/api" + endpoint, data, authHeaderConfig),
    get: (endpoint: string) => axios.get("/api" + endpoint, authHeaderConfig)
};

export const pets = {
    getCategories: (): Promise<AxiosResponse<PetCategoriesResponse>> =>
        axios.get("/api/pets/categories", authHeaderConfig),
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
        )
};
