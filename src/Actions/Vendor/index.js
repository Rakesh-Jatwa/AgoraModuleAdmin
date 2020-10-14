import * as Actions from '../Actions';
import {PoPendingOrder, PoListing, ViewPOClick, GeneratePOPDF, AcceptReject, DoSearch, ViewDOClick, DoListing, SaveDo, DeleteFile,
    DownloadFile,InvoiceListing, IssueInvoice, ViewInvoiceDetailsVendor, ViewGRNPDF, InvoiceSubmit, VendorRFQOutstanding, NewQuoteDetails, 
    RFQQuotationListing, viewRFQ_PDF, viewRFQ, viewQuotation, VendorRFQOutstandingExp, PoList, viewQuotationPDF, viewRFQPDF, PolineDetails, 
    PoListDetails,CNListing, DNListing, CNDetails, DNDetails, GenerateCRPDF, FillGST, FillTax, ChangePwdPageLoad, PoTrackingList, TransTrackingList} from '../../Apis/Vendor';
const GetPoPendingOrder = (values) => {

    return (dispatch) => {
        dispatch({ type:Actions.POP_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.VPO_ACCESS, payload:{loading:true, errMessage:'loading', responseList:[]}});
        PoPendingOrder(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.POP_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.POP_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.POP_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.POP_FAILURE, payload:error.message})
        })
    }
}

const GetPoListing = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.POL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PoListing(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.POL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.POL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.POL_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.POL_FAILURE, payload:error.message})
        })
    }
}

const GetViewPOClick = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VPO_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ViewPOClick(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VPO_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VPO_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VPO_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VPO_FAILURE, payload:error.message})
        })
    }
}

const GetGeneratePOPDF = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GENERAE_POPDF_ACCESS, payload:{loading:true, errMessage:'loading'}});
        GeneratePOPDF(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({ type:Actions.GENERAE_POPDF_SUCCESS,  payload:receiveddata});
            }),
            ((failure)=>{
                dispatch({type:Actions.GENERAE_POPDF_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GENERAE_POPDF_FAILURE, payload:error.message})
        })
    }
}

const GetGenerateCRPDF = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.CRPDF_ACCESS, payload:{loading:true, errMessage:'loading'}});
        GenerateCRPDF(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({ type:Actions.CRPDF_SUCCESS,  payload:receiveddata});
            }),
            ((failure)=>{
                dispatch({type:Actions.CRPDF_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CRPDF_ERROR, payload:error.message})
        })
    }
}

const GetViewRFQPDF = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GENERAE_RFQPDF_ACCESS, payload:{loading:true, errMessage:'loading'}});
        viewRFQ_PDF(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({ type:Actions.GENERAE_RFQPDF_SUCCESS,  payload:receiveddata});
            }),
            ((failure)=>{
                dispatch({type:Actions.GENERAE_RFQPDF_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GENERAE_RFQPDF_FAILURE, payload:error.message})
        })
    }
}



const GetAcceptReject = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.AR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        AcceptReject(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.AR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.AR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.AR_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.AR_FAILURE, payload:error.message})
        })
    }
}

const GetDoSearch = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GDS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.GVDC_ACCESS, payload:{loading:true, errMessage:'loading',responseList:{poDetailsList:{PO_DETAILS:[]}}}});
        DoSearch(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GDS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GDS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GDS_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GDS_FAILURE, payload:error.message})
        })
    }
}


const GetViewDOClick = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GVDC_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ViewDOClick(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GVDC_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GVDC_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GVDC_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GVDC_FAILURE, payload:error.message})
        })
    }
}

const GetDoListing = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GDL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        DoListing(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GDL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GDL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GDL_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GDL_FAILURE, payload:error.message})
        })
    }
}

const GetSaveDo = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.SDO_ACCESS, payload:{loading:true, errMessage:'loading'}});
        SaveDo(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.SDO_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.SDO_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.SDO_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.SDO_FAILURE, payload:error.message})
        })
    }
}

const GetDownloadFile= (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
        DownloadFile(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: "octet/stream" });
                var fileURL = window.URL.createObjectURL(blob);
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', values.strFile);
                document.body.appendChild(fileLink);
                fileLink.click();
                dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});
               
            }),
            ((failure)=>{
                dispatch({type:Actions.DOWNLOAD_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DOWNLOAD_FAILURE, payload:error.message})
        })
    }
}

