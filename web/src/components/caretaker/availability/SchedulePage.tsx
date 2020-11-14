import React, { useState, useEffect } from "react";
import { Space, Row, Col, Table, DatePicker, Button, message } from "antd";
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
import { date } from "faker";

const { RangePicker } = DatePicker;

function isOverlap(s: [moment.Moment, moment.Moment], v: Schedule) {
    let e1start = s[0].toDate().getTime();
    let e1end = s[1].toDate().getTime();
    let e2start = v.start_date.getTime();
    let e2end = v.end_date.getTime();
    return (
        (e1start > e2start && e1start < e2end) ||
        (e2start > e1start && e2start < e1end)
    );
}

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

    const handleAddPeriod = () => {
        try {
            ScheduleApi.postSchedule(
                selectedDates!,
                isFulltime ? "full_timer" : "part_timer"
            );
            message.success("Successfully added time period!");
        } catch (err) {
            message.error("Cannot add time period" + err);
        } finally {
            fetchSchedule();
        }
    };

    const handleSelectDate = (dateInput: any, s: any) => {
        // checks whether the chosen period overlaps with any of
        // the existing dates
        const dates: [moment.Moment, moment.Moment] = dateInput;
        const anyOverlap = schedule.reduce<boolean>(
            (b: boolean, v: Schedule) => {
                return b && isOverlap(dates, v);
            },
            false
        );

        if (anyOverlap) {
            message.error("Overlapping time period!");
        } else {
            setSelectedDates(dates);
        }
    };

    return (
        <>
            <Row gutter={8}>
                <Col span={8} style={{ marginBottom: 8 }}>
                    <RangePicker
                        onChange={handleSelectDate}
                        value={selectedDates}
                    />
                </Col>
                <Col span={4}>
                    <Button
                        type="primary"
                        onClick={handleAddPeriod}
                        disabled={selectedDates === undefined}
                    >
                        Add New
                    </Button>
                </Col>
            </Row>
            <Table />
        </>
    );
};

export default SchedulePage;
