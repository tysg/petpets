import React from "react";
import { Avatar, Card } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Pet } from "../../../../models/pet";

const { Meta } = Card;

const PetCard = (props: Pet) => {
    return (
        <Card
            actions={[<EditOutlined key="edit" />]}
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
                        {props.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={props.name + " / " + props.category}
                description={
                    <>
                        <p>
                            {"Descriptions: "}
                            <br />
                            {props.description}
                        </p>
                        <p>
                            {"Requirements: "}
                            <br />
                            {props.requirements}
                        </p>
                    </>
                }
            />
        </Card>
    );
};
export default PetCard;
