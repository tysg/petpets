import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    RouteComponentProps
} from "react-router-dom";
import puppies from "./assets/puppies.jpg";
import LoginOrSignUp from "./auth/Login";
import Dashboard from "./Dashboard";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import PublicRoute from "./auth/PublicRoute";
import "./App.css";
import { user as userApi } from "./common/api";
import { getToken, clearSession } from "./common/token";
import DeniedPage from "./components/DeniedPage";
import ErrorPage from "./components/ErrorPage";

function Landing() {
    // unauthenticated request
    return (
        <div className="App">
            <header className="App-header">
                <img src={puppies} className="App-background" alt="" />
                <p>Welcome to Petpets!</p>
                <Link to="/login">Login</Link>
            </header>
        </div>
    );
}

const App = () => {
    useEffect(() => {
        const token = getToken();
        if (!token) return;
        // verify token on page refresh
        userApi.verify().catch((err) => {
            clearSession();
            console.log(err);
        });
    });
    return (
        <Router>
            <Switch>
                <PublicRoute exact path="/" component={Landing} />
                <PublicRoute path="/login" component={LoginOrSignUp} />
                <AuthenticatedRoute path="/dashboard" component={Dashboard} />
                <Route exact path="/denied" component={DeniedPage} />
                <Route component={ErrorPage}></Route>
            </Switch>
        </Router>
    );
};

export default App;
