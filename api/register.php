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

// Get the form data
$username = $_POST['username'];
$email = $_POST['email'];
$cnic = $_POST['cnic'];
$password = md5($_POST['password']);
// Insert the data into the database
$sql = "INSERT INTO users (username, email, cnic, password) VALUES ('$username', '$email', '$cnic', '$password')";

if ($conn->query($sql) === TRUE) {
    $response = array('status' => 'success', 'message' => 'Your account has been created successfully');
    echo json_encode($response);
} else {
    $response = array('status' => 'error', 'message' => 'Error: ' . $sql . '<br>' . $conn->error);
    echo json_encode($response);
}
?>
