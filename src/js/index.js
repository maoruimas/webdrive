var path = '/';
var itemCount = 0;
var itemSelected = 0;

/*
    APIs
*/

function listdir(dir) {
    if (dir == null) {
        alert('listdir: missing parameter dir');
        return;
    }
    generalGet('listdir', { path: dir }, function(result) {
        // insert fetched result
        $('#item-list').html(result);
        // update toolbar
        itemCount = $('#item-list li').length;
        itemSelected = 0;
        updateToolbar();
        // update addressbar
        path = dir;
        var pathList = path.split('/');
        pathList.pop();
        var ab = $('#addressbar');
        ab.html('');
        var tmp = '';
        for (var frag of pathList) {
            tmp += frag+'/';
            var a = $('<a>');
            a.attr('onclick', 'listdir("'+tmp+'")');
            a.text(frag+'/');
            ab.append(a);
        }
    })
}

function download() {
    window.open('php/download.php?'+urlEncode({ path: path, items: getSelected() }), 'hiddenframe');
}

const clipboard = document.querySelector('#clipboard');
function share() {
	clipboard.value = `${document.location.href}php/download.php?${urlEncode({ path: path, items: getSelected() })}`;
    clipboard.select();
    if (document.execCommand('copy')) {
        alert('已复制到剪贴板');
    } else {
		alert('无法写入剪贴板');
    }
}

function rename() {
    var oldName = getSelected()[0];
    var newName = prompt('', oldName);
    if (newName) generalGet('rename', { path: path, old: oldName, new: newName });
}

var tree = {
    folders: [],
    parents: [],
    children: [],
    depth: [],
    lis: [],
    selected: -1,
    toggle: function(v, hide) {
        const li = this.lis[v];

        if (hide === undefined) {
            hide = li.hasClass('opened');
            if (hide) {
                li.removeClass('opened');
            } else {
                li.addClass('opened');
            }

            if (v !== this.selected) {
                $('#t-'+this.selected).removeClass('selected');
                li.addClass('selected');
                this.selected = v;

                var path = '';
                for (var t = v; t != -1; t = this.parents[t]) {
                    path = this.lis[t].text() + '/' + path;
                }
                $('#moveto').val('/' + path);
            }
        } else {
            if (hide) {
                li.hide();
            } else {
                li.show();
            }
            if (!li.hasClass('opened')) {
                return;
            }
        }

        if (this.children[v] instanceof Array)
        for (var child of this.children[v]) {
            this.toggle(child, hide);
        }
    }
};

function dirtree() {
    generalGet('dirtree', {}, function(result) {
        var data = JSON.parse(result);
        tree.folders = [...data.folders];
        tree.parents = [...data.parents];
        tree.children = [];
        for (var i = 0; i < tree.parents.length; ++i) {
            var p = tree.parents[i];
            if (p !== -1) {
                if (tree.children[p] === undefined) {
                    tree.children[p] = [];
                }
                tree.children[p].push(i);
                tree.depth[i] = tree.depth[p] + 1;
            } else {
                tree.depth[i] = 1;
            }
        }
        tree.lis = [];
        tree.selected = -1;

        const treeview = $('#treeview');
        treeview.html('');
        $('#moveto').val('/');

        for (var i = 0; i < tree.folders.length; ++i) {
            const li = $(`<li id='t-${i}' style='margin-left: ${tree.depth[i]*25}px;'>${tree.folders[i]}</li>`);
            if (tree.parents[i] !== -1) {
                li.hide();
            }
            tree.lis.push(li);
            treeview.append(li);
        }

        $('#movedialog').fadeIn(100);
    });
}

function move() {
    $('#movedialog').fadeOut(100);
    generalGet('move', { path: path, items: getSelected(), to: $("#moveto").val() });
}

function remove() {
    if (confirm('确认删除？'))
        generalGet('remove', { path: path, items: getSelected() });
}

function newfolder() {
    var folder = prompt('输入文件夹名：', '新建文件夹');
    if (folder) generalGet('newfolder', { path: path, folder: folder });
}

