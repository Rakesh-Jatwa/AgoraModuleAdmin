exports.FixedRole = {
    Approving_Officer: "Approving_Officer",
    Buyer: "Buyer",
    Buyer_Administrator: "Buyer_Administrator",
    Consolidator: "Consolidator",
    Finance_Manager: "Finance_Manager",
    Finance_Officer: "Finance_Officer",
    Purchasing_Manager: "Purchasing_Manager",
    Purchasing_Officer: "Purchasing_Officer",
    Quality_Control_Officer: "Quality_Control_Officer",
    Requester: "Requester",
    Second_Level_Receiver: "Second_Level_Receiver",
    Store_Keeper: "Store_Keeper",
    Vendor: "Vendor",
    Vendor_Administrator: "Vendor_Administrator",
    All_Role: "All_Role",

    //eRFP - role

    Financial_Officer: "Financial_Officer",
    Technical_Officer: "Technical_Officer",
    RFP_Manager: "RFP_Manager",
    RFP_Admin: "RFP_Admin",
    RFP_Secretary: "RFP_Secretary",
    RFP_Consultant: "RFP_Consultant",
    Quantity_Surveyor: "Quantity_Surveyor",
    Witnessing_Officer: "Witnessing_Officer",
    RFP_Vendor: "RFP_Vendor",
    RFP_Vendor_Admin: "RFP_Vendor_Admin",

    // Super Admin
    Super_Admin: "Super_Admin",
    Report_Administrator: "Report_Administrator",

    //IPP - Role
    IPP_Officer: "IPP_Officer",
    IPP_OfficerF: "IPP_OfficerF",

    //Billing - Role
    Billing_Officer: "Billing_Officer",
    Billing_OfficerF: "Billing_OfficerF",
}

exports.AccessRight = {
    Screen: "Screen",
    FixedRole: "FixedRole"
}
exports.CodeTable = {
    Country: "Country",
    State: "State",
    Currency: "Currency",
    Uom: "Uom",
    Gst: "Gst",
    PaymentTerm: "PaymentTerm",
    ShipmentMode: "ShipmentMode",
    ShipmentTerm: "ShipmentTerm",
    PaymentMethod: "PaymentMethod",
    MgmtCode: "MgmtCode",
    ApprovalGroup: "ApprovalGroup",
    Business: "Business",
    OwnerShip: "OwnerShip",
    IPPPaymentMethod: "IPPPaymentMethod",
    GRNCtrlDays: "GRNCtrlDays",
    IPPCompanyCategory: "IPPCompanyCategory"
}

exports.invStatus = {
    NewInv: 1,
    PendingAppr: 2,
    Approved: 3,
    Paid: 4,
    Hold: 5
}

exports.DNStatus = {
    NewDN: 1,
    PendingAppr: 2,
    Approved: 3,
    Paid: 4
}
exports.CNStatus = {
    NewCN: 1,
    AckCN: 2
}
exports.SCStatus = {
    DraftSC: 1,
    Submitted: 2,
    PendingAppr: 3,
    Approved: 4,
    Rejected: 5
}
exports.IPPStatus = {
    Draft: 10,
    Submitted: 11,
    PendingAppr: 12,
    Approved: 13,
    Rejected: 14,
    Void: 15
}



exports.POStatus = {
    NewPO: 1, //1
    AcceptedByVendor: 2, //2
    RejectedByVendor: 3, //3
    CancelledBY: 4, //4
    Invoiced: 5, //7
    Opened: 6, //8
    PartiallyInvoiced: 7 //9
}
exports.CRStatus = {
    newCR: 1,
    Acknowledged: 2
}
exports.POStatus_new = {
    Draft: 0,
    //null = 0
    NewPO: 1, //1
    Open: 2, //8
    Accepted: 3, //2
    Rejected: 4, //3
    Cancelled: 5, //4
    Close: 6,
    Submitted: 7,
    PendingApproval: 8,
    Approved: 9,
    RejectedBy: 10,
    //CancelledBy = 11
    HeldBy: 11,
    Void: 12,
    CancelledBy: 13
}

exports.POStatus_switch = (poStatus, Fulfillment) => {

    if ((poStatus === 6 || poStatus === 3) && (Fulfillment === 3)) {

        return "Closed"
    }
    else if (poStatus === 4 || poStatus === 5) {

        return "Cancelled"

    }

    else if (poStatus === 1 || poStatus === 2) {

        return "New"

    }
    else {

        return "Outstanding"

    }
}

