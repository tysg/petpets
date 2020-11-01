import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import { Link, RouteComponentProps, useRouteMatch } from "react-router-dom";

const { SubMenu } = Menu;

const AdminSidebar = (props: RouteComponentProps) => {
    const paths = props.location.pathname.split("/");
    const selected =
        paths[3] === "" || paths[3] === undefined ? "default" : paths[3];
    const { path } = useRouteMatch();
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={[selected]}
            defaultOpenKeys={["admin"]}
            style={{ height: "100%", borderRight: 0 }}
        >
            <SubMenu key="admin" icon={<LaptopOutlined />} title="Admin">
                <Menu.Item key="default">
                    <Link to={`${path}/`}>Welcome</Link>
                </Menu.Item>
                <Menu.Item key="settings">
                    <Link to={`${path}/settings`}>Settings</Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    );
};

export default AdminSidebar;
