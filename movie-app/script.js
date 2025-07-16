const API_KEY = 'ed600cce75d4e8b15e69de8b6471d437';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const searchInput = document.getElementById('searchInput');
const moviesGrid = document.getElementById('moviesGrid');
const searchBtn = document.getElementById('searchBtn');
const homeBtn = document.getElementById('homeBtn');

async function fetchPopularMovies() {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    displayMovies(data.results);
}

async function fetchMoviedetails(movieId) {
    // Fetch movie details
    const detailsResponse = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const details = await detailsResponse.json();

    // Fetch trailer
    const videosResponse = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const videos = await videosResponse.json();
    const trailer = videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    showMovieDetails(details, trailer);
}

async function searchMovies(query) {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p class="col-span-4 text-center text-red-400">No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        moviesGrid.innerHTML += `
            <div onclick="fetchMoviedetails(${movie.id})" class="cursor-pointer hover:scale-105 transition">
                <img src="${IMG_BASE}${movie.poster_path}" class="rounded mb-1"/>
                <h2 class="text-sm">${movie.title}</h2>
            </div>`;
    });
}

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
})
// Handle search
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

// Initial load
fetchPopularMovies();