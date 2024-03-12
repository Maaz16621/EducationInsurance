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

// Get the user ID from the request query parameters
$userId = isset($_GET['userId']) ? $_GET['userId'] : null;

if ($userId) {
// Fetch kin details data from the database
$stmt = $conn->prepare("SELECT * FROM kin_details WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
$kinDetails = [];
while ($row = $result->fetch_assoc()) {
    $kinDetails[] = $row;
}

// Return kin details data as JSON
echo json_encode($kinDetails);

// Close the statement and connection
$stmt->close();
$conn->close();
} else {
    // User ID not provided in the request
    echo json_encode(array('error' => 'User ID not provided'));
}
?>
