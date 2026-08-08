// notifications.js - Version corrigée avec validation internationale

class NotificationManager {
    constructor() {
        // TES IDENTIFIANTS TELEGRAM (pour TOI)
        this.telegramBotToken = '8734148092:AAEGo4_S2H1diW0kHq7fF1_CcBJzDQMbaqc';
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

    // ✅ Version qui accepte TOUS les numéros du monde (Afrique inclus)
    validatePhone(input) {
        const rawValue = input.value.trim();
        
        // Si champ vide
        if (rawValue.length === 0) {
            input.classList.remove('success', 'error');
            this.phone = null;
            console.log('📱 Champ téléphone vide');
            return;
        }
        
        // On nettoie : on garde les chiffres, + et le début
        let cleaned = rawValue.replace(/[\s\-\.\(\)]/g, '');
        
        console.log('📱 Nettoyage:', rawValue, '→', cleaned);
        
        // Vérification : doit commencer par +, 00, ou un chiffre
        // et ne contenir que des chiffres après
        const isValid = /^(?:\+|00)?\d+$/.test(cleaned);
        
        if (isValid) {
            // On compte les chiffres (sans le + ou 00)
            const digitsOnly = cleaned.replace(/^(\+|00)/, '');
            
            // Au moins 4 chiffres pour un numéro valide (standard international)
            if (digitsOnly.length >= 4) {
                input.classList.add('success');
                input.classList.remove('error');
                this.phone = cleaned;
                console.log('✅ Numéro valide:', this.phone, `(${digitsOnly.length} chiffres)`);
                return;
            } else {
                input.classList.add('error');
                input.classList.remove('success');
                this.phone = null;
                console.log('❌ Trop court:', cleaned, `(${digitsOnly.length} chiffres, minimum 4)`);
                return;
            }
        } else {
            input.classList.add('error');
            input.classList.remove('success');
            this.phone = null;
            console.log('❌ Format invalide:', cleaned);
            return;
        }
    }

    async sendNotification() {
        // Vérifier qu'au moins un contact est fourni
        if (!this.email && !this.phone) {
            showToast('Remplis au moins un champ ✍️', 'error');
            return;
        }

        console.log('📤 Envoi de la notification...');
        console.log('📧 Email:', this.email);
        console.log('📱 Téléphone:', this.phone);

        // Afficher loading
        const loadingSpinner = document.getElementById('loadingSpinner');
        const contactForm = document.getElementById('contactForm');
        const btnSend = document.getElementById('btnSendNotification');
        const notificationOptions = document.querySelector('.notification-options');
        
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        if (contactForm) contactForm.style.display = 'none';
        if (btnSend) btnSend.style.display = 'none';
        if (notificationOptions) notificationOptions.style.display = 'none';

        const formData = this.prepareFormData();
        
        try {
            // 1. Envoyer la notification à TOI (organisateur)
            await this.sendToYou(formData);
            
            // 2. Envoyer la confirmation à la personne
            await this.sendToPerson(formData);

            // Succès
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            const successMessage = document.getElementById('successMessage');
            if (successMessage) successMessage.style.display = 'block';
            
            showToast('Réponse envoyée avec succès ! 🎉', 'success');

        } catch (error) {
            console.error('❌ Erreur:', error);
            
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (contactForm) contactForm.style.display = 'block';
            if (btnSend) btnSend.style.display = 'inline-block';
            if (notificationOptions) notificationOptions.style.display = 'grid';
            
            showToast('Erreur: ' + error.message + ' ❌', 'error');
        }
    }

    async sendToYou(formData) {
        const message = `🎬 <b>NOUVELLE INVITATION CINÉMA !</b>

━━━━━━━━━━━━━━━━━━━━
👤 <b>Contact de la personne :</b>
📧 ${formData.email || 'Non fourni'}
📱 ${formData.phone || 'Non fourni'}

━━━━━━━━━━━━━━━━━━━━
📽️ <b>Cinéma choisi :</b> ${formData.cinema}
🍿 <b>Snacks :</b> ${formData.nourriture}
📍 <b>Après la séance :</b> ${formData.lieu}
📅 <b>Date :</b> ${formData.date}

━━━━━━━━━━━━━━━━━━━━
🎉 <b>Soirée confirmée !</b>`;

        try {
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
                console.log('✅ Notification envoyée à l\'organisateur');
            } else {
                console.error('❌ Erreur Telegram:', data);
                throw new Error('Erreur d\'envoi Telegram');
            }
        } catch (error) {
            console.error('❌ Erreur envoi à l\'organisateur:', error);
            throw error;
        }
    }

