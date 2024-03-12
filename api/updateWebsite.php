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
$title = $_POST['title'];
$description = $_POST['description'];

// Check if a logo file was uploaded
if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
    $logo_tmp_name = $_FILES['logo']['tmp_name'];
    $logo_name = basename($_FILES['logo']['name']);
    $logo_path = 'http://localhost/Insurance/public/images/' . $logo_name; // Change this to your desired upload directory


     move_uploaded_file($logo_tmp_name, $_SERVER['DOCUMENT_ROOT'] . '/Insurance/public/images/' . $logo_name);

    // Check if the website data already exists
    $query = "SELECT * FROM website WHERE id = 1";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        // Update existing record
        $update_query = "UPDATE website SET title = '$title', description = '$description'";
        if (!empty($logo_path)) {
            $update_query .= ", logo_url = '$logo_path'";
        }
        $update_query .= " WHERE id = 1";

        if (mysqli_query($conn, $update_query)) {
            echo json_encode(array("message" => "Website data updated successfully"));
        } else {
            echo json_encode(array("error" => "Error updating website data: " . mysqli_error($conn)));
        }
    } else {
        // Insert new record
        $insert_query = "INSERT INTO website (id, title, description, logo_url) VALUES (1, '$title', '$description', '$logo_path')";

        if (mysqli_query($conn, $insert_query)) {
            echo json_encode(array("message" => "New website data inserted successfully"));
        } else {
            echo json_encode(array("error" => "Error inserting new website data: " . mysqli_error($conn)));
        }
    }
} else {
    // Logo file was not uploaded, update only title and description
    $update_query = "UPDATE website SET title = '$title', description = '$description' WHERE id = 1";

    if (mysqli_query($conn, $update_query)) {
        echo json_encode(array("message" => "Website data updated successfully"));
    } else {
        echo json_encode(array("error" => "Error updating website data: " . mysqli_error($conn)));
    }
}

mysqli_close($conn);
?>
