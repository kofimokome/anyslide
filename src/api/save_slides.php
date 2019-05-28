<?php
include_once("includes/header.php");
include_once("includes/functions.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user_id = $request->user_id;
$presentation_id = $request->presentation_id;

foreach ($request->slides as $slide) {
    $content = mysqli_real_escape_string($con, $slide->content);
    $query = "update slides set content = \"{$content}\" where id={$slide->id}";
    if (!$result = $con->query($query)) {
        echo json_encode(array("message" => $con->error, "success" => false));
        die();
    }
    //echo $slide->id." : ".$slide->content." \n";
}

echo json_encode(array("message" => "OK", "success" => true));
