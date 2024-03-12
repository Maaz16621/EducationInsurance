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
$email = $_POST['email'];
$password = $_POST['password'];

// Check if the user's email exists in the database
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // User's email exists, check if the password is correct
    $row = $result->fetch_assoc();
   if (md5($password) === $row['password']) {
  // Password is correct, return a JSON object with success status and user data
  echo json_encode(array('status' => 'success', 'message' => 'Login successful', 'user' => $row));
} else {
  // Password is incorrect, return a JSON object with error status
  echo json_encode(array('status' => 'error', 'message' => 'Incorrect password'));
}
} else {
    // User's email does not exist, return a JSON object with error status
    echo json_encode(array('status' => 'error', 'message' => 'Email not found'));
}

?>
