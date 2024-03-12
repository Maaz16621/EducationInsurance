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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the raw POST data
    $postData = file_get_contents("php://input");

    // Decode the JSON data into an associative array
    $claimData = json_decode($postData, true);

    // Check if the claim data is valid
    if ($claimData) {
        // Convert arrays to JSON strings
        $userDetails = json_encode($claimData['user_details']);
        $kinDetails = json_encode($claimData['kin_details']);
        $childDetails = json_encode($claimData['children_details']);
        $receipt = json_encode($claimData['receipt']);
        $claimForm = json_encode($claimData['claim_form']);

        // Prepare and execute the SQL statement
        $stmt = $conn->prepare("INSERT INTO claims (user_id, claim_number, user_details, kin_details, child_details, status, payment_status, receipt, cover_note_sent, claim_form, applied_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        if ($stmt) {
            // Bind parameters
            $stmt->bind_param("ssssssssssss", $claimData['user_id'], $claimData['claim_number'], $userDetails, $kinDetails, $childDetails, $claimData['status'], $claimData['payment_status'], $receipt, $claimData['cover_note_sent'], $claimForm, $claimData['applied_at'], $claimData['updated_at']);
            
            // Execute the prepared statement
            if ($stmt->execute()) {
                // Return a success message
                echo json_encode(array("success" => true, "message" => "Claim added successfully"));
            } else {
                // Return an error message if execution fails
                echo json_encode(array("success" => false, "message" => "Error executing SQL statement: " . $stmt->error));
            }
        } else {
            // Return an error message if preparation fails
            echo json_encode(array("success" => false, "message" => "Error preparing SQL statement: " . $conn->error));
        }

        // Close the statement
        $stmt->close();
    } else {
        // Return an error message if the claim data is invalid
        echo json_encode(array("success" => false, "message" => "Invalid claim data"));
    }
} else {
    // Return an error message if the request method is not POST
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
?>
