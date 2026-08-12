🎬 Invitation Cinéma Interactive
Une application web interactive et amusante pour inviter quelqu'un au cinéma !

✨ Fonctionnalités
🏃 Bouton "Non" qui fuit
Le bouton "Non" se déplace aléatoirement quand on essaie de cliquer dessus

Message dissuasif : "Ça sert à rien de refuser..."

Compteur de tentatives de refus après 3 essais

Support tactile sur mobile avec vibration

🎬 Choix du cinéma
Pathé Orléans (Centre-ville) ★★★★★

Pathé Saran (Zone commerciale) ★★★★☆

Cartes interactives avec animations

🎥 Choix du film avec affiches
Spider-Man : Brand New Day (2h20)

L'Odyssée (2h35)

L'Obsession (2h00)

Affiches réelles des films

Fallback avec emoji 🎬 si l'image ne charge pas

Programmes spécifiques par cinéma

📅 Calendrier intelligent
Les jours disponibles apparaissent avec une bordure verte et un point vert

Les jours sans séance sont grisés, barrés et non cliquables

Les jours passés sont automatiquement désactivés

Légende explicative sous le calendrier

Navigation entre les mois

Message d'info avec le nombre de jours disponibles

⏰ Sélecteur d'heure
Affiche uniquement les heures disponibles pour le film sélectionné

Style personnalisé avec flèche déroulante

Validation automatique

🍿 Snacks
Popcorn, Nachos, Bonbons, Chocolat, Boisson, Glace

Sélection multiple

Compteur de snacks sélectionnés

🏠 Après le cinéma
Chez moi 🏡

Chez toi 🏠

Chacun chez soi 👋

Descriptions détaillées pour chaque option

📧 Notifications
Email : Confirmation envoyée avec l'affiche du film

SMS : Résumé envoyé (via Telegram en attendant un service SMS réel)

Telegram : Notification instantanée à l'organisateur

🌙 Mode sombre
S'adapte automatiquement aux préférences système

Couleurs optimisées pour le confort visuel

📱 Responsive Design
Fonctionne sur mobile, tablette et desktop

Breakpoints : 768px, 480px, 360px

Boutons adaptés au tactile

⬅️ Boutons retour
Possibilité de revenir en arrière à chaque étape

Modifier les choix précédents

♿ Accessibilité
Respecte prefers-reduced-motion

Tap highlight transparent

User select désactivé sur les éléments interactifs

📁 Structure du projet
text
invitation-cinema/
├── index.html          # Page principale avec les 7 étapes
├── css/
│   └── style.css       # Styles, animations, responsive, mode sombre
├── js/
│   ├── movies.js       # Base de données des films et programmes
│   ├── calendar.js     # Calendrier avec disponibilités
│   ├── notifications.js # Envoi email/Telegram/SMS
│   └── script.js       # Logique principale et navigation
├── php/
│   ├── send-email.php  # Envoi email (optionnel)
│   ├── send-sms.php    # Envoi SMS (optionnel)
│   └── config.php      # Configuration (optionnel)
└── README.md           # Documentation
🚀 Installation
En local (sans serveur)
Télécharge ou clone le projet

Ouvre index.html dans ton navigateur

Tout fonctionne sauf l'envoi d'emails (nécessite un serveur)

Avec serveur local
bash
# Avec Node.js
npx http-server -p 8000

# Avec Python
python -m http.server 8000

# Avec PHP (pour les notifications)
php -S localhost:8000
Puis ouvre http://localhost:8000

Déploiement sur Render
Crée un compte sur https://render.com

Clique sur "New" → "Static Site"

Connecte ton repository ou upload le dossier

Le site est en ligne !

🔑 Configuration des notifications
Telegram (obligatoire)
Crée un bot avec @BotFather sur Telegram

Récupère le token

Envoie un message à ton bot

Récupère ton Chat ID via https://api.telegram.org/botTON_TOKEN/getUpdates

