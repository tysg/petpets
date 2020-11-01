import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./token";
import { IndexResponse, PetCategoriesResponse } from "./../../../models/pet";

const token = getToken();
// HACK: hardcode user waiting for another PR
const email = "jan@gmail.com";
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
    getPetCategories: (): Promise<AxiosResponse<PetCategoriesResponse>> =>
        get("/api/pets/categories"),
    getUserPets: (): Promise<AxiosResponse<IndexResponse>> =>
        get(`/api/pets/${email}`)
};
