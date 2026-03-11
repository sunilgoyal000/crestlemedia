<?php
/**
 * Crestle Media - Contact Form Handler
 * Secure form processing with validation and email sending
 */

// Configuration
$config = [
    'recipient_email' => 'hello@crestlemedia.com',
    'subject' => 'New Contact Form Submission - Crestle Media',
    'success_message' => 'Thank you! Your message has been sent successfully.',
    'error_message' => 'Sorry, there was an error sending your message. Please try again.'
];

// Security: Set headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Sanitize and validate input
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get form data
$name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$service = isset($_POST['service']) ? sanitize($_POST['service']) : '';
$message = isset($_POST['message']) ? sanitize($_POST['message']) : '';
$newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters';
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Please enter a valid email address';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters';
}

// If validation fails
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode('. ', $errors)]);
    exit;
}

// Prepare email content
$email_content = "
<html>
<head>
    <title>New Contact Form Submission</title>
</head>
<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">
    <div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\">
        <h2 style=\"color: #ff6b6b;\">New Contact Form Submission</h2>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> " . (!empty($phone) ? $phone : 'Not provided') . "</p>
        <p><strong>Service Interested In:</strong> " . (!empty($service) ? ucwords(str_replace('-', ' ', $service)) : 'Not specified') . "</p>
        <p><strong>Message:</strong></p>
        <div style=\"background: #f9f9f9; padding: 15px; border-left: 4px solid #ff6b6b;\">
            " . nl2br($message) . "
        </div>
        <p><strong>Newsletter:</strong> {$newsletter}</p>
        <hr>
        <p style=\"color: #666; font-size: 12px;\">
            This email was sent from the Crestle Media contact form.<br>
            IP Address: " . $_SERVER['REMOTE_ADDR'] . "
        </p>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-Type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: noreply@crestlemedia.com" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

// Send email
$mailSent = @mail($config['recipient_email'], $config['subject'], $email_content, $headers);

if ($mailSent) {
    // Optional: Send auto-reply to customer
    $auto_reply_subject = "Thank you for contacting Crestle Media";
    $auto_reply_content = "
    <html>
    <body>
        <h2>Thank You!</h2>
        <p>Dear {$name},</p>
        <p>We have received your message and will get back to you within 24-48 hours.</p>
        <p>Best regards,<br>The Crestle Media Team</p>
    </body>
    </html>
    ";
    @mail($email, $auto_reply_subject, $auto_reply_content, $headers);
    
    echo json_encode(['success' => true, 'message' => $config['success_message']]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $config['error_message']]);
}
?>

