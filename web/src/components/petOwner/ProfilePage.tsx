import { Space } from "antd";
import { List } from "antd/lib/form/Form";
import React from "react";
import Profile from "./Profile";
import StoredPayment from "./StoredPayment";

const ProfilePage = () => {
    return (
        <Space direction="vertical"> 
            <Profile></Profile>
        <StoredPayment></StoredPayment>
        </Space>
    );
}

export default ProfilePage;