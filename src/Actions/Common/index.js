import * as Actions from '../Actions';
import {Menus, EAdminMenus} from '../../Apis/RequesterServices';
import {UserDetails} from '../../Common/LocalStorage'
const GetMenus = () => {
    return (dispatch) => {
        Menus().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.MENU_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.MENU_FAILURE, payload:receiveddata.errMessage})
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

const GetEAdminMenus  = () => {
    return (dispatch) => {
        EAdminMenus().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.MENU_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.MENU_FAILURE, payload:receiveddata.errMessage})
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


const GetPrSave = (datas) =>{
   
    return {
          "prNo": "",
          "requestName": "",
          "requestContact": "",
          "internalRemarks": "",
          "date": "",
          "attentionTo": "",
          "externalRemarks": "",
          "PrintRemark": "",
          "PrintCustom": "",
          "Urgent": "",
          "prType": "",
          "pr_cost": '',
          "AM_ADDR_CODE": "",
          "AM_ADDR_LINE1": "",
          "AM_ADDR_LINE2": "",
          "AM_ADDR_LINE3": "",
          "AM_POSTCODE": "",
          "AM_STATE": "",
          "AM_CITY": "",
          "AM_COUNTRY": ""
    }
   
}

const GetSavePo =(datas) => {
   
    return {
        "VendorID": "",
        "Attn": "",
        "PaymentType": "",
        "ShipmentTerm": "",
        "ShipmentMode": "",
        "CurrencyCode": "",
        "ExchangeRate": 0,
        "PaymentTerm": 1,
        "ShipVia": "",
        "BillingMethod": "",
        "InternalRemark": "InternalRemark",
        "ExternalRemark": "ExternalRemark",
        "PrintCustom": "",
        "PrintRemark": "",
        "ShipAmt": 0,
        "BillAddrCode": "",
        "BillAddrLine1": "",
        "BillAddrLine2": "",
        "BillAddrLine3": "",
        "BillAddrPostCode": "",
        "BillAddrState": "",
        "BillAddrCity": " ",
        "BillAddrCountry": "",
        "RfqIndex": "",
        "QuoNo": "",
        "Urgent": "1",
        "CM_PHONE": "",
        "CM_EMAIL": "",
        "CM_FAX": "",
        "POCost": 1,
        "lblPONo": ""
    }
}

const GetCustomData = () => {
    return {
        "PCD_PR_LINE": 1,
        "PCD_FIELD_NO": "1",
        "PCD_FIELD_VALUE": "Critical"
    }
}


const GetPrDto = () =>{
    return {
        "PRODUCTCODE": "",
        "UNITCOST": "",
        "PRODUCTDESC": "",
        "VENDORITEMCODE": "",
        "ITEMLINE": "",
        "UOM": "",
        "SOURCE": "",
        "PR_QTY": "",
        "AMOUNT": "",
        "TOLERANCE": "",
        "REMARK": "",
        "CDGROUP": "",
        "QUANTITY": "",
        "ITEMINDEX":"",
        "CATEGORYCODE": "",
        "COMMODITY": "",
        "GLCODE": "",
        "TAXCODE": "",
        "GSTRateDesc": "",
        "GSTRate": "",
        "GST": "",
        "CDI_GST": "",
        "GstTaxCode": "",
        "MOQ": "",
        "MPQ": "",
        "CURRENCY": "",
        "VENDOR": "",
        "ACCT": "",
        "CDM_GROUP_INDEX":"",
        "RFQ_QTY": "",
        "PRD_ASSET_GROUP": "",
        "POD_ASSET_GROUP": "",
        "PRD_ASSET_NO": "",
        "POD_ASSET_NO": "",
        "POD_TAX_VALUE":"",
        "GIFT": "N",
        "PERSONCODE": "",
        "PROJECTCODE": "",
        "PERSONCODEDESC":"",
        "PROJECTCODEDESC": "",
        "GLDESCRIPTION": "",
        "reMarks": "",
        "deliveryDate":"",
        "warrentyTerms": "",
        "segmentation": "",
        "costCentre": "",
        "prdAcctIndex": 122,
        "deliveryAddress": "",
        "AM_ADDR_CODE": "",
        "AM_ADDR_LINE1": "",
        "AM_ADDR_LINE2": "",
        "AM_ADDR_LINE3": "",
        "AM_CITY":"",
        "AM_STATE": "",
        "AM_POSTCODE": "",
        "AM_COUNTRY":"",
        "STATE": "",
        "COUNTRY":"",
        "deliveryUIDate": "",
       
      }
}

