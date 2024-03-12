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

// Retrieve form data
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$protocol = $data['protocol'] ?? '';
$port = $data['port'] ?? 0; // Assuming port is an integer
$password = $data['password'] ?? '';

// Sanitize input (prevent SQL injection)
$email = mysqli_real_escape_string($conn, $email);
$protocol = mysqli_real_escape_string($conn, $protocol);
$password = mysqli_real_escape_string($conn, $password);

// SQL query to update the record with ID 1
$sql = "UPDATE website 
        SET email = '$email', protocol = '$protocol', port = $port, password = '$password' 
        WHERE id = 1";

// Execute the query
if (mysqli_query($conn, $sql)) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . mysqli_error($conn);
}

// Close the database connection
mysqli_close($conn);
?>
