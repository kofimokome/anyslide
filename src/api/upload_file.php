<?php
include_once("includes/header.php");
include_once("includes/functions.php");

require_once 'vendor/phpoffice/common/src/Common/Autoloader.php';
require_once 'vendor/phpoffice/phppresentation/src/PhpPresentation/Autoloader.php';

\PhpOffice\PhpPresentation\Autoloader::register();
\PhpOffice\Common\Autoloader::register();

use PhpOffice\PhpPresentation\IOFactory;
use PhpOffice\PhpPresentation\Slide;
use PhpOffice\PhpPresentation\Shape\RichText;

if ($_FILES && $_FILES['file']['tmp_name']) {

    $override = $_POST['override'];
    if ($override == '' || $override == 2) {
        $override = false;
    } else {
        $override = true;
    }

    $user_id = $_POST['user_id'];
    $presentation_id = $_POST['presentation_id'];

    $pptReader = IOFactory::createReader('PowerPoint2007');
    try {
        $oPHPPresentation = $pptReader->load($_FILES['file']['tmp_name']);
        $property = $oPHPPresentation->getDocumentProperties();
        $slides = $oPHPPresentation->getAllSlides();
        $content = array();
        foreach ($slides as $slide_k => $slide_v) {
            $shapes = $slides[$slide_k]->getShapeCollection();
            foreach ($shapes as $shape_k => $shape_v) {
                $shape = $shapes[$shape_k];
                $temp = array();

                if ($shape instanceof PhpOffice\PhpPresentation\Shape\RichText) {
                    $paragraphs = $shapes[$shape_k]->getParagraphs();
                    foreach ($paragraphs as $paragraph_k => $paragraph_v) {
                        $text_elements = $paragraph_v->getRichTextElements();
                        foreach ($text_elements as $text_element_k => $text_element_v) {
                            $text = $text_element_v->getText();
                            array_push($temp, $text);
                        }
                    }
                }
            }
            array_push($content, $temp);
        }

        if ($override) {
            $query = "delete from slides where presentation_id = {$presentation_id}";
            $con->query($query);
        }

        foreach ($content as $co) {
            $text = '';
            foreach ($co as $c) {
                $text .= ($c . "<p>");
            }
            if (trim($text) != '') {
                // avoid creating many empty slides
                $query = "insert into slides values (null, {$presentation_id},'{$text}',{$user_id},0,now(), now())";
                $con->query($query);
            }
        }
        echo json_encode(array('success' => true, 'message' => "OK"));

    } catch (Exception $e) {
        //echo $e;
    }

} else {
    echo json_encode(array('success' => false, 'message' => 'Please Upload A File'));
}