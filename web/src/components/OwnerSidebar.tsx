import React from "react";
import { Layout, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, RouteComponentProps, useRouteMatch } from "react-router-dom";
import ResponsiveSidebar from "./ResponsiveSidebar";

const { SubMenu } = Menu;

const OwnerSidebar = (props: RouteComponentProps) => {
    const { path } = useRouteMatch();
    return (
        <ResponsiveSidebar {...props}>
            <SubMenu key="owner" icon={<UserOutlined />} title="Pet Owner">
                <Menu.Item key="default">My Pets</Menu.Item>
                <Menu.Item key="owner-2">My Profile</Menu.Item>
                <Menu.Item key="owner-3">
                    <Link to={`${path}/new-request`}>New Request</Link>
                </Menu.Item>
                <Menu.Item key="owner-4">Arrangements</Menu.Item>
            </SubMenu>
        </ResponsiveSidebar>
    );
};

export default OwnerSidebar;
