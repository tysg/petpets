import React, { useEffect } from "react";
import {
    Button,
    Space,
    Descriptions,
    Card,
    Row,
    Col,
    PageHeader,
    Statistic,
    Tag,
    Divider
} from "antd";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { BidJoinOwnerPet } from "../../../../models/bid";
import DescriptionsItem from "antd/lib/descriptions/Item";

interface IconTextProps {
    icon: any;
    text: string;
}

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

export default (props: BidJoinOwnerPet) => (
    <Card>
        <PageHeader
            title="Jan Michael Vincent"
            avatar={{
                size: 80,
                src:
                    "https://s3.amazonaws.com/uifaces/faces/twitter/hjartstrorn/128.jpg"
            }}
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
                            label="Instructions from Owner"
                            span={3}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Perferendis ratione fugit reprehenderit,
                            molestiae, dicta neque maxime laboriosam, in ipsum
                            laborum necessitatibus! Non itaque provident nihil
                            esse commodi vitae, accusantium hic.
                        </DescriptionsItem>
                    </Descriptions>
                </Col>
                <Col span={4}>
                    <Row>
                        <Statistic
                            title="Payout"
                            prefix="$"
                            precision={2}
                            value={200.3}
                        />
                    </Row>
                </Col>
            </Row>
        </PageHeader>
    </Card>
);
