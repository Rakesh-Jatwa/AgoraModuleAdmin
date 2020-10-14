import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';

const Alert = (props) => {
  return <SweetAlert 
    success={(props.status) ? true : false }  
    warning={(!props.status) ? true : false} 
    failure={props.failure} 
    btnSize="sm"
    show={props.show}
    showCancel={true}
    cancelBtnText="No"
    cancelBtnBsStyle="danger"
    confirmBtnText={'Yes'}
    confirmButtonColor= {'#3085d6'}
    cancelButtonColor = {'#d33'}
    confirmButtonText = {'Yes'}
    onConfirm={props.onConfirm}
    onCancel={props.onCancel}
    title={(props.title) ? props.title : ''} 
    buttons = {true}
    dangerMode = {true}
    > 
        {props.message}
    </SweetAlert>
}

export default Alert;