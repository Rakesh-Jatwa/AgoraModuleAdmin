const base_url = process.env.REACT_APP_API_URL
const axios = require('axios');
const _token = localStorage.getItem('token')
const getToken = () =>{
    return localStorage.getItem('token')
}

const getContractRefNoAndDesc = () => {
    return axios.get(base_url+'getContractRefNoAndDesc',{
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const  getCommodityTypeList = () =>{
    return axios.post(base_url+'CommodityTypeList',{
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    })
    .then((response)=> { return response.data })
}


const  getVendorNameListService = () =>{
    return axios.post(base_url+'VendorNameList',{
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const  getDuplicatePR = (reqData) =>{
    return axios(base_url+'duplicatePR',{
        method: 'POST',
        data: reqData,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}




const  searchContractCatalogue = (values) =>{
    return axios.post(base_url+'getItemListBasedSearch',values, {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const  raisePR = (values) =>{
    return axios.post(base_url+'raisePR',values, {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const UploadFiles = (file,data) =>{
    const formData = new FormData();
    formData.append('uploadFile',file)
    formData.append('data',JSON.stringify(data))


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
  

    return axios.post(`${base_url}documentUpload`,formData,{
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    })
    .then((response)=>{return response.data})
}

const FundTypeOrPersonCodeORProjectCode = (values) => {
    return axios(base_url+'getFundTypeOrPersonCodeORProjectCode', {
        method: 'POST',
        data: JSON.stringify(values),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> {return response.data })
}

const FillAddress = () => {
    return axios(base_url+'fillAddress',{
        method: 'POST',
        headers: {
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DeliveryAddress = () => {
    return axios(base_url+'getDeliveryAddress', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CostCentreCode = () => {
    return axios(base_url+'getCostCentreCode',{
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
        }).then((response)=> { return response.data })
}


const Segmentation = () => {
    return axios(base_url+'getSegmentation', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const PurchaseRequestItemsDetails = (values) => {
    return axios(base_url+'getPurchaseRequestItemsDetails', { method: 'POST',
    data: values,
    headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const CatalogueDropdown = () => {
    return axios(base_url+'catalogueDropdown', { method: 'POST',
    headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const BuyerCatlogSearch = (values) => {
    return axios.post(base_url+'getBuyerCatItems1',values, { 
        method: 'POST',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}


const SearchPRList = (values) => {
    return axios(base_url+'SearchPRList', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const SearchPRCancelList = (values) => {
    return axios.post(base_url+'SearchPRCancelList',values, { 
        method: 'POST',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}


const CancelPR = (values) => {
    return axios.post(base_url+'cancelPR',values, { 
        method: 'POST',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const holdInvoice = (values) => {
    return axios.post(base_url+'holdInvoice',values, { 
        method: 'POST',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}



const VoidPR = (values) => {
    return axios.post(base_url+'voidPR',values, { 
        method: 'POST',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const GeneratePRPDF = (values) => {
    return axios.post(base_url+'generatePRPDF',values, { 
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}


const InvoicePDF = (values) => {
    return axios.post(base_url+'InvoicePDF',values, { 
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}



const GenerateDOPDF = (values) => {
    return axios.post(base_url+'generateDOPDF',values, { 
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}




const IssueGRN = (values) => {
    return axios.post(base_url+'grnSearch',values, { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GRNListing = (values) => {
    return axios.post(base_url+'grnListing',values, { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const SavePurchaseRequest = (values) => {
    return axios(base_url+'savePurchaseRequest',{
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const Menus = () => {
    return axios(base_url+'getMenuList', { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const EAdminMenus = () => {
    return axios(base_url+'eAdmin/menuList', { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const ViewGRNDetailsClick = (datas) => {
    return axios(base_url+'viewGRNDetailsClick',{ 
        method: 'POST',
        data: datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GRNSubmit = (datas) => {
    return axios(base_url+'GRNSubmit',{ 
        method: 'POST',
        data: datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RequesterInvoiceSearch = (datas) => {
    return axios(base_url+'requesterInvoiceSearch',{ 
        method: 'POST',
        data: datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const ViewInvoiceDetailsClick = (datas) => {
    return axios(base_url+'viewInvoiceDetailsClick',{ 
        method: 'POST',
        data: datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const InvoiceSave = (datas) =>{
    return axios(base_url+'invoiceSave',{ 
        method: 'POST',
        data: datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const InvoiceVerify = (datas) =>{
    return axios(base_url+'invoiceVerify',{ 
        method: 'POST',
        data: datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const InvoiceHeader = (datas) =>{
    return axios(base_url+'invoiceHeader',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}





const SaveApprovePerson = (datas) =>{
    return axios(base_url+'saveApprovePerson',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const AOList = (datas) =>{
    return axios(base_url+'getAOList',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const AppovalList = (datas) =>{
    return axios(base_url+'getAppovalList',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const FinalSubmitPR = (datas) =>{
    return axios(base_url+'finalSubmitPR',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const ApprovalType = (datas) =>{
    return axios(base_url+'getApprovalType',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DocumentDelete = (datas) =>{
    return axios(base_url+'documentDelete',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const FFRaisePOScreen = () =>{
    return axios(base_url+'FFRaisePOScreen',{ 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GetProductDetails = (datas) =>{
    return axios(base_url+'getProductDetails',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GetPOApprovalList = (datas) =>{
    return axios(base_url+'getPOApprovalList',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GetAllPOApprovalList = (datas) =>{
    return axios(base_url+'getAllPOApprovalList',{ 
        method: 'POST',
        data:datas,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const POApprovalSubmit = (values) => {
    return axios(base_url+'POApprovalSubmit', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const FfpoAdditem = (values) => {
    return axios(base_url+'ffpoadditem', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const VendorList = (values) => {
    return axios(base_url+'E2P/vendorList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const PreviewGRN = (values) => {
    return axios(base_url+'PreviewGRN', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const ApppoDetails = (values) => {
    return axios(base_url+'apppodetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const RfqAddItemSearch = (values) => {
    return axios(base_url+'rfqAddItemSearch', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const documentContinue = (values) => {
    return axios(base_url+'E2P/documentContinue', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PdocumentList = (values) => {
    return axios(base_url+'E2P/documentList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PApprovalDetails = (values) => {
    return axios(base_url+'E2P/approvalWorkFlow', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const E2PApprovalSubmit = (values) => {
    return axios(base_url+'E2P/documentApproval', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const E2PPoCancellation = (values) => {
    return axios(base_url+'PoCancellation', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GetDeliveryAddress = (values) => {
    return axios(base_url+'getuserdefaultdeliveraddr', { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const MultiInvoice =(file,data) =>{
    const formData = new FormData();
    formData.append('uploadFile',file)
    formData.append('data',JSON.stringify(data))
    return  axios.post(`${base_url}E2P/multiInvoice`,formData,{
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    })
    .then((response)=>{return response.data})
}

const CheckInvDuplicate =(values) =>{
  let _token = getToken();
    return axios(base_url+'E2P/checkInvDuplicate', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const MultiGL =(file,data) =>{
    const formData = new FormData();
    formData.append('uploadFile',file)
    formData.append('data',JSON.stringify(data))
    return  axios.post(`${base_url}E2P/multiGL`,formData,{
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    })
    .then((response)=>{return response.data})
}

const MultiInvoiceTemplate =(values) =>{
  let _token = getToken();
    return axios(base_url+'E2P/getMultiInvoiceTemplate', { 
        method: 'POST',
        responseType: 'blob',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const MultiGLTemplate =(values) =>{
    return axios(base_url+'E2P/getMultiGLTemplate', { 
        method: 'POST',
        responseType: 'blob',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { 
        return response.data 
    })
}


const DocumentEnquiryList =(values) =>{
  let _token = getToken();
    return axios(base_url+'E2P/documentEnquiryList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const VoidE2P =(values) =>{
    let _token = getToken();
      return axios(base_url+'E2P/documentVoid', { 
          method: 'POST',
          data: values,
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              "authorization" : getToken(),
          }
      }).then((response)=> { return response.data })
}
  
const E2PDeleteIPPDocDetaill = (values) => {
    return axios(base_url+'E2P/DeleteIPPDocDetail', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RequesterInvoicePaid = (values) => {
    return axios(base_url+'requesterInvoicePaid', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



const E2PSaveDocDetials = (values) => {
    return axios(base_url+'E2P/documentSave', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const Dashbaord = () => {
    return axios(base_url+'dashboard', { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



const CreditNoteTrackingList = (values) => {
    return axios(base_url+'CNDN/creditNoteTrackingList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const CreditNoteAckTrackingList = (values) => {
    return axios(base_url+'CNDN/creditNoteAckTrackingList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CNTrackingDetails = (values) => {
    return axios(base_url+'CNDN/getCNTrackingDetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CNTrackingSave = (values) => {
    return axios(base_url+'CNDN/CNTrackingSave', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CNAcknowledge = (values) => {
    return axios(base_url+'CNDN/CNAcknowledge', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



const DNTrackingDetails = (values) => {
    return axios(base_url+'CNDN/getDNTrackingDetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const DNTrackingList = (values) => {
    return axios(base_url+'CNDN/getDNTrackingList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



const DNTrackingSave = (values) => {
    return axios(base_url+'CNDN/DNTrackingSave', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const GenerateDEBITPDF = (values) => {
    return axios.post(base_url+'generateDEBITPDF',values, { 
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const GenerateCREDITPDF = (values) => {
    return axios.post(base_url+'generateCREDITPDF',values, { 
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const InvoiceDetails = (values) => {
        return axios.post(base_url+'CNDN/getInvoiceDetails',values, { 
            method: 'POST',
            data: values,
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DNApprove = (values) => {
    return axios.post(base_url+'CNDN/DNApprove',values, { 
            method: 'POST',
            data: values,
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CancelledPRListingSearch = (values) => {
    return axios.post(base_url+'cancelledPRListingSearch',values, { 
            method: 'POST',
            data: values,
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const CheckBudgetAmount = (values) => {
    return axios.post(base_url+'check_budget_amount',values, { 
            method: 'POST',
            data: values,
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const CheckBudgetTopup = (values) => {
    return axios.post(base_url+'request_budget_topup',values, { 
            method: 'POST',
            data: values,
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const InvoiceFundTypeList = () => {
    return axios(base_url+'invoiceFundTypeList', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const FillTaxCode = (values) => {
    return axios.post(base_url+'fillTaxCode', values, {
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const PendingFYFA = (values) => {
    return axios.post(base_url+'E2P/approval/pendingFYFA', values, {
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}






export  {
    getContractRefNoAndDesc, 
    getCommodityTypeList, 
    getVendorNameListService, 
    searchContractCatalogue, 
    raisePR, 
    UploadFiles, 
    FundTypeOrPersonCodeORProjectCode, 
    FillAddress, 
    DeliveryAddress, 
    CostCentreCode, 
    Segmentation, 
    PurchaseRequestItemsDetails, 
    CatalogueDropdown,
    BuyerCatlogSearch,
    SearchPRList,
    SearchPRCancelList,
    CancelPR,
    VoidPR,
    GeneratePRPDF,
    IssueGRN,
    GRNListing,
    SavePurchaseRequest,
    Menus,
    ViewGRNDetailsClick,
    GRNSubmit,
    GenerateDOPDF,
    RequesterInvoiceSearch,
    ViewInvoiceDetailsClick,
    InvoiceSave,
    InvoiceVerify,
    InvoiceHeader,
    InvoicePDF,
    DocumentDelete,
    AOList,
    AppovalList,
    FinalSubmitPR,
    ApprovalType,
    SaveApprovePerson,
    getDuplicatePR,
    FFRaisePOScreen,
    GetProductDetails,
    GetPOApprovalList,
    GetAllPOApprovalList,
    POApprovalSubmit,
    FfpoAdditem,
    VendorList,
    holdInvoice,
    PreviewGRN,
    ApppoDetails,
    RfqAddItemSearch,
    documentContinue,
    E2PdocumentList,
    E2PApprovalDetails,
    E2PApprovalSubmit,
    E2PPoCancellation,
    GetDeliveryAddress,
    MultiInvoice,
    CheckInvDuplicate,
    MultiGL,
    MultiGLTemplate,
    MultiInvoiceTemplate,
    DocumentEnquiryList,
    VoidE2P,
    E2PDeleteIPPDocDetaill,
    RequesterInvoicePaid,
    E2PSaveDocDetials,
    Dashbaord,
    CreditNoteTrackingList,
    CreditNoteAckTrackingList,
    CNTrackingDetails,
    CNTrackingSave,
    CNAcknowledge,
    DNTrackingDetails,
    DNTrackingList,
    DNTrackingSave,
    GenerateDEBITPDF,
    GenerateCREDITPDF,
    InvoiceDetails,
    DNApprove,
    CancelledPRListingSearch,
    EAdminMenus,
    CheckBudgetAmount,
    CheckBudgetTopup,
    InvoiceFundTypeList,
    FillTaxCode,
    PendingFYFA
};