const GetPrDtoSave = () =>{
return {
        "COYID":"339201P160",
        "ITEMINDEX":"",
        "PRODUCTCODE":"",
        "VENDORITEMCODE":"",
        "PRODUCTDESC":"",
        "UOM":"",
        "RFQ_QTY":"",
        "QUANTITY":"",
        "UNITCOST":"",
        "MOQ":"",
        "MPQ":"1.00",
        "REMARK":" ",
        "POM_EXTERNAL_REMARK":"",
        "GSTRATE":"",
        "GST":"",
        "ITEMCODE":"",
        "AMOUNT":"",
        "ITEMLINE":"",
        "ETD":"",
        "WARRANTYTERMS":"",
        "CATEGORYCODE":"",
        "GLCODE":"",
        "TAXCODE":"",
        "TOLERANCE":"",
        "SOURCE":"",
        "CDGROUP":"",
        "CDM_GROUP_INDEX":"",
        "ACCT":"",
        "POD_ASSET_GROUP":"",
        "POD_ASSET_NO":"",
        "POD_TAX_VALUE":"",
        "GstTaxCode":"",
        "GIFT":"",
        "FUNDTYPE":"",
        "PERSONCODE":"",
        "PROJECTCODE":"",
        "FUNDTYPEDESC":"",
        "PERSONCODEDESC":"",
        "PROJECTCODEDESC":""
    }
}

const GetFFSave = () =>{
    return {
        "lblPONo":"",
        "Date":"",
        "Urgent":"1",
        "VendorID":"",
        "CurrencyCode":"",
        "ExchangeRate":"",
        "PaymentTerm":"",
        "PaymentType":"",
        "ShipmentTerm":"",
        "ShipmentMode":"",
        "ShipVia":"",
        "Attn":"",
        "BillTo":"",
        "address1":"",
        "address2":",",
        "address3":"",
        "PostCode":",",
        "City":"",
        "State":"",
        "Country":"",
        "InternalRemark":"",
        "ExternalRemark":"",
        "CustomFields":"",
        "Remark":"",
        "BillingMethod":"",
        "BillAddrCode":"",
        "BillAddrLine1":"",
        "BillAddrLine2":"",
        "BillAddrLine3":"",
        "BillAddrPostCode":"",
        "BillAddrState":"",
        "BillAddrCity":"",
        "BillAddrCountry":"",
        "PrintRemark":"0",
        "PrintCustom":"0",
        "POCost":"",
        "RfqIndex":"NULL",
        "QuoNo":"NULL",
        "ShipAmt":"1.0"
    }
}

const GetFFDto = () => {
    return {
        "PRODUCTCODE":"",
            "UNITCOST":"2",
            "PRODUCTDESC":"pencil",
            "VENDORITEMCODE":"",
            "ITEMLINE":1,
            "UOM":"Box",
            "SOURCE":"FF",
            "PR_QTY":"",
            "AMOUNT":"",
            "TOLERANCE":"0",
            "REMARK":"",
            "CDGROUP":"",
            "QUANTITY":"",
            "ITEMINDEX":"",
            "CATEGORYCODE":"",
            "COMMODITY":"",
            "GLCODE":"1130300000",
            "TAXCODE":"",
            "GSTRateDesc":"",
            "GSTRate":"",
            "GST":0,
            "CDI_GST":"",
            "MOQ":"",
            "MPQ":"",
            "CURRENCY":"MYR",
            "VENDOR":"",
            "ACCT":"",
            "CDM_GROUP_INDEX":"",
            "RFQ_QTY":"",
            "PRD_ASSET_GROUP":"",
            "PRD_ASSET_NO":"",
            "POD_GST_RATE":"",
            "POD_TAX_VALUE":"",
            "GstTaxCode":"",
            "GIFT":"N",
            "FUNDTYPE":"",
            "PERSONCODE":"",
            "PROJECTCODE":"",
            "FUNDTYPEDESC":"",
            "PERSONCODEDESC":"",
            "PROJECTCODEDESC":"",
            "GLDESCRIPTION":"",
            "costCentre":"",
            "prdAcctIndex":"",
            "deliveryUIDate":"",
            "ProductType":"",
            "WARRANTYTERMS":"",
            "POD_ASSET_GROUP":"",
            "POD_ASSET_NO":"",
            "ETD":0,
            "GSTRATE":0,
            "ITEMCODE":"",
            "DeliveryAddr":"",
            "deliveryAddress":"",
            "AM_ADDR_CODE":"",
            "AM_ADDR_LINE1":"",
            "AM_ADDR_LINE2":"",
            "AM_ADDR_LINE3":"",
            "AM_CITY":"",
            "AM_STATE":"",
            "AM_POSTCODE":"",
            "AM_COUNTRY":"",
            "STATE":"",
            "COUNTRY":""
    }
}

