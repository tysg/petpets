import React, { useState, useEffect } from "react";
import { Space, Row, Col, Table, DatePicker, Button } from "antd";
import {
    CareTakerDetails,
    CareTakerSpecializesDetails
} from "../../../../../models/careTaker";
import {
    bid as bidApi,
    careTaker as careTakerApi,
    schedule as ScheduleApi
} from "../../../common/api";
import { careTaker as CaretakerApi } from "../../../common/api";
import { Schedule } from "../../../../../models/schedule";

const { RangePicker } = DatePicker;

const SchedulePage = (props: CareTakerSpecializesDetails) => {
    const isFulltime = props.caretakerStatus === 2;
    const [schedule, setSchedule] = useState<Schedule[]>([]);
    const [selectedDates, setSelectedDates] = useState<
        [moment.Moment, moment.Moment]
    >();
    const fetchSchedule = async () => {
        try {
            const fetchedSchedule = (
                await ScheduleApi.getSchedule(
                    isFulltime ? "full_timer" : "part_timer"
                )
            ).data.data;
            setSchedule(fetchedSchedule);
        } catch (err) {
            console.log("fetch schedule err", err);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []); // fetch on first load

    return (
        <>
            <Row gutter={8}>
                <Col span={8}>
                    <RangePicker
                        onChange={(dates: any, s) => setSelectedDates(dates)}
                        value={selectedDates}
                    />
                </Col>
                <Col span={4}>
                    <Button type="primary">Primary Button</Button>
                </Col>
            </Row>
            <Table />
        </>
    );
};

export default SchedulePage;
