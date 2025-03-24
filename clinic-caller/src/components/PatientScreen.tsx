import React, { useState } from "react"
import { Button, message, Card, Typography } from "antd"

const { Title } = Typography

export default function PatientScreen({ name, room }: { name: string; room: string }) {
  const [loading, setLoading] = useState(false)

  // Called when the assistance button is clicked
  const requestAssistance = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pname: name, room: room }), // Sending the name and room number
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
      <Title level={3}>Patient Assistance</Title>
      <Button
        type="primary"
        onClick={requestAssistance}
        loading={loading}
        style={{ width: "100%" }}
      >
        Request Assistance
      </Button>
    </Card>
  )
}
