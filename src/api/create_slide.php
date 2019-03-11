<?php
/**
 * Created by PhpStorm.
 * User: kofi
 * Date: 7/21/17
 * Time: 2:17 PM
 */
include_once('includes/header.php');
include_once("includes/functions.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_id = $request->user_id;
$presentation_id = $request->presentation_id;

$query = "insert into slides values (null, {$presentation_id},'',{$user_id},0,now(), now())";
if ($result = $con->query($query)) {
    $presentation_id = $con->insert_id;
    echo json_encode(array("message" => "OK", "success" => true,"id"=>$presentation_id));
} else {
    echo json_encode(array("message" => $con->error, "success" => false));
}
//SELECT MAX(id) FROM <tablename>
