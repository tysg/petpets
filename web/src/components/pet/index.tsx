import React, { useEffect, useState } from "react";
import { pets as PetsApi } from "./../../common/api";
import { Col, Row, Empty, Button, PageHeader, message } from "antd";
import { Pet } from "../../../../models/pet";
import PetsCard from "./PetCard";
import PetModalForm from "./Modal";

interface PetPageProps {
    pets: Pet[];
    update: () => Promise<void>;
}
const PetPage = (props: PetPageProps) => {
    const userPets = props.pets;
    const fetchUserPets = props.update;

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

    const onSubmit = async (values: Omit<Pet, "owner">) => {
        try {
            if (userPets.find((p) => p.name === values.name)) {
                await PetsApi.putPet(values);
                message.success("Successfully edited pet!");
            } else {
                await PetsApi.postPet(values);
                message.success("Successfully created pet!");
            }
        } catch (err) {
            message.error("Something is wrong: " + err);
            console.log(err);
        } finally {
            fetchUserPets();
            hideModal();
        }
    };
    const onDelete = (values: Omit<Pet, "owner">) => {
        PetsApi.deletePet(values)
            .then((res) => {
                message.success("Successfully deleted pet!");
                console.log(res);
            })
            .catch((err) => {
                message.error("There was an error deleting your pet.");
                console.log(err);
            })
            .finally(() => {
                fetchUserPets();
                hideModal();
            });
    };
    const newModal = () => {
        setTitle("New Pet");
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
