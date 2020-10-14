import React from 'react'
import CONSTANTS from './constant';
import {CompareDate, CompareDateMoment, CompareDateQut} from '../../../Component/Dates/TimeZone'
const   HandlePayment =  (props) => {
    let _details = '';
    switch (props) {
        case "IBG" :
             return  "LOCAL BANK TRANSFER-(RM)"
        case "TT" :
            return "TELEGRAPHIC TRANSFER-(FOREIGN CURRENCY)"
        case "BC" :
            return "CHEQUE-(RM)"
        case "BD" :
            return "BANK DRAFT-(FOREIGN CURRENCY)"
        case "CO" :
            return "CASHIER'S ORDER-(RM)"
        default:
            return props
            break;
    }
    
};

const   HandleCategoryType =  (props) => {
    console.log('HandleCategoryType', props)
    switch (props) {
        case "D" :
             return "Disbursement"
        case "R" :
            return "Reimbursement"
       
        default:
            return props
            break;
    }
    
};



const   HandleDocType =  (props) => {
    let _details = '';
    switch (props) {
        case "INV" :
             return  "Invoice"
        case "CN" :
            return "Credit Note"
        case "DN" :
            return "Debit Note"
        case "BILL" :
            return "Bill"
        case "bill" :
                return "Bill"
        case "Letter" :
            return "Letter"
        case "LETTER" :
            return "Letter"
        default:
            return props
            break;
    }
    
};

const   HandlePaymentTerm =  (props) => {
    let _details = '';
    if(props){
        props = props.trim()
    }
    switch (props) {
        case "2" :
             return  "Cash On delivery"
        case "9" :
            return "7 Days"
        case "10" :
            return "14 Days"
        case "8" :
            return "15 Days"
        case "11" :
            return "21 Days"
        case "1" :
            return "30 Days"
        case "3" :
            return "45 Days"
        case "4" :
            return "60 Days"
        case "5" :
            return "90 Days"
        case "6" :
            return "120 Days"
        case "7" :
            return "180 Days"
        case 1 :
            return "30 Days"
        case 2 :
            return  "Cash On delivery"
        case 9 :
            return "7 Days"
        case 10 :
            return "14 Days"
        case 8 :
            return "15 Days"
        case 11 :
            return "21 Days"
        case 1 :
            return "30 Days"
        case 3 :
            return "45 Days"
        case 4 :
            return "60 Days"
        case 5 :
            return "90 Days"
        case 6 :
            return "120 Days"
        case 7 :
            return "180 Days"
            
        default:
            return props
            break;
    }
    
};



const   HandleStatus =  (props) => {
    let _status = (props) ? props.toString() : ''
    switch (_status) {
        case "1" :
             return "New Invoice and submitted to FO"
        case "2" :
            return "Pending approval from FM"
        case "3" :
            return "Approved by FM"
        case "19" :
            return "PSD Received"
        case "4" :
            return "Paid"
        case "10" :
            return "Draft"
        case "11" :
            return "Finance Verified"  
        case "12" :
            return "Finance Approved"  
        case "13" :
            return "FM Approved"
        case "14" :
            return "Rejected"
        case "15" :
            return "Void"
        case "16" :
            return "Submitted"
        case "17" :
            return "Department Approved"
        case "18" :
            return "E2P Verified"
        default:
            return ""
            break;
    }
    
};

const   TaxType =  (props) => {
    switch (props) {
        case "P" :
             return "Purchase"

        case "S" :
            return "Supply"

        default:
            return ""
            break;
    }
};

const   psa_po_status =  (row) => {
    console.log('psa_po_status', row)
    if(row.STAT=="Rejected By"){
        return 'Rejected'
    }
    else if(row.STATUS_DESC=="Rejected By" || row.STATUS_DESC=="Rejected" ){
        return 'Rejected'
    }
    else{
        return row.STAT
    }
};




const  getItemTypeName = (data) => {
    let res = '';
    if (data === 'SP') {
        res = 'Spot (Non-Inventoried item)';
    }
    else if (data === 'ST') {
        res = 'Stock (Direct material - Inventoried item)';
    }
    else {
        res = 'MRO, M&E and IT (Inventoried item)';
    }
    return res;
}

const NormalizeNumbers = values => {
    var regex = /^(\d+)?([.]?\d{0,2})?$/
    let _length = 0
    let _temp_values = values.toString()
    let _count = _temp_values.indexOf('.')

    if(values && _count>=0){
        _length = 9
    }
    else{
        _length = 6
    }

    console.log('_length', _length, _count)

    if (values.match(regex) && values.length<=_length) { 
        values = values.replace(/[^0-9\.]/g,'');
        return values
    }
}

