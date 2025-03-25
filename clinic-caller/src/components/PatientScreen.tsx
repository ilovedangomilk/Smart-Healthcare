import React, { useState } from "react"
import { Button, Card, Typography, Alert, Col } from "antd"

const { Title } = Typography

export default function PatientScreen({ name, room }: { name: string; room: string }) {
  const [loading, setLoading] = useState(false)
  const [calledHelp, setCalledHelp] = useState(false)

  const requestAssistance = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pname: name, room: room }),
      })

      if (response.ok) {
        setCalledHelp(true) // ✅ mark help as called
        setTimeout(() => {
        setCalledHelp(false);
        }, 15000); // 15000ms = 15s
      } else {
        setCalledHelp(false)
      }
    } catch (error) {
      setCalledHelp(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ maxWidth: 600, margin: "40px auto" }}>
      <Title level={3}>Welcome, {name}</Title>
        <Col>
          <Button
            type="primary"
            onClick={requestAssistance}
            loading={loading}
            style={{ width: "100%", marginBottom: '16px', height: '500px', fontSize: '50px' }}
          >
            Request Assistance
          </Button>

          {/* ✅ In-app banner to show help was requested */}
          {calledHelp && (
            <Alert
              message="Help has been called!"
              description="A staff member has been notified."
              type="success"
              showIcon
              closable
              onClose={() => setCalledHelp(false)}
              style={{ marginBottom: 16 }}
            />
          )}
      </Col>

      
    </Card>
  )
}
