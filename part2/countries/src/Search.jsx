import React from "react";

const Search = ({ query, handleQuery }) => {
  return (
    <div>
      <input
        placeholder="enter country name"
        onChange={handleQuery}
        value={query}
      />
    </div>
  );
};

export default Search;
