import React, { useEffect, useState, } from "react";
import { io } from "socket.io-client";
import { Card, Row, Col, Button } from "antd";
import "./StaffScreen.css";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  path: "/socket.io",
});
interface RoomRequest {
  room: number;
  timestamp: number;
}

const StaffScreen: React.FC = () => {
  const [activeRooms, setActiveRooms] = useState<RoomRequest[]>([]);
  const navigate = useNavigate(); // <--- for navigation

  useEffect(() => {
    socket.on("new_request", (data: { room: string; timestamp: number }) => {
      const roomNum = parseInt(data.room);
      setActiveRooms((prev) => {
        if (!prev.some((r) => r.room === roomNum)) {
          return [...prev, { room: roomNum, timestamp: data.timestamp }];
        }
        return prev;
      });
    });

    socket.on("request_acknowledged", (data: { room: string }) => {
      setActiveRooms((prev) =>
        prev.filter((r) => r.room !== parseInt(data.room))
      );
    });

    return () => {
      socket.off("new_request");
      socket.off("request_acknowledged");
    };
  }, []);

  const handleAcknowledge = async (room: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/acknowledge/${room}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to acknowledge");
      }
    } catch (error) {
      console.error("Acknowledge error:", error);
    }
  };

  const getRoomColor = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    const shadeIndex = Math.min(5, Math.floor(seconds / 5));
    return ["#fff0f0", "#ffdddd", "#ffcccc", "#ffaaaa", "#ff8888", "#ff6666"][
      shadeIndex
    ];
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        Patient Assistance Requests
      </h1>
      <Row gutter={[16, 16]} justify='center'>
        {Array.from({ length: 6 }).map((_, i) => {
          const roomNum = i + 1;
          const roomData = activeRooms.find((r) => r.room === roomNum);
          const isActive = !!roomData;

          let elapsedTime = "";
          let backgroundColor = "#f0f0f0";

          if (roomData) {
            backgroundColor = getRoomColor(roomData.timestamp);
            const seconds = Math.floor(
              (Date.now() - roomData.timestamp) / 1000
            );
            const minutes = Math.floor(seconds / 60);
            const displaySeconds = seconds % 60;
            elapsedTime = `${minutes}:${displaySeconds
              .toString()
              .padStart(2, "0")}`;
          }

          return (
            <Col span={8} key={roomNum}>
              <Card
                hoverable
                onClick={() => handleAcknowledge(roomNum)}
                className={isActive ? "pulse" : ""}
                style={{
                  textAlign: "center",
                  backgroundColor,
                  color: isActive ? "#fff" : "#000",
                  fontWeight: "bold",
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontSize: 24 }}>Room {roomNum}</div>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Row gutter={[16, 16]} justify="center"  style={{ marginTop: 24 }}>
        <Col>
          <Button type="primary" onClick={() => navigate("/feedback")}>
            Go to Feedback
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default StaffScreen;
