import React, { useState } from "react";
import {
    Descriptions,
    Avatar,
    Card,
    Row,
    Typography,
    Button,
    Modal,
    Select,
    Radio,
    Empty,
    Input,
    message
} from "antd";
import Form, { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { AntDesignOutlined, EditOutlined } from "@ant-design/icons";
import { getUser } from "./../../common/token";
import { NewUser } from "../../../../models/user";
import { formatTimeStr } from "antd/lib/statistic/utils";
import { RouteChildrenProps } from "react-router-dom";
import { user as userApi } from "../../common/api";

interface ProfileModalProps {
    visible: boolean;
    closeModal: () => void;
}
// fullname: string;
//     password: string;
//     phone: number;
//     address: string;
//     email: string;
//     avatarUrl?: string;
const ProfileModalForm = ({ visible, closeModal }: ProfileModalProps) => {
    const [form] = useForm();
    form.setFieldsValue(getUser());
    const submitValues = (values: Omit<NewUser, "password">) => {
        form.resetFields();
        userApi
            .updateProfile(values)
            .then((res) => {
                const user = res.data.data;
                message.info(`${user.email} is updated successfully`);
                getUser()?.refresh(user);
            })
            .catch((err) => message.error(err.response.data.data))
            .finally(closeModal);
    };
    const onSubmit = () => {
        form.validateFields().then((values) => {
            const { fullname, email, address, phone, avatarUrl } = values;
            submitValues({ fullname, email, address, phone, avatarUrl });
        });
    };
    return (
        <Modal
            visible={visible}
            onOk={onSubmit}
            onCancel={closeModal}
            title="Edit Profile"
        >
            <Form form={form}>
                <FormItem name="fullname" label="Full Name">
                    <Input defaultValue={getUser()?.fullname} />
                </FormItem>
                <FormItem name="phone" label="Phone Number">
                    <Input defaultValue={getUser()?.phone} />
                </FormItem>
                <FormItem name="address" label="Address">
                    <Input defaultValue={getUser()?.address} />
                </FormItem>
                <FormItem name="avatarUrl" label="Avatar Link">
                    <Input defaultValue={getUser()?.avatarUrl} />
                </FormItem>
            </Form>
        </Modal>
    );
};

const UserProfile = (props: RouteChildrenProps) => {
    const user = getUser()!;
    const { fullname, email, phone, address, avatarUrl } = user;
    const [visibleModal, setVisibleModal] = useState(false);
    const showModal = () => setVisibleModal(true);
    const hideModal = () => {
        setVisibleModal(false);
        props.history.go(0);
    };
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
                />
            </Row>
            <Descriptions
                bordered
                column={1}
                extra={
                    <Button
                        size="large"
                        style={{ margin: 20 }}
                        onClick={showModal}
                    >
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
            <ProfileModalForm visible={visibleModal} closeModal={hideModal} />
        </Card>
    );
};
export default UserProfile;
