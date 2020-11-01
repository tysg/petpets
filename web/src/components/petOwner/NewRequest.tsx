import React, { useEffect, useState } from "react";
import { pets as PetsApi } from "./../../common/api";
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

import { Pet, PetCategory } from "../../../../models/pet";

type SelectOption = Record<"value" | "label", string>;

function createOption(value: string): SelectOption {
    const capitalizedName = value.replace(/^\w/, (c) => c.toUpperCase());
    return {
        value: value,
        label: capitalizedName
    };
}

function petCategoriesFormOptions(pets: Pet[]): SelectOption[] {
    return Array.from(new Set(pets.map((p) => p.category)))
        .sort()
        .map((category) => createOption(category));
}

function getPetsForCategory(category: string, pets: Pet[]): SelectOption[] {
    return pets
        .filter((p) => p.category == category)
        .map((p) => createOption(p.name));
}

const NewRequest = () => {
    const [form] = Form.useForm();
    const [petCategoriesOptions, setPetCategoriesOptions] = useState<
        SelectOption[]
    >([]);

    const [userPets, setUserPets] = useState<Pet[]>([]);

    // fetch only once
    useEffect(() => {
        const liveFetch = async () => {
            try {
                const fetchedPets = (await PetsApi.getUserPets()).data.data;
                setUserPets(fetchedPets);
                setPetCategoriesOptions(petCategoriesFormOptions(fetchedPets));
            } catch (err) {
                console.log("fetchPetCategories err", err);
            }
        };
        liveFetch();
    }, []);

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
                <Form.Item label="Pet Name">
                    <Select
                        options={getPetsForCategory(
                            form.getFieldValue("Pet Category"),
                            userPets
                        )}
                    />
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