    async sendToPerson(formData) {
        const messagePourPersonne = `
🎬 <b>TA SOIRÉE CINÉMA EST CONFIRMÉE !</b>

Hello ! ✨

Ta réponse a bien été reçue. Voici le récapitulatif :

━━━━━━━━━━━━━━━━━━━━
📽️ <b>Cinéma :</b> ${formData.cinema}
🍿 <b>Snacks :</b> ${formData.nourriture}
📍 <b>Après la séance :</b> ${formData.lieu}
📅 <b>Date :</b> ${formData.date}

━━━━━━━━━━━━━━━━━━━━

On se retrouve là-bas ! J'ai trop hâte ! 🥳💕

<i>À très bientôt !</i> ✨
        `.trim();

        // Envoyer par email si fourni
        if (formData.email) {
            await this.sendEmailToPerson(formData.email, messagePourPersonne);
        }

        // Envoyer par SMS si fourni
        if (formData.phone) {
            await this.sendSMSToPerson(formData.phone, messagePourPersonne);
        }
    }

    async sendEmailToPerson(email, message) {
        try {
            // Version simplifiée - vous pouvez utiliser un service comme EmailJS ou Web3Forms
            console.log('📧 Envoi d\'email à:', email);
            console.log('📝 Message:', message.replace(/<[^>]*>/g, '').substring(0, 200) + '...');
            
            // Simulation d'envoi d'email
            // Dans la vraie vie, utilisez un service comme EmailJS, SendGrid, etc.
            
            // Exemple avec Web3Forms (gratuit)
            /*
            const form = new FormData();
            form.append('access_key', 'VOTRE_CLE_WEB3FORMS');
            form.append('subject', '🎬 Confirmation de ta soirée cinéma !');
            form.append('from_name', 'Invitation Cinéma');
            form.append('email', email);
            form.append('message', message.replace(/<[^>]*>/g, ''));
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: form
            });
            
            if (response.ok) {
                console.log('✅ Email envoyé avec succès');
            }
            */
            
            console.log('✅ Email confirmé (simulation)');
        } catch (error) {
            console.log('⚠️ Email non envoyé (mode test):', error.message);
        }
    }

    async sendSMSToPerson(phone, message) {
        try {
            const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, '');
            const cleanMessage = message.replace(/<[^>]*>/g, '').substring(0, 160);
            
            console.log('📱 Envoi SMS à:', cleanPhone);
            console.log('📝 Message:', cleanMessage);
            
            // Simulation d'envoi SMS
            // Dans la vraie vie, utilisez un service comme Twilio, Vonage, etc.
            
            // Exemple avec Twilio
            /*
            const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/VOTRE_ACCOUNT_SID/Messages.json', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa('VOTRE_ACCOUNT_SID:VOTRE_AUTH_TOKEN'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    To: cleanPhone,
                    From: 'VOTRE_NUMERO_TWILIO',
                    Body: cleanMessage
                })
            });
            
            if (response.ok) {
                console.log('✅ SMS envoyé avec succès');
            }
            */
            
            // Tentative d'envoi via Telegram
            try {
                const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: cleanPhone,
                        text: cleanMessage
                    })
                });
                const data = await response.json();
                if (data.ok) {
                    console.log('✅ SMS envoyé via Telegram');
                    return;
                }
            } catch (e) {
                // Le numéro n'est pas sur Telegram, c'est normal
            }
            
            console.log('✅ SMS confirmé (simulation)');
        } catch (error) {
            console.log('⚠️ SMS non envoyé (mode test):', error.message);
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

        // Récupérer la date depuis le calendrier
        let dateTime = 'Non définie';
        if (window.calendarManager) {
            dateTime = window.calendarManager.getFormattedDateTime();
        } else if (window.appState && window.appState.invitation && window.appState.invitation.date) {
            dateTime = window.appState.invitation.date;
        }

        return {
            cinema: cinemaNames[window.appState?.invitation?.cinema] || 'Non défini',
            nourriture: window.appState?.invitation?.nourriture?.join(', ') || 'Non défini',
            lieu: lieuNames[window.appState?.invitation?.lieu] || 'Non défini',
            date: dateTime,
            email: this.email,
            phone: this.phone,
            method: this.notificationMethod
        };
    }
}

// Initialisation
let notificationManager;
document.addEventListener('DOMContentLoaded', () => {
    notificationManager = new NotificationManager();
    console.log('📱 NotificationManager initialisé - Accepte tous les numéros du monde 🌍');
});
