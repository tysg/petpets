import React, { PropsWithChildren, useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
    Button,
    Card,
    Carousel,
    Input,
    InputNumber,
    Layout,
    message,
    PageHeader,
    Popconfirm,
    Select,
    Space,
    Statistic,
    Table
} from "antd";
import {
    CareTakerSpecializesDetails,
    SpecializesIn
} from "../../../../models/careTaker";
import { pets as petsApi, careTaker as careTakerApi } from "../../common/api";
import { PetCategory } from "../../../../models/pet";
import Form, { FormProps, useForm } from "antd/lib/form/Form";
import { ModalProps } from "antd/lib/modal";
import Modal from "antd/lib/modal/Modal";
import FormItem from "antd/lib/form/FormItem";

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
        title: "My Daily Rates(SGD)",
        dataIndex: "ctPriceDaily",
        key: "price",
        width: "40%"
    }
];

const checkPrice = (_: any, value: any) => {
    return value >= 0
        ? Promise.resolve()
        : Promise.reject("Not a valid price!");
};

const ModalForm = (props: ModalProps & FormProps) => (
    <Modal {...props}>
        <Form form={props.form}>
            <FormItem name="typeName" label="Pet Type">
                <Input disabled />
            </FormItem>
            <FormItem
                name="ctPriceDaily"
                label="My Daily Rate"
                rules={[{ validator: checkPrice }]}
            >
                <InputNumber />
            </FormItem>
        </Form>
    </Modal>
);

interface AugmentProps extends ModalProps {
    categories: PetCategory[];
}
const ModalFormAugment = (props: AugmentProps & FormProps) => (
    <Modal {...props}>
        <Form form={props.form}>
            <FormItem name="typeName" label="Pet Type">
                <Select
                    placeholder="Select Specialty"
                    style={{ width: "100%" }}
                >
                    {props.categories.map(({ typeName }) => (
                        <Select.Option value={typeName}>
                            {typeName}
                        </Select.Option>
                    ))}
                </Select>
            </FormItem>
            <FormItem
                name="ctPriceDaily"
                label="My Daily Rate"
                rules={[{ validator: checkPrice }]}
            >
                <InputNumber />
            </FormItem>
        </Form>
    </Modal>
);

interface UpdatableCareTaker extends CareTakerSpecializesDetails {
    updateCareTaker: () => void;
}

const Rates = (props: UpdatableCareTaker) => {
    const [categories, setCategories] = useState<PetCategory[]>([]);
    const [visible, setVisible] = useState(false);
    const [sndVisible, setSndVisible] = useState(false);
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
        if (record) {
            form.setFieldsValue(record);
            setVisible(true);
        } else {
            form.resetFields();
            setSndVisible(true);
        }
    };
    const onDelete = (record: SpecializesIn) => {
        setVisible(false);
        const remaining = props.allSpecializes.filter(
            (spec) => spec.typeName !== record.typeName
        );
        const careTaker: CareTakerSpecializesDetails = {
            ...props,
            allSpecializes: remaining
        };
        careTakerApi
            .patchCareTaker(careTaker, props.caretakerStatus)
            .then((res) => message.info(res.data.data))
            .catch((err) => message.error(err.response.data.data));
        props.updateCareTaker();
    };
    const onSubmit = () => {
        form.validateFields()
            .then((record) =>
                props.allSpecializes
                    .filter((spec) => spec.typeName !== record.typeName)
                    .concat({
                        typeName: record.typeName,
                        ctPriceDaily: record.ctPriceDaily
                    })
            )
            .then((newSpecList) => {
                const careTaker: CareTakerSpecializesDetails = {
                    ...props,
                    allSpecializes: newSpecList
                };
                console.log(careTaker);
                careTakerApi
                    .patchCareTaker(careTaker, props.caretakerStatus)
                    .then((res) => message.info(res.data.data))
                    .catch((err) => message.error(err.response.data.data));
            })
            .finally(() => {
                setVisible(false);
                setSndVisible(false);
                props.updateCareTaker();
            });
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
                <ModalForm
                    title="Edit My Specializations"
                    form={form}
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    onOk={onSubmit}
                />
                <ModalFormAugment
                    title="New Specialization"
                    form={form}
                    visible={sndVisible}
                    onCancel={() => setSndVisible(false)}
                    onOk={onSubmit}
                    categories={categories}
                />
            </PageHeader>
        </Layout>
    );
};
export default Rates;
