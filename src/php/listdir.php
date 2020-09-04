<?php

$path = '../root'.$_GET['path'];

$folders = array();
$files = array();

$excelTypes = array('xsl', 'xslx');
$slideTypes = array('ppt', 'pptx');
$wordTypes = array('doc', 'docx');
$codeTypes = array('c', 'cpp', 'h', 'py', 'java', 'js', 'qml');
$compressTypes = array('zip', 'rar', '7z', 'gz', 'tar', 'xz');
$imageTypes = array('png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg');
$musicTypes = array('mp3', 'wma', 'flac', 'ape', 'aac', 'cue');
$videoTypes = array('mp4', 'avi', 'mkv', 'rm', 'rmvb', 'wmv');
$knownTypes = array('ai', 'apk', 'bt', 'cad', 'exe', 'flash', 'iso', 'pdf', 'psd', 'txt');

$items = scandir($path);
foreach ($items as $item) {
    if ($item !== '.' && $item !== '..') {
        if (is_dir($path.$item)) {
            array_push($folders, $item);
        } else if (is_file($path.$item)) {
            array_push($files, $item);
        }
    }
}

foreach ($folders as $folder) {
    echo "<li class='rowlayout item'><input type='checkbox'><img class='item-icon' src='img/folder.png' /><div class='item-name'><a data-type='folder'>$folder</a></div></li>";
}
foreach ($files as $file) {
    // size
    $size = filesize($path.$file);
    if ($size < 1000) {
        $size = $size.'B';
    } else if ($size < 1000000) {
        $size = number_format($size / 1000, 1).'KB';
    } else {
        $size = number_format($size / 1000000, 1).'MB';
    }
    // type
    $type = isset(pathinfo($file)['extension']) ? pathinfo($file)['extension'] : '';
    if (in_array($type, $excelTypes)) {
        $type = 'excel';
    } else if (in_array($type, $slideTypes)) {
        $type = 'slide';
    } else if (in_array($type, $wordTypes)) {
        $type = 'word';
    } else if (in_array($type, $codeTypes)) {
        $type = 'code';
    } else if (in_array($type, $compressTypes)) {
        $type = 'compress';
    } else if (in_array($type, $imageTypes)) {
        $type = 'image';
    } else if (in_array($type, $musicTypes)) {
        $type = 'music';
    } else if (in_array($type, $videoTypes)) {
        $type = 'video';
    } else if (!in_array($type, $knownTypes)) {
        $type = 'unknown';
    }
    // encoding
    $encoding = getEncoding($path.$file);

    echo "<li class='rowlayout item'><input type='checkbox'><img class='item-icon' src='img/$type.png' /><div class='item-name'><a data-type='$encoding'>$file</a></div><span class='item-size'>$size</span></li>";
}

function getEncoding($file) {
    if (filesize($file) == 0) {
        return 'utf-8';
    } else {
        $enc = exec("file -i '$file' | awk -F= '{ print $2 }'");
        // if host is not linux return binary all the time
        if ($enc == '') {
            $enc = 'binary';
        }
        return $enc;
    }
}