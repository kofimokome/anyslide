<?php
include_once("includes/header.php");
include_once("includes/functions.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user_id = $request->user_id;


$query = "select presentation_id  from collaborators where user_id = {$user_id}";

if ($result = $con->query($query)) {

    $presentations = [];
    while ($row = $result->fetch_object()) {
        //$row->content = json_encode($row->content);
        array_push($presentations, get_presentation($row->presentation_id, $con));
    }
    $data = array(
        "presentations" => $presentations,
        "success" => true,
        "message" => "OK"
    );
    echo json_encode($data);
} else {
    echo json_encode(array("success" => false, "message" => "an error occurred please try again", "code" => 0));
}

