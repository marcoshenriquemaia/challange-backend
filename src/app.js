const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

const validadeProjectId = (req, res, next) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'id no exist' });
  }

  return next();
};

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validadeProjectId);

const repositories = [];


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepositorie = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(newRepositorie);

  return response.json(newRepositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const newRepository = { ...repositories[repositoryIndex], title, url, techs }

  repositories[repositoryIndex] = newRepository;
  
  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  console.log(id);

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) return response.status(400).json({ error: 'Repository not found' });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) return response.status(400).json({ error: 'Repository not found' });

  const newLikeQuantity = repositories[repositoryIndex].likes + 1;

  const newRepository = { ...repositories[repositoryIndex], likes: newLikeQuantity };

  console.log(newRepository);

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});


module.exports = app;
