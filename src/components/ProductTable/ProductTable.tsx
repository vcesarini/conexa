import React, { useEffect, useRef, useState } from "react";
import { Character } from "../../types/Characters";
import CharacterCard from "../CharacterCard/CharacterCard";
import { Episode } from "../../types/Episodes";
import { ProductService } from "../../services/ProductService";
import { Card, Col, Container, Form, Row, Alert, ListGroup } from "react-bootstrap";
import Pagination from "../Paginador/Pagination";
import './productTable.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<Character[]>([]);
    const [selectedCharacterSection1, setSelectedCharacterSection1] = useState<Character | null>(null);
    const [selectedCharacterSection2, setSelectedCharacterSection2] = useState<Character | null>(null);
    const [episodesSection1, setEpisodesSection1] = useState<Episode[]>([]);
    const [episodesSection2, setEpisodesSection2] = useState<Episode[]>([]);
    const [episodesShared, setEpisodesShared] = useState<Episode[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [noSharedEpisodes, setNoSharedEpisodes] = useState<boolean>(false);
    const [duplicateCharacterError, setDuplicateCharacterError] = useState<boolean>(false);
    const resultsRef = useRef<HTMLDivElement>(null);

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
        notify();
        return;
      }
    
      setSelectedCharacterSection1(character);
      setDuplicateCharacterError(false);
    
      const episodes = await ProductService.getEpisodes(character.episode);
      setEpisodesSection1(episodes);
    
      if (selectedCharacterSection2) {
        findSharedEpisodes(character, selectedCharacterSection2);
        scrollToResults();
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
        notify();
        return;
      }
    
      setSelectedCharacterSection2(character);
      setDuplicateCharacterError(false);
    
      const episodes = await ProductService.getEpisodes(character.episode);
      setEpisodesSection2(episodes);
    
      if (selectedCharacterSection1) {
        findSharedEpisodes(selectedCharacterSection1, character);
        scrollToResults();
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

    const scrollToResults = () => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    const notify = () => 
      toast.warn('¡no se puede elegir 2 iguales! probá con otro', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    return (
      <>
        <Container>
          <Row className='d-flex justify-content-center mb-5'>
            <Col>
              <h3>Character #1</h3>
              <h6>Seleccioná un pesonaje</h6>
              <div className="d-flex flex-wrap">
                {products.map(product => (
                  <CharacterCard
                    key={product.id}
                    character={product}
                    selectedCharacter={selectedCharacterSection1}
                    onSelect={handleSelectSection1}
                  />
                ))}
              </div>
            </Col>
            <Col>
              <h3>Character #2</h3>
              <h6>Seleccioná un pesonaje</h6>
              <div className="d-flex flex-wrap">
                {products.map(product => (
                  <CharacterCard
                    key={product.id}
                    character={product}
                    selectedCharacter={selectedCharacterSection2}
                    onSelect={handleSelectSection2}
                  />
                ))}
              </div>
            </Col>
          </Row>
          <hr></hr>
          <Row ref={resultsRef}>
            <Col>
            <h4>Episodios del Character #1</h4>
              {selectedCharacterSection1 && selectedCharacterSection2 && episodesSection1.map(episode => (
              <ListGroup key={episode.id} style={{ marginBottom:'4px' }}>
                <ListGroup.Item><strong>{episode.name}:</strong> {episode.episode} | {episode.air_date}</ListGroup.Item>
              </ListGroup>
              ))}
            </Col>
            <Col>
            <h4>Episodios del Character #2</h4>
              {selectedCharacterSection1 && selectedCharacterSection2 && episodesSection2.map(episode => (
                <ListGroup key={episode.id} style={{ marginBottom:'4px' }}>
                  <ListGroup.Item><strong>{episode.name}:</strong> {episode.episode} | {episode.air_date}</ListGroup.Item>
                </ListGroup>
              ))}
              </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col>
              <h4>Episodios compartidos de los Characters</h4>
              <div className="d-flex flex-wrap">
              {selectedCharacterSection1 && selectedCharacterSection2 && episodesShared.map(episode => (
                <ListGroup key={episode.id} style={{ width:'12rem', margin:'4px' }}>
                  <ListGroup.Item style={{ height: '140px' }}><strong>{episode.name}:</strong> {episode.episode}<br/>{episode.air_date}</ListGroup.Item>
                </ListGroup>
              ))}
              {selectedCharacterSection1 && selectedCharacterSection2 && noSharedEpisodes && (
                <Alert variant="warning">
                  <strong>Qué lástima!</strong> estos Characters no comparten episodios. Selecconá otro porfa ;)
                </Alert>
              )}
              </div>
            </Col>
          </Row>
        </Container>
          <div className="flex-wrap my-5">
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          </div>

          {duplicateCharacterError &&
            <ToastContainer/>
          }

          <div><p style={{ fontSize: '12px'}}>🌈 Realizado por Vale C</p></div>
      </>
    )
}

export default ProductTable;
