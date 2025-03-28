import React, { useState } from "react";
import { Button, Card, Typography, Alert, Row, Col } from "antd";
import { Link } from "react-router-dom";
import {
  CalendarOutlined,
  MedicineBoxOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./PatientScreen.css";

const { Title } = Typography;

interface PatientScreenProps {
  name: string;
  room: string;
}

const PatientScreen: React.FC<PatientScreenProps> = ({ name, room }) => {
  const [loading, setLoading] = useState(false);
  const [calledHelp, setCalledHelp] = useState(false);

  const requestAssistance = async () => {
    setLoading(true);
    try {
      console.log("Sending request to:", "http://localhost:5000/assistance");

      const response = await fetch("http://localhost:5000/assistance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          pname: name,
          room: room,
        }),
      });

      console.log("Response received, status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Success response:", data);

      setCalledHelp(true);
      setTimeout(() => setCalledHelp(false), 15000);
    } catch (error) {
      console.error("Full error details:", error);
      alert(
        `Failed to request assistance. Please ensure:
        1. The backend server is running
        2. You're not blocking CORS requests
        3. Your network connection is working
        Error details: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 10 }}>
          Welcome, {name}. (Room: {room})
        </Title>
      </Card>

      <Link
        to="#"
        onClick={requestAssistance}
        style={{ textDecoration: "none" }}
      >
        <Card
          hoverable
          style={{
            borderRadius: 12,
            marginBottom: 24,
            textAlign: "center",
            backgroundColor: calledHelp ? "#ff4d4f" : "#f0f2f5",
            transition: "all 0.3s ease",
          }}
          bodyStyle={{ padding: "40px" }}
          className={calledHelp ? "pulse" : ""}
        >
          <BellOutlined
            style={{
              fontSize: 48,
              color: calledHelp ? "#fff" : "#ff4d4f",
              marginBottom: 16,
            }}
          />
          <Title
            level={2}
            style={{ color: calledHelp ? "#fff" : "#ff4d4f", marginBottom: 8 }}
          >
            {calledHelp ? "HELP IS COMING" : "REQUEST ASSISTANCE"}
          </Title>
          {calledHelp && (
            <div style={{ color: "#fff", marginTop: 8 }}>
              Staff has been notified
            </div>
          )}
        </Card>
      </Link>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Link to="/appointments" style={{ textDecoration: "none" }}>
            <Card hoverable style={{ borderRadius: 12, height: "100%" }}>
              <CalendarOutlined
                style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }}
              />
              <Title level={4} style={{ marginBottom: 8 }}>
                Appointments
              </Title>
              <Button type="link" style={{ color: "#1890ff", padding: 0 }}>
                View and manage
              </Button>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link to="/medication-record" style={{ textDecoration: "none" }}>
            <Card hoverable style={{ borderRadius: 12, height: "100%" }}>
              <MedicineBoxOutlined
                style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
              />
              <Title level={4} style={{ marginBottom: 8 }}>
                Medication Record
              </Title>
              <Button type="link" style={{ color: "#52c41a", padding: 0 }}>
                View and manage
              </Button>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default PatientScreen;
