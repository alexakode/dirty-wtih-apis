const POKEMON_API_URL = "https://pokeapi.co/api/v2/";
// Fetch pokemon service, specifying versioning may allow backwards compatability
const fetchPokemons = async () => {
  const response = await fetch(`${POKEMON_API_URL}pokemon`);
  try {
    const response = await fetch(`${POKEMON_API_URL}pokemon`);
    const jsonBody = await response.json();
    return jsonBody.results;
  } catch (err) {
    throw new Error("Failed to parse JSON response");
  }
};

const renderPage = () => {};

renderPage();
