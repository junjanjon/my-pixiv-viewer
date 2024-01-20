const fs = require('fs');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog
} = require('electron');

const directoryConfigFilePath = __dirname + '/prev_directory.txt';

function closeApp()
{
    app.quit();
}

let mainWindow;
let subWindow;

app.on('ready', function()
{
    Menu.setApplicationMenu(menu);
    mainWindow = createMainWindow();
    subWindow = createSubWindow();

    mainWindow.webContents.on('did-finish-load', () =>
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
    });
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
            }).then(result =>
            {
                console.log(result);
                if (result.canceled)
                {
                    return;
                }

                if (result.filePaths[0])
                {
                    let directoryPath = result.filePaths[0];

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
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadURL('file://' + __dirname + '/lib/html/main_viewer.html');
    mainWindow.center();
    mainWindow.on('closed', closeApp);

    return mainWindow;
}

function createSubWindow()
{
    let subWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    subWindow.loadURL('file://' + __dirname + '/lib/html/sub_viewer.html');

    subWindow.center();
    subWindow.on('closed', closeApp);
    return subWindow;
}

function sendDirectoryPath(directoryPath)
{
    if (mainWindow === null)
    {
        console.error('mainWindow is null');
        return;
    }
    console.log('main_directory 実行: ' + directoryPath);
    mainWindow.webContents.send('main_directory', directoryPath);
    subWindow.webContents.send('main_directory', directoryPath);
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