const GetFreeFormSave = () =>{
    return {
    "RFQPOSubmit":{
       "POCost":"1",
       "modeType":"new",
       "modePR":"",
       "RFQ_Num":"",
       "ListingFromRFQ":"",
       "POData":{
          "lblPONo":"",
          "Date":"",
          "Urgent":"1",
          "VendorID":"",
          "CurrencyCode":"",
          "ExchangeRate":"",
          "PaymentTerm":"",
          "PaymentType":"",
          "ShipmentTerm":"",
          "ShipmentMode":"",
          "ShipVia":"",
          "Attn":"",
          "BillTo":"",
          "address1":"",
          "address2":",",
          "address3":"",
          "PostCode":",",
          "City":"",
          "State":"",
          "Country":"",
          "InternalRemark":"",
          "ExternalRemark":"",
          "CustomFields":"",
          "Remark":"",
          "BillingMethod":"",
          "BillAddrCode":"",
          "BillAddrLine1":"",
          "BillAddrLine2":"",
          "BillAddrLine3":"",
          "BillAddrPostCode":"",
          "BillAddrState":"",
          "BillAddrCity":"",
          "BillAddrCountry":"",
          "PrintRemark":"0",
          "PrintCustom":"0",
          "POCost":"",
          "RfqIndex":"NULL",
          "QuoNo":"NULL",
          "ShipAmt":"1.0"
       },
       "POitemDetails":{
             "PRODUCTCODE":"",
             "UNITCOST":"2",
             "PRODUCTDESC":"pencil",
             "VENDORITEMCODE":"",
             "ITEMLINE":1,
             "UOM":"Box",
             "SOURCE":"FF",
             "PR_QTY":"",
             "AMOUNT":"",
             "TOLERANCE":"0",
             "REMARK":"",
             "CDGROUP":"",
             "QUANTITY":"",
             "ITEMINDEX":"",
             "CATEGORYCODE":"",
             "COMMODITY":"",
             "GLCODE":"1130300000",
             "TAXCODE":"",
             "GSTRateDesc":"",
             "GSTRate":"",
             "GST":0,
             "CDI_GST":"",
             "MOQ":"",
             "MPQ":"",
             "CURRENCY":"MYR",
             "VENDOR":"",
             "ACCT":"",
             "CDM_GROUP_INDEX":"",
             "RFQ_QTY":"",
             "PRD_ASSET_GROUP":"",
             "PRD_ASSET_NO":"",
             "POD_GST_RATE":"",
             "POD_TAX_VALUE":"",
             "GstTaxCode":"",
             "GIFT":"N",
             "FUNDTYPE":"",
             "PERSONCODE":"",
             "PROJECTCODE":"",
             "FUNDTYPEDESC":"",
             "PERSONCODEDESC":"",
             "PROJECTCODEDESC":"",
             "GLDESCRIPTION":"",
             "costCentre":"",
             "prdAcctIndex":"",
             "deliveryUIDate":"",
             "ProductType":"",
             "WARRANTYTERMS":"",
             "POD_ASSET_GROUP":"",
             "POD_ASSET_NO":"",
             "ETD":0,
             "GSTRATE":0,
             "ITEMCODE":"",
             "DeliveryAddr":"",
             "deliveryAddress":"",
             "AM_ADDR_CODE":"",
             "AM_ADDR_LINE1":"",
             "AM_ADDR_LINE2":"",
             "AM_ADDR_LINE3":"",
             "AM_CITY":"",
             "AM_STATE":"",
             "AM_POSTCODE":"",
             "AM_COUNTRY":"",
             "STATE":"",
             "COUNTRY":""
          }
       
    }
 }
}

