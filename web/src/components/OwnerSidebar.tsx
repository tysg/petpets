import React from "react";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, RouteComponentProps, useRouteMatch } from "react-router-dom";
import ResponsiveSidebar from "./ResponsiveSidebar";

const { ItemGroup } = Menu;

const OwnerSidebar = (props: RouteComponentProps) => {
    const { path } = useRouteMatch();
    return (
        <ResponsiveSidebar
            {...props}
            defaultOpen="owner"
            defaultSelected="pets"
        >
            <ItemGroup key="owner" title="Pet Owner">
                <Menu.Item key="pets">
                    <Link to={`${path}/pets`}>My Pets</Link>
                </Menu.Item>
                <Menu.Item key="payment">
                    <Link to={`${path}/payment`}>My Credit Cards</Link>
                </Menu.Item>
            </ItemGroup>
            <ItemGroup key="owner" title="Make Order">
                <Menu.Item key="new-request">
                    <Link to={`${path}/new-request`}>New Request</Link>
                </Menu.Item>
            </ItemGroup>
            <ItemGroup key="owner" title="Orders">
                <Menu.Item key="pending-orders">
                    <Link to={`${path}/orders/pending`}>Pending Orders</Link>
                </Menu.Item>
                <Menu.Item key="past-orders">
                    <Link to={`${path}/orders/past`}>Past Orders</Link>
                </Menu.Item>
                <Menu.Item key="upcoming-orders">
                    <Link to={`${path}/orders/upcoming`}>Upcoming Orders</Link>
                </Menu.Item>
                <Menu.Item key="closed-orders">
                    <Link to={`${path}/orders/closed`}>Closed Orders</Link>
                </Menu.Item>
            </ItemGroup>
        </ResponsiveSidebar>
    );
};

export default OwnerSidebar;
