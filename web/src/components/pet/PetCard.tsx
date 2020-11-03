//import React from "react";
import { Avatar, Space, Card, Rate, Descriptions, Button, Col } from "antd";
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
import ProfilePage from "./ProfilePage";
import { createIndexedAccessTypeNode } from "typescript";


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

const cardStyle = {
    display: 'block',
    width: '50vw',
    transitionDuration: '0.3s',
    height: '12vw'
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
            <Card style={cardStyle}>
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
                    <Col span={8} offset={18}>
                        <Button type="primary">Delete</Button>  
                    </Col>
                    <p><Link to={`/dashboard/owner/pets/${props.name}`}>view profile</Link></p>           
            </Card></>
    );
};
export default PetCard;
