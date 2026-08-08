// ==========================================
// BASE DE DONNÉES DES FILMS AVEC AFFICHES
// ==========================================
const moviesDatabase = {
    pathe: [
        {
            id: 'avatar3',
            title: 'Avatar 3',
            genre: 'Science-Fiction',
            duration: '3h12min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400',
            description: 'La suite tant attendue de la saga Pandora'
        },
        {
            id: 'avengers',
            title: 'Avengers: Secret Wars',
            genre: 'Action/Super-héros',
            duration: '2h45min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400',
            description: 'Le combat final des plus grands héros'
        },
        {
            id: 'dune3',
            title: 'Dune: Messiah',
            genre: 'Science-Fiction',
            duration: '2h55min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1547700055-b61cacebece9?w=400',
            description: 'Paul Atréides face à son destin'
        },
        {
            id: 'barbie2',
            title: 'Barbie 2',
            genre: 'Comédie',
            duration: '1h50min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400',
            description: 'De nouvelles aventures roses et drôles'
        },
        {
            id: 'johnwick5',
            title: 'John Wick 5',
            genre: 'Action',
            duration: '2h30min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400',
            description: 'Le retour du légendaire tueur à gages'
        },
        {
            id: 'insideout3',
            title: 'Vice-Versa 3',
            genre: 'Animation',
            duration: '1h45min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400',
            description: 'De nouvelles émotions débarquent !'
        }
    ],
    allocine: [
        {
            id: 'asterix',
            title: 'Astérix et Obélix',
            genre: 'Comédie/Aventure',
            duration: '1h55min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400',
            description: 'Les Gaulois reviennent pour une nouvelle aventure'
        },
        {
            id: 'mario2',
            title: 'Super Mario Bros 2',
            genre: 'Animation/Aventure',
            duration: '1h40min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400',
            description: 'Mario et Luigi dans une nouvelle quête'
        },
        {
            id: 'oppenheimer',
            title: 'Oppenheimer',
            genre: 'Drame/Historique',
            duration: '3h00min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
            description: 'L\'histoire du père de la bombe atomique'
        },
        {
            id: 'spiderman',
            title: 'Spider-Man: Beyond',
            genre: 'Action/Super-héros',
            duration: '2h20min',
            rating: '★★★★★',
            poster: 'https://images.unsplash.com/photo-1635363678580-eb2f44c1e208?w=400',
            description: 'Miles Morales dans le Spider-Verse'
        },
        {
            id: 'jurassic',
            title: 'Jurassic World 4',
            genre: 'Aventure/Science-Fiction',
            duration: '2h15min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1569411032431-07598b0012c2?w=400',
            description: 'Les dinosaures sont de retour !'
        },
        {
            id: 'frozen4',
            title: 'La Reine des Neiges 4',
            genre: 'Animation/Musical',
            duration: '1h50min',
            rating: '★★★★☆',
            poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400',
            description: 'Elsa et Anna dans une nouvelle aventure glacée'
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
            moviesGrid.innerHTML = '<p>Aucun film disponible pour ce cinéma.</p>';
            return;
        }

        // Générer les cartes de films
        moviesGrid.innerHTML = movies.map(movie => `
            <div class="movie-card" data-movie-id="${movie.id}">
                <div class="movie-poster">
                    <img src="${movie.poster}" alt="${movie.title}" 
                         onerror="this.src='https://via.placeholder.com/400x600/667eea/ffffff?text=${encodeURIComponent(movie.title)}'">
                    <div class="movie-rating-badge">${movie.rating}</div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-genre">${movie.genre}</p>
                    <p class="movie-duration"><i class="fas fa-clock"></i> ${movie.duration}</p>
                </div>
            </div>
        `).join('');

        // Ajouter les écouteurs d'événements
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.addEventListener('click', () => {
                movieCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedMovie = card.dataset.movieId;
                
                // Trouver les infos du film
                const movie = movies.find(m => m.id === this.selectedMovie);
                
                // Sauvegarder dans l'état global
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

        // Réinitialiser le bouton
        btnNext.disabled = true;
    }
}

// Initialisation
let movieManager;
document.addEventListener('DOMContentLoaded', () => {
    movieManager = new MovieManager();
});
