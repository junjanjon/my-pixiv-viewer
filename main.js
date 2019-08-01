const fs = require('fs');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog
} = require('electron');

const directoryConfigFilePath = __dirname + '/prev_directory.txt';

app.on('window-all-closed', function()
{
    app.quit();
});

let mainWindow;
let subWindow;

app.on('ready', function()
{
    Menu.setApplicationMenu(menu);
    mainWindow = createMainWindow();
    subWindow = createSubWindow();

    setTimeout(function()
    {
        fs.readFile(directoryConfigFilePath, 'utf8', function (err, data)
        {
            if (err)
            {
                if (err.errno === -2)
                {
                    console.log('ディレクトリ設定がないです. [File] -> [Open] で設定してください.');
                }
                else
                {
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
let template = [{
    label: 'ReadUs',
    submenu: [{
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function()
        {
            app.quit();
        }
    }]
}, {
    label: 'File',
    submenu: [{
        label: 'Open',
        accelerator: 'Command+O',
        click: function()
        {
            // 「ディレクトリを開く」ダイアログの呼び出し
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }, function(baseDir)
            {
                if (baseDir && baseDir[0])
                {
                    let directoryPath = baseDir[0];
                    fs.writeFile(directoryConfigFilePath, directoryPath , function (err)
                    {
                        if (err !== null)
                        {
                            console.error(err);
                        }
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
        click: function()
        {
            BrowserWindow.getFocusedWindow().toggleDevTools();
        }
    }
    ]
}];

const menu = Menu.buildFromTemplate(template);

function createMainWindow()
{
    // ブラウザ(Chromium)の起動, 初期画面のロード
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        },
    });
    mainWindow.loadURL('file://' + __dirname + '/lib/html/main_viewer.html');
    mainWindow.center();
    mainWindow.on('closed', function()
    {
        mainWindow = null;
    });

    return mainWindow;
}

function createSubWindow()
{
    let subWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        },
    });
    subWindow.loadURL('file://' + __dirname + '/lib/html/sub_viewer.html');

    subWindow.center();
    subWindow.on('closed', function()
    {
        subWindow = null;
    });
    return subWindow;
}

function sendDirectoryPath(directoryPath)
{
    if (mainWindow === null)
    {
        console.error('mainWindow is null');
        return;
    }
    mainWindow.webContents.send('main_directory', directoryPath);
}

ipcMain.on('show_illust_id', function( ev, message )
{
    if (subWindow === null)
    {
        console.error('subwindow is null');
        return;
    }
    console.log( message );
    subWindow.webContents.send('illust_id', message);
});
