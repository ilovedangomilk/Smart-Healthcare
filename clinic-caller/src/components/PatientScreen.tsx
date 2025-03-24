import React, { useState } from "react"
import { Form, Input, Button, message, Typography, Card } from "antd"

const { Title } = Typography

export default function PatientScreen({ name, room }: { name: string; room: string }) {
  const [loading, setLoading] = useState(false)

  // Called when the form is submitted successfully
  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (response.ok) {
        message.success("Assistance requested!")
      } else {
        message.error("Request failed. Please try again.")
      }
    } catch (error) {
      message.error("Network error. Could not reach server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ maxWidth: 600, margin: "40px auto" }}>
      <Title level={3}>Patient Assistance Form</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Patient Name"
          name="pname"
          rules={[{ required: true, message: "Please enter patient name" }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label="Room Number"
          name="room"
          rules={[{ required: true, message: "Please enter room number" }]}
        >
          <Input placeholder="100" />
        </Form.Item>

        <Form.Item
          label="Treatment Type"
          name="treatment"
          rules={[{ required: true, message: "Please enter treatment type" }]}
        >
          <Input placeholder="e.g. Chemotherapy" />
        </Form.Item>

        <Form.Item
          label="Session Number"
          name="session"
          rules={[{ required: true, message: "Please enter session number" }]}
        >
          <Input placeholder="e.g. 2nd" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Request Assistance
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
