const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const Person = require("./models/person");

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res, next) => {
  res.send("<h1>hello!</h1>");
});
app.get("/info", (req, res) => {
  Person.find({})
    .then((result) => {
      res.send(
        `Phonebook has info for ${
          phonebook.length
        } people. <br/> ${new Date().toString()}`
      );
    })
    .catch((error) => {
      next(error);
    });
});
app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch" });
    });
});
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
  res.status(204).end();
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        return res.status(400).json({
          error: "person already exists",
        });
      }

      const person = new Person({
        number: body.number,
        name: body.name,
      });

      return person.save();
    })
    .then((savedPerson) => {
      res.status(201).json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});
app.put("/api/persons/:id", (req, res, next) => {
  const { number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: message });
  }
  response.status(500).send({ error: "internal server error" });

  next(error);
};

app.use(errorHandler);
