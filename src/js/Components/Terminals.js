import React, { Component } from 'react';
import Cmd from './Cmd';

class Terminals extends Component {
    state = { 
        isOpen : false
    }

    render() { 
        return ( 
            <div className="terminals-wrapper">
                <div className="tab-content terminals-panels p-2" id="v-pills-tabContent">
                    {this.props.list.map( i => 
                        <div key={i} className={"tab-pane h-100 fade show " + (i === this.props.selected ? "active" : "" ) } id={"v-pills-"+i} role="tabpanel" aria-labelledby={"v-pills-"+i+"-tab"}>
                            <Cmd name={i} />
                        </div>)
                    }
                </div>
                <div className="terminals-tabs-wrapper">
                    <div className="tarminals-tools p-1">
                        <div>
                            <button className="btn btn-sm" onClick={this.props.add}>
                                <i className="fas fa-plus fa-xs"></i>
                            </button>
                            { !this.state.isOpen && 
                                    <button className="btn btn-sm" onClick={e => {this.props.setHeight("0%"); this.setState({isOpen:true})}}>
                                        <i className="fas fa-chevron-up fa-xs"></i>
                                    </button>
                             }
                             
                            { this.state.isOpen && 
                                    <button className="btn btn-sm" onClick={e => {this.props.setHeight("70%"); this.setState({isOpen:false})}}>
                                        <i className="fas fa-chevron-down fa-xs"></i>
                                    </button>
                             }
                        </div>
                        <div>
                            <button className="btn btn-sm" onClick={e => this.props.setHeight("100%")}>
                                <i className="fas fa-times fa-xs"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div style={{overflow:"auto"}}>
                        <div className="nav flex-column nav-pills terminals-tabs " id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            
                            { this.props.list.map( i => 
                                <button onClick={ e=> this.props.setSelected(i) } key={i} className={"nav-link " + (i === this.props.selected ? "active" : "" ) } id={"v-pills-" + i + "-tab"} data-bs-toggle="pill" data-bs-target={"#v-pills-"+i} type="button" role="tab" aria-controls={"v-pills-"+i} aria-selected={ (i === this.props.selected ? "true" : "false" ) }>
                                    <span className="pe-2"><i className="fas fa-terminal fa-xs"></i></span>
                                    {i}
                                    <span className="ps-4 pe-1 tarminal-exit-btn"
                                        onMouseUp={ e=> this.props.remove(i) }
                                    ><i className="fas fa-times fa-xs"></i></span>
                                </button>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Terminals;