<?php

$path = '../root'.$_GET['path'];
$folder = $_GET['folder'];

if (!mkdir($path.$folder)) {
    echo error_get_last()['message'];
}