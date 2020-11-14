import React, { memo } from "react";
import "ant-design-pro/dist/ant-design-pro.css"; // Import whole style
import { Row, Col, Card, Tabs, DatePicker, Table } from "antd";
import { Bar } from "ant-design-pro/lib/Charts";
import moment from "moment";
import {
    MonthlyBestCareTakerDetails,
    MonthlyRevenue
} from "../../../../models/admin";

const { TabPane } = Tabs;

type SalesCardProps = {
    month: moment.Moment;
    handleMonthChange: (value: any) => void;
    monthlyTopSales: MonthlyBestCareTakerDetails[];
    monthlyRevenue: MonthlyRevenue[];
};
const SalesCard = memo((props: SalesCardProps) => {
    const { month, handleMonthChange, monthlyTopSales, monthlyRevenue } = props;
    return (
        <Card>
            <Tabs
                tabBarExtraContent={
                    <DatePicker
                        onChange={handleMonthChange}
                        picker="month"
                        value={month}
                        style={{ width: 256 }}
                    />
                }
                size="large"
                tabBarStyle={{ marginBottom: 24 }}
            >
                <TabPane tab={"Sales"} key="sales">
                    <Row>
                        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                            <Bar
                                height={295}
                                title={"Sales Trend"}
                                data={monthlyRevenue.map((r) => ({
                                    x: r.year_month,
                                    y: r.earnings / 1
                                }))}
                            />
                        </Col>
                        <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                            <Table
                                title={() => <b>{"Monthly Top Caretakers"}</b>}
                                columns={[
                                    { title: "Rank", dataIndex: "rank" },
                                    { title: "Name", dataIndex: "name" },
                                    { title: "Earnings", dataIndex: "earnings" }
                                ]}
                                dataSource={monthlyTopSales.map((v, i) => ({
                                    key: i,
                                    rank: i + 1,
                                    name: v.fullname,
                                    earnings: "S$ " + v.ct_earnings
                                }))}
                                size="small"
                            />
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </Card>
    );
});

export default SalesCard;