const GetClearDownloadFile= (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:{loading:true, errMessage:'loading', responseList:[]}});
    }
}

const GetDeleteFile= (values) => {
    return (dispatch) => {
        let _temp_values = values;
        // if(values.hasOwnProperty('CDA_DOC_NO')){
        //     delete values.CDA_DOC_NO
        // }
        // if(values.hasOwnProperty('AttachType')){
        //     delete values.AttachType
        // }
        dispatch({ type:(values.AttachType=="I") ? Actions.DELETE_ACCESS : Actions.DELETE_EXTERNAL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        DeleteFile(_temp_values).then(
           ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:(values.AttachType=="I") ? Actions.DELETE_SUCCESS : Actions.DELETE_EXTERNAL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:(values.AttachType=="I") ? Actions.DELETE_FAILURE : Actions.DELETE_EXTERNAL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:(values.AttachType=="I") ? Actions.DELETE_FAILURE : Actions.DELETE_EXTERNAL_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:(values.AttachType=="I") ? Actions.DELETE_FAILURE : Actions.DELETE_EXTERNAL_FAILURE, payload:error.message})
        })
    }
}

const GetDeleteFileMain= (values) => {
    return (dispatch) => {
        dispatch({ type:(values.AttachType=="I") ? Actions.DELETE_ACCESS : Actions.DELETE_EXTERNAL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        DeleteFile(values).then(
           ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:(values.AttachType=="I") ? Actions.DELETE_SUCCESS : Actions.DELETE_EXTERNAL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:(values.AttachType=="I") ? Actions.DELETE_FAILURE : Actions.DELETE_EXTERNAL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:(values.AttachType=="I") ? Actions.DELETE_FAILURE : Actions.DELETE_EXTERNAL_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:(values.AttachType=="I") ? Actions.DELETE_FAILURE : Actions.DELETE_EXTERNAL_FAILURE, payload:error.message})
        })
    }
}


const GetIssueInvoice = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.INVISUE_ACCESS, payload:{loading:true, errMessage:'loading'}});
        IssueInvoice(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.INVISUE_SUCCESS,  payload:receiveddata});
                }
                else{
                    
                    dispatch({type:Actions.INVISUE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.INVISUE_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.INVISUE_FAILURE, payload:error.message})
        })
    }
}

const GetInvoiceListing = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.INVILIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        InvoiceListing(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.INVILIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.INVILIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.INVILIST_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.INVILIST_FAILURE, payload:error.message})
        })
    }
}


const GetViewInvoiceDetailsVendor = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VIEWINV_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ViewInvoiceDetailsVendor(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VIEWINV_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VIEWINV_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VIEWINV_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VIEWINV_FAILURE, payload:error.message})
        })
    }
}



const GetViewGRNPDF = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GENERAE_VPO_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ViewGRNPDF(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({ type:Actions.GENERAE_VPO_SUCCESS,  payload:receiveddata});
            }),
            ((failure)=>{
                dispatch({type:Actions.GENERAE_VPO_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GENERAE_VPO_FAILURE, payload:error.message})
        })
    }
}


const GetInvoiceSubmit = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.SUBINV_ACCESS, payload:{loading:true, errMessage:'loading'}});
        InvoiceSubmit(values).then(
            ((receiveddata)=>{
                if(receiveddata.status=="SUCCESS"){
                    dispatch({ type:Actions.SUBINV_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({ type:Actions.SUBINV_FAILURE, payload:receiveddata.errMessage})
                   
                }
              
            }),
            ((failure)=>{
                dispatch({type:Actions.SUBINV_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.SUBINV_FAILURE, payload:error.message})
        })
    }
}


const GetVendorRFQOutstanding = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VEN_RFQ_OUT_ACCESS, payload:{loading:true, errMessage:'loading'}});
        VendorRFQOutstanding(values).then(
            ((receiveddata)=>{
                if(receiveddata.status=="SUCCESS"){
                    dispatch({ type:Actions.VEN_RFQ_OUT_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({ type:Actions.VEN_RFQ_OUT_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VEN_RFQ_OUT_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VEN_RFQ_OUT_FAILURE, payload:error.message})
        })
    }
}



const GetNewQuoteDetails = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.NEW_QUOTE_DETAILS_ACCESS, payload:{loading:true, errMessage:'loading', responseList:[]}});
        NewQuoteDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status=="SUCCESS"){
                    dispatch({ type:Actions.NEW_QUOTE_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({ type:Actions.NEW_QUOTE_DETAILS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.NEW_QUOTE_DETAILS_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.NEW_QUOTE_DETAILS_FAILURE, payload:error.message})
        })
    }
}

