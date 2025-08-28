const pokemonsContainer = document.querySelector("#pokemons-container");
const POKEMON_API_URL = "https://pokeapi.co/api/v2";
let page = 1;
let pokemonList = [];
// Fetch pokemon service, specifying versioning may allow backwards compatability
/* Store some states
- isShiny: boolean
- direction: string
- sex: string
*/
const fetchPokemons = async (limit, offset) => {
  try {
    const response = await fetch(
      `${POKEMON_API_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    const jsonBody = await response.json();
    return jsonBody.results.map((pokemon) => ({
      ...pokemon,
      name: pokemon.name,
      url: pokemon.url,
      isShiny: false,
      direction: "front",
      sex: "male",
    }));
  } catch (err) {
    throw new Error("Failed to parse JSON response");
  }
};
// spread
const fetchPokemon = async (url) => {
  const response = await fetch(url);
  const jsonBody = await response.json();
  return jsonBody;
};
const nextPageButton = () => {
  const nextPageBtn = document.createElement("button");
  nextPageBtn.textContent = "Next Page";
  nextPageBtn.addEventListener("click", () => {
    page++;
    renderPage();
  });
  return nextPageBtn;
};
const previousPageButton = () => {
  const previousPageBtn = document.createElement("button");
  previousPageBtn.textContent = "Previous Page";
  previousPageBtn.addEventListener("click", () => {
    page--;
    renderPage();
  });
  return previousPageBtn;
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
    const rotateDirection = document.createElement("button");
    rotateDirection.textContent = "Rotate Pokemon";
    rotateDirection.addEventListener("click", () => {
      pokemon.direction = pokemon.direction === "front" ? "back" : "front";
      pokemonImg.src =
        pokemon.direction === "front"
          ? pokemonData.sprites.front_default
          : pokemonData.sprites.back_default;
    });
    const toggleShinyBtn = document.createElement("button");
    toggleShinyBtn.textContent = "Toggle Shiny";
    toggleShinyBtn.addEventListener("click", () => {
      pokemon.isShiny = !pokemon.isShiny;
      pokemonImg.src = pokemon.isShiny
        ? pokemonData.sprites.front_shiny
        : pokemonData.sprites.front_default;
    });
    pokemonCard.append(pokemonImg, pokemonNameEl, rotateDirection, toggleShinyBtn);
    pokemonsContainer.append(pokemonCard);
  }
};
const renderPage = async () => {
  pokemonsContainer.innerHTML = "";
  pokemonList = await fetchPokemons(10, (page - 1) * 10);
  // console.log(pokemonList);
  await buildPage(pokemonList);
};
renderPage();
document.body.append(previousPageButton(), nextPageButton());
