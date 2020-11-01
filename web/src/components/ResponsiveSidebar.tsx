import React, { PropsWithChildren } from "react";
import { Menu } from "antd";
import { RouteComponentProps, useRouteMatch } from "react-router-dom";

const { SubMenu } = Menu;

const ResponsiveSidebar = (props: PropsWithChildren<RouteComponentProps>) => {
    const paths = props.location.pathname.split("/");
    const selected =
        paths[3] === "" || paths[3] === undefined ? "default" : paths[3];
    const open = paths[2] === "" || paths[2] === undefined ? "owner" : paths[2];
    const { path } = useRouteMatch();
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={[selected]}
            defaultOpenKeys={[open]}
            style={{ height: "100%", borderRight: 0 }}
        >
            {props.children}
        </Menu>
    );
};

export default ResponsiveSidebar;