const GetContinueDocument = () =>{
    return {
        "DocType": "",
        "DocNo": "",
        "InvIdx":"",
        "OldDocNo": "",
        "DocDate": "",
        "lateReason": "",
        "ManualPONo": "",
        "VendorName": "",
        "VenCompIDX": "",
        "VenAddrLine1": "",
        "VenAddrLine2": "",
        "VenAddrLine3": "",
        "VenAddrPostCode": "",
        "VenAddrState": "",
        "VenAddrCity": "",
        "VenAddrCountry": "",
        "CurrencyCode": "",
        "PaymentAmt": "",
        "PaymentMethod": "IBG",
        "WHT": "",
        "WHTOpt": "",
        "NoWHTReason": "",
        "InternalRemark": "",
        "ExchangeRate": "",
        "OldVenCompIDX": "411",
        "BankCode": "",
        "BankAccount": "",
        "DocDueDate": "",
        "PRCSSentDate": "",
        "PRCSReceivedDate": "",
        "BeneficiaryDetails": "",
        "MasterDocument": "",
        "CompanyCategory": "",
        "ResidentType": "",
        "EmpId": "",
        "TotalAmtNoGST": "6",
        "GSTAmt": "1",
        "btnType": "save",
        "status": "",
        "GSTTotalIM1IM3": "",
        "itemTotalAmt": "",
        "isResident": "",
        "lblDocDueDate": "",
        "rbtnCoyTypeSelectedValue": ""
    }
}

const e2pItems = (_i=1) =>{
    let _user_details = UserDetails();
    return {
        "ID_INVOICE_LINE": _i,
        "ID_PRODUCT_DESC": "",
        "ID_UOM": "Unit",
        "ID_GST": 0,
        "GIFT": "N",
        "FUNDTYPE": "IT Non-Linked-Par Fund",
        "PERSONCODE": "",
        "PROJECTCODE": "",
        "FUNDTYPEDESC":"IT Non-Linked-Par Fund",
        "ID_GST_RATE": "ZR",
        "ID_GST_INPUT_TAX_CODE": "",
        "ID_GST_OUTPUT_TAX_CODE": "",
        "ID_GST_REIMB": "R",
        "ID_GST_VALUE": 0,
        "ID_RECEIVED_QTY": 1,
        "ID_UNIT_COST": 0,
        "ID_B_GL_CODE": "",
        "ID_PAY_FOR": "Own Co.",
        "ID_REF_NO": "",
        "ID_COST_CENTER": "",
        "ID_COST_CENTER_DESC": "",
        "ID_BRANCH_CODE": "",
        "ID_BRANCH_CODE_NAME": "",
        "ID_COST_ALLOC_CODE": "",
        "ID_ASSET_GROUP": "",
        "ID_ASSET_GROUP_DESC": "",
        "ID_ASSET_SUB_GROUP": "",
        "ID_ASSET_SUB_GROUP_DESC": "",
        "ID_GLRULE_CATEGORY_INDEX": "",
        "ID_GLRULE_CATEGORY": "",
        "ID_WITHHOLDING_TAX": null,
        "ID_WITHHOLDING_OPT": "",
        "ID_WITHHOLDING_REMARKS": "",
        "ID_CATEGORY": "Mixed",
        "ID_GIFT": "N",
        "ID_ANALYSIS_CODE1": "ITNP",
        "ID_ANALYSIS_CODE2": "",
        "ID_ANALYSIS_CODE3": "",
        "ID_ANALYSIS_CODE4": "",
        "ID_ANALYSIS_CODE5": "",
        "ID_ANALYSIS_CODE6": "",
        "ID_ANALYSIS_CODE7": "",
        "ID_ANALYSIS_CODE8": "",
        "ID_ANALYSIS_CODE9": "",    
        "CC_COY_ID": (_user_details && _user_details.UM_COY_ID) ? _user_details.UM_COY_ID : '',
        "CC_CC_CODE": "A1DIN",
        "CAM_CA_CODE": "",
        "TM_TAX_CODE": "NS"
    }
}

const e2pItemsmultiple = () =>{
    let _temp_details = []
    for(let _i = 0; _i<10;  _i++){
        _temp_details[_i] = e2pItems(_i)
    }
    return _temp_details; 
}

export { 
    GetMenus,GetEAdminMenus, GetPrSave, GetPrDto, GetCustomData, GetSavePo, GetPrDtoSave, GetFreeFormSave, GetFFSave, GetFFDto, GetContinueDocument, e2pItems, e2pItemsmultiple
};