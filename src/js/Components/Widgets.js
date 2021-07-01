import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Widgets extends Component {
    state = {  }
    render() { 
        return (
             <div className="widgets">
                 <div className="drawer">
                    {/* <div className="widgets-header">
                        <FontAwesomeIcon className="icon" icon={['fas', 'times']}  />
                    </div> */}

                    <button onClick={()=>{ electron.shellApi.navigateTo("https://stackoverflow.com/") }} id="stackoverflow"></button>
                    <button onClick={()=>{ electron.shellApi.navigateTo("https://getbootstrap.com/") }} id="bootstrap"></button>
                    <button onClick={()=>{ electron.shellApi.navigateTo("https://fontawesome.com/") }} id="fontawesome"></button>
                    <button onClick={()=>{ electron.shellApi.navigateTo("https://github.com/") }} id="github"></button>
                    
                 </div>
             </div> 
             );
    }
}
 
export default Widgets;