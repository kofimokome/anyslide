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

$password = $request->sessKey;
$user = $request->user;
if ($password == '' || is_nan($user)) {
echo json_encode(array('message'=>'SEK')); //Session Enter Key
} else {
    echo create_session($user, $password, $con);
}
//SELECT MAX(id) FROM <tablename>
