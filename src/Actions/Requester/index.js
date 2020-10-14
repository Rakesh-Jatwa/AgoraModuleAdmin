import * as Actions from '../Actions';
import {getContractRefNoAndDesc, getCommodityTypeList, getVendorNameListService, searchContractCatalogue, raisePR, UploadFiles, FundTypeOrPersonCodeORProjectCode, FillAddress, DeliveryAddress, CostCentreCode, Segmentation, PurchaseRequestItemsDetails, CatalogueDropdown, BuyerCatlogSearch, SearchPRList, SearchPRCancelList,
    CancelPR, VoidPR, GeneratePRPDF, IssueGRN, GRNListing, SavePurchaseRequest, ViewGRNDetailsClick, GRNSubmit, GenerateDOPDF, ViewInvoiceDetailsClick, RequesterInvoiceSearch, InvoiceSave, InvoiceVerify, InvoiceHeader,  AOList, AppovalList, FinalSubmitPR, ApprovalType, SaveApprovePerson, DocumentDelete, InvoicePDF, 
    FFRaisePOScreen, GetProductDetails, GetPOApprovalList, GetAllPOApprovalList, POApprovalSubmit, FfpoAdditem, VendorList, PreviewGRN, ApppoDetails, RfqAddItemSearch, documentContinue, E2PdocumentList, E2PApprovalDetails,MultiInvoiceTemplate, MultiGLTemplate, DocumentEnquiryList, RequesterInvoicePaid, Dashbaord,CreditNoteAckTrackingList, 
    CreditNoteTrackingList, CNTrackingDetails, DNTrackingDetails, DNTrackingList, GenerateDEBITPDF, GenerateCREDITPDF, InvoiceDetails, CancelledPRListingSearch, CheckBudgetAmount, InvoiceFundTypeList, FillTaxCode, PendingFYFA} from '../../Apis/RequesterServices';
const GetContractRefNoAndDesc = () => {
    return (dispatch) => {
        getContractRefNoAndDesc().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CRND_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CRND_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.AUTH_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.AUTH_FAILURE, payload:error.message})
        })
    }
}


const GetCommodityTypeList = () => {
    return (dispatch) => {
        getCommodityTypeList().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CTL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CTL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CTL_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CTL_ERROR, payload:error.message})
        })
    }
}

const GetVendorNameListService =  () =>{
    return (dispatch) => {
        getVendorNameListService().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VNLS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VNLS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VNLS_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VNLS_ERROR, payload:error.message})
        })
    }
}


const ResetPr = () =>{
    return (dispatch) => {
        dispatch({ type:Actions.IBS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.PRI_ACCESS, payload:{loading:false, errMessage:'loading', responseList:{getPurchaseRequestItemsDetails:[]}}, });
        dispatch({ type:Actions.PRI_ACCESS_POPUP, payload:{loading:false, errMessage:'loading', status:true}});
        dispatch({ type:Actions.GPD_ACCESS, payload:{loading:false, responseList:[], strMsgL:''}});
    }
}

const SearchContractCatalogue = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.IBS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.PRI_ACCESS, payload:{loading:false, errMessage:'loading', responseList:{getPurchaseRequestItemsDetails:[]}}, });
        dispatch({ type:Actions.PRI_ACCESS_POPUP, payload:{loading:false, errMessage:'loading', status:true}});
        dispatch({ type:Actions.GPD_ACCESS, payload:{loading:false, responseList:[], strMsgL:''}});
        searchContractCatalogue(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.IBS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.IBS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.IBS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.IBS_ERROR, payload:error.message})
        })
    }
}

const RaisePR = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.IBS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.PRI_ACCESS, payload:{loading:false, errMessage:'loading', responseList:{getPurchaseRequestItemsDetails:[]}}, });
        dispatch({ type:Actions.PRI_ACCESS_POPUP, payload:{loading:false, errMessage:'loading', status:true}});
        dispatch({ type:Actions.GPD_ACCESS, payload:{loading:false, responseList:[], strMsgL:''}});
        dispatch({ type:Actions.RPR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        raisePR(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.RPR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.RPR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.RPR_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.RPR_ERROR, payload:error.message})
        })
    }
}

