var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var fs = require('fs');
const ipcMain = electron.ipcMain;

const {
    dialog
} = require('electron');

app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

var mainWindow;
var subWindow;

app.on('ready', function() {
    Menu.setApplicationMenu(menu);
    mainWindow = createMainWindow();
    subWindow = createSubWindow();

    setTimeout(function() {
        fs.readFile('directory.txt', 'utf8', function (err, data) {
            if (err) {
                if (err.errno === -2) {
                    console.log("ディレクトリ設定がないです. [File] -> [Open] で設定してください.");
                }
                else {
                    console.error(err);
                }
                return;
            }

            console.log(data);
            sendDirectoryPath(data);
        });
    }, 1000);
});

// メニュー情報の作成
var template = [{
    label: 'ReadUs',
    submenu: [{
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() {
            app.quit();
        }
    }]
}, {
    label: 'File',
    submenu: [{
        label: 'Open',
        accelerator: 'Command+O',
        click: function() {
            // 「ファイルを開く」ダイアログの呼び出し
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }, function(baseDir) {
                if (baseDir && baseDir[0]) {
                    var directoryPath = baseDir[0];
                    fs.writeFile('directory.txt', directoryPath , function (err) {
                        console.error(err);
                    });
                    sendDirectoryPath(directoryPath);
                }
            });
        }
    }]
}, {
    label: 'View',
    submenu: [{
            label: 'Toggle DevTools',
            accelerator: 'Alt+Command+I',
            click: function() {
                BrowserWindow.getFocusedWindow().toggleDevTools();
            }
        }
    ]
}];

var menu = Menu.buildFromTemplate(template);

function createMainWindow() {
    // ブラウザ(Chromium)の起動, 初期画面のロード
    var mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
    });
    mainWindow.loadURL('file://' + __dirname + '/lib/html/main_viewer.html');
    mainWindow.center();
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    return mainWindow;
}

function createSubWindow(){
    var subWindow = new BrowserWindow({
        width: 1000,
        height: 700,
    });
    subWindow.loadURL('file://' + __dirname + '/lib/html/sub_viewer.html');

    subWindow.center();
    subWindow.on('closed', function() {
        subWindow = null;
    });
    return subWindow;
}

function sendDirectoryPath(directoryPath) {
    if (mainWindow == null)
    {
        console.error("mainWindow is null");
        return;
    }
    mainWindow.webContents.send('main_directory', directoryPath);
}

ipcMain.on('show_illust_id', function( ev, message ) {
    if (subWindow == null)
    {
        console.error("subwindow is null");
        return;
    }
    console.log( message );
    subWindow.webContents.send('illust_id', message);
});
