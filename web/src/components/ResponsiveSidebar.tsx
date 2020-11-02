import React, { PropsWithChildren } from "react";
import { Menu } from "antd";
import { RouteComponentProps } from "react-router-dom";

interface ResponsiveSidebarProps
    extends PropsWithChildren<RouteComponentProps> {
    defaultSelected: string;
    defaultOpen: string;
}

const ResponsiveSidebar = (props: ResponsiveSidebarProps) => {
    const paths = props.location.pathname.split("/");
    const selected =
        paths[3] === "" || paths[3] === undefined
            ? props.defaultSelected
            : paths[3];
    const open =
        paths[2] === "" || paths[2] === undefined
            ? props.defaultOpen
            : paths[2];
    console.log("responsive sidebar", selected, open);
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
