import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./token";
import { PetCategoriesResponse } from "./../../../models/pet";

const token = getToken();
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
        get("/api/pets/categories")
};
