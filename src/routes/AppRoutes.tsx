import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import React from "react"

const AppRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
    </Routes>
  )
}

export default AppRoutes