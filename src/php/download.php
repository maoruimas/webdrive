<?php

$path = '../root'.$_GET['path'];
$items = $_GET["items"];

if (count($items) === 1 && is_file($path.$items[0])) {
    sendFile($path.$items[0], $items[0]);
} else {
    $zip = new ZipArchive();
    $tmpFile = tempnam('.', '');
    $zip->open($tmpFile, ZipArchive::CREATE);

    $count = 0;
    $first = '';

    foreach ($items as $item) {
        $succeed = true;
        if (is_dir($path.$item)) {
            $children = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path.$item.'/'), RecursiveIteratorIterator::LEAVES_ONLY);

            foreach ($children as $child) {
                if (basename($child) !== '.' && basename($child) !== '..') {
                    $content = file_get_contents($child);
                    $zip->addFromString(str_replace($path, '', $child), $content);
                }
            }
        } else if(is_file($path.$item)) {
            $content = file_get_contents($path.$item);
            $zip->addFromString($item, $content);
        } else {
            $succeed = false;
        }

        if ($succeed) {
            if ($count === 0) $first = $item;
            $count++;
        }
    }

    $zip->close();

    if ($count) sendFile($tmpFile, $first.($count > 1 ? '等'.$count.'项' : '').'.zip');
    unlink($tmpFile);
}

function sendFile($file, $name) {
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.$name.'"');
    header('Content-Length: '.filesize($file));
    readfile($file);
}