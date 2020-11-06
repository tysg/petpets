import React, { useEffect } from "react";
import { Button, List, Space, Avatar, message, Descriptions, Card } from "antd";
import {
    CloseOutlined,
    LikeOutlined,
    MessageOutlined,
    SmileOutlined,
    CoffeeOutlined
} from "@ant-design/icons";
import { Bid } from "../../../../models/bid";
import DescriptionsItem from "antd/lib/descriptions/Item";

const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Pet Name", dataIndex: "petname", key: "petname" },
    { title: "Earning", dataIndex: "earning", key: "earning" },
    { title: "Review", dataIndex: "review", key: "review" },
    { title: "Rating", dataIndex: "rating", key: "rating" }
];
const dataSource = [
    {
        key: "1",
        date: "11-11-2020",
        earning: "30",
        petname: "Kobe",
        review: "good",
        rating: "4"
    }
];

interface IconTextProps {
    icon: any;
    text: string;
}
const RejectButton = (props: IconTextProps) => {
    const { icon, text } = props;
    return (
        <Button danger>
            <Space>
                {text}
                {React.createElement(icon)}
            </Space>
        </Button>
    );
};

const IconText = (props: IconTextProps) => {
    const { icon, text } = props;
    return (
        <Button>
            <Space>
                {text}
                {React.createElement(icon)}
            </Space>
        </Button>
    );
};

interface AssignmentsProps {
    dataSource: Bid[];
    emptyMsg: string;
}

const Assignments = (props: AssignmentsProps) => {
    const { dataSource, emptyMsg } = props;
    console.log(dataSource);
    useEffect(() => {
        if (dataSource.length <= 0) {
            message.info(emptyMsg);
        }
    }, [dataSource]);
    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 3
            }}
            dataSource={dataSource}
            footer={
                <div>
                    Built with love and coffee
                    <CoffeeOutlined />
                </div>
            }
            renderItem={({
                pet_name,
                pet_owner,
                start_date,
                bid_status,
                feedback,
                rating,
                transport_method,
                end_date,
                ct_price
            }) => (
                <List.Item
                    key={pet_name + pet_owner + start_date}
                    actions={[
                        <IconText
                            icon={LikeOutlined}
                            text="Accept"
                            key="list-vertical-star-o"
                        />,
                        <RejectButton
                            icon={CloseOutlined}
                            text="Reject"
                            key="list-vertical-message"
                        />
                    ]}
                >
                    <Card>
                        <List.Item.Meta
                            avatar={<Avatar icon={<SmileOutlined />} />}
                            title={pet_name}
                            description={bid_status}
                        />
                        <Descriptions bordered>
                            <DescriptionsItem label="Transport Method">
                                {transport_method}
                            </DescriptionsItem>
                            <DescriptionsItem label="End Date">
                                {end_date}
                            </DescriptionsItem>
                            <DescriptionsItem label="Price">
                                {ct_price}
                            </DescriptionsItem>
                            <DescriptionsItem label="Feedback" span={2}>
                                {feedback}
                            </DescriptionsItem>
                            <DescriptionsItem label="Rating" span={1}>
                                {rating}
                            </DescriptionsItem>
                        </Descriptions>
                    </Card>
                </List.Item>
            )}
        />
    );
};

export default Assignments;
