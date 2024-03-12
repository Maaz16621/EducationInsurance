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

// Check if the request method is PUT
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data from the request body
    $requestData = json_decode(file_get_contents('php://input'), true);
    

    // Prepare SQL statement to update child details
    $sql = "UPDATE children SET 
            name = '" . $requestData['name'] . "', 
            form_b_cnic = '" . $requestData['cnic'] . "', 
            institution_name = '" . $requestData['institutionName'] . "', 
            course = '" . $requestData['course'] . "', 
            class = '" . $requestData['class'] . "', 
            semester = '" . $requestData['semester'] . "', 
            year = '" . $requestData['year'] . "', 
            roll_number = '" . $requestData['rollNumber'] . "', 
            fee_frequency = '" . $requestData['feeFrequency'] . "', 
            fees_per_mqy = '" . $requestData['feesPerMQY'] . "', 
            remaining_time_to_completion = '" . $requestData['remainingTime'] . "', 
            total_outstanding_fees_prs = '" . $requestData['totalOutstandingFees'] . "' 
            WHERE id = " . $requestData['id'];

    // Execute SQL statement
    if ($conn->query($sql) === TRUE) {
        $response = [
            'status' => 'success',
            'message' => 'Child details updated successfully'
        ];
        echo json_encode($response);
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Failed to update child details: ' . $conn->error
        ];
        http_response_code(500); // Internal Server Error
        echo json_encode($response);
    }

    // Close database connection
    $conn->close();
} else {
    // Respond with error message for invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method']);
}
?>
