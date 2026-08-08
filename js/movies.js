// ==========================================
// BASE DE DONNÉES DES FILMS
// ==========================================
const allMovies = [
    {
        id: 'spiderman',
        title: 'Spider-Man : Brand New Day',
        genre: 'Action / Super-héros',
        duration: '2h20min',
        rating: '★★★★★',
        poster: 'https://photos.infolocale.fr/infolocale/openagenda/2026/08/28/9606124/_1_cover_290-200_.jpg?rnd=20260804054214',
        description: 'Peter Parker face à un nouveau départ'
    },
    {
        id: 'odyssee',
        title: "L'Odyssée",
        genre: 'Aventure / Drame',
        duration: '2h35min',
        rating: '★★★★☆',
        poster: 'https://images.ladepeche.fr/api/v1/images/view/6a607f77ec4760f16b073e20/large/image.jpg?v=3',
        description: "L'épopée légendaire d'Ulysse"
    },
    {
        id: 'oakstreet',
        title: "La Fin d'Oak Street",
        genre: 'Thriller / Drame',
        duration: '1h55min',
        rating: '★★★★☆',
        poster: 'https://all.web.img.acsta.net/img/6b/68/6b680ec933f51bfd826180635552e3c4.jpg',
        description: 'Un quartier qui bascule dans le chaos'
    },
    {
        id: 'harrypotter',
        title: 'Harry Potter : Le Retour',
        genre: 'Fantastique / Aventure',
        duration: '2h40min',
        rating: '★★★★★',
        poster: 'https://tse2.mm.bing.net/th/id/OIP.D2v43T3Girm5A322kg7tKAHaEd?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        description: 'La magie revient à Poudlard'
    },
    {
        id: 'insidious',
        title: "Insidious : L'Invasion du Lointain",
        genre: 'Horreur / Thriller',
        duration: '1h50min',
        rating: '★★★★☆',
        poster: 'https://tse2.mm.bing.net/th/id/OIP.B5g7Z729gJ4RLA30XjwSTwHaJQ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        description: "Une menace venue d'ailleurs"
    }
];

// Les deux cinémas partagent les mêmes films
const moviesDatabase = {
    pathe: allMovies,
    allocine: allMovies
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
                <div class="movie-poster" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                    <img src="${movie.poster}" 
                         alt="${movie.title}"
                         loading="lazy"
                         onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;color:white;padding:20px;><div><div style=font-size:3em;>🎬</div><div style=font-size:1.1em;font-weight:700;>${movie.title}</div></div></div>';">
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
    console.log('🎥 MovieManager initialisé');
});