const RemoveBlankSpace = values => {
    values = values.replace(/\s/g, '');
    return values
}

const QuoteRange = (myArray, value) =>{
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (var i=myArray.length-1; i>=0; i--) {
        tmp = myArray[i][value];
        if (tmp < lowest) lowest = tmp;
        if (tmp > highest) highest = tmp;
    }

    return {
        lowest : lowest,
        highest : highest
    }
}

const Indicator = val =>{
   
    if(val.RRM_Indicator == "0") {
        if (val.RRM_Offer_Till) {
            let _updated_details = CompareDateQut(val.RM_Reqd_Quote_Validity, val.RRM_Offer_Till)
            console.log('_updated_details', _updated_details)
            if (CompareDateQut(val.RM_Reqd_Quote_Validity, val.RRM_Offer_Till)) {
                return <div><i className="fa fa-thumbs-up font_blue_small"></i>
                <i className="fa fa-calendar-o font_blue_small"></i>
                </div>
            }
            else{
                return <i className="fa fa-thumbs-up font_blue_small"></i>
            }
        }
        else{
            return <i className="fa fa-thumbs-up font_blue_small"></i>
        }
    } 
    else if (val.RRM_Indicator == "1") {
        return <i className="fa fa-hand-o-right font_yellow"></i>
    }
    else if ((val.RRM_Actual_Quot_Num!='null') && val.RVM_V_RFQ_STATUS == "1" ) {
        // if (val.RVM_V_RFQ_STATUS == "1" && (val.RRM_Actual_Quot_Num || val.RRM_Actual_Quot_Num == "" || val.RRM_Actual_Quot_Num == " ")) {
        return <i className="fa fa-flag-o unble_to_supply"></i>
        // } 
        // else {
        //     return <i className="fa fa-hand-o-right font_yellow"></i>
        // }
    }
  
    else{
        return <i className="fa fa-thumbs-down font_red" ></i>
    }
}


let NumberFormate = (row) => {
    if(row && row>0){
       let total = 0.00
       row = parseFloat(row).toFixed(2)
       let nStr =  row
       nStr += '';
       var x = nStr.split('.');
       var x1 = x[0];
       var x2 = x.length > 1 ? '.' + x[1] : '';
       var rgx = /(\d+)(\d{3})/;
       while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
       }
       total = x1 + x2;
       return <div className="text-right"> {total}</div>

    }
    return <div className="text-right"> 0.00</div>
}

let NumberFormateEmpty = (row) => {
    if(row && row>0){
        console.log('number',row)
         let total = 0.00
         row = parseFloat(row).toFixed(2)
         let nStr =  row
         nStr += '';
         var x = nStr.split('.');
         var x1 = x[0];
         var x2 = x.length > 1 ? '.' + x[1] : '';
         var rgx = /(\d+)(\d{3})/;
         while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
         }
         total = x1 + x2;
         return  total
  
      }
      return '0.00'
}


let getstrStatus = (data, row={}) => {
    switch (data) {
        case 'Draft':
            return 'Draft';
        case 'Submitted':
        case 'Pending Approval':
            return 'Submitted for approval (Internal)';
        case 'New':
        case 'Open':
        case 'Approved':
            return 'Approved by management (Official)';
        case 'Accepted':
            return 'Accepted by vendor';
        case 'Closed':
            return 'Completed delivery and paid';
        case 'Cancelled':
        case 'Cancelled By':
            return 'Cancelled by  ' + row.NAME;
        case 'Rejected':
        case 'Rejected By':
            return 'Rejected by management / vendor';
        case 'Void':
            return 'Void draft PO';
        case 'Held By':
            return 'Held By ' + row.NAME;
    }

  

}

