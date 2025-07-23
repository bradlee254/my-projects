const API_KEY = 'ed600cce75d4e8b15e69de8b6471d437';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moviesGrid = document.getElementById('moviesGrid');
const genreBtn = document.getElementById('genreButtons');
const homeBtn = document.getElementById('homeBtn');
const signUpModal = document.getElementById("signUpModal");
const loginModal = document.getElementById("loginModal");
const headerSignUpBtn = document.getElementById("signInBtn"); 

  // OPEN MODALS
  headerSignUpBtn.addEventListener("click", () => {
    signUpModal.classList.remove("hidden");
  });

  document.getElementById("openLoginFromSignup").addEventListener("click", () => {
    signUpModal.classList.add("hidden");
    loginModal.classList.remove("hidden");
  });

  document.getElementById("openSignupFromLogin").addEventListener("click", () => {
    loginModal.classList.add("hidden");
    signUpModal.classList.remove("hidden");
  });

  


  document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if(!username || !email || !password){
        alert('please enter you Name, Email & Password');
        return;
    }
    console.log("Sign Up:", { username, email, password });
    alert("Account created!");
    
    signUpModal.classList.add("hidden");
    
  });

  
  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username-login").value;
    const password = document.getElementById("password-login").value;

    if(!username || !password){
        alert("Username and Password are Requird");
        return;
    }
    console.log("Log In:", { username, password });
    alert("Logged in!");
    loginModal.classList.add("hidden");
  });




let genreMap = {};

// Fetch and display genre buttons
async function fetchGenres() {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();

    data.genres.forEach(genre => {
        genreMap[genre.id] = genre.name;

        const btn = document.createElement('button');
        btn.textContent = genre.name;
        btn.className = 'px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600';
        btn.onclick = () => fetchMoviesByGenre(genre.id);
        genreButtons.appendChild(btn);
    });

   
}

// Fetch popular movies
async function fetchPopularMovies() {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    displayMoviesByGenre(data.results);
}

// Fetch movies by genre
async function fetchMoviesByGenre(genreId) {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    const data = await res.json();
    displayMovies(data.results);
}

// Search movies
async function searchMovies(query) {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    displayMovies(data.results);
}

// Display movies
function displayMovies(movies) {
    moviesGrid.className='grid grid-cols-2 md:grid-cols-4 gap-4'

    moviesGrid.innerHTML = '';
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p class="col-span-4 text-center text-red-400">No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const genreNames = movie.genre_ids.map(id => genreMap[id]).filter(Boolean).join(', ');

        moviesGrid.innerHTML += `
            <div onclick="fetchMoviedetails(${movie.id})" class="cursor-pointer hover:scale-105 transition">
                <img src="${IMG_BASE}${movie.poster_path}" class="rounded mb-1"/>
                <h2 class="text-sm font-semibold">${movie.title}</h2>
                <p class="text-xs text-gray-400">${genreNames}</p>
            </div>`;
    });
}
//filter by genres
function displayMoviesByGenre(movies) {
    moviesGrid.className ='space-y-6'
    moviesGrid.innerHTML = ''; // Clear previous content

    const genreGroups = {};

    // Group movies by genre ID
    movies.forEach(movie => {
        movie.genre_ids.forEach(genreId => {
            if (!genreGroups[genreId]) genreGroups[genreId] = [];
            genreGroups[genreId].push(movie);
        });
    });

    // Sort genr alphabetically by genre name
    const sortedGenreIds = Object.keys(genreGroups).sort((a, b) => {
        const nameA = genreMap[a] || '';
        const nameB = genreMap[b] || '';
        return nameA.localeCompare(nameB);
    });

    // Loop through sorted genres
    sortedGenreIds.forEach(genreId => {
        const genreName = genreMap[genreId];
        const moviesInGenre = genreGroups[genreId].slice(0, 4); // Limit to 5 movies

        const movieRow = document.createElement('div');
        movieRow.innerHTML = `
            <h2 class="text-xl font-bold mb-2">${genreName}</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${moviesInGenre.map(movie => `
                    <div onclick="fetchMoviedetails(${movie.id})" class="cursor-pointer hover:scale-105 transition">
                        <img src="${IMG_BASE}${movie.poster_path}" class="rounded mb-1"/>
                        <h2 class="text-sm font-semibold">${movie.title}</h2>
                    </div>
                `).join('')}
            </div>
        `;

        moviesGrid.appendChild(movieRow);
    });
}


// Fetch movie details and trailer
async function fetchMoviedetails(movieId) {
    const detailsResponse = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const details = await detailsResponse.json();

    const videosResponse = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const videos = await videosResponse.json();
    const trailer = videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    showMovieDetails(details, trailer);
}

// Show movie modal with details
function showMovieDetails(movie, trailer) {
    const modal = document.getElementById('movieModal');
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('moviePoster').src = `${IMG_BASE}${movie.poster_path}`;
    document.getElementById('movieOverview').textContent = movie.overview || 'No description';
    document.getElementById('movieRelease').textContent = `Release Date: ${movie.release_date || 'N/A'}`;
    document.getElementById('movieRating').textContent = `Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10`;

    const trailerContainer = document.getElementById('movieTrailer');
    if (trailer) {
        trailerContainer.innerHTML = `
            <iframe class="w-full h-64" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
        `;
    } else {
        trailerContainer.innerHTML = "<p>No trailer available.</p>";
    }

    modal.classList.remove('hidden');
}
homeBtn.addEventListener('click',()=>{
    fetchPopularMovies();
});

// Search button handler
searchBtn.addEventListener('click',()=>{
    const query = document.getElementById('searchInput').value.trim();
    searchMovies(query)
});
searchInput.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        const query = document.getElementById('searchInput').value.trim();
        searchMovies(query);
    }
});
document.getElementById('closeModal').addEventListener('click', ()=>{
    document.getElementById('movieModal').classList.add('hidden');
    document.getElementById('movieTrailer').innerHTML='';
});
document.getElementById('closesignModal').addEventListener('click',()=>{
    signUpModal.classList.add('hidden');
});
document.getElementById('closelogModal').addEventListener('click',()=>{
    loginModal.classList.add('hidden');
})

// Initialize
fetchGenres();
fetchPopularMovies();
