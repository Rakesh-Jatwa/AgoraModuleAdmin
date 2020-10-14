import * as Actions from '../Actions';
import {SearchPurchaseReqApproval, PurchaseReqRejectSearch, ViewSinglePr, ApprovePR, RejectPR, HoldPR, DownloadFile, VendorDetails, 
    ConvertPRSearch, ConvertPRListingSearch, QuoteList, QuotationPDFGenerate, RFQListAllWithVendor, RFQPDFGenerate, PoApprovallist,
    ApppoDetails, OutstandingRfq, ViewResponseRFQComSummary, RaiseRFQPageLoad, GetRFQVendorList, E2PApprovalList, E2PApprovalAprovRej,E2PApprovalAprovRejPSD, 
    E2PApprovalGetDetails, E2PViewAudit, ViewPOClick, PreviewDO, E2PGetFinList, PoApprovallistAll, E2PPayFor, E2PPopTaxCode, E2PWithHoldingTax, E2PpendingFYFA, 
    E2PCanApprove, MultipleVendorDetails, VendorDetailMethod} from '../../Apis/Approver';

    const GetSearchPurchaseReqApproval = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.SPRA_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.VIEW_SPR_ACCESS, payload:{loading:true, errMessage:'loading', responseList:{itemDetails:{PR_DETAILS:[]}}}});
        SearchPurchaseReqApproval(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.SPRA_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.SPRA_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.SPRA_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.SPRA_FAILURE, payload:error.message})
        })
    }
}

const GetPurchaseReqRejectSearch = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.PRRS_ACCESS, payload:{loading:true, errMessage:'loading'}});
      
        PurchaseReqRejectSearch(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PRRS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PRRS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PRRS_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PRRS_FAILURE, payload:error.message})
        })
    }
}

const GetViewSinglePr = (values) => {
    
    return (dispatch) => {
        let _details = {
            displayAttachFile : []
        }
        dispatch({ type:Actions.VIEW_SPR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.UPLOAD_ACCESS, payload:{loading:false, errMessage:'loading', responseList:[_details]}});
        dispatch({ type:Actions.UPLOAD_EXTERNAL_ACCESS,payload:{loading:false, errMessage:'loading', responseList:[_details]}});
        ViewSinglePr(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VIEW_SPR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VIEW_SPR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VIEW_SPR_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VIEW_SPR_FAILURE, payload:error.message})
        })
    }
}


const GetApprovePR = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.APR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ApprovePR(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.APR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.APR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.APR_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.APR_FAILURE, payload:error.message})
        })
    }
}


const GetRejectPR = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.APR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        RejectPR(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.APR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.APR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.APR_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.APR_FAILURE, payload:error.message})
        })
    }
}

const GetHoldPR = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.APR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        HoldPR(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.APR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.APR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.APR_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.APR_FAILURE, payload:error.message})
        })
    }
}

const GetDownloadFile = (values) => {
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

const GetvendorDetails = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VENDOR_DETAILS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        VendorDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VENDOR_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VENDOR_DETAILS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VENDOR_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VENDOR_DETAILS_ERROR, payload:error.message})
        })
    }
}


const GetConvertPRSearch = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.APPROVER_PRSEARCH_ACCESS, payload:{loading:true, errMessage:'loading', responseList:[]}});
        ConvertPRSearch(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.APPROVER_PRSEARCH_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.APPROVER_PRSEARCH_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.APPROVER_PRSEARCH_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.APPROVER_PRSEARCH_ERROR, payload:error.message})
        })
    }
}

const GetConvertPRListingSearch = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.CPR_PRSEARCH_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ConvertPRListingSearch(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CPR_PRSEARCH_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CPR_PRSEARCH_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CPR_PRSEARCH_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CPR_PRSEARCH_ERROR, payload:error.message})
        })
    }
}

const GetQuoteList = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.QUOTE_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        QuoteList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.QUOTE_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.QUOTE_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.QUOTE_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.QUOTE_LIST_ERROR, payload:error.message})
        })
    }
},

GetQuotationPDFGenerate = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.QUOTE_PDF_ACCESS, payload:{loading:true, errMessage:'loading'}});
        QuotationPDFGenerate(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({ type:Actions.QUOTE_PDF_SUCCESS,  payload:receiveddata});
            }),
            ((failure)=>{
                dispatch({type:Actions.QUOTE_PDF_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.QUOTE_PDF_ERROR, payload:error.message})
        })
    }
},

