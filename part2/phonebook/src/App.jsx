import { useState, useEffect } from "react";
import Filter from "./Filter";
import { PersonForm } from "./PersonForm";
import Persons from "./Persons";
import personService from "./services/persons";
import "./App.css";

const Notification = ({ message, feedbackType }) => {
  return (
    <>{message && <div className={`toast ${feedbackType}`}>{message}</div>}</>
  );
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleFilter = (e) => setFilter(e.target.value);

  const addPerson = (e) => {
    e.preventDefault();
    const person = persons.find((p) => p.name === newName);
    if (person) {
      if (
        window.confirm(
          `${newName} already exists in the phonebook. Would you like to update their number instead?`
        )
      ) {
        updatePerson(person.id);
      } else {
        return;
      }
    } else {
      const personObj = {
        name: newName,
        number: newNumber,
      };
      personService.addNew(personObj).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setFeedback(`${newName} has been successfully added`);
        setFeedbackType("success");
        setTimeout(() => {
          setFeedback("");
        }, 3000);
      });
    }
    setNewName("");
    setNewNumber("");
  };
  const updatePerson = (id) => {
    const person = persons.find((p) => id === p.id);
    const updatedPerson = {
      ...person,
      number: newNumber,
    };
    personService
      .updatePerson(id, updatedPerson)
      .then((response) => {
        setPersons(persons.map((per) => (per.id !== id ? per : response)));
      })
      .catch((error) => {
        console.log("encountered error", error);
        setFeedback(`${newName} does not exist in phonebook`);
        setFeedbackType("error");
        setTimeout(() => {
          setFeedback("");
        }, 3000);
      });
  };
  const deletePerson = (id) => {
    const nameOf = persons.find((person) => person.id == id).name;
    if (window.confirm(`Are you sure you want to delete ${nameOf}?`)) {
      personService.delPerson(id).then(() => {
        setPersons(persons.filter((per) => per.id !== id));
      });
    }
  };
  const filteredPersons = persons.filter(
    (person) =>
      person && person.name.toLowerCase().includes(filter.toLowerCase())
  );
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={feedback} feedbackType={feedbackType} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>Add New Person</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
