<?php
/**
 * Created by PhpStorm.
 * User: kofi
 * Date: 7/15/17
 * Time: 5:06 PM
 */
function login($username, $password, $connection)
{
    $query = "select * from users where username='{$username}'";
    if ($result = $connection->query($query)) {
        $row = $result->fetch_object();
        if (is_null($row)) {
            $error = array("message" => "User name not found", "success" => false, "code" => 201); // LIUNF = Log In User Not Found
            return json_encode($error);
        } else {
            if (password_verify($password, $row->password)) {
                unset($row->password);
                $row->message = "OK";
                $row->success = true;
                $row->code = 200;

                // todo: add stuffs to the node server, list of collaborations etc.
                /*$redis = new Redis();
                $redis->connect('localhost',8890);
                $redis->publish('testing',"hi there");*/

                return json_encode($row);
            } else {
                return json_encode(array("message" => "Incorrect password", "success" => false, "code" => 202)); // LIIP = Log In Incorrect Password
            }
        }
    } else {
        $error = array("message" => "error", "success" => false, "code" => 203);
        return json_encode($error);
    }
}

function register($firstname, $lastname, $username, $password, $email, $connection)
{
    $userExist = json_decode(login($username, " ", $connection));
    if ($userExist->code == 201) {
        if ($connection->query("insert into users values(null,'{$firstname}','{$lastname}','{$username}','{$email}',null,'{$password}',0,now(),now())")) {
            $return = array("message" => "Your account has been created. Please login", "success" => true);;
            return json_encode($return);
        } else {
            $error = array("message" => "Please try a different email. If error persists, contact customer service", "success" => false);
            return json_encode($error);
        }
    } elseif ($userExist->code == 202) {
        $error = array("message" => "User name aleady taken", "success" => false);
        return json_encode($error);
    } else {
        $error = array("message" => "An error has occured, please try again", "success" => false);
        return json_encode($error);
    }
}

function create_session($user, $password, $connection)
{
    if ($result = $connection->query("SELECT MAX(id) FROM sessions")) {
        $result = $result->fetch_assoc();
        $last = $result['MAX(id)'];
        unset($result);
        $game_id = $last + 1;
        $name = "game" . $game_id;
        $query = "insert into sessions values(null,{$user},'{$name}','{$password}',1,0,0)";
        if ($connection->query($query)) {
            $query = "insert into players values(null,{$game_id},{$user},1,now())";
            if ($connection->query($query)) {
                return json_encode(array("name" => $name, "key" => $password, "message" => 'OK'));
            } else {
                return json_encode(array("message" => 'error'));
            }
        } else {
            return json_encode(array("message" => 'error'));
        }
    } else {
        return json_encode(array("message" => 'error'));
    }
}

function join_session($name, $password, $connection)
{
    if ($result = $connection->query("SELECT * FROM sessions WHERE name='{$name}'")) {
        $result = $result->fetch_object();
        if (is_null($result)) {
            return json_encode(array("message" => "SNF"));
        } elseif ($password == $result->pass) {
            unset($result->pass);
            $result->message = "OK";
            return json_encode($result);
        } else {
            return json_encode(array("message" => "SKI"));
        }
    } else {
        return json_encode(array("message" => "error"));
    }
}
