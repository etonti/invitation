// ==========================================
// ÉTAT DE L'APPLICATION
// ==========================================
const appState = {
    currentStep: 1,
    invitation: {
        cinema: null,
        nourriture: [],
        lieu: null,
        date: null,
        time: null
    },
    noButtonAttempts: 0,
    noButtonPosition: { x: 0, y: 0 }
};

window.appState = appState;

// ==========================================
// ÉLÉMENTS DOM
// ==========================================
const DOM = {
    steps: document.querySelectorAll('.step'),
    progressSteps: document.querySelectorAll('.progress-step'),
    progressLines: document.querySelectorAll('.progress-line'),
    btnNo: document.getElementById('btnNo'),
    btnYes: document.getElementById('btnYes'),
    btnNextCinema: document.getElementById('btnNextCinema'),
    btnNextFood: document.getElementById('btnNextFood'),
    btnNextLieu: document.getElementById('btnNextLieu'),
    buttonsContainer: document.getElementById('buttonsContainer'),
    messageRefus: document.getElementById('messageRefus'),
    compteurTentatives: document.getElementById('compteurTentatives'),
    nbTentatives: document.getElementById('nbTentatives'),
    foodCount: document.getElementById('foodCount'),
    finalMessage: document.getElementById('finalMessage'),
    toast: document.getElementById('toast')
};

// ==========================================
// GESTION DU BOUTON "NON" QUI FUIT
// ==========================================
class NoButtonManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        DOM.btnNo.addEventListener('mouseover', (e) => this.handleInteraction(e));
        DOM.btnNo.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInteraction(e);
        });
        DOM.btnNo.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleClickAttempt();
        });
    }

    handleInteraction(e) {
        this.moveButton();
        this.showRefusalMessage();
        this.incrementAttempts();
        if (navigator.vibrate) navigator.vibrate(50);
    }

    handleClickAttempt() {
        this.showRefusalMessage();
        this.incrementAttempts();
        showToast('Tu ne peux pas refuser ! 😏', 'error');
        DOM.btnNo.classList.add('shake');
        setTimeout(() => DOM.btnNo.classList.remove('shake'), 500);
    }

    moveButton() {
        const container = DOM.buttonsContainer;
        const button = DOM.btnNo;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const maxX = containerRect.width - buttonRect.width;
        const maxY = containerRect.height - buttonRect.height;
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        button.style.position = 'relative';
        button.style.left = `${randomX}px`;
        button.style.top = `${randomY}px`;
        button.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        appState.noButtonPosition = { x: randomX, y: randomY };
    }

    showRefusalMessage() {
        DOM.messageRefus.classList.add('show');
        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            DOM.messageRefus.classList.remove('show');
        }, 3000);
    }

    incrementAttempts() {
        appState.noButtonAttempts++;
        if (appState.noButtonAttempts >= 3) {
            DOM.compteurTentatives.style.display = 'block';
            DOM.nbTentatives.textContent = appState.noButtonAttempts;
        }
    }
}

// ==========================================
// GESTION DES ÉTAPES
// ==========================================
class StepManager {
    static showStep(stepNumber) {
        DOM.steps.forEach(step => step.classList.remove('active'));
        const stepElement = document.getElementById(`step${stepNumber}`);
        if (stepElement) {
            stepElement.classList.add('active');
            appState.currentStep = stepNumber;
            this.updateProgressBar(stepNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    static updateProgressBar(currentStep) {
        DOM.progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            if (stepNum < currentStep) step.classList.add('completed');
            else if (stepNum === currentStep) step.classList.add('active');
        });

        DOM.progressLines.forEach((line, index) => {
            const lineNum = index + 1;
            line.classList.remove('active', 'completed');
            if (lineNum < currentStep) line.classList.add('completed');
            else if (lineNum === currentStep) line.classList.add('active');
        });
    }

    static nextStep() {
        const nextStep = appState.currentStep + 1;
        if (nextStep <= 6) {
            this.showStep(nextStep);
        }
    }
}

// ==========================================
// GESTION DES SÉLECTIONS
// ==========================================
class SelectionManager {
    constructor() {
        this.selectedCinema = null;
        this.selectedFoods = new Set();
        this.selectedLieu = null;
        this.setupCinemaSelection();
        this.setupFoodSelection();
        this.setupLieuSelection();
    }

