// ==========================================
// BASE DE DONNÉES DES FILMS AVEC PROGRAMMES
// ==========================================
const allMovies = [
    {
        id: 'spiderman',
        title: 'Spider-Man : Brand New Day',
        genre: 'Action / Super-héros',
        duration: '2h20min',
        rating: '★★★★★',
        poster: 'https://m.media-amazon.com/images/M/MV5BZDEyN2NhMjgtMjdhNi00MmNlLWE5YTgtZGE4MzNjMTRlMGEwXkEyXkFqcGc@._V1_.jpg',
        description: 'Peter Parker face à un nouveau départ',
        schedule: {
            'pathe-orleans': {
                '2026-08-11': ['16:45', '18:00', '18:30', '20:00', '21:30'],
                '2026-08-12': ['16:45', '18:00', '18:30', '20:00', '21:30'],
                '2026-08-13': ['16:45', '18:00', '18:30', '20:00', '21:30'],
                '2026-08-14': ['16:45', '18:00', '18:30', '20:00', '21:30'],
                '2026-08-15': ['16:45', '18:00', '18:30', '20:00', '21:30'],
                '2026-08-16': ['16:00', '19:00']
            },
            'pathe-saran': {
                '2026-08-11': ['19:00', '20:30', '22:00'],
                '2026-08-12': ['19:00', '20:30', '22:00'],
                '2026-08-13': ['19:00', '20:30', '22:00'],
                '2026-08-14': ['19:00', '20:30', '22:00'],
                '2026-08-15': ['19:00', '20:30', '22:00']
            }
        }
    },
    {
        id: 'odyssee',
        title: "L'Odyssée",
        genre: 'Aventure / Drame',
        duration: '2h35min',
        rating: '★★★★☆',
        poster: 'https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_.jpg',
        description: "L'épopée légendaire d'Ulysse",
        schedule: {
            'pathe-orleans': {
                '2026-08-11': ['17:20', '19:30', '20:00', '21:00'],
                '2026-08-12': ['17:20', '19:30', '20:00', '21:00'],
                '2026-08-13': ['17:20', '19:30', '20:00', '21:00'],
                '2026-08-14': ['17:20', '19:30', '20:00', '21:00'],
                '2026-08-15': ['17:20', '19:30', '20:00', '21:00']
            },
            'pathe-saran': {
                '2026-08-11': ['17:45', '20:00', '21:00'],
                '2026-08-12': ['17:45', '20:00', '21:00'],
                '2026-08-13': ['17:45', '20:00', '21:00'],
                '2026-08-14': ['17:45', '20:00', '21:00'],
                '2026-08-15': ['17:45', '20:00', '21:00']
            }
        }
    },
    {
        id: 'obsession',
        title: "L'Obsession",
        genre: 'Thriller / Drame',
        duration: '2h00min',
        rating: '★★★★☆',
        poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM0YjI1NzMxXkEyXkFqcGc@._V1_.jpg',
        description: 'Une obsession qui vire au cauchemar',
        schedule: {
            'pathe-orleans': {
                '2026-08-11': ['22:00'],
                '2026-08-12': ['22:00'],
                '2026-08-13': ['22:00'],
                '2026-08-14': ['22:00'],
                '2026-08-15': ['22:00']
            },
            'pathe-saran': {
                '2026-08-11': ['22:00'],
                '2026-08-12': ['22:00'],
                '2026-08-13': ['22:15'],
                '2026-08-14': ['22:30'],
                '2026-08-15': ['22:00']
            }
        }
    }
];

const moviesDatabase = {
    'pathe-orleans': allMovies,
    'pathe-saran': allMovies
};

// Rendre allMovies accessible globalement pour l'email
window.allMovies = allMovies;

// ==========================================
// GESTIONNAIRE DE FILMS
// ==========================================
class MovieManager {
    constructor() {
        this.selectedMovie = null;
        this.currentCinema = null;
    }

    loadMovies(cinema) {
        this.currentCinema = cinema;
        this.selectedMovie = null;
        
        const moviesGrid = document.getElementById('moviesGrid');
        const btnNext = document.getElementById('btnNextMovie');
        
        if (!moviesGrid) return;
        
        const movies = moviesDatabase[cinema] || allMovies;
        
        moviesGrid.innerHTML = movies.map(movie => `
            <div class="movie-card" data-movie-id="${movie.id}">
                <div class="movie-poster">
                    <img src="${movie.poster}" alt="${movie.title}" loading="lazy"
                         onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#667eea,#764ba2)';this.parentElement.innerHTML+='<div style=position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:white;><div style=font-size:2.5em;>🎬</div><div style=font-size:0.9em;font-weight:700;>${movie.title}</div></div>';">
                    <div class="movie-rating-badge">${movie.rating}</div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-genre"><i class="fas fa-tag"></i> ${movie.genre}</p>
                    <p class="movie-duration"><i class="fas fa-clock"></i> ${movie.duration}</p>
                </div>
            </div>
        `).join('');

        const cards = moviesGrid.querySelectorAll('.movie-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedMovie = card.dataset.movieId;
                
                const movie = movies.find(m => m.id === this.selectedMovie);
                appState.invitation.movie = {
                    id: movie.id,
                    title: movie.title,
                    poster: movie.poster,
                    cinema: cinema,
                    schedule: movie.schedule
                };
                
                btnNext.disabled = false;
                if (navigator.vibrate) navigator.vibrate(20);
                showToast('"' + movie.title + '" sélectionné ! 🎥', 'success');
            });
        });

        btnNext.disabled = true;
    }

    getMovieSchedule(cinema, movieId) {
        const movie = allMovies.find(m => m.id === movieId);
        if (!movie || !movie.schedule || !movie.schedule[cinema]) return {};
        return movie.schedule[cinema];
    }

    getAvailableDates(cinema, movieId) {
        const schedule = this.getSchedule(cinema, movieId);
        return Object.keys(schedule);
    }

    getAvailableTimes(cinema, movieId, dateStr) {
        const schedule = this.getSchedule(cinema, movieId);
        return schedule[dateStr] || [];
    }

    getSchedule(cinema, movieId) {
        const movie = allMovies.find(m => m.id === movieId);
        if (!movie || !movie.schedule) return {};
        return movie.schedule[cinema] || {};
    }
}

let movieManager;
document.addEventListener('DOMContentLoaded', () => {
    movieManager = new MovieManager();
    window.movieManager = movieManager;
    console.log('🎥 MovieManager prêt avec 3 films');
});
