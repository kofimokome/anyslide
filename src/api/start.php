<?php
/**
 * Created by PhpStorm.
 * User: kofi
 * Date: 7/21/17
 * Time: 5:14 PM
 */

include_once('includes/header.php');
include_once('includes/functions.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_id = $request->user_id;
$session_id = $request->session_id;
echo start_game($user_id, $session_id, $con);
