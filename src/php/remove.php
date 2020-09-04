<?php

$path = '../root'.$_GET['path'];
$items = $_GET["items"];

foreach ($items as $item) {
    remove($path.$item);
}

function remove($entry) {
    if (is_file($entry)) {
        if (!unlink($entry))
            echo error_get_last()['message'].PHP_EOL;
    } else if (is_dir($entry)) {
        $children = scandir($entry);
        foreach ($children as $child)
            if ($child != '.' && $child != '..')
                remove($entry.'/'.$child);
        if (!rmdir($entry))
            echo error_get_last()['message'].PHP_EOL;
    }
}