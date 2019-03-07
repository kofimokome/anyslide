<?php
/**
 * Created by PhpStorm.
 * User: kofi
 * Date: 7/21/17
 * Time: 12:40 PM
 */
include_once('includes/header.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$message=$request->message;
$user=$request->user_id;
$session=$request->game_id;

if($result = $con->query("insert into chats values(null,{$session},{$user},\"{$message}\"")){
    // publish the message
}


$redis = new Redis();
$redis->connect('localhost',8890);
$redis->publish('test_present',"how");
