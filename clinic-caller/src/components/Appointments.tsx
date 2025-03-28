import React, { useState } from "react";
import { Card, Typography, Tabs, Button, List, Tag, Select } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

type Appointment = {
  id: string;
  date: string;
  time: string;
  description: string;
  doctor: string;
  status: "upcoming" | "missed" | "completed";
  type: string;
};

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [filterType, setFilterType] = useState<string>("all");

  const appointmentsData: Appointment[] = [
    {
      id: "1",
      date: "2025-04-01",
      time: "10:00 AM",
      description: "Annual check-up",
      doctor: "Dr. Smith",
      status: "upcoming",
      type: "check-up",
    },
    {
      id: "2",
      date: "2025-04-05",
      time: "02:30 PM",
      description: "Follow-up visit",
      doctor: "Dr. Johnson",
      status: "upcoming",
      type: "follow-up",
    },
    {
      id: "3",
      date: "2025-03-15",
      time: "09:00 AM",
      description: "Routine check-up",
      doctor: "Dr. Williams",
      status: "missed",
      type: "check-up",
    },
    {
      id: "4",
      date: "2025-03-10",
      time: "11:00 AM",
      description: "Regular appointment",
      doctor: "Dr. Brown",
      status: "completed",
      type: "check-up",
    },
  ];

  const filteredAppointments = appointmentsData.filter((appt) => {
    const statusMatch = activeTab === "all" || appt.status === activeTab;
    const typeMatch = filterType === "all" || appt.type === filterType;
    return statusMatch && typeMatch;
  });

  const appointmentTypes = [
    { value: "all", label: "All Types" },
    { value: "check-up", label: "Check-up" },
    { value: "follow-up", label: "Follow-up" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "missed":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "completed":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
      <Button
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
        type="text"
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            <CalendarOutlined style={{ marginRight: 8 }} />
            Appointments
          </Title>
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            onChange={setFilterType}
            options={appointmentTypes}
          />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane tab="Upcoming" key="upcoming" />
          <TabPane tab="Missed" key="missed" />
          <TabPane tab="Past" key="completed" />
          <TabPane tab="All" key="all" />
        </Tabs>

        <List
          itemLayout="vertical"
          dataSource={filteredAppointments}
          renderItem={(appointment) => (
            <List.Item
              key={appointment.id}
              extra={
                <Tag
                  color={
                    appointment.status === "upcoming"
                      ? "gold"
                      : appointment.status === "missed"
                      ? "red"
                      : "green"
                  }
                >
                  {appointment.status.toUpperCase()}
                </Tag>
              }
            >
              <List.Item.Meta
                avatar={getStatusIcon(appointment.status)}
                title={
                  <Text strong>
                    {appointment.date} at {appointment.time}
                  </Text>
                }
                description={
                  <>
                    <div>{appointment.description}</div>
                    <div>With {appointment.doctor}</div>
                    <Tag>{appointment.type}</Tag>
                  </>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: "No appointments found" }}
        />
      </Card>
    </div>
  );
};

export default Appointments;
