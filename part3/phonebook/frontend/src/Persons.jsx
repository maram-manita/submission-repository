import React from "react";
import "./App.css";

const Persons = ({ filteredPersons, deletePerson }) => {
  if (filteredPersons.length > 0) {
    return (
      <div className="all-contacts">
        {filteredPersons.map((person) => (
          <div className="contact" key={person.id}>
            <p>{person.name} </p>
            <p>{person.number}</p>
            <button
              className="delete-icon-button"
              onClick={() => {
                deletePerson(person.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <p
        style={{
          textTransform: "capitalize",
          fontStyle: "italic",
          color: "#979797",
        }}
      >
        no contacts to show
      </p>
    );
  }
};

export default Persons;