const UploadDocuments = (file, datas) =>{
    return (dispatch) => {
        
        if(datas.AttachType=="I"){
            let _details3 = document.querySelectorAll('input[name$="internalAttachment"]');
            if(_details3){
                _details3.forEach((lst,index)=>{
                    _details3[index].value =''
                })
            }
        }
        else if(datas.AttachType=="E"){
            let _details4 = document.querySelectorAll('input[name$="externalAttachment"]');
            if(_details4){
                _details4.forEach((lst,index)=>{
                    _details4[index].value =''
                })
            }
        }
        else {
            let _details1 = document.querySelectorAll('input[name$="internalAttachment"]');
            if(_details1){
                _details1.forEach((lst,index)=>{
                    _details1[index].value =''
                })
            }
            let _details2 = document.querySelectorAll('input[name$="externalAttachment"]');
            if(_details2){
                _details2.forEach((lst,index)=>{
                    _details2[index].value =''
                })
            }
        }

        dispatch({ type:(datas.AttachType=="I") ? Actions.UPLOAD_ACCESS : Actions.UPLOAD_EXTERNAL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        UploadFiles(file, datas).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:(datas.AttachType=="I") ? Actions.UPLOAD_SUCCESS : Actions.UPLOAD_EXTERNAL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:(datas.AttachType=="I") ? Actions.UPLOAD_FAILURE : Actions.UPLOAD_EXTERNAL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:(datas.UPLOAD_ERROR=="I") ? Actions.UPLOAD_ERROR : Actions.UPLOAD_EXTERNAL_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:(datas.UPLOAD_ERROR=="I") ? Actions.UPLOAD_ERROR : Actions.UPLOAD_EXTERNAL_ERROR, payload:error.message})
        })
    }
}

const ClearUploadDocuments = () =>{
    return (dispatch) => {
        dispatch({ type:  Actions.UPLOAD_EXTERNAL_SUCCESS, payload:{loading:true, errMessage:'loading',responseList:[]}});
        dispatch({ type: Actions.UPLOAD_ACCESS, payload:{loading:true, errMessage:'loading',responseList:[]}});
    }
}



const FundTypeOrPersonCodeORProjectCodeAction = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.FTPC_ACCESS, payload:{loading:true, errMessage:'loading'}});
        FundTypeOrPersonCodeORProjectCode(values).then(
            ((receiveddata)=>{
               
                if(values.type=="L1"){
                    dispatch({ type:Actions.FTPC_SUCCESS,  payload:receiveddata});
                    dispatch({ type:Actions.FTPC_SUCCESS_L1,  payload:receiveddata});
                }
                if(values.type=="L2"){
                    dispatch({ type:Actions.FTPC_SUCCESS_L2,  payload:receiveddata});
                }
                if(values.type=="L3"){
                    dispatch({ type:Actions.FTPC_SUCCESS_L3,  payload:receiveddata});
                }
                if(values.type=="L4"){
                    dispatch({ type:Actions.FTPC_SUCCESS_L4,  payload:receiveddata});
                }
                if(values.type=="L5"){
                    dispatch({ type:Actions.FTPC_SUCCESS_L5,  payload:receiveddata});
                }
                if(values.type=="L6"){
                    dispatch({ type:Actions.FTPC_SUCCESS_L6,  payload:receiveddata});
                }
                if(values.type=="L7"){
                    dispatch({ type:Actions.FTPC_SUCCESS_L7,  payload:receiveddata});
                }
                else if(values.type=="L8"){
                    dispatch({ type:Actions.FTPC_SUCCESS_L8,  payload:receiveddata});
                }
                else if(values.type=="L9"){
                    dispatch({ type:Actions.FTPC_SUCCESS_L9,  payload:receiveddata});
                }
                else{
                    dispatch({ type:Actions.FTPC_SUCCESS,  payload:receiveddata});
                }
                
            }),
            ((failure)=>{
                dispatch({type:Actions.FTPC_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.RPR_ERROR, payload:error.message})
        })
    }
}

const FillAddressAction = () =>{
    return (dispatch) => {
        dispatch({ type:Actions.ADDRESS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        FillAddress().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.ADDRESS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.ADDRESS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.ADDRESS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.ADDRESS_ERROR, payload:error.message})
        })
    }
}

const DeliveryAddressAction = () =>{
    return (dispatch) => {
        dispatch({ type:Actions.DELIVERY_ADDRESS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        DeliveryAddress().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.DELIVERY_ADDRESS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.DELIVERY_ADDRESS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DELIVERY_ADDRESS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DELIVERY_ADDRESS_ERROR, payload:error.message})
        })
    }
}

