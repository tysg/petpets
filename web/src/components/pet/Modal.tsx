import { Input, Select, Form } from "antd";
import FormItem from "antd/lib/form/FormItem";
import Modal from "antd/lib/modal/Modal";
import { AxiosResponse } from "axios";
import React, { EffectCallback, useEffect, useState } from "react";
import {
    Pet,
    PetCategory,
    PetCategoriesResponse
} from "../../../../models/pet";
import { pets as petsApi } from "../../common/api";
import { getUser } from "./../../common/token";

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
    defaultPet: Pet;
    onSubmit: (value: Pet) => void;
    onCancel: () => void;
}

const PetModalForm = (props: PetModalFormProps) => {
    const { visible, onSubmit, onCancel, title, defaultPet } = props;
    const [form] = Form.useForm();
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
                        const record: Pet = {
                            name,
                            category,
                            owner: getUser()!.email,
                            description,
                            requirements
                        };
                        onSubmit(record);
                    })
                    .catch((err) => console.log("Validation failed:", err));
            }}
        >
            <Form form={form} initialValues={defaultPet}>
                <FormItem
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
                </FormItem>
                <FormItem label="Category" name="category">
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a category"
                        optionFilterProp="children"
                        // onChange={onChange}
                        // onFocus={onFocus}
                        // onBlur={onBlur}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                            option?.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {petCategoryOptions(petTypes)}
                    </Select>
                </FormItem>
                <FormItem label="Description" name="description">
                    <Input.TextArea rows={4} />
                </FormItem>
                <FormItem label="Requirements" name="requirements">
                    <Input.TextArea rows={7} />
                </FormItem>
            </Form>
        </Modal>
    );
};

export default PetModalForm;
