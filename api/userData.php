<?php
include 'conn.php';

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
// Get the request body
$requestBody = file_get_contents('php://input');

// Parse the request body as JSON
$requestData = json_decode($requestBody, true);

// Get the userId from the requestData array
$userId = $requestData['userId'];

if ($userId) {
    // Prepare and execute the SQL query to retrieve user data
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the user exists
    if ($result->num_rows > 0) {
        // Fetch the user data
        $user = $result->fetch_assoc();

        // Return the user data as JSON
        echo json_encode($user);
    } else {
        // User not found
        echo json_encode(array('error' => 'User not found'));
    }

    // Close the database connection
    $stmt->close();
    $conn->close();
} else {
    // User ID not set in the request
    echo json_encode(array('error' => 'User ID not set in the request'));
}
?>
