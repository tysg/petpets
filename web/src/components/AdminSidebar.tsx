import React from "react";
import { Menu } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import { Link, RouteComponentProps, useRouteMatch } from "react-router-dom";
import ResponsiveSidebar from "./ResponsiveSidebar";

const { ItemGroup } = Menu;

const AdminSidebar = (props: RouteComponentProps) => {
    const { path } = useRouteMatch();
    return (
        <ResponsiveSidebar
            {...props}
            defaultOpen="admin"
            defaultSelected="settings"
        >
            <ItemGroup key="admin" title="Admin">
                {/* <Menu.Item key="default">
                    <Link to={`${path}/`}>Welcome</Link>
                </Menu.Item> */}
                <Menu.Item key="settings">
                    <Link to={`${path}/settings`}>Daily Price</Link>
                </Menu.Item>
                <Menu.Item key="summary">
                    <Link to={`${path}/summary`}>Summary</Link>
                </Menu.Item>
            </ItemGroup>
        </ResponsiveSidebar>
    );
};

export default AdminSidebar;
