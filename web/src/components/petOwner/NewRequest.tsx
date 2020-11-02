import React, {
    Dispatch,
    Reducer,
    useEffect,
    useReducer,
    useState
} from "react";
import { pets as PetsApi } from "./../../common/api";
import {
    Select,
    DatePicker,
    Col,
    Row,
    Empty,
    Spin,
    Result,
    Button,
    Steps,
    message
} from "antd";
import moment from "moment";
import { Pet } from "../../../../models/pet";
import { CareTakerDetails } from "../../../../models/careTaker";
import CareTakerCard from "./CareTakerCard";
import SelectCareTaker from "./SelectCareTaker";
import "./NewRequest.css";

const { Step } = Steps;

export type NewRequestState = {
    selectedPet?: Pet;
    selectedDates?: [moment.Moment, moment.Moment];
    selectedCareTaker?: CareTakerDetails;
    step: number;
};

export type Action = {
    type: "next" | "prev" | "setDates" | "setCareTaker" | "setPet";
    param?: any;
};

const reducer: Reducer<NewRequestState, Action> = (state, action) => {
    switch (action.type) {
        case "next":
            return { ...state, step: state.step + 1 };
        case "prev":
            return { ...state, step: state.step - 1 };
        case "setDates":
            return { ...state, selectedDates: action.param! };
        case "setPet":
            return { ...state, selectedPet: action.param! };
        case "setCareTaker":
            return { ...state, selectedCareTaker: action.param! };
    }
};

const Content = (state: NewRequestState, dispatch: Dispatch<Action>) => {
    const steps = [
        <SelectCareTaker state={state} dispatch={dispatch} />,
        "Second-content",
        <Result
            status="success"
            title="You've successfully created a request!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
                <Button type="primary" key="console">
                    Go Console
                </Button>,
                <Button key="buy">Buy Again</Button>
            ]}
        />
    ];
    return steps[state.step];
};

const Controls = (state: NewRequestState, dispatch: Dispatch<Action>) => {
    const NextButton = () => {
        switch (state.step) {
            case 0: // first page
                const showNextPage =
                    state.selectedCareTaker &&
                    state.selectedDates &&
                    state.selectedPet;
                return (
                    <Button
                        type="primary"
                        onClick={() => dispatch({ type: "next" })}
                        disabled={!showNextPage}
                    >
                        Next
                    </Button>
                );
            case 2: // last page
                return (
                    <Button
                        type="primary"
                        onClick={() => message.success("Processing complete!")}
                    >
                        Done
                    </Button>
                );
        }
    };

    return (
        <>
            {NextButton()}
            {state.step > 0 && (
                <Button
                    style={{ margin: "0 8px" }}
                    onClick={() => dispatch({ type: "prev" })}
                >
                    Previous
                </Button>
            )}
        </>
    );
};

const NewRequest = () => {
    const [state, dispatch] = useReducer(reducer, { step: 0 });

    return (
        <>
            <Steps current={state.step}>
                {["Find Caretaker", "Create Order", "Done"].map((item) => (
                    <Step key={item} title={item} />
                ))}
            </Steps>
            <div className="steps-content">{Content(state, dispatch)}</div>
            <div className="steps-action">{Controls(state, dispatch)}</div>
        </>
    );
};

export default NewRequest;
