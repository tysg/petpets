import React from "react";
import { Menu } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import { RouteComponentProps, useRouteMatch } from "react-router-dom";
import ResponsiveSidebar from "./ResponsiveSidebar";

const { SubMenu } = Menu;

const SitterSidebar = (props: RouteComponentProps) => {
    const { path } = useRouteMatch();
    return (
        <ResponsiveSidebar
            {...props}
            defaultOpen="sitter"
            defaultSelected="pastjobs"
        >
            <SubMenu key="sitter" icon={<LaptopOutlined />} title="Pet Sitter">
                <Menu.Item key="pastjobs">Past Jobs</Menu.Item>
                <Menu.Item key="sitter-2">option6</Menu.Item>
                <Menu.Item key="sitter-3">option7</Menu.Item>
                <Menu.Item key="sitter-4">option8</Menu.Item>
            </SubMenu>
        </ResponsiveSidebar>
    );
};

export default SitterSidebar;
