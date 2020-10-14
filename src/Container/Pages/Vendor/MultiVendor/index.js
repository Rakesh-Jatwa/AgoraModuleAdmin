import React,{useEffect,useState,Fragment} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {GetMultipleVendorDetails} from '../../../../Actions/Approver'
import Loader from '../../../../Component/Loader'
import {ddmmyy, CalcDate} from '../../../../Component/Dates'
import BackButton from '../../../../Component/Buttons/Back'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'

let VendorDetailsPage = (props) => {
    let _dispatch = useDispatch();

    let {vendor_details, loading} = useSelector(state => ({
        vendor_details: (state.multi_vendor_details.responseList) ? state.multi_vendor_details.responseList : [], 
        loading : state.multi_vendor_details.loading,
    }));
   
    useEffect(() => {
        console.log('VendorDetailsPage', props.location)
        if(props.location && props.location.datas && props.location.datas.PRM_PR_NO){
            let _details = props.location.datas.PRM_PR_NO
            let _inputReq = { "PRM_PR_NO":_details };
            _dispatch(GetMultipleVendorDetails(_inputReq))
        } 
    }, []);

    let get_vendor = (details) => {
        var data = { "v_com_id": details.CM_COY_ID}
        props.history.push({
            pathname : '/vendorDetailsPage',
            datas : data,
        })
    }

    let  _table_data_header = [
        {name : "Company Name", id:"CM_COY_NAME", width:'100px', key:true, formatter: (cellContent, row) => {
                return <button type="button" className="btn btn-outline-primary" onClick={()=>get_vendor(row)}>{row.CM_COY_NAME}</button>
            },
        },
        {name : "Contact Details", id:"SSTTaxCode", width:'170px', 
            formatter: (cellContent, row) => {
                return (row.CM_ADDR_LINE1) ?  <div style={{whiteSpace: 'break-spaces'}}>
                        {(row.CM_ADDR_LINE1) ? (row.CM_ADDR_LINE1  +" \n") : ''}
                        {(row.CM_ADDR_LINE2) ? (row.CM_ADDR_LINE2  +" \n") : ''} 
                        {(row.CM_ADDR_LINE3) ? (row.CM_ADDR_LINE3  +" \n") : ''} 
                        {(row.CM_CITY) ? (row.CM_CITY  +" \n") : ''} 
                        {(row.STATE) ? (row.STATE  +" \n") : ''} 
                        {(row.COUNTRY) ? (row.COUNTRY  +" \n") : ''} 
                        {(row.CM_EMAIL) ? (row.CM_EMAIL  +" \n") : ''} 
                        {(row.CM_PHONE) ? (row.CM_PHONE  +" \n") : ''} 
                </div> : ''
            },
        },
    ];

  

   
    return <Fragment>
         {(loading) ? <Loader /> : '' }
        <div className="container-fluid">
            <div className="d-flex bg-info text-white p-1 mt-2 mb-2"><strong>Vendor Detail</strong></div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>PR Number </label></div>
                <div className="col"><p>{(props.location && props.location.datas && props.location.datas.PRM_PR_NO) ? props.location.datas.PRM_PR_NO : ''}</p></div>
            </div>
            <BootstrapCustomTable
                table_header={_table_data_header} 
                table_body={(vendor_details && vendor_details.length) ? vendor_details : []} 
                select={false} 
            />
           
            <div className="row mt-2">
                <BackButton back_data={(props.location  && props.location.redirect_to_page) ? true : false}  {...props.location} goBack={props.history} history={props.history}/>
            </div>
        </div>
        </Fragment>
    
}   


  
  

export default VendorDetailsPage;
