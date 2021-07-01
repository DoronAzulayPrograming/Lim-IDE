import React, { Component } from 'react';
import CodeEditor from './CodeEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Editors extends Component {

    state = {
        editors : []
    }

    constructor(props){
        super(props)
    }

    initEditors=()=>{
        
        this.state.editors = this.props.tabs.map(t=> {
            return {name:t.path, codeEditor:React.createRef()}
        })
    }

    setMode=(tab,mode)=>{
        let editorWrapper = this.state.editors.find(e=>e.name === tab.path)
        if(!editorWrapper.codeEditor) return
        if(!editorWrapper.codeEditor.current) return
        editorWrapper.codeEditor.current.setMode(mode)
    }
    setModeAll=(mode)=>{
        this.state.editors.forEach(e=> {
            if(!e.codeEditor) return
            if(!e.codeEditor.current) return
            e.codeEditor.current.setMode(mode)
        })
    }
    setTheme=(tab,value)=>{
        let editorWrapper = this.state.editors.find(e=>e.name === tab.path)
        if(!editorWrapper.codeEditor) return
        if(!editorWrapper.codeEditor.current) return
        editorWrapper.codeEditor.current.setTheme(value)
    }
    setThemeAll=(value)=>{
        this.state.editors.forEach(e=> {
            if(!e.codeEditor) return
            if(!e.codeEditor.current) return
            e.codeEditor.current.setTheme(value)
        })
    }
    execCommand=(tab,value)=>{
        let editorWrapper = this.state.editors.find(e=>e.name === tab.path)
        if(!editorWrapper.codeEditor) return
        if(!editorWrapper.codeEditor.current) return
        editorWrapper.codeEditor.current.execCommand(value)
    }

    renderTabs(){
     if(this.props.tabs.length === 0)  return <div className="main-logo">
       <i className="fab fa-affiliatetheme"></i>
     </div>

    this.initEditors()
    
     return ( 
        <div className="editors ">
            <div className="tabs-wrapper">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {this.props.tabs.map(tab=>
                        <li key={tab.path} className="nav-item" role="presentation" onClick={()=> { this.props.itemClick(tab); }}>
                            <div onMouseUp={e=>{ if(e.button === 1) this.props.onTabRemoved(tab)}} className={tab.path === this.props.selectedTab.path ? "nav-link active": "nav-link"} id={tab.name.replace(".","-")+"-tab"} data-bs-toggle="tab" data-bs-target={"#"+tab.name.replace(".","-")} type="button" role="tab" aria-controls={tab.name.replace(".","-")} aria-selected="true">
                                {tab.name}
                                <span className="tab-options">
                                    {tab.shouldSave ? <i className="fas fa-circle"></i> : '' }
                                    <button onMouseUp={(e)=>{this.props.onTabRemoved(tab)}}>
                                        <FontAwesomeIcon className="icon" icon={['fas', 'times']}  />
                                    </button>
                                </span>
                            </div>
                        </li>
                    )}
                </ul>
            </div> 
            <div className="tab-content h-100" id="myTabContent">
                {this.props.tabs.map(tab=>
                    <div key={tab.path} className={'tab-pane h-100 '+ (tab.path === this.props.selectedTab.path ? "active": "fade")} id={tab.name.replace(".","-")} role="tabpanel" aria-labelledby={tab.name.replace(".","-")+"-tab"}>
                    <CodeEditor ref={this.state.editors.find(e=>e.name === tab.path).codeEditor}
                        editorSettings = {this.props.editorSettings}
                        textChange={(text)=>this.props.textChange(tab,text)}
                        text={tab.text}
                        mode={tab.mode}
                        saveSelectedFile = {this.props.saveSelectedFile}
                    />
                </div>  
                )}
            </div>
        </div>
     )
    }

    render() { 
        return (
            <React.Fragment>
                {this.renderTabs()}
            </React.Fragment>
         );
    }
}
 
export default Editors;