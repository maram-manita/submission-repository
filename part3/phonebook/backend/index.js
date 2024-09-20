const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>hello!</h1>");
});
app.get("/info", (req, res) => {
  res.send(
    `Phonebook has info for ${
      phonebook.length
    } people. <br/> ${new Date().toString()}`
  );
});
app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const phone = phonebook.find((p) => p.id === id);
  if (phone) {
    res.json(phone);
  } else {
    res.status(404).end();
  }
});
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phonebook = phonebook.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const maxId =
    phonebook.length > 0 ? Math.max(...phonebook.map((p) => p.id)) + 1 : 1;

  if (!body.name || !body.number) {
    return res.status(404).json({
      error: "content missing",
    });
  }
  const nameExists = phonebook.some((p) => p.name === body.name);
  if (nameExists) {
    return res.status(404).json({
      error: "name already exists",
    });
  }
  const phone = {
    id: maxId,
    number: body.number,
    name: body.name,
  };
  phonebook = phonebook.concat(phone);
  res.json(phone);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
