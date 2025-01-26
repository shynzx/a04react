import React, { useEffect, useState } from "react";

const pokeapi = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedPokemon")) || [];
  });

  useEffect(() => {
    const fetchPokemonData = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
          })
        );
        setPokemonList(detailedPokemon);
      } catch (error) {
        console.error("Error connecting to the API:", error);
      }
    };

    fetchPokemonData(pokeapi);
  }, []);

  const addPokemonToSelection = (pokemon) => {
    if (!selectedPokemon.some((p) => p.id === pokemon.id)) {
      const newSelection = [
        ...selectedPokemon,
        {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.front_default,
          stats: pokemon.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`),
        },
      ];
      setSelectedPokemon(newSelection);
      localStorage.setItem("selectedPokemon", JSON.stringify(newSelection));
    }
  };

  const removePokemonFromSelection = (pokemonId) => {
    const newSelection = selectedPokemon.filter((pokemon) => pokemon.id !== pokemonId);
    setSelectedPokemon(newSelection);
    localStorage.setItem("selectedPokemon", JSON.stringify(newSelection));
  };

  const clearAllSelectedPokemon = () => {
    setSelectedPokemon([]);
    localStorage.removeItem("selectedPokemon");
  };

  return (
    <div className="app-container">
      <h1>Escoge Pokemones</h1>

      <div className="pokemon-list">
     
        <div className="grid">
          {pokemonList.map((pokemon) => (
            <div
              key={pokemon.id}
              className="pokemon-card"
              onClick={() => addPokemonToSelection(pokemon)}
            >
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <h3>{pokemon.name}</h3>
              <ul>
                {pokemon.stats.map((stat) => (
                  <li key={stat.stat.name}>
                    {stat.stat.name}: {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="selected-pokemon">
      <h2>pokemones seleccionados</h2>
        <button onClick={clearAllSelectedPokemon}>Clear All</button>
        <div className="grid">
          {selectedPokemon.map((pokemon) => (
            <div key={pokemon.id} className="selected-pokemon-card">
              <img src={pokemon.image} alt={pokemon.name} />
              <h3>{pokemon.name}</h3>
              <ul>
                {pokemon.stats.map((stat, index) => (
                  <li key={index}>{stat}</li>
                ))}
              </ul>
              <button onClick={() => removePokemonFromSelection(pokemon.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