let  getPOStatus = (status) => {
    let dtg_POList = '';
    switch (status) {
      case "New":
        dtg_POList = "New"
        break;
      case "Open":
        dtg_POList = "New"
        break;
      case "Rejected":
        dtg_POList = "Cancelled"
        break;
      case "Cancelled":
        dtg_POList = "Cancelled"
        break;
      case "Closed":
        dtg_POList = "Closed"
        break;
      case "Accepted":
        dtg_POList = "Outstanding"
        break;
      default:
        dtg_POList = ""
        break;
    }
    return dtg_POList;
  }


  let  getPOStatusLsiting = (listing) => {
    let dtg_POList = '';
   
    if(listing.POM_PO_STATUS==6 || (listing.POM_PO_STATUS==3 && listing.POM_FULFILMENT==3)){
        dtg_POList = "Closed"
    }
    else if(listing.POM_PO_STATUS==4 || (listing.POM_PO_STATUS==5)){
        dtg_POList = "Cancelled"
    }
    else if( listing.POM_PO_STATUS==1 || listing.POM_PO_STATUS=="1 '1" || (listing.POM_PO_STATUS=="2 '8")){
        dtg_POList = "New"
    }
    else{
        dtg_POList = "Outstanding"
    }

    return dtg_POList;
  }

  let  getPOFullFillment = (status) => {
    let dtg_POList = '';
    let _status = [];
   
    if(status.includes('1,2')){
        _status.push(0)
    }
    if(status.includes("4,5")){
        _status.push(4,5,0)
    }
    if(status.includes("3,6")){
        _status.push(3)
    }
    if(status.includes(3) || status.includes('3')){
        _status.push(1,2)
    }
   
    return _status;
  }





  let ConvertMassApproval = (details) => {
    
    let _obj_details = {
        strIPPDocIdx : details.IM_INVOICE_INDEX,
        strRemark : 'Test',
        paymentmethod : details.IM_PAYMENT_TERM,
        paymentAmount :  details.IM_INVOICE_TOTAL,
        currentStatus :  details.IM_INVOICE_STATUS,
    }
    return _obj_details
  }

  let ConvertInvoiceMassApproval = (details) => {
    let _obj_details = {
        lblInvNo : details.IM_INVOICE_NO,
        vendorId : details.IM_S_COY_ID,
        txtRemark : details.REMARKS,
        total_amount : details.IM_INVOICE_TOTAL,
        folder :  "N",
        invoiceIndex :  details.IM_INVOICE_INDEX,
    }
    return _obj_details
  }

  
  const normalizePhone = value => {
    if (!value) {
      return value
    }
  
    const onlyNums = value.replace(/[^-()\d]/g, '')
    if (onlyNums.length <= 20) {
      return onlyNums
    }
    return `${onlyNums.slice(0, 20)}`
  }

 function bytesToSize(bytes) {
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes /  Math.pow(1024,1));
 }

 function CheckUpload(e){
    console.log('e.target.files[0].size', parseFloat(bytesToSize(e.target.files[0].size)))
    if(e.target.files && e.target.files.length && (parseFloat(bytesToSize(e.target.files[0].size))<= 10240)){
        return true
    }
    else if(e.target.files){
        e.target.value="";
        return false
    }
    else{
        return false
    }
 }


 function CheckNameLength(e){
    console.log('e.target.files', e.target.files)
    if(e.target.files && e.target.files.length && e.target.files[0].name && e.target.files[0].name.length  <= CONSTANTS.FILE.FILE_NAME_LENGTH){
        return true
    }
    else if(e.target.files){
        e.target.value="";
        return false
    }
    else{
        return false
    }
}

function CheckFileDetails(e){
    let _temp_Details  = { status : '', message :'', }
    let _condition_check = ['CheckNameLength','CheckUpload']
    for (var i = 0; i < _condition_check.length; ++i) {
        if(_condition_check[i]=="CheckNameLength"){
            let _details = CheckNameLength(e)
            _temp_Details = {status : _details, message : (_details) ? '' : 'File Name Too Large'}
            if(!_temp_Details.status){
               break
            }
        }
        if(_condition_check[i]=="CheckUpload"){
            let _details = CheckUpload(e)
            _temp_Details = {status : _details, message : (_details) ? '' : 'File size is Greater than Recommended file size is (10240 KB)'}
            if(!_temp_Details.status){
                break
            }
        }
    }
    return _temp_Details

}



function scrollToInvalid (errors){
    if (errors) {
        window.scrollTo({top: 130, behavior: 'smooth'});
    }
 };

 function Fixed2 (values){
    if (values) {
        return parseFloat(values).toFixed(2);
    }
    return '0.00'
 };

 function WordCount(word){
    word = word.replace(/(^\s*)|(\s*$)/gi,"");
    word = word.replace(/[ ]{2,}/gi," ");
    word = word.replace(/\n /,"\n");
    return word.split(' ').length;
 }


 function AppendStatus(status, details){
    let _details = WordCount(status);
    if(_details==1){
        return `${status} by management` 
    }
   
    else if(status=="Rejected By"){
        return status+' '+details.NAME
    }
    else if(status=="Cancelled By"){
        return status+' '+details.NAME
    }
    else if(status=="Held By"){
        return status+' '+details.NAME
    }
    else if(_details>1){
        return status
    }
    else{
        return status;
    }
}

function AppendStatusApprover(status, details){
    let _details = WordCount(status);
    if(_details==1){
        return `${status} by management` 
    }
    else if(status=="Rejected By"){
        return status+' Management'
    }
    else if(status=="Cancelled By"){
        return status+' Management'
    }
    else if(status=="Held By"){
        return status+' '+details.NAME
    }
    else if(_details>1){
        return status
    }
    else{
        return status;
    }
}

