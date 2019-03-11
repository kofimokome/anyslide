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

$slide_id = $request->slide_id;
$presentation_id = $request->presentation_id;
//echo json_encode(array("success"=>true));
$query = "SELECT COUNT(id) FROM slides WHERE presentation_id = {$presentation_id}";
if ($result = $con->query($query)) {
    $result = $result->fetch_assoc();
    $count = $result['COUNT(id)'];
    if ($count <= 1) {
        echo json_encode(array("success" => false, "message" => "You must have atleast one slide"));
    } else {
        $query = "DELETE FROM slides WHERE id = {$slide_id}";
        if ($result = $con->query($query)) {
            echo json_encode(array("message" => "OK", "success" => true));
        } else {
            echo json_encode(array("message" => "An Error Occured. Please Try Again", "success" => false));
        }
    }
} else {
    echo json_encode(array("message" => "An Error Occured. Please Try Again", "success" => false));
}
//SELECT MAX(id) FROM <tablename>
