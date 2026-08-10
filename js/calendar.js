// ==========================================
// GESTIONNAIRE DE CALENDRIER - CORRIGÉ
// ==========================================
class CalendarManager {
    constructor() {
        this.selectedDate = null;
        this.selectedTime = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.renderCalendar();
        console.log('✅ Calendrier initialisé - Mois:', this.currentMonth + 1, 'Année:', this.currentYear);
    }

    renderCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        
        // CORRECTION : Calcul correct du premier jour
        // getDay() : 0=Dimanche, 1=Lundi, 2=Mardi, 3=Mercredi, 4=Jeudi, 5=Vendredi, 6=Samedi
        // On veut : 0=Lundi, 1=Mardi, 2=Mercredi, 3=Jeudi, 4=Vendredi, 5=Samedi, 6=Dimanche
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
        let startDay = firstDayOfMonth.getDay() - 1;
        if (startDay === -1) startDay = 6; // Dimanche devient la dernière colonne
        
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log('📅 Premier jour:', firstDayOfMonth.toLocaleDateString('fr-FR'), 
                    '| getDay():', firstDayOfMonth.getDay(), 
                    '| Colonne:', startDay, 
                    '| Jours:', daysInMonth);

        let html = `
            <div class="custom-calendar">
                <div class="calendar-navigation">
                    <button class="nav-btn" id="prevMonth">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="month-year">
                        <span class="month">${months[this.currentMonth]}</span>
                        <span class="year">${this.currentYear}</span>
                    </div>
                    <button class="nav-btn" id="nextMonth">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="calendar-grid">
                    <div class="days-header">
                        ${daysOfWeek.map(day => `<div class="day-name">${day}</div>`).join('')}
                    </div>
                    <div class="days-body">
        `;

        // Cases vides avant le premier jour
        for (let i = 0; i < startDay; i++) {
            html += '<div class="day empty"></div>';
        }

        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            date.setHours(0, 0, 0, 0);
            
            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;
            const isSelected = this.selectedDate && 
                date.getTime() === this.selectedDate.getTime();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            let dayClass = 'day';
            if (isToday) dayClass += ' today';
            if (isPast) dayClass += ' past';
            if (isSelected) dayClass += ' selected';
            if (isWeekend) dayClass += ' weekend';
            
