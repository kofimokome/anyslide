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

$presentation_id = $request->presentation_id;
$user = $request->user_id;
//echo json_encode(array("success"=>true));
$query = "SELECT * FROM presentations WHERE id = {$presentation_id}";
if ($result = $con->query($query)) {
    $result = $result->fetch_object();
    $owner = $result->owner_id;
    if ($owner == $user) {
        //todo: set the delete flag to one
        $query = "DELETE FROM slides WHERE presentation_id = {$presentation_id}";
        if ($result = $con->query($query)) {
            $query = "DELETE FROM presentations WHERE id = {$presentation_id}";
            if ($result = $con->query($query)) {
                echo json_encode(array("message" => "OK", "success" => true));
            } else {
                echo json_encode(array("message" => "An Error Occured. Please Try Again", "success" => false));
            }
        } else {
            echo json_encode(array("message" => "An Error Occured. Please Try Again", "success" => false));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "You can not delete this slide"));
    }
} else {
    echo json_encode(array("message" => "An Error Occured. Please Try Again", "success" => false));
}
//SELECT MAX(id) FROM <tablename>
