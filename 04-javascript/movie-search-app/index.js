var API_KEY = "aa185bc9";

async function fetchMovies(query, containerId) {
  var response = await fetch("https://www.omdbapi.com/?s=" + query + "&apikey=" + API_KEY);
  var data = await response.json();

  displayMovies(data.Search, containerId, false);
}

document.getElementById("searchInput").addEventListener("keypress", function(event) {

  if (event.key === "Enter") {
    searchMovies();
  }

});

function displayMovies(movies, containerId, isBookmark) {
  var container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!movies) return;

  for (let i = 0; i < movies.length; i++) {
    var movie = movies[i];

    var poster = movie.Poster;
    if (poster == "N/A") {
      poster = "https://via.placeholder.com/300";
    }

    var buttonHTML = "";

    if (isBookmark) {
      buttonHTML = `<button onclick='event.stopPropagation(); removeBookmark("${movie.imdbID}")' class="btn btn-danger">Remove</button>`;
    } else {
      buttonHTML = `<button onclick='event.stopPropagation(); addToBookmarks(${JSON.stringify(movie)})' class="btn btn-danger">+ WatchList</button>`;
    }

    var card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <div class="card bg-dark text-white">
        <img src="${poster}" class="card-img-top">
        <div class="card-body text-center">
          <h6 class="card-title">${movie.Title}</h6>
          ${buttonHTML}
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

function searchMovies() {
  var query = document.getElementById("searchInput").value;

  if (query === "") {
    fetchMovies("avengers", "recentContainer");
    document.getElementById("recentTitle").innerText = "Popular Movies";

    sessionStorage.removeItem("lastSearch");
    return;
  }

  document.getElementById("recentTitle").innerText = "Search Results";

  sessionStorage.setItem("lastSearch", query);

  fetchMovies(query, "recentContainer");
}

function addToBookmarks(movie) {
  var user = localStorage.getItem("currentUser");
  var key = "bookmarks_" + user;

  var bookmarks = JSON.parse(localStorage.getItem(key)) || [];

  for (var i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].imdbID == movie.imdbID) {
      alert("Already bookmarked");
      return;
    }
  }

  bookmarks.push(movie);
  localStorage.setItem(key, JSON.stringify(bookmarks));

  loadBookmarks(); 
}

function removeBookmark(id) {
  var user = localStorage.getItem("currentUser");

  var key = "bookmarks_" + user;

  var bookmarks = JSON.parse(localStorage.getItem(key)) || [];

  var newList = [];

  for (var i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].imdbID != id) {
      newList.push(bookmarks[i]);
    }
  }

  localStorage.setItem(key, JSON.stringify(newList));
  loadBookmarks();
}

function loadBookmarks() {
  var user = localStorage.getItem("currentUser");

  var key = "bookmarks_" + user;

  var bookmarks = JSON.parse(localStorage.getItem(key));

  if (!bookmarks) {
    document.getElementById("bookmarkContainer").innerHTML = "<p>No bookmarks yet</p>";
    return;
  }

  displayMovies(bookmarks, "bookmarkContainer", true);
}

window.onload = function () {
  var lastSearch = sessionStorage.getItem("lastSearch");

  if (lastSearch) {
    document.getElementById("searchInput").value = lastSearch;

    fetch("https://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + lastSearch)
      .then(res => res.json())
      .then(data => {
        displayMovies(data.Search, "recentContainer", false);
        document.getElementById("recentTitle").innerText = "Search Results";
      });

  } else {
    fetchMovies("avengers", "recentContainer");
  }

  loadBookmarks();
};

function logout() {
  sessionStorage.removeItem("currentUser");
  window.location.href = "login.html";
}