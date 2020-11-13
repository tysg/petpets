import React, { useEffect } from "react";
import { List, message } from "antd";
import { CoffeeOutlined } from "@ant-design/icons";
import { BidJoinOwnerPet } from "../../../../models/bid";

interface AssignmentsProps {
    dataSource: BidJoinOwnerPet[];
    emptyMsg: string;
    card: React.FC<any>;
    refreshBids: () => void;
}

const Assignments = (props: AssignmentsProps) => {
    const { dataSource, emptyMsg, refreshBids } = props;
    useEffect(() => {
        if (dataSource.length <= 0) {
            message.info(emptyMsg);
        }
    }, [dataSource]);
    return (
        <List
            itemLayout="vertical"
            size="large"
            dataSource={dataSource}
            footer={
                <div>
                    Built with love and coffee
                    <CoffeeOutlined />
                </div>
            }
            renderItem={(bidInfo) => (
                <List.Item key={JSON.stringify(bidInfo)}>
                    {props.card({ ...bidInfo, refreshBids })}
                </List.Item>
            )}
        />
    );
};

export default Assignments;
export interface AssignmentCardProps extends BidJoinOwnerPet {
    refreshBids: () => void;
}
