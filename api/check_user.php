<?php

include 'conn.php';
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


// Check if the request method is GET and the email parameter is provided
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['email'])) {
    // Extract the email from the GET request
    $email = $_GET['email'];

  

    // Prepare and execute SQL query to check if the user exists
    $stmt = $conn->prepare("SELECT * FROM employees WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Return JSON response indicating whether the user exists or not
    echo json_encode(['exists' => $result->num_rows > 0]);

    // Close connections
    $stmt->close();
    $conn->close();
} else {
    // Return JSON response indicating invalid request
    echo json_encode(['error' => 'Invalid request']);
}
?>
