(function () {
  const form = document.querySelector(".search");
  const searchInput = document.querySelector(".search__input");
  const modal = document.querySelector(".modal");

  const API_KEY = "25a55c8a-e9be-4601-9e60-c283b42270b1";
  const API_URL =
    "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=";
  const API_URL_SERCH =
    "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
  const API_URL_MOVIE = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

  const getMovies = async (url, page = 1) => {
    const paginatedUrl = `${url}${page}`;
    await fetch(paginatedUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при загрузке списка фильмов");
        }

        return res.json();
      })
      .then((movies) => {
        showMovies(movies);
        showPagination(movies, page, url);
      })
      .catch(() => {
        alert("Ошибка при загрузке списка фильмов");
      });
  };

  getMovies(API_URL, 1);

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
                <img  src="${item.posterUrlPreview}" alt="${item.nameRu}" >
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

    const movieOpenList = document.querySelectorAll(".movie");
    movieOpenList.forEach((movieElement, index) => {
      movieElement.addEventListener("click", () =>
        openModal(res[index].kinopoiskId)
      );
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const apiSearchUrl = `${API_URL_SERCH}${searchInput.value}`;

    if (searchInput.value) {
      getMovies(apiSearchUrl);
    }
    searchInput.value = "";
  });

  function getMoviesSearch() {
    modal.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");

    modal.innerHTML = `
<div class="modal__card">
      <img class="modal__movie-backdrop" src="${movie.posterUrl}" alt="">
      <h2>
        <span class="modal__movie-title">${movie.nameRu}</span>
        <span class="modal__movie-release-year">${movie.year}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">${movie.genres.map(
          (genre) => genre.genre
        )}</li>
        ${
          movie.filmLength
            ? `<li class="modal__movie-runtime">Время -  ${movie.filmLength} минут</li> `
            : ""
        }
        <li >Сайт: <a class="modal__movie-site" href="${movie.webUrl}">${
      movie.webUrl
    }</a></li>
        <li class="modal__movie-overview">Описание - ${movie.description}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
`;
    const btnClose = document.querySelector(".modal__button-close");
    btnClose.addEventListener("click", () => {
      closeModal();
    });
  }

  async function openModal(id) {
    const getMovies = async (url) => {
      await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка при загрузке списка фильмов");
          }

          return res.json();
        })
        .then((movie) => {
          getMoviesSearch();
        })
        .catch(() => {
          alert("Ошибка при загрузке списка фильмов");
        });
    };
    getMovies(API_URL_MOVIE + id);
  }

  function closeModal() {
    modal.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
  }

  function showPagination(data, currentPage, url) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const totalPages = data.totalPages || data.searchFilmsCountResult / 20;
    console.log(data.searchFilmsCountResult);

    if (currentPage > 1) {
      const prevButton = `<button class="pagination__button" data-page="${
        currentPage - 1
      }">Предыдущая</button>`;
      pagination.innerHTML += prevButton;
    }

    for (let i = 1; i <= totalPages; i++) {
      const activeClass =
        i === parseInt(currentPage) ? "pagination__button--active" : "";
      const pageButton = `<button class="pagination__button ${activeClass}" data-page="${i}">${i}</button>`;
      pagination.innerHTML += pageButton;
    }

    if (currentPage < totalPages) {
      const nextButton = `<button class="pagination__button" data-page="${
        currentPage + 1
      }">Следующая</button>`;
      pagination.innerHTML += nextButton;
    }

    const buttons = document.querySelectorAll(".pagination__button");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const page = e.target.getAttribute("data-page");
        getMovies(url, page);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      closeModal();
    }
  });
})();
