import React, { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { Card, Row, Col } from "antd"
import './StaffScreen.css'


const socket = io("http://localhost:5000")

export default function StaffScreen() {
  const [activeRooms, setActiveRooms] = useState<{ room: number, timestamp: number }[]>([])

  const [, forceUpdate] = useState(0)
    useEffect(() => {
      const interval = setInterval(() => {
        forceUpdate((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }, [])



  useEffect(() => {
    socket.on("request_assistance", (data) => {
      console.log("Reached here again");
      console.log(data);
      const roomNum = parseInt(data.room); // Ensure room number is an integer
      console.log(roomNum.toString());
      if (!activeRooms.some((r) => r.room === roomNum)) {
        setActiveRooms((prev) => [...prev, { room: roomNum, timestamp: Date.now() }]);
      }
      
    });
  
    return () => {
      socket.off("request_assistance");
    };
  }, [activeRooms]);
  

  const handleAcknowledge = (room: number) => {
    setActiveRooms((prev) => prev.filter((r) => r.room !== room))
  }
  

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const roomNum = i + 1
          const roomData = activeRooms.find(r => r.room === roomNum)
          const isActive = !!roomData
          const redShades = [
            "#ffcccc", // very light red
            "#ff9999", // light red
            "#ff6666", // medium red
            "#ff3333", // dark red
            "#cc0000", // very dark red
            "#800000", // almost black red (maroon-ish)
          ]
          let backGroundColor = "#f0f0f0";

          let elapsedTime = ''
          if (roomData) {
            const seconds = Math.floor((Date.now() - roomData.timestamp) / 1000)
            const minutes = Math.floor(seconds / 60)
            const displaySeconds = seconds % 60
            const shadeIndex = Math.min(5, Math.floor(seconds / 3));
            backGroundColor = redShades[shadeIndex];
            elapsedTime = `Waiting: ${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`
          }


          return (
            <Col span={8} key={roomNum}>
              <Card
                hoverable
                onClick={() => handleAcknowledge(roomNum)}
                className={isActive ? "bounce" : ""}
                style={{
                  textAlign: "center",
                  backgroundColor:  backGroundColor,
                  color: isActive ? "#fff" : "#000",
                  fontWeight: "bold"
                }}
              >
                Room {roomNum}
                {isActive && (
                  <div style={{ marginTop: 8, fontSize: 14 }}>{elapsedTime}</div>
                )}
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}
