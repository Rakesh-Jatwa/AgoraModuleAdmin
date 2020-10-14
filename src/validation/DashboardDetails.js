import React, {Component, Fragment} from 'react';
import {GetE2PApprovalDetails} from '../Actions/Approver'
import {UserDetails} from '../Common/LocalStorage'
import {HandleStatus} from '../Actions/Common/Functions'

let get_draft_pr = (cell, row, props) => {
    let _details =  {
        productList:'',
        viewState: 'mod',
        strType: (row.PRM_PR_TYPE === 'CC' || row.PRM_PR_TYPE=='cc') ? 'Contract' : 'Non-Contract',
        prid : row.PR_Number
    };
    localStorage.setItem('pr_details', JSON.stringify(_details))
    props.history.push('/purchaseRequest')
}

let get_draft_e2p = (cell, row, props) => {
    console.log('e2p_req_details', cell, row)
    localStorage.setItem('e2p_req_details',JSON.stringify({
        reload_data : 'true',
        InvIdx : row.IM_INVOICE_INDEX,
        OldDocNo :row.IM_INVOICE_NO,
        from_listing:true
   }))
   props.history.push('/e2p_document')
}

let get_po_my_approval = (details, type, props) => {
   
    if(type=="RfQ_vendor_details"){
        let _user_details = UserDetails()
        let _send_details = { "POM_PO_NO": details.PO_Number, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.SNAMEID}

        props.history.push({
            pathname : '/VendorPOListPop',
            datas : _send_details,
        })
    }
    else{
       
        props.history.push({
            pathname : '/po_approval_detail',
            datas : {
                PO_NO:details.PO_Number,
                index:details.POM_PO_Index
            },
        })
    }
}


let get_po_approval = (details, type, props) => {
    if((!details.PR_NO) && details.STATUS_DESC=="Draft"){
        localStorage.setItem('free_from', JSON.stringify({POM_PO_NO:details.PO_Number,POM_PO_INDEX:details.POM_PO_Index}))
        if( localStorage.getItem('free_from')){
            window.location.reload()
        }
    }
    else if((details.PR_NO) && details.STATUS_DESC=="Draft"){
        localStorage.setItem('po_from', JSON.stringify({POM_PO_NO:details.PO_Number,POM_PO_INDEX:details.POM_PO_Index}))
        if( localStorage.getItem('po_from')){
            props.history.push({
                pathname : 'RaisePO',
                redirect_to_tab:'PurchaseOrder',
                redirect_to_page:'dashboard'
            })
        }
    }
    else{
        let _user_details = UserDetails()
        let _send_details = { "POM_PO_NO": details.PO_Number, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.POM_S_Coy_ID , "PRM_PO_INDEX": details.POM_PO_Index, page_name:"poslisting"}
        props.history.push({
            pathname : '/VendorPOListPop',
            datas : _send_details,
            page_name : 'pos_listing',
        })
    }
}


