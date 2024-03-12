<?php
// Connect to MySQL database
$conn = new mysqli('localhost', 'username', 'password', 'database');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query database
$result = $conn->query('SELECT * FROM your_table');

// Convert result to JSON
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Output JSON
header('Content-Type: application/json');
echo json_encode($data);

// Close connection
$conn->close();
?>