const CostCentreCodeAction = () =>{
    return (dispatch) => {
        dispatch({ type:Actions.CCC_ACCESS, payload:{loading:true, errMessage:'loading'}});
        CostCentreCode().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CCC_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CCC_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CCC_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CCC_ERROR, payload:error.message})
        })
    }
}

const SegmentationAction = () =>{
    return (dispatch) => {
        dispatch({ type:Actions.SEGMENTATION_ACCESS, payload:{loading:true, errMessage:'loading'}});
        Segmentation().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.SEGMENTATION_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.SEGMENTATION_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.SEGMENTATION_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.SEGMENTATION_ERROR, payload:error.message})
        })
    }
}

const GetPurchaseRequestItemsDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PRI_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PurchaseRequestItemsDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PRI_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PRI_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PRI_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PRI_ERROR, payload:error.message})
        })
    }
}

const GetPurchaseRequestItemsDetailsPopUp = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PRI_ACCESS_POPUP, payload:{loading:true, errMessage:'loading', status:true}});
        PurchaseRequestItemsDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PRI_SUCCESS_POPUP,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PRI_FAILURE_POPUP, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PRI_ERROR_POPUP, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PRI_ERROR_POPUP, payload:error.message})
        })
    }
}





const GetCatalogueDropdown = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.CD_ACCESS, payload:{loading:true, errMessage:'loading'}});
        CatalogueDropdown().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CD_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CD_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CD_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CD_ERROR, payload:error.message})
        })
    }
}

const EmptyItemDisplayDetails = () =>{
    return (dispatch) => {
       dispatch({ type:Actions.GPD_ACCESS, payload:{loading:true, strMsgL:'',  responseList:[]}});
    } 
}

const GetBuyerCatlogSearch = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.BCS_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.PRI_ACCESS, payload:{loading:false, errMessage:'loading', responseList:{getPurchaseRequestItemsDetails:[]}}, });
        dispatch({ type:Actions.PRI_ACCESS_POPUP, payload:{loading:false, errMessage:'loading', status:true}});
     
        BuyerCatlogSearch(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.BCS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.BCS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.BCS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.BCS_ERROR, payload:error.message})
        })
   } 
}

const GetPurchaseRequestItemsDetailsNcPopUp = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PRI_NCACCESS_POPUP, payload:{loading:true, errMessage:'loading', status:true}});
        PurchaseRequestItemsDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PRI_NCSUCCESS_POPUP,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PRI_NCFAILURE_POPUP, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PRI_NCERROR_POPUP, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PRI_NCERROR_POPUP, payload:error.message})
        })
    }
}

const GetPurchaseRequestItemsDetailsFFPopUp = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PRI_FFACCESS_POPUP, payload:{loading:true, errMessage:'loading', status:true}});
        PurchaseRequestItemsDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PRI_FFSUCCESS_POPUP,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PRI_FFFAILURE_POPUP, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PRI_FFERROR_POPUP, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PRI_FFERROR_POPUP, payload:error.message})
        })
    }
}

const GetSearchPRList = (values) =>{
    
    return (dispatch) => {
        dispatch({ type:Actions.SPRL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        dispatch({ type:Actions.PRI_ACCESS, payload:{loading:false, errMessage:'loading', responseList:{getPurchaseRequestItemsDetails:[]}}, });
        dispatch({ type:Actions.PRI_ACCESS_POPUP, payload:{loading:false, errMessage:'loading', status:true}});
        SearchPRList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.SPRL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.SPRL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.SPRL_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.SPRL_ERROR, payload:error.message})
        })
    }
}

const GetSearchPRCancelList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.SPRCL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        SearchPRCancelList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.SPRCL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.SPRCL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.SPRCL_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.SPRCL_ERROR, payload:error.message})
        })
    }
}

const GetCancelPR = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PR_ACCESS, payload:{loading:true, strMsgL:''}});
        CancelPR(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PR_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PR_ERROR, payload:error.message})
        })
    }
}


const GetVoidPR = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PR_ACCESS, payload:{loading:true, strMsgL:''}});
        VoidPR(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PR_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PR_ERROR, payload:error.message})
        })
    }
}

