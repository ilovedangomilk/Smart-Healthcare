import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import PatientScreen from "./components/PatientScreen";
import StaffScreen from "./components/StaffScreen";
import Appointments from "./components/Appointments";
import MedicationRecord from "./components/MedicationRecord";

function App() {
  const [view, setView] = useState<"login" | "patient" | "staff">("login");
  const [userInfo, setUserInfo] = useState<any>({});

  const handleLogin = (role: string, info: any) => {
    setUserInfo(info);
    setView(role === "staff" ? "staff" : "patient");
  };

  if (view === "login") return <LoginPage onLogin={handleLogin} />;

  return (
    <Router>
      <div>
        {/* Route handling based on patient or staff */}
        {view === "patient" ? (
          <Routes>
            <Route
              path="/"
              element={
                <PatientScreen name={userInfo.name} room={userInfo.room} />
              }
            />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/medication-record" element={<MedicationRecord />} />
          </Routes>
        ) : (
          <StaffScreen />
        )}
      </div>
    </Router>
  );
}

export default App;
