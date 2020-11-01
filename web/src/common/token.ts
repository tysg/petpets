import type { User, UserInterface } from "../../../models/user";
const ACCESS_TOKEN = "accessToken";
const USER = "user";

export const clearToken = () => {
    localStorage.removeItem(ACCESS_TOKEN);
};

export const setTokenAndUser = (accessToken: string, user: UserInterface) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(USER, JSON.stringify(user));
};

export const getToken = () => localStorage.getItem(ACCESS_TOKEN) || null;
export const getUser = () => {
    const serial = localStorage.getItem(USER);
    return serial ? new User(JSON.parse(serial)) : null;
};
