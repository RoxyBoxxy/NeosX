const {app, BrowserWindow, electron, ipcMain, shell} = require('electron')
const ipc = ipcMain
// Modules to control application life and create native browser window

const path = require('path')
const countdown = require('./countdown')


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  var mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    titleBarStyle: "hidden", // add this line
  });
  
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


// Attach listener in the main process with the given ID
// Event handler for asynchronous incoming messages
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg)

  // Event emitter for sending asynchronous messages
  event.sender.send('asynchronous-reply', 'async pong')
})

// Event handler for synchronous incoming messages
ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) 

  // Synchronous event emmision
  event.returnValue = 'sync pong'
})

