import { useEffect, useState } from "react";

// Garante que a URL comece com http ou https.
let API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
if (!API_URL.startsWith("http")) {
  API_URL = `https://${API_URL}`;
}

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = () => {
    fetch(`${API_URL}/users`)
      .then(async res => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("A API retornou HTML em vez de JSON. Verifique se VITE_API_URL está correta.");
        }
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setUsers)
      .catch(err => console.error("Erro ao carregar usuários:", err));
  };

  useEffect(() => {
    fetchUsers(); // Busca inicial
  }, []);

  const addUser = async () => {
    try {
      const resPost = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      if (!resPost.ok) throw new Error(await resPost.text());

      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) throw new Error(await res.text());
      
      setUsers(await res.json());
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      alert("Erro ao salvar. Verifique o console (F12) para detalhes.");
    }
  };

  const updateUser = async () => {
    await fetch(`${API_URL}/users/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const res = await fetch(`${API_URL}/users`);
    setUsers(await res.json());
    setName("");
    setEmail("");
    setEditingId(null);
  };

  const deleteUser = async (id) => {
    await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });
    setUsers(users.filter((user) => user.id !== id));
  };

  const startEditing = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditingId(user.id);
  };

  return (
    <div className="container">
      <h1>CRUD de Usuários</h1>

      <div className="form-container">
        <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="btn-primary" onClick={editingId ? updateUser : addUser}>
          {editingId ? "Atualizar" : "Adicionar"}
        </button>
        {editingId && <button className="btn-secondary" onClick={() => { setEditingId(null); setName(""); setEmail(""); }}>Cancelar</button>}
      </div>

      <ul className="user-list">
        {users.map(u => (
          <li key={u.id} className="user-item">
            <span>{u.name} - {u.email}</span>
            <div className="actions">
              <button className="btn-edit" onClick={() => startEditing(u)}>Editar</button>
              <button className="btn-delete" onClick={() => deleteUser(u.id)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
