import { useState } from "react"
import LoginPage from "./components/LoginPage"
import PatientScreen from "./components/PatientScreen"
import StaffScreen from "./components/StaffScreen"

function App() {
  const [view, setView] = useState<"login" | "patient" | "staff">("login")
  const [userInfo, setUserInfo] = useState<any>({})

  const handleLogin = (role: string, info: any) => {
    setUserInfo(info)
    setView(role === "staff" ? "staff" : "patient")
  }

  if (view === "login") return <LoginPage onLogin={handleLogin} />
  if (view === "patient") return <PatientScreen name={userInfo.name} room={userInfo.room} />
  return <StaffScreen />
}

export default App
