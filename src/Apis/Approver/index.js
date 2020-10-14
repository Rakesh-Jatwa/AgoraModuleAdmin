const base_url = process.env.REACT_APP_API_URL
const axios = require('axios');
const _token = localStorage.getItem('token')
const getToken = () =>{
    return localStorage.getItem('token')
}
const SearchPurchaseReqApproval = (values) => {
    return axios.post(base_url+'searchPurchaseReqApproval',values, { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const PurchaseReqRejectSearch = (values) => {
    return axios(base_url+'purchaseReqRejectSearch', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const ViewSinglePr = (values) => {
    return axios.post(base_url+'viewPRClick',values, { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const ApprovePR = (values) => {
    return axios.post(base_url+'prApproval', values, { 
        method: 'POST',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const RejectPR = (values) => {
    return axios.post(base_url+'rejectPR', values, { 
        method: 'POST',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const HoldPR = (values) => {
    return axios.post(base_url+'holdPR', values, { 
        method: 'POST',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}



const DownloadFile = (values) => {
    return axios(base_url+'documentDownload', { 
        method: 'POST',
        data: values,
        responseType: 'blob',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}


const VendorDetails = (values) => {
    return axios(base_url+'rfqViewVendorDetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const ConvertPRSearch = (values) => {
    return axios(base_url+'convertPRSearch', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



const RaisePO = (values) => {
    return axios(base_url+'raisePO', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const RaiseRFQ = (values) => {
    return axios(base_url+'raiseRFQ', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const ConvertPRListingSearch = (values) => {
    return axios(base_url+'convertPRListingSearch', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const QuoteList = (values) => {
    return axios(base_url+'quoteList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const QuotationPDFGenerate = (values) => {
    return axios(base_url+'QuotationPDFGenerate', { 
        method: 'POST',
        data: values,
        responseType: 'arraybuffer',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GetVendorID = (values) => {
    return axios(base_url+'getVendorID', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RFQListAllWithVendor = (values) => {
    return axios(base_url+'GetRFQListAllWithVendor', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const RFQPDFGenerate = (values) => {
    return axios(base_url+'RFQPDFGenerate', { 
        method: 'POST',
        data: values,
        responseType: 'arraybuffer',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const PoApprovallist = (values) => {
    return axios(base_url+'poapprovallist', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}
const PoApprovallistAll = (values) => {
    return axios(base_url+'poapprovallistAll', { 
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

const OutstandingRfq = (values) => {
    return axios(base_url+'rfqOutstandingList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const ViewResponseRFQComSummary = (values) => {
    return axios(base_url+'ViewResponseRFQComSummary', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const RfqRaisePO = (values) => {
    return axios(base_url+'rfqRaisePO', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const RaiseRFQPageLoad = (values) => {
    return axios(base_url+'RaiseRFQ_Page_Load', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RFQSubmit = (values) => {
    return axios(base_url+'RFQSubmit', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const Unablesupply = (values) => {
    return axios(base_url+'unablesupply', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GetRFQVendorList = () => {
    return axios(base_url+'getRFQVendorList', { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const RfqPOSubmit = (values) => {
    return axios(base_url+'rfqPOSubmit', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



const AproveSubmit = (values) => {
    return axios(base_url+'appposubmit', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const HoldPO = (values) => {
    return axios(base_url+'holdpo', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RejectPO = (values) => {
    return axios(base_url+'rejectpo', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DuplicatePO = (values) => {
    return axios(base_url+'duplicatePO', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



const FFPoAddress = (values) => {
    return axios(base_url+'FFPoAddress', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const FFPOSubmit = (values) => {
    return axios(base_url+'FFPOSubmit', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const E2PApprovalList = (values) => {
    return axios(base_url+'E2P/approval/list', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const E2PApprovalAprovRej = (values) => {
    return axios(base_url+'E2P/approval/approvedOrRejectList', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PApprovalAprovRejPSD = (values) => {
    return axios(base_url+'E2P/finance/getPSDApprovedOrRejectList', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PApprovalGetDetails = (values) => {
    return axios(base_url+'E2P/approval/getDetails', { 
        method: 'POST',
         data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PsearchVendor = (values) => {
    return axios(base_url+'E2P/searchVendor', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PViewAudit = (values) => {
    return axios(base_url+'E2P/viewAudit', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PApprovalReject = (values) => {
    return axios(base_url+'E2P/approval/rejected', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PApprovalSubmit = (values) => {
    return axios(base_url+'E2P/approval/submit', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}







const OutStandingRFQDuplicate = (values) => {
    return axios(base_url+'rfqOutStandingDuplicate', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const OutStandingRFQDelete = (values) => {
    return axios(base_url+'rfqOutStandingDelete', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const VendorRFQOutstandingDelete = (values) => {
    return axios(base_url+'VendorRFQOutstandingDelete', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const VendorRFQOutstandingExpDelete = (values) => {
    return axios(base_url+'VendorRFQOutstandingExpDelete', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const VendorRFQQuotationListingDelete = (values) => {
    return axios(base_url+'VendorRFQQuotationListingDelete', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const ViewPOClick = (values) => {
    return axios(base_url+'viewPOClick', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const PreviewDO = (values) => {
    return axios(base_url+'viewDODetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PGetFinList = (values) => {
    return axios(base_url+'E2P/finance/list', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RFQSave = (values) => {
    return axios(base_url+'RFQSave', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PPayFor = (values) => {
    return axios(base_url+'E2P/popPayFor', { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PPopTaxCode = (values) => {
    return axios(base_url+'E2P/popTaxCode', { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PWithHoldingTax = (values) => {
    return axios(base_url+'E2P/withHoldingTax', { 
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PSaveDocItemDetials = (values) => {
    return axios(base_url+'E2P/saveDocItemDetials', { 
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

const E2PpendingFYFA = (values) => {
    return axios(base_url+'E2P/finance/pendingFYFA', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const MassVerifyInvoice = (values) => {
    return axios(base_url+'invoiceMassVerify', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const E2PCanApprove = (values) => {
    return axios(base_url+'E2P/approval/canApprove', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const InvoiceTrackingSave = (values) => {
    return axios(base_url+'E2P/invoiceTrackingSave', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const MultipleVendorDetails = (values) => {
    return axios(base_url+'multipleVendorDetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const VendorDetailMethod = (values) => {
    return axios(base_url+'VendorDetail', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const PrMassApproval = (values) => {
    return axios(base_url+'prMassApproval', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RfqPolist = (values) => {
    return axios(base_url+'rfqPolist', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RemoveImages = (values) => {
    return axios(base_url+'remove_images_quotation', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}










export  {
    SearchPurchaseReqApproval,
    PurchaseReqRejectSearch,
    ViewSinglePr,
    ApprovePR,
    RejectPR,
    HoldPR,
    DownloadFile,
    VendorDetails,
    ConvertPRSearch,
    RaisePO,
    RaiseRFQ,
    ConvertPRListingSearch,
    QuoteList,
    QuotationPDFGenerate,
    GetVendorID,
    RFQListAllWithVendor,
    RFQPDFGenerate,
    PoApprovallist,
    ApppoDetails,
    OutstandingRfq,
    ViewResponseRFQComSummary,
    RfqRaisePO,
    RaiseRFQPageLoad,
    RFQSubmit,
    Unablesupply,
    GetRFQVendorList,
    RfqPOSubmit,
    AproveSubmit,
    RejectPO,
    HoldPO,
    FFPoAddress,
    FFPOSubmit,
    E2PApprovalList,
    E2PApprovalAprovRej,
    E2PApprovalGetDetails,
    E2PsearchVendor,
    E2PViewAudit,
    OutStandingRFQDuplicate,
    OutStandingRFQDelete,
    VendorRFQOutstandingDelete,
    VendorRFQOutstandingExpDelete,
    VendorRFQQuotationListingDelete,
    ViewPOClick,
    PreviewDO,
    E2PApprovalReject,
    E2PApprovalSubmit,
    E2PGetFinList,
    RFQSave,
    E2PApprovalAprovRejPSD,
    PoApprovallistAll,
    E2PPayFor,
    E2PPopTaxCode,
    E2PWithHoldingTax,
    E2PSaveDocItemDetials,
    E2PpendingFYFA,
    MassVerifyInvoice,
    E2PSaveDocDetials,
    E2PCanApprove,
    InvoiceTrackingSave,
    MultipleVendorDetails,
    VendorDetailMethod,
    PrMassApproval,
    RfqPolist,
    DuplicatePO,
    RemoveImages
};