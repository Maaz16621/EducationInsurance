<?php

include 'conn.php';

// Log the form data
file_put_contents('php://stderr', print_r($_POST, TRUE));

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one you want to allow, and if so:
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}


// Get the data from the request
$userId = $_POST['userId'];
$currentPassword = $_POST['currentPassword'];
$newPassword = $_POST['newPassword'];

// Fetch the existing data from the database
$stmt = $conn->prepare("SELECT * FROM users WHERE id='$userId'");
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

// Check if the current password matches the one in the database
if (md5($currentPassword)== $row['password']) {
    // Hash the new password
    $hashedPassword = md5($newPassword);

    // Update the password in the database
    $stmt = $conn->prepare("UPDATE users SET password='$hashedPassword' WHERE id='$userId'");
    $stmt->execute();

    // Check if the update was successful
    if ($stmt->affected_rows > 0) {
        // Return a success response
        $response = [
            'success' => true,
            'message' => 'Password updated successfully',
        ];
        http_response_code(200);
    } else {
        // Return an error response
        $response = [
            'success' => false,
            'message' => 'Failed to update password',
        ];
        http_response_code(400);
    }
} else {
    // Return an error response if the current password does not match
    $response = [
        'success' => false,
        'message' => 'Current password is incorrect',
    ];
    http_response_code(400);
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Return the response
echo json_encode($response);
?>
