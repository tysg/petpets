import { Input, Form, Modal, Rate } from "antd";
import React from "react";

const ReviewModal = (props: any) => {
    const { visible, onSubmit, onCancel, order } = props;
    const [form] = Form.useForm();
    console.log("check modal", order);

    return (
        <Modal
            destroyOnClose
            visible={visible}
            style={{ minHeight: "40%", minWidth: "50%" }}
            title={order?.fullname}
            centered
            okText="Submit"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        const { feedback, rating } = values;
                        onSubmit({ ...order, feedback, rating });
                    })
                    .catch((err) => console.log("Validation failed:", err));
            }}
        >
            <Form form={form} initialValues={order}>
                <Form.Item
                    label="Rating"
                    required
                    name="rating"
                    rules={[
                        () => ({
                            validator(rule, value) {
                                if (value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject("Rating cannot be empty");
                            }
                        })
                    ]}
                >
                    <Rate value={order?.rating} />
                </Form.Item>
                <Form.Item label="Feedback" name="feedback">
                    <Input.TextArea
                        style={{ minHeight: "10em" }}
                        bordered
                        showCount
                        value={order?.feedback}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ReviewModal;
