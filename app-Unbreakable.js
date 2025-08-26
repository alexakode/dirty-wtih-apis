const pokemonsContainer = document.querySelector("#pokemons-container");
const POKEMON_API_URL = "https://pokeapi.co/api/v2";
let page = 1;
// Fetch pokemon service, specifying versioning may allow backwards compatability
const fetchPokemons = async (limit, offset) => {
  try {
    const response = await fetch(
      `${POKEMON_API_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    const jsonBody = await response.json();
    return jsonBody.results;
  } catch (err) {
    throw new Error("Failed to parse JSON response");
  }
};
const fetchPokemon = async (url) => {
  const response = await fetch(url);
  const jsonBody = await response.json();
  return jsonBody;
};
const buildPage = async (pokemons) => {
  for (let pokemon of pokemons) {
    const pokemonData = await fetchPokemon(pokemon.url);
    const pokemonCard = document.createElement("div");
    const pokemonImg = document.createElement("img");
    pokemonImg.src = pokemonData.sprites.front_default;
    pokemonImg.height = 100;
    pokemonImg.width = 100;
    const pokemonNameEl = document.createElement("h1");
    pokemonNameEl.textContent = pokemonData.name;
    pokemonCard.append(pokemonImg, pokemonNameEl);
    pokemonsContainer.append(pokemonCard);
  }
  const nextPageBtn = document.createElement("button");
  nextPageBtn.textContent = "Next Page";
  nextPageBtn.addEventListener("click", () => {
    page++;
    renderPage();
  });
};
const renderPage = async () => {
  const pokemons = await fetchPokemons(10, (page - 1) * 10);
  buildPage(pokemons);
};

renderPage();
