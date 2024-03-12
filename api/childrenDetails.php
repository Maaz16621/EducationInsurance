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
    // Prepare and execute the SQL query to retrieve children data for the given user ID
    $stmt = $conn->prepare("SELECT * FROM children WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if children data exists for the user
    if ($result->num_rows > 0) {
        // Fetch the children data
        $childrenData = [];
        while ($row = $result->fetch_assoc()) {
            $childrenData[] = $row;
        }

        // Return the children data as JSON
        echo json_encode($childrenData);
    } else {
        // No children data found for the user
        echo json_encode(array('message' => 'No children data found for the user'));
    }

    // Close the database connection
    $stmt->close();
    $conn->close();
} else {
    // User ID not provided in the request
    echo json_encode(array('error' => 'User ID not provided'));
}
?>
