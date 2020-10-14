import React, { useState, Fragment } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ModalExample = (props) => {
  const {
    className
  } = props;


  return (
    <div>
      <Modal show={props.open}  className={className} size={props.size ? props.size:'lg'} >
        {props.header ? <Modal.Header >
            <Modal.Title> {props.title}</Modal.Title>
             {(props.sub_title) ? <Fragment><br></br><p>{props.sub_title}</p></Fragment> : ''}
              {props.Header}
              <button type="button" className="close ml-2 mb-1" onClick={props.closemodel}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
            </Modal.Header> : ''
        }
        <Modal.Body>
          {props.children}
        </Modal.Body>
        {props.footer ? <Modal.Footer>{props.footercontent}</Modal.Footer> : '' }
      </Modal>
    </div>
  );
}

export default ModalExample;