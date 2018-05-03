const electron = require('electron')
const updater = require('electron-updater')
const { app, BrowserWindow, dialog } = electron
const { autoUpdater } = updater
const path = require('path')
const url = require('url')

let mainWindow

app.on('ready', function() {
    /*
    autoUpdater.setFeedURL(
        'http://127.0.0.1/autoupdatetest/'
    )
    autoUpdater.checkForUpdates()
    autoUpdater.on("error", () => {
        dialog.showMessageBox({
            message: "Error on checking update",
            buttons: ["OK"]
        })
    })
    autoUpdater.on("update-downloaded", () => {
        var index = dialog.showMessageBox({
            message: "Update found",
            detail: "Do you want to install it right now?",
            buttons: ["OK, Quit app and Update", "No, Not now"]
        })
        if (index === 0) {
            autoUpdater.quitAndInstall();
        }
    })
    */
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 700
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit()
    })
}
