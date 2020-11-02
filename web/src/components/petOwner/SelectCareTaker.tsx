import React, { Dispatch, useEffect, useState } from "react";
import { pets as PetsApi } from "../../common/api";
import { Select, DatePicker, Col, Row, Empty, Spin } from "antd";
import moment from "moment";
import { Pet } from "../../../../models/pet";
import { CareTakerDetails } from "../../../../models/careTaker";
import CareTakerCard from "./CareTakerCard";
import { Action, NewRequestState } from "./NewRequest";

const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

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

type SelectCareTakerProps = {
    state: NewRequestState;
    dispatch: Dispatch<Action>;
};
const SelectCareTaker = (props: SelectCareTakerProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userPets, setUserPets] = useState<Pet[]>([]);
    const [careTakers, setCareTakers] = useState<CareTakerDetails[]>([]);
    const { state, dispatch } = props;
    const { selectedCareTaker, selectedDates, selectedPet } = state;

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

    // fetch upon pet and date update
    useEffect(() => {
        setIsLoading(true);
        const fetchCareTakers = async () => {
            if (!selectedPet || !selectedDates) {
                // fetch only when both exists
                return;
            }
            try {
                const fetchedCareTakers = (
                    await PetsApi.getAvailableCareTakers(
                        selectedDates[0],
                        selectedDates[1],
                        selectedPet.category
                    )
                ).data.data;
                setCareTakers(fetchedCareTakers);
            } catch (err) {
                console.log("fetching caretaker err", err);
            }
        };
        fetchCareTakers();
        setIsLoading(false);
    }, [selectedPet, selectedDates]);

    const onSelectPet = (value: string, option: any) => {
        dispatch({
            type: "setPet",
            param: userPets.find((p) => p.name === value)
        });
    };

    const onSelectDates = (dates: any, dateStrings: any) => {
        dispatch({
            type: "setDates",
            param: dates
        });
    };

    return (
        <>
            <Row gutter={8}>
                <Col span={4}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Choose pet"
                        onChange={onSelectPet}
                        value={state.selectedPet?.name}
                    >
                        {petOptions(userPets)}
                    </Select>
                </Col>
                <Col span={8}>
                    <RangePicker
                        onChange={onSelectDates}
                        value={state.selectedDates}
                    />
                </Col>
            </Row>
            <br />
            {isLoading ? (
                <Spin />
            ) : careTakers.length === 0 ? (
                <Empty />
            ) : (
                <Row gutter={8}>
                    {careTakers.map((c) => (
                        <Col span={8}>
                            <CareTakerCard
                                ct={c}
                                state={state}
                                dispatch={dispatch}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default SelectCareTaker;
