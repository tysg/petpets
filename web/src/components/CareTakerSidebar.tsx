import React from "react";
import { Menu } from "antd";
import { Link, RouteComponentProps, useRouteMatch } from "react-router-dom";
import ResponsiveSidebar from "./ResponsiveSidebar";

const { ItemGroup } = Menu;

const CareTakerSidebar = (props: RouteComponentProps) => {
    const { path } = useRouteMatch();
    return (
        <ResponsiveSidebar
            {...props}
            defaultOpen="sitter"
            defaultSelected="upcoming"
        >
            <ItemGroup key="sitter" title="Pet Sitter">
                <Menu.Item key="upcoming">
                    <Link to={`${path}/upcoming`}>Upcoming Assignments</Link>
                </Menu.Item>
                <Menu.Item key="pending">
                    <Link to={`${path}/pending`}>Pending Requests</Link>
                </Menu.Item>
                <Menu.Item key="pastjobs">
                    <Link to={`${path}/pastjobs`}>Past Jobs</Link>
                </Menu.Item>
                <Menu.Item key="schedule">
                    <Link to={`${path}/schedule`}>My Schedule</Link>
                </Menu.Item>
            </ItemGroup>
        </ResponsiveSidebar>
    );
};

export default CareTakerSidebar;
