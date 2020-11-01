import React from "react";
import { Layout, Menu, Button } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import { Link, useRouteMatch } from "react-router-dom";

const { SubMenu } = Menu;

const AdminSidebar = () => {
    const { path } = useRouteMatch();
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={["admin-1"]}
            defaultOpenKeys={["admin"]}
            style={{ height: "100%", borderRight: 0 }}
        >
            <SubMenu key="admin" icon={<LaptopOutlined />} title="Admin">
                <Menu.Item key="admin-1">
                    <Link to={`${path}/`}>Welcome</Link>
                </Menu.Item>
                <Menu.Item key="admin-2">
                    <Link to={`${path}/settings`}>Settings</Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    );
};

export default AdminSidebar;
