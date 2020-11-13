import React from "react";
import { Space, Table } from "antd";
import { CareTakerDetails } from "../../../../models/careTaker";
import { bid as bidApi, careTaker as careTakerApi } from "../../common/api";

const Schedule = (props: CareTakerDetails) => {
    const refreshSchedule = () => console.log("");
    return <Table />;
};

export default Schedule;
