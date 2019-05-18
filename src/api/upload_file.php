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


$pptReader = IOFactory::createReader('PowerPoint2007');
try {
    $oPHPPresentation = $pptReader->load('test.pptx');
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

    $index = 1;
    foreach ($content as $co) {
        echo "<h1> Slide " . $index . "</h1>";
        foreach ($co as $c) {
            echo $c . "<br />";
        }
        echo "<hr /><br /><br /><br />";
        $index++;
    }

} catch (Exception $e) {
    echo $e;
}