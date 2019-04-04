const {app, BrowserWindow, ipcMain} = require('electron');
const osascript = require('node-osascript');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    "use strict";
    mainWindow = new BrowserWindow({
        alwaysOnTop: true,
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin')
    "use strict";
    app.quit();
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    "use strict";
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


function runAS(theCode, params) {
    "use strict";
    return osascript.execute(theCode, params, function (err, result) {
        if (err) {
            return console.error(err);
        }
        console.log(result);
    });
}


/* authentication */
ipcMain.on('auth-creds', function (event, acct, pwd) {
    "use strict";
    let asCode = 'tell app "htcLib" to fmGUI_AuthenticateDialog({accountName:acct, pwd:pwd})';
    event.returnValue = runAS(asCode, {acct: acct, pwd: pwd});
});

ipcMain.on('ensure-mode', function (event, acct, pwd, mode) {
    "use strict";
    let asCode = 'tell app "htcLib" to fmGUI_fullAccessToggle({ensureMode:mode, fullAccessAccountName:acct, fullAccessPassword:pwd, userAccountName:acct, userPassword:pwd})';
    event.returnValue = runAS(asCode, {acct: acct, pwd: pwd, mode: mode});
});


/* security */
ipcMain.on('security-open', function (event, acct, pwd) {
    "use strict";
    let asCode = 'tell app "htcLib"\n' +
            'fmGUI_fullAccessToggle({ensureMode:"full", fullAccessAccountName:acct, fullAccessPassword:pwd})\n' +
            'fmGUI_ManageSecurity_Open({fullAccessAccountName:acct, fullAccessPassword:pwd})\n' +
            'end tell';
    event.returnValue = runAS(asCode, {acct: acct, pwd: pwd});
});

ipcMain.on('security-save', function (event, userAcct, userPwd, fullAcct, fullPwd) {
    "use strict";
    let asCode = 'tell app "htcLib"\n' +
            'fmGUI_ManageSecurity_Save({fullAccessAccountName:fullAcct, fullAccessPassword:fullPwd})\n' +
            'try\n' +
            'fmGUI_fullAccessToggle({ensureMode:"user", userAccountName:userAcct, userPassword:userPwd})\n' +
            'end try\n' +
            'end tell';
    event.returnValue = runAS(asCode, {userAcct: userAcct, userPwd: userPwd, fullAcct: fullAcct, fullPwd: fullPwd});
});


/* functions */
ipcMain.on('functions-open', function (event, acct, pwd) {
    "use strict";
    let asCode = 'tell app "htcLib"\n' +
            'fmGUI_fullAccessToggle({ensureMode:"full", fullAccessAccountName:acct, fullAccessPassword:pwd})\n' +
            'fmGUI_CustomFunctions_Open({})\n' +
            'end tell';
    event.returnValue = runAS(asCode, {acct: acct, pwd: pwd});
});

ipcMain.on('functions-save', function (event, acct, pwd) {
    "use strict";
    let asCode = 'tell app "htcLib"\n' +
            'fmGUI_CustomFunctions_Save({})\n' +
            'try\n' +
            'fmGUI_fullAccessToggle({ensureMode:"user", userAccountName:acct, userPassword:pwd})\n' +
            'end try\n' +
            'end tell';
    event.returnValue = runAS(asCode, {acct: acct, pwd: pwd});
});

/* manage db */
ipcMain.on('db-open', function (event, acct, pwd) {
    "use strict";
    let asCode = 'tell app "htcLib"\n' +
            'fmGUI_fullAccessToggle({ensureMode:"full", fullAccessAccountName:acct, fullAccessPassword:pwd})\n' +
            'fmGUI_ManageDb_Open({})\n' +
            'end tell';
    event.returnValue = runAS(asCode, {acct: acct, pwd: pwd});
});

ipcMain.on('db-save', function (event, acct, pwd) {
    "use strict";
    let asCode = 'tell app "htcLib"\n' +
            'fmGUI_ManageDb_Save({})\n' +
            'try\n' +
            'fmGUI_fullAccessToggle({ensureMode:"user", userAccountName:acct, userPassword:pwd})\n' +
            'end try\n' +
            'end tell';
    event.returnValue = runAS(asCode, {acct: acct, pwd: pwd});
});
