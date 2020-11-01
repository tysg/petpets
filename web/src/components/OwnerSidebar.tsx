import React from "react";
import { Layout, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useRouteMatch } from "react-router-dom";

const { SubMenu } = Menu;

const OwnerSidebar = () => {
    const { path } = useRouteMatch();
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={["owner-1"]}
            defaultOpenKeys={["owner"]}
            style={{ height: "100%", borderRight: 0 }}
        >
            <SubMenu key="owner" icon={<UserOutlined />} title="Pet Owner">
                <Menu.Item key="owner-1">My Pets</Menu.Item>
                <Menu.Item key="owner-2">My Profile</Menu.Item>
                <Menu.Item key="owner-3">New Request</Menu.Item>
                <Menu.Item key="owner-4">Arrangements</Menu.Item>
            </SubMenu>
        </Menu>
    );
};

export default OwnerSidebar;
