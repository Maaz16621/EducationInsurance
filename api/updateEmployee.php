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

// Extract the data
$id = $data['id'];
$username = $data['username'];
$email = $data['email'];
$role = $data['role'];
$password = md5($data['password']); // Encrypt password (consider using more secure encryption methods)

// Prepare and execute SQL query to update the employee data
$stmt = $conn->prepare("UPDATE employees SET username = ?, email = ?, role = ?, password = ? WHERE id = ?");
$stmt->bind_param("ssssi", $username, $email, $role, $password, $id);
$stmt->execute();

// Check if the update was successful
if ($stmt->affected_rows > 0) {
    // Return JSON response indicating successful update
    echo json_encode(['success' => true]);
} else {
    // Return JSON response indicating failure
    echo json_encode(['success' => false, 'message' => 'Failed to update employee details.']);
}

// Close connections
$stmt->close();
$conn->close();
?>
