import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Form } from "antd";
import { AxiosResponse } from "axios";
import {
    Pet,
    PetCategory,
    PetCategoriesResponse
} from "../../../../models/pet";
import { pets as petsApi } from "../../common/api";

function petCategoryOptions(pets: PetCategory[]) {
    return pets.map((p) => (
        <Select.Option value={p.typeName} key={p.typeName}>
            {p.typeName}
        </Select.Option>
    ));
}

export interface PetModalFormProps {
    title: string;
    visible: boolean;
    defaultPet: Omit<Pet, "owner">;
    onSubmit: (value: Omit<Pet, "owner">) => void;
    onCancel: () => void;
}

const PetModalForm = (props: PetModalFormProps) => {
    const { visible, onSubmit, onCancel, title, defaultPet } = props;
    const [form] = Form.useForm();
    const [petTypes, setPetTypes] = useState<PetCategory[]>([]);
    const pollCategories = () => {
        console.log("making call to backend");
        petsApi
            .getCategories()
            .then((res: AxiosResponse<PetCategoriesResponse>) =>
                setPetTypes(res.data.data)
            )
            .catch((err) => console.log(err));
    };
    useEffect(pollCategories, []);

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
                        const {
                            name,
                            category,
                            description,
                            requirements
                        } = values;
                        const record: Omit<Pet, "owner"> = {
                            name,
                            category,
                            description,
                            requirements
                        };
                        onSubmit(record);
                    })
                    .catch((err) => console.log("Validation failed:", err));
            }}
        >
            <Form form={form} initialValues={defaultPet}>
                <Form.Item
                    label="Pet Name"
                    name="name"
                    required
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (value?.length > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "Pet name cannot be empty!"
                                );
                            }
                        })
                    ]}
                >
                    <Input defaultValue={defaultPet.name}></Input>
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="category"
                    required
                    rules={[
                        () => ({
                            validator(rule, value) {
                                if (value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "Pet Category cannot be empty"
                                );
                            }
                        })
                    ]}
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a category"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option?.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {petCategoryOptions(petTypes)}
                    </Select>
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Requirements" name="requirements">
                    <Input.TextArea rows={7} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PetModalForm;
