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

// Get the child ID from the request parameters
$child_id = $_GET['id'];

// Check if there are any associated claims for the child
$sql = "SELECT * FROM claims WHERE child_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $child_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // If there are associated claims, return a message indicating that the child cannot be deleted
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(array("message" => "A claim has been submitted for this child. Cannot delete."));
} else {
    // If there are no associated claims, proceed with deleting the child record
    $sql_delete = "DELETE FROM children WHERE id = ?";
    $stmt_delete = $conn->prepare($sql_delete);
    $stmt_delete->bind_param("i", $child_id);

    if ($stmt_delete->execute()) {
        // If deletion is successful, send a success response
        header("HTTP/1.1 200 OK");
        echo json_encode(array("message" => "Child record deleted successfully."));
    } else {
        // If deletion fails, send an error response
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(array("message" => "Failed to delete child record."));
    }
}

// Close statements and connection
$stmt->close();
$stmt_delete->close();
$conn->close();
?>
