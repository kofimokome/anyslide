<?php
$server = 'localhost';//Set your server name here
$user = 'root';//Set your server user name here
$password = 'root';//Set your server password here
$dbname = 'anyslide'; // Set your database name here
$con = mysqli_connect($server, $user, $password);

if ($con->connect_errno) {
    $error = array("message" => "could not connect to server", "success" => false);
    //$con->connect_error;
    echo json_encode($error);
    die();
}
$query = "create database if not exists " . $dbname;
if (!$con->query($query)) {
    $error = array("message" => "could not create database", "success" => false);
    echo json_encode($error);
    //$con->error;
    die();
}


if (!$con->select_db($dbname)) {
    $error = array("message" => "could not connect to database", "success" => false);
    //$con->connect_error;
    echo json_encode($error);
    die();
}
$query = "
create table if not exists users
(
	id int auto_increment primary key,
	f_name varchar(45) null,
	l_name varchar(45) null,
	username varchar(45) not null,
	email varchar(45) not null,
	phone varchar(45) null,
	password varchar(255) not null,
	deleted int default '0' not null,
	created timestamp null,
	updated timestamp null,
	constraint id_UNIQUE
		unique (id),
	constraint username_UNIQUE
		unique (username),
	constraint email_UNIQUE
		unique (email),
	constraint phone_UNIQUE
		unique (phone)
)";
if (!$con->query($query)) {
    $error = array("message" => "an error occurred when creating tables", "success" => false);
    echo json_encode($error);
    //echo $con->error;
    die();
}

$query = "
create table if not exists presentations
(
	id int auto_increment primary key,
	title varchar(45) not null,
	owner_id int not null,
	deleted varchar(45) default '0' not null,
	created timestamp null,
	updated timestamp null,
	constraint id_UNIQUE
		unique (id)
)";
if (!$con->query($query)) {
    $error = array("message" => "an error occurred when creating tables", "success" => false);
    echo json_encode($error);
    //echo $con->error;
    die();
}

$query = "
create table if not exists slides
(
	id int auto_increment
		primary key,
	presentation_id int not null,
	content longtext null,
	creator_id int not null,
	deleted int default '0' not null,
	created timestamp null,
	updated timestamp null,
	constraint id_UNIQUE
		unique (id)
)";
if (!$con->query($query)) {
    $error = array("message" => "an error occurred when creating tables", "success" => false);
    echo json_encode($error);
    //echo $con->error;
    die();
}

$query = "
create table if not exists collaborations
(
	id int auto_increment primary key,
	presentation_id int not null,
	deleted int default '0' not null,
	constraint id_UNIQUE
		unique (id)
)";
if (!$con->query($query)) {
    $error = array("message" => "an error occurred when creating tables", "success" => false);
    echo json_encode($error);
    //echo $con->error;
    die();
}

$query = "
create table if not exists collaborators
(
	id int auto_increment primary key,
	collaboration_id int not null,
	user_id int not null,
	constraint id_UNIQUE
		unique (id)
)";
if (!$con->query($query)) {
    $error = array("message" => "an error occurred when creating tables", "success" => false);
    echo json_encode($error);
    //echo $con->error;
    die();
}