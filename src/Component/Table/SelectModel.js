import React, {Component, Fragment} from 'react';
import Modal from '../Modal'

class SelectModel extends Component {
    constructor(props) {
      super(props);
      this.closemodel = this.closemodel.bind(this)
      this.updateData = this.updateData.bind(this);
     
      this.state = {
        name: props.defaultValue,
        open: true,
        open:true,
      };
    }
   
    updateData() {
      this.props.onUpdate(this.state.name);
    }

    closemodel = () => {
        this.setState({
            open : false
        })
    }
    render() {
    
     
      return (
        <Modal open={this.state.open} header ={true} title ={'Validation Message'} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
           <button type='button' className='btn btn-outline-primary' onClick={ this.updateData }>Save</button>
            <button type='button' className='btn btn-default' onClick={ this.close }>Close</button></Fragment>}
        >
            <select
                  ref='inputRef'
                  className={ ( this.props.editorClass || '') + ' form-control editor edit-text' }
                  style={ { display: 'inline', width: '50%' } }
                  value={ this.state.name }
                  onChange={ e => { this.setState({ name: e.currentTarget.value }); } } />
                  
        </Modal>
       
      );
    }
  }

  export default SelectModel;