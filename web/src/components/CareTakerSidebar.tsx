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
            defaultSelected="pastjobs"
        >
            <ItemGroup key="sitter" title="Pet Sitter">
                <Menu.Item key="pastjobs">
                    <Link to={`${path}/pastjobs`}>Past Jobs</Link>
                </Menu.Item>
                <Menu.Item key="availability">Availability</Menu.Item>
                <Menu.Item key="rates">
                    <Link to={`${path}/rates`}>My Rates</Link>
                </Menu.Item>
            </ItemGroup>
        </ResponsiveSidebar>
    );
};

export default CareTakerSidebar;
