import React, { ReactNodeArray, useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
    Button,
    Card,
    Carousel,
    Descriptions,
    Layout,
    message,
    PageHeader,
    Row,
    Space,
    Statistic,
    Table,
    Typography
} from "antd";
import {
    CareTakerSpecializesDetails,
    SpecializesIn
} from "../../../../models/careTaker";
import { pets as petsApi } from "../../common/api";
import { PetCategory } from "../../../../models/pet";

const CHUNKSIZE = 8;

const PetCategoryCard = (category: PetCategory) => (
    <Card>
        <Card.Grid style={{ height: "10rem" }}>
            <Statistic
                title={category.typeName}
                value={category.baseDailyPrice}
                precision={2}
            />
        </Card.Grid>
    </Card>
);

const CardGroup = (cards: ReactNodeArray) => <Space>{cards}</Space>;

const columns = [
    {
        title: "Pet Category",
        dataIndex: "typeName",
        key: "category",
        width: "40%"
    },
    {
        title: "Daily Price (SGD)",
        dataIndex: "baseDailyPrice",
        key: "price",
        width: "40%"
    }
];

const Rates = (props: CareTakerSpecializesDetails) => {
    const [categories, setCategories] = useState<PetCategory[]>([]);
    const refreshRates = () => {
        petsApi
            .getCategories()
            .then((res) => res.data.data)
            .then((categories) => setCategories(categories))
            .catch((err) => message.error(err.response.data.err));
    };
    useEffect(refreshRates, []);
    const actionColumn = {
        title: "Action",
        key: "action",
        width: "20%",
        render: (text: string, record: SpecializesIn, index: any) => {
            return (
                <Space size="middle">
                    <Button>Edit</Button>
                    <Button danger>Delete</Button>
                </Space>
            );
        }
    };
    return (
        <Layout>
            <PageHeader title="Base Daily Rates">
                <Carousel autoplay arrows>
                    {categories
                        .filter((cat) =>
                            props.allSpecializes
                                .map(({ typeName }) => typeName)
                                .includes(cat.typeName)
                        )
                        .map((cat) => PetCategoryCard(cat))
                        .map(
                            (card, index, res) =>
                                index % CHUNKSIZE === 0 &&
                                res.splice(index, index + CHUNKSIZE)
                        )
                        .filter((x) => x)
                        .map((arr: any) => CardGroup(arr))}
                </Carousel>
            </PageHeader>
            <PageHeader title="My Specializations">
                <Table
                    dataSource={props.allSpecializes}
                    columns={[...columns, actionColumn]}
                ></Table>
            </PageHeader>
        </Layout>
    );
};
export default Rates;
