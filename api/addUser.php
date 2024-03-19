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

// Retrieve data sent from the client
$data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'];
    $email = $data['email'];
    $role = $data['role'];
    $password = md5($data['password']);

   
    // Prepare and execute SQL query to insert the new user data
    $stmt = $conn->prepare("INSERT INTO employees (username, email, role, password, active) VALUES (?, ?, ?, ?, 1)");
    $stmt->bind_param("ssss", $username, $email, $role, $password);
    $stmt->execute();

    // Return JSON response indicating successful insertion
    echo json_encode(['success' => true]);

    // Close connections
    $stmt->close();
    $conn->close();

?>
