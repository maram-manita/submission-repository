import React, { useState } from "react";

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      filter name by <input value={filter} onChange={handleFilter} />
    </div>
  );
};

export default Filter;
