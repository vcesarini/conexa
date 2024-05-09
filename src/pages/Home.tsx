import { Container, Row } from "react-bootstrap"
import ProductTable from "../components/ProductTable/ProductTable"
import React from "react"

const Home = () => {
  return (
    <>
      <Container className="mt-5">
        <Row className='d-flex justify-content-center'>
          <ProductTable/>
        </Row>
      </Container>
    </>
  )
}

export default Home