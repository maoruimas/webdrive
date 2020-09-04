<?php
    $path = $_GET['path'];
    $item = $_GET['item'];
    $encoding = $_GET['encoding'];

    $file = 'root'.$path.$item;

    $handle = fopen($file, 'r');
    $content = iconv($encoding, 'utf-8', fread($handle, filesize($file)));
    fclose($handle);
?>

<html>
<head>
    <meta charset='UTF-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title></title>
    <link rel='stylesheet' href='css/edit.css'>
    <script src='vendor/ace/ace.js'></script>
    <script src='vendor/ace/ext-modelist.js'></script>
    <script src='vendor/ace/ext-language_tools.js'></script>
    <script src='vendor/ace/keybinding-vim.js'></script>
    <script src='vendor/ace/keybinding-emacs.js'></script>
    <script src='vendor/ace/keybinding-vscode.js'></script>
    <script src='vendor/ace/keybinding-sublime.js'></script>
    <script src='js/jquery.min.js'></script>
</head>
<body>
    <div id='toolbar'>
        <a class='disabled'>撤销</a><a class='disabled'>重做</a>
        <span contenteditable><?php echo $item; ?></span><a>保存</a>
    </div>
    <div id='editor'><?php echo $content ?></div>
    <div id='footer'>
        <span><?php echo $encoding; ?></span>
        <select>
            <option value=''>Default</option>
            <option value='vim'>Vim</option>
            <option value='emacs'>Emacs</option>
            <option value='vscode'>VSCode</option>
            <option value='sublime'>Sublime</option>
        </select>
    </div>

    <div id='successpop' style='display: none;'>保存成功</div>

    <script>
        let path = '<?php echo $path; ?>';
        let item = '<?php echo $item; ?>';
        const encoding = '<?php echo $encoding; ?>';
    </script>
    <script src='js/edit.js'></script>
</body>
</html>