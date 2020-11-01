import React, { useEffect, useState } from "react";
import { pets } from "./../../common/api";
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch
} from "antd";

import { PetCategory } from "../../../../models/pet";
const NewRequest = () => {
    const [petCategories, setPetCategories] = useState<PetCategory[]>([]);

    // live fetch pet categories
    useEffect(() => {
        const fetchPetCategories = async () => {
            try {
                const categories = await pets.getPetCategories();
                setPetCategories(categories.data.data);
            } catch (err) {
                console.log("fetchPetCategories err", err);
            }
        };

        fetchPetCategories();
    }, []); // execute only once

    const petCategoriesFormOptions: Record<
        "value" | "label",
        string
    >[] = petCategories.map((category) => {
        const nameCopy = category.typeName;
        nameCopy.replace(/^\w/, (c) => c.toUpperCase());
        return {
            value: category.typeName,
            label: nameCopy
        };
    });
    return (
        <>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
            >
                <Form.Item label="Input">
                    <Input />
                </Form.Item>
                <Form.Item label="Select">
                    <Select options={petCategoriesFormOptions} />
                </Form.Item>
                <Form.Item label="TreeSelect">
                    <TreeSelect
                        treeData={[
                            {
                                title: "Light",
                                value: "light",
                                children: [{ title: "Bamboo", value: "bamboo" }]
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Cascader">
                    <Cascader
                        options={[
                            {
                                value: "zhejiang",
                                label: "Zhejiang",
                                children: [
                                    {
                                        value: "hangzhou",
                                        label: "Hangzhou"
                                    }
                                ]
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item label="DatePicker">
                    <DatePicker />
                </Form.Item>
                <Form.Item label="InputNumber">
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Switch">
                    <Switch />
                </Form.Item>
                <Form.Item label="Button">
                    <Button>Button</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default NewRequest;
