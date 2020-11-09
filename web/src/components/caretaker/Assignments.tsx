import React, { useEffect } from "react";
import {
    Button,
    List,
    Space,
    message,
    Descriptions,
    Card,
    Row,
    Col,
    Typography,
    PageHeader,
    Statistic,
    Tag,
    Divider
} from "antd";
import {
    CloseOutlined,
    LikeOutlined,
    CoffeeOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { Bid } from "../../../../models/bid";
import DescriptionsItem from "antd/lib/descriptions/Item";

const { Paragraph, Title } = Typography;

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

const Accept = () => {
    return (
        <Button type="primary">
            <Space>
                Accept
                <CheckCircleOutlined />
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
                <List.Item key={pet_name + pet_owner + start_date}>
                    <Card>
                        <PageHeader
                            title="Jan Michael Vincent"
                            avatar={{
                                size: 80,
                                src:
                                    "https://s3.amazonaws.com/uifaces/faces/twitter/hjartstrorn/128.jpg"
                            }}
                            extra={[
                                <Accept />,
                                <RejectButton
                                    icon={CloseOutlined}
                                    text="Reject"
                                    key="list-vertical-message"
                                />
                            ]}
                            subTitle=" 10 Buangkok Road, Medical Park, Singapore 537948 "
                        >
                            <Row gutter={[48, 16]}>
                                <Col span={20}>
                                    <Descriptions bordered layout="vertical">
                                        <DescriptionsItem label="Contact">
                                            90049384
                                        </DescriptionsItem>
                                        <DescriptionsItem label="Pet">
                                            <Space align="center">
                                                Doofensmirthz
                                                <Tag>Unicorn</Tag>
                                            </Space>
                                        </DescriptionsItem>
                                        <DescriptionsItem label="Duration">
                                            20 Aug 2020 - 31 Aug 2020
                                        </DescriptionsItem>
                                        <DescriptionsItem
                                            label="Notes from Owner"
                                            span={3}
                                        >
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipisicing elit.
                                            Perferendis ratione fugit
                                            reprehenderit, molestiae, dicta
                                            neque maxime laboriosam, in ipsum
                                            laborum necessitatibus! Non itaque
                                            provident nihil esse commodi vitae,
                                            accusantium hic.
                                        </DescriptionsItem>
                                    </Descriptions>
                                </Col>
                                <Col span={4}>
                                    <Row>
                                        <Statistic
                                            title="Daily Rate"
                                            prefix="$"
                                            precision={2}
                                            value={200.3}
                                        />
                                    </Row>
                                    <Divider />
                                    <Row>
                                        <Statistic
                                            title="Transfer Method"
                                            value="PCS Building"
                                        />
                                    </Row>
                                </Col>
                            </Row>
                        </PageHeader>
                    </Card>
                </List.Item>
            )}
        />
    );
};

export default Assignments;
