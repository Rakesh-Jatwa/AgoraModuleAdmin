import React, {Component, Fragment} from 'react';
class TableButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(props) {
        if(this.props.click){
            this.props.get_details({ pathname:'/grnGeneration', datas:props.enumObject})
        }
   }

   render() {
        const {row} = this.props;
        const{enumObject} =this.props;
        return (
            <Fragment>
               
                <button className="btn btn-outline-primary btn-sm" bsStyle="primary" onClick={() => this.handleClick(this.props)}>{row}  {enumObject.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}  <span style={{ color: 'red' }}>{enumObject.POM_URGENT === "1" ? ' U' : ''}</span></button>
              
            </Fragment>
        )
    }
}

export default TableButton