let getstrprStatus = (data) => {
    switch (data) {
        case 'Draft':
        return 'Draft';

        case 'Submitted':

        case 'Pending Approval':
        return 'Submitted for approval (Internal)';

        case 'New':
            
        case 'Open':

        case 'Approved':
        return 'Approved by management (Official)';

        case 'Accepted':
        return 'Accepted by vendor';

        case 'Closed':
        return 'Completed delivery and paid';

        case 'Cancelled':
        case 'Cancelled By':
        return 'Cancelled by  ' + data.NAME;

        case 'Rejected':
        case 'Rejected By':
        return 'Rejected by management / vendor';

        case 'Void':
        return 'Void draft PO';

        case 'Held By':
        return 'Held By ' + data.NAME;
    }
}


function AppendPrStatus(status, details){
    let _details = WordCount(status);
    if(status=="Rejected By"){
        return status+' '+details.NAME
    }
    else if(status=="Cancelled By"){
        return status+' '+details.NAME
    }
    else if(status=="Held By"){
        return status+' '+details.NAME
    }
    else if(_details>1){
        return status
    }
    else{
        return status;
    }
}

function FOrmatePRMassApprove(details, user_details){
    return {
        lblPRNo:details.PRM_PR_No,
        PRIndex:details.PRM_PR_Index,
        Requestor:details.PRM_BUYER_ID,
        strRemark:"",
        Consolidator:"",
        AO:user_details,
        txtRemark:""
    }
}

function HolidayAddPopup(status, details){
    let _temp_array =new Array();
        for(let i=0; i<10; i++){
        let  temp_object = {
                hm_index : i,
                hm_date : '',
                hm_desc : '',
        }
            _temp_array.push(temp_object)
        }
    return _temp_array
}

function round_decimal(value, precision) {
    return Math.round (value * 100) / 100 //returns 28.45
}

function FileNotFound(){
    window.open('/#/file_404', '_blank');
}

function RemoveSpecialCharacter(obj){
    var newObj = {};
    for (var i in obj) {
        console.log('obj[i]', obj[i])
        if(Array.isArray(obj[i])){
            newObj[i] = obj[i]
        }
        else if( typeof obj[i] === 'object' ){
            newObj[i] = obj[i]
        }

     
        else if(obj[i] instanceof Date){
            newObj[i] = obj[i]
        }
        else if(obj[i] === true){
            newObj[i] = true
        }
        else if(obj[i] === false){
            newObj[i] = false
        }
        else if(obj[i] == ""){
            newObj[i] = ""
        }
        else if(obj[i] == null){
            newObj[i] = null
        }
        else if(Number.isInteger(obj[i])){
            newObj[i] = obj[i]
        }
       
        else{
            newObj[i] = obj[i].replace(/[^\w\s/,/-]/gi, " ")
        }
        
        console.log('newObj', newObj, obj)
    }
    return newObj
}

let get_po_status_int = (data, row={}) => {
    console.log('get_po_status_int', data)
    switch (data) {
     
        case "Draft" :
            return "Draft"
        case "Submitted":
           return "Submitted for approval (Internal)"

        case "Pending Approval" :
        return "Submitted for approval (Internal)"

        case "New":

        case "New":
           return "Approved by management (Official)"

        case "Open":
            return "Approved by management (Official)"

        case "Approved":
            return "Approved by management (Official)"

        case "Accepted":
           return "Accepted by vendor"

        case "Closed":
           return "Completed delivery && paid"

        case "Cancelled":
        return "Cancelled by buyer"

        case "Cancelled By":
        return "Cancelled by buyer";
           

        case "Rejected":
           return "Rejected by management / vendor"

        case "Rejected By":
            return "Rejected by management / vendor"

        case "Void":
           return "Void draft PO"

        case "Held By":
            return 'Held By ' + row.NAME;
            
    }
}


export {HandlePayment, getItemTypeName, NormalizeNumbers, Indicator, HandleStatus, getstrStatus, getPOStatus, Fixed2, QuoteRange, NumberFormate, NumberFormateEmpty, HandlePaymentTerm, ConvertMassApproval, HandleDocType, HandleCategoryType, normalizePhone, bytesToSize, scrollToInvalid, ConvertInvoiceMassApproval, CheckUpload, WordCount, AppendStatus, CheckNameLength, CheckFileDetails, AppendPrStatus, HolidayAddPopup, TaxType, round_decimal, getPOStatusLsiting, FOrmatePRMassApprove, RemoveSpecialCharacter, RemoveBlankSpace, getPOFullFillment, AppendStatusApprover, psa_po_status, FileNotFound, get_po_status_int} 

