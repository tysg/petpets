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

type SelectOptions = Record<"value" | "label", string>;
function petCategoriesFormOptions(categories: PetCategory[]): SelectOptions[] {
    return categories.map((category) => {
        const capitalizedName = category.typeName.replace(/^\w/, (c) =>
            c.toUpperCase()
        );

        return {
            value: category.typeName,
            label: capitalizedName
        };
    });
}

const NewRequest = () => {
    const [petCategoriesOptions, setPetCategoriesOptions] = useState<
        SelectOptions[]
    >([]);

    // live fetch pet categories
    useEffect(() => {
        const fetchPetCategories = async () => {
            try {
                const categories = (await pets.getPetCategories()).data.data;
                setPetCategoriesOptions(petCategoriesFormOptions(categories));
            } catch (err) {
                console.log("fetchPetCategories err", err);
            }
        };
        fetchPetCategories();
    }, []); // execute only once

    return (
        <>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
            >
                {/* <Form.Item label="Input">
                    <Input />
                </Form.Item> */}
                <Form.Item label="Pet Category">
                    <Select options={petCategoriesOptions} />
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
