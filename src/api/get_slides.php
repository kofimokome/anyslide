<?php
include_once("includes/header.php");
include_once("includes/functions.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user_id = $request->user_id;
$presentation_id = $request->presentation_id;
$type = $request->type;

if ($type == "edit") {
    $query = "select owner_id from presentations where id = {$presentation_id} and deleted = 0";
    if ($result = $con->query($query)) {
        $result = $result->fetch_object();
        if ($result->owner_id != $user_id) {
            echo json_encode(array("message" => "You are not allowed to edit this slide", "success" => false, "code" => 404));
            die();
        }
    } else {
        echo json_encode(array("message" => $con->error, "success" => false, "code" => 0));
        die();
    }
}

if ($type == "colab") {
    $query = "select user_id from collaborators where presentation_id = {$presentation_id} and user_id = {$user_id}";
    if ($result = $con->query($query)) {
        $result = $result->fetch_assoc();
        if (!isset($result['user_id'])) {
            echo json_encode(array("message" => "You are not allowed to edit this slide", "success" => false, "code" => 404));
            die();
        }
    } else {
        echo json_encode(array("message" => $con->error, "success" => false, "code" => 0));
        die();
    }
}


$query = "select id,content from slides where presentation_id = {$presentation_id} and deleted = 0";
if ($result = $con->query($query)) {
    $slides = [];
    while ($row = $result->fetch_object()) {
        //$row->content = json_encode($row->content);
        array_push($slides, $row);
    }
    $data = array(
        "slides" => $slides,
        "success" => true,
        "message" => "OK"
    );
    echo json_encode($data);
} else {
    echo json_encode(array("success" => false, "message" => "an error occurred please try again", "code" => 0));
}

