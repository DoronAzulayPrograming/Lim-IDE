// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification , globalShortcut ,shell,dialog } = require('electron')
const path = require('path')

const isDev = !app.isPackaged
if(isDev){
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname,'node_modules','.bin','electron')
  })
}

let mainWindow;
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 830,
    minHeight: 500,
    frame:false,
    webPreferences: {
      nodeIntegration:false,
      worldSafeExecuteJavaScript: true,
      contextIsolation:true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // globalShortcut.register("CommandOrControl+N",()=>{
  //   console.log("new file create.")
  // })
  // globalShortcut.register("CommandOrControl+R", () => {
  //   console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  // });
  createWindow()

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

ipcMain.on('notify', (_, message) => {
  new Notification({title: 'Notifiation', body: message}).show();
})

ipcMain.on('navigateTo', (_, url) => {
  shell.openExternal(url)
})

ipcMain.on('minimize', (_) => {
  mainWindow.minimize();
})

ipcMain.on('maximize', (_) => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
})

ipcMain.on('exit', (_) => {
  mainWindow.close();
})

const fs = require('fs');

function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getFiles(srcpath){
  return fs.readdirSync(srcpath)
  .map(file => path.join(srcpath, file))
  .filter(path => !fs.statSync(path).isDirectory());
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesAndFiles(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file));
}

function getDirectoriesRecursive(srcpath) {
  return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

function getDirectoriesAndFilesRecursive(srcpath){
  let node = { path : "", nodes:[]}
  node.path = srcpath;
  if(fs.statSync(srcpath).isDirectory()){
    var folders = fs.readdirSync(srcpath)
    .map(file => getDirectoriesAndFilesRecursive(path.join(srcpath, file)))
    folders.forEach(f=> node.nodes.push(f))
  }
  return node;
}

function getDirectoriesAndFilesRecursive1(srcpath,index,parentId){
  let node = { id:0,parentId:null,label : "",path : "", icon:"", isFile:true,children:[]}
  node.id = index++;
  if(parentId > 0){
    node.parentId = parentId;
  }
  node.path = srcpath;
  let arr = srcpath.split("\\")
  node.label = arr[arr.length-1];
  if(fs.statSync(srcpath).isDirectory()){
    node.isFile = false
    var folders = fs.readdirSync(srcpath)
    .map(file => {
      let tn = getDirectoriesAndFilesRecursive1(path.join(srcpath, file),index++,node.id)
      index += tn.children.length
      return tn
    })
    folders.forEach(f=> node.children.push(f))
  }else {
    let ex = node.label.split(".")[1]
    node.icon = getIconNameFromEx(ex)//+"-file"
  }
  return node;
}

function getIconNameFromEx(ex){
  switch(ex){
    case "c" : return "c-file"
    case "cpp" : return "cpp-file"
    case "cs" : return "csharp-file"
    case "js" : return "js-file"
    case "jsx" : return "js-file"
    case "css" : return "css-file"
    case "scss" : return "scss-file"
    case "html" : return "html-file"
    case "lim" : return "lim-file"
    case "py" : return "py-file"
    case "json" : return "json-file"
    case "png" : return "png-file"
    default: return "text-file"
  }
}

function readFile(file_path,callback){
  fs.readFile(file_path, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    callback(data)
  })
}

ipcMain.on('select-directory', async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  event.reply('select-directory-reply', result.filePaths.toString())
})

ipcMain.on('get-files', (event,srcpath) => {
  event.reply('get-files-reply', getFiles(srcpath.toString()))
})

ipcMain.on('get-directories', (event,srcpath) => {
  event.reply('get-directories-reply', getDirectories(srcpath.toString()))
})

ipcMain.on('get-directories-and-files', (event,srcpath) => {
  event.reply('get-directories-and-files-reply', getDirectoriesAndFiles(srcpath.toString()))
})

ipcMain.on('get-directories-and-files-recursive', (event,srcpath) => {
  event.reply('get-directories-and-files-recursive-reply', getDirectoriesAndFilesRecursive1(srcpath.toString(),1,0))
})

ipcMain.handle('get-directories-and-files-recursive', (event,srcpath) => {
  return getDirectoriesAndFilesRecursive1(srcpath.toString(),1,0)
})

ipcMain.handle('get-files', (event,srcpath) => {
  return getFiles(srcpath.toString())
})

ipcMain.handle('get-directories', (event,srcpath) => {
  return getDirectories(srcpath.toString())
})

ipcMain.handle('read-file', (event,srcpath) => {
  //Synchronous usage
  let res = fs.readFileSync(srcpath.toString(), {encoding:'utf8', flag:'r'})
  return res
})

ipcMain.on('write-file', (event,srcpath,text) => {
  //Synchronous usage
  fs.writeFileSync(srcpath.toString(), text, {encoding: 'utf8'});
})
/*
ipcMain.on('delete-file', async (event,srcpath) => {
  //Synchronous usage
  fs.unlinkSync(srcpath);
})

ipcMain.on('delete-folder', async (event,srcpath) => {
  //Synchronous usage
  fs.rmdirSync(srcpath, { recursive: true });
})*/

ipcMain.handle('delete-file', async (event,srcpath) => {
  //Synchronous usage
  fs.unlinkSync(srcpath);
})

ipcMain.handle('delete-folder', async (event,srcpath) => {
  //Synchronous usage
  fs.rmdirSync(srcpath, { recursive: true });
})

ipcMain.handle('rename-file-folder', async (event,srcpath,newPath) => {
  //Synchronous usage
  fs.renameSync(srcpath, newPath);
})

ipcMain.handle('create-file', async (event,srcpath,text) => {
  //Synchronous usage
  fs.appendFileSync(srcpath,text);
})

ipcMain.handle('create-folder', async (event,srcpath) => {
  //Synchronous usage
  if (!fs.existsSync(srcpath)){
    fs.mkdirSync(srcpath);
  }
})





// Message Box
ipcMain.handle('show-message-box', async (event,options) => {
    //Synchronous usage
    let response = await dialog.showMessageBox(mainWindow,options)
    return response
})

ipcMain.handle('show-delete-message-box', async (event,msg) => {
    
  let options  = {
    title:"Alert",
    buttons: ["Yes","No","Cancel"],
    message: msg
  }
  //Synchronous usage
  let response = await dialog.showMessageBox(mainWindow,options)
  return response.response === 0
})

const util = require('util');
const exec = util.promisify(require('child_process').exec);

ipcMain.handle('terminal-command', async (event,command) => {

  const { stdout, stderr } = await exec(command);

  if (stderr) {
    return stderr
  }
  return stdout
})
/*
const { spawn } = require('child_process');
const child = spawn('C:\\Windows\\System32\\cmd.exe');

child.stdout.on('data', (data) => {
  console.log(`command line says:\n${data}`);
});

ipcMain.handle('cmd-command', (event,command,o) => {
  child.stdin.write(command+'\n')
})*/