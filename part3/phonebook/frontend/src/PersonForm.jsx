import React from "react";
import "./App.css";

export const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson} className="input-form">
      <div className="input-frame">
        <p>Name</p>
        <input
          placeholder="Name"
          value={props.newName}
          onChange={props.handleNameChange}
          required
        />
        <p className="error-msg">name cannot be empty</p>
      </div>
      <div className="input-frame">
        <p>Number</p>
        <input
          placeholder="Number"
          value={props.newNumber}
          onChange={props.handleNumberChange}
          pattern="^\d{3}-\d{3}-\d{4}$"
        />
        <p className="error-msg">phone number is invalid</p>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
