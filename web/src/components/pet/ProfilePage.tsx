import { Pet } from "../../../../models/pet";
import { Descriptions } from "antd";
import React, { useEffect, useState } from "react";



function ProfilePage(props: Pet) {
    return (
        <Descriptions title="Pet Info" bordered>
            <Descriptions.Item label="Pet Name">{props.name}</Descriptions.Item>
            <Descriptions.Item label="Pet Category">{props.category}</Descriptions.Item>
            <Descriptions.Item label="Pet Description">{props.description}</Descriptions.Item>
            <Descriptions.Item label="Pet Requirements">{props.requirements}</Descriptions.Item>
        </Descriptions>
    );
}

export default ProfilePage;