let get_outstanding_po_approval = (details, type, props) => {
    let _temp_details = Object.assign({}, type)
    let _user_details = UserDetails()
    let _send_details = { "POM_PO_NO": _temp_details.PO_Number, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": _temp_details.POM_S_COY_ID , "PRM_PO_INDEX": _temp_details.POM_PO_Index, page_name:"poslisting"}
    console.log('_send_details', _send_details, type)
    props.history.push({
        pathname : '/VendorPOListPop',
        datas : _send_details,
        page_name : 'pos_listing',
    })
    
}

let view_das_invoice = (type,details, props) => {
    if(details && details.Po_number){
        let _details = details;
        _details.invoiceNo =  _details.Invoice_Number
        _details.vendorId =  _details.IM_S_COY_ID
        _details.FromPage =  'NV'
        _details.displayheader =  false
        props.history.push({
            pathname : '/view_p2p_invoice',
            datas : _details,
            redirect_to_tab : 'PurchaseOrder',
            redirect_to_page : 'dashboard',
        })
    }
    else{
        let _details = details;
        _details.invoiceNo =  _details.Invoice_Number
        _details.vendorId =  _details.IM_S_COY_ID
        _details.IM_INVOICE_NO =  _details.Invoice_Number
        _details.IM_INVOICE_INDEX =  _details.IM_INVOICE_INDEX
        _details.frm = "IPPAO"
        props.history.push({
            pathname : '/view_invoice',
            datas : _details,
            redirect_to_tab : 'PurchaseOrder',
            redirect_to_page : 'dashboard',
        })
    }
    
}


let view_e2p_daft_invoice = (details, props) => {
    localStorage.setItem('e2p_req_details',JSON.stringify({
        reload_data : 'true',
        InvIdx : details.IM_INVOICE_INDEX,
        OldDocNo :details.IM_INVOICE_NO,
        from_listing:true
   }))
   props.history.push({
        pathname : '/e2p_document',
        page_name : 'dashboard',
    })
}


let get_pr_draft_details = (details, cell, props) => {
    let _details =  {
        productList:'',
        viewState: 'mod',
        strType: (cell.PRM_PR_TYPE === 'CC' || cell.PRM_PR_TYPE=='cc') ? 'Contract' : 'Non-Contract',
        prid : cell.PR_Number
    };
    localStorage.setItem('pr_details', JSON.stringify(_details))
    props.history.push({
        pathname : '/purchaseRequest',
        page_name : 'dashboard',
        datas : 'dashboard'
    })
}

let view_incoming_debit = (details, cell, props) => {
    let _details = {
        DNM_DN_NO : cell.DNM_DN_NO,
        DNM_INV_NO : cell.DNM_INV_NO,
        DNM_DN_S_COY_ID : cell.DNM_DN_S_COY_ID,
    }
    props.history.push({
        pathname : '/debit_note',
        page_name : 'dashboard',
        redirect_to_tab :  '/dashboard',
        datas : _details
    })
}


let view_e2p_incoming_debit = (details, cell, props) => {
    props.history.push({
        pathname : '/e2p_document_verify',
        page_name : 'dashboard',
        details : details,
        cell : cell,
        props : props,
    })
}

let view_out_rfq = (details, cell, props) => {

    let _details = {
        rfq_num :  cell.RFQ_Number,
        rfq_id :  cell.RM_RFQ_ID,
        rfq_name : cell.RFQ_Name,
        page_name : 'convert_pr',
        status : 'Draft',
        rerender : false, 
        render : false, 
    }
    localStorage.setItem('rfq_from',JSON.stringify(_details))

    props.history.push({pathname : '/rfq'})
}


let view_do_grn_details = (details, cell, props) => {
    let _details = cell
    _details.POM_PO_INDEX = cell.DOM_PO_INDEX
    props.history.push({
        pathname : 'grnGeneration',
        datas : _details,
    })
}


let get_completed_pr = (cell, row) =>{
    this.props.history.push({
        pathname:"/prViewPage",
        selected_items: '',
        datas: cell,
        redirect_to_tab : 'profile',
        redirect_to_page : 'dashboard',
        type:'listing'
    })
}

let get_invoice = (cell, row) =>{
    console.log('get_invoice', cell, row)
}

let view_pending_convert = (details, cell, props) => {
    props.history.push({
        pathname : '/ConvertPr',
        page_name : 'dashboard',
        datas : {
            PRNo: cell.PR_Number,
            CommodityType: "",
            UIStartDate: "",
            UIEndDate:"",
            PoStatus: "",
            PoNo :"a"
        }
    })
}

let view_po_vendor = (details, cell, props) => {
    cell.view_type='vendor_approve'
    cell.PRM_PO_INDEX = cell.POM_PO_Index
    cell.POM_PO_NO = cell.POM_PO_Index
    props.history.push({
        pathname : '/purchaseorderDetails',
        datas : cell,
    })
}

let view_po_vendor_overdue = (details, cell, props) => {
    cell.view_type='vendor_approve'
    cell.DOM_D_Addr_Code = cell.POD_D_ADDR_CODE
    props.history.push({
        pathname : '/deliveryorderview',
        datas : cell,
    })
}

let view_out_inv_vendor = (details, cell, props) => {
    props.history.push({
        pathname : '/VendorInvoiceViewDetails',
        datas : cell,
    })
}

let view_rfq_vendor = (details, cell, props) => {
    let _details = {
        "RFQ_NO":cell.RFQ_Number,
        "RFQ_ID":cell.RM_RFQ_ID,
        "EDIT":"",
        "RESUBMIT":""
    }
    props.history.push({
        pathname : '/CreateQuotationNew',
        datas : _details,
    })
}

let view_pending_psd_rec_date = (details, cell, props) => {
    props.history.push({
        pathname : '/enter_psd_received_date',
        page_name : 'dashboard',
        details:details,
        cell:cell,
        row:'',
    })
}







const DashbaordDetails = (columns, props, das_datas) => {
    let type="formatter";
    let _data_formate = ''
    if((columns.includes('Date') || columns.includes('ON') || columns.includes('_ON') || columns.includes('DATE') || columns.includes('_DATE'))){
        console.log('DashbaordDetails_1', columns, das_datas)
        _data_formate = "date"
    }
    else if(columns.includes('No')  || columns.includes('NO') || columns.includes('Number')  || columns.includes('number')){
        _data_formate = "button_dashbaord"
        console.log('_data_formate', columns, das_datas)
        if(das_datas=="Outstanding E2P Document"){
            if(columns=="IM_INVOICE_NO"){
                type="link";
                _data_formate = (cellContent, row) => {
                    console.log('Outstanding E2P Document', row)
                    return (
                        row.INVOICE_STATUS_NAME === 'Draft' ? 
                        <button type="button" className="btn btn-sm btn-outline-info" type="button"    onClick={() => get_draft_e2p(cellContent, row, props)} >{row.IM_INVOICE_NO} </button > : 
                        <button className="btn btn-outline-primary btn-sm" size="sm" variant="primary" onClick={() => get_completed_pr(cellContent, row, props)}><span className="row_name">{row.PR_Number}</span> <span className="row_symbol">{row.PRM_URGENT === "1" ? ' U' : ''}</span><span style={{ color: 'orange',fontWeight:900 }}>{row.HasAttachment===true?<i className="fa fa-paperclip" style={{ color: 'brown',fontWeight:900 }} aria-hidden="true"></i>:""}     {row.HAS_ATTACHEMENT===1 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}</span></button >
                    )
                }
            }
        }
        if(das_datas=="PO (Pending My Approval)"){
            if(columns=="PO_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>get_po_my_approval(row, 'PO_Number', props)}>
                                {row.PO_Number} 
                                <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span>
                        </button>
                    )
                }
            }
        }
        if(das_datas=="PO (Pending Approval)"){
            if(columns=="PO_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>get_po_approval(row, 'PO_Number', props)}>
                                {row.PO_Number} 
                                <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span>
                        </button>
                    )
                }
            }
        }
        if(das_datas=="Incoming Delivery Order"){
            if(columns=="DOM_DO_NO"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_do_grn_details(cellContent, row, props)}>{row.DOM_DO_NO} </button>
                    )
                }
            }

            if(columns=="POM_PO_NO"){
                type="text";
            }
        }

        if(das_datas=="Outstanding Purchase Request"){
            if(columns=="PR_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-info" type="button" onClick={()=>get_pr_draft_details(cellContent, row, props)}>
                                {row.PR_Number} 
                                <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span>
                        </button>
                    )
                }
            }
        }

        if(das_datas=="Outstanding Purchase Order"){
            if(columns=="PO_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>get_outstanding_po_approval(cellContent, row, props)}>{row.PO_Number} </button>
                    )
                }
            }
        }

        

        if(das_datas=="Incoming Invoice"){
            if(columns=="Invoice_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_das_invoice(cellContent, row, props)}>{row.Invoice_Number} </button>
                    )
                }
            }
        }

        if(das_datas=="Outstanding E2P Document"){
            if(columns=="IM_INVOICE_NO"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-info" type="button" onClick={()=>view_e2p_daft_invoice(row, props)}>{row.IM_INVOICE_NO} </button>
                    )
                }
            }
        }

        if(das_datas=="Incoming Debit Note" || das_datas=="Incoming Pending Debit Note"){
            if(columns=="DNM_DN_NO"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_incoming_debit(cellContent, row, props)}>{row.DNM_DN_NO} </button>
                    )
                }
            }
        }

        if(das_datas=="E2P Document (Pending My Approval)"){
            if(columns=="IM_INVOICE_NO"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_e2p_incoming_debit(cellContent, row, props)}>{row.IM_INVOICE_NO} </button>
                    )
                }
            }
        }

        if(das_datas=="Outstanding Request For Quotation"){
            if(columns=="RFQ_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_out_rfq(cellContent, row, props)}>{row.RFQ_Number} </button>
                    )
                }
            }

            if(columns=="Status"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return 'Draft, Expired'
                }
            }
        }

        
        if(das_datas=="PR (Pending Conversion)"){
            if(columns=="PR_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_pending_convert(cellContent, row, props)}>{row.PR_Number} </button>
                    )
                }
            }
        }

        if(das_datas=="Purchase Order"){
            if(columns=="PO_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_po_vendor(cellContent, row, props)}>{row.PO_Number} </button>
                    )
                }
            }
        }

        if(das_datas=="Purchase Order (Overdue)"){
            if(columns=="POM_PO_No"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_po_vendor_overdue(cellContent, row, props)}>{row.POM_PO_No} </button>
                    )
                }
            }
        }

        if(das_datas=="Outstanding Invoice"){
            if(columns=="PO_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_out_inv_vendor(cellContent, row, props)}>{row.PO_Number} </button>
                    )
                }
            }
            if(columns=="DO_Number"){
                type="text";
            }

            if(columns=="GRN_Number"){
                type="text";
            }
        }

        if(das_datas=="Outstanding Request For Quotation (Vendor)"){
            if(columns=="RFQ_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_rfq_vendor(cellContent, row, props)}>{row.RFQ_Number} </button>
                    )
                }
            }
        }

        if(das_datas=="Incoming Pending Payment"){
            if(columns=="Invoice_Number"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_das_invoice(cellContent, row, props)}>{row.Invoice_Number} </button>
                    )
                }
            }
          
        }

        if(das_datas=="Pending PSD Receive Date"){
            if(columns=="IM_INVOICE_NO"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_pending_psd_rec_date(cellContent, row, props)}>{row.IM_INVOICE_NO}112 </button>
                    )
                }
            }
          
        }

        if(das_datas=="Pending PSD Receive Date"){
            if(columns=="IM_INVOICE_NO"){
                type="link";
                _data_formate = (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>view_pending_psd_rec_date(cellContent, row, props)}>{row.IM_INVOICE_NO}112 </button>
                    )
                }
            }
          
        }

    }
    else if(columns.includes('Amount') || columns.includes('AMOUNT') || columns.includes('price') || columns.includes('PRICE')){
        _data_formate = "price"
    }

    return{
        type : type,
        formatter : _data_formate
    }
}
export {DashbaordDetails}