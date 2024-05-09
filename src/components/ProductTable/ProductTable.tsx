import React, { useEffect, useState } from "react";
import { Character } from "../../types/Characters";
import { Episode } from "../../types/Episodes";
import { ProductService } from "../../services/ProductService";
import { Card, Col, Container, Form, Row, Alert, Toast, ToastContainer } from "react-bootstrap";
import Pagination from "../Paginador/Pagination";

const ProductTable = () => {
    const [products, setProducts] = useState<Character[]>([]);
    const [selectedCharacterSection1, setSelectedCharacterSection1] = useState<Character | null>(null);
    const [selectedCharacterSection2, setSelectedCharacterSection2] = useState<Character | null>(null);
    const [episodesSection1, setEpisodesSection1] = useState<Episode[]>([]);
    const [episodesSection2, setEpisodesSection2] = useState<Episode[]>([]);
    const [episodesShared, setEpisodesShared] = useState<Episode[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [noSharedEpisodes, setNoSharedEpisodes] = useState(false);
    const [duplicateCharacterError, setDuplicateCharacterError] = useState(false);

    const handlePrevPage = () => {
      setPage((prevPage) => prevPage - 1);
    };
  
    const handleNextPage = () => {
      setPage((nextPage) => nextPage + 1);
    };

    const fetchData = async () => {
      const { characters, pageInfo } = await ProductService.getProducts(page);
      setProducts(characters);
      setTotalPages(pageInfo.pages);
      setSelectedCharacterSection1(null); // Restablecer el personaje seleccionado de la sección 1 al cambiar de página
      setSelectedCharacterSection2(null); // Restablecer el personaje seleccionado de la sección 2 al cambiar de página
      setEpisodesSection1([]); // Limpiar los episodios de la sección 1 al cambiar de página
      setEpisodesSection2([]); // Limpiar los episodios de la sección 2 al cambiar de página
      setEpisodesShared([]); // Limpiar los episodios compartidos al cambiar de página
      setNoSharedEpisodes(false); // Restablecer el estado de noSharedEpisodes al cambiar de página
      setDuplicateCharacterError(false); // Restablecer el estado de duplicateCharacterError al cambiar de página
    };
  
    useEffect(() => {
        fetchData();
    }, [page]);

    const handleSelectSection1 = async (character: Character) => {
      if (character === selectedCharacterSection1) {
        setSelectedCharacterSection1(null);
        setEpisodesSection1([]);
        return;
      }

      if (character === selectedCharacterSection2) {
        setDuplicateCharacterError(true);
        return;
      }
    
      setSelectedCharacterSection1(character);
      setDuplicateCharacterError(false);
    
      const episodes = await ProductService.getEpisodes(character.episode);
      setEpisodesSection1(episodes);
    
      if (selectedCharacterSection2) {
        findSharedEpisodes(character, selectedCharacterSection2);
      }
    };  
    
    const handleSelectSection2 = async (character: Character) => {
      if (character === selectedCharacterSection2) {
        setSelectedCharacterSection2(null);
        setEpisodesSection2([]);
        return;
      }

      if (character === selectedCharacterSection1) {
        setDuplicateCharacterError(true);
        return;
      }
    
      setSelectedCharacterSection2(character);
      setDuplicateCharacterError(false);
    
      const episodes = await ProductService.getEpisodes(character.episode);
      setEpisodesSection2(episodes);
    
      if (selectedCharacterSection1) {
        findSharedEpisodes(selectedCharacterSection1, character);
      }
    };    

    const findSharedEpisodes = async (character1: Character, character2: Character) => {
      const episodes1 = await ProductService.getEpisodes(character1.episode);
      const episodes2 = await ProductService.getEpisodes(character2.episode);

      const sharedEpisodes = episodes1.filter(episode1 =>
        episodes2.some(episode2 => episode1.id === episode2.id)
      );

      setEpisodesShared(sharedEpisodes);
      setNoSharedEpisodes(sharedEpisodes.length === 0);
    };

    /* TOAST */
    const [showA, setShowA] = useState(true);
    const toggleShowA = () => setShowA(!showA);

    const [showB, setShowB] = useState(true);
    const toggleShowB = () => setShowB(!showB);
 
    return (
      <>
        <Container>
          <Row className='d-flex justify-content-center mb-5'>
            <Col>
              <h3>Sección 1</h3>
              {products.map(product => (
                <Card key={product.id} style={{ width:'14rem', margin:'4px' }}>
                  <Card.Img variant="top" src={product.image} style={{ width: '10px', height:'auto' }}/>
                  <Card.Body>
                    <Form.Check
                      type="checkbox"
                      label={`${product.name}`}
                      name="section1"
                      checked={selectedCharacterSection1 === product}
                      onChange={() => handleSelectSection1(product)}
                    />
                    <Card.Title>{product.id} - {product.name}</Card.Title>
                    <Card.Text>
                      {product.status} - {product.species}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
              <h3>Episodios Sección 1</h3>
              {selectedCharacterSection1 && selectedCharacterSection2 && episodesSection1.map(episode => (
                <Card key={episode.id} style={{ margin:'4px' }}>
                  <Card.Body>
                    <Card.Title>{episode.name}</Card.Title>
                    <Card.Text>
                      {episode.episode} - {episode.air_date}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Col>
            <Col>
              <h3>Sección 2</h3>
              {products.map(product => (
                <Card key={product.id} style={{ margin:'4px' }}>
                  <Card.Img variant="top" src={product.image} style={{ width: '10px', height:'auto' }}/>
                  <Card.Body>
                    <Form.Check
                      type="checkbox"
                      label={`${product.name}`}
                      name="section2"
                      checked={selectedCharacterSection2 === product}
                      onChange={() => handleSelectSection2(product)}
                    />
                    <Card.Title>{product.id} - {product.name}</Card.Title>
                    <Card.Text>
                      {product.status} - {product.species}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
              <h3>Episodios Sección 2</h3>
              {selectedCharacterSection1 && selectedCharacterSection2 && episodesSection2.map(episode => (
                <Card key={episode.id} style={{ margin:'4px' }}>
                  <Card.Body>
                    <Card.Title>{episode.name}</Card.Title>
                    <Card.Text>
                      {episode.episode} - {episode.air_date}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Episodios Compartidos</h3>
              {selectedCharacterSection1 && selectedCharacterSection2 && episodesShared.map(episode => (
                <Card key={episode.id} style={{ margin:'4px' }}>
                  <Card.Body>
                    <Card.Title>{episode.name}</Card.Title>
                    <Card.Text>
                      {episode.episode} - {episode.air_date}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>

          {duplicateCharacterError && 
            <ToastContainer
            className="p-3"
            position="bottom-end"
            style={{ zIndex: 1 }}
            >
              <Toast show={showA} onClose={toggleShowA}>
              <Toast.Header>
                <strong className="me-auto">¡no se puede elegir 2 iguales!</strong>
              </Toast.Header>
              <Toast.Body>probá con otro ;)</Toast.Body>
              </Toast>
            </ToastContainer>
          }
          {noSharedEpisodes && (
            <ToastContainer
            className="p-3"
            position="bottom-end"
            style={{ zIndex: 1 }}
            >
              <Toast show={showB} onClose={toggleShowB}>
              <Toast.Header>
                <strong className="me-auto">no comparten episodios</strong>
              </Toast.Header>
              <Toast.Body>que lastima :(</Toast.Body>
              </Toast>
            </ToastContainer>
          )}
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
