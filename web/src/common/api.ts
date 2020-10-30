import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "./token";

const token = getToken();
const authHeaderConfig: AxiosRequestConfig = {
  headers: { "x-access-token": token },
};

export const user = {
  verify: () => axios.post("/api/verifyToken", token, authHeaderConfig),
  post: (endpoint: string, data: any) =>
    axios.post(endpoint, data, authHeaderConfig),
  get: (endpoint: string) => axios.get(endpoint, authHeaderConfig),
};

export const administrator = {
  verify: () => axios.post("/api/verifyToken", token, authHeaderConfig),
  post: (endpoint: string, data: any) =>
    axios.post(endpoint, data, authHeaderConfig),
  get: (endpoint: string) => axios.get(endpoint, authHeaderConfig),
};
