import React, {Fragment, useEffect} from 'react';
import { Modal } from 'react-bootstrap';
import Table from '../../Component/Table/BootstrapCustomTableStatic'
import {useSelector, useDispatch} from "react-redux";
import Loader from '../../Component/Loader'
import {GetE2PViewAudit} from '../../Actions/Approver'
const ViewAudit = (props) => {
  const { className} = props;
    let _dispatch = useDispatch();

    let {loading,view_aduit} = useSelector(state => ({
        loading : state.view_audit.loading,
        view_aduit : (state.view_audit && state.view_audit.responseList && state.view_audit.responseList.data ) ? state.view_audit.responseList.data : [],
    }));
 
    const _table_header = [
        {name : "Performed By", id:"performedby", width:'131px', key:true},
        {name : "User ID", id:"itl_user_id", width:'134px',},
        {name : "Date Time", id:"itl_trans_date", width:'235px',dataFormat:'date'},
        {name : "Remarks", id:"itl_remarks", width:'130px'},
    ]

    useEffect(() => {
        let _inputReq = { "invoiceIndex": props.invoiceIndex};
    
          _dispatch(GetE2PViewAudit(_inputReq))
       
    }, []);
  return (
    <Fragment>
      {loading ? <Loader /> : ''}
      <Modal show={props.open}  className={className} size={'lg'} >
        {props.header ? <Modal.Header >
            <Modal.Title> {props.title} </Modal.Title>
              {props.Header}
              <button type="button" className="close ml-2 mb-1" onClick={props.closemodel}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
            </Modal.Header> : ''
        }
        <Modal.Body>
          {props.children}
          <Table 
            table_header={_table_header} 
            table_body={(view_aduit) ? view_aduit : [] } 
            select={false} 
            responsive={true} 
          /> 
        </Modal.Body>
        {props.footer ? <Modal.Footer>{props.footercontent}</Modal.Footer> : '' }
      </Modal>
    </Fragment>
  );
}

export default ViewAudit
