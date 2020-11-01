import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import { Link, RouteComponentProps, useRouteMatch } from "react-router-dom";
import ResponsiveSidebar from "./ResponsiveSidebar";

const { SubMenu } = Menu;

const AdminSidebar = (props: RouteComponentProps) => {
    const { path } = useRouteMatch();
    return (
        <ResponsiveSidebar {...props}>
            <SubMenu key="admin" icon={<LaptopOutlined />} title="Admin">
                <Menu.Item key="default">
                    <Link to={`${path}/`}>Welcome</Link>
                </Menu.Item>
                <Menu.Item key="settings">
                    <Link to={`${path}/settings`}>Settings</Link>
                </Menu.Item>
            </SubMenu>
        </ResponsiveSidebar>
    );
};

export default AdminSidebar;
