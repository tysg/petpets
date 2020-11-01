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
    Switch,
    Col,
    Row,
    AutoComplete
} from "antd";
import moment from "moment";
import { Pet, PetCategory } from "../../../../models/pet";
import { use } from "passport";

const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;
type SelectOption = Record<"value" | "label", string>;

function createOption(value: string): SelectOption {
    const capitalizedName = value.replace(/^\w/, (c) => c.toUpperCase());
    return {
        value: value,
        label: capitalizedName
    };
}

// function handleChange(value) {
//     console.log(`selected ${value}`);
// }

// ReactDOM.render(
//     <Select defaultValue="lucy" style={{ width: 200 }} onChange={handleChange}>
//         <OptGroup label="Manager">
//             <Option value="jack">Jack</Option>
//             <Option value="lucy">Lucy</Option>
//         </OptGroup>
//         <OptGroup label="Engineer">
//             <Option value="Yiminghe">yiminghe</Option>
//         </OptGroup>
//     </Select>,
//     mountNode
// );

function petOptions(pets: Pet[]) {
    const categories = Array.from(new Set(pets.map((p) => p.category))).sort();
    return categories.map((category) => (
        <OptGroup label={category} key={category}>
            {pets
                .filter((p) => p.category === category)
                .map((p) => (
                    <Option value={p.name} key={p.name}>
                        {p.name}
                    </Option>
                ))}
        </OptGroup>
    ));
}

const NewRequest = () => {
    const [userPets, setUserPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet>();
    const [selectedDates, setSelectedDates] = useState<
        [moment.Moment, moment.Moment]
    >();

    // fetch only once
    useEffect(() => {
        const liveFetch = async () => {
            try {
                const fetchedPets = (await PetsApi.getUserPets()).data.data;
                setUserPets(fetchedPets);
            } catch (err) {
                console.log("fetchPetCategories err", err);
            }
        };
        liveFetch();
    }, []);

    const onSelectPet = (value: string, option: any) => {
        setSelectedPet(userPets.find((p) => p.name === value));
    };

    const onSelectDates = (dates: any, dateStrings: any) => {
        setSelectedDates(dates);
    };

    return (
        <>
            <Input.Group>
                <Row gutter={8}>
                    <Col span={4}>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Choose pet"
                            onChange={onSelectPet}
                        >
                            {petOptions(userPets)}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <RangePicker onChange={onSelectDates} />
                    </Col>
                </Row>
            </Input.Group>
        </>
    );
};

export default NewRequest;
