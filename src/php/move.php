<?php

$path = '../root'.$_GET['path'];
$items = $_GET['items'];
$to = '../root'.$_GET['to'];
if ($to[strlen($to) - 1] !== '/') $to += '/';

foreach ($items as $item) {
    move($path.$item, $to.$item);
}

function move($src, $dst) {
    global $path;
    
    if (is_file($src)) {
        if (is_file($dst))
            echo '无法移动文件，目标已存在：'.str_replace($path, '', $src).PHP_EOL;
        else if (!rename($src, $dst))
            echo error_get_last()['message'].PHP_EOL;
    } else if (is_dir($src)) {
        if (is_dir($dst))
            echo '无法移动文件夹，目标已存在：'.str_replace($path, '', $src).'/'.PHP_EOL;
        else {
            $children = scandir($src);
            foreach($children as $child)
                if ($child != '.' && $child != '..')
                    move($src.'/'.$child, $dst.'/'.$child);
        }
    } else {
        echo str_replace($path, '', $src).'不存在';
    }
}