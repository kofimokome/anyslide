<?php
include_once("includes/header.php");
include_once("includes/functions.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user_id = $request->user_id;
$presentation_id = $request->presentation_id;
$collaborator_id = $request->collaborator_id;


$query = "select owner_id from presentations where id = {$presentation_id} and deleted = 0";
if ($result = $con->query($query)) {
    $result = $result->fetch_object();
    if ($result->owner_id != $user_id) {
        echo json_encode(array("message" => "You are not allowed to edit this presentation", "success" => false, "code" => 404));
        die();
    }
} else {
    echo json_encode(array("message" => $con->error, "success" => false, "code" => 0));
    die();
}

$query = "delete from collaborators where presentation_id = {$presentation_id} and user_id = {$collaborator_id}";
if ($result = $con->query($query)) {
    echo json_encode(array(
        "success" => true,
        "message" => "OK"
    ));
} else {
    echo json_encode(array("success" => false, "message" => "an error occurred please try again", "code" => 0));
}
