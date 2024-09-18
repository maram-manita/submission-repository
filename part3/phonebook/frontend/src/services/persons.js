import axios from "axios";

const savedURL = "http://localhost:3001/api/persons";

const getAll = () => {
  const request = axios.get(savedURL);
  return request.then((response) => {
    return response.data;
  });
};
const addNew = (newPerson) => {
  const request = axios.post(savedURL, newPerson);
  return request.then((res) => res.data);
};
const delPerson = (id) => {
  const request = axios.delete(`${savedURL}/${id}`);
  return request.then((res) => res.data);
};
const updatePerson = (id, updatedPerson) => {
  const request = axios.put(`${savedURL}/${id}`, updatedPerson);
  return request.then((res) => res.data);
};
export default { getAll, addNew, delPerson, updatePerson };
