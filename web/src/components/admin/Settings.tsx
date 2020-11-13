import {
    Button,
    Input,
    InputNumber,
    PageHeader,
    Space,
    Table,
    Form,
    message
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import Modal from "antd/lib/modal/Modal";
import { AxiosResponse } from "axios";
import React, { EffectCallback, useEffect, useState } from "react";
import { PetCategoriesResponse, PetCategory } from "../../../../models/pet";
import { pets as petsApi } from "../../common/api";

const checkPrice = (_: any, value: any) => {
    return value >= 0
        ? Promise.resolve()
        : Promise.reject("Price cannot be negative!");
};

interface ModalFormProps {
    title: string;
    visible: boolean;
    initialValue: PetCategory | null;
    onSubmit: (oldValue: PetCategory | null, newValue: PetCategory) => void;
    onCancel: () => void;
}

const ModalForm = (props: ModalFormProps) => {
    const { visible, onSubmit, onCancel, title, initialValue } = props;
    const defaultPet = initialValue ?? { typeName: "", baseDailyPrice: 0 };
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title={title}
            okText="Submit"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        const { typeName, baseDailyPrice } = values;
                        const record: PetCategory = {
                            typeName,
                            baseDailyPrice
                        };
                        onSubmit(initialValue, record);
                    })
                    .catch((err) => console.log("Validation failed:", err));
            }}
        >
            <Form form={form} initialValues={defaultPet}>
                <FormItem
                    label="Pet Category"
                    name="typeName"
                    required
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (value?.length > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "Pet Category cannot be empty!"
                                );
                            }
                        })
                    ]}
                >
                    <Input defaultValue={defaultPet.typeName}></Input>
                </FormItem>
                <FormItem
                    label="Base Daily Price"
                    name="baseDailyPrice"
                    rules={[{ validator: checkPrice }]}
                >
                    <InputNumber defaultValue={defaultPet.baseDailyPrice} />
                </FormItem>
            </Form>
        </Modal>
    );
};

const columns = [
    {
        title: "Pet Category",
        dataIndex: "typeName",
        key: "category",
        width: "40%",
        sorter: (a: PetCategory, b: PetCategory) =>
            a.typeName.localeCompare(b.typeName)
    },
    {
        title: "Daily Price (SGD)",
        dataIndex: "baseDailyPrice",
        key: "price",
        width: "40%",
        sorter: (a: PetCategory, b: PetCategory) =>
            a.baseDailyPrice - b.baseDailyPrice
    }
];

const Settings = () => {
    const [petTypes, setPetTypes] = useState<PetCategory[]>([]);
    const pollCategories: EffectCallback = () => {
        console.log("making call to backend");
        petsApi
            .getCategories()
            .then((res: AxiosResponse<PetCategoriesResponse>) =>
                setPetTypes(res.data.data)
            )
            .catch((err) => console.log(err));
    };
    const [visibleModal, setVisibleModal] = useState(false);
    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const [record, setRecord] = useState<PetCategory | null>(null);
    const [title, setTitle] = useState("");
    const actionColumn = {
        title: "Action",
        key: "action",
        width: "20%",
        render: (text: string, record: PetCategory, index: any) => {
            return (
                <Space size="middle">
                    <Button onClick={() => generateModal(record)}>Edit</Button>
                    <Button danger onClick={() => onDelete(record)}>
                        Delete
                    </Button>
                </Space>
            );
        }
    };
    const onSubmit = (oldValue: PetCategory | null, newValue: PetCategory) => {
        const promise = oldValue
            ? petsApi.patchCategory(oldValue, newValue)
            : petsApi.postCategory(newValue);
        promise
            .then((res) => {
                console.log(res);
                message.success("Success!");
            })
            .catch((err) => {
                console.log(err);
                message.error("Something went wrong...");
            })
            .finally(() => {
                pollCategories();
                hideModal();
            });
    };
    const onDelete = (values: PetCategory) => {
        petsApi
            .removeCategory(values)
            .then((res) => {
                console.log(res);
                message.success("Success!");
            })
            .catch((err) => {
                console.log(err);
                message.error("Cannot delete Pet Category with pets in it...");
            })
            .finally(() => {
                pollCategories();
                hideModal();
            });
    };
    const newModal = () => {
        setTitle("New Pet Category");
        setRecord(null);
        showModal();
    };
    const generateModal = (record: PetCategory) => {
        setTitle("Manage Category");
        setRecord(record);
        showModal();
    };
    useEffect(pollCategories, []);
    return (
        <PageHeader
            className="site-page-header-responsive"
            title="Manage Pet Categories"
            subTitle="Add, delete or modify pet categories"
            extra={
                <Button size="large" onClick={newModal}>
                    New
                </Button>
            }
        >
            {visibleModal && (
                <ModalForm
                    visible={visibleModal}
                    title={title}
                    onCancel={hideModal}
                    onSubmit={onSubmit}
                    initialValue={record}
                ></ModalForm>
            )}
            <Table
                dataSource={petTypes}
                columns={[...columns, actionColumn]}
                pagination={{ hideOnSinglePage: true }}
            ></Table>
        </PageHeader>
    );
};

export default Settings;
