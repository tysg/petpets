import React, { useEffect, useState } from "react";
import { pets as PetsApi } from "./../../common/api";
import {
    Select,
    DatePicker,
    Col,
    Row,
    Empty,
    Spin,
    Button,
    Space,
    List
} from "antd";
import { Pet } from "../../../../models/pet";
import PetsCard from "./PetCard";

const { Option, OptGroup } = Select;

const PetPage = () => {
    const [userPets, setUserPets] = useState<Pet[]>([]);

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

    return (
        <>
            <Row gutter={8}></Row>
            <br />
            {userPets.length === 0 ? (
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
