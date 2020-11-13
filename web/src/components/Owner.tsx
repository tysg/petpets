import React, { PropsWithChildren, useEffect, useState } from "react";
import {
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import NewRequest from "./petOwner/NewRequest";
import CreditCards from "./petOwner/StoredPayment";
import Pets from "./pet";
import { pets as PetsApi } from "../common/api";
import OwnerRoute from "../auth/OwnerRoute";
import { Pet } from "../../../models/pet";

const Orders = () => <div>Orders stub</div>;

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
                    <div>Register as pet owner</div>
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
                path={`${path}/orders`}
                component={Orders}
            ></OwnerRoute>
        </Switch>
    );
};

export default Owner;
