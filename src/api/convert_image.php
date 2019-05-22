<?php
/**
 * Created by PhpStorm.
 * User: kofi
 * Date: 5/22/19
 * Time: 8:12 PM
 */

$image = $_FILES['file']['tmp_name'];
// A few settings

// Read image path, convert to base64 encoding
$imageData = base64_encode(file_get_contents($image));

// Format the image SRC:  data:{mime};base64,{data};
$src = 'data: ' . mime_content_type($image) . ';base64,' . $imageData;

echo json_encode(array('location' => $src));