import React, { Component } from 'react';

class Menu extends Component {

    handleChange=(e)=>{
        this.props.editorSettingsChange({fontSize:e.target.value,theme:this.props.editorSettings.theme}) 
    }

    openDir=()=>{
        electron.directoriesApi.searchDirectory((folerPath)=>{
            this.props.onSelectedFolder(folerPath)
        })
    }
    render() { 
        return ( 
            <div className="window-menu">
                <div className="dropdown">
                    <button className="btn btn-secondary btn-sm rounded-0" type="button" id="dropdownFileMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        File
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownFileMenuButton" style={{maxWidth:'10rem'}}>
                        <li><a className="dropdown-item" href="#" onClick={this.props.newFileEvent}>New</a></li>
                        <li><a className="dropdown-item" href="#" onClick={this.openDir}>Open </a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><a className="dropdown-item" href="#" onClick={this.props.saveSelectedFile}>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Save</div>
                                <div className="col-sm-6 p-0">Ctrl+S</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#">Save as</a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><a className="dropdown-item" href="#" onClick={electron.appRemoteApi.closeWindow}>Exit</a></li>
                    </ul>
                </div>
                <div className="dropdown ms-2">
                    <button className="btn btn-secondary btn-sm rounded-0" type="button" id="dropdownTerminalMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        Terminal
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownTerminalMenuButton" style={{maxWidth:'10rem'}}>
                        <li>
                            <a className="dropdown-item" href="#" onClick={this.props.add}>
                                <span className="pe-2"><i className="fas fa-plus"></i></span>
                                New
                            </a>
                        </li>
                        <li><hr className="dropdown-divider"/></li>
                        <li>
                            <a className="dropdown-item" href="#" onClick={this.props.hideTerminalView}>
                                <span className="pe-2"><i className="fas fa-times"></i></span>
                                Hide
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#" onClick={this.props.showTerminalView}>
                                <span className="pe-2"><i className="fas fa-terminal"></i></span>
                                Show
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="dropdown ms-2">
                    <button className="btn btn-secondary btn-sm rounded-0" type="button" id="dropdownSelectionMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        Selection
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownSelectionMenuButton" style={{width:'14rem'}}>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("selectAll") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">SelectAll</div>
                                <div className="col-sm-6 p-0">Ctrl+A</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("foldAll") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Fold All</div>
                                <div className="col-sm-6 p-0">Shift+Ctrl+O</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("unfoldAll") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Unfold All</div>
                                <div className="col-sm-6 p-0">Shift+Ctrl+I</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("indentAuto") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Indent Select</div>
                                <div className="col-sm-6 p-0">Ctrl+I</div>
                            </div>    
                        </a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("undo") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Undo</div>
                                <div className="col-sm-6 p-0">Ctrl+Z</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("redo") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Redo</div>
                                <div className="col-sm-6 p-0">Ctrl+Y</div>
                            </div>    
                        </a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("find") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Find</div>
                                <div className="col-sm-6 p-0">Ctrl+F</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("replace") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Replace</div>
                                <div className="col-sm-6 p-0">Shift+Ctrl+F</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("replaceAll") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Replace all</div>
                                <div className="col-sm-6 p-0">Shift+Ctrl+R</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("findNext") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Find Next</div>
                                <div className="col-sm-6 p-0">Ctrl+G</div>
                            </div>    
                        </a></li>
                        <li><a className="dropdown-item" href="#" onClick={e=>{ this.props.codeMirrorExeCommand("findPrev") } }>
                            <div className="row m-0">
                                <div className="col-sm-6 p-0">Find Prev</div>
                                <div className="col-sm-6 p-0">Shift+Ctrl+G</div>
                            </div>    
                        </a></li>
                    </ul>
                </div>
                <div className="dropdown ms-2">
                    <button className="btn btn-secondary btn-sm rounded-0" type="button" id="dropdownViewMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        Editor
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownViewMenuButton" style={{width:'12rem'}}>
                        <li className="dropdown-item">
                            <label htmlFor="theme">theme</label>    
                            <select id="theme" value={this.props.editorSettings.theme} className="form-select form-select-sm" aria-label="Default select example" 
                                onChange={e=>{ 
                                    this.props.editorSettingsChange({fontSize:this.props.editorSettings.fontSize,theme:e.target.value}) 
                                }}
                            >
                                <option value="default">default</option>
                                <option value="3024-day">3024-day</option>
                                <option value="3024-night">3024-night</option>
                                <option value="abbott">abbott</option>
                                <option value="abcdef">abcdef</option>
                                <option value="ambiance">ambiance</option>
                                <option value="ayu-dark">ayu-dark</option>
                                <option value="ayu-mirage">ayu-mirage</option>
                                <option value="base16-dark">base16-dark</option>
                                <option value="base16-light">base16-light</option>
                                <option value="bespin">bespin</option>
                                <option value="blackboard">blackboard</option>
                                <option value="cobalt">cobalt</option>
                                <option value="colorforth">colorforth</option>
                                <option value="darcula">darcula</option>
                                <option value="duotone-dark">duotone-dark</option>
                                <option value="duotone-light">duotone-light</option>
                                <option value="eclipse">eclipse</option>
                                <option value="elegant">elegant</option>
                                <option value="erlang-dark">erlang-dark</option>
                                <option value="gruvbox-dark">gruvbox-dark</option>
                                <option value="hopscotch">hopscotch</option>
                                <option value="icecoder">icecoder</option>
                                <option value="idea">idea</option>
                                <option value="isotope">isotope</option>
                                <option value="lesser-dark">lesser-dark</option>
                                <option value="liquibyte">liquibyte</option>
                                <option value="lucario">lucario</option>
                                <option value="material">material</option>
                                <option value="material-darker">material-darker</option>
                                <option value="material-palenight">material-palenight</option>
                                <option value="material-ocean">material-ocean</option>
                                <option value="mbo">mbo</option>
                                <option value="mdn-like">mdn-like</option>
                                <option value="midnight">midnight</option>
                                <option value="monokai">monokai</option>
                                <option value="moxer">moxer</option>
                                <option value="neat">neat</option>
                                <option value="neo">neo</option>
                                <option value="night">night</option>
                                <option value="nord">nord</option>
                                <option value="oceanic-next">oceanic-next</option>
                                <option value="panda-syntax">panda-syntax</option>
                                <option value="paraiso-dark">paraiso-dark</option>
                                <option value="paraiso-light">paraiso-light</option>
                                <option value="pastel-on-dark">pastel-on-dark</option>
                                <option value="railscasts">railscasts</option>
                                <option value="rubyblue">rubyblue</option>
                                <option value="seti">seti</option>
                                <option value="shadowfox">shadowfox</option>
                                <option value="solarized dark">solarized dark</option>
                                <option value="solarized light">solarized light</option>
                                <option value="the-matrix">the-matrix</option>
                                <option value="tomorrow-night-bright">tomorrow-night-bright</option>
                                <option value="tomorrow-night-eighties">tomorrow-night-eighties</option>
                                <option value="ttcn">ttcn</option>
                                <option value="twilight">twilight</option>
                                <option value="vibrant-ink">vibrant-ink</option>
                                <option value="xq-dark">xq-dark</option>
                                <option value="xq-light">xq-light</option>
                                <option value="yeti">yeti</option>
                                <option value="yonce">yonce</option>
                                <option value="zenburn">zenburn</option>
                            </select>
                        </li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><a className="dropdown-item" href="#">
                            <label htmlFor="fontSize">Font Size</label>    
                            <input id="fontSize" className="form-control form-control-sm" type="number" 
                                value={ this.props.editorSettings.fontSize} onChange={this.handleChange}
                            />
                        </a></li>
                    </ul>
                </div>
            </div>
         );
    }
}
 
export default Menu;