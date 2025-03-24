import React, { createContext, useState, ReactNode, useContext } from "react"

// Create context to hold name and room
const UserContext = createContext<{
  name: string | null
  room: string | null
  setUser: (name: string, room: string) => void
} | null>(null)

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [name, setName] = useState<string | null>(null)
  const [room, setRoom] = useState<string | null>(null)

  const setUser = (name: string, room: string) => {
    setName(name)
    setRoom(room)
  }

  return (
    <UserContext.Provider value={{ name, room, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
