import React from "react";
import { Avatar, Card, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Pet } from "../../../../models/pet";

const { Meta } = Card;

type PetCardProps = {
    pet: Pet;
    generateModal: (rec: Omit<Pet, "owner">) => void;
    onDelete: (rec: Omit<Pet, "owner">) => void;
};

const PetCard = (props: PetCardProps) => {
    const { pet, generateModal, onDelete } = props;
    return (
        <Card
            actions={[
                <EditOutlined
                    key="edit"
                    onClick={() => {
                        generateModal(pet);
                    }}
                />,
                <DeleteOutlined
                    key="delete"
                    onClick={() => {
                        Modal.confirm({
                            title: "Do you really want to delete this pet?",
                            onOk: () => {
                                onDelete(pet);
                            },
                            okText: "Confirm"
                        });
                    }}
                />
            ]}
            style={{ height: "100%" }}
        >
            <Meta
                avatar={
                    <Avatar
                        style={{
                            backgroundColor: "#f56a00",
                            verticalAlign: "middle"
                        }}
                        size="large"
                    >
                        {pet.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={pet.name + " / " + pet.category}
                description={
                    <>
                        <p>
                            {"Descriptions: "}
                            <br />
                            {pet.description}
                        </p>
                        <p>
                            {"Requirements: "}
                            <br />
                            {pet.requirements}
                        </p>
                    </>
                }
            />
        </Card>
    );
};
export default PetCard;
