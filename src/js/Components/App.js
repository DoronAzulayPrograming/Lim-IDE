import React, { Component } from 'react';
import TitleBar from './TitleBar';
import Explorer from './Explorer';
import Editors from './Editors';
import Widgets from './Widgets';
import SplitPane from 'react-split-pane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import SplitView from './SplitView';
import Accordion,{ AccordionItem } from './Accordion';
import Terminals from './Terminals';

class App extends Component {
    state = { 
      editorSettings:{fontSize:17,theme:"ayu-mirage"},
      selectedFolder:"",
      folderNode: {
        id:0,
        parentId:null,
        icon: "fa fa-folder",
        label:"",
        path: "",
        isFile: true,
        children:[]
      } ,
      selectedPath : "",
      selectedTab : {mode:"", name:"", text: "", newText:"", path:"", shouldSave:false },
      tabs:[],
      selectedTerminal: "",
      terminals:[]
     }

    constructor(){
      super()
      this.terminal = React.createRef()
      this._editors = React.createRef()
    }


    // general

    getModeByPath=(name)=>{
      let arr = name.split('.')
      let ex = arr[arr.length-1]
      
      switch(ex){
        case "c" : return "text/x-csrc"
        case "cpp" : return "text/x-c++src"
        case "cs" : return "text/x-csharp"
        case "js" : return "text/typescript-jsx"
        case "jsx" : return "text/typescript-jsx"
        case "css" : return "css"
        case "scss" : return "sass"
        case "html" : return "htmlmixed"
        case "lim" : return "lim"
        case "py" : return "python"
        case "json" : return "json"

        default: return ""
      }

    }
    textChange=(tab,text)=>{
      let tabs = [...this.state.tabs]
      let indexToChange = tabs.findIndex(t=>t.path === tab.path)
      tabs[indexToChange].newText = text
      tabs[indexToChange].shouldSave = tab.text != text
      this.setState(tabs)
    }
    saveSelectedFile=()=>{
      let tabs = [...this.state.tabs]
      let index = tabs.findIndex(t=>t === this.state.selectedTab)
      if(index === -1) return

      electron.filesApi.writeFile(tabs[index].path,tabs[index].newText)
      tabs[index].text = tabs[index].newText
      tabs[index].newText = ""
      tabs[index].shouldSave = false
      this.setState(tabs)
    }

    // tabs

    createTab = () =>{
      let fileName = "Untitle"
      let fileEx = ".txt"
      let index = 1;
      while(this.state.tabs.findIndex(t=>t.name == fileName+fileEx) > -1)fileName = "Untitle-"+(index++) 
      fileName += fileEx
      
      let tabs = this.state.tabs.concat({name:fileName, text:"", path:"", shouldSave:false})
      
      this.setState({tabs})
    }
    removeTab(tab){
      let indexToRemove = this.state.tabs.findIndex(t=>t.path == tab.path)
      let selectedTab = null
      if(indexToRemove > 0) selectedTab = this.state.tabs[indexToRemove-1]
      else if (indexToRemove === 0 && this.state.tabs.length > 1) selectedTab = this.state.tabs[indexToRemove+1]
      
      const tabs = this.state.tabs.filter(t=>t.path !== tab.path)
      if(selectedTab && this.state.selectedTab.path == tab.path){
        this.setState({tabs, selectedTab})
      }
      else {
        this.setState({tabs})
      }
    }
    fileClick=(file_path)=>{
      let arr = file_path.split("\\")
          
      let tab_name = arr[arr.length-1]
      let index = this.state.tabs.findIndex(t=>t.path === file_path)
      if(index > -1){
        this.setState({selectedTab:[...this.state.tabs][index]})
      }else{
        electron.filesApi.readFile(file_path,(file_str)=>{
          let tabs = this.state.tabs.concat({mode:this.getModeByPath(tab_name),name:tab_name,text:file_str,path:file_path,shouldSave:false})
          this.setState({tabs,selectedTab:tabs[tabs.length-1]}) 
        })
       }
    }


