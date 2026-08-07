<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

$config = require 'config.php';

// Message SMS (limité à 160 caractères)
$message = "🎬 Soirée cinéma !\n";
$message .= "📍 {$data['cinema']}\n";
$message .= "📅 {$data['date']}\n";
$message .= "🍿 {$data['nourriture']}\n";
$message .= "🏠 {$data['lieu']}\n";
$message .= "Contact: {$data['email']}";

// Envoyer via Twilio
if ($config['sms']['provider'] === 'twilio') {
    $sid = $config['sms']['twilio']['account_sid'];
    $token = $config['sms']['twilio']['auth_token'];
    $from = $config['sms']['twilio']['from_number'];
    $to = $config['sms']['to_number'];
    
    $url = "https://api.twilio.com/2010-04-01/Accounts/$sid/Messages.json";
    
    $postData = http_build_query([
        'From' => $from,
        'To' => $to,
        'Body' => $message
    ]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_USERPWD, "$sid:$token");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 201) {
        echo json_encode(['success' => true, 'message' => 'SMS envoyé avec succès']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de l\'envoi du SMS', 'details' => $response]);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Fournisseur SMS non configuré']);
}
?>