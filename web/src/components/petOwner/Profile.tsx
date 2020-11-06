import React from "react";
import {
    Descriptions,
    Avatar,
    Card,
    Row,
    Typography,
    Button,
    Space,
    Empty
} from "antd";
import { AntDesignOutlined, EditOutlined } from "@ant-design/icons";
import { getUser } from "./../../common/token";
// import Title from "antd/lib/skeleton/Title";
const { Title } = Typography;

const UserProfile = () => {
    const user = getUser()!;
    const { fullname, email, phone, address, avatarUrl } = user;
    return (
        <Card title="My Profile">
            <Row justify="center">
                <Avatar
                    size={{
                        xs: 24,
                        sm: 32,
                        md: 80,
                        lg: 100,
                        xl: 120,
                        xxl: 150
                    }}
                    icon={<AntDesignOutlined />}
                    src={avatarUrl}
                    // src={ "https://miro.medium.com/max/700/1*64K8EQx8ee2BrK-HIQhCmg.png" }
                />
            </Row>
            {/* <Row>
                <Title level={2}>My Details</Title>
            </Row> */}
            <Descriptions
                bordered
                column={1}
                extra={
                    <Button size="large" style={{ margin: 20 }}>
                        <EditOutlined />
                        Edit
                    </Button>
                }
            >
                <Descriptions.Item label="Name">{fullname}</Descriptions.Item>
                <Descriptions.Item label="Email">{email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                    {phone}
                </Descriptions.Item>
                <Descriptions.Item label="Address">{address}</Descriptions.Item>
            </Descriptions>
            <Row justify="end"></Row>
        </Card>
    );
};
export default UserProfile;
