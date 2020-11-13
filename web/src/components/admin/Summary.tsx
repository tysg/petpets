import { Col, Row } from "antd";
import React, { useState, useEffect } from "react";

import SalesCard from "./SalesCard";
import { admin as AdminApi } from "./../../common/api";
import {
    MonthlyBestCareTakerDetails,
    MonthlyRevenue
} from "../../../../models/admin";
import moment from "moment";

const Summary = () => {
    const [selectedMonth, setSelectedMonth] = useState<moment.Moment>(moment());
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
    const [monthlyTopSales, setMonthlyTopSales] = useState<
        MonthlyBestCareTakerDetails[]
    >([]);

    // fetch only once
    useEffect(() => {
        const liveFetch = async () => {
            try {
                const fetchedMonthlyRevenue = (
                    await AdminApi.getMonthlyRevenues()
                ).data.data;
                setMonthlyRevenue(fetchedMonthlyRevenue);
            } catch (err) {
                console.log("fetchMonthlyRevenue err", err);
            }
        };
        liveFetch();
    }, []);

    useEffect(() => {
        const fetchBestTakers = async () => {
            try {
                const fetchedCareTakers = (
                    await AdminApi.getMonthlyBestCareTaker(selectedMonth)
                ).data.data;
                setMonthlyTopSales(fetchedCareTakers);
            } catch (err) {
                console.log("fetching best caretaker err", err);
            }
        };
        fetchBestTakers();
    }, [selectedMonth]);

    const handleMonthChange = (value: any) => {
        console.log(value);
        setSelectedMonth(value);
    };

    return (
        <Row>
            <Col span={24}>
                <SalesCard
                    month={selectedMonth}
                    monthlyTopSales={monthlyTopSales}
                    monthlyRevenue={monthlyRevenue}
                    handleMonthChange={handleMonthChange}
                />
            </Col>
        </Row>
    );
};

export default Summary;
