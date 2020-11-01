import React, { ComponentProps, PropsWithChildren, useState } from "react";
import { Layout, Menu, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { clearSession, getUser } from "./token";
import {
    Link,
    RouteChildrenProps,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import AuthenticatedRoute from "../auth/AuthenticatedRoute";
import AdminRoute from "../auth/AdminRoute";
import AdminSidebar from "../components/AdminSidebar";
import OwnerSidebar from "../components/OwnerSidebar";
import SitterSidebar from "../components/SitterSidebar";

const { Header, Content, Sider } = Layout;

const NavItem = (path: string) => {
    return (
        <>
            <Menu.Item key="owner">
                <Link to={`${path}/owner`}>Pet Owner</Link>
            </Menu.Item>
            <Menu.Item key="sitter">
                <Link to={`${path}/sitter`}>Pet Sitter</Link>
            </Menu.Item>
            {getUser()?.isAdmin() && (
                <Menu.Item key="admin">
                    <Link to="/dashboard/admin">Admin</Link>
                </Menu.Item>
            )}
        </>
    );
};

interface SiteLayoutProps extends PropsWithChildren<RouteComponentProps> {
    path: string;
}

const SiteLayout = (props: SiteLayoutProps) => {
    const logout = () => {
        clearSession();
        props.history.push("/");
    };
    const { path } = useRouteMatch();
    const paths = props.location.pathname.split("/");
    const [selected, setSelected] = useState(paths[2]);
    return (
        <Layout style={{ height: "100vh" }}>
            <Header className="header">
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[selected]}
                    // defaultSelectedKeys={[ ]}
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
                    <Switch>
                        <AuthenticatedRoute
                            // path={[`${path}/`, `${path}/owner`]}
                            exact
                            path={path}
                        >
<<<<<<< HEAD
                            <OwnerSidebar />
                        </AuthenticatedRoute>
                        <AuthenticatedRoute
                            // path={[`${path}/`, `${path}/owner`]}
                            path={`${path}/owner`}
=======
                            <Menu.Item key="1">My Pets</Menu.Item>
                            <Menu.Item key="2">My Profile</Menu.Item>
                            <Menu.Item key="3">New Request</Menu.Item>
                            <Menu.Item key="4">
                              <Link to="/dashboard/pastorders">Past Orders</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            icon={<LaptopOutlined />}
                            title="Pet Sitter"
>>>>>>> add front end for pet owner past orders
                        >
                            <OwnerSidebar />
                        </AuthenticatedRoute>
                        <AuthenticatedRoute path={`${path}/sitter`}>
                            <SitterSidebar />
                        </AuthenticatedRoute>
                        <AdminRoute path={`${path}/admin`}>
                            <AdminSidebar {...props} />
                        </AdminRoute>
                    </Switch>
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
