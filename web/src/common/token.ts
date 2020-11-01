const ACCESS_TOKEN = "accessToken";
const USER = "user";

export const clearToken = () => {
    localStorage.removeItem(ACCESS_TOKEN);
};

export const setToken = (accessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
};

export const getToken = () => localStorage.getItem(ACCESS_TOKEN) || null;
// export const getUser = () => localStorage.getItem(USER) || null;