const GetRFQQuotationListing = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.RFQ_QUT_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        RFQQuotationListing(values).then(
            ((receiveddata)=>{
                if(receiveddata.status=="SUCCESS"){
                    dispatch({ type:Actions.RFQ_QUT_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({ type:Actions.RFQ_QUT_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.RFQ_QUT_LIST_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.NEW_QUOTE_DETAILS_FAILURE, payload:error.message})
        })
    }
}


const GetviewRFQ = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VIEW_RFQ_ACCESS, payload:{loading:true, errMessage:'loading'}});
        viewRFQ(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VIEW_RFQ_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VIEW_RFQ_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VIEW_RFQ_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VIEW_RFQ_ERROR, payload:error.message})
        })
    }
}

const GetViewQuotation = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VIEW_QUOTATION_ACCESS, payload:{loading:true, errMessage:'loading'}});
        viewQuotation(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VIEW_QUOTATION_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VIEW_QUOTATION_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VIEW_QUOTATION_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VIEW_QUOTATION_ERROR, payload:error.message})
        })
    }
}


const GetVendorRFQOutstandingExp = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VIEW_LIEXP_ACCESS, payload:{loading:true, errMessage:'loading'}});
        VendorRFQOutstandingExp(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VIEW_LIEXP_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VIEW_LIEXP_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VIEW_LIEXP_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VIEW_LIEXP_ERROR, payload:error.message})
        })
    }
}


const GetPoList = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.PO_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PoList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                  
                    if(_temp_values && _temp_values.search_type=="list"){
                        dispatch({ type:Actions.PO_LIST_SUCCESS,  payload:receiveddata});
                    }
                    else  if( _temp_values &&  _temp_values.search_type=="cancel"){
                        dispatch({ type:Actions.PO_LIST_CANCEL_SUCCESS,  payload:receiveddata});
                    }
                    else{
                        dispatch({ type:Actions.PO_LIST_CANCEL_SUCCESS,  payload:receiveddata});
                    }
                }
                else{
                    dispatch({type:Actions.PO_LIST_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PO_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PO_LIST_ERROR, payload:error.message})
        })
    }
}

const GetViewQuotationPDF = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.QPDF_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        viewQuotationPDF(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({ type:Actions.GENERAE_RFQPDF_SUCCESS,  payload:receiveddata});
            }),
            ((failure)=>{
                dispatch({type:Actions.QPDF_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.QPDF_LIST_ERROR, payload:error.message})
        })
    }
}

// const GetViewRFQPDF = (values) => {
//     return (dispatch) => {
//         let _temp_values = values;
//         dispatch({ type:Actions.PFQPDF_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
//         viewRFQPDF(values).then(
//             ((receiveddata)=>{
//                 let blob = new Blob([receiveddata], { type: 'application/pdf' }),
//                 url = window.URL.createObjectURL(blob)
//                 window.open(url)
//                 dispatch({ type:Actions.GENERAE_RFQPDF_SUCCESS,  payload:receiveddata});
//             }),
//             ((failure)=>{
//                 dispatch({type:Actions.PFQPDF_LIST_ERROR, payload:failure.message})
//             }),
//         )
//         .catch((error)=>{
//             dispatch({type:Actions.PFQPDF_LIST_ERROR, payload:error.message})
//         })
//     }
// }



const GetPolineDetails = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.PO_LINE_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PolineDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    
                    dispatch({ type:Actions.PO_LINE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PO_LINE_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PO_LINE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PO_LINE_ERROR, payload:error.message})
        })
    }
}