const GetGeneratePRPDF = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GENERAE_PRPDF_ACCESS, payload:{loading:true, strMsgL:''}});
        GeneratePRPDF(values).then(
            ((receiveddata)=>{
                dispatch({ type:Actions.GENERAE_PRPDF_SUCCESS,  payload:receiveddata});
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
            }),
            ((failure)=>{
                dispatch({type:Actions.GENERAE_PRPDF_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GENERAE_PRPDF_ERROR, payload:error.message})
        })
    }
}


const GetGenerateDOPDF = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GENERAE_DOPDF_ACCESS, payload:{loading:true, strMsgL:''}});
        GenerateDOPDF(values).then(
            ((receiveddata)=>{
              
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({ type:Actions.GENERAE_DOPDF_SUCCESS,  payload:receiveddata});

            }),
            ((failure)=>{
                dispatch({type:Actions.GENERAE_DOPDF_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GENERAE_DOPDF_ERROR, payload:error.message})
        })
    }
}


const GetIssueGRN = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.IGRN_ACCESS, payload:{loading:true, strMsgL:''}});
        dispatch({ type:Actions.GRND_ACCESS, payload:{loading:true, responseList:{doDetails:[]}}});
        IssueGRN(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.IGRN_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.IGRN_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.IGRN_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.IGRN_ERROR, payload:error.message})
        })
    }
}

const GetGRNListing = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GRNL_ACCESS, payload:{loading:true, strMsgL:''}});
        dispatch({ type:Actions.GRND_ACCESS, payload:{loading:true, strMsgL:'', responseList:{doDetails:[]}}});
        GRNListing(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GRNL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GRNL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GRNL_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GRNL_ERROR, payload:error.message})
        })
    }
}



const GetSavePurchaseRequest = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.SPR_ACCESS, payload:{loading:true, strMsgL:''}});
        SavePurchaseRequest(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.SPR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.SPR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.SPR_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.SPR_ERROR, payload:error.message})
        })
    }
}

const GetGRNDetailsClick = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GRND_ACCESS, payload:{loading:true, strMsgL:''}});
        ViewGRNDetailsClick(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GRND_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GRND_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GRND_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GRND_ERROR, payload:error.message})
        })
    }
}

const GetGRNSubmit = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GRNS_ACCESS, payload:{loading:true, strMsgL:''}});
        GRNSubmit(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GRNS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GRNS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GRNS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GRNS_ERROR, payload:error.message})
        })
    }
}


const GetRequesterInvoiceSearch = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.RISEARCH_ACCESS, payload:{loading:true, strMsgL:''}});
        RequesterInvoiceSearch(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    if(values.invoiceDto && values.invoiceDto.hasOwnProperty('folder')){
                        dispatch({ type:Actions.RISEARCH_VERIFIED_SUCCESS,  payload:receiveddata});
                    }
                    else{
                        dispatch({ type:Actions.RISEARCH_SUCCESS,  payload:receiveddata});
                    }
                    
                }
                else{
                    dispatch({type:Actions.RISEARCH_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.RISEARCH_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.RISEARCH_ERROR, payload:error.message})
        })
    }
}


const GetRequesterVerifiedInvoiceSearch = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.VERIFIED_ACCESS, payload:{loading:true, strMsgL:''}});
        RequesterInvoiceSearch(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VERIFIED_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VERIFIED_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VERIFIED_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VERIFIED_ERROR, payload:error.message})
        })
    }
}



const GetViewInvoiceDetailsClick = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.RISEARCH_ACCESS, payload:{loading:true, strMsgL:''}});
        ViewInvoiceDetailsClick(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.RISEARCH_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.RISEARCH_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.RISEARCH_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.RISEARCH_ERROR, payload:error.message})
        })
    }
}

const GetInvoiceSave = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.IN_SAVE_ACCESS, payload:{loading:true, strMsgL:''}});
        InvoiceSave(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.IN_SAVE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.IN_SAVE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.IN_SAVE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.IN_SAVE_ERROR, payload:error.message})
        })
    }
}

const GetInvoiceVerify = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.IV_ACCESS, payload:{loading:true, strMsgL:''}});
        InvoiceVerify(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.IV_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.IV_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.IV_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.IV_ERROR, payload:error.message})
        })
    }
}




const GetInvoiceHeader = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.IVH_ACCESS, payload:{loading:true, strMsgL:''}});
        InvoiceHeader(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.IVH_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.IVH_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.IVH_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.IVH_ERROR, payload:error.message})
        })
    }
}





