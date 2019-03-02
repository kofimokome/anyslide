<?php
include_once("includes/header.php");
include_once("includes/functions.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$username = $request->username;
$password = $request->password;

echo login($username,$password,$con);
