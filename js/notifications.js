// notifications.js - Version complète avec EmailJS + Film

class NotificationManager {
    constructor() {
        // ==========================================
        // 🔑 TES IDENTIFIANTS
        // ==========================================
        
        // Telegram (pour TOI)
        this.telegramBotToken = '8734148092:AAEGo4_S2H1diW0kHq7fF1_CcBJzDQMbaqc';
        this.telegramChatId = '7874710782';
        
        // EmailJS (pour la PERSONNE)
        this.emailJSServiceID = 'Invitation_Cinema';
        this.emailJSTemplateID = 'template_xcmlw18';
        this.emailJSPublicKey = 'A45sDo531Ve2lJeZv';
        
        this.notificationMethod = null;
        this.email = null;
        this.phone = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const notificationCards = document.querySelectorAll('.notification-card');
        
        notificationCards.forEach(card => {
            card.addEventListener('click', () => {
                notificationCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.notificationMethod = card.dataset.method;
                this.showContactForm();
            });
        });

        const emailInput = document.getElementById('emailInput');
        const phoneInput = document.getElementById('phoneInput');
        
        if (emailInput) {
            emailInput.addEventListener('input', (e) => this.validateEmail(e.target));
        }
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.validatePhone(e.target));
        }

        const btnSend = document.getElementById('btnSendNotification');
        if (btnSend) {
            btnSend.addEventListener('click', () => this.sendNotification());
        }
    }

    showContactForm() {
        const contactForm = document.getElementById('contactForm');
        const emailGroup = document.getElementById('emailGroup');
        const phoneGroup = document.getElementById('phoneGroup');
        const btnSend = document.getElementById('btnSendNotification');
        
        if (!contactForm) return;
        
        if (emailGroup) emailGroup.style.display = 'none';
        if (phoneGroup) phoneGroup.style.display = 'none';
        if (btnSend) btnSend.style.display = 'none';
        
        switch(this.notificationMethod) {
            case 'email':
                if (emailGroup) emailGroup.style.display = 'block';
                break;
            case 'sms':
                if (phoneGroup) phoneGroup.style.display = 'block';
                break;
            case 'both':
                if (emailGroup) emailGroup.style.display = 'block';
                if (phoneGroup) phoneGroup.style.display = 'block';
                break;
        }
        
        contactForm.style.display = 'block';
        if (btnSend) btnSend.style.display = 'inline-block';
    }

    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value.length > 0 && emailRegex.test(input.value)) {
            input.classList.add('success');
            input.classList.remove('error');
            this.email = input.value;
            console.log('✅ Email valide:', this.email);
        } else if (input.value.length > 0) {
            input.classList.add('error');
            input.classList.remove('success');
            this.email = null;
            console.log('❌ Email invalide');
        } else {
            input.classList.remove('success', 'error');
            this.email = null;
        }
    }

    validatePhone(input) {
        const rawValue = input.value.trim();
        
        if (rawValue.length === 0) {
            input.classList.remove('success', 'error');
            this.phone = null;
            return;
        }
        
        let cleaned = rawValue.replace(/[\s\-\.\(\)]/g, '');
        
        const isValid = /^(?:\+|00)?\d+$/.test(cleaned);
        
        if (isValid) {
            const digitsOnly = cleaned.replace(/^(\+|00)/, '');
            
            if (digitsOnly.length >= 4) {
                input.classList.add('success');
                input.classList.remove('error');
                this.phone = cleaned;
                console.log('✅ Numéro valide:', this.phone);
            } else {
                input.classList.add('error');
                input.classList.remove('success');
                this.phone = null;
            }
        } else {
            input.classList.add('error');
            input.classList.remove('success');
            this.phone = null;
        }
    }

    async sendNotification() {
        if (!this.email && !this.phone) {
            showToast('Remplis au moins un champ ✍️', 'error');
            return;
        }

        console.log('📤 Envoi des notifications...');

        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('btnSendNotification').style.display = 'none';
        document.querySelector('.notification-options').style.display = 'none';

        const formData = this.prepareFormData();
        
        try {
            // 1. Notification pour TOI via Telegram
            await this.sendToYou(formData);
            
            // 2. Confirmation pour la PERSONNE via EmailJS
            if (formData.email) {
                await this.sendEmailConfirmation(formData);
            }

            // 3. SMS si fourni (simulé)
            if (formData.phone) {
                await this.sendSMSConfirmation(formData);
            }

            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            showToast('Réponses envoyées avec succès ! 🎉', 'success');

        } catch (error) {
            console.error('❌ Erreur:', error);
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('contactForm').style.display = 'block';
            document.getElementById('btnSendNotification').style.display = 'inline-block';
            document.querySelector('.notification-options').style.display = 'grid';
            showToast('Erreur. Mais pas de panique ! ❌', 'error');
        }
    }

    // Envoi à TOI via Telegram
    async sendToYou(formData) {
        const message = `🎬 <b>NOUVELLE INVITATION CINÉMA !</b>

━━━━━━━━━━━━━━━━━━━━
👤 <b>Contact :</b>
📧 ${formData.email || 'Non fourni'}
📱 ${formData.phone || 'Non fourni'}

━━━━━━━━━━━━━━━━━━━━
📽️ <b>Cinéma :</b> ${formData.cinema}
🎥 <b>Film :</b> ${formData.movie}
🍿 <b>Snacks :</b> ${formData.nourriture}
📍 <b>Après :</b> ${formData.lieu}
📅 <b>Date :</b> ${formData.date}

━━━━━━━━━━━━━━━━━━━━
🎉 <b>Soirée confirmée !</b>`;

        const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: this.telegramChatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        if (data.ok) {
            console.log('✅ Notification Telegram envoyée');
        } else {
            throw new Error('Erreur Telegram: ' + data.description);
        }
    }

    // Envoi de l'email de confirmation à la PERSONNE via EmailJS
    async sendEmailConfirmation(formData) {
        console.log('📧 Envoi email de confirmation à:', formData.email);
        
        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: this.emailJSServiceID,
                    template_id: this.emailJSTemplateID,
                    user_id: this.emailJSPublicKey,
                    template_params: {
                        to_email: formData.email,
                        cinema: formData.cinema,
                        movie: formData.movie,
                        nourriture: formData.nourriture,
                        lieu: formData.lieu,
                        date: formData.date
                    }
                })
            });

            if (response.ok) {
                console.log('✅ Email de confirmation envoyé !');
            } else {
                const errorData = await response.text();
                console.error('❌ Erreur EmailJS:', errorData);
            }
        } catch (error) {
            console.error('❌ Échec envoi email:', error);
        }
    }

    // SMS de confirmation (simulé)
    async sendSMSConfirmation(formData) {
        console.log('📱 SMS à:', formData.phone);
        
        const message = `🎬 Cinéma: ${formData.cinema} | 🎥 ${formData.movie} | 📅 ${formData.date}. À bientôt ! ✨`;
        
        try {
            const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: formData.phone,
                    text: message
                })
            });
            const data = await response.json();
            if (data.ok) {
                console.log('✅ Message envoyé via Telegram');
            }
        } catch (e) {
            console.log('📱 SMS (à implémenter avec Twilio ou autre service)');
        }
    }

    prepareFormData() {
        const cinemaNames = {
            'pathe': 'Pathé 🎭',
            'allocine': 'Allociné 🍿'
        };
        
        const lieuNames = {
            'chez-moi': 'Chez moi 🏡', 
            'chez-toi': 'Chez toi 🏠', 
            'chacun': 'Chacun chez soi 👋'
        };

        let dateTime = 'Non définie';
        if (window.calendarManager) {
            dateTime = window.calendarManager.getFormattedDateTime();
        }

        const movieTitle = window.appState?.invitation?.movie?.title || 'Non défini';

        return {
            cinema: cinemaNames[window.appState?.invitation?.cinema] || 'Non défini',
            movie: movieTitle,
            nourriture: window.appState?.invitation?.nourriture?.join(', ') || 'Non défini',
            lieu: lieuNames[window.appState?.invitation?.lieu] || 'Non défini',
            date: dateTime,
            email: this.email,
            phone: this.phone,
            method: this.notificationMethod
        };
    }
}

let notificationManager;
document.addEventListener('DOMContentLoaded', () => {
    notificationManager = new NotificationManager();
    console.log('📱 NotificationManager initialisé 🌍');
});
