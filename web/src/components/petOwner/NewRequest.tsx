// libraries
import React, { Dispatch, Reducer, useReducer } from "react";
import moment from "moment";
import { Spin, Result, Button, Steps, message } from "antd";

// utils
import { bid as BidApi, formatDate } from "./../../common/api";
import { getUser } from "./../../common/token";
import { Bid } from "../../../../models";
import { Pet } from "../../../../models/pet";
import {
    CareTakerDetails,
    CareTakerSpecializesInCategory
} from "../../../../models/careTaker";

// components
import SelectCareTaker from "./SelectCareTaker";
import CreateOrder from "./CreateOrder";
import "./NewRequest.css";

const { Step } = Steps;

export type NewRequestState = {
    selectedPet?: Pet;
    selectedDates?: [moment.Moment, moment.Moment];
    selectedCareTaker?: CareTakerSpecializesInCategory;
    transportMethod?: Bid["transport_method"];
    notes?: string;
    isCash?: boolean;
    creditCardNumber?: string;
    step: number;
    isProcessingOrder?: boolean;
    isOrderSuccessful?: boolean;
};

export type Action = {
    type:
        | "next"
        | "prev"
        | "setDates"
        | "setCareTaker"
        | "setPet"
        | "setTransportMethod"
        | "setNotes"
        | "setCash"
        | "setCreditCard"
        | "setProcessingOrder"
        | "setIsOrderSuccessful";
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
        case "setTransportMethod":
            return { ...state, transportMethod: action.param! };
        case "setNotes":
            return { ...state, notes: action.param! };
        case "setCash":
            return { ...state, isCash: true, creditCardNumber: undefined };
        case "setCreditCard":
            return { ...state, isCash: false, creditCardNumber: action.param };
        case "setIsOrderSuccessful":
            return {
                ...state,
                isOrderSuccessful: action.param!,
                isProcessingOrder: false
            };
        case "setProcessingOrder":
            return { ...state, isProcessingOrder: true };
    }
};

const Content = (state: NewRequestState, dispatch: Dispatch<Action>) => {
    const steps = [
        <SelectCareTaker state={state} dispatch={dispatch} />,
        <CreateOrder state={state} dispatch={dispatch} />,
        state.isProcessingOrder ? (
            <Spin />
        ) : state.isOrderSuccessful ? (
            <Result
                status="success"
                title="Successfully submitted the request!"
                // extra={[
                //     <Button type="primary" key="console">
                //         Go Console
                //     </Button>,
                //     <Button key="buy">Buy Again</Button>
                // ]}
            />
        ) : (
            <Result
                status="error"
                title="There are some error processing your order."
                // extra={[
                //     <Button type="primary" key="console">
                //         Go Console
                //     </Button>,
                //     <Button key="buy">Buy Again</Button>
                // ]}
            />
        )
    ];
    return steps[state.step];
};

const Controls = (state: NewRequestState, dispatch: Dispatch<Action>) => {
    async function submitOrder() {
        // dispatch({ type: "setProcessingOrder" });
        try {
            // TODO: do something about the response
            await BidApi.createBid({
                ct_email: state.selectedCareTaker?.email!,
                owner_email: getUser()?.email!,
                pet_name: state.selectedPet?.name!,
                ct_price: state.selectedCareTaker?.ctPriceDaily!,
                credit_card: state.creditCardNumber,
                transport_method: state.transportMethod!,
                start_date: formatDate(state.selectedDates![0]),
                end_date: formatDate(state.selectedDates![1]),
                is_cash: state.isCash ?? false,
                pet_category: state.selectedPet?.category!
            });

            dispatch({ type: "setIsOrderSuccessful", param: true });
            message.success("Successfully submitted request");
        } catch (err) {
            console.log(err);
            dispatch({ type: "setIsOrderSuccessful", param: false });
            message.error("Failed to submit order: " + err);
        }
    }

    const NextButton = () => {
        switch (state.step) {
            case 0: // first page
                return;
            case 1:
                const showSubmit =
                    state.selectedCareTaker &&
                    state.selectedDates &&
                    state.selectedPet &&
                    state.isCash &&
                    state.transportMethod;
                return (
                    <Button
                        type="primary"
                        onClick={() => {
                            submitOrder();
                            dispatch({ type: "next" });
                        }}
                        disabled={!showSubmit}
                    >
                        Submit
                    </Button>
                );
            case 2: // last page
                return <Button type="primary">Done</Button>;
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
    const [state, dispatch] = useReducer(reducer, {
        step: 0,
        isProcessingOrder: true
    });

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
