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

// Get the data from the request
$userId = $_POST['userId'];
$username = $_POST['username'];
$email = $_POST['email'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$cnic = $_POST['cnic'];
$dob = $_POST['dob'];
$age = $_POST['age'];
$profession = $_POST['profession'];
$cellPhone = $_POST['cellPhone'];
$residencePhone = $_POST['residencePhone'];
$residenceAddress = $_POST['residenceAddress'];
$bankAccountNumber = $_POST['bankAccountNumber'];
$bankName = $_POST['bankName'];
$titleOfAccount = $_POST['titleOfAccount'];
$employerName = $_POST['employerName'];
$employedSince = $_POST['employedSince'];
$officePhone = $_POST['officePhone'];
$officeAddress = $_POST['officeAddress'];

// Check if a logo file was uploaded
if (isset($_FILES['profilePic']) && $_FILES['profilePic']['error'] === UPLOAD_ERR_OK) {
    $logo_tmp_name = $_FILES['profilePic']['tmp_name'];
    $logo_name = basename($_FILES['profilePic']['name']);
    $logo_path = 'http://localhost/Insurance/public/images/' . $logo_name; // Change this to your desired upload directory

    move_uploaded_file($logo_tmp_name, $_SERVER['DOCUMENT_ROOT'] . '/Insurance/public/images/' . $logo_name);

    // Update profilePicUrl with the new image path
    $stmt = $conn->prepare("UPDATE users SET profilePicUrl=? WHERE id=?");
    $stmt->bind_param("si", $logo_path, $userId);
    $stmt->execute();
    $stmt->close();
}

// Fetch the existing data from the database
$stmt = $conn->prepare("SELECT * FROM users WHERE id='$userId'");
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

// Check if the form data is different from the existing data
if (
    $row['username'] !== $username ||
    $row['email'] !== $email ||
    $row['firstName'] !== $firstName ||
    $row['lastName'] !== $lastName ||
    $row['cnic'] !== $cnic ||
    $row['dob'] !== $dob ||
    $row['age'] !== $age ||
    $row['profession'] !== $profession ||
    $row['cellPhone'] !== $cellPhone ||
    $row['residencePhone'] !== $residencePhone ||
    $row['residenceAddress'] !== $residenceAddress ||
    $row['bankAccountNumber'] !== $bankAccountNumber ||
    $row['bankName'] !== $bankName ||
    $row['titleOfAccount'] !== $titleOfAccount ||
    $row['employerName'] !== $employerName ||
    $row['employedSince'] !== $employedSince ||
    $row['officePhone'] !== $officePhone ||
    $row['officeAddress'] !== $officeAddress
) {
    // If there are differences, update the data
    $stmt = $conn->prepare("UPDATE users SET username=?, email=?, firstName=?, lastName=?, cnic=?, dob=?, age=?, profession=?, cellPhone=?, residencePhone=?, residenceAddress=?, bankAccountNumber=?, bankName=?, titleOfAccount=?, employerName=?, employedSince=?, officePhone=?, officeAddress=? WHERE id=?");
    $stmt->bind_param("sssssssssssssssssss", $username, $email, $firstName, $lastName, $cnic, $dob, $age, $profession, $cellPhone, $residencePhone, $residenceAddress, $bankAccountNumber, $bankName, $titleOfAccount, $employerName, $employedSince, $officePhone, $officeAddress, $userId);
    $stmt->execute();

    // Check if the update was successful
    if ($stmt->errno === 0 || $stmt->affected_rows > 0) {
        // Return a success response
        $response = [
            'success' => true,
            'message' => 'Data updated successfully',
        ];
        http_response_code(200);
    } else {
        // Return an error response
        $response = [
            'success' => false,
            'message' => 'Failed to update data',
        ];
        http_response_code(400);
    }
} else {
    // If there are no differences, return a success response
    $response = [
        'success' => true,
        'message' => 'Data is already up to date',
    ];
    http_response_code(200);
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Return the response
echo json_encode($response);
?>
