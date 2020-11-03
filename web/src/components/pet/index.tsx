import React, { useEffect, useState } from "react";
import { pets as PetsApi } from "./../../common/api";
import { Select, DatePicker, Col, Row, Empty, Spin, Button, Space, List } from "antd";
import moment from "moment";
import { Pet } from "../../../../models/pet";
import PetsCard from "./PetCard";

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

const PetPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userPets, setUserPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet>();

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

    // // fetch upon pet and date update
    // useEffect(() => {
    //     setIsLoading(true);
    //     const fetchCareTakers = async () => {
    //         if (!selectedPet || !selectedDates) {
    //             // fetch only when both exists
    //             return;
    //         }
    //         try {
    //             const fetchedCareTakers = (
    //                 await PetsApi.getAvailableCareTakers(
    //                     selectedDates[0],
    //                     selectedDates[1],
    //                     selectedPet.category
    //                 )
    //             ).data.data;
    //             setCareTakers(fetchedCareTakers);
    //         } catch (err) {
    //             console.log("fetching caretaker err", err);
    //         }
    //     };
    //     fetchCareTakers();
    //     setIsLoading(false);
    // }, [selectedPet, selectedDates]);

    // const onSelectPet = (value: string, option: any) => {
    //     setSelectedPet(userPets.find((p) => p.name === value));
    // };

    // const onSelectDates = (dates: any, dateStrings: any) => {
    //     setSelectedDates(dates);
    // };

    return (
        <>
            <Row gutter={8}></Row>
            <br />
            {isLoading ? (
                <Spin />
            ) : userPets.length === 0 ? (
                <Empty />
            ) : (
                <Space>
                <Row gutter={8}>
                    <List itemLayout="vertical">
                    <List.Item>
                    {userPets.map((c) => (
                        <Col span={8}>
                            <PetsCard {...c} />                    
                        </Col>
                    ))}
                    </List.Item>
                    </List>                  
                         <Button type="primary">Add Pet</Button>
                </Row>
                </Space>   
            )}
        </>
    );
};

export default PetPage;
