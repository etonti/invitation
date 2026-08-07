<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Récupérer les données
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

$config = require 'config.php';

// Préparer l'email
$to = $config['email']['to'];
$subject = "🎬 Nouvelle réponse à l'invitation cinéma !";

// Message HTML
$message = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; color: white; margin-bottom: 30px; }
        .info { padding: 15px; background: #f8f9ff; border-radius: 10px; margin: 10px 0; border-left: 4px solid #667eea; }
        .emoji { font-size: 1.5em; }
        .footer { margin-top: 30px; text-align: center; color: #636e72; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Nouvelle réponse !</h1>
            <p>Quelqu'un a répondu à ton invitation</p>
        </div>
        
        <div class='info'>
            <strong>🎬 Cinéma :</strong> {$data['cinema']}
        </div>
        
        <div class='info'>
            <strong>🍿 Snacks :</strong> {$data['nourriture']}
        </div>
        
        <div class='info'>
            <strong>📍 Après la séance :</strong> {$data['lieu']}
        </div>
        
        <div class='info'>
            <strong>📅 Date :</strong> {$data['date']}
        </div>
        
        <div class='info'>
            <strong>📧 Contact :</strong> {$data['email']}
        </div>
        
        <div class='footer'>
            <p>✨ Soirée Cinéma - Invitation Spéciale</p>
        </div>
    </div>
</body>
</html>
";

// Headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$config['email']['from_name']} <{$config['email']['from']}>\r\n";
$headers .= "Reply-To: {$data['email']}\r\n";

// Envoyer l'email
$success = mail($to, $subject, $message, $headers);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Email envoyé avec succès']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'envoi de l\'email']);
}
?>