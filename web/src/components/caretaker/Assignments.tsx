import React, { useEffect } from "react";
import { List, message } from "antd";
import { CoffeeOutlined } from "@ant-design/icons";
import { BidJoinOwnerPet } from "../../../../models/bid";
import AssignmentCard from "./AssignmentCard";

interface AssignmentsProps {
    dataSource: BidJoinOwnerPet[];
    emptyMsg: string;
    card: React.FC<BidJoinOwnerPet>;
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
            // pagination={{
            //     onChange: (page) => {
            //         console.log(page);
            //     },
            //     pageSize: 3
            // }}
            dataSource={dataSource}
            footer={
                <div>
                    Built with love and coffee
                    <CoffeeOutlined />
                </div>
            }
            renderItem={(bidInfo) => (
                <List.Item key={JSON.stringify(bidInfo)}>
                    {props.card(bidInfo)}
                </List.Item>
            )}
        />
    );
};

export default Assignments;
