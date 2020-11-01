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
    getPetCategories: (): Promise<AxiosResponse<PetCategoriesResponse>> => {
        const mock: any = {
            data: {
                data: [
                    {
                        base_daily_price: 4,
                        typeName: "dog"
                    },
                    {
                        base_daily_price: 5,
                        type_name: "cat"
                    }
                ]
            }
        };

        return Promise.resolve(mock);
        // return get("/api/pets/categories");
    }
};
