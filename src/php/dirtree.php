<?php

$folders = array();
$parents = array();

if (dfs('../root', -1)) {
    echo json_encode(array('folders'=>$folders, 'parents'=>$parents));
}

function dfs($dir, $parent) {
    global $folders, $parents;

    $handle = opendir($dir);
    if ($handle == false) {
        echo '未知错误';
        return false;
    }

    while ($child = readdir($handle)) {
        if (is_dir($dir.'/'.$child) && $child !== '.' && $child !== '..') {
            array_push($folders, $child);
            array_push($parents, $parent);
            if (!dfs($dir.'/'.$child, count($folders) - 1)) {
                closedir($handle);
                return false;
            }
        }
    }

    closedir($handle);
    return true;
}