import React, {
    FunctionComponent,
    ReactComponentElement,
    useEffect
} from "react";
import { List, Space, Avatar, message } from "antd";
import {
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
    SmileOutlined,
    CoffeeOutlined
} from "@ant-design/icons";
import { Bid } from "../../../../models/bid";

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

const IconText = (props: IconTextProps) => {
    const { icon, text } = props;
    return (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
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
                feedback
            }) => (
                <List.Item
                    key={pet_name + pet_owner + start_date}
                    actions={[
                        <IconText
                            icon={StarOutlined}
                            text="156"
                            key="list-vertical-star-o"
                        />,
                        <IconText
                            icon={LikeOutlined}
                            text="156"
                            key="list-vertical-like-o"
                        />,
                        <IconText
                            icon={MessageOutlined}
                            text="2"
                            key="list-vertical-message"
                        />
                    ]}
                    extra={
                        <img
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                    }
                >
                    <List.Item.Meta
                        avatar={<Avatar icon={<SmileOutlined />} />}
                        title={pet_name}
                        description={bid_status}
                    />
                    {feedback}
                </List.Item>
            )}
        />
    );
};

export default Assignments;
