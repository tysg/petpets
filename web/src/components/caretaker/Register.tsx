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
    message,
    Result
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
import { RouteComponentProps } from "react-router-dom";

interface NewCareTaker {
    careTakerStatus: "ft" | "pt";
    allSpecializesIn: SpecializesIn[];
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
                    const { careTakerStatus, allSpecializesIn } = values;
                    const res = {
                        careTakerStatus,
                        allSpecializesIn: allSpecializesIn.map(
                            (typeName: string) => ({
                                typeName,
                                ctPriceDaily: 0
                            })
                        )
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
                <FormItem label="Specialty" name="allSpecializesIn">
                    <Select
                        placeholder="Select Specialty"
                        style={{ width: "100%" }}
                        mode="multiple"
                    >
                        {petTypes.map(({ typeName }) => (
                            <Select.Option value={typeName}>
                                {typeName}
                            </Select.Option>
                        ))}
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    );
};

const Register = (props: RouteComponentProps) => {
    const [visibleModal, setVisibleModal] = useState(false);
    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const onSubmit = (formResult: NewCareTaker) => {
        const endpoint =
            formResult.careTakerStatus === "ft"
                ? careTakerApi.newFulltimer
                : careTakerApi.newParttimer;
        endpoint(formResult.allSpecializesIn)
            .then((res) => {
                message.success(res.data.data);
                setTimeout(() => props.history.go(0), 1000);
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
                    onCancel={hideModal}
                ></ModalForm>
                <Result
                    title="You are not registered as a Pet Sitter yet!"
                    subTitle="What are you waiting for?"
                    extra={[
                        <Button onClick={showModal} type="primary">
                            Register Now!
                        </Button>
                    ]}
                ></Result>
            </Col>
        </Row>
    );
};
export default Register;
