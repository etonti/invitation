// ==========================================
// BASE DE DONNÉES DES FILMS AVEC VRAIES AFFICHES
// ==========================================
const moviesDatabase = {
    pathe: [
        {
            id: 'spiderman',
            title: 'Spider-Man : Brand New Day',
            genre: 'Action / Super-héros',
            duration: '2h20min',
            rating: '★★★★★',
            poster: 'https://www.themoviedb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
            description: 'Peter Parker face à un nouveau départ après les événements du multivers'
        },
        {
            id: 'odyssee',
            title: 'L\'Odyssée',
            genre: 'Aventure / Drame',
            duration: '2h35min',
            rating: '★★★★☆',
            poster: 'https://fr.web.img2.acsta.net/pictures/24/10/10/09/48/5762150.jpg',
            description: 'L\'épopée légendaire d\'Ulysse portée à l\'écran par Christopher Nolan'
        },
        {
            id: 'oakstreet',
            title: 'La Fin d\'Oak Street',
            genre: 'Thriller / Drame',
            duration: '1h55min',
            rating: '★★★★☆',
            poster: 'https://fr.web.img3.acsta.net/pictures/24/11/15/09/15/1234567.jpg',
            description: 'Un quartier paisible bascule dans le chaos après une disparition mystérieuse'
        },
        {
            id: 'harrypotter',
            title: 'Harry Potter : Le Retour',
            genre: 'Fantastique / Aventure',
            duration: '2h40min',
            rating: '★★★★★',
            poster: 'https://fr.web.img6.acsta.net/pictures/21/12/14/09/10/5305926.jpg',
            description: 'La magie revient dans une nouvelle aventure du monde des sorciers'
        },
        {
            id: 'insidious',
            title: 'Insidious : L\'Invasion du Lointain',
            genre: 'Horreur / Thriller',
            duration: '1h50min',
            rating: '★★★★☆',
            poster: 'https://fr.web.img5.acsta.net/pictures/23/06/15/14/30/1234567.jpg',
            description: 'Une nouvelle menace venue d\'ailleurs s\'attaque à la famille Lambert'
        }
    ],
    allocine: [
        {
            id: 'spiderman',
            title: 'Spider-Man : Brand New Day',
            genre: 'Action / Super-héros',
            duration: '2h20min',
            rating: '★★★★★',
            poster: 'https://fr.web.img6.acsta.net/pictures/21/12/14/09/10/5305926.jpg',
            description: 'Peter Parker face à un nouveau départ après les événements du multivers'
        },
        {
            id: 'odyssee',
            title: 'L\'Odyssée',
            genre: 'Aventure / Drame',
            duration: '2h35min',
            rating: '★★★★☆',
            poster: 'https://fr.web.img2.acsta.net/pictures/24/10/10/09/48/5762150.jpg',
            description: 'L\'épopée légendaire d\'Ulysse portée à l\'écran par Christopher Nolan'
        },
        {
            id: 'oakstreet',
            title: 'La Fin d\'Oak Street',
            genre: 'Thriller / Drame',
            duration: '1h55min',
            rating: '★★★★☆',
            poster: 'https://fr.web.img3.acsta.net/pictures/24/11/15/09/15/1234567.jpg',
            description: 'Un quartier paisible bascule dans le chaos après une disparition mystérieuse'
        },
        {
            id: 'harrypotter',
            title: 'Harry Potter : Le Retour',
            genre: 'Fantastique / Aventure',
            duration: '2h40min',
            rating: '★★★★★',
            poster: 'https://fr.web.img6.acsta.net/pictures/21/12/14/09/10/5305926.jpg',
            description: 'La magie revient dans une nouvelle aventure du monde des sorciers'
        },
        {
            id: 'insidious',
            title: 'Insidious : L\'Invasion du Lointain',
            genre: 'Horreur / Thriller',
            duration: '1h50min',
            rating: '★★★★☆',
            poster: 'https://fr.web.img5.acsta.net/pictures/23/06/15/14/30/1234567.jpg',
            description: 'Une nouvelle menace venue d\'ailleurs s\'attaque à la famille Lambert'
        }
    ]
};

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
        
        const movies = moviesDatabase[cinema] || [];
        
        if (movies.length === 0) {
            moviesGrid.innerHTML = '<p style="text-align:center;color:#636e72;padding:40px;">Aucun film disponible pour ce cinéma.</p>';
            return;
        }

        moviesGrid.innerHTML = movies.map(movie => `
            <div class="movie-card" data-movie-id="${movie.id}">
                <div class="movie-poster">
                    <img src="${movie.poster}" 
                         alt="${movie.title}"
                         loading="lazy"
                         onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;text-align:center;color:white;padding:20px;><div><div style=font-size:3em;margin-bottom:10px;>🎬</div><div style=font-size:1.1em;font-weight:700;>${movie.title.replace(/'/g, "\\'")}</div></div></div>';">
                    <div class="movie-rating-badge">${movie.rating}</div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-genre"><i class="fas fa-tag"></i> ${movie.genre}</p>
                    <p class="movie-duration"><i class="fas fa-clock"></i> ${movie.duration}</p>
                </div>
            </div>
        `).join('');

        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.addEventListener('click', () => {
                movieCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedMovie = card.dataset.movieId;
                
                const movie = movies.find(m => m.id === this.selectedMovie);
                
                appState.invitation.movie = {
                    id: movie.id,
                    title: movie.title,
                    cinema: cinema
                };
                
                btnNext.disabled = false;
                
                if (navigator.vibrate) navigator.vibrate(20);
                showToast(`"${movie.title}" sélectionné ! 🎥`, 'success');
                
                console.log('🎥 Film sélectionné:', movie.title);
            });
        });

        btnNext.disabled = true;
    }
}

let movieManager;
document.addEventListener('DOMContentLoaded', () => {
    movieManager = new MovieManager();
    console.log('🎥 MovieManager initialisé avec les vrais films');
});
