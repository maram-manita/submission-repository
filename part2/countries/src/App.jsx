import { useEffect, useState } from "react";
import axios from "axios";
import Search from "./Search";
import CountryProfile from "./CountryProfile";

const RenderCountries = ({ filteredCountries, setQuery }) => {
  if (filteredCountries.length == 1) {
    return <CountryProfile country={filteredCountries[0]} />;
  } else if (filteredCountries.length < 10) {
    return (
      <CountriesList
        filteredCountries={filteredCountries}
        setQuery={setQuery}
      />
    );
  } else {
    return <p>too many countries. please refine search</p>;
  }
};
const CountriesList = ({ filteredCountries, setQuery }) => {
  return (
    <>
      {filteredCountries.map((country) => (
        <div key={country.cca3}>
          {country.name.common}{" "}
          <button
            onClick={() => {
              setQuery(country.name.common);
            }}
          >
            show
          </button>
        </div>
      ))}
    </>
  );
};
const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const filteredCountries = countries.filter(
    (country) =>
      country.name &&
      country.name.common.toLowerCase().includes(query.toLowerCase())
  );
  const handleQuery = (e) => {
    setQuery(e.target.value);
  };
  const getCountries = async () => {
    const response = await axios.get(
      "https://studies.cs.helsinki.fi/restcountries/api/all"
    );
    console.log(weather);
    setCountries(response.data);
  };
  useEffect(() => {
    getCountries();
  }, []);
  return (
    <div>
      <Search value={query} handleQuery={handleQuery} />
      <h1>Countries</h1>
      {filteredCountries.length > 0 && (
        <RenderCountries
          filteredCountries={filteredCountries}
          setQuery={setQuery}
        />
      )}
    </div>
  );
};

export default App;