const GetPoListDetails = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.PO_LINE_DETAILS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PoListDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    
                    dispatch({ type:Actions.PO_LINE_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PO_LINE_DETAILS_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PO_LINE_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PO_LINE_DETAILS_ERROR, payload:error.message})
        })
    }
}

const GetCNListing = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.CN_LISTING_ACCESS, payload:{loading:true, errMessage:'loading'}});
        CNListing(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    
                    dispatch({ type:Actions.CN_LISTING_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CN_LISTING_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CN_LISTING_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CN_LISTING_ERROR, payload:error.message})
        })
    }
}

const GetDNListing = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.DN_LISTING_ACCESS, payload:{loading:true, errMessage:'loading'}});
        DNListing(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.DN_LISTING_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.DN_LISTING_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DN_LISTING_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DN_LISTING_ERROR, payload:error.message})
        })
    }
}

const GetCNDetails = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.CN_DETAILS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        CNDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CN_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CN_DETAILS_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CN_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CN_DETAILS_ERROR, payload:error.message})
        })
    }
}

const GetDNDetails = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.DN_DETAILS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        DNDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.DN_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.DN_DETAILS_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DN_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DN_DETAILS_ERROR, payload:error.message})
        })
    }
}

const GetFillGST = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.FILL_GST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        FillGST(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.FILL_GST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.FILL_GST_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.FILL_GST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.FILL_GST_ERROR, payload:error.message})
        })
    }
}

const GetFillTax = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.FILL_TAX_ACCESS, payload:{loading:true, errMessage:'loading'}});
        FillTax(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.FILL_TAX_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.FILL_TAX_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.FILL_TAX_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.FILL_TAX_ERROR, payload:error.message})
        })
    }
}


const GetPoTrackingList = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.PO_TRACKING_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PoTrackingList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PO_TRACKING_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PO_TRACKING_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PO_TRACKING_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PO_TRACKING_ERROR, payload:error.message})
        })
    }
}

const GetTransTrackingList = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.TRANS_TRACKING_ACCESS, payload:{loading:true, errMessage:'loading'}});
        TransTrackingList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.TRANS_TRACKING_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.TRANS_TRACKING_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.TRANS_TRACKING_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.TRANS_TRACKING_ERROR, payload:error.message})
        })
    }
}




const GetChangePwdPageLoad = (values) => {
    return (dispatch) => {
        let _temp_values = values;
        dispatch({ type:Actions.CHNAGE_PASS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ChangePwdPageLoad(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CHNAGE_PASS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CHNAGE_PASS_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CHNAGE_PASS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CHNAGE_PASS_ERROR, payload:error.message})
        })
    }
}





const GetEmptyCNDN = () => {
    return (dispatch) => {
        dispatch({ type:Actions.DN_DETAILS_ACCESS, payload:{loading:false, responseList:[], errMessage:'loading'}});
        dispatch({ type:Actions.CN_DETAILS_ACCESS, payload:{loading:false, responseList:[], errMessage:'loading'}});
    }
}









export { 
    GetPoPendingOrder,
    GetPoListing,
    GetViewPOClick,
    GetGeneratePOPDF,
    GetAcceptReject,
    GetDoSearch,
    GetViewDOClick,
    GetDoListing,
    GetSaveDo,
    GetDownloadFile,
    GetDeleteFile,
    GetIssueInvoice,
    GetInvoiceListing,
    GetViewInvoiceDetailsVendor,
    GetViewGRNPDF,
    GetInvoiceSubmit,
    GetVendorRFQOutstanding,
    GetNewQuoteDetails,
    GetDeleteFileMain,
    GetRFQQuotationListing,
    GetViewRFQPDF,
    GetviewRFQ,
    GetViewQuotation,
    GetVendorRFQOutstandingExp,
    GetPoList,
    GetViewQuotationPDF,
    GetPolineDetails,
    GetPoListDetails,
    GetCNListing,
    GetDNListing,
    GetCNDetails,
    GetDNDetails,
    GetEmptyCNDN,
    GetGenerateCRPDF,
    GetFillGST,
    GetChangePwdPageLoad,
    GetFillTax,
    GetClearDownloadFile,
    GetPoTrackingList,
    GetTransTrackingList
};