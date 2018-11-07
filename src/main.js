const electron = require("electron");
const { app, BrowserWindow, dialog, Menu } = electron;
const path = require("path");
const url = require("url");

let mainWindow;

app.on("ready", function() {
    createWindow();
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

function isDev() {
    return process.mainModule.filename.indexOf("app.asar") === -1;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 700
    });
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    mainWindow.on("closed", () => {
        mainWindow = null;
        app.quit();
    });
    if (isDev()) {
        mainWindow.webContents.openDevTools();
    }

    // Create the Application's main menu
    var template = [
        {
            label: "Application",
            submenu: [
                {
                    label: "About Application",
                    selector: "orderFrontStandardAboutPanel:"
                },
                { type: "separator" },
                {
                    label: "Quit",
                    accelerator: "Command+Q",
                    click: function() {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: "Edit",
            submenu: [
                {
                    label: "Undo",
                    accelerator: "CmdOrCtrl+Z",
                    selector: "undo:"
                },
                {
                    label: "Redo",
                    accelerator: "Shift+CmdOrCtrl+Z",
                    selector: "redo:"
                },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                {
                    label: "Copy",
                    accelerator: "CmdOrCtrl+C",
                    selector: "copy:"
                },
                {
                    label: "Paste",
                    accelerator: "CmdOrCtrl+V",
                    selector: "paste:"
                },
                {
                    label: "Select All",
                    accelerator: "CmdOrCtrl+A",
                    selector: "selectAll:"
                }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