const GetInvoicePDF = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GENERAE_IPDF_ACCESS, payload:{loading:true, strMsgL:''}});
        InvoicePDF(values).then(
            ((receiveddata)=>{
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
                dispatch({type:Actions.GENERAE_IPDF_SUCCESS, payload:receiveddata.message})
            }),
            ((failure)=>{
                dispatch({type:Actions.GENERAE_IPDF_SUCCESS, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GENERAE_IPDF_FAILURE, payload:error.message})
        })
    }
}


const GetFillAddress = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GFA_ACCESS, payload:{loading:true, strMsgL:''}});
        FillAddress(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GFA_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GFA_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GFA_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GFA_ERROR, payload:error.message})
        })
    }
}


const GetAOList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GAO_ACCESS, payload:{loading:true, strMsgL:''}});
        AOList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GAO_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GAO_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GAO_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GAO_ERROR, payload:error.message})
        })
    }
}

const GetAppovalList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GAPL_ACCESS, payload:{loading:true, strMsgL:''}});
        AppovalList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GAPL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GAPL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GAPL_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GAPL_ERROR, payload:error.message})
        })
    }
}

const GetFinalSubmitPR = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GFS_ACCESS, payload:{loading:true, strMsgL:''}});
        FinalSubmitPR(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GFS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GFS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GFS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GFS_ERROR, payload:error.message})
        })
    }
}

const GetApprovalType = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GAT_ACCESS, payload:{loading:true, strMsgL:''}});
        ApprovalType(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GAT_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GAT_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GAT_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GAT_ERROR, payload:error.message})
        })
    }
}



const GetSaveApprovePerson = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GSAP_ACCESS, payload:{loading:true, strMsgL:''}});
        SaveApprovePerson(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GSAP_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GSAP_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GSAP_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GSAP_ERROR, payload:error.message})
        })
    }
}

const GetDeleteFile= (values) => {
    return (dispatch) => {
        dispatch({ type:(values.AttachType=="I") ? Actions.DELETE_ACCESS : Actions.DELETE_EXTERNAL_SUCCESS, payload:{loading:true, errMessage:'loading'}});
        DocumentDelete(values).then(
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


const GetFreeFormDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.FREE_FROM_ACCESS, payload:{loading:true, strMsgL:''}});
        FfpoAdditem().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.FREE_FROM_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.FREE_FROM_SUCCESS, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.FREE_FROM_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.FREE_FROM_ERROR, payload:error.message})
        })
    }
}

const GetFFRaisePOScreen = () =>{
    return (dispatch) => {
        dispatch({ type:Actions.GL_CODE_ACCESS, payload:{loading:true, strMsgL:''}});
        FFRaisePOScreen().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GL_CODE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GL_CODE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GL_CODE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GL_CODE_ERROR, payload:error.message})
        })
    }
}



const GetProductDetail = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GPD_ACCESS, payload:{loading:true, strMsgL:''}});
        GetProductDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GPD_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GPD_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GPD_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GL_CODE_ERROR, payload:error.message})
        })
    }
}

const GetPOApprovalDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GPO_ACCESS, payload:{loading:true, strMsgL:''}});
        GetPOApprovalList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GPO_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GPO_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GPO_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GPO_ERROR, payload:error.message})
        })
    }
}


const GetAllPOApprovalDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GPOA_ACCESS, payload:{loading:true, strMsgL:''}});
        GetAllPOApprovalList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.GPOA_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.GPOA_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.GPOA_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GPOA_ERROR, payload:error.message})
        })
    }
}

const GetPOApprovalSubmit = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.POSA_ACCESS, payload:{loading:true, strMsgL:''}});
        POApprovalSubmit(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.POSA_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.POSA_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.POSA_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.POSA_ERROR, payload:error.message})
        })
    }
}


const GetVendorList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.VENDOR_LIST_ACCESS, payload:{loading:true, strMsgL:''}});
        VendorList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                
                    dispatch({ type:Actions.VENDOR_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VENDOR_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VENDOR_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VENDOR_LIST_ERROR, payload:error.message})
        })
    }
}


const GetPreviewGRN = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PREVIEW_GRN_ACCESS, payload:{loading:true, strMsgL:''}});
        PreviewGRN(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                
                    dispatch({ type:Actions.PREVIEW_GRN_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PREVIEW_GRN_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PREVIEW_GRN_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PREVIEW_GRN_ERROR, payload:error.message})
        })
    }
}



const GetApppoDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PO_DETAILS_ACCESS, payload:{loading:true, strMsgL:''}});
        ApppoDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                
                    dispatch({ type:Actions.PO_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PO_DETAILS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PO_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PO_DETAILS_ERROR, payload:error.message})
        })
    }
}


const GetRfqAddItemSearch = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.REQ_ADD_ITEM_ACCESS, payload:{loading:true, strMsgL:''}});
        RfqAddItemSearch(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                
                    dispatch({ type:Actions.REQ_ADD_ITEM_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.REQ_ADD_ITEM_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.REQ_ADD_ITEM_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.REQ_ADD_ITEM_ERROR, payload:error.message})
        })
    }
}





const GetDocumentContinue = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.REQ_CON_ITEM_ACCESS, payload:{loading:true, strMsgL:''}});
        documentContinue(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                
                    dispatch({ type:Actions.REQ_CON_ITEM_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.REQ_CON_ITEM_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.REQ_CON_ITEM_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.REQ_CON_ITEM_ERROR, payload:error.message})
        })
    }
}

const GetE2PdocumentList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.REQ_DOC_LIST_ACCESS, payload:{loading:true, strMsgL:''}});
        E2PdocumentList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    
                    dispatch({ type:Actions.REQ_DOC_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.REQ_DOC_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.REQ_DOC_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.REQ_DOC_LIST_ERROR, payload:error.message})
        })
    }
}

const GetE2PApprovalDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.REQ_APROV_DET_ACCESS, payload:{loading:true, strMsgL:''}});
        E2PApprovalDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.REQ_APROV_DET_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.REQ_APROV_DET_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.REQ_APROV_DET_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.REQ_APROV_DET_ERROR, payload:error.message})
        })
    }
}

const GetMultiInvoiceTemplate = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.REQ_INVOICE_TEMPLATE_ACCESS, payload:{loading:true, strMsgL:''}});
        MultiInvoiceTemplate(values).then(
            ((receiveddata)=>{
                 
                let blob = new Blob([receiveddata],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var fileURL = window.URL.createObjectURL(blob);
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', values.strFile);

                document.body.appendChild(fileLink);
                fileLink.click();
                dispatch({ type:Actions.REQ_INVOICE_TEMPLATE_SUCCESS,  payload:receiveddata});
                

            }),
            ((failure)=>{
                dispatch({type:Actions.REQ_INVOICE_TEMPLATE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.REQ_INVOICE_TEMPLATE_ERROR, payload:error.message})
        })
    }
}

const GetDocumentEnquiryList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.DOC_ENQ_ACCESS, payload:{loading:true, strMsgL:''}});
        DocumentEnquiryList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){

                    dispatch({ type:Actions.DOC_ENQ_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.DOC_ENQ_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DOC_ENQ_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DOC_ENQ_ERROR, payload:error.message})
        })
    }
}



const GetMultiGLTemplate = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.REQ_INVOICE_TEMPLATE_ACCESS, payload:{loading:true, strMsgL:''}});
        MultiGLTemplate(values).then(
            ((receiveddata)=>{
               
                let blob = new Blob([receiveddata],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var fileURL = window.URL.createObjectURL(blob);
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', values.strFile);

                document.body.appendChild(fileLink);
                fileLink.click();
                dispatch({ type:Actions.REQ_INVOICE_TEMPLATE_SUCCESS,  payload:receiveddata});
                

            }),
            ((failure)=>{
                dispatch({type:Actions.REQ_INVOICE_TEMPLATE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.REQ_INVOICE_TEMPLATE_ERROR, payload:error.message})
        })
    }
}

const GetRequesterInvoicePaid = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.REQ_INVOICE_ACCESS, payload:{loading:true, strMsgL:''}});
        RequesterInvoicePaid(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    
                    dispatch({ type:Actions.REQ_INVOICE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.REQ_INVOICE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.REQ_INVOICE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.REQ_INVOICE_ERROR, payload:error.message})
        })
    }
}

const GetDashbaord = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.DASHBOARD_ACCESS, payload:{loading:true, strMsgL:''}});
        Dashbaord(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.DASHBOARD_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.DASHBOARD_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DASHBOARD_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DASHBOARD_ERROR, payload:error.message})
        })
    }
}

