<?php

$path = '../root'.$_POST['path'];
$files = $_FILES['files'];

if ($path && $files) {
    foreach ($files['name'] as $i => $name) {
        if ($name) {
            if ($files['tmp_name'][$i] == '') {
                echo '无法上传'.$name.'，可能是文件过大';
            } else if (!move_uploaded_file($files['tmp_name'][$i], $path.$name)) {
                echo error_get_last()['message'];
            }
        }
    }
} else {
    echo '未知错误';
}