exports.IRStatus_new = {
    Submitted: 1,
    Approved: 2,
    PendingApproval: 3,
    Rejected: 4
}
exports.MRSStatus_new = {
    NewMRS: 1,
    Issued: 2,
    Acknowledged: 3,
    AutoAcknowledged: 4,
    Cancelled: 5,
    Rejected: 6,
    PartialIssued: 7
}
exports.IQCStatus_new = {
    Approved: 1,
    Waived: 2,
    Replacement: 3,
    Rejected: 4
}
exports.DOStatus = {
    Draft: 1,
    Submitted: 2,
    FullyAccepted: 3,
    PartiallyAccepted: 4,
    Rejected: 5,
    Invoiced: 6
}
exports.Fulfilment = {
    Open: 1,
    Part_Delivered: 2,
    Fully_Delivered: 3,
    //Completed = 4
    Pending_Cancel_Ack: 4,
    Cancel_Order: 5
}
exports.GRNStatus = {
    Uninvoice: 1,
    Invoiced: 2,
    PendingACK: 3
}
exports.CatalogueStatus = {
    Draft: 1,
    //PMPending = 2
    //PMRejected = 3
    //VendorAck = 4
    //HubPending = 5
    //HubRejected = 6
    //HubApproved = 7
    //PendingDeactivated = 8
    //Deactivated = 9
    BuyerPending: 2,
    BuyerRejected: 3,
    HubPending: 4,
    Rejected: 5,
    Approved: 6
}
exports.ListPriceStatus = {
    PendingApproval: 1,
    Rejected: 2,
    Approved: 3
}
exports.WheelDateFormat = {
    LongDateDay: "LongDateDay", ////Wednesday, 07 Nov 2004
    LongDate: "LongDate",    ////07 Nov 2004
    ShortDate: "ShortDate",   //// 07/11/2004
    LongDateTimeDay: "LongDateTimeDay", ////Wednesday, 07 Nov 2004 11:40:39
    LongDateTime: "LongDateTime", ////07 Nov 2004 11:40:39
    CountDownDate: "CountDownDate",////june 16, 2005 18:00:00
    Time: "Time" ////HH:mm:ss
}
exports.WheelMailPriority = {
    High: 1,
    Low: 2,
    Normal: 3
}
exports.WheelMsgNum = {
    Save: 1,
    NotSave: 2,
    Delete: 3,
    NotDelete: 4,
    Duplicate: 5
}
exports.ExceptionType = {
    System: 0,
    Input: 1,
    PRErr: 2,
    POErr: 3,
    DOErr: 4
}
exports.CObjectType = {
    TextBox: 1,
    DropDownList: 2,
    CheckBox: 3,
    RadioButton: 4
}
exports.WheelModule = {
    SecurityControl: "SecurityControl",
    PRMod: "PRMod",
    OrderMgnt: "OrderMgnt",
    Fulfillment: "Fulfillment",
    CompanyProfile: "CompanyProfile",
    UserProfile: "UserProfile",
    Admin: "Admin",
    CatalogueMgnt: "CatalogueMgnt",
    RFQ: "RFQ",
    InvoiceMod: "InvoiceMod",
    IQCMod: "IQCMod",
    IRMod: "IRMod",
    MRSMod: "MRSMod",
    ROMod: "ROMod",
    WOMod: "WOMod",
    RIMod: "RIMod",
    DebitNoteMod: "DebitNoteMod",
    CreditNoteMod: "CreditNoteMod",
    StaffClaimMod: "StaffClaimMod"
}
exports.EmailType = {
    RFQequested: "RFQequested",
    RFQRejected: "RFQRejected",
    RFQReply: "RFQReply",
    BudgetAdvisory: "BudgetAdvisory",
    BudgetTopUp: "BudgetTopUp",
    PRConsolidated: "PRConsolidated",
    PRCancelled: "PRCancelled",
    PRHeld: "PRHeld",
    PRRejected: "PRRejected",
    POCreated: "POCreated",
    POApproved: "POApproved",
    PORaised: "PORaised",
    PORejected: "PORejected",
    PORejectedBy: "PORejectedBy",
    POAccepted: "POAccepted",
    DOCreated: "DOCreated",
    DOCreatedToSK: "DOCreatedToSK",
    GoodsReceiptNoteCreated: "GoodsReceiptNoteCreated",
    GoodsReceiptNoteReject: "GoodsReceiptNoteReject",
    AckGRN: "AckGRN",
    InvoiceCreated: "InvoiceCreated",
    InvoiceApproval: "InvoiceApproval",
    POCancellationRequest: "POCancellationRequest",
    POCancellationRequestToAOBuyer: "POCancellationRequestToAOBuyer",
    POCancellationRequestToAO: "POCancellationRequestToAO",
    AckPOCancellationRequest: "AckPOCancellationRequest",
    CatalogueApproval: "CatalogueApproval",
    CatalogueRejected: "CatalogueRejected",
    CatalogueDiscarded: "CatalogueDiscarded",
    CataloguePublished: "CataloguePublished",
    ListPriceUpdate: "ListPriceUpdate",
    ListPriceApproval: "ListPriceApproval",
    ListPristRejected: "ListPristRejected",
    ListPricePublished: "ListPricePublished",
    ChangePwd: "ChangePwd",
    NewUserAccount: "NewUserAccount",
    CompanyActivated: "CompanyActivated",
    CompanyDeactivated: "CompanyDeactivated",
    RFPPublishApp: "RFPPublishApp",
    SendRFPInviClosed: "SendRFPInviClosed",
    RFPInviAccepted: "RFPInviAccepted",
    RFPInviRejected: "RFPInviRejected",
    SendMaintDocApp: "SendMaintDocApp",
    SendMaintDocAppExt: "SendMaintDocAppExt",
    SendMaintDoc: "SendMaintDoc",
    SendMaintDocExt: "SendMaintDocExt",
    MaintDocReadAck: "MaintDocReadAck",
    RFPAwardApp: "RFPAwardApp",
    SendRFPAward: "SendRFPAward",
    VPublicRFPReg: "VPublicRFPReg",
    VPublicRFPRegRej: "VPublicRFPRegRej",
    ApprovedPublicRFPReg: "ApprovedPublicRFPReg",
    NewVCoyReg: "NewVCoyReg",
    ApprovedVCoyReg: "ApprovedVCoyReg",
    VQuery: "VQuery",
    RejectedVCoyReg: "RejectedVCoyReg",
    ResponseQuery: "ResponseQuery",
    ReliefStaffAssign: "ReliefStaffAssign",
    ExtendReliefStaffAssign: "ExtendReliefStaffAssign",
    TechUpload: "TechUpload",
    FinUpload: "FinUpload",
    VComplianceList: "VComplianceList",
    VDrawing: "VDrawing",
    WitnesingOpenTechG: "WitnesingOpenTechG",
    WitnesingOpenFinG: "WitnesingOpenFinG",
    NewRegistPublicVendor: "NewRegistPublicVendor",
    RejectRFPReg: "RejectRFPReg",
    HoldRFPReg: "HoldRFPReg",
    sendMainPublish: "sendMainPublish",
    sendAwardPublish: "sendAwardPublish",
    RFQSupply: "RFQSupply",
    POHeld: "POHeld",
    PRCancelledToBuyer: "PRCancelledToBuyer",
    IQCApprovedToSK: "IQCApprovedToSK",
    IQCRejectedToSK: "IQCRejectedToSK",
    RIAcknowledged: "RIAcknowledged",
    RIRejected: "RIRejected",
    IRApprovedToHOD: "IRApprovedToHOD",
    IRRejectedToRequestor: "IRRejectedToRequestor",
    IRToSK: "IRToSK",
    MRSToSK: "MRSToSK",
    MRSIssued: "MRSIssued",
    MRSRejected: "MRSRejected",
    ROCreated: "ROCreated",
    RICreated: "RICreated",
    //Jules 2015.02.02 Agora Stage 2
    FOIncomingDN: "FOIncomingDN",
    FMIncomingDN: "FMIncomingDN",
    FMIncomingCN: "FMIncomingCN",
    //CH - 2016/02/24 - Staff Claim
    SCApproved: "SCApproved",
    SCRejected: "SCRejected"
}



