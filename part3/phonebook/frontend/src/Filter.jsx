import React, { useState } from "react";
import "./App.css";

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      <input
        value={filter}
        onChange={handleFilter}
        placeholder="filter name by..."
      />
    </div>
  );
};

export default Filter;
