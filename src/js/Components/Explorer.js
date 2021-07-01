import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tree from "./Tree"

class Explorer extends Component {
     getFolderName=()=>{
        let arr = this.props.selectedFolder.split("\\")
        return arr[arr.length-1]
     }
   
    render() { 
        return (  
            <div className="explorer">
                <div className="folder">
                    <div className="folder-options">
                            <button className="btn-icon">
                                <div className="two-icon-overlaps" onClick={e=>{if(this.props.selectedPath) this.props.createFile()}}>
                                    <i className="far fa-sticky-note"></i>
                                    <i className="fas fa-plus"></i>
                                </div>
                            </button>
                            <button className="btn-icon">
                                <div className="two-icon-overlaps" onClick={e=>{if(this.props.selectedPath) this.props.createFolder()}}>
                                    <i className="far fa-folder"></i>
                                    <i className="fas fa-plus"></i>
                                </div>
                            </button>
                            <button className="btn-icon me-1" onClick={e=> this.props.onSelectedFolder(this.props.selectedFolder)}>
                                <FontAwesomeIcon className="icon" icon={['fas', 'sync-alt']} size="lg" />
                            </button>
                            <button id="change-folder" onClick={()=>{
                                electron.directoriesApi.searchDirectory((folerPath)=>{
                                    this.props.onSelectedFolder(folerPath)
                                })
                            }}>Change</button>
                    </div>
                    <div className="folder-title">
                        <div id="folder-name" className={(this.props.selectedFolder === this.props.selectedPath ? "active" : "")} onClick={ e=> this.props.setSelectedPath(this.props.selectedFolder)}>{this.getFolderName()}</div>
                    </div>
                    <div className="folder-files">
                        <Tree 
                            renameNode = {this.props.renameNode}
                            setSelectedPath={this.props.setSelectedPath} 
                            selectedPath={this.props.selectedPath} 
                            deleteTreeNode={this.props.deleteTreeNode} 
                            fileClick={this.props.fileClick} 
                            data={this.props.folderNode.children}
                        />
                    </div>
                </div>
            </div> 
            );
    }
}
 
export default Explorer;