import React, { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { Card, Row, Col } from "antd"

const socket = io("http://localhost:5000")

export default function StaffScreen() {
  const [activeRooms, setActiveRooms] = useState<number[]>([])

  useEffect(() => {
    socket.on("request_assistance", (data) => {
      const roomNum = parseInt(data.room)
      if (!activeRooms.includes(roomNum)) {
        setActiveRooms((prev) => [...prev, roomNum])
      }
    })

    return () => {
      socket.off("request_assistance")
    }
  }, [activeRooms])

  const handleAcknowledge = (room: number) => {
    setActiveRooms((prev) => prev.filter((r) => r !== room))
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const roomNum = i + 1
          const isActive = activeRooms.includes(roomNum)

          return (
            <Col span={8} key={roomNum}>
              <Card
                hoverable
                onClick={() => handleAcknowledge(roomNum)}
                style={{
                  textAlign: "center",
                  backgroundColor: isActive ? "#ff4d4f" : "#f0f0f0",
                  color: isActive ? "#fff" : "#000",
                  fontWeight: "bold"
                }}
              >
                Room {roomNum}
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}
