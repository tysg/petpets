import React from "react";
import { Layout, Menu, Button } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import { Link, useRouteMatch } from "react-router-dom";

const { SubMenu } = Menu;

const SitterSidebar = () => {
    const { path } = useRouteMatch();
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={["sitter-1"]}
            defaultOpenKeys={["sitter"]}
            style={{ height: "100%", borderRight: 0 }}
        >
            <SubMenu key="sitter" icon={<LaptopOutlined />} title="Pet Sitter">
                <Menu.Item key="sitter-1">option5</Menu.Item>
                <Menu.Item key="sitter-2">option6</Menu.Item>
                <Menu.Item key="sitter-3">option7</Menu.Item>
                <Menu.Item key="sitter-4">option8</Menu.Item>
            </SubMenu>
        </Menu>
    );
};

export default SitterSidebar;
