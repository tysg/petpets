import React, { ComponentProps, PropsWithChildren } from "react";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import {
    UserOutlined,
    LaptopOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { clearToken } from "./token";
import { Link, RouteChildrenProps } from "react-router-dom";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const SiteLayout = (props: PropsWithChildren<RouteChildrenProps>) => {
    const logout = () => {
        clearToken();
        props.history.push("/");
    };
    return (
        <Layout style={{ height: "100vh" }}>
            <Header className="header">
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                >
                    <Menu.Item key="1">
                        <Link to="/dashboard/owner">Pet Owner</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/dashboard/sitter">Pet Sitter</Link>
                    </Menu.Item>
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
                        <SubMenu
                            key="sub1"
                            icon={<UserOutlined />}
                            title="Pet Owner"
                        >
                            <Menu.Item key="1">My Pets</Menu.Item>
                            <Menu.Item key="2">My Profile</Menu.Item>
                            <Menu.Item key="3">New Request</Menu.Item>
                            <Menu.Item key="4">Arrangements</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            icon={<LaptopOutlined />}
                            title="Pet Sitter"
                        >
                            <Menu.Item key="5">Availability</Menu.Item>
                            <Menu.Item key="6">
                                <Link to="/dashboard/pastjobs">Past Jobs</Link>
                            </Menu.Item>
                        </SubMenu>
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
>>>>>>> master
        </Layout>
    );
};
export default SiteLayout;
