import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
    Typography,
    Row,
    Col,
    Button,
    Input,
    Select,
    Radio,
    message
} from "antd";
import Modal, { ModalProps } from "antd/lib/modal/Modal";
import Form, { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { careTaker as careTakerApi, pets as petsApi } from "../../common/api";
import {
    Pet,
    PetCategory,
    PetCategoriesResponse
} from "../../../../models/pet";
import { AxiosResponse } from "axios";
import { SpecializesIn } from "../../../../models/careTaker";

interface NewCareTaker {
    careTakerStatus: "ft" | "pt";
    // allSpecializesIn: SpecializesIn[];
}
interface ModalFormProps extends ModalProps {
    onSubmit: (value: NewCareTaker) => void;
}

const ModalForm = (props: ModalFormProps) => {
    const { onSubmit } = props;
    const [form] = useForm();
    const [petTypes, setPetTypes] = useState<PetCategory[]>([]);
    const pollCategories = () => {
        console.log("making call to backend");
        petsApi
            .getCategories()
            .then((res: AxiosResponse<PetCategoriesResponse>) =>
                setPetTypes(res.data.data)
            )
            .catch((err) => console.log(err));
    };
    useEffect(pollCategories, []);
    return (
        <Modal
            {...props}
            onOk={() => {
                form.validateFields().then((values) => {
                    form.resetFields();
                    const { careTakerStatus } = values;
                    const res = {
                        careTakerStatus
                        // allSpecializesIn: [specializesIn]
                    };
                    onSubmit(res);
                });
            }}
        >
            <Form form={form}>
                <FormItem label="Employment Type" name="careTakerStatus">
                    <Radio.Group>
                        <Radio value="ft">Full-Time</Radio>
                        <Radio value="pt">Part-Time</Radio>
                    </Radio.Group>
                </FormItem>
                {/* <FormItem label="Specialty" name="specializesIn">
                    <Select
                        placeholder="Select Specialty"
                        style={{ width: "100%" }}
                        onChange={(value) => console.log(value)}
                    >
                        {petTypes.map(({ typeName }) => (
                            <Select.Option value={typeName}>
                                {typeName}
                            </Select.Option>
                        ))}
                    </Select>
                </FormItem> */}
            </Form>
        </Modal>
    );
};

const Register = () => {
    const [visibleModal, setVisibleModal] = useState(false);
    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const onSubmit = (formResult: NewCareTaker) => {
        const promise =
            formResult.careTakerStatus === "ft"
                ? careTakerApi.newFulltimer()
                : careTakerApi.newParttimer();
        promise
            .then((res) => {
                console.log("Successfully created new CareTaker");
            })
            .catch((err) => {
                message.error(err.response.data.err);
            })
            .finally(hideModal);
    };

    return (
        <Row style={{ height: "100%" }} justify="center" align="middle">
            <Col>
                <ModalForm
                    title="New Pet Sitter"
                    visible={visibleModal}
                    onSubmit={onSubmit}
                ></ModalForm>
                <Typography.Paragraph>
                    You are not registered as a Pet Sitter yet.
                </Typography.Paragraph>
                <Button onClick={showModal}>Register now?</Button>
            </Col>
        </Row>
    );
};
export default Register;
