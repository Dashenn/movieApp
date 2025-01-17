const API_KEY = "25a55c8a-e9be-4601-9e60-c283b42270b1";
const API_URL =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1";
const API_URL_SERCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const getMovies = async (url) => {
  await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error getting movies");
      }

      return res.json();
    })
    .then((movies) => {
      showMovies(movies);
    })
    .catch((error) => {
      alert("Ошибка при загрузке списка фильмов");
    });
};
getMovies(API_URL);

function getColor(rating) {
  if (rating > 7) {
    return "green";
  } else if (rating > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const movies = document.querySelector(".movies");
  movies.innerHTML = "";
  const res = data.films || data.items;

  res.forEach((item) => {
    const rating = item.rating || item.ratingKinopoisk;
    const movie = `
         <div class="movie">
            <div class="movie__image">
                <img  src="${item.posterUrlPreview}" alt="${item.nameRu}">
            </div>
            <div class="movie__info info">
                <div class="info__title">${item.nameRu}</div>
                <div class="info__category">${item.genres.map(
                  (genre) => ` ${genre.genre}`
                )}</div>
                ${
                  rating &&
                  `
<div class="info__average info__average--${getColor(rating)}">${rating}</div> `
                } 
                
            </div>
        </div>
        `;

    movies.innerHTML += movie;
  });
}

const form = document.querySelector(".search");
const searchInput = document.querySelector(".search__input");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiSearchUrl = `${API_URL_SERCH}${searchInput.value}`;

  if (searchInput.value) {
    getMovies(apiSearchUrl);
  }
  searchInput.value = "";
});
