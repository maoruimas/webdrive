<?php

$path = '../root'.$_GET['path'];
$old = $_GET['old'];
$new = $_GET['new'];

rename($path.$old, $path.$new);