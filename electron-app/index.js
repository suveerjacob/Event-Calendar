const electron = require("electron");
const {Menu} = require('electron');
const {dialog} = require('electron')
var jsonfile = require('jsonfile');
var main = require('../app.js');
//var express_refresh = require('express-refresh');

let mainWindow;

const constructorMethod = () => {
  // Module to control application life.
  const app = electron.app;

  // Module to create native browser window.
  const BrowserWindow = electron.BrowserWindow;
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Import',
          click(item, focusedWindow) {
            console.log("Import Clicked");

            console.log(dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: 'JSON Type', extensions: ['json'] }]
            }, (fileNames) => {
              if (fileNames === undefined) {
                console.log("No file Selected");
                return;
              }
              console.log(fileNames);
              jsonfile.readFile(fileNames[0], function (err, obj) {
                var file = 'json_file/event.json'
                jsonfile.writeFile(file, obj, { spaces: 2 }, function (err) {
                  console.log("Data Written to file");
                  //express_refresh();
                  var buttonsArr = ['OK'];
                  dialog.showMessageBox({ type: "info", buttons: buttonsArr, message: "Data imported Successfully" });
                  mainWindow.reload();
                })
              });
            }));
          }
        },
        {
          label: 'Export',
          click(item, focusedWindow) {
            console.log("Export Clicked");
            dialog.showSaveDialog({ filters: [{ name: 'JSON Type', extensions: ['json'] }] }, function (fileName) {
              if (fileName === undefined) {
                console.log("You didn't save the file");
                return;
              }
              
              var file = 'json_file/event.json'
              jsonfile.readFile(file, function (err, obj) {
                jsonfile.writeFile(fileName, obj, { spaces: 2 }, function (err) {
                  console.log("Data Written to file");
                  var buttonsArr = ['OK'];
                  dialog.showMessageBox({ type: "info", buttons: buttonsArr, message: "Data exported Successfully" });
                })
              });
            });
          }
        }
      ]
    },
    {
      label: 'Modes',
      submenu: [
        {
          label: 'Desktop View',
          click(item, focusedWindow) {
            console.log("Desktop View Clicked");
            mainWindow.setSize(1200, 900);
          }
        },
        {
          label: 'Tablet View',
          click(item, focusedWindow) {
            console.log("Tablet View Clicked");
            mainWindow.setSize(1000, 600);
          }
        },
        {
          label: 'Mobile View',
          click(item, focusedWindow) {
            console.log("Mobile View Clicked");
            mainWindow.setSize(400, 600);
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1200, height: 900 })
    mainWindow.setResizable(false);
    mainWindow.setMaximizable(false);
    mainWindow.setTitle("Suveer Jacob -- 10406838");

    mainWindow.loadURL('http://localhost:3000/');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools({ mode: "undocked" });


    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
};

module.exports = constructorMethod;