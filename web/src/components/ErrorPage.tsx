import React from "react";
import { Button, Result } from "antd";
import { RouteComponentProps } from "react-router-dom";

const ErrorPage = (props: RouteComponentProps<{}>) => {
    const onClick = () => props.history.goBack();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Oops the page you're looking for does not exist.."
            extra={[
                <Button type="primary" onClick={onClick}>
                    Go Back
                </Button>
            ]}
        />
    );
};

export default ErrorPage;
