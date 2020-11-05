import React, { PropsWithChildren, useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
    LogoutOutlined,
    UserOutlined,
    HomeOutlined,
    SmileOutlined,
    BarChartOutlined
} from "@ant-design/icons";
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
import CareTakerSidebar from "../components/CareTakerSidebar";
import Profile from "../components/petOwner/Profile";

const { Header, Content, Sider } = Layout;

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
    const selected = paths[2] || "owner";
    const [selectedKey, setSelectedKey] = useState(selected);
    const [showDrawer, setShowDrawer] = useState(false);
    const onOpen = () => setShowDrawer(true);
    const onClose = () => setShowDrawer(false);
    return (
        <Layout style={{ height: "100vh" }}>
            <Header className="header">
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[selectedKey]}
                >
                    <Menu.Item
                        key="profile"
                        unselectable="off"
                        onClick={onOpen}
                    >
                        <UserOutlined />
                        My Profile
                    </Menu.Item>
                    <Menu.Item
                        key="owner"
                        onClick={() => setSelectedKey("owner")}
                    >
                        <HomeOutlined />
                        <Link to={`${path}/owner`}>Pet Owner</Link>
                    </Menu.Item>
                    <Menu.Item
                        key="sitter"
                        onClick={() => setSelectedKey("sitter")}
                    >
                        <SmileOutlined />
                        <Link to={`${path}/sitter`}>Pet Sitter</Link>
                    </Menu.Item>
                    {getUser()?.isAdmin() && (
                        <Menu.Item
                            key="admin"
                            onClick={() => setSelectedKey("admin")}
                        >
                            <BarChartOutlined />
                            <Link to={`${path}/admin`}>Admin</Link>
                        </Menu.Item>
                    )}
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
                            <CareTakerSidebar {...props} />
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
            <Drawer
                width={640}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={showDrawer}
                // visible
            >
                <Profile></Profile>
            </Drawer>
        </Layout>
    );
};
export default SiteLayout;
