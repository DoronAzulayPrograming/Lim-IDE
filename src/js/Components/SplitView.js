import React, { Component } from 'react';

class SplitView extends Component {
    state = { 
        dragY : 0,
        defaultSize: 0,
        dragging: false,
        height: this.props.height ? this.props.height : "100%"
     }

    constructor(props){
        super(props)
        this._wrapper = React.createRef()
        this._block = React.createRef()
    }
    componentDidMount(){
        this.setState({defaultSize:this._block.current.offsetHeight,height:this.state.height})
    }

    getMinHeight(){
        return  this.props.minSize != undefined ?  this.props.minSize : 0
    }
    getMaxHeight(){
        return  this.props.maxSize != undefined ?  this.props.maxSize : 100
    }

    mouseMove=(e)=>{
        if(!this.state.dragging) return

        let defaultSize = this.state.defaultSize + e.clientY - this.state.dragY
        let height = 100 * defaultSize / this._wrapper.current.offsetHeight

        if(!(height > this.getMinHeight() && height < this.getMaxHeight())) return
        this.setState({dragY:e.clientY,defaultSize:defaultSize,height:height+"%"})
    }
    mouseDown=(e)=>{
        this.setState({dragY:e.clientY,defaultSize:this._block.current.offsetHeight,dragging:true})
        document.addEventListener("mousemove",this.mouseMove,true)
        document.addEventListener("mouseup",this.mouseUp,true)

    }
    mouseUp=(e)=>{
        this.setState({dragging:false}) 

        document.removeEventListener("mousemove",this.mouseMove,true)
        document.removeEventListener("mouseup",this.mouseUp,true)
    }

    setSize = (value) => {
        this._block.current.style.height = value
        this.setState({defaultSize:this._block.current.offsetHeight,height:value})
    }

    render() { 
        return ( 
            <div className="split-view" 
                ref={this._wrapper}>

                <div ref={this._block}
                    style={{height:this.state.height}} 
                    className="block block-1"
                    onMouseMove={ e=> this.mouseMove(e) }> 
                
                    { this.props.children && this.props.children[0] }
                </div>
                <div className="slider" 
                    onMouseDown={ e => this.mouseDown(e) }/>

                <div className="block block-2"
                    onMouseMove={ e=> this.mouseMove(e) }>
                    {this.props.children && this.props.children[1]}
                </div>
            </div>
        );
    }
}
 
export default SplitView;