const GetCreditNoteTrackingList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.CN_TRACKING_ACCESS, payload:{loading:true, strMsgL:''}});
        CreditNoteTrackingList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CN_TRACKING_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CN_TRACKING_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CN_TRACKING_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CN_TRACKING_ERROR, payload:error.message})
        })
    }
}


const GetCreditNoteAckTrackingList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.CN_TRACKING_ACK_ACCESS, payload:{loading:true, strMsgL:''}});
        CreditNoteAckTrackingList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CN_TRACKING_ACK_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CN_TRACKING_ACK_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CN_TRACKING_ACK_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CN_TRACKING_ACK_ERROR, payload:error.message})
        })
    }
}

const GetCNTrackingDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.CN_TRACKING_DETAILS_ACCESS, payload:{loading:true, strMsgL:''}});
        CNTrackingDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CN_TRACKING_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CN_TRACKING_DETAILS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CN_TRACKING_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CN_TRACKING_DETAILS_ERROR, payload:error.message})
        })
    }
}


const GetDNTrackingDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.DN_TRACKING_DETAILS_ACCESS, payload:{loading:true, strMsgL:''}});
        DNTrackingDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.DN_TRACKING_DETAILS_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.DN_TRACKING_DETAILS_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DN_TRACKING_DETAILS_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DN_TRACKING_DETAILS_ERROR, payload:error.message})
        })
    }
}

const GetDNTrackingList = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.DN_TRACKING_ACCESS, payload:{loading:true, strMsgL:''}});
        DNTrackingList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    if(values.frm=="new"){
                        dispatch({ type:Actions.DN_TRACKING_SUCCESS_NEW,  payload:receiveddata});
                    }
                    else if(values.frm=="S"){
                        dispatch({ type:Actions.DN_TRACKING_SUCCESS_S,  payload:receiveddata});
                    }
                    else if(values.frm=="paid"){
                        dispatch({ type:Actions.DN_TRACKING_SUCCESS_PAID,  payload:receiveddata});
                    }
                    else{
                        dispatch({ type:Actions.DN_TRACKING_SUCCESS,  payload:receiveddata});
                    }
                   
                }
                else{
                    dispatch({type:Actions.DN_TRACKING_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DN_TRACKING_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DN_TRACKING_ERROR, payload:error.message})
        })
    }
}



const GetGenerateDEBITPDF = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GENERAE_DEBITPDF_ACCESS, payload:{loading:true, strMsgL:''}});
        GenerateDEBITPDF(values).then(
            ((receiveddata)=>{
                dispatch({ type:Actions.GENERAE_DEBITPDF_SUCCESS,  payload:receiveddata});
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
            }),
            ((failure)=>{
                dispatch({type:Actions.GENERAE_DEBITPDF_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GENERAE_DEBITPDF_ERROR, payload:error.message})
        })
    }
}

const GetGenerateCREDITPDF = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.GENERAE_CREDITPDF_ACCESS, payload:{loading:true, strMsgL:''}});
        GenerateCREDITPDF(values).then(
            ((receiveddata)=>{
                dispatch({ type:Actions.GENERAE_CREDITPDF_SUCCESS,  payload:receiveddata});
                let blob = new Blob([receiveddata], { type: 'application/pdf' }),
                url = window.URL.createObjectURL(blob)
                window.open(url)
            }),
            ((failure)=>{
                dispatch({type:Actions.GENERAE_CREDITPDF_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.GENERAE_CREDITPDF_ERROR, payload:error.message})
        })
    }
}



const GetInvoiceDetails = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.CNDN_INVOICE_ACCESS, payload:{loading:true, strMsgL:''}});
        InvoiceDetails(values).then(
            ((receiveddata)=>{
                console.log('receiveddata', receiveddata)
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CNDN_INVOICE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CNDN_INVOICE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CNDN_INVOICE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CNDN_INVOICE_ERROR, payload:error.message})
        })
    }
}

const GetCancelledPRListingSearch = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.CANCEL_PR_LIST_ACCESS, payload:{loading:true, strMsgL:''}});
        CancelledPRListingSearch(values).then(
            ((receiveddata)=>{
                console.log('receiveddata', receiveddata)
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CANCEL_PR_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CANCEL_PR_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CANCEL_PR_LIST_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CANCEL_PR_LIST_ERROR, payload:error.message})
        })
    }
}

