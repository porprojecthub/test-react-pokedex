import React from 'react';
import './status.style.css'

class Status extends React.Component {


    render() {

        let value = this.props.value;
        let type = this.props.type;
        let styleParam = {}
        if(type === 'weak'){

            if(parseInt(value) === 0){
                styleParam['--status-param'] = '100%'
              }else{
                 styleParam['--status-param'] = '0%'
              }

        }else{
            if(value && value !== undefined){
                styleParam['--status-param'] = `${value}%`
              }else{
                styleParam['--status-param'] = '0%'
              }
        }

        return (
        <div className="status">
        <div id="progress" style={styleParam}></div>
        </div>
        )
    }
}    

export default Status;