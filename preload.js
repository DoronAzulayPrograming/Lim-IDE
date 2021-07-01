// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

const { ipcRenderer, contextBridge } = require('electron');

const { spawn } = require('child_process');
let process_list = []

var kill = require('tree-kill');

contextBridge.exposeInMainWorld('electron', {
notificationApi: {
  sendNotification(message) {
    console.log(message)
    ipcRenderer.send('notify', message);
  }
},
appRemoteApi: {
  minimizeWindow(){
    ipcRenderer.send('minimize')
  },
  maximizeWindow(){
    ipcRenderer.send('maximize')
  },
  closeWindow(){
    ipcRenderer.send('exit')
  }
},
shellApi: {
  navigateTo(url){
    ipcRenderer.send('navigateTo',url)
  },
  showMessageBox(options,callback){
    (async ()=>{
      var res = await ipcRenderer.invoke('show-message-box',options)
      callback(res)
    })();
  },
  showDeleteMessageBox(msg,callback){
    (async ()=>{
      var res = await ipcRenderer.invoke('show-delete-message-box',msg)
      callback(res)
    })();
  },
  createCmd(id,stdout_callback){
    let cmd = spawn('C:\\Windows\\System32\\cmd.exe')
    //cmd.stdin.write('cd "c:\\"\n')
    cmd.stdout.on('data', (data)=>{ stdout_callback(data.toString())})
    process_list.push({id:id,cmd:cmd,stdout_callback:stdout_callback})
  },
  removeCmd(id){
    let index = process_list.findIndex(p=> p.id === id)
    
    kill(process_list[index].cmd.pid);
    process_list = process_list.filter(c=>c.id !== id)
  },
  getCmdList(){
    return [...process_list]
  },
  exeCmdCommand(cmd_id,command){
    let process = process_list.filter(c=>c.id === cmd_id)[0]
    process.cmd.stdin.write(command+'\n')
  }
},
filesApi: {
  getFiles(srcpath,callback){
    (async () => {
      let res = await ipcRenderer.invoke('get-files',srcpath)
      callback(res)
    })();
  },
  readFile(srcpath,callback){
    (async () => {
      let res = await ipcRenderer.invoke('read-file',srcpath)
      callback(res)
    })();
  },
  writeFile(srcpath,text){
    ipcRenderer.send('write-file',srcpath,text)
  },
  deleteFile(srcpath,callback){
    (async () => {
      await ipcRenderer.invoke('delete-file',srcpath)
      callback()
    })();
  },
  rename(srcpath,newpath,callback){
    (async () => {
      await ipcRenderer.invoke('rename-file-folder',srcpath,newpath)
      callback()
    })();
  },
  createFile(srcpath,text,callback){
    (async () => {
      await ipcRenderer.invoke('create-file',srcpath,text)
      callback()
    })();
  },
},
directoriesApi: {
  searchDirectory(callback){
    ipcRenderer.send('select-directory')
    ipcRenderer.on('select-directory-reply',(event, arg) => {
      callback(arg)
    })
  },
  getDirectories(srcpath,callback){
    (async () => {
      let res = await ipcRenderer.invoke('get-directories',srcpath)
      callback(res)
    })();
  },
  getDirectoriesAndFiles(srcpath,callback){
    ipcRenderer.send('get-directories-and-files',srcpath)
    ipcRenderer.on('get-directories-and-files-reply',(event, arg) => {
      callback(arg)
    })
  },
  getDirectoriesAndFilesRecursive(srcpath,callback){
    (async () => {
      let res = await ipcRenderer.invoke('get-directories-and-files-recursive',srcpath)
      callback(res)
    })();
  },
  deleteFolder(srcpath,callback){
    (async () => {
      await ipcRenderer.invoke('delete-folder',srcpath)
      callback()
    })();
  },
  rename(srcpath,newpath,callback){
    (async () => {
      await ipcRenderer.invoke('rename-file-folder',srcpath,newpath)
      callback()
    })();
  },
  createFolder(srcpath,callback){
    (async () => {
      await ipcRenderer.invoke('create-folder',srcpath)
      callback()
    })();
  },
}
})