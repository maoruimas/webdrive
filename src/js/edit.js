const editor = ace.edit('editor');
const session = editor.session;
const undoManager = session.getUndoManager();
const modelist = ace.require('ace/ext/modelist');

const undo = document.querySelector('#toolbar a:nth-of-type(1)');
const redo = document.querySelector('#toolbar a:nth-of-type(2)');
const filename = document.querySelector('#toolbar span');
const save = document.querySelector('#toolbar a:last-child');
const keybinding = document.querySelector('#footer select');
const kboptions = keybinding.options;

function updateFilename() {
    filename.textContent = filename.textContent || '新建文件';
    document.title = filename.textContent;
    session.setMode(modelist.getModeForPath(filename.textContent).mode);
}

function updateToolbar() {
    undo.className = undoManager.hasUndo() ? '' : 'disabled';
    redo.className = undoManager.hasRedo() ? '' : 'disabled';
    save.className = undoManager.isClean() ? 'disabled' : '';
}

async function removeAndUpload() {
    if (undoManager.isClean()) {
        return;
    }

    // remove
    let response = await fetch(`php/remove.php?path=${encodeURIComponent(path)}&items[]=${encodeURIComponent(item)}`);
    let message = await response.text();
    if (message) {
        alert(message);
        return;
    }

    // upload
    let tmpFile = new File([session.getValue()], filename.textContent);
    let form = new FormData();
    form.append('path', path);
    form.append('files[]', tmpFile);
    response = await fetch('php/upload.php', {
        method: 'POST',
        body: form
    });
    message = await response.text();
    if (message) {
        alert(message);
        return;
    }

    // settings
    item = filename.textContent;
    undoManager.markClean();
    updateToolbar();

    $('#successpop').fadeIn().delay(1000).fadeOut(100);
}

undo.onclick = () => editor.undo();
redo.onclick = () => editor.redo();
filename.onblur = () => {
    if (filename.textContent !== item) {
        undoManager.markClean(false);
        updateFilename();
        updateToolbar();
    }
}
save.onclick = removeAndUpload;
editor.on('input', updateToolbar);
keybinding.onchange = () => { editor.setKeyboardHandler('ace/keyboard/'+kboptions[kboptions.selectedIndex].value); }

editor.commands.addCommand({
    name: "save",
    exec: removeAndUpload,
    bindKey: { win: "ctrl-s", mac: "cmd-s" }
});

updateFilename();
updateToolbar();

session.setUseWrapMode(true);
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});