    // explorer
    selectFolder=(path)=>{
      if(!path) return
      const selectedFolder = path
      electron.directoriesApi.getDirectoriesAndFilesRecursive(path,(node)=>{
        const folderNode = node
        this.setState({selectedFolder,folderNode,selectedPath:path})
      })
    }
    setSelectedPath=(path)=>{
      this.setState({selectedPath:path})
    }
    createFile = () =>{
      
      electron.filesApi.getFiles(this.state.selectedPath,(args)=>{
        let fileName = "Untitle"
        let fileEx = ".txt"
        let index = 1;
        let files = args;

        while(files.findIndex(f=>f === this.state.selectedPath+"\\"+fileName+fileEx) > -1)fileName = "Untitle-"+(index++) 
        fileName += fileEx
        
        electron.filesApi.createFile(this.state.selectedPath+"\\"+fileName," ",()=>{
          
          this.selectFolder(this.state.selectedFolder)
        })
        
      })

    }
    createFolder = () =>{
      electron.directoriesApi.getDirectories(this.state.selectedPath,(args)=>{
        let fileName = "Untitle-folder"
        let index = 1;
        let files = args;

        while(files.findIndex(f=>f == this.state.selectedPath+"\\"+fileName) > -1)fileName = "Untitle-folder-"+(index++) 
        electron.directoriesApi.createFolder(this.state.selectedPath+"\\"+fileName,()=>{
          
          this.selectFolder(this.state.selectedFolder)
        })

      })

    }
    removeNode=(node,id)=>{
      if(!node.isFile){
        let index = node.children.findIndex(n=> n.id === id)
        if(index > -1){
          node.children.splice(index, 1);
        }else{
          node.children = node.children.map(c=> this.removeNode(c,id))
        }
      }

      return node
    }
    deleteTreeNode=(node)=>{
      //let callBack = ()=>{this.setState({folderNode:this.removeNode(this.state.folderNode,node.id)})}
      let callBack = ()=>{this.selectFolder(this.state.selectedFolder)}
      if(node.isFile){
        electron.filesApi.deleteFile(node.path,callBack)
      }else{
        electron.directoriesApi.deleteFolder(node.path,callBack)
      }
    }
    renameNode=(oldpath,newpath,callback)=>{
      electron.directoriesApi.rename(oldpath,newpath,()=>{
        
        let arr = newpath.split("\\")
        let tabs = [...this.state.tabs]
        let index = tabs.findIndex(t=>t.path === oldpath)
        if(index > -1){
          tabs[index].path = newpath
          tabs[index].name = arr[arr.length-1]
          this.setState({tabs:tabs})
          this._editors.current.setMode(tabs[index],this.getModeByPath(arr[arr.length-1]))
        }else{
          tabs = tabs.map(t=>{
            if(t.path.includes(oldpath)){
              let path_arr = t.path.split("\\")
              t.path = newpath + "\\" + path_arr[path_arr.length-1]
            }
          })
        }
        
        callback()

        this.selectFolder(this.state.selectedFolder)
      })
      
    }
    
    // terminals

    showTerminalView=()=>{
      this.terminal.current.setSize("70%")
    }
    hideTerminalView=()=>{
      this.terminal.current.setSize("100%")
    }
    setSplitViewHeight=(value)=>{
      this.terminal.current.setSize(value)
    }
    removeTerminal=(terminal_id)=>{
      let indexToRemove = this.state.terminals.findIndex(t=>t === terminal_id)
      let selectedTerminal = null
      if(indexToRemove > 0) selectedTerminal = this.state.terminals[indexToRemove-1]
      else if (indexToRemove === 0 && this.state.terminals.length > 1) selectedTerminal = this.state.terminals[indexToRemove+1]
      
      const terminals = this.state.terminals.filter(t=>t !== terminal_id)
      if(selectedTerminal && this.state.selectedTerminal === terminal_id){
        this.setState({terminals, selectedTerminal})
      }
      else {
        this.setState({terminals})
      }
    }
    addTerminal=()=>{
      let terminals = [...this.state.terminals]
      let index = (terminals.length > 0 ? terminals.length : 1) 
      while(terminals.findIndex(t=>t === "cmd-"+index) > -1)index++
      terminals.push("cmd-"+index)
      this.setState({terminals:terminals,selectedTerminal:"cmd-"+index})
    }
    selectTerminal=(terminal_id)=>{
      this.setState({selectedTerminal:terminal_id})
    }

    // code editor 
    codeMirrorExeCommand=(command)=>{
      if(!this.state.selectedTab.path) return
      this._editors.current.execCommand(this.state.selectedTab,command)
    }
    setCodeMirrorTheme=(theme)=>{
      if(!this.state.selectedTab.path) return
      this._editors.current.setThemeAll(theme)
    }
    setCodeMirrorFontSize=(value)=>{
      if(!this.state.selectedTab.path) return
      this._editors.current.setFontSizeAll(value)
    }

