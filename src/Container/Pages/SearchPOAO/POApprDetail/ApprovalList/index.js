import React, {Component, Fragment} from 'react';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../../Component/Loader'
import Alert from '../../../../../Component/Modal/alert'
import ConfirmationModel from '../../../../../Component/Modal/ConfirmationModel'
import {ApiExtract} from '../../../../../Common/GetDatas'
import {AproveSubmit, RejectPO, HoldPO, DuplicatePO} from '../../../../../Apis/Approver'
import {addDate, TodayDateSalash, CompareDateMoment, CalcDateUpdate} from '../../../../../Component/Dates'
import {UserDetails} from '../../../../../Common/LocalStorage'
import Enum from '../../../../../Common/GlobalEnum'
import {FromTextareaParallel, FromUplodsParallel, FormDatePickerReact} from '../../../../../Component/From/FromInputs'
import {NumberFormate, HandlePaymentTerm, CheckFileDetails} from '../../../../../Actions/Common/Functions'
import PageHeading from '../../../../../Component/Heading/PageHeading';

class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.SendUpload = this.SendUpload.bind(this)
        this.RejectPr = this.RejectPr.bind(this)
        this.DuplicatePr = this.DuplicatePr.bind(this)
        
        this.HoldPr = this.HoldPr.bind(this)
        this.ApprovePr = this.ApprovePr.bind(this)
        this.process_details = this.process_details.bind(this)
        this.download_files = this.download_files.bind(this)
        this.delete_file = this.delete_file.bind(this)
        this.ClearAll = this.ClearAll.bind(this)
        this.state = {
            products:{},
            start_data:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            all_check_value:[],
            model:false,
            modal_error:false,
            modal_errors:'',
            remarks:'',
            req_data:{},
            dto_data:{},
            loading:false,
            status :false, 
            attachment : [],
            delete : false, 
            rendered:false,
            pom_details : {},
            pod_details : [],
            custom_field_details : [],
            custom_fields : [],
            approval_flow_table : [],
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            show_view : true,
            upload_status : false
        }
    }
    
    closemodel = () => {
        this.setState({
            model : false,
            modal_error : false
        })
        if(this.state.status && this.state.confimation_type!='reject'){
            this.props.get_search_list(this.props.location.datas)
            this.setState({ rendered:false})
            this.props.ClearUploadDocuments()
        }
        else if(this.state.status && this.state.confimation_type=="reject"){
            this.props.history.push({pathname : '/'})
            this.props.ClearUploadDocuments()
        }
    }

 

    get_details(details){
        this.props.history.push({
            pathname : '/viewpr',
            datas : details.datas,
        })
    }

    static getDerivedStateFromProps(props, state){
        if((!state.rendered) &&  (props.search_result) &&  (!state.upload_status)){
            return {
                rendered:(props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POD_DETAILS.length > 0 ) ? true : false,
                pom_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POM_DETAILS.length > 0 ) ? props.search_result.allInfo.POM_DETAILS[0] : {},
                pod_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POD_DETAILS.length > 0 ) ? props.search_result.allInfo.POD_DETAILS : [],
                custom_field_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POD_DETAILS.length > 0 ) ? props.search_result.allInfo.CUSSTOM_FILED_DETAILS : [],
                custom_fields : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POD_DETAILS.length > 0 ) ? props.search_result.allInfo.CUSTOM_FILED : [],
                approval_flow_table : (props.search_result && props.search_result.apprFlow && props.search_result.apprFlow.getApprFlow) ? props.search_result.apprFlow.getApprFlow: [],
                attachment:[]
            }
        }

       

        else if((!state.delete) && (state.rendered) && (props.upload_document) && (props.upload_document.displayAttachFile)){
            console.log('updates_1')
            return {
                rendered:false ,
                attachment:props.upload_document.displayAttachFile
            }
        }
        else if((!state.delete) && (!state.rendered) && (props.upload_document) && (props.upload_document.displayAttachFile)){
            console.log('updates_2')
            return {
                attachment:props.upload_document.displayAttachFile
            }
        }
        else if( (!state.rendered) && state.delete && (props.file_delete) && (props.file_delete.displayAttachFile)){
            console.log('updates_3')
            return {
                attachment:props.file_delete.displayAttachFile
            }
        }
        else{
            return {
                pom_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POM_DETAILS.length > 0 ) ? props.search_result.allInfo.POM_DETAILS[0] : {},
                pod_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POD_DETAILS.length > 0 ) ? props.search_result.allInfo.POD_DETAILS : [],
                approval_flow_table : (props.search_result && props.search_result.apprFlow && props.search_result.apprFlow.getApprFlow) ? props.search_result.apprFlow.getApprFlow: [],
            }
        }
        return {props, state}
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date,
                end_data:date
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:date
            })
       }
    }

    handlefromsubmit(values){
        let _form_value = values;
        let _initial_obj = {
            PRNumber: "",
            VendorName : "",
            StartDate: (this.state.start_data) ? this.state.start_data  :"",
            EndDate: (this.state.end_data) ? this.state.end_data  :"",
            prType : "",
        }
        _form_value.ApproveDto = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        this.props.get_search_list(_form_value)
    }

    FileUpload = (attachment) => {
        let _user_details = UserDetails()
        this.setState({delete:false})
        let _get_details  = attachment.target;
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType":8,
            "strDocType": "PO",
            "pEnumUploadForm": "0",
            "strDocNo": ((this.state.pom_details) ? this.state.pom_details.POM_PO_INDEX:''),
            "blnTemp": "false",
            "strIndex": "AO",
            "seq": "2",
            "pFrontOfficeSite": "",
            "AttachType": "E",
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
            "modeType": "New"
        }

        if(this.state.approval_flow_table){
            let apprFlow =  this.state.approval_flow_table;
            let _final_details =  this.state.approval_flow_table;
            this.state.approval_flow_table.sort(function (a, b) {
                return a.PRA_SEQ - b.PRA_SEQ;
            });
            for (let index = 0; index < _final_details.length; index++) {
                const element = apprFlow[index];
                let user_id = _user_details.UM_USER_ID;
                if (apprFlow[index].PRA_AO === user_id || apprFlow[index].PRA_A_AO === user_id) {
                    req.seq = element.PRA_SEQ;
                }
            }
        }
        

        if(_file_name == "ApproveDto.internalAttachment" && this.state.internal_file){
            req.AttachType = 'E';
            this.props.UploadDocuments(this.state.internal_file, req)
            this.setState({
                internal_file:'',
                internal_file_name:'',
                external_file:'',
                external_file_name:'',
                upload_status:true,
            })
            attachment.target.value = "";
                
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: "Select a file to upload",
                loading:false,
            })
        }
       
    }

    SendUpload = (e) => {
        let _details  = CheckFileDetails(e);
        if(_details.status){
            if(e.target.name=="ApproveDto.internalAttachment"){
                if(e.target.files && e.target.files.length){
                    this.setState({
                        internal_file : e.target.files[0],
                        internal_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                    })
                }

            }
            else if(e.target.name=="prDto.externalAttachment"){
                if(e.target.files && e.target.files.length){
                    this.setState({
                        external_file : e.target.files[0],
                        external_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                    })
                }
            }
            else{

            }
        }
        else{
            this.setState({
                status: false,
                model:true,
                 modal_body:_details.message,
                loading:false,
            })
        }
    }

    async RejectPr(){
        let {values} =  this.props.form_details
        if(values  && values.ApproveDto && values.ApproveDto.strRemark){
            let details = this.process_details();
            let _status = await ApiExtract(RejectPO, details);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
            
        }
        else{
            this.setState({
                model:true,
                status:false,
                modal_body: 'Please enter remarks',
            })
        }
       
    }

    async DuplicatePr(){
        let {pom_details} =  this.state
        console.log('DuplicatePr', pom_details)
        if(pom_details){
            this.setState({loading:true})
            let _status = await ApiExtract(DuplicatePO, {
                "strPONo":pom_details.POM_PO_NO,
                "intPOIndex":pom_details.POM_PO_INDEX,
            });
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
            
        }
        else{
            this.setState({
                model:true,
                status:false,
                modal_body: 'Please enter remarks',
            })
        }
       
    }


    
    async HoldPr(){
        if(this.state.remarks){
            let details = this.process_details();
            let _status = await ApiExtract(HoldPO, details);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
        }
        else{
            this.setState({
                model:true,
                status:false,
                modal_body: 'Please enter remarks',
            })
        }
    }

    process_details() {
        let {products, pod_details, confimation_type} = this.state;
        let _get_result_initial  = '';
        let _user_details = UserDetails()
        let req = {}; 
        this.setState({loading:true})
        let _exec = true;
        if(confimation_type=='approve'){
            for(var i=0; i<pod_details.length; i++){
                // let _current_date = addDate(new Date(), 2)
                // let _temp_detauls = addDate(this.state.pom_details.POM_SUBMIT_DATE, (pod_details[i].POD_ETD))
                // if(CompareDateMoment(_current_date, _temp_detauls )){
                //     _exec = false;
                // }
                if(pod_details[i].POD_ETD<2){
                    _exec = false;
                }
            }
        }
        if(this.state.approval_flow_table && _exec){
            let _final_details =  this.state.approval_flow_table;
            let apprFlow =  this.state.approval_flow_table;
            let _get_result = '';
            let _pom_details = []
            if(products){
                _pom_details.push(this.state.pom_details)
                req = {
                    POM_DETAILS: _pom_details,
                    POD_DETAILS: this.state.pod_details,
                    "PRA_APPROVAL_TYPE": "1",
                    "PRA_SEQ": "1",
                    "REMARK": this.state.remarks,
                    "ISHighestLevel": "false",
                    "RELIEF": "false",
                    "PO_Num" : (this.state.pom_details && this.state.pom_details.POM_PO_NO) ?  this.state.pom_details.POM_PO_NO : '',
                    "POIndex" : (this.state.pom_details && this.state.pom_details.POM_PO_INDEX) ?  this.state.pom_details.POM_PO_INDEX : ''
                    
                }
            }

            this.state.approval_flow_table.sort(function (a, b) {
                return a.PRA_SEQ - b.PRA_SEQ;
            });

            

            for (let index = 0; index < _final_details.length; index++) {
                const element = apprFlow[index];
                let user_id = _user_details.UM_USER_ID;
                if (apprFlow[index].PRA_AO === user_id || apprFlow[index].PRA_A_AO === user_id) {
                    req.PRA_APPROVAL_TYPE = element.PRA_APPROVAL_TYPE;
                    req.PRA_SEQ = element.PRA_SEQ;
                }
                if (apprFlow[apprFlow.length - 1].PRA_AO === user_id || apprFlow[apprFlow.length - 1].PRA_A_AO === user_id) {
                    req.ISHighestLevel = true;
                }
            }

        }
        else{

            this.setState({
                modal_body : 'Est. Date of Delivery Less Than 2 Days. Do you want to proceed ?',
                status :false ,
                confimation_pop : true,
                loading:false,
                confimation_type : 'approve_final'
            })
            return false
        }

        return req;
    }

    async ApprovePr(){
        let details =  this.process_details()
        if(details){
            let _status =  await ApiExtract(AproveSubmit, details);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    show_view :  _status.status  ? false : true ,
                    modal_body: _status.message,
                    loading:false,
                })
            }
        }
        
    }

    download_files = (data, status) => {
        let requestParam = '';
        if (status === 'reqDoc') {
            requestParam = { 'strFile': data.CDA_ATTACH_FILENAME, 'strFile1': data.CDA_HUB_FILENAME, 'Text': data.CDA_FILESIZE + ' KB', 'ID': data.CDA_ATTACH_INDEX, 'CDA_TYPE': data.CDA_DOC_TYPE, 'CDA_DOC_TYPE': data.CDA_DOC_TYPE, 'pEnumDownloadType': data.pEnumDownloadType };
        }
        else {
            requestParam = data;
        }
        this.props.download_file(requestParam);
    }


    delete_file = (data, type) =>{
        data.AttachType = "E";
        data.modeType = "New";
        data.strIndex = "PO";
        data.CDA_DOC_NO = ((this.state.pom_details) ? this.state.pom_details.POM_PO_INDEX:'')

        let _token_details = UserDetails();
        if(this.state.approval_flow_table && this.state.approval_flow_table.length){
            for (let i = 0; i < this.state.approval_flow_table.length;  i++) {
                const _getApprFlow = this.state.approval_flow_table[i];
               if (_getApprFlow.PRA_AO == _token_details.UM_USER_ID || _getApprFlow.PRA_A_AO == _token_details.UM_USER_ID) {
                    data.seq = _getApprFlow.PRA_SEQ;
                }
            }
        }

        data.CDA_DOC_TYPE ="AO"
        this.setState({
            delete : true
        })

        this.props.delete_file(data);
       
    }
       


    componentDidMount(){
        
        if(this.props.location && this.props.location.datas){
            this.setState({
                products : this.props.location.datas,
                model:false,
                model_body:false
            })
            if(this.props.location.datas && this.props.location.datas.from_page=="listing"){
                this.setState({
                    show_view : false
                })
            }
            this.props.get_search_list(this.props.location.datas)
        }
        else{
           
        }
    }

    confirm_function = (type, text) => {
        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            modal_body: `Are you sure that you want ${text} ?`,
        })
    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="hold"){
            this.HoldPr()
        }
        else if(_confimation_type=="approve"){
            this.ApprovePr()
        }
        else if(_confimation_type=="reject"){
            this.RejectPr()
        }
        else if(_confimation_type=="approve_final"){
            this.ApprovePr()
        }

        else if(_confimation_type=="duplicate"){
            this.DuplicatePr()
        }

    }

    ChangeDate = async (values, list_index) =>{
        let {pod_details} = this.state;
        let _details = [];
        if(pod_details && pod_details.length){
            _details =  await pod_details.map( (list_item, index)=>{
                if(list_item.POD_PO_LINE == list_index){
                    console.log('list_item.hm_index == list_index',list_item, list_index)
                    list_item.ChangeDate = true
                    list_item.POD_ETD = CalcDateUpdate(values, new Date(this.state.pom_details.POM_SUBMIT_DATE));
                    console.log('list_item.POD_ETD', list_item.POD_ETD)
                    return list_item;
                }
                else{
                    list_item.ChangeDate = false
                    return list_item
                }
            })
        }
        this.setState({
            table_body : _details
        })
    }

    ClearAll = () => {
        this.setState({remarks : ''})
        this.props.change('ApproveDto.strRemark','')
    }

    PreivUrl = () =>{
        this.props.ClearUploadDocuments()
        this.setState({attachment:[]})
        this.props.history.push({pathname : '/SearchPO_AO'})
    
    }

    render(){
        let _user_details = UserDetails()
        let _selected_index = 0
        let _approval_details = (this.state.approval_flow_table) ? this.state.approval_flow_table : [] 
        if(_approval_details.length>0){
            let _temp_details = _approval_details.filter((list)=>(_user_details.UM_USER_NAME==list.AO_NAME  || _user_details.UM_USER_NAME==list.AAO_NAME) ? list.FA_SEQ : '')
            if(_temp_details && _temp_details.length > 0){
                _selected_index = _temp_details[0].FA_SEQ
            }
        }
        
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Level", id:"PRA_SEQ", width:'50px', key:true},
            {name : "Approving Officer", id:"AO_NAME", width:'100px'},
            {name : "A.Approving Officer", id:"AAO_NAME", width:'100px'},
            {name : "Approval Type", id:"PRA_APPROVAL_TYPE", width:'144px', formatter: (cellContent, row) => {
                console.log('row_ ', row )
                return (
                    row.PRA_APPROVAL_TYPE === '2' ? 'Endorsement' : 'Approval ' 
                )
            }},

            {name : "Action Date", id:"PRA_ACTION_DATE", width:'144px'},
            {name : "Remarks", id:"PRA_AO_REMARK", width:'122px'},
            {name : "Attachment", id:"userAttachFileList", width:'144px', dataFormat:"downloads"}

        ];

        const _table_data_header = [
            {name : "Line", id:"POD_PO_LINE", width:'50px', key:true, type:"index"},
            {name : "Gift", id:"GIFT", width:'100px'},
            {name : "Fund Type (L1)", id:"FUNDTYPEDESC", width:'100px'},
            {name : "Person Code (L9)", id:"PERSONCODEDESC", width:'144px'},
            {name : "Project / ACR (L8) Code", id:"PROJECTCODEDESC", width:'144px'},
            {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'122px', dataFormat:"validatedata"},
            {name : "GL Description (GL Code)", id:"POD_B_GL_CODE", width:'144px',formatter: (cellContent, row) => {
                return (
                    row.POD_B_GL_CODE + ' (' + row.GLDESCRIPTION + ')'
                )
            }},
            {name : "Category Code", id:"POD_B_CATEGORY_CODE", width:'100px', dataFormat:"validatedata"},
            {name : "Item Name", id:"POD_PRODUCT_DESC", width:'150px'},
            {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'150px', dataFormat:"price"},
            {name : "Quantity", id:"POD_ORDERED_QTY", width:'100px', dataFormat:"price"},
            {name : "UOM", id:"POD_UOM", width:'100px'},
            {name : "Unit Price", id:"POD_UNIT_COST", width:'100px', dataFormat:"number4"},
            {name : "Sub Total", id:"UNITCOST", width:'100px',formatter: (cellContent, row) => {
                return <div className="text-right">{NumberFormate((row.POD_UNIT_COST) ? (row.POD_UNIT_COST * row.POD_ORDERED_QTY) : '0.00')}</div>
            }},
            {name : "SST Rate", id:"POD_GST_RATE", width:'100px', dataFormat:"textna"},
            {name : "SST Amount", id:"POD_GST", width:'100px',formatter: (cellContent, row) => {
                return ((row.POD_GST) ? ((row.POD_ORDERED_QTY * row.POD_UNIT_COST) * (row.POD_GST/100)) : 0).toFixed(2)
            }},
            {name : "SST Tax Code (Purchase) (L6)", id:"GstTaxCode", width:'100px', dataFormat:"validatedata"},
            {name : "Cost Centre Code (L7)", id:"costCentre", width:'100px',formatter: (cellContent, row) => {
                return row.AM_ACCT_DESC +':'+ row.costCentre
            }},
            {name : "Delivery Address", id:"POD_D_ADDR_CODE", width:'176px',formatter: (cellContent, row) => {
                return row.POD_D_ADDR_LINE1 +' '+ row.POD_D_ADDR_LINE2 +' '+ ((row.POD_D_ADDR_LINE3) ? row.POD_D_ADDR_LINE3 : '')
            }},
            {name : "Est. Date of Delivery", id:"POD_D_ADDR_CODE", width:'120px',formatter: (cellContent, row) => {
                var _date = new Date(this.state.pom_details.POM_SUBMIT_DATE);
                _date.setDate(_date.getDate() + row.POD_ETD);
                return <FormDatePickerReact minDate={new Date(this.state.pom_details.POM_SUBMIT_DATE)} selected={_date} handleChange={(e)=>this.ChangeDate(e, row.POD_PO_LINE)} />
            }},
            {name : "Warranty Terms (mths)", id:"POD_WARRANTY_TERMS", width:'100px'},
            // {name : "Segmentation", id:"PCD_FIELD_VALUE", width:'100px'},
            // {name : "Test", id:"PCD_FIELD_VALUE", width:'100px', formatter: (cellContent, row) => {
            //     return '10'
            // }},

        ];

        if(this.state.custom_fields && this.state.custom_fields.length) {
            this.state.custom_fields.forEach((list_details)=>{
                console.log('_table_data_header', list_details)
                _table_data_header.push({
                    name : list_details.PCM_FIELD_NAME,
                    id : list_details.PCM_FIELD_NAME,
                    dataFormat:"text", 
                    width:'120px',
                    formatter: (cellContent, row) => {
                        let _temp_details = this.state.custom_field_details.filter((list_details_main) => ((list_details_main.PCD_PR_LINE == row.PCD_PR_LINE) &&  (list_details_main.PCD_FIELD_NO == list_details.PCM_FIELD_NO)))
                        console.log('_temp_details', _temp_details, row.PCD_PR_LINE, list_details.PCM_FIELD_NO)
                        if(_temp_details.length){
                            return _temp_details[0].PCD_FIELD_VALUE
                        }
                    }
                })
            })
        } 

        _table_data_header.push({name : "Remarks", id:"POD_REMARK", width:'100px'})
       
        let _sub_total  = this.state.pod_details ? this.state.pod_details.reduce((a, val) => a += val.POD_ORDERED_QTY * val.POD_UNIT_COST, 0): 0;
        let _sub_gst  = this.state.pod_details ? this.state.pod_details .reduce((a, val) => a  += (val.POD_GST) ? (val.POD_ORDERED_QTY * val.POD_UNIT_COST) * (val.POD_GST/100) : 0 , 0).toFixed(2): 0;
        let _total  = this.state.pod_details ? this.state.pod_details.reduce((a, val) =>a += (val.POD_ORDERED_QTY * val.POD_UNIT_COST), 0): 0
        let _shipping = (this.state.pom_details) ? this.state.pom_details.POM_SHIP_AMT : 0
        _total = parseFloat(_sub_gst)+parseFloat(_total)+parseFloat(_shipping);

        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.dr_loading) ? <Loader /> : '' }
              {(this.props.fue_loading) ? <Loader /> : '' }
              {(this.props.fd_loading) ? <Loader /> : '' }
              
              {((this.props.file_delete && this.props.file_delete.loading)) ? <Loader /> : '' }
              {((this.props.pr_details && this.props.pr_details.loading)) ? <Loader /> : '' }
              
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
            <PageHeading 
                heading="" 
                subheading="Click the Approve PO button to approve the PO or Reject PO button to reject the PO." 
            />
            
                        <TabHeading color={'bg-info text-white'}>Purchase Order Header</TabHeading> 
                        <div className="row">
                            <div className="col-12 col-md-2 col-lg-2"><label>  PO Number :	</label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.POM_PO_NO}</div>
                            <div className="col-12 col-md-2 col-lg-2"><label>  Purchaser :	</label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.POM_BUYER_NAME}</div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-2 col-lg-2"><label>  Submission Date :	</label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {TodayDateSalash(this.state.pom_details.POM_SUBMIT_DATE)}	</div>
                            <div className="col-12 col-md-2 col-lg-2"><label>  Status :		</label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {(this.state.pom_details.STATUS_DESC == 'Held By') ? this.state.pom_details.STATUS_DESC+' '+this.state.pom_details.NAME : this.state.pom_details.STATUS_DESC}</div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-2 col-lg-2"><label>   Billing Address :		</label></div>
                            <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_B_ADDR_LINE1}<br></br>{this.state.pom_details.POM_B_ADDR_LINE2} <br></br>{this.state.pom_details.POM_B_ADDR_LINE3}
                                <br></br>{this.state.pom_details.POM_B_POSTCODE} <br></br>{this.state.pom_details.POM_B_CITY} <br></br>{this.state.pom_details.STATE}<br></br> {this.state.pom_details.CT}    </div>

                        </div>

                        <div className="row">
                            <div className="col-12 col-md-2 col-lg-2"><label>  Internal Remarks :		</label></div>
                            <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_INTERNAL_REMARK} </div>
                            <div className="col-12 col-md-2 col-lg-2"><label> 		</label></div>
                            <div className="col-12 col-md-4 col-lg-4"> </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-2 col-lg-2"><label> Vendor :	</label></div>
                            <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_S_COY_NAME} </div>
                            <div className="col-12 col-md-2 col-lg-2"><label> 	Currency :	</label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.POM_CURRENCY_CODE} </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-2 col-lg-2"><label>External Remarks :</label></div>
                            <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_External_Remark} </div>
                            <div className="col-12 col-md-2 col-lg-2"><label></label></div>
                            <div className="col-12 col-md-4 col-lg-4"></div>
                        </div>
                    
                        <div className="row">
                            <div className="col-12 col-md-2 col-lg-2"><label> Payment Terms :</label></div>
                            <div className="col-12 col-md-4 col-lg-4">{(this.state.pom_details.POM_PAYMENT_TERM) ? HandlePaymentTerm(this.state.pom_details.POM_PAYMENT_TERM) : ''} </div>
                            <div className="col-12 col-md-2 col-lg-2"><label>	 Payment Method :		</label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.POM_PAYMENT_METHOD}</div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-2 col-lg-2"><label>  Shipment Terms :</label></div>
                            <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_SHIPMENT_TERM} </div>
                            <div className="col-12 col-md-2 col-lg-2"><label>	 Shipment Mode :		</label></div>
                            <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_SHIPMENT_MODE} </div>
                        </div>

                        
                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>Internal File(s) Attached : </label></div>
                                <div className="col">
                                    {(this.props.search_result &&  this.props.search_result.allInfo && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT  && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT.length>0 &&   this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT[0].text!="No Files Attached") ? this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT .map((list, index) => {
                                        if (list.CDA_TYPE == 'I') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB)</span></u></p>
                                        }
                                    }): "No files attached"}
                                    
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>External File(s) Attached  : </label></div>
                                <div className="col">
                                {(this.props.search_result &&  this.props.search_result.allInfo && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT.length>0 && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT[0].text!="No Files Attached") ?  this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                                        if (list.CDA_TYPE == 'E') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB)</span></u> </p>
                                        }
                                    }): "No files attached"}
                                </div>
                            </div>

                <TabHeading color={'bg-info text-white'}>Approval Workflow </TabHeading> 
                <div className="row mt-2">    
                    <div className='col-12'>   
                                <table className="table table-hover table-stripe">
                                    <thead className="bg-info text-white p-1">
                                        <tr className="bg-lightblue">
                                            <th>Level</th>
                                            <th>Approving Officer</th>
                                            <th>A.Approving Officer</th>
                                            <th>Approval Type</th>
                                            <th>Action Date</th>
                                            <th>Remarks</th>
                                            <th>Attachment</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                    
                                        {this.state.approval_flow_table && this.state.approval_flow_table.map((data, index) =>
                                            <tr key={index} className={((_user_details.UM_USER_NAME==data.AO_NAME  || _user_details.UM_USER_NAME==data.AAO_NAME) || (_selected_index==data.PRA_SEQ)) ? 'bold_row' : ''}>
                                                <td>{data.PRA_SEQ}</td>
                                                <td>{data.AO_NAME}</td>
                                                <td>{data.AAO_NAME}</td>
                                                <td>{(data.PRA_APPROVAL_TYPE == '2' ||  data.PRA_APPROVAL_TYPE == '0') ? 'Endorsement' : 'Approval'}</td>
                                                <td>{data.PRA_ACTION_DATE !== null ? TodayDateSalash(data.PRA_ACTION_DATE) : ''}</td>
                                                <td>{data.PRA_AO_REMARK}</td>
                                                <td>{(data.userAttachFileList && data.userAttachFileList.length>0) ?  data.userAttachFileList.map((val, index) => {
                                                    return <p><u><span onClick={() => this.download_files(val, 'inter')}>{val.strFile} &nbsp;&nbsp;</span></u> </p>
                                                }):'No Files Attached'}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                      
                    </div>
                </div>
                    <div className="row mt-2">    
                        <div className='col-12'>   
                         <BootstrapCustomTable 
                            table_header={_table_data_header} 
                            table_body={(this.state.pod_details) ?  this.state.pod_details : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}

                        />
                        <table className="table table-striped">
                            <tr>
                                <td className="text-right" colSpan={4}><strong>Sub Total :</strong></td>
                                        <td className="text-right" style={{width:'109px'}}> {(_sub_total && _sub_total>0) ? NumberFormate(_sub_total) : '0.00' } </td>
                            </tr>
                            <tr>
                                <td className="text-right" colSpan={4}><strong>SST Amount :</strong></td>
                                <td className="text-right"  style={{width:'109px'}}>{(_sub_gst && _sub_gst>0) ? NumberFormate(_sub_gst) : '0.00' }</td>
                            </tr>
                            <tr>
                                <td className="text-right" colSpan={4}><strong>Shipping & Handling :</strong></td>
                                <td className="text-right"  style={{width:'109px'}}>{(_shipping && _shipping>0) ? NumberFormate(_shipping) : '0.00' }</td>
                            </tr>

                            
                            <tr>
                                <td className="text-right" colSpan={4}><strong>Grand Total :</strong></td> 
                                <td className="text-right" style={{width:'109px'}}>{(_total && parseFloat(_total)>0) ? NumberFormate(_total) : '0.00' }</td>
                            </tr>
                        </table>

                        </div>
                    </div>
                    { this.state.show_view && 
                      <Fragment>
                    <div className="mt-2 row">
                        <div className="col-12" style={{padding:'0px'}}>  
                               <Field type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} className="form-control" placeholder=" Remarks" label=" Remarks"  onChange={(e)=>this.setState({
                                   remarks : e.target.value
                               })}/>
                               <div className="col-12 col-sm-6">
                               <div className="row mt-2">
                                    <FromUplodsParallel name="ApproveDto.internalAttachment" id ="external_attachment" label="Internal Attachment :" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                                   
                                </div> 
                                <div className="row mt-2">
                                    <div className="col-3">
                                    </div>
                                    <div className="col-7">
                                        <p>Recommended file size is 10240 KB</p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="mt-2 row">
                        <div className="col-lg-2 col-md-2 col-12">
                            <label>Internal File Attached : </label>
                        </div>
                         <div className="col-lg-6 col-md-4 col-12">
                            <div className="col_details">
                                {(this.state.attachment ) ? this.state.attachment.map((list, index) => {
                                    if (list.Text !== 'No Files Attached') {
                                        // if (list.CDA_TYPE === 'E') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> {(this.state.show_view) ? <span  onClick={() => this.delete_file(list, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span> :'' }</p>
                                        // }
                                    }
                                }) : 'No Files Attached'}
                            </div>
                        </div>
                    </div>
                    
                    </Fragment>
                    }


                    <div className="mt-2 mb-5 row">
                        { this.state.show_view && 
                        <Fragment>
                            <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>this.confirm_function('duplicate', 'duplicate This PO')} >Duplicate PO</button></div>
                            <div className="col-lg-auto col-md"> <button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.confirm_function('approve', (this.state.approval_flow_table) ?  this.state.approval_flow_table.filter(list => (list.PRA_AO == _user_details.UM_USER_ID.trim() || list.PRA_A_AO == _user_details.UM_USER_ID.trim()) && (list.PRA_APPROVAL_TYPE.trim()=="0")).length > 0 ? 'endorse this PO' : 'approve this PO' : '')}>{(this.state.approval_flow_table) ?  this.state.approval_flow_table.filter(list => (list.PRA_AO == _user_details.UM_USER_ID.trim() || list.PRA_A_AO == _user_details.UM_USER_ID.trim()) && (list.PRA_APPROVAL_TYPE.trim()=="0")).length > 0 ? 'Endorse PO' : 'Approve PO' : ''}</button> </div>
                            <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>this.confirm_function('reject', 'reject This PO')} >Reject PO</button></div>
                            <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-info btn-sm" onClick={()=>this.confirm_function('hold', 'hold This PO')}  >Hold PO</button></div> 
                            <div className="col-lg-auto col-md"><button type="reset" className="btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button></div>
                        </Fragment>}
                       
                        <div className="col-lg-auto col-md"><button type="reset" className="btn btn-outline-danger btn-sm" onClick={()=>this.PreivUrl()}>Back</button></div>
                    </div>

                </form>

                <ConfirmationModel
                     title="" 
                     confimation = {true}
                     message={this.state.modal_body} 
                     status={this.state.status} 
                     show={this.state.confimation_pop} 
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />

                <Alert 
                    title="" 
                    message={this.state.modal_body} 
                    status={this.state.status} show={this.state.model} confirm={this.closemodel}
                />
               
               
        </Fragment>
    }
}

export default reduxForm({
    form:'ApprovalItems',
})(ApprovalRejectList);
