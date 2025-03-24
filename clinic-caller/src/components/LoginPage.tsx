import React, { useState } from "react"
import { Card, Select, Button, Input, Typography } from "antd"

const { Option } = Select
const { Title } = Typography

export default function LoginPage({ onLogin }: { onLogin: (role: string, info: any) => void }) {
  const [role, setRole] = useState("patient")
  const [room, setRoom] = useState("")
  const [name, setName] = useState("")

  const handleLogin = () => {
    if (role === "staff") {
      onLogin("staff", {})
    } else {
      onLogin("patient", { room, name })
    }
  }

  return (
    <Card style={{ maxWidth: 400, margin: "100px auto" }}>
      <Title level={3}>Login</Title>

      <Select defaultValue="patient" onChange={(val) => setRole(val)} style={{ width: "100%", marginBottom: 16 }}>
        <Option value="patient">Patient</Option>
        <Option value="staff">Staff</Option>
      </Select>

      {role === "patient" && (
        <>
          <Input placeholder="Patient Name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 12 }} />
          <Input placeholder="Room Number (1-6)" value={room} onChange={(e) => setRoom(e.target.value)} style={{ marginBottom: 12 }} />
        </>
      )}

      <Button type="primary" onClick={handleLogin} block>
        Enter
      </Button>
    </Card>
  )
}
