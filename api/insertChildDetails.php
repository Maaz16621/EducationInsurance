<?php
include 'conn.php';

// Allow from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Retrieve data sent from the client
$data = json_decode(file_get_contents("php://input"), true);

// Prepare and bind SQL statement
$stmt = $conn->prepare("INSERT INTO children (user_id, name, form_b_cnic, institution_name, course, class, semester, year, roll_number, fee_frequency, fees_per_mqy, remaining_time_to_completion, total_outstanding_fees_prs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issssssssssss", $userId, $name, $cnic, $institutionName, $course, $class, $semester, $year, $rollNumber, $feeFrequency, $feesPerMQY, $remainingTime, $totalOutstandingFees);

// Set parameters and execute
$userId = $data['userId'];
$name = $data['name'];
$cnic = $data['cnic'];
$institutionName = $data['institutionName'];
$course = $data['course'];
$class = $data['class'];
$semester = $data['semester'];
$year = $data['year'];
$rollNumber = $data['rollNumber'];
$feeFrequency = $data['feeFrequency'];
$feesPerMQY = $data['feesPerMQY'];
$remainingTime = $data['remainingTime'];
$totalOutstandingFees = $data['totalOutstandingFees'];

if ($stmt->execute()) {
    echo json_encode(array("message" => "Child details inserted successfully"));
} else {
    echo json_encode(array("message" => "Failed to insert child details"));
}

// Close connections
$stmt->close();
$conn->close();
?>
