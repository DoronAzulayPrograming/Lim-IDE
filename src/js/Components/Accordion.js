import React, { Component } from 'react';
class Accordion extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="lim-accordion accordion" id={this.props.id}>
                {this.props.children} 
            </div>
         );
    }
}

export class AccordionItem extends Component {
    state = {  }

    render() { 
        return ( 
            <div className="accordion-item">
                <h2 className="accordion-header" id={"panelsStayOpen-heading-"+this.props.buttonText.replace(" ","-")}>
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={(this.props.enable !== false ? "#panelsStayOpen-collapse-"+this.props.buttonText.replace(" ","-") : "")} aria-expanded="true" aria-controls={"panelsStayOpen-collapse-"+this.props.buttonText.replace(" ","-")}>
                        {this.props.buttonText}
                    </button>
                </h2>
                <div id={"panelsStayOpen-collapse-"+this.props.buttonText.replace(" ","-")} ref={this._panel}  className="accordion-collapse collapse show" aria-labelledby={"panelsStayOpen-heading-"+this.props.buttonText.replace(" ","-")}>
                    <div className="accordion-body">
                        {this.props.children}
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Accordion;