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
import PetModalForm from "./Modal";

const { Option, OptGroup } = Select;

const PetPage = () => {
    const [userPets, setUserPets] = useState<Pet[]>([]);
    const fetchUserPets = async () => {
        try {
            const fetchedPets = (await PetsApi.getUserPets()).data.data;
            setUserPets(fetchedPets);
        } catch (err) {
            console.log("fetchPetCategories err", err);
        }
    };
    // fetch only once
    useEffect(() => {
        fetchUserPets();
    }, []);

    // modal settings
    const [visibleModal, setVisibleModal] = useState(false);
    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const [record, setRecord] = useState<Omit<Pet, "owner">>({
        category: "",
        requirements: "",
        description: "",
        name: ""
    });
    const [title, setTitle] = useState("");

    const onSubmit = (values: Omit<Pet, "owner">) => {
        // TODO:axios here
        PetsApi.putPet(values)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                fetchUserPets();
                hideModal();
            });
    };
    const onDelete = (values: Omit<Pet, "owner">) => {
        // TODO:axios here
        PetsApi.deletePet(values)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                fetchUserPets();
                hideModal();
            });
    };
    const newModal = () => {
        setTitle("New Pet ");
        setRecord({
            category: "",
            requirements: "",
            description: "",
            name: ""
        });
        showModal();
    };
    const generateModal = (record: Omit<Pet, "owner">) => {
        setTitle("Edit Pet");
        setRecord(record);
        showModal();
    };

    return (
        <PageHeader
            title="Manage Pets"
            extra={
                <Button type="primary" onClick={newModal}>
                    Add Pet
                </Button>
            }
        >
            {visibleModal && (
                <PetModalForm
                    visible={visibleModal}
                    title={title}
                    onCancel={hideModal}
                    onSubmit={onSubmit}
                    defaultPet={record}
                ></PetModalForm>
            )}
            {userPets.length === 0 ? (
                <Empty />
            ) : (
                <Row gutter={8}>
                    {userPets.map((c) => (
                        <Col span={12}>
                            <PetsCard
                                pet={c}
                                // onSubmit={onSubmit}
                                generateModal={generateModal}
                                onDelete={onDelete}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </PageHeader>
    );
};

export default PetPage;