GetRFQListAllWithVendor = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VENDOR_RFQ_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        RFQListAllWithVendor(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VENDOR_RFQ_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VENDOR_RFQ_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VENDOR_RFQ_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VENDOR_RFQ_LIST_ERROR, payload:error.message})
        })
    }
},


GetRFQPDFGenerate = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.RFQPDF_ACCESS, payload:{loading:true, errMessage:'loading'}});
        RFQPDFGenerate(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({ type:Actions.RFQPDF_SUCCESS,  payload:receiveddata});
            }),
            ((failure)=>{
                dispatch({type:Actions.RFQPDF_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.RFQPDF_ERROR, payload:error.message})
        })
    }
},

GetPoApprovallist = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.PO_APPROVAL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PoApprovallist(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PO_APPROVAL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PO_APPROVAL_ERROR, payload:receiveddata.errMessage})
                }
              
               
            }),
            ((failure)=>{
                dispatch({type:Actions.PO_APPROVAL_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PO_APPROVAL_ERROR, payload:error.message})
        })
    }
},

GetPoApprovallistAll = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.PO_APPROVAL_ACCESS_ALL, payload:{loading:true, errMessage:'loading'}});
        PoApprovallistAll(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PO_APPROVAL_SUCCESS_ALL,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PO_APPROVAL_ERROR_ALL, payload:receiveddata.errMessage})
                }
              
               
            }),
            ((failure)=>{
                dispatch({type:Actions.PO_APPROVAL_ERROR_ALL, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PO_APPROVAL_ERROR_ALL, payload:error.message})
        })
    }
},



GetApppoDetails = (values) => {
    return (dispatch) => {
        
      
        dispatch({ type:Actions.GET_APPO_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ApppoDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GET_APPO_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GET_APPO_ERROR, payload:receiveddata.errMessage})
                }
              
               
            }),
            ((failure)=>{
                dispatch({type:Actions.GET_APPO_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GET_APPO_ERROR, payload:error.message})
        })
    }
},

GetOutstandingRfq = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GET_OUT_RFQ_ACCESS, payload:{loading:true, errMessage:'loading'}});
        OutstandingRfq(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GET_OUT_RFQ_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GET_OUT_RFQ_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GET_OUT_RFQ_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GET_OUT_RFQ_ERROR, payload:error.message})
        })
    }
},

GetViewResponseRFQComSummary = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GET_OUT_RFQ_SUM_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ViewResponseRFQComSummary(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GET_OUT_RFQ_SUM_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GET_OUT_RFQ_SUM_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GET_OUT_RFQ_SUM_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GET_OUT_RFQ_SUM_ERROR, payload:error.message})
        })
    }
},


GetEmptyViewResponseRFQComSummary  = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GET_OUT_RFQ_SUM_ACCESS, payload:{loading:true, errMessage:'loading', responseList:[]}});
    }
},

GetRaiseRFQPageLoadDetails = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.GET_RRFQ_PAGE_DETAILS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        RaiseRFQPageLoad(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GET_RRFQ_PAGE_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GET_RRFQ_PAGE_DETAILS_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GET_RRFQ_PAGE_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GET_RRFQ_PAGE_DETAILS_ERROR, payload:error.message})
        })
    }
},

GetRFQVendorListDetails = () => {
    return (dispatch) => {
        dispatch({ type:Actions.RFQ_VENDOR_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        GetRFQVendorList().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.RFQ_VENDOR_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.RFQ_VENDOR_LIST_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.RFQ_VENDOR_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.RFQ_VENDOR_LIST_ERROR, payload:error.message})
        })
    }
},

GetE2PApprovalList = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_APPROVAL_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PApprovalList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_APPROVAL_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_APPROVAL_LIST_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_APPROVAL_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_APPROVAL_LIST_ERROR, payload:error.message})
        })
    }
},

GetE2PApprovalAprovRej = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_APPROVAL_REJ_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PApprovalAprovRej(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_APPROVAL_REJ_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_APPROVAL_REJ_LIST_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_APPROVAL_REJ_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_APPROVAL_REJ_LIST_ERROR, payload:error.message})
        })
    }
},

GetE2PApprovalAprovRejPSD = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_APPROVAL_REJ_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PApprovalAprovRejPSD(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_APPROVAL_REJ_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_APPROVAL_REJ_LIST_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_APPROVAL_REJ_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_APPROVAL_REJ_LIST_ERROR, payload:error.message})
        })
    }
},


