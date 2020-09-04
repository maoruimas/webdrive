# Intro

简易网页网盘, 便于在只有浏览器的设备上传输文件.

在[DrBrad的项目](https://github.com/DrBrad/WebDrive)的基础上边学边写的.

1. 轻量, 简便;
2. 基本的文件与文件夹操作;
3. 支持在线编辑(基于[Ace](https://github.com/ajaxorg/ace)).

![](https://gitee.com/maoruimas/webdrive/raw/master/screenshots/demo.gif)

**注意:**

* 在服务器上安装好Apache, 将代码上传至`path/to/www/html/webdrive`, 并在此文件夹下新建一个`root`文件夹, 作为网盘的存储根文件夹. 赋予Apache此文件夹的读写权限:
```sh
chown www-data:www-data path/to/root
chmod g+rw path/to/root
```

* PHP默认只能上传2MB以下的文件. 找到`php.ini`文件(例如用`locate`命令), 并修改如下
```
...
max_input_time = -1
...
post_max_size = 150M
...
upload_max_filesize = 128M
...
```
这里我将上传限制设为128M. `post_max_size`应大于`upload_max_filesize`.

* 实现中通过在linux端执行`file -i`命令检测文件类型与编码, 因此必须在linux服务器上使用, 否则无法在线编辑.

[项目地址](https://gitee.com/maoruimas/webdrive)

# Todo

适配其它浏览器