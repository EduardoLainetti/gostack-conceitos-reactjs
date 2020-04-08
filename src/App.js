import React, { useState, useEffect} from "react";

import "./styles.css";
import api from "./services/api";

function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: "New repository " + Date.now(),
      url: "https://github.com/teste/",
      techs: ["Node", "Express", "TypeScript"]
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete('repositories/'+id);
    
    if(response.status === 204) {
      const repositoryIndex = repositories.findIndex(repository => repository.id === id);

      setRepositories([...repositories.slice(0, repositoryIndex),
                      ...repositories.slice(repositoryIndex + 1, repositories.length)]);
    }      
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {
          repositories.map(repository => (
            <li key={repository.id}>
              {repository.title}
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          )         
        )}      
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
