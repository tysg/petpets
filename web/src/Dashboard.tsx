import React from "react";
import {
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import SiteLayout from "./common/SiteLayout";
import AdminRoute from "./auth/AdminRoute";
import Admin from "./components/Admin";
import CareTaker from "./components/CareTaker";
import Owner from "./components/Owner";

const Dashboard = (props: RouteComponentProps) => {
    // useEffect(() => {
    //     userApi.get("/ping");
    // });
    const { path } = useRouteMatch();
    // console.log(path, url);
    // path = '/dashboard' url = '/dashboard'
    return (
        <SiteLayout {...props} path={path}>
            {/* <div> This is the landing page for Dashboard </div> */}
            <Switch>
                <Route exact path={path}>
                    <Redirect to={`${path}/owner`} />
                </Route>
                <Route path={`${path}/owner`} component={Owner} />
                <Route path={`${path}/sitter`} component={CareTaker} />
                <AdminRoute path={`${path}/admin`} component={Admin} />
            </Switch>
        </SiteLayout>
    );
};

export default Dashboard;
