import { Space } from "antd";
import React from "react";
import Profile from "./Profile";
import StoredPayment from "./StoredPayment";

const ProfilePage = () => {
    return (
        <Space> 
            <Profile></Profile>
        <StoredPayment></StoredPayment>
        </Space>  
    );
}

export default ProfilePage;