import React, { useEffect, useReducer, useState } from "react";
import { pets as PetsApi } from "./../../common/api";
import { Select, DatePicker, Col, Row, Empty, Spin } from "antd";
import moment from "moment";
import { Pet } from "../../../../models/pet";
import { CareTakerDetails } from "../../../../models/careTaker";
import CareTakerCard from "./CareTakerCard";
import { Steps, Button, message } from "antd";
import SelectCareTaker from "./SelectCareTaker";
import "./NewRequest.css";

const { Step } = Steps;

const steps = [
    {
        title: "Find Caretaker",
        content: <SelectCareTaker />
    },
    {
        title: "Create Order",
        content: "Second-content"
    },
    {
        title: "Done",
        content: "Last-content"
    }
];

const NewRequest = () => {
    const [selectedPet, setSelectedPet] = useState<Pet>();
    const [selectedDates, setSelectedDates] = useState<
        [moment.Moment, moment.Moment]
    >();

    const [currentStep, setCurrentStep] = useState(0);

    return (
        <>
            <Steps current={currentStep}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[currentStep].content}</div>
            <div className="steps-action">
                {currentStep < steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={() => setCurrentStep((n) => n + 1)}
                    >
                        Next
                    </Button>
                )}
                {currentStep === steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={() => message.success("Processing complete!")}
                    >
                        Done
                    </Button>
                )}
                {currentStep > 0 && (
                    <Button
                        style={{ margin: "0 8px" }}
                        onClick={() => setCurrentStep((n) => n - 1)}
                    >
                        Previous
                    </Button>
                )}
            </div>
        </>
    );
};

export default NewRequest;
