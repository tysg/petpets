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
    Divider,
    Rate
} from "antd";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { BidJoinOwnerPet } from "../../../../models/bid";
import DescriptionsItem from "antd/lib/descriptions/Item";

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
                <Col>
                    <Descriptions bordered layout="vertical">
                        <DescriptionsItem label="Pet">
                            <Space align="center">
                                Doofensmirthz
                                <Tag>Unicorn</Tag>
                            </Space>
                        </DescriptionsItem>
                        <DescriptionsItem label="Duration">
                            20 Aug 2020 - 31 Aug 2020
                        </DescriptionsItem>
                        <DescriptionsItem label="Rating">
                            <Rate disabled allowHalf defaultValue={4.4} />
                        </DescriptionsItem>
                        <DescriptionsItem label="Review" span={3}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Perferendis ratione fugit reprehenderit,
                            molestiae, dicta neque maxime laboriosam, in ipsum
                            laborum necessitatibus! Non itaque provident nihil
                            esse commodi vitae, accusantium hic.
                        </DescriptionsItem>
                    </Descriptions>
                </Col>
            </Row>
        </PageHeader>
    </Card>
);
