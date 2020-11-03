//import React from "react";
import { Avatar, Space, Card, Rate, Descriptions } from "antd";
import { CareTakerDetails } from "../../../../models/careTaker";
import { Pet } from "../../../../models/pet";
import {
    Link,
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import React, { PropsWithChildren } from "react";

const { Meta } = Card;

const NameAndRating = (props: CareTakerDetails) => {
    // rating rounded the lower 0.5
    return (
        <Space size="middle">
            <>{props.fullname}</>
            <Rate
                disabled
                allowHalf
                defaultValue={Math.floor(props.rating * 2) / 2}
            />
        </Space>
    );
};

function ProfilePage(props: Pet) {
    return (
        <Descriptions title="Pet Info" bordered>
            <Descriptions.Item label="Pet Name">{props.name}</Descriptions.Item>
            <Descriptions.Item label="Pet Category">{props.category}</Descriptions.Item>
            <Descriptions.Item label="Pet Description">{props.description}</Descriptions.Item>
            <Descriptions.Item label="Pet Requirements">{props.requirements}</Descriptions.Item>
        </Descriptions>
    );
}

const PetCard = (props: Pet) => {
    const { path } = useRouteMatch();
    return (
        <><Switch>
            <Route path={`/dashboard/owner/pets/${props.name}`} render={() => (
            <ProfilePage
              name={props.name}
              owner={props.owner}
              category={props.category}
              description={props.description}
              requirements={props.requirements}
            />
          )} />
        </Switch>
            <Card>
                <Meta
                    avatar={<Avatar
                        style={{
                            backgroundColor: "#f56a00",
                            verticalAlign: "middle"
                        }}
                        size="large"
                    >
                        {props.name.charAt(0).toUpperCase()}
                    </Avatar>}
                    title={props.name}
                    description={props.description} />
                <p><Link to={`/dashboard/owner/pets/${props.name}`}>view profile</Link></p>
            </Card></>
    );
};
export default PetCard;
