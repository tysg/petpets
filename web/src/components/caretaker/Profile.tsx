import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Descriptions} from 'antd';

const SitterProfile = () => {
    return (
            <Descriptions title="User Information" layout="vertical" bordered>
                <Descriptions.Item label="Name">Alice</Descriptions.Item>
                <Descriptions.Item label="Email">alice@gmail.com</Descriptions.Item>
                <Descriptions.Item label="Phone Number">81339234</Descriptions.Item>
                <Descriptions.Item label="Address">None</Descriptions.Item>
                <Descriptions.Item label="Role" span={3}>
                    Pet Sitter
                </Descriptions.Item>
            </Descriptions>
    );
  }
export default SitterProfile;