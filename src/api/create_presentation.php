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

$name = $request->name;
$user = $request->user_id;

if (strlen($name) <= 0) {
    echo json_encode(array('message' => 'Enter a presentation title', 'success' => false)); //Session Enter Key
} else {
    echo create_presentation($name, $user, $con);
}
//SELECT MAX(id) FROM <tablename>
