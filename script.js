
const API_KEY = '7280f710e91af0da2ac7e1f28a860e2a'
const API_BASE = 'https://api.themoviedb.org/3/'

const API_MOVIE = `${API_BASE}discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`
const API_TV = `${API_BASE}discover/tv?sort_by=popularity.desc&api_key=${API_KEY}&page=1`


const IMG_PATH = 'https://image.tmdb.org/t/p/w1280/'
const SEARCH_URL = `${API_BASE}search/movie?api_key=${API_KEY}&page=1&query="`

const movieCards = document.getElementById('movie-cards')
const form = document.getElementById('search-form')
const search = document.getElementById('search')

const navEntryBtn = document.getElementById('nav-entry');
const navExitBtn = document.getElementById('nav-exit');
const responsiveCategory = document.querySelector('.responsive-category');


const movieGenreList = document.querySelectorAll('.category-container:first-child .category-list a');
const movieGenreIds = ['28', '12', '16', '35', '80', '99', '18', '10751', '14', '36', '27', '10402', '9648', '10749', '878', '10770', '53', '10752', '37'];

const tvGenreList = document.querySelectorAll('.category-container:last-child .category-list a');
const tvGenreIds = ['10759', '16', '35', '80', '99', '18', '10751', '10762', '9648', '10763', '10764', '10765', '10766', '10767', '10768', '37'];

const genreTextMap = {
    '28': 'Action', '12': 'Adventure', '16': 'Animation', '35': 'Comedy', '80': 'Crime',
    '99': 'Documentary', '18': 'Drama', '10751': 'Family', '14': 'Fantasy', '36': 'History',
    '27': 'Horror', '10402': 'Music', '9648': 'Mystery', '10749': 'Romance', '878': 'Science Fiction',
    '10770': 'TV Movie', '53': 'Thriller', '10752': 'War', '37': 'Western',
    '10759': 'Action & Adventure', '10762': 'Animation', '10751': 'Comedy', '10763': 'Crime',
    '10764': 'Documentary', '10765': 'Drama', '10766': 'Family', '10767': 'Kids', '10768': 'Mystery',
};
const resultTitleTemplate = document.getElementById('title-template')

function updateTitleTemplate(genreId, mediaType, searchTerm) {
    if (mediaType === 'search') {
        resultTitleTemplate.textContent = `Search Results for: ${searchTerm}`;
    } else {
        const genreText = genreId ? genreTextMap[genreId] : ''; // Check if genreId is defined
        const mediaText = mediaType === 'movie' ? 'Movies' : 'TV Shows';
        resultTitleTemplate.textContent = `${mediaText}: ${genreText}`;
    }
}
function setDefaultTransform() {
    const isSmallScreen = window.innerWidth <= 768;
    responsiveCategory.style.transition = isSmallScreen ? 'transform 0.3s ease-in' : 'none';
    responsiveCategory.style.transform = isSmallScreen ? 'translateX(150%)' : 'translateX(0%)';
    responsiveCategory.style.overflowY = isSmallScreen ? 'scroll' : 'none';
  }
  

  setDefaultTransform();

  function handleNavButtonClick() {
    responsiveCategory.style.transform = responsiveCategory.style.transform === 'translateX(0%)' ? 'translateX(150%)' : 'translateX(0%)';
  }

movieGenreList.forEach((movieGenre, index) => {
    movieGenre.classList.add('genre-tag');
    movieGenre.setAttribute('data-genre_id', movieGenreIds[index]);
});

tvGenreList.forEach((tvGenre, index) => {
    tvGenre.classList.add('genre-tag');
    tvGenre.setAttribute('data-genre_id', tvGenreIds[index]);
});

// getting movies
getMovies(API_MOVIE)


async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()
    
    showMovies(data.results)
}

// getting tv
async function getTVshows(url) {
    const res = await fetch(url)
    const data = await res.json()

    showTVshows(data.results)

}

function showMovies(movies) {
    movieCards.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, release_date } = movie;

        // Check if poster_path is available
        if (poster_path) {
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
      
            const overviewEl = document.createElement('div');
            overviewEl.classList.add('overview');
      
            overviewEl.innerHTML = 
            `
            <div class="movie-rating" > 
                    <p class="${getClassByRate( vote_average)}">${vote_average}</p>
            </div>
            <div class="overview-text">
                    <small class="release">${release_date}</small>
                    <h3>${title}</h3>
                    <p>${overview}</p>
            </div>
            `;

    
            movieEl.innerHTML = `<img src="${IMG_PATH + poster_path}" alt="${title}">`;
            movieEl.appendChild(overviewEl);

            movieCards.appendChild(movieEl);

            overviewEl.style.opacity = 0;
            movieEl.addEventListener('click', () => {
                overviewEl.style.opacity = overviewEl.style.opacity === '1' ? '0' : '1';
            });
        
      

            
          }
    });
}

