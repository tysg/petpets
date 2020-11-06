import React from "react";
import { Space, Table } from "antd";

const PastJobs = () => {
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
    return (
        <Space direction="vertical">
            <Table dataSource={dataSource} columns={columns} />
        </Space>
    );
};

export default PastJobs;
