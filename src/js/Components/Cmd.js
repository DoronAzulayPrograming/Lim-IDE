import React, { Component } from 'react';

class Cmd extends Component {
    state = { 
        path:"",
        text : "",
        inputText : "",
        commandIndex : -1,
        commands:[],
        firstInit: true
     }

     constructor(props){
         super(props)
         this._input = React.createRef()
     }


    geFirstLineFromText(text){
        let lines = text.split('\n')
        return lines[0]
    }
    removeFirstLineFromText(text){
        let lines = text.split('\n')
        
        return text.replace(lines[0],"")
    }

    getLastLineFromText(text){
        let lines = text.split('\n')
        return lines[lines.length-1]
    }
    removeLastLineFromText(text){
        let lines = text.split('\n')
        
        return text.replace(lines[lines.length-1],"")
    }


    handleChange=(e)=> {
        this.setState({inputText: e.target.value});
    }
    handleKeyPress=(e)=>{
        if (e.charCode === 13) {
            e.preventDefault();
            let commands = [...this.state.commands]
            commands.push(this.state.inputText)
            electron.shellApi.exeCmdCommand(this.props.name,this.state.inputText)
            if(this.state.inputText === "cls")
                this.setState({inputText:"",text:"",commands,commandIndex:this.state.commandIndex+1})
            else
                this.setState({inputText:"",commands,commandIndex:this.state.commandIndex+1})
        }
    }

    handleKeyDown=(e)=>{
        let index;
        if (e.keyCode === 38) {
            e.preventDefault();
            if(this.state.commandIndex === -1) return

            if(this.state.commandIndex-1 < 0) index = 0
            else index = this.state.commandIndex-1


            this.setState({inputText: this.state.commands[index],commandIndex: index})
        }
        else if (e.keyCode === 40){
            e.preventDefault();
            if(this.state.commandIndex === -1) return

            if(this.state.commandIndex+1 > this.state.commands.length-1) index = this.state.commands.length-1
            else index = this.state.commandIndex+1


            this.setState({inputText: this.state.commands[index],commandIndex: index})
        }
    }

    componentDidMount(){
        electron.shellApi.createCmd(this.props.name,(data)=>{ 
            if(this.state.firstInit){
                this.setState({
                    firstInit:false,
                    text:this.state.text+this.removeLastLineFromText(data),
                    path:this.getLastLineFromText(data)
                })
                return
            }else{
                this.setState({
                    text:this.state.text+ this.state.path + ' ' + this.removeLastLineFromText(data),
                    path:this.getLastLineFromText(data)
                })
            }
        })
    }
    componentWillUnmount(){
        electron.shellApi.removeCmd(this.props.name)
    }

    render() { 
        return ( 
            <div className="cmd">
                <pre className="text " >{this.state.text}</pre>
                <div className="user-input">
                    <pre className="path " onClick={e=>{ this._input.current.focus()}}>{this.state.path}</pre>
                    <input ref={this._input} type="text" spellCheck="false" autoFocus 
                        value={this.state.inputText}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        onKeyPress={this.handleKeyPress}
                    />
                </div>
            </div>
         );
    }
}
 
export default Cmd;