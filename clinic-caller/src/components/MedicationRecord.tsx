import React, { useState } from "react";
import { Card, Typography, Button, List, Select, Divider, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data for medication records grouped by prescription date
const medicationDataByDate = {
  "2023-06-15": [
    {
      id: 1,
      name: "Ibuprofen",
      dosage: "200mg",
      quantity: 30,
      frequency: "Every 6 hours",
      status: "completed",
    },
    {
      id: 2,
      name: "Amoxicillin",
      dosage: "500mg",
      quantity: 20,
      frequency: "Twice daily",
      status: "completed",
    },
  ],
  "2023-05-20": [
    {
      id: 3,
      name: "Lisinopril",
      dosage: "10mg",
      quantity: 90,
      frequency: "Once daily",
      status: "ongoing",
    },
    {
      id: 4,
      name: "Metformin",
      dosage: "850mg",
      quantity: 60,
      frequency: "Twice daily",
      status: "ongoing",
    },
  ],
  "2023-04-10": [
    {
      id: 5,
      name: "Atorvastatin",
      dosage: "20mg",
      quantity: 30,
      frequency: "Once at bedtime",
      status: "completed",
    },
  ],
};

const MedicationRecord: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("2023-06-15");
  const prescriptionDates = Object.keys(medicationDataByDate);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Separate medications into past and current
  const currentMedications =
    medicationDataByDate[selectedDate as keyof typeof medicationDataByDate];
  const allPastMedications = Object.entries(medicationDataByDate)
    .filter(([date]) => date !== selectedDate)
    .flatMap(([_, medications]) => medications);

  return (
    <div style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
      <Button
        onClick={handleBackClick}
        icon={<ArrowLeftOutlined />}
        type="text"
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>

      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>
          Medication Records
        </Title>

        {/* Prescription Date Selector */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <CalendarOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            <Text strong>Prescription Date</Text>
          </div>
          <Select
            value={selectedDate}
            onChange={(value) => setSelectedDate(value)}
            style={{ width: "100%" }}
          >
            {prescriptionDates.map((date) => (
              <Option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </Option>
            ))}
          </Select>
        </div>

        {/* Current Medications */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <MedicineBoxOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            <Title level={4} style={{ margin: 0 }}>
              Current Prescription
            </Title>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={currentMedications}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text strong>{item.name}</Text>
                      <Tag color={item.status === "ongoing" ? "green" : "blue"}>
                        {item.status === "ongoing" ? "Active" : "Completed"}
                      </Tag>
                    </div>
                  }
                  description={
                    <>
                      <div>Dosage: {item.dosage}</div>
                      <div>Quantity: {item.quantity} tablets</div>
                      <div>Frequency: {item.frequency}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </div>

        <Divider />

        {/* Past Medications */}
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>
            Past Medications
          </Title>
          {allPastMedications.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={allPastMedications}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.name}</Text>}
                    description={
                      <>
                        <div>Dosage: {item.dosage}</div>
                        <div>Quantity: {item.quantity} tablets</div>
                        <div>Frequency: {item.frequency}</div>
                        <Tag color="default">Completed</Tag>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No past medication records found</Text>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MedicationRecord;
