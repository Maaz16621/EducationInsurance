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

// Get the claim ID from the request parameters
$claimId = $_GET['id'];
// Get the reason for decline from the request parameters

// Update the status and reason for the claim in the database
$sql = "UPDATE claims SET status = 'Approved' WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i",  $claimId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        // If the claim was successfully declined, return a success message
        echo json_encode(array("message" => "Approved"));
    } else {
        // If no rows were affected, it means the claim ID was not found
        echo json_encode(array("message" => "Claim not found."));
    }
} else {
    // If execution of the SQL query fails, provide an error message
    echo json_encode(array("message" => "Failed to approve claim."));
}

// Close statements and connection
$stmt->close();
$conn->close();
?>
