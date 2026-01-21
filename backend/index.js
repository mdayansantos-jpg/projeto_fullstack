const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose(); // Importa o SQLite
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste para verificar se o servidor está rodando
app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

// CONFIGURAÇÃO DO BANCO DE DADOS
// Isso criará um arquivo chamado 'database.db' na sua pasta
const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erro ao abrir banco:", err.message);
  else console.log("Conectado ao banco de dados SQLite.");
});

// Criar a tabela de usuários se ela não existir
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
)`);

// --- ROTAS CRUD ---

// CREATE
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  
  db.run(sql, [name, email], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, email });
  });
});

// READ ALL
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// READ BY ID
app.get("/users/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    row ? res.json(row) : res.status(404).json({ error: "Usuário não encontrado" });
  });
});

// UPDATE
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  
  db.run(sql, [name, email, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json({ id: req.params.id, name, email });
  });
});

// DELETE
app.delete("/users/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deletado com sucesso", id: req.params.id });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});