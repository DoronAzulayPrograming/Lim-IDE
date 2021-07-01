import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Tree extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="d-tree">
                <ul className="d-flex d-tree-container flex-column">
                    {this.props.data.map(tree => <TreeNode 
                                                    renameNode = {this.props.renameNode}
                                                    setSelectedPath={this.props.setSelectedPath} 
                                                    selectedPath={this.props.selectedPath} 
                                                    deleteTreeNode={this.props.deleteTreeNode} 
                                                    fileClick={this.props.fileClick} 
                                                    key={tree.id} 
                                                    node={tree} 
                                                />)}
                </ul>
            </div>
         );
    }
}

class TreeNode extends Component {
    state = { 
        hasChild : this.props.node.children.length > 0,
        childVisible : false,
        mouseHover : false,
        editMode: this.props.node.editMode ? this.props.node.editMode : false,
        editName:this.props.node.label
    }

    hasChildren=()=>{
        return this.props.node.children.length > 0
    }

    setMouseHover=(value)=>{
        this.setState({mouseHover:value})
    }
    setChildVisiblity=(value)=>{
        this.setState({childVisible:value})
    }
    fileClick =(e,file_path)=>{
        e.preventDefault()
        e.stopPropagation();  //  <------ Here is the magic
        this.setChildVisiblity(!this.state.childVisible)
        
        if(!this.hasChildren() && this.props.node.isFile){
            this.props.fileClick(file_path)
            let arr = file_path.split("\\")
            
            this.props.setSelectedPath(file_path.replace("\\"+arr[arr.length-1],""))
        }else{
            this.props.setSelectedPath(this.props.node.path)
        }
        this.forceUpdate()
    }

    deleteNode=(node)=>{
        let msg = "Do you really want to delete the "
        if(node.isFile) msg += "file '"
        else msg += "folder '"
        
        electron.shellApi.showDeleteMessageBox(msg+node.label+"' ?",(res)=>{
            if(!res) return
            this.props.deleteTreeNode(node)
        })
    }


    handleChange=(e)=> {
        this.setState({editName: e.target.value});
    }

    updateNode=()=>{
        let path = this.props.node.path
        let arr = path.split("\\")
        
        this.props.renameNode(path,path.replace(arr[arr.length-1],this.state.editName),()=>{
            this.setState({editMode:false})
        })
    }

    handleKeyPress=(e)=>{
        // Number 13 is the "Enter" key on the keyboard
        if (e.charCode === 13) {
            // Cancel the default action, if needed
            e.preventDefault();
            this.updateNode()
        }
    }

    randerNodeHeaderByMode(){

        if(this.state.editMode){
            return (
                <React.Fragment>
                    <div className={'d-tree-head ' + (this.props.node.path === this.props.selectedPath ? "active":"")} onClick={e=> this.fileClick(e,this.props.node.path)}>
                        <div className={'me-1 '+this.props.node.icon}></div>
                        <input type="text" value={this.state.editName} onChange={this.handleChange} autoFocus onKeyPress={this.handleKeyPress} />
                    </div>
                    <div className={'ps-2 node-options ' + ( this.state.mouseHover ? "node-options-hover":"")}>
                        <i className="pe-2 fas fa-check" onClick={this.updateNode}></i>
                        <i className="pe-2 fas fa-times" onClick={(e)=> this.setState({editMode:false})}></i>
                    </div>
                </React.Fragment>
            )
        }else{
            return (
                <React.Fragment>
                    <div className={'d-tree-head ' + (this.props.node.path === this.props.selectedPath ? "active":"")} onClick={e=> this.fileClick(e,this.props.node.path)}>
                        <div className={'ms-1 me-1 '+this.props.node.icon}></div>
                        {this.props.node.label}
                    </div>
                    <div className={'ps-2 node-options ' + ( this.state.mouseHover ? "node-options-hover":"")}>
                        <i className="pe-2 far fa-edit" onClick={(e)=> this.setState({editMode:true})}></i>
                        <i className="pe-2 far fa-trash-alt" onClick={(e)=>{this.deleteNode(this.props.node)}}></i>
                        <i className="pe-1 fas fa-arrows-alt-v"></i>
                    </div>
                </React.Fragment>
            )
        }
    }

    render() { 
        return ( 
            <li className="d-tree-node border-0 p-0">
            <div className={'d-t-n d-flex p-1 ps-2 '+ ( this.state.childVisible ? "grid-column-3 ":"grid-column-2 ") + ( this.state.mouseHover ? "node-hover":"")} 
            onMouseLeave={e=> this.setMouseHover(false)} 
            onMouseEnter={e=> this.setMouseHover(true)} 
            >
                {
                    this.hasChildren() && (
                        <div className={'me-1 d-inline d-tree-toggler '+ (this.state.childVisible ? "active" : "")}>
                            <FontAwesomeIcon icon={['fas', 'angle-right']}  />
                        </div>
                    )
                }
                {this.randerNodeHeaderByMode()}
            </div>

                {
                    this.hasChildren() && this.state.childVisible && <div className="ps-3 d-tree-content">
                        <ul className="d-flex d-tree-container flex-column p-0">
                            <Tree 
                                renameNode = {this.props.renameNode}
                                setSelectedPath={this.props.setSelectedPath} 
                                selectedPath={this.props.selectedPath} 
                                deleteTreeNode={this.props.deleteTreeNode} 
                                fileClick={this.props.fileClick} 
                                data={this.props.node.children}
                            />
                        </ul>
                    </div>
                }
        </li>
         );
    }
}
 

export default Tree