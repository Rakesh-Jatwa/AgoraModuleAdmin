const base_url = process.env.REACT_APP_API_URL
const axios = require('axios');
const _token = localStorage.getItem('token')
const getToken = () =>{
    return localStorage.getItem('token')
}

const PoPendingOrder = (values) => {
    return axios.post(base_url+'getPoPending',values, { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const PoListing = (values) => {
    return axios(base_url+'poListing', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const PoList = (values) => {
    return axios(base_url+'polist', { 
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

const GeneratePOPDF = (values) => {
    return axios.post(base_url+'generatePOPDF',values, { 
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}




const AcceptReject = (values) => {
    return axios(base_url+'acceptOrRejectPO', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}


const DoSearch = (values) => {
    return axios(base_url+'getDoSearch', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const ViewDOClick = (values) => {
    return axios(base_url+'viewDOClick', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const DoListing = (values) => {
    return axios(base_url+'DoListing', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const SaveDo = (values) => {
    return axios(base_url+'saveDo', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}


const DeleteDO = (values) => {
    return axios(base_url+'DeleteDO', { 
        method: 'POST',
        data: values,
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

const DeleteFile = (values) => {
    return axios(base_url+'documentDelete', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const IssueInvoice = (values) => {
    return axios(base_url+'issueInvoice', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const InvoiceListing = (values) => {
    return axios(base_url+'invoiceListing', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const ViewInvoiceDetailsVendor = (values) => {
    return axios(base_url+'viewInvoiceDetailsVendor', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const ViewGRNPDF = (values) => {
    return axios(base_url+'GRNPDF', { 
        method: 'POST',
        data: values,
        responseType: 'arraybuffer',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}


const InvoiceSubmit = (values) => {
    return axios(base_url+'invoiceSubmit', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const VendorRFQOutstanding = (values) => {
    return axios(base_url+'vendorRFQOutstanding', { 
        method: 'POST',
        data: values,
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
    }
    }).then((response)=> { return response.data })
}

const NewQuoteDetails = (values) => {
    return axios(base_url+'newquotedetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const VendorRfqSubmit = (values) => {
    return axios(base_url+'vendorrfqsubmit', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const RFQQuotationListing = (values) => {
    return axios(base_url+'vendorRFQQuotationListing', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const VendorRFQOutstandingExp = (values) => {
    return axios(base_url+'vendorRFQOutstandingExp', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const RFQQuotationListingDelete = (values) => {
    return axios(base_url+'vendorRFQQuotationListingDelete', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const viewRFQ = (values) => {
    return axios(base_url+'viewRFQ', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const viewRFQ_PDF = (values) => {
    return axios(base_url+'viewRFQ', { 
        method: 'POST',
        data: values,
        responseType: 'arraybuffer',
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const viewQuotation = (values) => {
    return axios(base_url+'viewQuotation', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const viewQuotationPDF = (values) => {
    return axios(base_url+'QuotationPDFGenerate', { 
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const viewRFQPDF = (values) => {
    return axios(base_url+'RFQPDFGenerate', { 
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const PolineDetails = (values) => {
    return axios(base_url+'PolineDetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const PoListDetails = (values) => {
    return axios(base_url+'PoListDetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CNListing = (values) => {
    return axios(base_url+'CNDN/creditNoteList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DNListing = (values) => {
    return axios(base_url+'CNDN/debitNoteList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DNCheck = (values) => {
    return axios(base_url+'CNDN/RaiseDNClick', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const CNCheck = (values) => {
    return axios(base_url+'CNDN/RaiseCNClick', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CNDetails = (values) => {
    return axios(base_url+'CNDN/getCNDetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DNDetails = (values) => {
    return axios(base_url+'CNDN/getDNDetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const GetSubmitCN = (values) => {
    return axios(base_url+'CNDN/submitCN', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GetSubmitDN = (values) => {
    return axios(base_url+'CNDN/submitDN', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GenerateCRPDF = (values) => {
    return axios(base_url+'generateCRPDF', { 
        method: 'POST',
        data: values,
        responseType: 'arraybuffer',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const PoAcknowledgement = (values) => {
    return axios(base_url+'PoAcknowledgement', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const FillGST = (values) => {
    return axios(base_url+'fillGST', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const FillTax = (values) => {
    return axios(base_url+'fillTax', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const ChangePwdPageLoad = (values) => {
    return axios(base_url+'changePwdPageLoad', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const PoTrackingList = (values) => {
    return axios(base_url+'PoTrackingList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const TransTrackingList = (values) => {
    return axios(base_url+'transactionTrackingList', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}





const ChangePassword = (values) => {
    return axios(base_url+'changePassword', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DODetails = (values) => {
    return axios(base_url+'viewDODetails', { 
        method: 'POST',
        data: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}





export  {
    PoPendingOrder,
    PoListing,
    ViewPOClick,
    GeneratePOPDF,
    AcceptReject,
    DoSearch,
    ViewDOClick,
    DoListing,
    SaveDo,
    DeleteFile,
    DownloadFile,
    InvoiceListing,
    IssueInvoice,
    ViewInvoiceDetailsVendor,
    ViewGRNPDF,
    InvoiceSubmit,
    VendorRFQOutstanding,
    NewQuoteDetails,
    VendorRfqSubmit,
    RFQQuotationListing,
    RFQQuotationListingDelete,
    viewRFQ_PDF,
    viewRFQ,
    viewQuotation,
    VendorRFQOutstandingExp,
    PoList,
    viewQuotationPDF,
    viewRFQPDF,
    PolineDetails,
    PoListDetails,
    CNListing,
    DNListing,
    DNCheck,
    CNCheck,
    CNDetails,
    DNDetails,
    GetSubmitCN,
    GetSubmitDN,
    GenerateCRPDF,
    PoAcknowledgement,
    FillGST,
    ChangePwdPageLoad,
    ChangePassword,
    FillTax,
    DeleteDO,
    DODetails,
    PoTrackingList,
    TransTrackingList
};