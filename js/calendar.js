// ==========================================
// GESTIONNAIRE DE CALENDRIER - AVEC DISPONIBILITÉS
// ==========================================
class CalendarManager {
    constructor() {
        this.selectedDate = null;
        this.selectedTime = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.availableDates = [];
        this.availableTimes = {};
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.renderCalendar();
        console.log('✅ Calendrier initialisé');
    }

    // Mettre à jour les disponibilités selon le film sélectionné
    updateAvailability() {
        const movie = appState.invitation.movie;
        const cinema = appState.invitation.cinema;
        
        if (!movie || !cinema || !movie.schedule || !movie.schedule[cinema]) {
            this.availableDates = [];
            this.availableTimes = {};
        } else {
            this.availableDates = Object.keys(movie.schedule[cinema]);
            this.availableTimes = movie.schedule[cinema];
        }
        
        // Réinitialiser la sélection
        this.selectedDate = null;
        this.selectedTime = null;
        appState.invitation.date = null;
        appState.invitation.time = null;
        
        // Mettre à jour le sélecteur d'heure
        this.updateTimePicker();
        
        // Réafficher le calendrier
        this.renderCalendar();
        
        // Masquer l'affichage de la date
        const displayContainer = document.getElementById('selectedDateDisplay');
        if (displayContainer) displayContainer.style.display = 'none';
        
        this.checkCanProceed();
        
        console.log('📅 Disponibilités mises à jour:', this.availableDates.length, 'dates');
    }

    updateTimePicker() {
        const timePicker = document.getElementById('timePicker');
        if (!timePicker) return;
        
        // Vider
        timePicker.innerHTML = '<option value="">Choisis une heure</option>';
        
        // Si pas de date sélectionnée, pas d'heures
        if (!this.selectedDate) {
            this.checkCanProceed();
            return;
        }
        
        const dateStr = this.formatDateISO(this.selectedDate);
        const times = this.availableTimes[dateStr] || [];
        
        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timePicker.appendChild(option);
        });
        
        this.checkCanProceed();
    }

    renderCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
        let startCol = firstDayOfMonth.getDay() - 1;
        if (startCol < 0) startCol = 6;
        
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Vérifier si un film est sélectionné
        const hasMovie = appState.invitation.movie && appState.invitation.movie.id;
        const noMovieMessage = !hasMovie ? '<p style="text-align:center;color:#e74c3c;margin-bottom:15px;font-weight:600;">⚠️ Sélectionne d\'abord un film pour voir les disponibilités</p>' : '';

        let html = `
            <div class="custom-calendar">
                <div class="calendar-navigation">
                    <button class="nav-btn" id="prevMonth"><i class="fas fa-chevron-left"></i></button>
                    <div class="month-year">
                        <span class="month">${months[this.currentMonth]}</span>
                        <span class="year">${this.currentYear}</span>
                    </div>
                    <button class="nav-btn" id="nextMonth"><i class="fas fa-chevron-right"></i></button>
                </div>
                ${noMovieMessage}
                <div class="calendar-grid">
                    <div class="days-header">
                        ${daysOfWeek.map(d => `<div class="day-name">${d}</div>`).join('')}
                    </div>
                    <div class="days-body">`;

        for (let i = 0; i < startCol; i++) {
            html += '<div class="day empty"></div>';
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(this.currentYear, this.currentMonth, d);
            date.setHours(0, 0, 0, 0);
            
            const dateStr = this.formatDateISO(date);
            const dayOfWeek = date.getDay();
            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;
            const isSelected = this.selectedDate && date.getTime() === this.selectedDate.getTime();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            // Vérifier si le jour est disponible (a des séances)
            const isAvailable = hasMovie && this.availableDates.includes(dateStr);
            const isUnavailable = hasMovie && !isAvailable && !isPast;
            
            let cls = 'day';
            if (isToday) cls += ' today';
            if (isPast) cls += ' past';
            if (isSelected) cls += ' selected';
            if (isWeekend) cls += ' weekend';
            if (isUnavailable) cls += ' unavailable';
            if (isAvailable) cls += ' available';
            
            html += `
                <div class="${cls}" data-date="${date.toISOString()}">
                    <span class="day-number">${d}</span>
                    ${isToday ? '<span class="today-badge">Auj.</span>' : ''}
                    ${isAvailable ? '<span class="available-dot"></span>' : ''}
                </div>`;
        }

        html += `
                    </div>
                </div>
            </div>`;

        calendarEl.innerHTML = html;
        this.addDayListeners();
        this.addNavigationListeners();
    }

    formatDateISO(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    addDayListeners() {
        document.querySelectorAll('.day:not(.empty):not(.past):not(.unavailable)').forEach(day => {
            const handler = (e) => {
                e.preventDefault();
                const date = new Date(day.dataset.date);
                date.setHours(0, 0, 0, 0);
                this.selectDate(date);
            };
            day.addEventListener('click', handler);
            day.addEventListener('touchend', handler);
        });
    }

    addNavigationListeners() {
        document.getElementById('prevMonth')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.currentMonth--;
            if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
            this.renderCalendar();
        });
        document.getElementById('nextMonth')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.currentMonth++;
            if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
            this.renderCalendar();
        });
    }

    selectDate(date) {
        this.selectedDate = date;
        appState.invitation.date = date;
        this.selectedTime = null;
        appState.invitation.time = null;
        
        document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
        const el = document.querySelector(`.day[data-date="${date.toISOString()}"]`);
        if (el) el.classList.add('selected');
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('fr-FR', options);
        
        const dt = document.getElementById('selectedDateText');
        const dc = document.getElementById('selectedDateDisplay');
        if (dt && dc) {
            dt.textContent = `${formattedDate} (choisis l'heure ⏰)`;
            dc.style.display = 'flex';
        }
        
        // Mettre à jour les heures disponibles
        this.updateTimePicker();
        
        if (navigator.vibrate) navigator.vibrate(20);
        showToast('✨ Date sélectionnée ! Choisis l\'heure', 'success');
    }

    setupEventListeners() {
        document.getElementById('timePicker')?.addEventListener('change', (e) => {
            this.selectedTime = e.target.value;
            appState.invitation.time = this.selectedTime;
            
            if (this.selectedDate && this.selectedTime) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = this.selectedDate.toLocaleDateString('fr-FR', options);
                const dt = document.getElementById('selectedDateText');
                if (dt) dt.textContent = `${formattedDate} à ${this.selectedTime}`;
            }
            this.checkCanProceed();
        });
        this.checkCanProceed();
    }

    checkCanProceed() {
        const btn = document.getElementById('btnNextDate');
        if (!btn) return;
        const ok = this.selectedDate && this.selectedTime;
        btn.disabled = !ok;
        btn.style.opacity = ok ? '1' : '0.5';
        btn.style.cursor = ok ? 'pointer' : 'not-allowed';
        btn.style.pointerEvents = ok ? 'auto' : 'none';
    }

    getFormattedDateTime() {
        if (!this.selectedDate || !this.selectedTime) return 'Date non définie';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return `${this.selectedDate.toLocaleDateString('fr-FR', options)} à ${this.selectedTime}`;
    }
}