Modifie dans js/notifications.js :

javascript
this.telegramBotToken = 'TON_TOKEN';
this.telegramChatId = 'TON_CHAT_ID';
EmailJS (pour l'email de confirmation)
Crée un compte sur https://www.emailjs.com

Ajoute un service email (Gmail, Outlook...)

Crée un template avec ces variables :

{{to_email}} - Email du destinataire

{{movie_poster}} - URL de l'affiche du film

{{movie}} - Titre du film

{{cinema}} - Cinéma choisi

{{nourriture}} - Snacks sélectionnés

{{lieu}} - Après la séance

{{date}} - Date et heure

Récupère tes identifiants et modifie :

javascript
this.emailJSServiceID = 'service_xxx';
this.emailJSTemplateID = 'template_xxx';
this.emailJSPublicKey = 'xxx';
🎯 Parcours utilisateur
text
Étape 1 : Question Oui/Non
    ↓
Étape 2 : Choix du cinéma (Pathé Orléans / Pathé Saran)
    ↓
Étape 3 : Choix du film (avec affiches)
    ↓
Étape 4 : Sélection des snacks
    ↓
Étape 5 : Choix du lieu après la séance
    ↓
Étape 6 : Calendrier + heure (selon les disponibilités du film)
    ↓
Étape 7 : Récapitulatif + Notifications
🎬 Programmes des films
Spider-Man : Brand New Day
Pathé Orléans : 11-15/08 à 16h45, 18h, 18h30, 20h, 21h30 | 16/08 à 16h, 19h

Pathé Saran : 11-15/08 à 19h, 20h30, 22h

L'Odyssée
Pathé Orléans : 11-15/08 à 17h20, 19h30, 20h, 21h

Pathé Saran : 11-15/08 à 17h45, 20h, 21h

L'Obsession
Pathé Orléans : 11-15/08 à 22h

Pathé Saran : 11/08 à 22h | 12/08 à 22h | 13/08 à 22h15 | 14/08 à 22h30 | 15/08 à 22h

🛠️ Technologies utilisées
HTML5 : Structure sémantique

CSS3 : Grid, Flexbox, Animations, Variables, Media Queries

JavaScript ES6+ : Classes, Promises, Async/Await, Fetch API

Font Awesome : Icônes

EmailJS : Service d'envoi d'emails

Telegram Bot API : Notifications instantanées

📱 Compatibilité
Navigateur	Version minimum
Chrome	90+
Firefox	88+
Safari	14+
Edge	90+
iOS Safari	14+
Android Chrome	90+
🎨 Personnalisation
Changer les couleurs
Modifie les variables CSS dans :root :

css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #48bb78;
    --danger-color: #fc5c65;
    --warning-color: #f7b731;
}
Changer les cinémas
Dans index.html, modifie les data-cinema :

html
<div class="cinema-card" data-cinema="ton-cinema">
Puis mets à jour les noms dans js/script.js, js/calendar.js et js/notifications.js.

Ajouter un film
Dans js/movies.js, ajoute :

javascript
{
    id: 'nouveau-film',
    title: 'Nouveau Film',
    genre: 'Genre',
    duration: '2h00',
    rating: '★★★★★',
    poster: 'URL_IMAGE',
    schedule: {
        'pathe-orleans': {
            '2026-08-11': ['14:00', '17:00', '20:00']
        },
        'pathe-saran': {
            '2026-08-11': ['15:00', '18:00', '21:00']
        }
    }
}
📝 TODO / Améliorations possibles
□ Intégration réelle SMS (Twilio, Vonage)
□ Paiement en ligne des places
□ Sélection des sièges
□ Partager l'invitation par lien
□ Page de confirmation pour l'organisateur
□ Statistiques des réponses
□ Support multi-langues (FR/EN)
□ Application PWA (mode hors ligne)
□ QR code de confirmation
📄 Licence
Projet libre d'utilisation pour usage personnel.


