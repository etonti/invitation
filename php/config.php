<?php
// Configuration des notifications
return [
    'email' => [
        'to' => 'ton-email@example.com', // TON adresse email
        'from' => 'invitation@cinema-soiree.fr',
        'from_name' => 'Invitation Cinéma',
        'smtp' => [
            'host' => 'smtp.gmail.com', // ou ton serveur SMTP
            'port' => 587,
            'username' => 'ton-email@gmail.com',
            'password' => 'ton-mot-de-passe-app',
            'encryption' => 'tls'
        ]
    ],
    'sms' => [
        // Utilise Twilio, Vonage, ou autre service SMS
        'provider' => 'twilio', // ou 'vonage', 'ovh', etc.
        'twilio' => [
            'account_sid' => 'ton-account-sid',
            'auth_token' => 'ton-auth-token',
            'from_number' => '+1234567890' // Ton numéro Twilio
        ],
        'to_number' => '+33612345678' // TON numéro pour recevoir les SMS
    ]
];
?>