import React from "react";
import { Card, Form } from "react-bootstrap";

const CharacterCard = ({ character, selectedCharacter, onSelect }) => {
  return (
    <Card style={{ width: "12rem", margin: "4px" }}>
      <Card.Img variant="top" src={character.image} className="ImgProduct" />
      <Card.Body>
        <Form.Check
          type="checkbox"
          label={`${character.name}`}
          name="section1"
          className="FontCheck"
          checked={selectedCharacter === character}
          onChange={() => onSelect(character)}
        />
      </Card.Body>
      <Card.Footer>
        <div className="FontCard">
          {character.status === "Alive" && <span>🌟 {character.status}</span>}
          {character.status === "Dead" && <span>💀 {character.status}</span>}
          {character.status === "unknown" && <span>🤔 {character.status}</span>}
        </div>
        <div className="FontCard">
          {character.species === "Alien" && (
            <span>👽 {character.species}</span>
          )}
          {character.species === "Human" && character.gender === "Female" && (
            <span>🚺 {character.species}</span>
          )}
          {character.species === "Human" && character.gender === "Male" && (
            <span>🚹 {character.species}</span>
          )}
          {character.species !== "Alien" && character.species !== "Human" && (
            <span>🚀 {character.species}</span>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default CharacterCard;
