import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';

const Alert = (props) => {
  return <SweetAlert 
    success={(props.status) ? true : false }  
    warning={(!props.status) ? true : false} 
    failure={props.failure} 
    btnSize="sm"
    show={props.show}
    onConfirm={(props.confirm) ? props.confirm : ()=>{}}
    onCancel={(props.cancel) ? props.cancel : ()=>{}}
    title={(props.title) ? props.title : ''} > 
        {props.message}
    </SweetAlert>
}

export default Alert;