import React, { Component } from 'react';

class CodeEditor extends Component {

    state = { }

    shouldComponentUpdate(){
        return false;
    }
    componentDidMount(){
        this.editor = CodeMirror.fromTextArea(this.refs.codee, {
            mode: this.props.mode,
            theme: this.props.editorSettings.theme,
            lineNumbers: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            viewportMargin:5,
            autoRefresh:true,
            extraKeys:{
                "Ctrl-Space": "autocomplete",
                "Shift-Ctrl-O": cm => CodeMirror.commands.foldAll(cm),
                "Shift-Ctrl-I": cm => CodeMirror.commands.unfoldAll(cm),
                "Ctrl-I": cm => cm.execCommand("indentAuto"),
                "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }
            }
        });
          
        this.editor.on('change',(cMirror)=>{
            this.props.textChange(cMirror.getValue())
        });
        this.editor.on('keypress',(cMirror,e)=>{
            if(e.ctrlKey && e.code == "KeyS"){
               this.props.saveSelectedFile()
            }
        });
    }

    setMode=(mode)=>{
        this.editor.setOption("mode", mode);
    }
    setTheme=(value)=>{
        this.editor.setOption("theme", value);
    }
    execCommand=(value)=>{
        this.editor.execCommand(value);
    }
    
    render() { 
        return ( 
            <textarea id={this.props.Id} ref="codee" className="code-editor">
                {this.props.text}
            </textarea> 
        );
    }
}
 
export default CodeEditor;