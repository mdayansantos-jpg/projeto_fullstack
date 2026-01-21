const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Array para armazenar usuários
let users = [];
let nextId = 1; // id automático

// CREATE
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  res.json(newUser);
});

// READ ALL
app.get("/users", (req, res) => {
  res.json(users);
});

// READ BY ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

// UPDATE
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (user) {
    const { name, email } = req.body;
    user.name = name;
    user.email = email;
    res.json(user);
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

// DELETE
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    const deleted = users.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
