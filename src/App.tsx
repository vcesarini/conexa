import { BrowserRouter as Router } from "react-router-dom"
import { Container } from "react-bootstrap";
import AppRoutes from "./routes/AppRoutes";

import React from "react";

function App() {

  return (
    <>
      <Router>
          <Container style={{minHeight: '100vh', minWidth: '100%', padding: '0'}}>
              <AppRoutes/>
          </Container>
      </Router>
    </>
  )
}

export default App
