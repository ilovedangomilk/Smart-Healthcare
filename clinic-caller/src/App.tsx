import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import PatientScreen from "./components/PatientScreen";
import StaffScreen from "./components/StaffScreen";
import Appointments from "./components/Appointments";
import MedicationRecord from "./components/MedicationRecord";
import FeedbackPage from "./components/FeedbackPage";

function App() {
  const [view, setView] = useState<"login" | "patient" | "staff">("login");
  const [userInfo, setUserInfo] = useState<any>({});

  // Handle login logic; set "patient" or "staff" based on role
  const handleLogin = (role: string, info: any) => {
    setUserInfo(info);
    setView(role === "staff" ? "staff" : "patient");
  };

  // Show login until user chooses staff/patient
  if (view === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      {/* If the user is a patient, render routes relevant to patients */}
      {view === "patient" && (
        <Routes>
          <Route
            path="/"
            element={<PatientScreen name={userInfo.name} room={userInfo.room} />}
          />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/medication-record" element={<MedicationRecord />} />
          {/* Add other patient-only pages if needed */}
        </Routes>
      )}

      {/* If the user is staff, render staff routes (including feedback) */}
      {view === "staff" && (
        <Routes>
          <Route path="/" element={<StaffScreen />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          {/* Add other staff-only pages if needed */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
