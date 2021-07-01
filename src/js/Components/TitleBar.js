import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Menu from './Menu'

class TitleBar extends Component {
    render() { 
        return ( 
            <div className="titlebar">
                <div className="window-title"> <div className="lim-file"></div> </div>
                <Menu
                    editorSettingsChange = {this.props.editorSettingsChange}
                    editorSettings = {this.props.editorSettings}
                    setCodeMirrorTheme = {this.props.setCodeMirrorTheme}
                    codeMirrorExeCommand = {this.props.codeMirrorExeCommand}
                    add = {this.props.add}
                    hideTerminalView = {this.props.hideTerminalView}
                    showTerminalView = {this.props.showTerminalView}
                    saveSelectedFile = {this.props.saveSelectedFile}
                    newFileEvent={this.props.newFileEvent}
                    onSelectedFolder = {(path)=> {this.props.onSelectedFolder(path)}}
                />
                <div className="dragZone"></div>
                <div className="window-controls">
                    <button id="minimaize" onClick={electron.appRemoteApi.minimizeWindow}>
                    <FontAwesomeIcon className="icon" icon={['far', 'window-minimize']} />
                    </button>
                    <button id="maximaize" onClick={electron.appRemoteApi.maximizeWindow}>
                    <FontAwesomeIcon className="icon" icon={['far', 'square']}  />
                    </button>
                    <button id="exit" onClick={electron.appRemoteApi.closeWindow}>
                    <FontAwesomeIcon className="icon" icon={['fas', 'times']}  />
                    </button>
                </div>
            </div>
         );
    }
}
 
export default TitleBar;