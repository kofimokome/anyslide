<?php
/**
 * Created by PhpStorm.
 * User: kofi
 * Date: 7/21/17
 * Time: 2:17 PM
 */
include_once('includes/header.php');
include_once('includes/functions.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$session_name = $request->sessName;
$session_key = $request->sessKey;
if (preg_match_all("/[^A-Za-z0-9]/", $session_name) > 0) {
    $error = array("message" => "SNF", "status" => 500); // SNF = Session Not Found
    echo json_encode($error);
    die();
}

echo join_session($session_name, $session_key, $con);
