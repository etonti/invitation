class NotificationManager {
    constructor() {
        // TES IDENTIFIANTS TELEGRAM
        this.telegramBotToken = '8734148092:AAEGo4_S2H1diW0kHq7fF1_CcBJzDQMbaqc';';
        this.telegramChatId = '7874710782';
        
        // TES IDENTIFIANTS EMAILJS (nouveau !)
        this.emailJSServiceID = 'Invitation_Cinema';     // Service ID
        this.emailJSTemplateID = 'template_xcmlw18';    // Template ID
        this.emailJSPublicKey = 'A45sDo531Ve2lJeZv';   // Public Key
        
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
        } else if (input.value.length > 0) {
            input.classList.add('error');
            input.classList.remove('success');
            this.email = null;
        }
    }

    validatePhone(input) {
        const cleaned = input.value.replace(/[\s.\-\(\)]/g, '');
        const isValid = cleaned.length >= 7;
        if (input.value.length > 0 && isValid) {
            input.classList.add('success');
            input.classList.remove('error');
            this.phone = cleaned;
        } else if (input.value.length > 0) {
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

        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('btnSendNotification').style.display = 'none';
        document.querySelector('.notification-options').style.display = 'none';

        const formData = this.prepareFormData();

        try {
            // 1. Notification pour TOI (Telegram)
            await this.sendToYou(formData);
            
            // 2. Confirmation pour la PERSONNE (Email)
            if (formData.email) {
                await this.sendConfirmationToPerson(formData);
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
            showToast('Erreur. Mais pas de panique, réessaie ! ❌', 'error');
        }
    }

    async sendToYou(formData) {
        const message = `🎬 <b>NOUVELLE INVITATION !</b>

👤 <b>Contact :</b>
📧 ${formData.email || 'Non fourni'}
📱 ${formData.phone || 'Non fourni'}

📽️ <b>Cinéma :</b> ${formData.cinema}
🍿 <b>Snacks :</b> ${formData.nourriture}
📍 <b>Après :</b> ${formData.lieu}
📅 <b>Date :</b> ${formData.date}

🎉 <b>Soirée confirmée !</b>`;

        await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: this.telegramChatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    }

    async sendConfirmationToPerson(formData) {
        console.log('📧 Envoi confirmation à:', formData.email);
        
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
                        nourriture: formData.nourriture,
                        lieu: formData.lieu,
                        date: formData.date
                    }
                })
            });

            if (response.ok) {
                console.log('✅ Email de confirmation envoyé !');
            } else {
                console.log('⚠️ Email non envoyé');
            }
        } catch (error) {
            console.log('⚠️ Erreur email (mode test):', error.message);
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

        const dateTime = calendarManager ? calendarManager.getFormattedDateTime() : 'Non définie';

        return {
            cinema: cinemaNames[appState.invitation.cinema] || 'Non défini',
            nourriture: appState.invitation.nourriture.join(', ') || 'Non défini',
            lieu: lieuNames[appState.invitation.lieu] || 'Non défini',
            date: dateTime,
            email: this.email,
            phone: this.phone
        };
    }
}

let notificationManager;
document.addEventListener('DOMContentLoaded', () => {
    notificationManager = new NotificationManager();
});
