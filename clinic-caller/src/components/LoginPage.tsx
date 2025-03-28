import React, { useState } from "react";
import { Card, Select, Button, Input, Typography, Form, Alert } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import "./LoginPage.css";

const { Option } = Select;
const { Title } = Typography;

export default function LoginPage({
  onLogin,
}: {
  onLogin: (role: string, info: any) => void;
}) {
  const [role, setRole] = useState("patient");
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (role === "patient" && (!name.trim() || !room.trim())) {
      setError("Please enter both name and room number");
      return;
    }
    setError("");
    onLogin(role, role === "patient" ? { room, name } : {});
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={3} className="login-title">
            Hospital System Login
          </Title>
        </div>

        <Form layout="vertical">
          <Form.Item label="Select Role">
            <Select
              defaultValue="patient"
              onChange={(val) => setRole(val)}
              style={{ width: "100%" }}
            >
              <Option value="patient">
                <UserOutlined /> Patient
              </Option>
              <Option value="staff">
                <SolutionOutlined /> Staff Member
              </Option>
            </Select>
          </Form.Item>

          {role === "patient" && (
            <>
              <Form.Item label="Patient Name">
                <Input
                  placeholder="Enter your name"
                  prefix={<UserOutlined />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Room Number">
                <Input
                  placeholder="Enter room number (1-6)"
                  type="number"
                  min="1"
                  max="6"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </Form.Item>
            </>
          )}

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Button
            type="primary"
            onClick={handleLogin}
            block
            size="large"
            icon={<LoginOutlined />}
          >
            Enter System
          </Button>
        </Form>
      </Card>
    </div>
  );
}
