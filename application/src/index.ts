import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

const isDev = process.env.NODE_ENV === 'development';


console.log(`isDev env? : ${isDev}`);


declare var __static: any;

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: any;

function createMainWindow() {

     const window = new BrowserWindow({ webPreferences: { webSecurity: false } });

     if (isDev) {
          window.webContents.openDevTools();
          window.loadURL(`http://localhost:3000`);
     } else {
          window.loadURL(formatUrl({
               pathname: path.join(__static, '../app.asar.unpacked/static/index.html'),
               protocol: 'file',
               slashes: true
          }))
     }
     window.on('closed', () => {
          mainWindow = null;
     })
     

     window.webContents.on('devtools-opened', () => {
          window.focus();
          setImmediate(() => {
               window.focus()
          });
     })

     return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
     // on macOS it is common for applications to stay open until the user explicitly quits
     if (process.platform !== 'darwin') {
          app.quit()
     }
})

app.on('activate', () => {
     // on macOS it is common to re-create a window even after all windows have been closed
     if (mainWindow === null) {
          mainWindow = createMainWindow();
     }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
     mainWindow = createMainWindow();
})