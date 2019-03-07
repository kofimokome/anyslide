<?php
include_once("includes/header.php");
include_once("includes/functions.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user_id = $request->user_id;

$query = "select id,title from presentations where owner_id = {$user_id} and deleted = 0";

if ($result = $con->query($query)) {
    $presentations = [];
    while ($row = $result->fetch_assoc()) {
        array_push($presentations, $row);
    }
    $data = array(
        "presentations" => $presentations,
        "success" => true,
        "message" => "OK"
    );
    echo json_encode($data);
} else {
    json_encode(array("success" => false, "message" => "an error occurred please try again"));
}
