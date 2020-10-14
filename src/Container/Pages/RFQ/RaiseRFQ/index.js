import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import SelectField from '../../../../Component/SelectField'
import Loader from '../../../../Component/Loader'
import {addDate, convertYearToDate, TodayDateSalashDates, TodayDateSalash} from '../../../../Component/Dates'
import Filters from '../Filters/raise_req'
import Alert from '../../../../Component/Modal/alert'
import {FromUplodsParallel,FromInputs, FromSelect, FormRadioButtonSpan} from '../../../../Component/From/FromInputs'
import {ApiExtract} from '../../../../Common/GetDatas'
import {RFQSubmit, RFQSave} from '../../../../Apis/Approver'
import Modal from '../../../../Component/Modal'
import BootstrapTable from '../../../../Component/Table/BootstrapCustomTablePr'
import {RaiseRFQ} from '../../../../validation/TableValidation'
import FreeForm from '../../FreeForm'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {UserDetails} from '../../../../Common/LocalStorage'
import {CheckFileDetails} from '../../../../Actions/Common/Functions'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class Quotation extends Component {
    constructor(props){

        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.getProducts = this.getProducts.bind(this)
        this.getChecked = this.getChecked.bind(this)
        this.getProducts_updated = this.getProducts_updated.bind(this)
        this.handleTableInputs = this.handleTableInputs.bind(this);
        this.state = {
            products:[],
            all_products:[],
            start_data:new Date((new Date()).valueOf() + 1000*3600*24),
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "1", "4,5,0", "3"],
            end_data:new Date(),
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            status : false,
            loading: false,
            checked_initial : [0,1,2],
            checked_details:[],
            currency_list : [],
            payment_term_list : [],
            payment_method_list : [],
            shipment_mode_list : [],
            shipment_term_list : [],
            get_items:[],
            selected_vendor_list : [],
            checked_vendor_list:[],
            rendered:false,
            selected_vendor:[],
            selected_vendors:[],
            updated:false,
            refq_details : [],
            submit_type : '',
            rfq_id:'',
            rfqNo : '',
            edit_details : false ,
            external_file :'',
            external_file_name :'',
            attachments:[],
            delete:false,
            page_name : '',
            upload_status:false,
            table_inputs:[],
            modal_popup:false,
            modal_add_title : '',
            all_check_value : ['V'],
            vendor_details : '',
            rfq_add_item_search_rl:[],
            rfq_add_rendered :true,
            add_vendor : true,
            update_edit_status : true,
            show_action: true,
            modal_popup_title:'Select Vendor Companies',
            modal_popup_header:[
                {name : "Vendor Company Name", id:"CM_COY_NAME", key:true},
                {name : "Contact Details", id:"CM_ADDR_LINE1", formatter: (cellContent, row) => {

                    return (
                        <p>
                            {row.CM_ADDR_LINE1}<br></br>
                            {row.CM_ADDR_LINE2}<br></br>
                            {row.CM_ADDR_LINE3}<br></br>
                            {row.CM_POSTCODE} {row.CM_CITY}<br></br>
                            {row.CM_EMAIL}<br></br>
                            Tel : {row.CM_PHONE}<br></br>
                        </p>
                    )
                },},
            ],
            modal_popup_body:[],
        }
    }

    static getDerivedStateFromProps(props, state){
      if(props.search_result && (!state.rendered) && (!state.delete) && (state.show_status=="Draft")){
        return {
                attachments :  (props.search_result && props.search_result.displayAttachFile && props.search_result.displayAttachFile.attachFileList) ? props.search_result.displayAttachFile.attachFileList: [],
                pr_attachments:  (props.search_result && props.search_result.displayAttachFile && props.search_result.displayAttachFile.attachFileList) ? props.search_result.displayAttachFile.attachFileList: [],
                currency_list: (props.search_result.CurrencyList) ? props.search_result.CurrencyList : [],
                payment_term_list: (props.search_result.PaymentTermList) ? props.search_result.PaymentTermList : [],
                payment_method_list: (props.search_result.PaymentMethodList) ? props.search_result.PaymentMethodList : [],
                shipment_mode_list: (props.search_result.ShipmentModeList) ? props.search_result.ShipmentModeList : [],
                shipment_term_list: (props.search_result.ShipmentTermList) ? props.search_result.ShipmentTermList : [],
                get_items : (props.search_result.Bindgrid && props.search_result.Bindgrid.get_items) ? props.search_result.Bindgrid.get_items :[],
                selected_vendor : (props.search_result.BindPreDefinedVendor && props.search_result.BindPreDefinedVendor.BindPreDefinedVendor && props.search_result.BindPreDefinedVendor.BindPreDefinedVendor.GetPredefinedVendor) ? props.search_result.BindPreDefinedVendor.BindPreDefinedVendor.GetPredefinedVendor : [],
                rendered:(props.search_result.Bindgrid && props.search_result.Bindgrid.get_items) ? true : false,
                refq_details : (props.search_result.objread) ? props.search_result.objread : [],
                bindgrid_vendor : (props.search_result.Bindgrid_vendor) ? props.search_result.Bindgrid_vendor : [],
                get_RFQVenList : (props.search_result.Bindgrid_vendor && props.search_result.Bindgrid_vendor.get_RFQVenList) ? props.search_result.Bindgrid_vendor.get_RFQVenList : [],
                selected_vendor_list : (props.search_result.Bindgrid_vendor && props.search_result.Bindgrid_vendor.get_RFQVenListDetails && props.search_result.Bindgrid_vendor.get_RFQVenListDetails.get_RFQVenListDetails2) ? props.search_result.Bindgrid_vendor.get_RFQVenListDetails.get_RFQVenListDetails2 : [],
                modal_popup_body : (props.get_vendor) ? props.get_vendor : [],

            }
        }

        else if(props.rfq_add_item_search_rl && (!state.rfq_add_rendered)){
            return {
                rfq_add_item_search_rl : props.rfq_add_item_search_rl
            }
        }

        else if(props.upload_document && (state.upload_status)){

            return {
                attachments : (props.upload_document && props.upload_document.displayAttachFile && props.upload_document.displayAttachFile.attachFileList && props.upload_document.displayAttachFile.attachFileList.length>0) ? props.upload_document.displayAttachFile.attachFileList : [],
            }
        }



        else if(state.rendered && (!state.delete)  && (state.show_status=="Draft")){
            return {
                get_items : (props.search_result.Bindgrid && props.search_result.Bindgrid.get_items) ? state.get_items : [],
                modal_popup_body : (props.get_vendor) ? props.get_vendor : [],
            }
        }

        else if((!state.add_vendor)  && (state.show_status=="Draft")){
            return  {
                selected_vendor_list : state.selected_vendor_list
            }
        }



        else if(state.rendered && state.delete ){
            return {
                attachments :  (props.get_delete_file && props.get_delete_file.displayAttachFile && props.get_delete_file.displayAttachFile.attachFileList && props.get_delete_file.displayAttachFile.attachFileList.length>0) ? props.get_delete_file.displayAttachFile.attachFileList : [],
                modal_popup_body : (props.get_vendor) ? props.get_vendor : [],
            }
        }



        return {props, state}
    }

    componentDidMount(){

        this.props.GetVendorNameListService()
        this.props.GetCommodityTypeList()
        this.props.post_vendor()
        let _predefin_rfq = localStorage.getItem('rfq_from')
        if(this.props.location && this.props.location.datas && this.props.location.datas.rfq_id){
            this.props.get_search_list(this.props.location.datas);
            this.setState({
                rfq_id : this.props.location.datas.rfq_id,
                rfqNo  : this.props.location.datas.rfq_num,
                status : this.props.location.datas.status,
                loaded_data : false,
                edit_details : true,
            })

        }
        else if(_predefin_rfq){

            let _details = JSON.parse(_predefin_rfq)
            this.props.get_search_list(_details);
            this.setState({
                rfq_id : _details.rfq_id,
                rfqNo  : _details.rfq_num,
                status : _details.status,
                page_name :   _details.page_name,
                show_status : 'Draft',
                loaded_data : false,
                edit_details : true,
            })
        }
        else{
            this.props.get_search_list()
            this.setState({
                show_status : 'Draft'
            })
            this.props.change('rfqDto.rfqNumber', '')
        }

    }

    receiveproducts = (product) =>{

    }

    getChecked(details){
        let all_check_value = this.state.all_check_value;
        let _checked =  (details.target.name).replace ( /[^\d.]/g, '' );
        _checked = _checked.replace(".", "");

        if(_checked==1){
            _checked = 'V'
        }
        else if (_checked==2){
            _checked = 'B'
        }
        else{
            _checked = 'FF'
        }

        if(details.target.checked && (_checked=='V' || _checked=='B')){
            all_check_value= all_check_value.filter((list)=>{return list != 'FF'})
            all_check_value.push(_checked)
        }
        else if(details.target.checked && (_checked=='FF')){
            all_check_value = ['FF']
        }
        else{
            all_check_value= all_check_value.filter((list)=>{return list != _checked})
        }
        this.setState({all_check_value:all_check_value})
    }

    FileUpload = (attachment) => {
            let _get_details  = attachment.target;
        let _file_name ='';

        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType":0,
            "strDocType": "RFQ",
            "pEnumUploadForm": 0,
            "strDocNo": this.state.rfqNo,
            "blnTemp": "false",
            "strIndex": "RFQ",
            "seq": "",
            "pFrontOfficeSite": "",
            "AttachType": "E",
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
            "modeType": (this.state.rfqNo) ? "mod" : "New"
        }


        if(_file_name == "raisePOForm.externalAttachment" && this.state.external_file){
            req.AttachType = 'E';
            this.props.UploadDocuments(this.state.external_file, req)

            this.setState({
                filename:'',
                external_file : '',
                external_file_name :'',
                delete:false,
                upload_status:true
            })
            attachment.target.value = null
        }
        else{
            req.AttachType = '';
            this.setState({
                modal_title: 'File Upload Validation',
                title : 'File Upload Validation',
                modal_body: 'Choose a File to Upload',
                status : false,
                validation: true,
            })
        }




    }

    check_updated_details = (details) =>{
        if(details){
            this.props.get_search_list(details);
            this.setState({
                rfq_id : details.rfq_id,
                rfqNo  : details.rfq_num,
            })
        }
    }

    getPopupSelectedProduct =  (details, values) =>{
        let _all_products = this.state.checked_vendor_list;
        if(values){
            _all_products.push(details)
            this.setState({
                checked_vendor_list : _all_products
            })
        }
        else{
             let products = this.state.products.filter((fieldValue, index) => fieldValue.CM_COY_ID !== details.CM_COY_ID);
             this.setState({
                checked_vendor_list : products
            })
        }

    }

    show_model = () =>{
        this.setState({
            modal_add_item : true,
            modal_add_title:'Select Items',
        })
    }

    componentDidUpdate(){
        // console.log('get_details',this.props.get_details())
        let _predefin_rfq = localStorage.getItem('rfq_from')
        if(!this.state.updated){
            let _user_details = UserDetails();
            this.props.reset('RejectList');
            let values = this.state.refq_details;
            let _temp_details = {}
            _temp_details.rfqDto = '';
            if(values.pay_term  && values.pay_term.length<=2){
                if(this.state.payment_term_list && this.state.payment_term_list.length>0){
                    values.pay_term = (values.pay_term) ? values.pay_term.trim() : '';
                    let _mep_details = this.state.payment_term_list.filter((list_details)=>list_details.CODE_ABBR==values.pay_term)
                    if(_mep_details && _mep_details.length){
                        values.pay_term =  _mep_details[0].CODE_DESC
                    }
                }
            }
            else{
                values.pay_term = (values.pay_term) ? values.pay_term.trim() : '';
            }
            if(values.pay_type  && values.pay_type.length<=2){
                if(this.state.payment_method_list && this.state.payment_method_list.length>0){
                    values.pay_type = (values.pay_type) ? values.pay_type.trim() : '';
                    let _mep_details = this.state.payment_method_list.filter((list_details)=>list_details.CODE_ABBR==values.pay_type)
                    if(_mep_details && _mep_details.length){
                        values.pay_type =  _mep_details[0].CODE_DESC
                    }
                }
            }

            if(values.ship_term  && values.ship_term.length<=2){
                if(this.state.shipment_term_list && this.state.shipment_term_list.length>0){
                    values.ship_term = (values.ship_term) ? values.ship_term.trim() : '';
                    let _mep_details = this.state.shipment_term_list.filter((list_details)=>list_details.CODE_ABBR==values.ship_term)
                    if(_mep_details && _mep_details.length){
                        values.ship_term =  _mep_details[0].CODE_DESC
                    }
                }
            }

            if(values.ship_mode  && values.ship_mode.length<=2){
                if(this.state.shipment_mode_list && this.state.shipment_mode_list.length>0){
                    values.ship_mode = (values.ship_mode) ? values.ship_mode.trim() : '';
                    let _mep_details = this.state.shipment_mode_list.filter((list_details)=>list_details.CODE_ABBR==values.ship_mode)
                    if(_mep_details && _mep_details.length){
                        values.ship_mode =  _mep_details[0].CODE_DESC
                    }
                }
            }

            let _details = {
                rfqNumber : values.RFQ_Num,
                RFQDescription : values.RFQ_Name,
                currency :  (values.cur_code) ? values.cur_code : 'MYR',
                rfqUIExpiryDate :(values.exp_date)  ? TodayDateSalash(values.exp_date) : addDate(new Date(), 0),
                quotationUIValidityDate : (values.RFQ_Req_date)  ? TodayDateSalash(values.RFQ_Req_date) : addDate(new Date(), 2),
                contactPerson : (values.con_person) ? values.con_person : _user_details.UM_USER_NAME,
                contactNumber : (values.phone && values.phone!='undefined') ? values.phone :  _user_details.TEL_NO,
                email: (values.email) ? values.email : _user_details.UM_EMAIL,
                paymentTerm : (values.pay_term)? values.pay_term : '30 Days',
                paymentMethod :(values.pay_type)? values.pay_type :  'Cheque',
                shipmentTerm : (values.ship_term)? values.ship_term : 'Not Applicable',
                shipmentMode: (values.ship_mode)? values.ship_mode : 'Not Applicable',
                externalRemarks :  (values.remark && values.remark!='undefined' && typeof values.remark!='undefined')  ? values.remark : '',
            }

            // this.props.change('rfqDto.rfqUIExpiryDate', addDate(values.exp_date, 0))
            // this.props.change('rfqDto.quotationUIValidityDate',  addDate(values.exp_date, 3))

            console.log('_details',_details, values)

            if(this.props.location && this.props.location.datas && this.props.location.datas.rfq_id){
                if(_details.rfqNumber){
                    _temp_details.rfqDto = _details
                    _temp_details.rfqDto.rfqNumber = (_temp_details.rfqDto.rfqNumber) ? _temp_details.rfqDto.rfqNumber : _temp_details.rfqDto.RM_RFQ_No
                    this.props.initialize(_temp_details)
                    this.setState({
                        updated:true
                    })
                }
            }
            else if (_predefin_rfq){
                if(_details.rfqNumber){
                    _temp_details.rfqDto = _details
                    _temp_details.rfqDto.rfqNumber = (_temp_details.rfqDto.rfqNumber) ? _temp_details.rfqDto.rfqNumber : _temp_details.rfqDto.RM_RFQ_No
                    this.props.initialize(_temp_details)
                    this.setState({
                        updated:true
                    })
                }
            }
            else{
                _temp_details.rfqDto = _details
                this.props.initialize(_temp_details)
                this.setState({
                    updated:true
                })
                this.props.change('rfqDto.rfqNumber', '')
            }


        }

        if(!this.props.rendred){
            let _details = this.props.get_details();
            this.props.reset('RejectList');
            if(_details.rfq_id){
                this.props.get_search_list(_details);
                this.setState({
                    rfq_id : _details.rfq_id,
                    rfqNo  : _details.rfq_num,
                    show_status : _details.status,
                    loaded_data : true,
                    edit_details : true,
                })
                if(_details.show_status !="Draft"){
                    var element = document.getElementById('rfqDto.paymentTerm');
                    var event = new Event('change',{ bubbles: true });
                    element.dispatchEvent(event);
                }
            }
        }

        if(this.state.update_edit_status && this.state.get_items.length>0 && this.state.get_items[0].hasOwnProperty('RD_PR_LINE_INDEX') && this.state.get_items[0].RD_PR_LINE_INDEX){
            this.setState({
                show_action : false,
                update_edit_status : false
            })
        }
    }

    closemodel = () => {
        this.setState({
            model : false,
            modal_popup : false,
            modal_add_item :false
        })
        if(this.state.submit_type=="Submit"){
            localStorage.removeItem('rfq_from');
            window.location.reload();
        }


    }

    get_details(details){
        this.props.history.push({
            pathname : '/ViewPRDetails',
            datas : {
                PRM_PR_Index :  details.PRM_PR_Index,
                PRM_PR_No :  details.PRM_PR_NO,
            },
        })
    }







    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
                //end_data:date
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
            })
       }
    }

    handlefromsubmit(values){
        let _form_value = values;
        let _initial_obj = {
            Doc_num: "",
            VenName: this.state.vendor_details,
        }
         _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        if(!_form_value.rfqDto && !_form_value.rfqDto.RFQDescription){
            _form_value.rfqDto.RFQDescription =""
        }
        _form_value.rfqDto = RemoveSpecialCharacter(_form_value.rfqDto)
        this.props.get_search_list(_form_value)
    }



    download_pdf = (details) => {
      let _pdf_datas = { RFQId: details.RM_RFQ_ID, SCoyID: details.RVM_V_Company_ID, Quo_no: details.RRM_Actual_Quot_Num, Rfq_no: details.RM_RFQ_No };
      this.props.downlod_pdf(_pdf_datas)
    }

    getVendorDetails = (details) =>{
        if(details.target.value){
            var tempVendorList = this.state.selected_vendor_list;
            console.log('tempVendorList', tempVendorList)
            let vendorIndex = tempVendorList.findIndex(t => t.CM_COY_ID === "339201P160");
            if (vendorIndex === -1) {
                let pacificObj = { "ROWNUM": 302, "CM_COY_ID": "339201P160", "CM_COY_NAME": "PACIFIC", "CM_ADDR_LINE1": "NO18, JALAN PEMAJU U1/15", "CM_ADDR_LINE2": "HICOM GLENMARIE INDUSTRIAL PARK ", "CM_ADDR_LINE3": "", "CM_POSTCODE": "40150", "CM_CITY": "SHAH ALAM ", "CM_STATE": "2322", "CM_COUNTRY": "MY", "CM_EMAIL": "michelletangcx@strateqgroup.com", "CM_PHONE": "+60355693322" }
                tempVendorList.push(pacificObj);
            }
            let vendorIndexSec = tempVendorList.findIndex(t => t.CM_COY_ID === "339201S531");
            if (vendorIndexSec === -1) {
                let securityObj = { "ROWNUM": 366, "CM_COY_ID": "339201S531", "CM_COY_NAME": "Securit", "CM_ADDR_LINE1": "8trium office tower, Jalan Cempaka SD12/5 , Bandar", "CM_ADDR_LINE2": "tower 2, level 7 , unit 6", "CM_ADDR_LINE3": "", "CM_POSTCODE": "52200", "CM_CITY": "kuala lumpur", "CM_STATE": "2310", "CM_COUNTRY": "MY", "CM_EMAIL": "narimah@strateqgroup.com", "CM_PHONE": "+600133701998" }
                tempVendorList.push(securityObj);
            }

            this.setState({
                selected_vendors : tempVendorList
            })
        }
    }

    remove_vendor  = (val) => {

        let _selected_vendor_list = this.state.selected_vendor_list;

        var tempVendorList = [..._selected_vendor_list];
        let vendorIndex = tempVendorList.findIndex(t => t.CM_COY_ID === val.CM_COY_ID);
        if (vendorIndex !== -1) {
            tempVendorList.splice(vendorIndex, 1);
            console.log('remove_vendor', tempVendorList)
            this.setState({
                selected_vendor_list : tempVendorList
            })
        }
    }

    delete_rfq_item = (data,main_index) => {
        let tempitemList = [...this.state.get_items];
        let vendorIndex = tempitemList.map((t, index) =>{
            if(main_index === index){
                let _removed={}
                _removed.removed = 1
               return _removed;
            }
            else{
                return t
            }
        })
        console.log('vendorIndex', vendorIndex, tempitemList, data)
        this.setState({
            get_items : vendorIndex
        })
    }

    delete_file = (details) =>{
        let _user_details = UserDetails();
        details.CDA_ATTACH_FILENAME = details.strFile;
        details.CDA_ATTACH_INDEX = details.ID;
        details.CDA_DOC_NO =  (this.state.rfqNo) ? this.state.rfqNo : ""
        details.CDA_FILESIZE = details.Text
        details.CDA_HUB_FILENAME = details.strFile1
        details.CDA_COY_ID = _user_details.UM_COY_ID
        details.CDA_STATUS = '';
        this.setState({
            delete:true,
            upload_status:false
        })
        details.AttachType = 'E';
        details.modeType =  (this.state.rfqNo) ? "Mod" : "New"
        this.props.post_delete_file(details)
    }

    SendUpload = (e) => {
        let _details  = CheckFileDetails(e);
        if(_details.status){
            if(e.target.name=="raisePOForm.externalAttachment"){
                this.setState({
                    external_file : e.target.files[0],
                    external_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }
            else{

            }
        }
        else{
            this.setState({
                modal_body:_details.message,
                loading:false,
                model:true,
                status: false,
            })
        }
    }




    save_details = async(formData, submit_type) => {
        let _submit_type = (formData && formData.submit_type) ? formData.submit_type : ''
        let _vendor_list = this.state.selected_vendor;
        let _vendor_list_main ='';
        if(formData.rfqDto && formData.rfqDto.RFQDescription){
            if(formData.rfqDto && formData.rfqDto.contactPerson){
                _vendor_list.forEach((list,index)=>{
                    if(list.RVDLM_User_Id && _vendor_list_main != list.RVDLM_User_Id){

                    }
                    else{
                        _vendor_list.splice(index);
                    }
                    _vendor_list_main = list.RVDLM_User_Id
                })
                let VendorList = _vendor_list
                let _form_data = formData;
                let _selected_vendor_list = this.state.selected_vendor_list
                let _items_list= this.state.get_items
                _items_list = _items_list.filter((list)=>list.removed!=1)
                var eDate = TodayDateSalashDates(_form_data.rfqDto.rfqUIExpiryDate);
                var vDate = TodayDateSalashDates(_form_data.rfqDto.quotationUIValidityDate);
                var cDate = TodayDateSalashDates(new Date());


                if (((cDate > eDate) || (cDate > vDate)) || (vDate <= eDate)) {
                    this.setState({
                        modal_title : 'Validation',
                        modal_body : 'Please select valid expiry date & validity date ?',
                        model : true,
                        status : false,
                    })
                }
                else if ((_selected_vendor_list.length<=0) && _submit_type!='Save'){
                    this.setState({
                        modal_title : 'Validation',
                        modal_body : 'Choose a vendor to send quotation',
                        model : true,
                        status : false,
                    })
                }
                else if ((_items_list.length<=0) && _submit_type!='Save'){
                    this.setState({
                        modal_title : 'Validation',
                        modal_body : 'Add item to send quotation',
                        model : true,
                        status : false,
                    })
                }
                else {


                    let tempReq = {};
                    _form_data.rfqDto.rfq_id = this.state.rfq_id;
                    _form_data.rfqDto.rfqNumber = this.state.rfqNo;
                    tempReq.RFQData = _form_data.rfqDto;
                    tempReq.RFQData.SelectedVendors = [];
                    for (let index = 0; index < VendorList.length; index++) {
                        const element = VendorList[index];
                        element.TYPE = "list";
                        element.Added = "Y";
                    }
                    tempReq.RFQData.VendorList = VendorList;
                    tempReq.RFQData.ItemList = _items_list;
                    console.log('_items_list', _items_list)
                    let tempVendorList = [];
                    for (let index = 0; index < _selected_vendor_list.length; index++) {
                        const element = _selected_vendor_list[index];
                        if(element.CM_COY_ID){
                            let temp = {
                                "CoyId": "",
                                "RVDLM_List_Name": "",
                                "RVDLM_List_Index": "4",
                                "TYPE": "list",
                                "Added": "Y"
                            }
                            temp.CoyId = element.CM_COY_ID;
                            temp.RVDLM_List_Name = element.CM_COY_NAME;
                            tempVendorList.push(temp);
                        }
                    }
                    tempReq.RFQData.buttonType = formData.submit_type;
                    tempReq.RFQData.closeRFQ = '';
                    tempReq.RFQData.externalAttachment = '';
                    tempReq.RFQData.externalFileAttached = '';
                    tempReq.RFQData.openRFQ = 0;
                    tempReq.RFQData.closeRFQ = '';
                    tempReq.RFQData.quotationValidityDate = vDate;
                    tempReq.RFQData.rfqDescription = _form_data.rfqDto.RFQDescription;
                    tempReq.RFQData.rfqExpiryDate = eDate;
                    tempReq.RFQData.RM_RFQ_OPTION = '0';
                    tempReq.RFQData.vendorPreDefinedList = '';
                    tempReq.RFQData.VendorListDetails = tempVendorList;
                    if(tempReq.RFQData.VendorList && tempReq.RFQData.VendorList.length<=0){
                        let _temp_date = []
                        _temp_date.push(tempVendorList[0])
                        tempReq.RFQData.VendorList = (tempVendorList && tempVendorList.length) ? _temp_date : [];
                    }

                    console.log('_tempReq', tempReq)
                    if(_items_list.length && _selected_vendor_list.length && this.state.rfqNo){
                        // let _get_exe_data = await this.saveItem(_items_list)
                        // if(_get_exe_data){
                            this.setState({loading:true})
                            let _status =  await ApiExtract(RFQSubmit, tempReq)
                            if(_status){
                                this.setState({
                                    status: _status.status,
                                    model:true,
                                    modal_body: _status.message,
                                    loading:false,
                                    submit_type : formData.submit_type
                                })
                            }
                        // }

                    }
                    else if(_items_list.length && _selected_vendor_list.length && (!this.state.rfqNo)){
                        this.setState({loading:true})
                        let _status =  await ApiExtract(RFQSave, tempReq)
                        if(_status){
                            this.setState({
                                status: _status.status,
                                model:true,
                                modal_body: _status.message,
                                loading:false,
                                submit_type : formData.submit_type,
                                rfqNo : (_status.status && _status.response && _status.response.returnRFQNUMBER) ? _status.response.returnRFQNUMBER : ''
                            })

                            if((_status.status && _status.response && _status.response.returnRFQNUMBER)){
                                this.props.change('rfqDto.rfqNumber',  _status.response.returnRFQNUMBER)
                            }
                        }
                    }
                    else if(_submit_type=='Save'){

                        this.setState({loading:true})
                        let _status =  await ApiExtract(RFQSave, tempReq)
                        if(_status){
                            this.setState({
                                status: _status.status,
                                model:true,
                                modal_body: _status.message,
                                loading:false,
                                submit_type : formData.submit_type,
                                rfqNo : (_status.status && _status.response && _status.response.returnRFQNUMBER) ? _status.response.returnRFQNUMBER : ''
                            })

                            if((_status.status && _status.response && _status.response.returnRFQNUMBER)){
                                this.props.change('rfqDto.rfqNumber',  _status.response.returnRFQNUMBER)
                            }
                        }
                    }

                }
            }
            else{
                this.setState({
                    status:false,
                    model:true,
                    modal_body: "Contact Person is required",
                    loading:false,
                })
            }
        }
        else{
            this.setState({
                status:false,
                model:true,
                modal_body: "Enter RFQ Description",
                loading:false,
            })
        }
    }

    handlepopformsubmit = (values) =>{
        let _values = values
        this.props.GetRfqAddItemSearch ({
            "strSearchCatType":(this.state.all_check_value && this.state.all_check_value.length==1) ? this.state.all_check_value[0] : (this.state.all_check_value &&  this.state.all_check_value.length>1) ? '' : '',
            "strDesc":(values.contractcatlog && values.contractcatlog.ItemName) ? values.contractcatlog.ItemName :'',
            "strCommodity":(values.contractcatlog && values.contractcatlog.ItemName) ? values.contractcatlog.CommodityType :'',
        })

        this.setState({
            rfq_add_rendered :false
        })
    }

    ShowVendor = () => {
        this.setState({ modal_popup : true})

    }

    updateData = () =>{
        let _checked_vendor_list  = this.state.checked_vendor_list
        let _selected_vendor_list = this.state.selected_vendor_list
        if(_checked_vendor_list.length){
            let _final_vendor_list = [..._selected_vendor_list,..._checked_vendor_list]
            this.setState({
                selected_vendor_list : _final_vendor_list,
                checked_vendor_list : [],
                modal_popup : false,
                add_vendor : false,
            })
        }
    }

    componentWillMount(){

    }

    update_items = (details) =>{
        let _user_details = UserDetails();
        let _current_product = this.state.get_items;
       if(details.length){
        let _sub_details =  details.map((details, index)=>{
            if (details.RD_QUANTITY && typeof details.RD_QUANTITY !=="undefined" && details.RD_QUANTITY>0) {
                return {
                    RD_COY_ID: _user_details.UM_COY_ID,
                    RD_PRODUCT_CODE: "",
                    RD_QUANTITY : details.RD_QUANTITY,
                    RD_PRODUCT_DESC : details.ITEM_DESC,
                    Type: "A",
                    RD_UOM: details.CDI_UOM,
                    RD_DELIVERY_LEAD_TIME : (details.RD_DELIVERY_LEAD_TIME) ? details.RD_DELIVERY_LEAD_TIME : 0,
                    RD_VENDOR_ITEM_CODE : '',
                    RD_WARRANTY_TERMS : 0,
                }
            }

        })

        let _temp_array = [..._current_product, ..._sub_details]
        let _final_array = [];
        _temp_array.forEach((list)=>{
            if(list && list.RD_COY_ID){
                _final_array.push(list)
            }

        })
        this.setState({
            get_items : _final_array,

        })

       }
    }

    handleTableInputs(details, names, new_details){
        let {table_inputs, rfq_add_item_search_rl} = this.state;
        let _empty_details = new Array();
        let _new_details = new Array()
        names = details.target.getAttribute('data-details')
        new_details = details.target.getAttribute('data-name')
        if(names=="RD_QUANTITY"){
            _empty_details[`${new_details}`] = {
                RD_QUANTITY :  (details.target.value && details.target.value >= 0 ) ? details.target.value : 0
            };
        }
        else{
            _empty_details[`${new_details}`] = {
                RD_DELIVERY_LEAD_TIME :  (details.target.value && details.target.value >= 0 ) ? details.target.value : 0
            };
        }



        _new_details[`${new_details}`] = Object.assign({}, table_inputs[`${new_details}`],  _empty_details[`${new_details}`])
        table_inputs[`${new_details}`] = _new_details[`${new_details}`]

        if(rfq_add_item_search_rl && rfq_add_item_search_rl.length){
            let _temp_details = rfq_add_item_search_rl[`${new_details}`];
            rfq_add_item_search_rl[`${new_details}`] = Object.assign({}, _temp_details,  _empty_details[`${new_details}`])
        }



        this.setState({
                table_inputs : table_inputs,
                rfq_add_item_search_rl : rfq_add_item_search_rl
        })
    }

    HandleChange = (selectedOption) =>{
        this.setState({
            vendor_details : selectedOption
        })
    }

    getProducts (values, details){
        console.log('getProducts', values, details)
        let _all_products = this.state.products;
        let input_details = this.state.table_inputs
        let _current_product = this.state.get_items;
        if(details){
            values.checked = "false"
            _all_products.push(values)
            this.setState({
                products : _all_products
            })
        }
        else{
            let products = this.state.products.filter((fieldValue, index) => fieldValue.CDI_PRODUCT_CODE !== values.CDI_PRODUCT_CODE);
            this.setState({
                products : products
            })
        }
    }

    saveItem = async (table_body) =>{
        let _result = true;
        if(table_body.length){
            await table_body.forEach((list_details)=>{
                if(!list_details.hasOwnProperty('removed')){
                    if(!list_details.hasOwnProperty('COMMDITY_TYPE') || !list_details.COMMDITY_TYPE){
                        this.setState({
                            status: false,
                            model:true,
                            modal_body : 'Please choose valid Commodity Type',
                            loading:false,

                        })
                        _result = false
                    }
                    else{

                    }
                }

            })
        }
        return _result


    }

     getProducts_updated (){
        let _user_details = UserDetails();
        let _all_products = this.state.products;
        let _current_product = this.state.get_items;
        let _table_inputs = this.state.table_inputs
        let rfq_add_item_search_rl = this.state.rfq_add_item_search_rl;

        if(_all_products){

            let _sub_details =  _all_products.map((details, main_index)=>{
                let _details = _table_inputs.filter((list_details, index)=> index == details.RVDLM_List_Index);

                rfq_add_item_search_rl.map((details_map, index)=>{
                    console.log('details_map.PM_PRODUCT_CODE ', details_map.PM_PRODUCT_CODE , details.PM_PRODUCT_CODE, main_index)
                    if(details_map.PM_PRODUCT_CODE == details.PM_PRODUCT_CODE){
                        _details = (_table_inputs && _table_inputs.hasOwnProperty(index)) ? _table_inputs[index] : {}
                    }
                })



                if (_details.RD_QUANTITY && typeof _details.RD_QUANTITY !=="undefined" && _details.RD_QUANTITY>0) {
                    return {
                        RD_COY_ID: _user_details.UM_COY_ID,
                        RD_PRODUCT_CODE: details.PM_PRODUCT_CODE,
                        RD_QUANTITY : (_details.RD_QUANTITY && typeof _details.RD_QUANTITY !=="undefined") ? _details.RD_QUANTITY : 0,
                        RD_PRODUCT_DESC : details.PM_PRODUCT_DESC,
                        Type: "A",
                        RD_UOM: details.PM_UOM,
                        RD_DELIVERY_LEAD_TIME :  (_details.RD_DELIVERY_LEAD_TIME && typeof _details.RD_DELIVERY_LEAD_TIME !=="undefined") ? _details.RD_DELIVERY_LEAD_TIME : 0,
                        RD_VENDOR_ITEM_CODE : details.PM_UOM,
                        RD_WARRANTY_TERMS : 0,
                    }
                }
                else{
                    return {
                        RD_COY_ID:_user_details.UM_COY_ID,
                        RD_PRODUCT_CODE: details.PM_PRODUCT_CODE,
                        RD_QUANTITY : 0,
                        RD_PRODUCT_DESC : details.PM_PRODUCT_DESC,
                        Type: "A",
                        RD_UOM: details.PM_UOM,
                        RD_DELIVERY_LEAD_TIME :  (_details.RD_DELIVERY_LEAD_TIME && typeof _details.RD_DELIVERY_LEAD_TIME !=="undefined") ? _details.RD_DELIVERY_LEAD_TIME : 0,
                        RD_VENDOR_ITEM_CODE : details.PM_UOM,
                        RD_WARRANTY_TERMS : 0,
                    }
                }
            })


            let _temp_array = [..._current_product, ..._sub_details]
            let _final_array = [];
            _temp_array.forEach((list)=>{
                if(list && list.RD_COY_ID){
                    _final_array.push(list)
                }
            })

            rfq_add_item_search_rl.forEach((list,index)=>{
                let _details = rfq_add_item_search_rl[index]
                _details.RD_QUANTITY = 0
                _details.RD_DELIVERY_LEAD_TIME = 0
                rfq_add_item_search_rl[index] = _details
            })




            this.setState({
                get_items : _final_array,
                products : [],
                modal_add_item : false,
                rfq_add_rendered : true,
                table_inputs : [],
                rfq_add_item_search_rl : rfq_add_item_search_rl
            })

        }

    }

    getPage_details(details, cell, row){
        console.log('getPage_details',details, cell, row)
        let _req = { "pid": cell.CDI_PRODUCT_CODE, "companyType": "B", "index": "", "draft": "0", "Ref": cell.CDM_GROUP_CODE };
        localStorage.setItem('item_details',JSON.stringify(_req));
        window.open('/#/itemCodePage', '_blank');
    }

    render(){
        console.log('selected_vendor_list', this.state.selected_vendor_list)
        console.log('attachments', this.state.attachments)

        const { handleSubmit, submitting } = this.props
        const _table_header = [
            {name : "Item Name", id:"PM_PRODUCT_DESC", key:true, width:'232px'},
            {name : "UOM", id:"PM_UOM", key:false, width:'66px'},
            {name : "List Price", id:"PM_UNIT_COST", key:false, width:'121px',dataFormat:"number"},
            {name : "Vendor", id:"CM_COY_NAME", key:false, width:'184px'},
            {name : "Qty", id:"RD_QUANTITY", key:false, width:'184px',dataFormat:"rfqinput"},
            {name : "Delivery Lead Time (Days)", id:"RD_DELIVERY_LEAD_TIME", key:false, width:'184px', dataFormat:"rfqinput"},
       ];

       const _table_header_b = [
        {name : "Item Name", id:"PM_PRODUCT_DESC", key:true, width:'232px'},
        {name : "UOM", id:"PM_UOM", key:false, width:'66px'},
        {name : "List Price", id:"PM_UNIT_COST", key:false, width:'121px',dataFormat:"number"},
        {name : "Qty", id:"RD_QUANTITY", key:false, width:'184px',dataFormat:"rfqinput"},
        {name : "Delivery Lead Time (Days)", id:"RD_DELIVERY_LEAD_TIME", key:false, width:'184px', dataFormat:"rfqinput"},
       ]

        let {pr_attachments, attachments} = this.state
        pr_attachments = (pr_attachments) ? pr_attachments.filter((list)=>list.Text!="No Files Attached") : []
        attachments = (attachments) ? attachments.filter((list)=>list.Text!="No Files Attached") : []

        let _pr_file = (pr_attachments) ? pr_attachments.filter((list)=>list.Text=="No Files Attached") : []
        let _rfq_file = (attachments) ? attachments.filter((list)=>list.Text=="No Files Attached") : []
        let  _table_data_header = [
            {name : "RFQ Number", id:"RM_RFQ_No", width:'160px', key:true, type:"index" , key:true, formatter: (cellContent, row) => {
              return (
                  <button className="btn btn-sm btn-outline-primary" >{row.RM_RFQ_No} </button>
              )
            }},
            {name : "RFQ Description", id:"RM_RFQ_Name", width:'120px'},
            {name : "Quotation Number", id:"RRM_Actual_Quot_Num", width:'160px', formatter: (cellContent, row) => {
              return (row.RRM_Actual_Quot_Num) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.download_pdf(row)}>{row.RRM_Actual_Quot_Num} </button> : ''
            }},
            {name : "Expire Date", id:"RM_Expiry_Date", width:'144px', dataFormat:"date"},
            {name : "Quotation Validity", id:"RM_Reqd_Quote_Validity", width:'144px', dataFormat:"date"},
            {name : "Vendor(s)", id:"RVM_V_Company_ID", width:'89px'},
            {name : "Currency", id:"RRM_Currency_Code", width:'100px'},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
              {(this.props.dr_loading) ? <Loader /> : '' }
              {(this.props.fue_loading) ? <Loader /> : '' }
              {(this.props.fd_loading) ? <Loader /> : '' }
              {(this.props.df_loading) ? <Loader /> : '' }

            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading
                heading="Raise RFQ"
                subheading="Determine the RFQ Option, fill the RFQ Header, set the vendor list and add item to raise your RFQ. You can save the RFQ as a draft copy by pressing the Save button and submit it to the vendor once it is ready by pressing the Submit button."
            />



            <div className="mt-2 row">
                <div className="col-lg-2 col-md-2 col-sm-5 col-5"><label for="openRFQ">RFQ Option : </label></div>
                <div className="col">
                    <div className="form-check-inline"><label for="openRFQ" className="form-check-label"><input name="rfqDto.openRFQ" type="radio" className="form-check-input" disabled="" id="openRFQ"  checked="true"/> Open RFQ</label></div>
                    <div className="form-check-inline"><label for="closeRFQ" className="form-check-label"><input name="rfqDto.openRFQ" type="radio" className="form-check-input" id=" openRFQ" disabled="disabled" /> Close RFQ</label></div>
                </div>
            </div>
            <TabHeading color={'bg-info text-white'}>RFQ Header</TabHeading>
            <div className="row mt-2 raise_rfq">
                    <div className='col-12 col-md-12'>
                        <Filters
                            read_status = {(this.state.show_status=="Draft") ? false : true }
                            start_data = {this.state.start_data}
                            end_data = {this.state.end_data}
                            handleDate = {this.handleDate}
                            checked_details = {this.state.checked_details}
                            type="quotation"
                            currency_list= {this.state.currency_list}
                            payment_term_list= {this.state.payment_term_list}
                            payment_method_list = {this.state.payment_method_list}
                            shipment_mode_list = {this.state.shipment_mode_list}
                            shipment_term_list = {this.state.shipment_term_list}
                            vendor_list = {[]}
                            handleDate = {this.handleDate}
                            start_date = {this.state.start_data}
                            end_date = {this.state.end_data}
                        />

                    </div>
                        <div className='col-12 col-md-6'>
                            <div className="row mt-3">
                                <FromUplodsParallel name="raisePOForm.externalAttachment" id ="external_attachment" decs="Recommended file size is 10240 KB" label="External Attachment :" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="row mt-2">
                                <div className="col-12 col-sm-12 col-md-6">
                                    <div className="row">
                                        <label className="col-12 col-sm-3 col-md-3">External File Attached : </label>
                                        <div className="col-12 col-sm-9 col-md-9">
                                            {(pr_attachments && pr_attachments.length) ? pr_attachments.map((list)=>{
                                                if(list.Text!=='No Files Attached' && list.CDA_DOC_TYPE=="PR" && list.CDA_TYPE=="E"){
                                                    return <p className="download-files"><u><span onClick={() => this.props.download_documents(list)}>{list.strFile} ({list.Text} KB) &nbsp;&nbsp;</span></u> </p>
                                                }
                                            }):''}
                                            {(attachments && attachments.length) ? attachments.map((list)=>{
                                                if(list.Text!=='No Files Attached' && list.CDA_DOC_TYPE=="RFQ"){
                                                    return <p className="download-files"><u><span onClick={() => this.props.download_documents(list)}>{list.strFile} ({list.Text} KB) &nbsp;&nbsp;</span></u> <span ><i onClick={(e)=>this.delete_file(list)} className="fa fa-trash" aria-hidden="true"></i></span></p>
                                                }
                                            }): ''}
                                            {(_pr_file.length && _rfq_file.length ) ? 'No Files Attached' : ''}
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TabHeading color={'bg-info text-white'}>Set Vendor List</TabHeading>
                    <div className="row mt-2">
                        <div className="col-12 col-md-9">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6 parallel-label"><label>Select Vendor from Pre-Defined List :</label></div>
                                <div className="col-12 col-md-6">
                                    <select name="rfqDto.paymentTerm" className="form-control" id="rfqDto.paymentTerm" onChange = {(e)=>this.getVendorDetails(e)} ref={(input)=> this.myinput = input}>
                                        <option value="">--Select--</option>
                                        {this.state.selected_vendor.map((res, index) => {return ( <option key={index} value={JSON.stringify(res)}>{res.RVDLM_List_Name}</option>)})}
                                    </select>
                                    <div className="text-danger"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 parallel-label"><label>Select Vendor from Vendor List :</label> </div>
                        <div className="col-lg-4 col-sm-12 col-xs-12 align-select-details" >
                            <button type='button' className="btn btn-sm btn-secondary ml-2 mt-2" onClick={this.ShowVendor} disabled={(this.state.show_status=="Draft") ? false : true }>Select</button>
                        </div>
                    </div>
                    <div className="row mt-2">
                    <div className="col-12">
                     <div className="table-responsive">
                     <table className="table table-bordered" >
                                <thead className="bg-info text-white">
                                    <tr>
                                        <th>Selected Vendors </th>
                                        <th>Contact Details</th>
                                        {(this.state.show_status=="Draft") ? <th>Delete</th> : ''}
                                    </tr>
                                </thead>
                                <tbody >
                                    {(this.state.selected_vendor_list && this.state.selected_vendor_list.length>0) ? this.state.selected_vendor_list.map((value, index) => {
                                        let _details =`${value.CM_ADDR_LINE1}
                                         ${value.CM_ADDR_LINE2}
                                         ${value.CM_ADDR_LINE3}
                                         ${value.CM_POSTCODE}
                                         ${value.CM_CITY} ${value.CM_EMAIL}  ${value.CM_PHONE}`
                                        if(value.CM_COY_NAME){
                                            return (
                                                <tr key={index}>
                                                    <td>{value.CM_COY_NAME}</td>
                                                     <td><p>{  _details  }</p></td>
                                                    {(this.state.show_status=="Draft") ? <td>
                                                        <button  type='button' className="btn btn-danger" onClick={() => this.remove_vendor(value)}><span className="fa fa-close"></span></button>
                                                    </td> : ''}
                                                </tr>
                                            )
                                        }
                                    }) : <tr> <td colSpan="3" className="text-center">No vendors are found </td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-12">
                     <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="bg-info text-white">
                                    <tr>
                                        <th scope="col">Item Name<span className="text-danger"> * </span></th>
                                        <th scope="col">UOM</th>
                                        <th scope="col">QTY<span className="text-danger"> * </span></th>
                                        <th scope="col">Delivery Lead Time (days)+ </th>
                                        <th scope="col">Warranty Terms (mths)</th>

                                        {(this.state.show_action && this.state.show_status=="Draft") ?<th scope="col">Action</th> : ''}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.get_items.map((value, index) => {
                                        if(value && value.removed!=1){
                                            return (
                                                <tr key={index}>
                                                    <td>{value.RD_PRODUCT_DESC}</td>
                                                    <td>{value.RD_UOM}</td>
                                                    <td><input disabled={!this.state.show_action} type="text" className="form-control textboxstyle text-right" onChange={(e) => value.RD_QUANTITY = e.target.value} defaultValue={value.RD_QUANTITY} readOnly={ false }/></td>
                                                    <td>
                                                        <input disabled={!this.state.show_action} type="text" className="form-control textboxstyle text-right" onChange={(e) => value.RD_DELIVERY_LEAD_TIME = e.target.value} defaultValue={value.RD_DELIVERY_LEAD_TIME} readOnly={ false } /></td>
                                                    <td><input disabled={!this.state.show_action} type="text" className="form-control textboxstyle text-right" onChange={(e) => value.RD_WARRANTY_TERMS = e.target.value} defaultValue={value.RD_WARRANTY_TERMS} readOnly={ false }/></td>
                                                    {(this.state.show_action && this.state.show_status=="Draft") ? <td><span className="btn btn-sm btn-info ml-2" onClick={() => this.delete_rfq_item(value,index)}>Delete Item</span></td> : ''}
                                                </tr>);
                                        }

                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="text-left mt-2 row">
                    <div className="col-12 mt-2">
                        <p>+0 denotes Ex-Stock. <br/>* indicates required field</p>
                    </div>
                </div>

                <div className="col-12">
                        <div className="text-center mt-2 row">
                            <div className="col-12 mt-2">
                                {(this.state.show_action) ?
                                  <Fragment>
                                      <button type="button"  disabled={submitting} className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>this.show_model()}>Add Item</button>
                                  </Fragment>
                                : ''}

                                {(this.state.show_status=="Draft") ?
                                    <Fragment>
                                        <button type="submit"  disabled={submitting} className="ml-4 btn btn-sm btn-outline-success" onClick={handleSubmit(values => this.save_details({  ...values, submit_type: 'Save'}))}>Save</button>
                                        <button type="button"  disabled={submitting} className="ml-4 btn btn-sm btn-outline-primary" onClick={handleSubmit(values => this.save_details({  ...values, submit_type: 'Submit'}))}>Submit</button>
                                    </Fragment>
                                 : '' }
                            </div>
                        </div>
                    </div>
                </form>
                <Alert
                    title={this.state.modal_title}
                    message={this.state.modal_body}
                    status={this.state.status}
                    show={this.state.model}
                    confirm={this.closemodel}
                />
                <Modal open={this.state.modal_popup} header ={true} title ={this.state.modal_popup_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                        <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.updateData }>Save</button>
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                        {(this.state.modal_popup_body) ?
                        <Fragment>
                            <form onSubmit={handleSubmit(this.handlepopformsubmit.bind(this))}>
                                <div className="mt-2">
                                    <BootstrapTable
                                        table_header={this.state.modal_popup_header}
                                        table_body={this.state.modal_popup_body}
                                        select={true}
                                        responsive={false}
                                        products = {this.getPopupSelectedProduct}
                                        selected_checkbox={this.state.selected}
                                        inputPrefix = 'PrDto'
                                    />
                                </div>
                            </form>
                        </Fragment>
                        :''}
                </Modal>

              <Modal size={'lg'} open={this.state.modal_add_item} header ={true} title ={this.state.modal_add_title} closemodel={this.closemodel} footer={false} footercontent={<Fragment>
                        <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.update_items }>Save</button>
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                    {(this.state.modal_popup_body) ?
                    <Fragment>
                        <form onSubmit={handleSubmit(this.handlepopformsubmit.bind(this))}>
                        <div className="row">
                            <div className="col-12">
                                <Field type="text" name="PurchaseRequestListing.status[1]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Vendor Catalogue" checked={this.state.all_check_value.includes('V')}/>
                                <Field type="text" name="PurchaseRequestListing.status[2]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Purchaser Catalogue" checked={this.state.all_check_value.includes('B')}/>
                                <Field type="text" name="PurchaseRequestListing.status[3]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Free From" checked={this.state.all_check_value.includes('FF')}/>
                            </div>
                            <div className="col-6">
                                <div className="row mt-2">
                                    <Field type="text" name="contractcatlog.ItemName" component={FromInputs} className="form-control" placeholder="Item Name" label="Item Name" />
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12">
                                        <label>Vendor</label>
                                        <SelectField options={(this.props.vendor_name_list_service && this.props.vendor_name_list_service.VendorList) ? this.props.vendor_name_list_service.VendorList : []} handleChange={this.HandleChange} selectedOption={this.state.vendor_details}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row mt-2">
                                    <Field name="contractcatlog.CommodityType" className="form-control mb-3" component={FromSelect} label={"Commodity Type :"}>
                                        <option selected value="">--Select--</option>
                                        {this.props.commodity_list && this.props.commodity_list.CommodityList && this.props.commodity_list.CommodityList.map((list)=>{
                                            return     <option key={list.value} value={list.value} >{list.label}</option>
                                        })}
                                    </Field>
                                </div>
                                <div className="col-6">
                                    <div className="row mt-4">
                                        <label>&nbsp;</label>
                                        <button type="submit" className="btn btn-primary">Search</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!this.state.all_check_value.includes('FF')  ?
                            <div className="mt-2">
                                    {(this.state.all_check_value &&  this.state.all_check_value.length==1 && this.state.all_check_value[0]=="B") ? <BootstrapCustomTable input_values = {this.state.table_inputs} change={true}  getInputs={this.handleTableInputs} table_header={_table_header_b} table_body={this.state.rfq_add_item_search_rl} products={this.getProducts} select={true} selectname={'itemcode'} /> :'' }
                                    {(this.state.all_check_value &&  this.state.all_check_value.length==1 && this.state.all_check_value[0]=="V") ? <BootstrapCustomTable input_values = {this.state.table_inputs} change={true}  getInputs={this.handleTableInputs} table_header={_table_header} table_body={this.state.rfq_add_item_search_rl} products={this.getProducts} select={true} selectname={'itemcode'} /> :'' }
                                    {(this.state.all_check_value &&  this.state.all_check_value.length>1) ? <BootstrapCustomTable input_values = {this.state.table_inputs} change={true}  getInputs={this.handleTableInputs} table_header={_table_header} table_body={this.state.rfq_add_item_search_rl} products={this.getProducts} select={true} selectname={'itemcode'} /> :'' }
                                    <div className="row">
                                        <div className="col-12">
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={this.closemodel}>Close</button>
                                            <button type="button" className="btn btn-sm btn-outline-primary ml-2" onClick={()=>this.getProducts_updated()}>Save</button>
                                        </div>
                                    </div>
                            </div>
                        : ''}

                        {this.state.all_check_value.includes('FF')  ?
                            <div className="mt-2">
                                <FreeForm
                                    type={'rfq'}
                                    select getdata={this.update_items} closemodel={this.closemodel}
                                />
                            </div>
                        : ''}
                        </form>
                    </Fragment>
                    :''}
              </Modal>
        </Fragment>
    }
}



export default reduxForm({
    form:'RaiseRFQMain',
    validate:RaiseRFQ
})(Quotation);
