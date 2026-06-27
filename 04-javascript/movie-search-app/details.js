var API_KEY = "aa185bc9";

var params = new URLSearchParams(window.location.search);
var id = params.get("id");
var title=document.getElementById("title")

async function getMovieDetails() {
  var response = await fetch("https://www.omdbapi.com/?i=" + id + "&apikey=" + API_KEY);
  var movie = await response.json();

  displayMovie(movie);
  loadSimilarMovies(movie.Title);
}

function displayMovie(movie) {
  var container = document.getElementById("movieDetails");

  var poster = movie.Poster;
  if (poster == "N/A") {
    poster = "https://via.placeholder.com/300";
  }

  title.innerText=movie.Title
  
  container.innerHTML = `
    <div class="row">

      <div class="col-md-4">
        <img src="${poster}" class="poster">
      </div>

      <div class="col-md-8">

        <h2 class="title">${movie.Title}</h2>
        <p>${movie.Year} • ${movie.Runtime}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>IMDb Rating:</strong> ⭐ ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        
        <div class="mt-3">
          <button class="btn btn-custom me-2" onclick='addToBookmarks(${JSON.stringify(movie)})'>+ WatchList</button>
          <button class="btn btn-secondary" onclick="goBack()">Back</button>
        </div>

        <hr>

        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Writer:</strong> ${movie.Writer}</p>
        <p><strong>Language:</strong> ${movie.Language}</p>
        <p><strong>Country:</strong> ${movie.Country}</p>
        <p><strong>Awards:</strong> ${movie.Awards}</p>
        <p><strong>Box Office:</strong> ${movie.BoxOffice}</p>
      </div>
    </div>
  `;
}

async function loadSimilarMovies(title) {
  var keyword = title.split(":")[0];
  var response = await fetch(
    "https://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + keyword
  );
  var data = await response.json();
  if (data.Search) {
    displaySimilar(data.Search);
  }
}

function displaySimilar(movies) {
  var container = document.getElementById("similarContainer");
  container.innerHTML = "";

  for (var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    var poster = movie.Poster;
    if (poster == "N/A") {
      poster = "https://via.placeholder.com/300";
    }

    var card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <div class="card text-white">
        <img src="${poster}" class="card-img-top">
        <div class="card-body">
          <h6 class="card-title">${movie.Title}</h6>
          <button class="btn btn-danger">View</button>
        </div>
      </div>
    `;

    card.onclick = (function(id) {
      return function () {
        window.location.href = "details.html?id=" + id;
      };
    })(movie.imdbID);

    container.appendChild(card);
  }
}

function addToBookmarks(movie) {
  var bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  for (var i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].imdbID == movie.imdbID) {
      alert("Already bookmarked");
      return;
    }
  }

  bookmarks.push(movie);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  alert("Added to bookmarks");
}

function goBack() {
  window.history.back();
}

getMovieDetails();