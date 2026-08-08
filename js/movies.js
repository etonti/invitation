// ==========================================
// BASE DE DONNÉES DES FILMS AVEC AFFICHES
// ==========================================
const moviesDatabase = {
    pathe: [
        {
            id: 'spiderman',
            title: 'Spider-Man : Brand New Day',
            genre: 'Action / Super-héros',
            duration: '2h20min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=400&h=600&fit=crop',
            fallbackColor: '#e74c3c',
            description: 'Peter Parker face à un nouveau départ'
        },
        {
            id: 'odyssee',
            title: 'L\'Odyssée',
            genre: 'Aventure / Drame',
            duration: '2h35min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
            fallbackColor: '#3498db',
            description: 'L\'épopée légendaire d\'Ulysse'
        },
        {
            id: 'oakstreet',
            title: 'La Fin d\'Oak Street',
            genre: 'Thriller / Drame',
            duration: '1h55min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
            fallbackColor: '#2c3e50',
            description: 'Un quartier qui bascule dans le chaos'
        },
        {
            id: 'harrypotter',
            title: 'Harry Potter : Le Retour',
            genre: 'Fantastique / Aventure',
            duration: '2h40min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1610465299993-e0a0d1e5b62d?w=400&h=600&fit=crop',
            fallbackColor: '#8e44ad',
            description: 'La magie revient à Poudlard'
        },
        {
            id: 'insidious',
            title: 'Insidious : L\'Invasion',
            genre: 'Horreur / Thriller',
            duration: '1h50min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&h=600&fit=crop',
            fallbackColor: '#1a1a1a',
            description: 'Une menace venue d\'ailleurs'
        }
    ],
    allocine: [
        {
            id: 'spiderman',
            title: 'Spider-Man : Brand New Day',
            genre: 'Action / Super-héros',
            duration: '2h20min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=400&h=600&fit=crop',
            fallbackColor: '#e74c3c',
            description: 'Peter Parker face à un nouveau départ'
        },
        {
            id: 'odyssee',
            title: 'L\'Odyssée',
            genre: 'Aventure / Drame',
            duration: '2h35min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
            fallbackColor: '#3498db',
            description: 'L\'épopée légendaire d\'Ulysse'
        },
        {
            id: 'oakstreet',
            title: 'La Fin d\'Oak Street',
            genre: 'Thriller / Drame',
            duration: '1h55min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
            fallbackColor: '#2c3e50',
            description: 'Un quartier qui bascule dans le chaos'
        },
        {
            id: 'harrypotter',
            title: 'Harry Potter : Le Retour',
            genre: 'Fantastique / Aventure',
            duration: '2h40min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1610465299993-e0a0d1e5b62d?w=400&h=600&fit=crop',
            fallbackColor: '#8e44ad',
            description: 'La magie revient à Poudlard'
        },
        {
            id: 'insidious',
            title: 'Insidious : L\'Invasion',
            genre: 'Horreur / Thriller',
            duration: '1h50min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&h=600&fit=crop',
            fallbackColor: '#1a1a1a',
            description: 'Une menace venue d\'ailleurs'
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
                <div class="movie-poster" style="background: linear-gradient(135deg, ${movie.fallbackColor}, ${movie.fallbackColor}dd);">
                    <img src="${movie.poster}" 
                         alt="${movie.title}"
                         loading="lazy"
                         onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:white;width:100%;padding:20px;><div style=font-size:4em;margin-bottom:10px;>🎬</div><div style=font-size:1.3em;font-weight:700;text-shadow:2px 2px 4px rgba(0,0,0,0.5);>${movie.title}</div></div>';">
                    <div class="movie-rating-badge">${movie.rating}</div>
                    <div class="movie-overlay">
                        <span class="movie-play-icon">▶</span>
                    </div>
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
    console.log('🎥 MovieManager initialisé avec 5 films');
});
