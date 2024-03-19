<?php
include 'conn.php'; // Assuming this file contains your database connection

// Allow CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
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

// Read JSON input from request body
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Check if the required parameters are set
if (isset($input['id']) && isset($input['status'])) {
    // Sanitize and validate input
    $employeeId = $input['id'];
    $status = $input['status'];

    // Update employee status in the database
    $stmt = $conn->prepare("UPDATE employees SET active = ? WHERE id = ?");
    $stmt->bind_param("ii", $status, $employeeId);
    $stmt->execute();

    // Send JSON response indicating success
    echo json_encode(['success' => true]);
} else {
    // Send JSON response indicating failure
    echo json_encode(['success' => false]);
}
?>
