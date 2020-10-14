import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';

const Alert = (props) => {
  return <SweetAlert
    success={(props.status) ? true : false }
    warning={(!props.status) ? true : false}
    failure={props.failure}
    btnSize="sm"
    show={props.show}
    showCancel={props.showCancel}
    cancelBtnText={(props.confimation) ? "No" : "Cancel"}
    cancelBtnBsStyle="danger"
    confirmBtnText={(props.confimation) ? "Yes" : "OK"}
    confirmButtonColor= {'#3085d6'}
    cancelButtonColor = {'#d33'}
    confirmButtonText = {'Ok'}
    onCancel={(props.showCancel) ? props.onCancel : ''}
    onConfirm={(props.confirm) ? props.confirm : ()=>{}}
    // title={(props.title) ? props.title : ''}
    buttons = {true}
    dangerMode = {true}
    >
        {props.message}
    </SweetAlert>
}

export default Alert;
