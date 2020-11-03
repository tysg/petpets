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
    List,
    PageHeader
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
        <PageHeader
            title="Manage Pets"
            extra={<Button type="primary">Add Pet</Button>}
        >
            {userPets.length === 0 ? (
                <Empty />
            ) : (
                <Row gutter={8}>
                    {userPets.map((c) => (
                        <Col span={12}>
                            <PetsCard {...c} />
                        </Col>
                    ))}
                </Row>
            )}
        </PageHeader>
    );
};

export default PetPage;
