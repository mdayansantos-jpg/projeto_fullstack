import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const addUser = async () => {
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const res = await fetch("http://localhost:3000/users");
    setUsers(await res.json());
  };

  return (
    <div>
      <h1>CRUD de Usuários</h1>

      <input placeholder="Nome" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={addUser}>Adicionar</button>

      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