function upload(fileList) {
    var form = new FormData();
    form.append('path', path);
    for (var i = 0; i < fileList.length; ++i) {
        form.append('files[]', fileList[i]);
    }

    var addbutton = $('#addbutton');

    $.ajax({
        url: 'php/upload.php',
        type: 'POST',
        processData: false,
        contentType: false,
        data: form,
        xhr: function() { // progress
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', function(e) {
                    addbutton.text(Math.floor(e.loaded / e.total * 100));
                });
            }
            return xhr;
        },
        success: function(result) {
            addbutton.text('+');
            if (result) alert(result);
            listdir(path);
        },
        error: function(xhr, status, error) {
            alert('upload::ajax: '+status);
        }
    });
}

// help functions

/**
 * A generized get function
 * 
 * @param {string} command 
 * @param {object} data 
 * @param {function} onsuccess a callback that accept get result as
 * parameter. can be left empty
 */
function generalGet(command, data, onsuccess) {
    $.get(`php/${command}.php`, data, function(result, status) {
        if (status !== 'success') {
            alert(command+'get: '+status);
            return;
        }
        if (typeof onsuccess == 'function') {
            onsuccess(result);
        }else {
            if (result) alert(result);
            listdir(path);
        }
    });
}

function urlEncode(obj, key) {
    var type = typeof obj;
    if (type === 'string' || type === 'number' || type === 'boolean') {
        return key+'='+encodeURIComponent(obj)+'&';
    } else {
        var ret = '';
        for (var i in obj) {
            var k = key == null ? i : obj instanceof Array ? key+'%5B'+i+'%5D' : key+'.'+i;
            ret += urlEncode(obj[i], k);
        }
        return key == null ? ret.slice(0, -1) : ret;
    }
}

function getSelected() {
    var ret = [];
    $('#item-list li :checkbox:checked').each(function () {
        ret.push($(this).siblings('.item-name').text());
    })
    return ret;
}

function updateToolbar() {
    $('#toolbar :checkbox').prop('checked', itemSelected === itemCount && itemCount);
    $('#toolbar #toolbar-label').text(itemSelected ? '已选中' + itemSelected + '项' : '文件名');
    $('#toolbar button').prop('disabled', itemSelected === 0);
    $('#toolbar button:contains("重命名")').prop('disabled', itemSelected !== 1);
}

/*
    main
*/

$(function () {
    $('#toolbar :checkbox').click(function () {
        var checked = $(this).prop('checked');
        $('#item-list :checkbox').prop('checked', checked);
        itemSelected = checked ? itemCount : 0;
        updateToolbar();
    })

    $('#item-list').on('click', function(e) {
        if (e.target.nodeName === 'INPUT') {
            itemSelected += e.target.checked ? +1 : -1;
            updateToolbar();
        } else if (e.target.nodeName === 'A') {
            var name = path + e.target.text;
            switch(e.target.dataset.type) {
                case 'folder': listdir(name+'/'); break;
                case 'binary': window.open(`root${name}`, '_blank'); break;
                default: window.open(`edit.php?path=${path}&item=${e.target.text}&encoding=${e.target.dataset.type}`);
            }
        }
    });
    $('#item-list').on('contextmenu', function(e) {
        var cb = $(e.target).parents('li').find(':checkbox');
        if (cb.length !== 1) {
            return;
        }

        $('#item-list :checkbox').prop('checked', false);
        cb.prop('checked', true);
        itemSelected = 1;
        updateToolbar();

        const menu = document.querySelector('#itemmenu .menu');
        menu.style.left = e.clientX+1+'px';
        menu.style.top = e.clientY+1+'px';
        $('#itemmenu').fadeIn(100);
        return false;
    });

    const popups = document.getElementsByClassName('popup');
    for (var i = 0; i < popups.length; ++i) {
        popups[i].addEventListener('click', function() {$(this).fadeOut(100);});
        popups[i].addEventListener('contextmenu', e => e.preventDefault());
    }

    const droparea = $('#droparea');
    window.addEventListener('dragenter', e => $('#droparea').fadeIn(100));
    droparea.on('dragenter', e => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; });
    droparea.on('dragover', e => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; });
    droparea.on('dragleave', e => $(this).fadeOut(100));
    droparea.on('drop', e => {
        event.preventDefault();
        droparea.fadeOut(100);
        upload(event.dataTransfer.files);
    });

    $('#movedialog .dialog').on('click', function(e) {
        if (e.target.nodeName === 'LI') {
            var id = parseInt(e.target.id.replace('t-', ''));
            tree.toggle(id);
        }

        // stop propagation
        return false;
    });

    listdir('/');
})