exports.PRstatus = {
    Draft: 1, //Open
    Submitted: 2,//ReleaseForApproval
    PendingApproval: 3,
    Approved: 4,
    ConvertedToPO: 5,//4
    CancelledBy: 6, //5
    HeldBy: 7, //6
    RejectedBy: 8,
    Void: 9,
    common: 99
}

exports.WheelUserActivity = {
    Login: "Login",
    Logout: "Logout",
    B_SubmitPR: "B_SubmitPR",
    B_CancelPR: "B_CancelPR",
    B_DeletePR: "B_DeletePR",
    AO_ApprovePR: "AO_ApprovePR",
    AO_RejectPR: "AO_RejectPR",
    AO_HoldPR: "AO_HoldPR",
    AO_CreatePO: "AO_CreatePO",
    B_SubmitRFQ: "B_SubmitRFQ",
    V_AcceptPO: "V_AcceptPO",
    V_RejectPO: "V_RejectPO",
    V_SaveDO: "V_SaveDO ",
    V_SubmitDO: "V_SubmitDO",
    V_SubmitQuotation: "V_SubmitQuotation",
    B_GRN: "B_GRN",
    B_GRNACK: "B_GRNACK",
    V_Invoice: "V_Invoice",
    BA_ModCoy: "BA_ModCoy",
    BA_ModDept: "BA_ModDept",
    BA_ModCoyParam: "BA_ModCoyParam",
    FO_ApproveInvoice: "FO_ApproveInvoice",
    FO_RejectInvoice: "FO_RejectInvoice",
    FO_HoldInvoice: "FO_HoldInvoice",
    FM_ApprovePayment: "FM_ApprovePayment",
    FM_HoldPayment: "FM_HoldPayment",
    B_SubmitPO: "B_SubmitPO",
    B_CancelPO: "B_CancelPO",
    B_DeletePO: "B_DeletePO",
    AO_ApprovePO: "AO_ApprovePO",
    AO_RejectPO: "AO_RejectPO",
    AO_HoldPO: "AO_HoldPO",
    B_VoidPO: "B_VoidPO",
    AO_ApproveIQC: "AO_ApproveIQC",
    AO_WaiveIQC: "AO_WaiveIQC",
    AO_ReplaceIQC: "AO_ReplaceIQC",
    AO_ReTestIQC: "AO_ReTestIQC",
    AO_RejectIQC: "AO_RejectIQC",
    AO_ApproveIR: " AO_ApproveIR",
    AO_RejectIR: "AO_RejectIR",
    SK_ApproveMRS: "SK_ApproveMRS",
    SK_RejectMRS: "SK_RejectMRS",
    REQ_SubmitIR: "REQ_SubmitIR",
    REQ_AckMRS: "REQ_AckMRS",
    REQ_CancelMRS: "REQ_CancelMRS",
    SK_SubmitRO: "SK_SubmitRO",
    SK_SubmitWO: "SK_SubmitWO",
    SK_AckRI: "SK_AckRI",
    SK_RejectRI: "SK_RejectRI",
    REQ_SubmitRI: "REQ_SubmitRI",
    V_DebitNote: "V_DebitNote",
    V_CreditNote: "V_CreditNote",
    FO_VerifyDN: "FO_VerifyDN",
    FM_ApproveDN: "FM_ApproveDN",
    FM_AckCN: "FM_AckCN",
    Staff_SaveHardship: "Staff_SaveHardship",
    Staff_SaveOvertime: "Staff_SaveOvertime",
    Staff_SaveAllowance: "Staff_SaveAllowance",
    Staff_SaveEntertain: "Staff_SaveEntertain",
    Staff_SaveTransport: "Staff_SaveTransport",
    Staff_SaveMisc: "Staff_SaveMisc",
    Staff_SaveOutstation: " Staff_SaveOutstation",
    Staff_SubmitStaffClaim: "Staff_SubmitStaffClaim",
    AO_ApproveSC: "AO_ApproveSC",
    AO_RejectSC: "AO_RejectSC"
}
exports.EnumRFPStatus = {
    Draft: 1,
    Pending: 2,
    Sent: 3,
    Approved: 4,
    Held: 5,
    Rejected: 6,
    Closed: 7,
    Withdrawn: 8,
}
exports.DocMAINT = {
    Addm: "Addm",
    Corrm: "Corrm",
    Clarif: "Clarif",
    ExtDate: "ExtDate",
    Withd: "Withd",
    Query: "Query",
    RFP: "RFP",
    AWARD: "AWARD"
}
exports.MAINT = {
    Clarification: 2,
    Query: 5
}
exports.VendorRegApprStatus = {
    Pending: 0,
    Approved: 1,
    Reject: 2
}
exports.EnumInterestStatus = {
    Interest: 0,
    NotInterest: 1
}
exports.EnumRFPV = {
    responded: 1,
    draft: 2,
    read: 3,
    accepted: 4,
    rejected: 5,
    pending: 6
}
exports.EnumViewAward = {
    viewableAll: 0,
    viewableResonly: 1,
    viewableAward: 2
}
exports.EnumRFPTechShort = {
    shortlisted: 1
}
exports.EnumRFPFOTUpdate = {
    SendFOTUpdate: 0,
    FOTUpdated: 1
}
exports.EnumEarnestMon = {
    Required: 0,
    NotRequired: 1
}
exports.EnumRFPINVI = {
    Responded: 1,
    NoResponse: 2
}
exports.EnumRFPPayment = {
    Pending: 7,
    Paid: 8
}
exports.EnumRFPFOT = {
    Contract: 0,
    Catalogue: 1
}
exports.EnumFOTCon = {
    Rate: 1,
    Quantity: 2
}
exports.EnumRFPQuery = {
    draft: 1,
    sent: 2,
    replied: 3
}
exports.EnumRFPResponse = {
    draft: 1,
    sent: 2
}
exports.DocUpload = {
    COMLIST: "COMLIST",
    FINDOC: "FINDOC",
    RELATEDDOC: "RELATEDDOC",
    RFPDR: "RFPDR",
    TECDOC: "TECDOC",
    RFPDOC: "RFPDOC",
    CONFORM: "CONFORM",
    ACCEPTFORM: "ACCEPTFORM",
    AGREEFORM: "AGREEFORM",
    GUAFORM: "GUAFORM"
}
exports.PM = {
    BD: "BD",
    Cheque: "Cheque"
}
exports.TypeStatus = {
    Grant: 0,
    NotGranted: 1
}
exports.EmailStatus = {
    EmailNotSent: 0,
    EmailSent: 1
}
exports.EnumRFPApproach = {
    OneEnvelop: "OneEnvelop",
    TwoEnvelop: "TwoEnvelop"
}
exports.EnumRFPProcurement = {
    open: 0,
    close: 1
}
exports.EnumDOCOWNERTYPE = {
    RFPDOC: "RFPDOC",
    COMLIST: "COMLIST",
    TECDOC: "TECDOC",
    FINDOC: "FINDOC",
    RFPDR: "RFPDR",
    RELATEDDOC: "RELATEDDOC"
}
exports.EnumAppPackage = {
    eProcure: "eProcure",
    eRFP: "eRFP",
    eAuc: "eAuc",
    eCon: "eCon",
    All: "All"
}
exports.RIStatus = {
    Submitted: 1,
    Acknowledged: 2,
    Rejected: 3
}
exports.WOStatus = {
    Submitted: 1,
    PendingApproval: 2,
    Approved: 3,
    Cancelled: 4,
    Rejected: 5
}
exports.common = {
    RecordSave: "Record saved ",
    RecordDelete: "Record deleted",
    RecordNotDelete: "Record not deleted",
    RecordDuplicate: "Duplicate record found",
    RecordNotSave: "Record not saved",
    MsgTransDup: "Duplicate transaction number found Please contact your Administrator to rectify the problem",
    RecordUsrGrpCascade: "Deletion is not allow This user group is active and being used",
    RecordTiedTxn: "Deletion is not allow User has either created transaction or he/she is tied to an approval group",
    RecordUserCascade: "Deletion not allow. Due to record have active users. ",
    RecordUsed: "This ID has been taken previously Please enter another ID",
    MSGBFDELETE: "Are you sure you want to delete this record?",
    RecordDeleteNotAllowed: "Deletion is not allowed. It has outstanding PR(s).",
}

exports.EnumUploadType = {
    DocAttachment: 0,
    ProductImage: 1,
    ProductImagePath: 2,
    ProductAttachment: 3,
    ProductDocPath: 4,
    TermAndCond: 5,
    CoyLogo: 6,
    PDFDownload: 7,
    UserAttachment: 8,
    DOAttachment: 9,
    DocAttachmentTemp: 10,
    CompDocAttachment: 11,
}

exports.EnumUploadFrom = {
    FrontOff: 0,
    BackOff: 1,
}