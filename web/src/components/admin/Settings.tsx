import {
    Button,
    Input,
    InputNumber,
    Layout,
    PageHeader,
    Space,
    Table,
    Form
} from "antd";
import { FormProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import Modal, { ModalFuncProps, ModalProps } from "antd/lib/modal/Modal";
import { AxiosResponse } from "axios";
import React, {
    EffectCallback,
    PropsWithChildren,
    useEffect,
    useState
} from "react";
import { PetCategoriesResponse, PetCategory } from "../../../../models/pet";
import { pets as petsApi } from "../../common/api";

const checkPrice = (_: any, value: any) => {
    return value.number > 0
        ? Promise.resolve()
        : Promise.reject("Price must be more than 0");
};

interface ModalFormProps {
    title: string;
    visible: boolean;
    defaultPet: PetCategory;
    onSubmit: (value: PetCategory) => void;
    onCancel: () => void;
}

const ModalForm = (props: ModalFormProps) => {
    const { visible, onSubmit, onCancel, title, defaultPet } = props;
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title={title}
            okText="Submit"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        const { typeName, baseDailyPrice } = values;
                        const record: PetCategory = {
                            typeName,
                            baseDailyPrice
                        };
                        onSubmit(record);
                    })
                    .catch((err) => console.log("Validation failed:", err));
            }}
        >
            <Form form={form} initialValues={defaultPet}>
                <FormItem
                    label="Pet Category"
                    name="typeName"
                    required
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (value?.length > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "Pet Category cannot be empty!"
                                );
                            }
                        })
                    ]}
                >
                    <Input defaultValue={defaultPet.typeName}></Input>
                </FormItem>
                <FormItem label="Base Daily Price" name="baseDailyPrice">
                    <InputNumber defaultValue={defaultPet.baseDailyPrice} />
                </FormItem>
            </Form>
        </Modal>
    );
};

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

const Settings = () => {
    const [petTypes, setPetTypes] = useState<PetCategory[]>([]);
    const pollCategories: EffectCallback = () => {
        console.log("making call to backend");
        petsApi
            .getCategories()
            .then((res: AxiosResponse<PetCategoriesResponse>) =>
                setPetTypes(res.data.data)
            )
            .catch((err) => console.log(err));
    };
    const [visibleModal, setVisibleModal] = useState(false);
    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const [record, setRecord] = useState({
        typeName: "",
        baseDailyPrice: 0
    });
    const [title, setTitle] = useState("");
    const actionColumn = {
        title: "Action",
        key: "action",
        width: "20%",
        render: (text: string, record: PetCategory, index: any) => {
            return (
                <Space size="middle">
                    <Button onClick={() => generateModal(record)}>Edit</Button>
                    <Button danger onClick={() => onDelete(record)}>
                        Delete
                    </Button>
                </Space>
            );
        }
    };
    // petTypes[0].
    const onSubmit = (values: PetCategory) => {
        // TODO:axios here
        petsApi
            .putCategory(values)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                pollCategories();
                hideModal();
            });
    };
    const onDelete = (values: PetCategory) => {
        // TODO:axios here
        petsApi
            .removeCategory(values)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                pollCategories();
                hideModal();
            });
    };
    const newModal = () => {
        setTitle("New Pet Category");
        setRecord(record);
        setRecord({ typeName: "", baseDailyPrice: 0 });
        showModal();
    };
    const generateModal = (record: PetCategory) => {
        setTitle("Manage Category");
        setRecord(record);
        showModal();
    };
    useEffect(pollCategories, []);
    return (
        <PageHeader
            className="site-page-header-responsive"
            title="Manage Pet Categories"
            subTitle="Add, delete or modify pet categories"
            extra={
                <Button size="large" onClick={newModal}>
                    New
                </Button>
            }
        >
            {visibleModal && (
                <ModalForm
                    visible={visibleModal}
                    title={title}
                    onCancel={hideModal}
                    onSubmit={onSubmit}
                    defaultPet={record}
                ></ModalForm>
            )}
            <Table
                dataSource={petTypes}
                columns={[...columns, actionColumn]}
            ></Table>
        </PageHeader>
    );
};

export default Settings;
