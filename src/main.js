// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const { ElectronBlocker,fullLists } = require('@cliqz/adblocker-electron')
const fetch = require('cross-fetch') // required 'fetch'
app.commandLine.appendSwitch('disable-pinch'); //disables zooming
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    darkTheme: true,
    icon: 'icon/youtube.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  if (mainWindow.webContents.session === undefined) {
    throw new Error('defaultSession is undefined');
  }
  mainWindow.loadURL('https://youtube.com')
  mainWindow.setTitle("Youtube for Desktop")
  mainWindow.setBackgroundColor('#181818')
  const adblocker = await ElectronBlocker.fromLists(fetch, fullLists);
  adblocker.enableBlockingInSession(mainWindow.webContents.session);

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
  })
  mainWindow.webContents.on("did-fail-load", () => {
    if(confirm("Youtube could not be loaded. Retry?")) {
      mainWindow.reload()
    }
    else {
      mainWindow.close()
    }})

  mainWindow.on("page-title-updated", event => {
    event.preventDefault()
  })


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
