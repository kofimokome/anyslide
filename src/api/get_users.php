<?php
include_once("includes/header.php");
include_once("includes/functions.php");


$username = $_GET['username'];


$query = "select id, username from users where username like '{$username}%'";
if ($result = $con->query($query)) {
    $users = [];
    while ($row = $result->fetch_object()) {
        //$row->content = json_encode($row->content);
        $row->text = $row->username;
        unset($row->username);
        array_push($users, $row);
    }
    $data = array(
        "users" => $users,
        "success" => true,
        "message" => "OK"
    );
    echo json_encode($data);
} else {
    echo json_encode(array("message" => $con->error, "success" => false, "code" => 0));
}
