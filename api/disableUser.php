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

// Get data from the request
$data = json_decode(file_get_contents("php://input"), true);

// Check if the required fields are present in the request data
if (isset($data['user_id']) && isset($data['action'])) {
    $user_id = $data['user_id'];
    $action = $data['action'];

    // Update the user's active status based on the action
    $query = "UPDATE users SET active = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $action, $user_id);
    $stmt->execute();

    // Check if the update was successful
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(array("message" => "User " . ($action == 0 ? "disabled" : "activated") . " successfully."));
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Failed to " . ($action == 0 ? "disable" : "activate") . " user."));
    }
} else {
    // Missing required fields
    http_response_code(400);
    echo json_encode(array("message" => "Missing user_id or action field."));
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
