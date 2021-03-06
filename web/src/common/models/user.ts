import { UserInterface } from "../../../../models/user";

export default class User {
    fullname: string;
    phone: number;
    address: string;
    email: string;
    role: string;
    avatarUrl: string;

    constructor(user: UserInterface) {
        this.fullname = user.fullname;
        this.phone = user.phone;
        this.address = user.address;
        this.email = user.email;
        this.role = user.role;
        this.avatarUrl = user.avatarUrl || "";
    }

    isAdmin() {
        return this.role === "admin";
    }

    refresh(user: UserInterface) {
        localStorage.setItem("user", JSON.stringify(user));
    }
}
