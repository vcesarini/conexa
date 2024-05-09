import { useEffect, useState } from "react";
import { Character } from "../../types/Characters";
import { ProductService } from "../../services/ProductService";
import { Button, Card, Container, ListGroup, Row } from "react-bootstrap";
import React from "react";
import Pagination from "../Paginador/Pagination";

const ProductTable = () => {
    const [products, setProducts] = useState<Character[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePrevPage = () => {
      setPage((prevPage) => prevPage - 1);
    };
  
    const handleNextPage = () => {
      setPage((nextPage) => nextPage + 1);
    };
  
    useEffect(() => {
        const fetchData = async () => {
            const { characters, pageInfo } = await ProductService.getProducts(page);
            setProducts(characters);
            setTotalPages(pageInfo.pages);
        };
  
        fetchData();
    }, [page]);

    return (
      <>
        <Container>
          <Row className='d-flex justify-content-center mb-5'>
            {products.map(product => (
            //   <Card border="dark" style={{ width: '18rem', margin:'4px' }}>
            //   <Card.Header>{product.id}</Card.Header>
            //   <Card.Body>
            //     <Card.Title>{product.name}</Card.Title>
            //     <Card.Text>
            //     {product.status}
            //     </Card.Text>
            //     <Card.Text>
            //     {product.species}
            //     </Card.Text>
            //   </Card.Body>
            // </Card>
            <Card style={{ width: '18rem', margin:'4px' }}>
            <Card.Img variant="top" src={product.image}/>
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>
              {product.status}
              </Card.Text>
            </Card.Body>
          </Card>
            ))}
          </Row>
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
          />
        </Container>
      </>
    )
}

export default ProductTable;