function showTVshows(tvShows) {
    movieCards.innerHTML = '';

    tvShows.forEach((tv) => {
        const { name, first_air_date, poster_path, vote_average, overview } = tv;

        // Check if poster_path is available
        if (poster_path) {
            const tvEl = document.createElement('div');
            tvEl.classList.add('movie');
      
            const overviewEl = document.createElement('div');
            overviewEl.classList.add('overview');
      
            overviewEl.innerHTML = 
            `
            <div class="movie-rating" > 
                    <p class="${getClassByRate(vote_average)}">${vote_average}</p>
            </div>
            <div class="overview-text">
                    <small class="release">${first_air_date}</small>
                    <h3>${name}</h3>
                    <p>${overview}</p>
            </div>
            `;

            tvEl.innerHTML = `<img src="${IMG_PATH + poster_path}" alt="${name}">`;
            tvEl.appendChild(overviewEl);

            movieCards.appendChild(tvEl);

            overviewEl.style.opacity = 0;
            tvEl.addEventListener('click', () => {
                overviewEl.style.opacity = overviewEl.style.opacity === '1' ? '0' : '1';
            });
        }
    });
}




function getClassByRate(vote) {
    if(vote >= 8 ) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}




async function searchMedia(searchTerm, mediaType) {
    const searchUrl = `${API_BASE}search/${mediaType}?api_key=${API_KEY}&page=1&query=${searchTerm}`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    
    return data.results;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        // Use the searchMedia function for both movies and TV shows
        const movieResults = await searchMedia(searchTerm, 'movie');
        const tvResults = await searchMedia(searchTerm, 'tv');

        // Combine and display the results
        const combinedResults = [...movieResults, ...tvResults];
        showCombinedResults(combinedResults);

        updateTitleTemplate(null, 'search', searchTerm);

        search.value = '';
    } else {
        window.location.reload();
    }
});

function showCombinedResults(results) {
    movieCards.innerHTML = '';

    results.forEach((result) => {
        const { title, name, poster_path, vote_average, overview, release_date, first_air_date } = result;

        // Check if poster_path is available
        if (poster_path) {
            const resultEl = document.createElement('div');
            resultEl.classList.add('movie');
      
            const overviewEl = document.createElement('div');
            overviewEl.classList.add('overview');
      
            overviewEl.innerHTML = 
            `
            <div class="movie-rating" > 
                    <p class="${getClassByRate(vote_average)}">${vote_average}</p>
            </div>
            <div class="overview-text">
                    <small class="release">${release_date || first_air_date}</small>
                    <h3>${title || name}</h3>
                    <p>${overview}</p>
            </div>
            `;

            resultEl.innerHTML = `<img src="${IMG_PATH + poster_path}" alt="${title || name}">`;
            resultEl.appendChild(overviewEl);

            movieCards.appendChild(resultEl);

            overviewEl.style.opacity = 0;
            resultEl.addEventListener('click', () => {
                overviewEl.style.opacity = overviewEl.style.opacity === '1' ? '0' : '1';
            });
        }
    });
}



function addGenreClickListener(genreList, mediaType, getMediaFunction) {
    genreList.forEach(genre => {
        genre.addEventListener('click', () => {
            let genreValue = genre.getAttribute('data-genre_id');
            const apiEndpoint = `${API_BASE}discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreValue}`;

            
            genreList.forEach(otherGenre => {
                otherGenre.classList.remove('active');
            });


            genre.classList.add('active');


            getMediaFunction(apiEndpoint);

            // Update title template
            updateTitleTemplate(genreValue, mediaType);
        });
    });
}
addGenreClickListener(movieGenreList, 'movie', getMovies);
addGenreClickListener(tvGenreList, 'tv', getTVshows);
navEntryBtn.addEventListener('click', handleNavButtonClick);
navExitBtn.addEventListener('click', handleNavButtonClick);

window.addEventListener('resize', setDefaultTransform);