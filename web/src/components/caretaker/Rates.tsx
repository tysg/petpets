import React, { PropsWithChildren, useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
    Button,
    Card,
    Carousel,
    Descriptions,
    Layout,
    message,
    PageHeader,
    Popconfirm,
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
import { useForm } from "antd/lib/form/Form";

const CHUNKSIZE = 8;

const PetCategoryCard = (category: PetCategory) => (
    <Card>
        <Card.Grid style={{ width: "180px", height: "160px" }}>
            <Statistic
                prefix="$"
                title={category.typeName}
                value={category.baseDailyPrice}
                precision={2}
            />
        </Card.Grid>
    </Card>
);

const CardGroup = ({ children }: PropsWithChildren<{}>) => (
    <Space>{children}</Space>
);

const columns = [
    {
        title: "Pet Category",
        dataIndex: "typeName",
        key: "category",
        width: "40%"
    },
    {
        title: "My Daily Price (SGD)",
        dataIndex: "ctPriceDaily",
        key: "price",
        width: "40%"
    }
];

interface UpdatableCareTaker extends CareTakerSpecializesDetails {
    updateCareTaker: () => void;
}

const Rates = (props: UpdatableCareTaker) => {
    const [categories, setCategories] = useState<PetCategory[]>([]);
    const [visible, setVisible] = useState(false);
    const [form] = useForm();
    const refreshRates = () => {
        petsApi
            .getCategories()
            .then((res) => res.data.data)
            .then((categories) => setCategories(categories))
            .catch((err) => message.error(err.response.data.err));
    };
    useEffect(refreshRates, []);
    const populateModal = (record: SpecializesIn | null) => {
        message.info("TODO: create and update specialization");
        setVisible(true);
    };
    const onDelete = (record: SpecializesIn) => {
        setVisible(false);
        message.info("TODO: remove specialization");
        props.updateCareTaker();
    };
    const actionColumn = {
        title: "Action",
        key: "action",
        width: "20%",
        render: (text: string, record: SpecializesIn, index: any) => {
            return (
                <Space size="middle">
                    <Button onClick={() => populateModal(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(record)}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            );
        }
    };
    return (
        <Layout>
            <PageHeader
                title="All Base Daily Rates"
                subTitle="Current base rates for pet categories"
            >
                <Carousel autoplay dotPosition="right">
                    {categories
                        .map((cat) => PetCategoryCard(cat))
                        .map(
                            (_, index, res) =>
                                index % CHUNKSIZE === 0 &&
                                res.slice(index, index + CHUNKSIZE)
                        )
                        .filter((x) => x)
                        .map((arr: any) => (
                            <CardGroup children={arr} />
                        ))}
                </Carousel>
            </PageHeader>
            <PageHeader
                title="My Specializations"
                subTitle="Manage your specializations here"
                extra={
                    <Button
                        size="large"
                        type="primary"
                        onClick={() => populateModal(null)}
                    >
                        New
                    </Button>
                }
            >
                <Table
                    dataSource={props.allSpecializes}
                    columns={[...columns, actionColumn]}
                    pagination={{ hideOnSinglePage: true, pageSize: 6 }}
                />
            </PageHeader>
        </Layout>
    );
};
export default Rates;
