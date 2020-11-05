import React from "react";
import "antd/dist/antd.css";
import { Descriptions } from "antd";
import { CareTakerDetails } from "../../../../models/careTaker";

const Rates = (props: CareTakerDetails) => {
    return (
        <Descriptions title="User Information" layout="vertical" bordered>
            <Descriptions.Item label="Name">{props.fullname}</Descriptions.Item>
            <Descriptions.Item label="Email">{props.email}</Descriptions.Item>
            <Descriptions.Item label="Phone Number">
                {props.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
                {props.address}
            </Descriptions.Item>
            <Descriptions.Item label="Role" span={3}>
                Pet Sitter
            </Descriptions.Item>
        </Descriptions>
    );
};
export default Rates;
