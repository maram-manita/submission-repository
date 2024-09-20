import { useState, useEffect } from "react";
import Filter from "./Filter";
import { PersonForm } from "./PersonForm";
import Persons from "./Persons";
import personService from "./services/persons";
import "./App.css";

const Notification = ({ error }) => {
  return (
    <div
      className={`toast ${error.feedbackType} ${error.show ? "show" : "hide"}`}
    >
      {error.message}
    </div>
  );
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [error, setError] = useState({
    message: "",
    feedbackType: "success",
    show: false,
  });
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value
      .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
      .trim();
    setNewNumber(formattedValue);
  };
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
        setError({
          message: `${newName} has been added successfully`,
          feedbackType: "success",
          show: true,
        });
        setTimeout(() => {
          setError((prevError) => ({
            ...prevError,
            show: false,
          }));
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
        setError({
          message: `${newName} does not exist in contact`,
          feedbackType: "error",
          show: true,
        });
        setTimeout(() => {
          setError((prevError) => ({
            ...prevError,
            show: false,
          }));
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
      person.name && person.name.toLowerCase().includes(filter.toLowerCase())
  );
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  return (
    <div className="homepage">
      <header>
        <h2 className="heading">Phonebook</h2>

        <Filter filter={filter} handleFilter={handleFilter} />
      </header>
      <section>
        <div className="add-new-section">
          <h3 className="heading-2">Add New Contact</h3>
          <PersonForm
            addPerson={addPerson}
            newName={newName}
            newNumber={newNumber}
            handleNameChange={handleNameChange}
            handleNumberChange={handleNumberChange}
            setNewNumber={setNewNumber}
          />
          <Notification error={error} />
        </div>
        <div className="contacts-section">
          <h3 className="heading-2">Contacts</h3>
          <Persons
            filteredPersons={filteredPersons}
            deletePerson={deletePerson}
          />
        </div>
      </section>
    </div>
  );
};

export default App;