    setupCinemaSelection() {
        const cinemaCards = document.querySelectorAll('.cinema-card');
        cinemaCards.forEach(card => {
            card.addEventListener('click', () => {
                cinemaCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedCinema = card.dataset.cinema;
                DOM.btnNextCinema.disabled = false;
                if (navigator.vibrate) navigator.vibrate(20);
                showToast(`${this.getCinemaName(this.selectedCinema)} sélectionné ! 🎬`, 'success');
            });
        });

        DOM.btnNextCinema.addEventListener('click', () => {
            if (this.selectedCinema) {
                appState.invitation.cinema = this.selectedCinema;
                StepManager.nextStep();
            }
        });
    }

    setupFoodSelection() {
        const foodItems = document.querySelectorAll('.food-item');
        foodItems.forEach(item => {
            item.addEventListener('click', () => {
                const food = item.dataset.food;
                if (item.classList.contains('selected')) {
                    item.classList.remove('selected');
                    this.selectedFoods.delete(food);
                } else {
                    item.classList.add('selected');
                    this.selectedFoods.add(food);
                }
                DOM.foodCount.textContent = this.selectedFoods.size;
                DOM.btnNextFood.disabled = this.selectedFoods.size === 0;
                if (navigator.vibrate) navigator.vibrate(20);
            });
        });

        DOM.btnNextFood.addEventListener('click', () => {
            if (this.selectedFoods.size > 0) {
                appState.invitation.nourriture = Array.from(this.selectedFoods);
                StepManager.nextStep();
            }
        });
    }

    setupLieuSelection() {
        const lieuCards = document.querySelectorAll('.lieu-card');
        lieuCards.forEach(card => {
            card.addEventListener('click', () => {
                lieuCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedLieu = card.dataset.lieu;
                DOM.btnNextLieu.disabled = false;
                if (navigator.vibrate) navigator.vibrate(20);
                showToast(`${this.getLieuName(this.selectedLieu)} choisi ! 🏠`, 'success');
            });
        });

        DOM.btnNextLieu.addEventListener('click', () => {
            if (this.selectedLieu) {
                appState.invitation.lieu = this.selectedLieu;
                StepManager.nextStep();
            }
        });
    }

getCinemaName(cinema) {
    const names = { 'pathe': 'Pathé', 'allocine': 'Allociné' };
    return names[cinema] || cinema;
}

    getLieuName(lieu) {
        const names = { 'chez-moi': 'Chez moi', 'chez-toi': 'Chez toi', 'chacun': 'Chacun chez soi' };
        return names[lieu] || lieu;
    }
}

// ==========================================
// SYSTÈME DE TOAST
// ==========================================
function showToast(message, type = 'info') {
    const toast = DOM.toast;
    const toastMessage = toast.querySelector('.toast-message');
    toast.className = 'toast ' + type;
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// ÉVÉNEMENT BOUTON OUI
// ==========================================
DOM.btnYes.addEventListener('click', () => {
    DOM.btnYes.style.transform = 'scale(1.2)';
    setTimeout(() => { DOM.btnYes.style.transform = 'scale(1)'; }, 300);
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    showToast('Excellente décision ! 😍💕', 'success');
    setTimeout(() => { StepManager.showStep(2); }, 500);
});

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const noButton = new NoButtonManager();
    const selections = new SelectionManager();
    setTimeout(() => {
        showToast('Bienvenue ! Prêt pour une soirée inoubliable ? 🎬✨', 'info');
    }, 1000);
    console.log('🚀 Application d\'invitation cinéma initialisée !');
});
