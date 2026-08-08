// ==========================================
// BASE DE DONNÉES DES FILMS AVEC AFFICHES
// Remplace chaque "TON_LIEN_ICI" par le vrai lien de l'affiche
// ==========================================
const moviesDatabase = {
    pathe: [
        {
            id: 'spiderman',
            title: 'Spider-Man : Brand New Day',
            genre: 'Action / Super-héros',
            duration: '2h20min',
            rating: '★★★★★',
            poster: 'https://boutique-spiderman.fr/cdn/shop/articles/Spidermlan_brand_new_day_trailer_2_c80367fd-68ff-44a2-bc67-f33cee516672.jpg?v=1785379747&width=1920', // ← Remplace par le lien de l'affiche Spider-Man
            description: 'Peter Parker face à un nouveau départ après les événements du multivers'
        },
        {
            id: 'odyssee',
            title: "L'Odyssée",
            genre: 'Aventure / Drame',
            duration: '2h35min',
            rating: '★★★★☆',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche L\'Odyssée
            description: "L'épopée légendaire d'Ulysse portée à l'écran par Christopher Nolan"
        },
        {
            id: 'oakstreet',
            title: "La Fin d'Oak Street",
            genre: 'Thriller / Drame',
            duration: '1h55min',
            rating: '★★★★☆',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche La Fin d'Oak Street
            description: 'Un quartier paisible bascule dans le chaos après une disparition mystérieuse'
        },
        {
            id: 'harrypotter',
            title: 'Harry Potter : Le Retour',
            genre: 'Fantastique / Aventure',
            duration: '2h40min',
            rating: '★★★★★',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche Harry Potter
            description: 'La magie revient dans une nouvelle aventure du monde des sorciers'
        },
        {
            id: 'insidious',
            title: "Insidious : L'Invasion du Lointain",
            genre: 'Horreur / Thriller',
            duration: '1h50min',
            rating: '★★★★☆',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche Insidious
            description: "Une nouvelle menace venue d'ailleurs s'attaque à la famille Lambert"
        }
    ],
    allocine: [
        {
            id: 'spiderman',
            title: 'Spider-Man : Brand New Day',
            genre: 'Action / Super-héros',
            duration: '2h20min',
            rating: '★★★★★',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche Spider-Man
            description: 'Peter Parker face à un nouveau départ après les événements du multivers'
        },
        {
            id: 'odyssee',
            title: "L'Odyssée",
            genre: 'Aventure / Drame',
            duration: '2h35min',
            rating: '★★★★☆',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche L\'Odyssée
            description: "L'épopée légendaire d'Ulysse portée à l'écran par Christopher Nolan"
        },
        {
            id: 'oakstreet',
            title: "La Fin d'Oak Street",
            genre: 'Thriller / Drame',
            duration: '1h55min',
            rating: '★★★★☆',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche La Fin d'Oak Street
            description: 'Un quartier paisible bascule dans le chaos après une disparition mystérieuse'
        },
        {
            id: 'harrypotter',
            title: 'Harry Potter : Le Retour',
            genre: 'Fantastique / Aventure',
            duration: '2h40min',
            rating: '★★★★★',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche Harry Potter
            description: 'La magie revient dans une nouvelle aventure du monde des sorciers'
        },
        {
            id: 'insidious',
            title: "Insidious : L'Invasion du Lointain",
            genre: 'Horreur / Thriller',
            duration: '1h50min',
            rating: '★★★★☆',
            poster: 'TON_LIEN_ICI', // ← Remplace par le lien de l'affiche Insidious
            description: "Une nouvelle menace venue d'ailleurs s'attaque à la famille Lambert"
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
                         onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22600%22><rect fill=%22%23667eea%22 width=%22400%22 height=%22600%22/><text x=%22200%22 y=%22260%22 text-anchor=%22middle%22 font-size=%2280%22>🎬</text><text x=%22200%22 y=%22320%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2220%22 font-family=%22Arial%22>${movie.title.replace(/'/g, '&apos;')}</text></svg>';">
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
    console.log('🎥 MovieManager initialisé - En attente des liens d\'images');
});
