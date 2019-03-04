<?php
include_once("includes/header.php");
include_once("includes/functions.php");

// some server side validation here
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$firstname = $request->firstname;
$lastname = $request->lastname;
$username = $request->username;
$password = $request->password;
$confirm_password = $request->cpassword;

if (preg_match_all("/[^A-Za-z]/", $firstname) > 0 || strlen($firstname) < 3) {
    $error = array("message" => "Enter a valid first name", "success" => false); // FNIC = First Name Incorrect
    // $error = array("message" => "FNICv"); // FNIC = First Name Incorrect
    echo json_encode($error);
    die();
} elseif (preg_match_all("/[^A-Za-z]/", $lastname) > 0 || strlen($lastname) < 3) {
    $error = array("message" => "Enter a valid last name", "success" => false); // LNIC = Last Name Incorrect
    echo json_encode($error);
    die();
} elseif (preg_match_all("/[^a-z]/", $username) > 0 || strlen($username) < 3) {
    $error = array("message" => "Enter a valid user name", "success" => false); // UNIC = User Name Incorrect
    echo json_encode($error);
    die();
} elseif ($password == '' || strlen($password) < 8) {
    $error = array("message" => "Enter a valid password", "success" => false); // PWIN = Password Incorrect
    echo json_encode($error);
    die();
} elseif ($password != $confirm_password) {
    $error = array("message" => "Passwords do not match", "success" => false); // PWNM = Password Not Match
    echo json_encode($error);
    die();
} else {
    //echo json_encode(array("message"=>"OK","status"=>200));
    echo register($firstname, $lastname, $username, $password, $con);
}

/**
 * ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version1X;
*/