const GetCheckBudgetAmount = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.BUDGET_AMOUNT_ACCESS, payload:{loading:true, strMsgL:''}});
        CheckBudgetAmount(values).then(
            ((receiveddata)=>{
                console.log('receiveddata', receiveddata)
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.BUDGET_AMOUNT_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.BUDGET_AMOUNT_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.BUDGET_AMOUNT_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.BUDGET_AMOUNT_ERROR, payload:error.message})
        })
    }
}


const GetInvoiceFundTypeList = () =>{
    return (dispatch) => {
        dispatch({ type:Actions.INV_FUND_ACCESS, payload:{loading:true, strMsgL:''}});
        InvoiceFundTypeList().then(
            ((receiveddata)=>{
                console.log('receiveddata', receiveddata)
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.INV_FUND_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.INV_FUND_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.INV_FUND_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.INV_FUND_ERROR, payload:error.message})
        })
    }
}

const GetFillTaxCode = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.FILL_TAX_CODE_ACCESS, payload:{loading:true, strMsgL:''}});
        FillTaxCode(values).then(
            ((receiveddata)=>{
                console.log('receiveddata', receiveddata)
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.FILL_TAX_CODE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.FILL_TAX_CODE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.FILL_TAX_CODE_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.FILL_TAX_CODE_ERROR, payload:error.message})
        })
    }
}


const GetPendingFYFA = (values) =>{
    return (dispatch) => {
        dispatch({ type:Actions.PENDING_FYFA_ACCESS, payload:{loading:true, strMsgL:''}});
        PendingFYFA(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PENDING_FYFA_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PENDING_FYFA_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PENDING_FYFA_ERROR, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PENDING_FYFA_ERROR, payload:error.message})
        })
    }
}












export { 
    GetContractRefNoAndDesc, 
    GetCommodityTypeList, 
    GetVendorNameListService, 
    SearchContractCatalogue, 
    RaisePR, 
    UploadDocuments, 
    FillAddressAction, 
    DeliveryAddressAction, 
    FundTypeOrPersonCodeORProjectCodeAction, 
    CostCentreCodeAction, 
    SegmentationAction , 
    GetPurchaseRequestItemsDetails, 
    GetCatalogueDropdown,
    GetBuyerCatlogSearch,
    GetSearchPRList,
    GetSearchPRCancelList,
    GetCancelPR,
    GetVoidPR,
    GetGeneratePRPDF,
    GetIssueGRN,
    GetGRNListing,
    GetSavePurchaseRequest,
    GetGRNDetailsClick,
    GetGRNSubmit,
    GetGenerateDOPDF,
    GetRequesterInvoiceSearch,
    GetViewInvoiceDetailsClick,
    GetInvoiceSave,
    InvoiceVerify,
    GetInvoiceVerify,
    GetInvoiceHeader,
    GetInvoicePDF,
    GetFillAddress,
    GetAOList,
    GetAppovalList,
    GetFinalSubmitPR,
    GetApprovalType,
    GetSaveApprovePerson,
    GetDeleteFile,
    GetPurchaseRequestItemsDetailsPopUp,
    GetFFRaisePOScreen,
    GetProductDetail,
    GetPOApprovalDetails,
    GetAllPOApprovalDetails,
    GetPOApprovalSubmit,
    GetPurchaseRequestItemsDetailsNcPopUp,
    GetPurchaseRequestItemsDetailsFFPopUp,
    GetFreeFormDetails,
    GetVendorList,
    ResetPr,
    EmptyItemDisplayDetails,
    GetPreviewGRN,
    GetApppoDetails,
    GetRfqAddItemSearch,
    GetDocumentContinue,
    GetE2PdocumentList,
    GetE2PApprovalDetails,
    GetMultiInvoiceTemplate,
    GetMultiGLTemplate,
    GetDocumentEnquiryList,
    GetRequesterInvoicePaid,
    GetDashbaord,
    GetCreditNoteTrackingList,
    GetCreditNoteAckTrackingList,
    GetCNTrackingDetails,
    GetDNTrackingDetails,
    GetDNTrackingList,
    GetGenerateDEBITPDF,
    GetGenerateCREDITPDF,
    GetInvoiceDetails,
    GetCancelledPRListingSearch,
    GetCheckBudgetAmount,
    GetInvoiceFundTypeList,
    ClearUploadDocuments,
    GetFillTaxCode,
    GetRequesterVerifiedInvoiceSearch,
    GetPendingFYFA
};