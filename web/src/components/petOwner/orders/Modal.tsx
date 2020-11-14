import { Input, Form, Modal, Rate } from "antd";
import React from "react";

const ReviewModal = (props: any) => {
    const { visible, onSubmit, onCancel, title, order } = props;
    console.log(props, "order props");
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
                        const { feedback, rating } = values;
                        console.log(order);
                        onSubmit({ ...order, feedback, rating });
                    })
                    .catch((err) => console.log("Validation failed:", err));
            }}
        >
            <Form form={form} initialValues={order}>
                <Form.Item label="Feedback" name="feedback">
                    <Input defaultValue={order?.feedback}></Input>
                </Form.Item>
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
                    <Rate defaultValue={order?.avg_rating} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ReviewModal;
