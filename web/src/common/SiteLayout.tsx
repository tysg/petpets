import React, { PropsWithChildren } from "react";
import { Layout, Menu, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { clearSession, getUser } from "./token";
import {
    Link,
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
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
                    <Link to={`${path}/admin`}>Admin</Link>
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
    const selected =
        paths[2] === "" || paths[2] === undefined ? "owner" : paths[2];
    return (
        <Layout style={{ height: "100vh" }}>
            <Header className="header">
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[selected]}
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
                        <Route exact path={path}>
                            <Redirect to={`${path}/owner`} />
                        </Route>
                        <Route path={`${path}/owner`}>
                            <OwnerSidebar {...props} />
                        </Route>
                        <Route path={`${path}/sitter`}>
                            <SitterSidebar {...props} />
                        </Route>
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