            html += `
                <div class="${dayClass}" data-day="${day}" data-date="${date.toISOString()}">
                    <span class="day-number">${day}</span>
                    ${isToday ? '<span class="today-badge">Auj.</span>' : ''}
                    ${isSelected ? '<span class="selected-badge"><i class="fas fa-check"></i></span>' : ''}
                </div>
            `;
        }

        html += `
                    </div>
                </div>
            </div>
        `;

        calendarEl.innerHTML = html;

        this.addDayListeners();
        this.addNavigationListeners();
    }

    addDayListeners() {
        const days = document.querySelectorAll('.day:not(.empty):not(.past)');
        days.forEach(day => {
            // Click pour desktop
            day.addEventListener('click', (e) => {
                e.preventDefault();
                const dateStr = day.dataset.date;
                const date = new Date(dateStr);
                date.setHours(0, 0, 0, 0);
                this.selectDate(date);
            });
            
            // Touch pour mobile
            day.addEventListener('touchend', (e) => {
                e.preventDefault();
                const dateStr = day.dataset.date;
                const date = new Date(dateStr);
                date.setHours(0, 0, 0, 0);
                this.selectDate(date);
            });
        });
    }

    addNavigationListeners() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentMonth--;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                }
                this.renderCalendar();
                console.log('📅 Navigation:', months[this.currentMonth], this.currentYear);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentMonth++;
                if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.renderCalendar();
                console.log('📅 Navigation:', months[this.currentMonth], this.currentYear);
            });
        }
    }

    selectDate(date) {
        this.selectedDate = date;
        
        // Sauvegarder dans l'état global
        appState.invitation.date = date;
        
        // Mettre à jour l'affichage visuel
        document.querySelectorAll('.day.selected').forEach(el => {
            el.classList.remove('selected');
            const badge = el.querySelector('.selected-badge');
            if (badge) badge.remove();
        });
        
        const dateISO = date.toISOString();
        const selectedDay = document.querySelector(`.day[data-date="${dateISO}"]`);
        if (selectedDay) {
            selectedDay.classList.add('selected');
            // Créer le badge proprement
            const badge = document.createElement('span');
            badge.className = 'selected-badge';
            badge.innerHTML = '<i class="fas fa-check"></i>';
            selectedDay.appendChild(badge);
        }
        
        // Formater et afficher la date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('fr-FR', options);
        
        const displayText = document.getElementById('selectedDateText');
        const displayContainer = document.getElementById('selectedDateDisplay');
        
        if (displayText && displayContainer) {
            displayText.textContent = this.selectedTime 
                ? `${formattedDate} à ${this.selectedTime}`
                : `${formattedDate} (choisis l'heure ⏰)`;
            displayContainer.style.display = 'flex';
            displayContainer.style.animation = 'none';
            displayContainer.offsetHeight;
            displayContainer.style.animation = 'slideDown 0.5s ease-out';
        }
        
        this.checkCanProceed();
        
        if (navigator.vibrate) navigator.vibrate(20);
        showToast('✨ Date sélectionnée !', 'success');
        
        console.log('📅 Date choisie:', formattedDate);
    }

    setupEventListeners() {
        const timePicker = document.getElementById('timePicker');
        if (timePicker) {
            timePicker.addEventListener('change', (e) => {
                this.selectedTime = e.target.value;
                
                // Sauvegarder dans l'état global
                appState.invitation.time = this.selectedTime;
                
                if (this.selectedDate && this.selectedTime) {
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = this.selectedDate.toLocaleDateString('fr-FR', options);
                    const displayText = document.getElementById('selectedDateText');
                    if (displayText) {
                        displayText.textContent = `${formattedDate} à ${this.selectedTime}`;
                    }
                }
                
                this.checkCanProceed();
            });
        }

        this.checkCanProceed();
    }

    checkCanProceed() {
        const btnNext = document.getElementById('btnNextDate');
        if (!btnNext) return;
        
        if (this.selectedDate && this.selectedTime) {
            btnNext.disabled = false;
            btnNext.style.opacity = '1';
            btnNext.style.cursor = 'pointer';
            btnNext.style.pointerEvents = 'auto';
        } else {
            btnNext.disabled = true;
            btnNext.style.opacity = '0.5';
            btnNext.style.cursor = 'not-allowed';
            btnNext.style.pointerEvents = 'none';
        }
    }

    getFormattedDateTime() {
        if (!this.selectedDate || !this.selectedTime) return 'Date non définie';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = this.selectedDate.toLocaleDateString('fr-FR', options);
        return `${formattedDate} à ${this.selectedTime}`;
    }
}

// Variables pour la navigation
const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Initialisation
let calendarManager;
document.addEventListener('DOMContentLoaded', () => {
    calendarManager = new CalendarManager();
    window.calendarManager = calendarManager;
});

// Fonction globale pour mettre à jour le récapitulatif final
function updateFinalMessage() {
    if (!calendarManager) {
        console.error('❌ CalendarManager non initialisé');
        return;
    }
    
    const cinemaNames = {
        'pathe': 'Pathé 🎭',
        'allocine': 'Allociné 🍿'
    };
    
    const lieuNames = {
        'chez-moi': 'Chez moi 🏡', 
        'chez-toi': 'Chez toi 🏠', 
        'chacun': 'Chacun chez soi 👋'
    };
    
    const foodEmojis = {
        'popcorn': '🍿 Popcorn', 
        'nachos': '🧀 Nachos', 
        'bonbons': '🍬 Bonbons',
        'chocolat': '🍫 Chocolat', 
        'boisson': '🥤 Boisson', 
        'glace': '🍦 Glace'
    };
    
    const nourritureListe = (appState.invitation.nourriture || [])
        .map(f => foodEmojis[f] || f)
        .join('<br>');
    
    const dateTime = calendarManager.getFormattedDateTime();
    const movieTitle = appState.invitation.movie?.title || 'Non défini';
    
    const finalMessageElement = document.getElementById('finalMessage');
    if (finalMessageElement) {
        finalMessageElement.innerHTML = `
            <p><strong>🎬 Cinéma :</strong> ${cinemaNames[appState.invitation.cinema] || 'Non défini'}</p>
            <p><strong>🎥 Film :</strong> ${movieTitle}</p>
            <p><strong>🍿 À grignoter :</strong><br>${nourritureListe || 'Non défini'}</p>
            <p><strong>📍 Après la séance :</strong> ${lieuNames[appState.invitation.lieu] || 'Non défini'}</p>
            <p><strong>📅 Date et heure :</strong> ${dateTime}</p>
        `;
        console.log('✅ Message final mis à jour');
    }
}