let calendarManager;
document.addEventListener('DOMContentLoaded', () => {
    calendarManager = new CalendarManager();
    window.calendarManager = calendarManager;
});

function updateFinalMessage() {
    if (!calendarManager) return;
    
    const cinemaNames = { 'pathe-orleans': 'Pathé Orléans 🏛️', 'pathe-saran': 'Pathé Saran 🏢' };
    const lieuNames = { 'chez-moi': 'Chez moi 🏡', 'chez-toi': 'Chez toi 🏠', 'chacun': 'Chacun chez soi 👋' };
    const foodEmojis = { 'popcorn': '🍿 Popcorn', 'nachos': '🧀 Nachos', 'bonbons': '🍬 Bonbons', 'chocolat': '🍫 Chocolat', 'boisson': '🥤 Boisson', 'glace': '🍦 Glace' };
    
    const nourritureListe = (appState.invitation.nourriture || []).map(f => foodEmojis[f] || f).join('<br>');
    const dateTime = calendarManager.getFormattedDateTime();
    const movieTitle = appState.invitation.movie?.title || 'Non défini';
    
    const el = document.getElementById('finalMessage');
    if (el) {
        el.innerHTML = `
            <p><strong>🎬 Cinéma :</strong> ${cinemaNames[appState.invitation.cinema] || 'Non défini'}</p>
            <p><strong>🎥 Film :</strong> ${movieTitle}</p>
            <p><strong>🍿 À grignoter :</strong><br>${nourritureListe || 'Non défini'}</p>
            <p><strong>📍 Après la séance :</strong> ${lieuNames[appState.invitation.lieu] || 'Non défini'}</p>
            <p><strong>📅 Date et heure :</strong> ${dateTime}</p>`;
    }
}