    editorSettingsChange=(editorSettings)=>{
      this.setCodeMirrorTheme(editorSettings.theme);
      
      let codemirrorStyles = document.getElementById("CodeMirror-Styles")
      codemirrorStyles.textContent =
       codemirrorStyles.textContent.replace("font-size: " + this.state.editorSettings.fontSize + "px","font-size: " + editorSettings.fontSize + "px")
     
      this.setState({editorSettings:editorSettings})
    }
    render() { 
        return (
          <div className="main-wrapper">
            <TitleBar 
              editorSettingsChange = {(editorSettings)=> {this.editorSettingsChange(editorSettings)}}
              editorSettings = {this.state.editorSettings}
              setCodeMirrorTheme = { (theme)=> { this.setCodeMirrorTheme(theme) } }
              codeMirrorExeCommand = { (command)=> { this.codeMirrorExeCommand(command) } }
              add={(e) => {this.addTerminal()}}
              showTerminalView = { this.showTerminalView }
              hideTerminalView = { this.hideTerminalView }
              saveSelectedFile = {this.saveSelectedFile}
              newFileEvent={this.createTab} 
              onSelectedFolder = {(path)=> {this.selectFolder(path)}}
            />

            <div className="lim-main-view">
            <SplitPane 
              split="vertical"
              defaultSize={250} 
              minSize={30}
              >
                <div className="lim-left-wrapper">
                  <Widgets/>
                  <Accordion id={0}>
                      <AccordionItem buttonText="Open Editors" isOpen={true} enable={false}>
                          <div className="files">
                              {this.state.tabs.map(tab=>
                                  <li onMouseUp={e=>{ if(e.button === 1) this.removeTab(tab)}} className={tab.name === this.state.selectedTab.name ? "active": ""} key={tab.path}>
                                      <span onClick={()=>{this.removeTab(tab)}}>
                                          <FontAwesomeIcon className="icon" icon={['fas', 'times']} size="xs"/>
                                      </span>
                                      <div onClick={()=>{this.setState({selectedTab:tab})}}>{tab.name}</div>
                                  </li>    
                              )}
                          </div>
                      </AccordionItem>
                      <AccordionItem buttonText="Explorer" isOpen={true}>
                          <Explorer
                              createFile = {this.createFile}
                              createFolder = {this.createFolder}
                              renameNode = {(oldpath,newpath,callback) => {this.renameNode(oldpath,newpath,callback)}}
                              setSelectedPath={(path)=> {this.setSelectedPath(path)}} 
                              selectedPath={this.state.selectedPath} 
                              deleteTreeNode={(node)=> {this.deleteTreeNode(node)}}
                              fileClick = {(e,file_path)=> {this.fileClick(e,file_path)}}
                              fileDoubleClick = {(file_path)=> {this.fileDoubleClick(file_path)}}
                              folderNode = {this.state.folderNode}
                              selectedFolder = {this.state.selectedFolder}
                              onSelectedFolder = {(path)=> {this.selectFolder(path)}}
                              selectedTab = {this.state.selectedTab}
                              activeFiles={this.state.tabs}
                              onFileRemove={(tab)=>{this.removeTab(tab)}}
                              itemClick = {(tab)=> {
                                this.setState({selectedTab:tab});
                              }}  
                            />
                      </AccordionItem>
                  </Accordion>
                </div>
                
                <div className="lim-right-wrapper">
                  <div className="editors-teminals">
                      <SplitView ref={this.terminal}
                      >
                        <Editors
                          ref={this._editors}
                          editorSettings = {this.state.editorSettings}
                          saveSelectedFile = {this.saveSelectedFile}
                          textChange = {(tab,text)=> this.textChange(tab,text)}
                          selectedTab = {this.state.selectedTab}
                          tabs={this.state.tabs} 
                          onTabRemoved={(tab)=>{this.removeTab(tab)}}
                          itemClick = {(tab)=> {
                            this.setState({selectedTab:tab})
                          }}  
                        />
                        <div className="lim-terminal">
                          <Terminals 
                                selected={this.state.selectedTerminal}
                                list={this.state.terminals}

                                setSelected={(terminal_id)=> this.selectTerminal(terminal_id)}
                                add={(e) => {this.addTerminal()}}
                                remove={(terminal_id) => {this.removeTerminal(terminal_id)}}
                                setHeight={ (value) => {this.setSplitViewHeight(value)}}
                            />
                        </div>
                      </SplitView>
                
                  </div>
                </div>
            </SplitPane>
          </div>  

            <div className="current-code" style={{height:"20.68px"}}>
              <div className="lang">{this.state.selectedTab.mode}</div>
            </div>
          </div>
        );
    }
}
 
export default App;