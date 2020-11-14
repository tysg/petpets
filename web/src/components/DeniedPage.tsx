import React from "react";
import { Button, Result } from "antd";
import { RouteComponentProps } from "react-router-dom";

const DeniedPage = (props: RouteComponentProps<{}>) => {
    const onClick = () => props.history.goBack();
    return (
        <Result
            status="403"
            title="403"
            subTitle="Oops you don't have permission to access this page"
            extra={[
                <Button type="primary" onClick={onClick}>
                    Go Back
                </Button>
            ]}
        />
    );
};

export default DeniedPage;
