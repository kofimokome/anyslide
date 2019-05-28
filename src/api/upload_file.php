<?php

include_once("includes/header.php");
include_once("includes/functions.php");
/*ini_set('display_errors',1);
error_reporting(E_ALL);*/

if ($_FILES && $_FILES['file']['tmp_name']) {

    $override = $_POST['override'];
    if ($override == '' || $override == 2) {
        $override = false;
    } else {
        $override = true;
    }

    $user_id = $_POST['user_id'];
    $presentation_id = $_POST['presentation_id'];

    // upload the file to the temporary directory
    $target_dir = "uploads/";
    $target_file = $target_dir . time() . '.pptx';


    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.docconversionapi.com/convert?outputFormat=HTML",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => array('optionsJSON' => '{}', 'inputFile' => new CURLFILE($target_file)),
            CURLOPT_HTTPHEADER => array(
                "X-ApplicationID: bc2e4fc3-2e23-46fc-8394-ec498e81f3c0",
                "X-SecretKey: 810d9871-103e-4c7b-b615-ddff636828b8"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo json_encode(array('success' => false, 'message' => 'An Error Occurred While Processing Your File'));
        } else {
// todo: make sure there is at least one slide
            if ($override) {
                $query = "delete from slides where presentation_id = {$presentation_id}";
                $con->query($query);
            }

            $dom = new DOMDocument();

            $dom->loadHTML($response);

            $elements = $dom->getElementsByTagName("div");

            $xpath = new DOMXPath($dom);
            $slides = $xpath->query("//div[@class='slide']");

            foreach ($slides as $slide) {
                $text = $dom->saveHTML($slide);
                $query = "insert into slides values (null, {$presentation_id},'{$text}',{$user_id},0,now(), now())";
                $con->query($query);
            }

            unlink($target_file);

            echo json_encode(array('success' => true, 'message' => "OK"));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => 'An Error Occurred While Processing Your File',));
    }

} else {
    echo json_encode(array('success' => false, 'message' => 'Please Upload A File'));
}