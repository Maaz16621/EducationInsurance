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


// Check if user ID is provided in the query parameters
if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    // Prepare SQL statement to fetch claims data by user ID
    $sql = "SELECT id, status, payment_status, applied_at, updated_at, JSON_EXTRACT(child_details, '$.name') AS child_name FROM claims WHERE user_id = ?";

    // Prepare and execute SQL statement
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch data from result set and store in array
    $claimsData = [];
    while ($row = $result->fetch_assoc()) {
        $claimsData[] = $row;
    }

    // Close prepared statement and database connection
    $stmt->close();
    $conn->close();

    // Return claims data as JSON response
    http_response_code(200); // OK
    echo json_encode($claimsData);
} else {
    // User ID not provided in query parameters
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'User ID not provided']);
}
?>
