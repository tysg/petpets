import React, { useState, useEffect } from "react";
import { Row, Col, Table, DatePicker, Button, message } from "antd";
import { CareTakerSpecializesDetails } from "../../../../../models/careTaker";
import { schedule as ScheduleApi } from "../../../common/api";
import { Schedule } from "../../../../../models/schedule";

import moment from "moment";

const { RangePicker } = DatePicker;

const mapScheduleToTable = (s: Schedule, i: number) => {
    const startDate = moment(s.start_date);
    const endDate = moment(s.end_date);
    return {
        key: i.toString(),
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
        duration: endDate.diff(startDate, "days")
    };
};
const isOverlap = (s: [moment.Moment, moment.Moment], v: Schedule) => {
    if (s === null || s[0] === null || s[1] === null) {
        return false;
    }
    const startDate = moment(v.start_date);
    const endDate = moment(v.end_date);

    return (
        (s[0].isAfter(startDate) && s[0].isBefore(endDate)) ||
        (startDate.isAfter(s[0]) && startDate.isBefore(s[1]))
    );
};

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

    const handleAddPeriod = async () => {
        try {
            await ScheduleApi.postSchedule(
                selectedDates!,
                isFulltime ? "full_timer" : "part_timer"
            );
            message.success("Successfully added time period!");
            fetchSchedule();
            setSelectedDates(undefined);
        } catch (err) {
            message.error("Cannot add time period" + err);
        }
    };

    const handleSelectDate = (dateInput: any, s: any) => {
        // checks whether the chosen period overlaps with any of
        // the existing dates
        const dates: [moment.Moment, moment.Moment] = dateInput;
        const anyOverlap = schedule.reduce<boolean>(
            (b: boolean, v: Schedule) => {
                return b || isOverlap(dates, v);
            },
            false
        );
        if (anyOverlap) {
            message.error("Overlapping time period!");
        } else {
            setSelectedDates(dates);
        }
        return;
    };

    return (
        <>
            <Row gutter={8}>
                <Col span={8} style={{ marginBottom: 8 }}>
                    <RangePicker
                        onCalendarChange={handleSelectDate}
                        value={selectedDates}
                    />
                </Col>
                <Col span={4}>
                    <Button
                        type="primary"
                        onClick={handleAddPeriod}
                        disabled={
                            selectedDates === null ||
                            selectedDates === undefined ||
                            selectedDates[0] === null ||
                            selectedDates[1] === null
                        }
                    >
                        Add New
                    </Button>
                </Col>
            </Row>
            <Table
                columns={[
                    {
                        title: "Start Date",
                        dataIndex: "start_date",
                        key: "start_date"
                    },
                    {
                        title: "End Date",
                        dataIndex: "end_date",
                        key: "end_date"
                    },
                    {
                        title: "Duration",
                        dataIndex: "duration",
                        key: "duration"
                    }
                ]}
                dataSource={schedule.map(mapScheduleToTable)}
            />
        </>
    );
};

export default SchedulePage;
