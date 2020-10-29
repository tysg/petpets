import axios from "axios";
import { getToken } from "./token";

const token = getToken();

export const user = {
  verify: () =>
    axios.post("/api/verifyToken", token, {
      headers: { "x-access-token": token },
    }),
  post: (endpoint: string, data: any) =>
    axios.post(endpoint, data, {
      headers: { "x-access-token": token },
    }),
  get: (endpoint: string) =>
    axios.get(endpoint, {
      headers: { "x-access-token": token },
    }),
};
