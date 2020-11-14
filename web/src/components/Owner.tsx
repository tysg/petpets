import React, { PropsWithChildren, useEffect, useState } from "react";
import {
    Link,
    LinkProps,
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import NewRequest from "./petOwner/NewRequest";
import CreditCards from "./petOwner/StoredPayment";
import Orders from "./petOwner/orders";
import Pets from "./pet";
import { pets as PetsApi } from "../common/api";
import OwnerRoute from "../auth/OwnerRoute";
import { Pet } from "../../../models/pet";
import { Button, Result } from "antd";
import ErrorPage from "./ErrorPage";

const Owner = (props: PropsWithChildren<RouteComponentProps>) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const { path } = useRouteMatch();
    const fetchUserPets = async () => {
        try {
            const fetchedPets = (await PetsApi.getUserPets()).data.data;
            setPets(fetchedPets);
        } catch (err) {
            console.log("fetchPetCategories err", err);
        }
    };
    useEffect(() => {
        fetchUserPets();
    }, []);
    return (
        <Switch>
            <Route exact path={`${path}/`}>
                {pets.length > 0 ? (
                    <Redirect to={`${path}/pets`} />
                ) : (
                    <RegisterLanding to={`${path}/pets`} />
                )}
            </Route>
            <OwnerRoute pets={pets} path={`${path}/pets`}>
                <Pets pets={pets} update={fetchUserPets} />
            </OwnerRoute>
            <OwnerRoute
                pets={pets}
                path={`${path}/new-request`}
                component={NewRequest}
            ></OwnerRoute>
            <OwnerRoute
                pets={pets}
                path={`${path}/payment`}
                component={CreditCards}
            ></OwnerRoute>
            <OwnerRoute
                pets={pets}
                path={`${path}/orders/:type`}
                component={Orders}
            ></OwnerRoute>
            <Route component={ErrorPage}></Route>
        </Switch>
    );
};

const RegisterLanding = (props: LinkProps) => {
    return (
        <Result
            title="You are not registered as a Pet Owner yet!"
            subTitle="Add pets to get started"
            extra={[
                <Button type="primary">
                    <Link to={props.to}>Add Pets</Link>
                </Button>
            ]}
        ></Result>
    );
};

export default Owner;