GetE2PApprovalDetails = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_APPROVAL_DETAILS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PApprovalGetDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_APPROVAL_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_APPROVAL_DETAILS_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_APPROVAL_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_APPROVAL_DETAILS_ERROR, payload:error.message})
        })
    }
},


GetE2PViewAudit = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_AUDIT_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PViewAudit(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_AUDIT_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_AUDIT_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_AUDIT_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_AUDIT_ERROR, payload:error.message})
        })
    }
},

GetViewPOClick = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VIEW_PO_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ViewPOClick(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VIEW_PO_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VIEW_PO_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VIEW_PO_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VIEW_PO_ERROR, payload:error.message})
        })
    }
},



GetPreviewDO = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.PREVIEW_DO_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PreviewDO(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PREVIEW_DO_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PREVIEW_DO_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PREVIEW_DO_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PREVIEW_DO_ERROR, payload:error.message})
        })
    }
},

GetFinList = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_FIN_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PGetFinList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_FIN_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_FIN_LIST_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_FIN_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_FIN_LIST_ERROR, payload:error.message})
        })
    }
},

GetE2PPopTaxCode = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_POP_TAX_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PPopTaxCode(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_POP_TAX_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_POP_TAX_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_POP_TAX_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_POP_TAX_ERROR, payload:error.message})
        })
    }
},

GetE2PWithHoldingTax = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_WITH_TAX_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PWithHoldingTax(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_WITH_TAX_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_WITH_TAX_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_WITH_TAX_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_WITH_TAX_ERROR, payload:error.message})
        })
    }
},

GetE2PPayFor = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_PAY_FOR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PPayFor(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_PAY_FOR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_PAY_FOR_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_PAY_FOR_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_PAY_FOR_ERROR, payload:error.message})
        })
    }
},

GetE2PpendingFYFA = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_PENDING_FYFA_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PpendingFYFA(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_PENDING_FYFA_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_PENDING_FYFA_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_PENDING_FYFA_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_PENDING_FYFA_ERROR, payload:error.message})
        })
    }
},

GetE2PCanApprove = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.E2P_CAN_APPROVE_ACCESS, payload:{loading:true, errMessage:'loading'}});
        E2PCanApprove(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.E2P_CAN_APPROVE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.E2P_CAN_APPROVE_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.E2P_CAN_APPROVE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.E2P_CAN_APPROVE_ERROR, payload:error.message})
        })
    }
},


GetMultipleVendorDetails = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.MULTIPLE_VENDOR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        MultipleVendorDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.MULTIPLE_VENDOR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.MULTIPLE_VENDOR_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.MULTIPLE_VENDOR_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.MULTIPLE_VENDOR_ERROR, payload:error.message})
        })
    }
},


GetVendorDetailMethod = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VENDOR_BILL_DETAILS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        VendorDetailMethod(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VENDOR_BILL_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VENDOR_BILL_DETAILS_ERROR, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VENDOR_BILL_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VENDOR_BILL_DETAILS_ERROR, payload:error.message})
        })
    }
}





export { 
    GetSearchPurchaseReqApproval,
    GetPurchaseReqRejectSearch,
    GetViewSinglePr,
    GetApprovePR,
    GetRejectPR,
    GetHoldPR,
    GetDownloadFile,
    GetvendorDetails,
    GetConvertPRSearch,
    GetConvertPRListingSearch,
    GetQuoteList,
    GetQuotationPDFGenerate,
    GetRFQListAllWithVendor,
    GetRFQPDFGenerate,
    GetPoApprovallist,
    GetApppoDetails,
    GetOutstandingRfq,
    GetViewResponseRFQComSummary,
    GetRaiseRFQPageLoadDetails,
    GetRFQVendorListDetails,
    GetE2PApprovalList,
    GetE2PApprovalAprovRej,
    GetE2PApprovalDetails,
    GetE2PViewAudit,
    GetViewPOClick,
    GetPreviewDO,
    GetFinList,
    GetE2PApprovalAprovRejPSD,
    GetPoApprovallistAll,
    GetE2PPopTaxCode,
    GetE2PWithHoldingTax,
    GetE2PPayFor,
    GetE2PpendingFYFA,
    GetE2PCanApprove,
    GetMultipleVendorDetails,
    GetVendorDetailMethod,
    GetEmptyViewResponseRFQComSummary
};