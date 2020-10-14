import React, { useState, Fragment } from 'react';
import { Button, Modal } from 'react-bootstrap';

const AddListModal = (props) => {
  const {
    className
  } = props;

  let inputs = 3

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.heading}
        </Modal.Title>  
      </Modal.Header>

      <Modal.Body>
        <div className="row mt-2">
          <div className="col-12 col-md-6">
            <div className="row mt-2">
              <div className="col-12 col-md-4"><label>List Name : </label></div>
                <div className="col-12 col-md-8">
                  <input name="" type="text" className="form-control" placeholder="" />
                    <div className="text-danger"></div>
                </div>
              </div>
            </div>
        </div>
        <br />
        
        <div className="table-responsive check_table">
                            <table className="table table-striped table-hover table-bordered">
                                <thead className="thead-primary">
                                    <th ><input type="checkbox" /></th>
                                    <th>Vendor</th>
                                </thead>
                                <tbody>
                                    
                                    <tr>
                                        <td className="align-middle"><input type="checkbox" value="1" /></td>
                                        <td className="align-middle">   <input name="" type="text" className="form-control" placeholder="" /> </td>
                                    </tr>

                                    <tr>
                                        <td className="align-middle"><input type="checkbox" value="1" /></td>
                                        <td className="align-middle">   <input name="" type="text" className="form-control" placeholder="" /> </td>
                                    </tr>
                                    <tr>
                                        <td className="align-middle"><input type="checkbox" value="1" /></td>
                                        <td className="align-middle">   <input name="" type="text" className="form-control" placeholder="" /> </td>
                                    </tr>
                                    <tr>
                                        <td className="align-middle"><input type="checkbox" value="1" /></td>
                                        <td className="align-middle">   <input name="" type="text" className="form-control" placeholder="" /> </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className="btn btn-outline-success btn-sm" >Save</button>
        <button type="button" className="btn btn-outline-success btn-sm ml-2">Add line</button>
        <button type="button" className="btn btn-outline-danger btn-sm ml-2">Delete</button>
        <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={props.onHide}>Close</button>

      </Modal.Footer>
    </Modal>
    );
}

export default AddListModal;