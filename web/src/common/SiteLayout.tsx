import React, { ComponentProps, PropsWithChildren, useState } from "react";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import {
    UserOutlined,
    LaptopOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { clearToken, clearUser, getUser } from "./token";
import {
    Link,
    RouteChildrenProps,
    RouteProps,
    useRouteMatch
} from "react-router-dom";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const NavItem = (path: string) => {
    return (
        <>
            <Menu.Item key="1">
                <Link to={`${path}/owner`}>Pet Owner</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to={`${path}/sitter`}>Pet Sitter</Link>
            </Menu.Item>
            {getUser()?.isAdmin() && (
                <Menu.Item key="3">
                    <Link to="/dashboard/admin">Admin</Link>
                </Menu.Item>
            )}
        </>
    );
};

const subMenus = {
    owner: (
        <SubMenu key="owner" icon={<UserOutlined />} title="Pet Owner">
            <Menu.Item key="1">My Pets</Menu.Item>
            <Menu.Item key="2">My Profile</Menu.Item>
            <Menu.Item key="3">New Request</Menu.Item>
            <Menu.Item key="4">Arrangements</Menu.Item>
        </SubMenu>
    ),
    sitter: (
        <SubMenu key="sitter" icon={<LaptopOutlined />} title="Pet Sitter">
            <Menu.Item key="1">option5</Menu.Item>
            <Menu.Item key="2">option6</Menu.Item>
            <Menu.Item key="3">option7</Menu.Item>
            <Menu.Item key="4">option8</Menu.Item>
        </SubMenu>
    ),
    admin: (
        <SubMenu key="admin" icon={<LaptopOutlined />} title="Admin">
            <Menu.Item key="1">option5</Menu.Item>
            <Menu.Item key="2">option6</Menu.Item>
            <Menu.Item key="3">option7</Menu.Item>
            <Menu.Item key="4">option8</Menu.Item>
        </SubMenu>
    )
};

interface SiteLayoutProps extends PropsWithChildren<RouteChildrenProps> {
    path: string;
}

const SiteLayout = (props: SiteLayoutProps) => {
    const logout = () => {
        clearToken();
        clearUser();
        props.history.push("/");
    };
    const [selected, setSelected] = useState("1");
    return (
        <Layout style={{ height: "100vh" }}>
            <Header className="header">
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                >
                    {NavItem(props.path)}
                    <Button onClick={logout}>
                        <LogoutOutlined />
                        Logout
                    </Button>
                </Menu>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        defaultOpenKeys={["sub1"]}
                        style={{ height: "100%", borderRight: 0 }}
                    >
                        {subMenus[selected]}
                    </Menu>
                </Sider>
                <Layout style={{ padding: "0 24px 24px" }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            overflow: "scroll"
                        }}
                    >
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};
export default SiteLayout;
