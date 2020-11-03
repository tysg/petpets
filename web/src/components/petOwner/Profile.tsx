import React from "react";
import { Descriptions } from "antd";
import { getUser } from "./../../common/token";

const PetOwnerProfile = () => {
    const user = getUser()!;
    return (
        <Descriptions title="User Information" bordered column={2}>
            <Descriptions.Item label="Name">{user.fullname}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Phone Number">
                {user.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
                {user.address}
            </Descriptions.Item>
            <Descriptions.Item label="Role" span={3}>
                Pet Owner
            </Descriptions.Item>
            {/* <Descriptions.Item label="Stored Payment"></Descriptions.Item> */}
        </Descriptions>
    );
};
export default PetOwnerProfile;
