import React, { memo } from "react";
import "ant-design-pro/dist/ant-design-pro.css"; // Import whole style
import { Row, Col, Card, Tabs, DatePicker } from "antd";
// import styles from "./Analysis.less";
import { Bar } from "ant-design-pro/lib/Charts";
import moment from "moment";
import {
    MonthlyBestCareTakerDetails,
    MonthlyRevenue
} from "../../../../models/admin";

const { RangePicker } = DatePicker;
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
                                // data={[2].map((n) => ({
                                //     x: n.toString(),
                                //     y: n
                                // }))}
                            />
                        </Col>
                        <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                            {/* <div className={styles.salesRank}>
                                    <h4 className={styles.rankingTitle}>
                                        {"Sales Ranking"}
                                    </h4>
                                    <ul className={styles.rankingList}> */}
                            {/* {rankingListData.map((item, i) => (
                                            <li key={item.title}>
                                                <span
                                                    className={`${
                                                        styles.rankingItemNumber
                                                    } ${
                                                        i < 3
                                                            ? styles.active
                                                            : ""
                                                    }`}
                                                >
                                                    {i + 1}
                                                </span>
                                                <span
                                                    className={
                                                        styles.rankingItemTitle
                                                    }
                                                    title={item.title}
                                                >
                                                    {item.title}
                                                </span>
                                                <span
                                                    className={
                                                        styles.rankingItemValue
                                                    }
                                                >
                                                    {"0,0"}
                                                </span>
                                            </li>
                                        ))} */}
                            {/* </ul>
                                </div> */}
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </Card>
    );
});

export default SalesCard;
