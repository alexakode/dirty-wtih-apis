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
const renderPokemonImage = (pokemonObj, shiny, sex, direction) => {
  let imageSource = undefined;
  // Determine the image source based on the shiny, sex, and direction
  if (sex === "male") {
    return shiny
      ? direction === "front"
        ? pokemonObj.sprites.front_shiny
        : pokemonObj.sprites.back_shiny
      : direction === "front"
      ? pokemonObj.sprites.front_default
      : pokemonObj.sprites.back_default;
  } else {
    return shiny
      ? direction === "front"
        ? pokemonObj.sprites.front_shiny
        : pokemonObj.sprites.back_shiny
      : direction === "front"
      ? pokemonObj.sprites.front_default
      : pokemonObj.sprites.back_default;
  }
  // const pokemonImg = document.createElement("img");
  // pokemonImg.src = imageSource;
  // pokemonImg.height = 100;
  // pokemonImg.width = 100;
  // return pokemonImg;
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
      pokemonImg.src = renderPokemonImage(
        pokemonData,
        pokemon.isShiny,
        pokemon.sex,
        pokemon.direction
      );
    });
    const toggleShinyBtn = document.createElement("button");
    toggleShinyBtn.textContent = "Toggle Shiny";
    toggleShinyBtn.addEventListener("click", () => {
      pokemon.isShiny = !pokemon.isShiny;
      pokemonImg.src = renderPokemonImage(
        pokemonData,
        pokemon.isShiny,
        pokemon.sex,
        pokemon.direction
      );
    });
    const swapGenderBtn = document.createElement("button");
    swapGenderBtn.textContent = "Swap Gender";
    swapGenderBtn.addEventListener("click", () => {
      pokemon.sex = pokemon.sex === "male" ? "female" : "male";
      pokemonImg.src = renderPokemonImage(
        pokemonData,
        pokemon.isShiny,
        pokemon.sex,
        pokemon.direction
      );
    });
    pokemonCard.append(
      pokemonImg,
      pokemonNameEl,
      rotateDirection,
      toggleShinyBtn,
      swapGenderBtn
    );
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
