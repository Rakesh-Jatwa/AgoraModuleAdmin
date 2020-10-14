import React,{Component, Fragment} from 'react';
import { FromInputs, FromUplods, FromSelect, FormDatePicker, FromInputsPlainDate} from '../../../../../Component/From/FromInputs'
import {connect} from 'react-redux';
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {Field, reduxForm} from 'redux-form';
import BootstrapCustomTable from '../../../../../Component/Table/e2ptable'
import BootstrapCustomTableStatic from '../../../../../Component/Table/BootstrapCustomTableStatic'
import {TodayDateSalash,FromateDate, FromateDate_YY_MM_DD, addDate} from '../../../../../Component/Dates'
import Common from '../../../../../Common'
import Alert from '../../../../../Component/Modal/alert'
import Modal from '../../../../../Component/Modal'
import Loader from '../../../../../Component/Loader'
import {UserDetails } from '../../../../../Common/LocalStorage'
import {ApiExtract, ApiExtractFiles} from '../../../../../Common/GetDatas'
import { GetContinueDocument, e2pItemsmultiple} from '../../../../../Actions/Common'
import {documentContinue, VoidE2P, MultiInvoice, CheckInvDuplicate, MultiGL, E2PDeleteIPPDocDetaill, E2PSaveDocDetials} from '../../../../../Apis/RequesterServices'
import {E2PSaveDocItemDetials, E2PsearchVendor} from '../../../../../Apis/Approver'
import {E2PREquest} from '../../../../../validation'
import {HandlePayment, NormalizeNumbers, scrollToInvalid, CheckFileDetails, RemoveBlankSpace} from '../../../../../Actions/Common/Functions'
import BootstrapTable from '../../../../../Component/Table/BootstrapCustomTablePr'
import DocumentPop from '../DocumentPop'
import ConfirmationModel from '../../../../../Component/Modal/ConfirmationModel'
import TotalGrid from '../../../../../Component/Table/TotalGrid'
import Master from '../Master'
let serial = 0;

class Document extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.closemodel = this.closemodel.bind(this);
        this.handleformsubmit = this.handleformsubmit.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.CloseMultiInvoice = this.CloseMultiInvoice.bind(this);
        this.CloseShowMultiGl = this.CloseShowMultiGl.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updateData = this.updateData.bind(this)
        this.updateWithholdData = this.updateWithholdData.bind(this)
        
        this.FileUpload = this.FileUpload.bind(this)
        this.SendUpload = this.SendUpload.bind(this)
        this.handlePopup = this.handlePopup.bind(this)
        this.getSelectedProduct = this.getSelectedProduct.bind(this)
        this.getPopupSelectedProduct = this.getPopupSelectedProduct.bind(this)
        this.makeDuplicate = this.makeDuplicate.bind(this)
        this.getSelectedItem = this.getSelectedItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.commonfunction = this.commonfunction.bind(this)
        this.handlefiltersubmit = this.handlefiltersubmit.bind(this)
        this.select_function_inex = this.select_function_inex.bind(this)
        this.receiveproducts = this.receiveproducts.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.deleteFile = this.deleteFile.bind(this)
        this.handledateHeader = this.handledateHeader.bind(this)
        this.formatefile = this.formatefile.bind(this)
        this.download_file = this.download_file.bind(this)
        this.SelecthandleChange = this.SelecthandleChange.bind(this)
        this.delete_function = this.delete_function.bind(this)
        this.handlepopformsubmit = this.handlepopformsubmit.bind(this)
        this.ShowMultiGl = this.ShowMultiGl.bind(this)
        this.ShowMultiInvoice = this.ShowMultiInvoice.bind(this)
        this.handleVendorType = this.handleVendorType.bind(this)
        this.emptySelectedProduct = this.emptySelectedProduct.bind(this)
        this.emptyPopupSelectedProduct = this.emptyPopupSelectedProduct.bind(this)
        this.state = {
            table_body :  [],
            list_details : {}, 
            table_model_header : [
                {name : "Description", id:"description", key:true},
                {name : "Code", id:"code"},
            ],
            table_model_body :  Common.modelData(),
            formate_files : this.formatefile(),
            user_details : UserDetails(),
            products:[],
            date_details : new Date(),
            open:false,
            model:false,
            table_display:true,
            modal_title:'',
            modal_body:'',
            datas:[],
            selection:'',
            rendered:false, 
            external_file :'',
            internal_file :'',
            external_file_name :'',
            internal_file_name :'',
            current_model:'',
            current_id:0,
            fund_transfer_l1: [], 
            fund_transfer_l8: [], 
            fund_transfer_l9: [], 
            dates:[], 
            ccc:[],
            da:[],
            final_data:{},
            form_checks : [0,1,2],
            slected_items:[],
            strPrNO:'',
            open:false,
            success_modal_body :'',
            delete:false,
            addmodel:false,
            modal_popup:false,
            modal_popup_title:'',
            modal_popup_header:[],
            modal_popup_body:[],
            
            model_current_id : '',
            main_date:new Date(),
            validation :false,
            status:false,
            loading:false,
            pr_value: '',
            internal_delete:false,
            extrnal_delete:false,
            internal_upload:false,
            external_upload:false,
            extrnal_delete:false,
            internal_attachment:[],
            extrnal_attachment:[],
            popup:false,
            nc_popup:false,
            rerenderd:false,
            redate:false,
            Urgent:false,
            nc_type:"nc",
            address : '',
            lblPONo : '',
            VenCompIDX: '',
            input_qty: 0,
            input_sst:0,
            InvIdx :'',
            show_add_line: false,
            table_modal_popup : '',
            local_render : false,
            loaded_details : {},
            custom_modal_popup : false,
            custom_modal_type:'All',
            custim_model_check_box : '0',
            custim_model_text_value : '',
            custim_model_taxtarea_value : '',

            show_multi_gl : false,
            show_multi_gl_file : '',
            show_multi_gl_file_name : '',

            show_multi_invoice :false,
            show_multi_invoice_file : '',
            show_multi_invoice_file_name : 'false',

            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',

            submit_type:'',
            doc_emp_type : 'Vendor',
            disable_input : true,
            doc_due_date : '',
            reload_submit : false,
            width_hold : {},
            width_option : '',
            width_remark:'',
            disable_checkbox:false,
            MasterDoc : 'Y',
            table_master_popup : false,
            sub_master_doc : []
        }
    }

    handlepopformsubmit = () =>{
    }

    handleVendorType = (type) => {
        this.props.get_vendor_list({"companyType":(type=="Vendor") ? "V" : "E"})
        this.setState({
            doc_emp_type :  type,
            disable_checkbox : (type=="Vendor") ? false : true,
            MasterDoc : (type=="Vendor") ? 'Y' : "N"
        })
    }

    convert_datas = () =>{
    }

    confirm_function = (type, text) => {
        
        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            modal_body: `Are you sure that you want to ${text} ?`,
        })

    }

    onConfirm = () => {
        this.setState({ confimation_pop: false})
        this.handlefiltersubmit_valid({submit_type:this.state.confimation_type});
    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    static async getDerivedStateFromProps (nextProps, prevState){
        let _details_main = prevState
        console.log('nextProps.approval_details', nextProps.approval_details)
        if(prevState.local_render  && nextProps.approval_details && nextProps.approval_details.hasOwnProperty('documentDetails')){
            _details_main.rerenderd = true
            return _details_main
        }

        if(prevState.internal_delete &&  (!prevState.external_delete) &&  nextProps.file_delete && nextProps.file_delete.responseList && nextProps.file_delete.responseList.displayAttachFile && nextProps.file_delete.responseList.displayAttachFile.attachFileList){
            _details_main.internal_attachment = nextProps.file_delete.responseList.displayAttachFile.attachFileList;
            return _details_main
         }
        

        if(prevState.internal_upload &&  (!prevState.external_upload) && nextProps.upload_document && nextProps.upload_document.responseList && nextProps.upload_document.responseList.displayAttachFile && nextProps.upload_document.responseList.displayAttachFile.attachFileList){
            _details_main.internal_attachment = nextProps.upload_document.responseList.displayAttachFile.attachFileList;
           return _details_main
        }
      
        return nextProps, prevState;
    }
    

    async formatefile(file_list){
        let _details = new Array();
        if(file_list && file_list.length){
            _details =  await file_list.map((list,index)=>{
                return {
                    strFile : list.CDA_ATTACH_FILENAME,
                    strFile1 : list.CDA_HUB_FILENAME,
                    Text : list.CDA_FILESIZE,
                    ID : list.CDA_ATTACH_INDEX,
                }
            })
        }
        return _details;
    }
    
    handledate = (details, name, id) => {
       let {table_body} = this.state
       let _temp_date = new Array();
       table_body.forEach((list,date)=>{
            list.delivery = details
            _temp_date.push(list);
       })
       this.setState({
            table_body : _temp_date,
            main_date : details,
       })
    }

    emptySelectedProduct(){
        let {current_id, current_model, table_body} = this.state;
    
        if(current_id!='' && current_model && table_body[current_id]){
            let _details =  Object.assign({},table_body[current_id])
            table_body[current_id] = _details;
            if(current_model=="FUNDTYPE"){
                table_body[current_id][current_model] = ''
                table_body[current_id].ID_ANALYSIS_CODE1= ''
                table_body[current_id].FUNDTYPE = ''
            }
            else if(current_model=="deliveryAddress"){
                table_body[current_id][current_model] = ''
                table_body[current_id].DeliveryAddr= ''
            }
            else if(current_model=="costCentre"){
                table_body[current_id][current_model] =''
                table_body[current_id].prdAcctIndex = ''
                table_body[current_id].ID_ANALYSIS_CODE7 =''
                table_body[current_id].costCentre = ''
                table_body[current_id].ID_COST_CENTER  = ''
                table_body[current_id].ID_COST_CENTER_DESC  =''
            }
            
          
            else if(current_model=="GLDESCRIPTION"){
                table_body[current_id][current_model] =''
                table_body[current_id].GLDESCRIPTION = ''
                table_body[current_id].ID_B_GL_CODE = ''
            }

            else if(current_model=="PRODUCTTYPE"){
                table_body[current_id][current_model]  =''
                table_body[current_id].ID_ANALYSIS_CODE2 =''
                table_body[current_id].PRODUCTTYPE = ''
            }
            else if(current_model=="CHANNEL"){
                table_body[current_id][current_model]  = ''
                table_body[current_id].ID_ANALYSIS_CODE3 =''
                table_body[current_id].CHANNEL = ''
            }

            else if(current_model=="REINSURANCECOMPANY"){
                table_body[current_id][current_model]  = ''
                table_body[current_id].ID_ANALYSIS_CODE4 = ''
                table_body[current_id].REINSURANCECOMPANY = ''
            }

            else if(current_model=="ASSETFUND"){
                table_body[current_id][current_model]  =''
                table_body[current_id].ID_ANALYSIS_CODE5 =''
                table_body[current_id].ASSETFUND = ''
            }

            else if(current_model=="PROJECTCODEDESC"){
                table_body[current_id][current_model]  =''
                table_body[current_id].ID_ANALYSIS_CODE8 = ''
                table_body[current_id].PROJECTCODEDESC =''
            }

            else if(current_model=="PERSONCODEDESC"){
                table_body[current_id][current_model]  = ''
                table_body[current_id].ID_ANALYSIS_CODE9 = ''
                table_body[current_id].PERSONCODEDESC =''
                table_body[current_id].PERSONCODE = ''
            }
            
        }

        this.setState({
            table_body: table_body,
            table_modal_popup : false,
            table_model_body :[],
            model : false ,
            current_model : '',
            current_id : ''
        })
    }

    emptyPopupSelectedProduct(){
        let {model_current_id, table_body} = this.state;
        if(!table_body.length){
            table_body = (this.props.purchased_items.getPurchaseRequestItemsDetails) ? this.props.purchased_items.getPurchaseRequestItemsDetails : []
        }
    
        let _final_result =[]
        if(table_body.length){
           
            table_body.forEach((list,index)=>{
                let temp_data = Object.assign({} , list )
                if(model_current_id=="FUNDTYPE"){
                    temp_data[model_current_id]= ''
                    temp_data.ID_ANALYSIS_CODE1= ''
                    temp_data.FUNDTYPE = ''
                }
                else if(model_current_id=="deliveryAddress"){
                    temp_data[model_current_id]= ''
                    temp_data.DeliveryAddr= ''
                }
                else if(model_current_id=="costCentre"){
                    temp_data[model_current_id]= ''
                    temp_data.prdAcctIndex =''
                    temp_data.ID_ANALYSIS_CODE7 = ''
                    temp_data.costCentre = ''
                    temp_data.ID_COST_CENTER  = ''
                    temp_data.ID_COST_CENTER_DESC  = ''

                }
               
               
                else if(model_current_id=="GLDESCRIPTION"){
                    temp_data[model_current_id]=''
                    temp_data.GLDESCRIPTION = ''
                    temp_data.ID_B_GL_CODE = ''
                }

                else if(model_current_id=="PRODUCTTYPE"){
                    temp_data[model_current_id] = ''
                    temp_data.ID_ANALYSIS_CODE2 = '' 
                    temp_data.PRODUCTTYPE = ''
                }
                else if(model_current_id=="CHANNEL"){
                    temp_data[model_current_id] = ''
                    temp_data.ID_ANALYSIS_CODE3 = '' 
                    temp_data.CHANNEL = ''
                }

                else if(model_current_id=="REINSURANCECOMPANY"){
                    temp_data[model_current_id] = ''
                    temp_data.ID_ANALYSIS_CODE4 = '' 
                    temp_data.REINSURANCECOMPANY = ''
                }

                else if(model_current_id=="ASSETFUND"){
                    temp_data[model_current_id] = ''
                    temp_data.ID_ANALYSIS_CODE5 = '' 
                    temp_data.ASSETFUND = ''
                }

                else if(model_current_id=="PROJECTCODEDESC"){
                    temp_data[model_current_id] = ''
                    temp_data.ID_ANALYSIS_CODE8 = '' 
                    temp_data.PROJECTCODEDESC = ''
                    temp_data.PROJECTCODE = '';

                }

                else if(model_current_id=="PERSONCODEDESC"){
                    temp_data[model_current_id] = ''
                    temp_data.ID_ANALYSIS_CODE9 = '' 
                    temp_data.PERSONCODEDESC = ''
                    temp_data.PERSONCODE = '';
                }

                
                _final_result.push(temp_data)
            })
        }


        this.setState({
            table_body: _final_result,
            table_model_body :[],
            modal_popup : false ,
            model_current_id : ''
        })
    }

    handleSelectChange = async (value) =>{
        let _new_date = new Date();
        this.setState({loading:true})
        let _final_datas = {VendorIndex: value}
        let _status =  await ApiExtract(E2PsearchVendor, _final_datas)
        if(_status){
          
          if(_status.response && _status.response.data && _status.response.data.length > 0){
            let _temp_adress = _status.response.data[0]
            _temp_adress.VenCompIDX = value
            _temp_adress.VendorName = this.props.vendor_list.data.filter((list_details)=>list_details.IC_INDEX==value)
            if(_temp_adress.VendorName && _temp_adress.VendorName.length){
                _temp_adress.VendorName = _temp_adress.VendorName[0].IC_COY_NAME
            }
            this.props.change('e2psearch.VenAddrLine1', _temp_adress.IC_ADDR_LINE1)
            this.props.change('e2psearch.VenAddrLine2', _temp_adress.IC_ADDR_LINE2)
            this.props.change('e2psearch.VenAddrLine3', _temp_adress.IC_ADDR_LINE3)
            this.props.change('e2psearch.VenAddrCity', _temp_adress.IC_CITY)
            this.props.change('e2psearch.VenAddrState', _temp_adress.IC_STATE2)
            this.props.change('e2psearch.VenAddrCountry', _temp_adress.IC_COUNTRY2)
            this.props.change('e2psearch.VenAddrPostCode', _temp_adress.IC_POSTCODE)
        
            this.setState({
                disable_input : (_temp_adress.IC_RESIDENT_TYPE=="N") ? false : true,
                doc_due_date : (_temp_adress.IC_credit_terms>=1) ?  addDate(_new_date, _temp_adress.IC_credit_terms) : '',
                address : _temp_adress,
                loading:false
            })
          }
        }
    }

    receiveproducts = (product) =>{
        let _get_selected_items = product
        console.log('receiveproducts', _get_selected_items)
        if(_get_selected_items){
            if(this.props.location && this.props.location.datas && this.props.location.datas.strType=="cc"){
                this.props.get_details_popup({
                    productList: _get_selected_items,
                    viewState: "new",
                    strType: "cc"
                });
                this.setState({
                    popup:false,
                })
            }
            else if(this.props.location && this.props.location.datas && this.props.location.datas.strType=="bc" && this.state.nc_type=="nc"){
                this.props.get_nc_popup({
                    productList: _get_selected_items,
                    viewState: "new",
                    strType: "bc"
                });
                this.setState({
                    nc_popup:false,
                })
            }
            else{
                this.props.get_nc_popup({
                    productList: _get_selected_items,
                    viewState: "new",
                    strType: "bc"
                });
                this.setState({
                    nc_popup:false,
                })
            }
          
        }
       
       
    }

   

    componentDidMount(){
            let _details = localStorage.getItem('e2p_req_details');
            let _user_details = UserDetails();
            if(_details){
                _details = JSON.parse(_details)
                this.props.GetE2PApprovalDetails({
                    docno : _details.OldDocNo,
                    index : _details.InvIdx,
                    compid : _user_details.UM_COY_ID,
                    frm:"IPPREQ"
                })
                this.setState({
                    list_details : _details,
                    local_render:true
                })
            }
            console.log('e2p_doc', this.props.location)
            if(this.props.location && this.props.location.datas && this.props.location.datas=='from_approval'){
                window.location.reload()
            }
            if(this.props.location && this.props.location.page_name=="dashbaord"){
                window.location.reload()   
            }
            this.props.get_vendor_list()
            this.props.change('e2psearch.CurrencyCode', 'MYR')
            this.props.FundTypeOrPersonCode({ type: "L1" })
            this.props.FundTypeOrPersonCode({ type: "L2" })
            this.props.FundTypeOrPersonCode({ type: "L3" })
            this.props.FundTypeOrPersonCode({ type: "L4" })
            this.props.FundTypeOrPersonCode({ type: "L5" })
            this.props.FundTypeOrPersonCode({ type: "L8" })
            this.props.FundTypeOrPersonCode({ type: "L9" })
            this.props.FillAddress()
            this.props.DeliveryAddress()
            this.props.CostCentreCode()
            this.props.SegmentationAction()
            this.props.get_fill_address()
            this.props.cl_code_access()
            this.props.GetE2PPopTaxCode()
            this.props.GetE2PWithHoldingTax()
            this.props.GetE2PPayFor()
            this.props.change('e2psearch.TotalAmount','0.00')
        

        
      
        
        
    }

    ShowAddline = () =>{
        this.setState({
            show_add_line : true
        })
    }

    HideAddline = () =>{
        this.setState({
            show_add_line : false
        })
    }

    closeModel (details){
        this.setState({
            model : false,
            addmodel : false,
            validation:false,
            custom_modal_popup : false,
        })
        if(this.state.model && this.state.submit_type=="void"){
            localStorage.removeItem('e2p_req_details')
            window.location.reload()
        }

        if(this.state.submit_type=="multiinvoice"){
            window.location.reload()
        }

        if(this.state.submit_type=="multigl"){
            this.setState({
                show_multi_gl :false,
            })
            window.location.reload()
        }

        if(this.state.model && this.state.reload_submit){
            window.location.reload()
        }
    }



    select_function_inex(dates){
        let _selected_items = this.state.slected_items;
        let _target_value = dates.target.value;
        if(_target_value!='' && dates.target.checked){
            if(_target_value){
                _target_value = _target_value.split('.');
                if(_target_value.length){
                    _target_value = _target_value[0]
                }
            }
            if(!_selected_items.includes(_target_value)){
                _selected_items.push(_target_value)
                this.setState({
                    slected_items : _selected_items
                })
            }
           
        }
        else{
            if(_target_value){
                _target_value = _target_value.split('.');
                if(_target_value.length){
                    _target_value = _target_value[0]
                }
            }
            let slected_items = this.state.slected_items.filter((fieldValue, index) => fieldValue != _target_value);
            this.setState({
                slected_items : slected_items
           })
        }
    }

    build_details = () =>{
        let {sub_master_doc} = this.state
      
        let _details = [];
        for(var i=0; i < sub_master_doc.length; i++){
            console.log('master_doc_proc_1',  sub_master_doc[i].docDate)
            let _main_details = i
            _details[i] = <tr>
                <td>{i+1}</td>
                <td><input className="form-control" value={(sub_master_doc.hasOwnProperty(i) && sub_master_doc[i]) ? sub_master_doc[i].docNo : '' } name={`docNo[${i}]`} id={_main_details} onChange={(e)=>this.handle_change_sub_doc(e.target.value, _main_details,'docNo')}/></td>
                <td><FromInputsPlainDate className="form-control" date={sub_master_doc[i].docDate} onChange={(e)=>this.handle_change_sub_doc(e, _main_details,'docDate')} /></td>
                <td><input className="form-control" value={(sub_master_doc.hasOwnProperty(i) && sub_master_doc[i]) ? sub_master_doc[i].docAmount : '' } name={`docAmount[${i}]`} id={_main_details} onChange={(e)=>this.handle_change_sub_doc(e.target.value, _main_details,'docAmount')}/></td>
                <td><input className="form-control" disabled defaultValue={'0.00'} name={`docGstAmount[${i}]`} id={_main_details} onChange={(e)=>this.handle_change_sub_doc(e.target.value, _main_details,'docGstAmount')}/></td>
                <td><button type="button" className="btn btn-sm btn-danger" onClick={(e)=>this.RemoveDoc(i)}>Remove</button></td>
            </tr>
        }
        return _details;
    }

    RemoveDoc = (i) =>{
        let {sub_master_doc} = this.state
        sub_master_doc = sub_master_doc.filter((list,index)=>index+1!=i)
        console.log('sub_master_doc', sub_master_doc, i)
        this.setState({
            sub_master_doc : sub_master_doc
        })
    }

    handle_change_sub_doc = (item_value, index, type ) =>{
        let _pre_build = this.state.sub_master_doc;

        let _details = {
            docNo: "",
            docDate:  "",
            docAmount: "",
            docGstAmount:"0"
        }
    
      
        if(index in _pre_build){
            let _details =  _pre_build[index];
            _details.docNo = (type=="docNo") ? (item_value).trim() : _details.docNo;
            _details.docDate = (type=="docDate") ? item_value : _details.docDate;
            _details.docAmount = (type=="docAmount") ? item_value :  _details.docAmount;
            _details.docGstAmount = (type=="docGstAmount") ? item_value : _details.docGstAmount;
            _pre_build[index] = _details
        }
        else{

            _details.docNo = (type=="docNo") ? (item_value).trim() : _details.docNo;
            _details.docDate = (type=="docDate") ? item_value : _details.docDate;
            _details.docAmount = (type=="docAmount") ? item_value :  _details.docAmount;
            _details.docGstAmount = (type=="docGstAmount") ? item_value : _details.docGstAmount;
            _pre_build[index] = _details
        }
        
        this.setState({ sub_master_doc : _pre_build})
    }


    componentDidUpdate(){
      
        if(this.state.rerenderd && this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode ){
            let _temp_details = {}
            let _attachmetns = [];
            let _usb_doc_details = []
            let {documentDetails, lineItem, approverDetails, displayAttachFile, docAttachment, subDocDetail} = this.props.approval_details
            if(docAttachment && docAttachment.length){
                docAttachment.forEach((images,index)=>{
                    _attachmetns.push({
                        strFile: images.ATTACH_FILENAME,
                        strFile1: images.HUB_FILENAME,
                        pEnumDownloadType: 0,
                        Text: "559.6 KB ",
                        ID: images.ATTACH_INDEX,
                        CDA_TYPE: "I",
                        CDA_DOC_TYPE:images.DOC_TYPE
                    })
                })
            }

            subDocDetail.forEach((list,index)=>{
                _usb_doc_details.push({
                    docNo:list.ISD_DOC_NO,
                    docDate:(list.ISD_DOC_DATE instanceof Date) ? list.ISD_DOC_DATE :  new Date(list.ISD_DOC_DATE),
                    docAmount:list.ISD_DOC_AMT,
                    docGstAmount:list.ISD_DOC_GST_VALUE,
                })
            })

            // if (Object.prototype.toString.call(d) === "[object Date]") {
            //     // it is a date
            //     if (isNaN(d.getTime())) {  // d.valueOf() could also work
            //       // date is not valid
            //     } else {
            //       // date is valid
            //     }
            //   } else {
            //     // not a date
            //   }


            if(documentDetails.length){
                documentDetails  = documentDetails[0]
                let _doc_type = '';
                if(documentDetails.IM_INVOICE_TYPE && documentDetails.IM_INVOICE_TYPE=='INV'){
                    _doc_type = "Invoice"
                }
                else if(documentDetails.IM_INVOICE_TYPE && documentDetails.IM_INVOICE_TYPE=='CN'){
                    _doc_type = "Credit Note"
                }
                else if (documentDetails.IM_INVOICE_TYPE && documentDetails.IM_INVOICE_TYPE=='DN'){
                    _doc_type = "Debit Note" 
                }
                else {
                    _doc_type = "Bill"
                }
                _temp_details = {
                    "DocType": _doc_type, 
                    "DocNo": documentDetails.IM_INVOICE_NO,
                    "InvIdx": documentDetails.IM_INVOICE_INDEX,
                    "OldDocNo": documentDetails.IM_INVOICE_INDEX,
                    "DocDate": TodayDateSalash(documentDetails.IM_DOC_DATE),
                    "lateReason":  documentDetails.IM_LATE_REASON,
                    "ManualPONo": documentDetails.IM_IPP_PO,
                    "VendorName": documentDetails.IM_S_COY_ID,
                    "VendorNameMain" : documentDetails.IM_S_COY_NAME,
                    "VenCompIDX":  documentDetails.IM_S_COY_ID,

                    "CurrencyCode":  documentDetails.IM_CURRENCY_CODE,
                    "PaymentAmt":  documentDetails.IM_INVOICE_TOTAL,
                    "PaymentMethod":  documentDetails.IM_CURRENCY_CODE,
                    "WHT": "",
                    "WHTOpt": "",
                    "NoWHTReason": "",
                    "InternalRemark":documentDetails.IM_REMARK,
                    "ExchangeRate": documentDetails.IM_EXCHANGE_RATE,
                    "OldVenCompIDX": documentDetails.IM_S_COY_ID,
                    "BankCode" : documentDetails.im_bank_code,
                    "BankAccount" : documentDetails.im_bank_acct,
                    "DocDueDate": documentDetails.IM_DUE_DATE,
                    "PRCSSentDate": documentDetails.IM_PRCS_SENT,
                    "PRCSReceivedDate": documentDetails.IM_PRCS_SENT_UPD_DATE,
                    "BeneficiaryDetails": documentDetails.IM_REMARKS2,
                    "MasterDocument": "",
                    "CompanyCategory":documentDetails.IM_COMPANY_CATEGORY,
                    "ResidentType": documentDetails.IM_RESIDENT_TYPE,
                    "EmpId": "",
                    "TotalAmtNoGST": documentDetails.IM_INVOICE_EXCL_GST,
                    "GSTAmt": documentDetails.IM_INVOICE_GST,
                    "btnType": "save",
                    "status": "",
                    "GSTTotalIM1IM3": "",
                    "itemTotalAmt":  documentDetails.IM_INVOICE_TOTAL,
                    "isResident": documentDetails.IM_RESIDENT_TYPE,
                    "lblDocDueDate": "",
                    "IC_bank_acct": documentDetails.im_bank_acct,
                }
                this.props.initialize({e2psearch:_temp_details})
                this.handleVendorType((documentDetails.rbtnCoyTypeSelectedValue=="V") ? "Vendor" : "Employee")
            }
            lineItem.forEach((list_item, index)=>{
                let _l1 = this.getPopupSelectedProductLoaded(list_item, 'FUNDTYPE')
                let _l2 = this.getPopupSelectedProductLoaded(list_item, 'PRODUCTTYPE')
                let _l3 = this.getPopupSelectedProductLoaded(list_item, 'CHANNEL')
                let _l4 = this.getPopupSelectedProductLoaded(list_item, 'REINSURANCECOMPANY')
                let _l5 = this.getPopupSelectedProductLoaded(list_item, 'ASSETFUND')
                let _l8 = this.getPopupSelectedProductLoaded(list_item, 'PROJECTCODEDESC')
                let _l9 = this.getPopupSelectedProductLoaded(list_item, 'PERSONCODEDESC')
                let _cc = this.getPopupSelectedProductLoaded(list_item, 'costCentre')
                let _cl = this.getPopupSelectedProductLoaded(list_item, 'GLDESCRIPTION')
                let _details_main = `itemList.${index}.${index}`
                this.props.change(`${_details_main}.ID_PAY_FOR`, list_item.ID_PAY_FOR)
                this.props.change(`${_details_main}.ID_GST_REIMB`, list_item.ID_GST_REIMB)
                this.props.change(`${_details_main}.ID_PRODUCT_DESC`, list_item.ID_PRODUCT_DESC)
                this.props.change(`${_details_main}.ID_UNIT_COST`,list_item.ID_UNIT_COST)
                this.props.change(`${_details_main}.ID_GST_VALUE`,list_item.ID_GST_VALUE)
                this.props.change(`${_details_main}.ID_GST_INPUT_TAX_CODE`,list_item.ID_GST_INPUT_TAX_CODE)
                this.props.change(`${_details_main}.ID_CATEGORY`,list_item.ID_CATEGORY)
                this.props.change(`${_details_main}.ID_REF_NO`,list_item.ID_REF_NO)
                let _temp_details =  Object.assign({}, list_item,_l1, _l2, _l3, _l4 , _l5, _l8, _l9, _cc,_cl)
                console.log('_temp_details', _temp_details)
                lineItem[index] = _temp_details
                lineItem[index].ID_GIFT  = 'N'
                lineItem[index].id_gift  = 'N'
                lineItem[index].ID_INVOICE_LINE  = index
            })
            if(_temp_details.VenCompIDX){
                this.handleSelectChange(_temp_details.VenCompIDX)
            }
            this.setState({
                loaded_details : _temp_details,
                internal_attachment : _attachmetns,
                table_body : (lineItem.length) ? lineItem : [],
                local_render : false,
                rerenderd : false,
                show_submit_button : true ,
                input_qty : documentDetails.IM_INVOICE_EXCL_GST,
                input_sst : documentDetails.GSTAmt,
                sub_master_doc :  (_usb_doc_details) ? _usb_doc_details : [],
                MasterDoc:  (_usb_doc_details && _usb_doc_details.length>0) ? 'Y'  : 'N'
            })
        }
      

    }



    handleformsubmit(values){
       var _submit_dtata = [];
       let _table_body_filter ='';
       let {table_body, datas} = this.state;
       datas.forEach((list)=>{
            _table_body_filter = table_body.filter((table_body_item)=>{
               return table_body_item.line==list
            })
            _submit_dtata.push(_table_body_filter[0]);
        })
    }

    updateInputs=(input, details)=>{
            let _get_details = this.state.table_body;
            if(!_get_details.length){
                _get_details = this.props.purchased_items.getPurchaseRequestItemsDetails
            }
           
            let _target_id = input.target.getAttribute('data-name');
            let _target_name = input.target.getAttribute('data-details');
            if(_get_details[_target_id]){
                _get_details[_target_id][_target_name] = input.target.value;
            }

            this.setState({
                table_body: _get_details
            })

    }

    handleChange  (event){
         
        let  _details  = event.target.name;
        let _name = event.target.getAttribute("data-id");
        let _data = this.state.datas;
        let id = event.target.getAttribute("data-inputname");
        let _qty_input = '';

       
        if(_details){
            let _details_name =  _details.split('.')
            _name = _details_name[1]
            _qty_input = _details_name[3];
        }

        console.log('event.target.value', _name, _qty_input)

        let table_body = this.state.table_body;
        table_body.filter((table_element, index) => { 
            return index == _name
        }).forEach((table_element_value) => {
            if(_data.indexOf(_name)<0){
                _data.push(_name)
            }
            if(_qty_input == "ID_GST"){
                table_element_value['AMOUNT']  =  (event.target.value) ? parseFloat(table_element_value['QUANTITY']) * parseFloat(table_element_value['UNITCOST']) : 0
                table_element_value['QUANTITY'] = (event.target.value) ? parseInt(event.target.value)  : 0
                table_element_value[id] = event.target.value
            }

            if(_qty_input == "UNITCOST"){
                table_element_value['AMOUNT']  =    (event.target.value) ? parseFloat(table_element_value['QUANTITY']) * parseFloat(table_element_value['UNITCOST']) : 0
                table_element_value['UNITCOST']  =  (event.target.value) ? parseInt(event.target.value)  : 0
                table_element_value[id] = event.target.value

            }
            

            
            if(_qty_input == "PRODUCTDESC"){
                table_element_value['PRODUCTDESC'] = (event.target.value) ? event.target.value : ''
                table_element_value[id] = event.target.value
            }

            if(_qty_input == "ID_PRODUCT_DESC"){
                table_element_value['ID_PRODUCT_DESC'] = (event.target.value) ? event.target.value : ''
                table_element_value[id] = event.target.value
            }
            
            if(_qty_input == "Remarks"){
                table_element_value['Remarks'] = event.target.value
            }

            if(_qty_input == "ID_GST_VALUE"){
                table_element_value['ID_GST_VALUE'] = (event.target.value) ? parseFloat(event.target.value) : 0
            }

            if(_qty_input == "ID_UNIT_COST"){
                table_element_value['ID_UNIT_COST'] = event.target.value
            }

            
            if(_qty_input == "WarrantyTerms"){
                table_element_value['WarrantyTerms'] = event.target.value
            }
            if(_qty_input == "GIFT"){
                console.log('table_element_value', table_element_value, table_element_value[id])
                table_element_value['GIFT'] = event.target.value
            }
            if(_qty_input == "Segmentation"){
                console.log('Segmentation', table_element_value, table_element_value[id])
                table_element_value['Segmentation'] = event.target.value
            }
            if(table_element_value[id]){
                table_element_value[id] =  event.target.value
            }
           
        })


        let _total_amount = 0;
        let _sst_amount = 0;
        let _sub_amount =0 ;
        let _total =0 ;
        table_body.forEach((_datas,index)=>{
            _sub_amount = 0
            _sst_amount = parseFloat(_datas.ID_GST_VALUE) 
            _total_amount += parseFloat(_datas.ID_UNIT_COST)
            _total += parseFloat(_datas.ID_UNIT_COST) * parseFloat(_datas.ID_GST_VALUE) 
            table_body[index].PRODUCTCODE = index;
            table_body[index].POD_ASSET_NO = "";
            table_body[index].POD_ASSET_GROUP = "";
            table_body[index].ProductType = "";
            table_body[index].GSTRATE = 0
            table_body[index].AMOUNT = parseFloat(_datas['QUANTITY']) * parseFloat(_datas['UNITCOST']) 
            
        })

        this.setState({
            table_body:table_body,
            datas:_data,
            sub_amount : _sst_amount,
            total_amount : _total_amount,
            total : _total,
            sst_amount : _sst_amount,
            // show_submit_button : false,
        })

       

        return event.target.value;
    }

    

   download_file(details){
       if(details.hasOwnProperty('CDA_ATTACH_FILENAME')){
           details  = {
                strFile: details.CDA_ATTACH_FILENAME,
                strFile1 :  details.CDA_HUB_FILENAME,
                Text: details.CDA_FILESIZE,
                ID: details.CDA_ATTACH_INDEX,
            }
       }
    this.props.download(details)
       
      
   }

    handleheaderlinks(values, details){
        let _target_name = ''
        let _table_model_header = '';
        let _table_model_body = '';
        let _modal_title = '';
        let _optional_model = ''
        let _custom_model = ''


        if(details.id=="FUNDTYPE"){
            _table_model_header = [
                    {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                    {name : "Code", id:"AC_ANALYSIS_CODE"},
                ];
            _table_model_body = this.props.fund_type_project_code_l1;
            _modal_title = "Fund Type (L1)"
            _optional_model = true;
            _custom_model = false;
        }
        else if(details.id=="deliveryAddress"){
            _table_model_header = [
                {name : "Code", id:"AM_ADDR_CODE", key:true},
                {name : "Address", id:"AM_ADDR_LINE1"},
                {name : "City", id:"AM_CITY"},
                {name : "State", id:"STATE"},
                {name : "Post Code", id:"AM_POSTCODE"},
                {name : "Country", id:"AM_COUNTRY"},
            ];
            _table_model_body = this.props.delivery_address;
            _modal_title = "Delivery Address"
            _optional_model = true;
            _custom_model = false;
        }

        else if(details.id=="PRODUCTTYPE"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body = this.props.fund_type_project_code_l2;
            _modal_title = "Product Type"
            _optional_model = true;
            _custom_model = false;
        }

        else if(details.id=="CHANNEL"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body = this.props.fund_type_project_code_l3;
            _modal_title = "Channel"
            _optional_model = true;
            _custom_model = false;
        }

        else if(details.id=="REINSURANCECOMPANY"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body = this.props.fund_type_project_code_l4;
            _modal_title = " Reinsurance Company (L4)"
            _optional_model = true;
            _custom_model = false;
        }

        else if(details.id=="ASSETFUND"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body = this.props.fund_type_project_code_l5;
            _modal_title = "Asset Fund (L5)"
            _optional_model = true;
            _custom_model = false;
        }

        else if(details.id=="costCentre"){
            _table_model_header = [
                {name : "Budget Account Code", id:"AM_ACCT_CODE", key:true},
                {name : "Budget Account", id:"AM_ACCT_DESC"},
            ];
            _table_model_body = this.props.cost_centre_code;
            _modal_title = "Cost Centre Code (L7)"
            _optional_model = true;
            _custom_model = false;
        }

        else if(details.id=="PERSONCODEDESC"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body = this.props.fund_type_project_code_l9
            _modal_title = "Person Code (L9)"
            _optional_model = true;
            _custom_model = false;
        }

        

        else if(details.id=="PROJECTCODEDESC"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body =this.props.fund_type_project_code_l8
            _modal_title = "Project / ACR (L8) Code"
            _optional_model = true;
            _custom_model = false;
        }

        else if(details.id=="GLDESCRIPTION"){
            _table_model_header = [
                {name : "Description", id:"GLCODE", key:true},
                {name : "Code", id:"DESCRIPTION"},
            ];
            _table_model_body = (this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode) ? this.props.gl_code.FFRaisePO.dsGLCode : []
            _modal_title = "Select GL Code"
            _optional_model = true;
            _custom_model = false;
        }

        else if (details.id=="ID_WITHHOLDING_TAX"){
            _custom_model = true;
            _optional_model = false;
       
        }
        
        this.setState({
            modal_popup:_optional_model,
            custom_modal_popup:_custom_model,
            width_hold : [],
            custom_modal_type:'All',
            modal_popup_header:_table_model_header,
            modal_popup_title:_modal_title,
            modal_popup_body:_table_model_body,
            model_current_id: details.id,
            custim_model_text_value : null,
            custim_model_check_box : '',
            custim_model_taxtarea_value : '',
        })
       
    }

    async updateData(update_details) {
        let {table_body} = this.state
       
        if(update_details.length>0){
             let _temp_details = {}
             let _details = (this.props.request_form && this.props.request_form.values && this.props.request_form.values.e2psearch) ? this.props.request_form.values.e2psearch  : {}
             _temp_details.DocNo = _details.DocNo
             _temp_details.oldDocNo = '';
             _temp_details.DocType = _details.DocType
             _temp_details.mode = ''
             _temp_details.MasterDoc = this.state.MasterDoc
             _temp_details.VenCompIDX = ''
             _temp_details.VendorName = (this.state.address && this.state.address.VendorName) ? this.state.address.VendorName : ''
             _temp_details.items = update_details
             if(_temp_details.items){
                _temp_details.items.forEach((list_details, index)=>{
                    _temp_details.items[index].ID_INVOICE_LINE = index+table_body.length
                })
             }
             this.setState({ loading:true})
             
            update_details.forEach((list_details, index)=>{
                table_body.push(list_details)
                })
                this.setState({ 
                    loading:false,
                    show_submit_button : true
                })
                table_body.forEach((list_details,index)=>{
                table_body[index].ID_INVOICE_LINE = index
                table_body[index].PRODUCTCODE = index
                let _details_main = `itemList.${index}.${index}`
                if(list_details.ID_REF_NO){
                    this.props.change(`${_details_main}.ID_REF_NO`, list_details.ID_REF_NO)
                }
                this.props.change(`${_details_main}.ID_PAY_FOR`, list_details.ID_PAY_FOR)
                this.props.change(`${_details_main}.ID_GST_REIMB`, list_details.ID_GST_REIMB)
                this.props.change(`${_details_main}.ID_PRODUCT_DESC`, list_details.ID_PRODUCT_DESC)
                this.props.change(`${_details_main}.ID_UNIT_COST`, list_details.ID_UNIT_COST)
                this.props.change(`${_details_main}.ID_GST_VALUE`, list_details.ID_GST_VALUE)
                this.props.change(`${_details_main}.ID_GST_INPUT_TAX_CODE`, list_details.ID_GST_INPUT_TAX_CODE)
                this.props.change(`${_details_main}.ID_CATEGORY`, list_details.ID_CATEGORY)
            })
            this.setState({
                table_body : table_body,
                show_add_line : false 
            })
        }
    }

    updateWithholdData = (_details) =>{
        let {table_body} = this.state
        if(table_body && table_body.length){
            if(this.state.custom_modal_type=="All"){
                table_body.forEach((list_details, index)=>{
                    table_body[index].ID_WITHHOLDING_TAX =  (this.state.custim_model_text_value) ? this.state.custim_model_text_value : null
                    table_body[index].ID_WITHHOLDING_OPT =  this.state.custim_model_check_box
                    table_body[index].ID_WITHHOLDING_REMARKS = this.state.custim_model_taxtarea_value
                })
            }
            else{
                table_body.forEach((list_details, index)=>{
                    if(index==this.state.custom_modal_type){
                        table_body[index].ID_WITHHOLDING_TAX =  (this.state.custim_model_text_value) ? this.state.custim_model_text_value : null
                        table_body[index].ID_WITHHOLDING_OPT =  this.state.custim_model_check_box
                        table_body[index].ID_WITHHOLDING_REMARKS = this.state.custim_model_taxtarea_value
                    }
                })
            }
            
            this.setState({
                table_body : table_body,
                custim_model_check_box : '',
                custim_model_text_value : '',
                custim_model_taxtarea_value : '',
                custom_modal_popup : false
            })
        }
    }


    ClearWithhold = () =>{
        this.setState({
            custim_model_check_box : '',
            custim_model_text_value : null,
            custim_model_taxtarea_value : '',
        })
    }

     getProducts (values, details){
        let _all_products = this.state.products;
        if(details){
            let _all_products = this.state.products;
            if(values.hasOwnProperty('itemcode')){
                _all_products.push(values.itemcode)
                this.setState({
                    products : _all_products
                })
            }
        }
        else{
             let products = this.state.products.filter((fieldValue, index) => fieldValue !== values.CDI_PRODUCT_CODE);
             this.setState({
                products : products
            })
        }
    }



    closemodel = () => {
        this.setState({
            model : false,
            modal_popup : false,
            open:false,
            custom_modal_popup : false,
            table_master_popup : false,
        })

       
    }

    CloseMultiInvoice = () =>{
        this.setState({
            show_multi_invoice :false,
        })
    }

    CloseShowMultiGl = () =>{
        this.setState({
            show_multi_gl :false,
        })
    }

    FileUpload = (attachment) => {
        let _temp_details = localStorage.getItem('e2p_req_details')
        if(_temp_details){
            _temp_details = JSON.parse(_temp_details)
        }
        let _get_details  = attachment.target;
        let _file_name ='';
       
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType": "0",
            "strDocType": "IPP",
            "pEnumUploadForm": "0",
            "strDocNo":(_temp_details && _temp_details.OldDocNo) ? _temp_details.OldDocNo: "",
            "blnTemp": "false",
            "strIndex": "",
            "seq": "",
            "pFrontOfficeSite": "",
            "AttachType": attachment,
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
            "modeType": (_temp_details && _temp_details.OldDocNo) ? "Mod" : "New"
        }
        if(_file_name == "e2psearch.internalAttachment" && this.state.internal_file){
            req.AttachType = 'I';
            this.props.UploadDocuments(this.state.internal_file, req)
            this.setState({
                external_delete : false,
                external_upload : false,
                internal_delete : false,
                internal_upload : true,
                filename:'',
                internal_file : '',
                local_render : false,
                internal_file_name :'',
            })
            attachment.target.value = null
        }
        else if(_file_name == "e2psearch.externalAttachment" && this.state.external_file){
            req.AttachType = 'E';
            this.props.UploadDocuments(this.state.external_file, req)
            this.setState({
                internal_delete : false,
                internal_upload : false,
                external_delete : false,
                external_upload : true,
                filename:'',
                external_file : '',
                external_file_name :'',
                local_render : false,
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
                model: true,
                local_render : false,
            })
        }
    }

    SendUpload = (e) => {
        let _details  = CheckFileDetails(e);
        if(_details.status){
            if(e.target.name=="e2psearch.internalAttachment"){
                this.setState({
                    internal_file : e.target.files[0],
                    internal_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }
            else if(e.target.name=="multi_gl_file_upload"){
                this.setState({
                    show_multi_gl_file : e.target.files[0],
                    show_multi_gl_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }

            else if(e.target.name=="multi_invoice_file_upload"){
                this.setState({
                    show_multi_invoice_file : e.target.files[0],
                    show_multi_invoice_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }
            else{

            }
        }
        else{
            this.setState({
                model:true,
                status:false,
                modal_body:_details.message
            })
        }
    }

    handleDate = (details) =>{
        this.setState({
            date_details : details
        })
    }

    handleDateTable (details, name, id){
        let dates = this.state.dates
        if(dates.length && dates[id]){
            if(dates[id]){
                dates[id] = details
            }
            else{
                dates[id]= details
            }
            
        }
        else{
            dates[id]=details
        }
        this.setState({
            dates: dates
        })

    }

   

    getSerial() {
      return ++this.serial;
    }

    getSelectedItem(values, isSelected, details){
        let _all_products = this.state.products;
        if(values.hasOwnProperty('PRODUCTCODE') && isSelected){
            _all_products.push(values.PRODUCTCODE)
            this.setState({
                products : _all_products
            })
        }
        else{
            this.setState({ products: this.state.products.filter(it => it !== values.PRODUCTCODE) });
        }
    }
    
    getSelectedProduct(e, details, selected){
        let {current_id, current_model, table_body} = this.state;
       
      
        if(current_id!='' && current_model && table_body[current_id]){
            let _details =  Object.assign({},table_body[current_id],  e)
            table_body[current_id] = _details;
            if(current_model=="FUNDTYPE"){
                table_body[current_id][current_model] = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE1= e.AC_ANALYSIS_CODE
                table_body[current_id].FUNDTYPE = e.AC_ANALYSIS_CODE_DESC
            }
            else if(current_model=="deliveryAddress"){
                table_body[current_id][current_model] = e.AM_ADDR_LINE1
                table_body[current_id].DeliveryAddr= e.AM_ADDR_CODE
            }
            else if(current_model=="costCentre"){
                table_body[current_id][current_model] = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE
                table_body[current_id].prdAcctIndex = e.AM_ACCT_INDEX;
                table_body[current_id].ID_ANALYSIS_CODE7 = e.CDM_DEPT_CODE;
                table_body[current_id].costCentre = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE;
                table_body[current_id].ID_COST_CENTER  = e.AM_ACCT_CODE
                table_body[current_id].ID_COST_CENTER_DESC  = e.AM_ACCT_DESC

            }
            
          
            else if(current_model=="GLDESCRIPTION"){
                table_body[current_id][current_model] =e.DESCRIPTION
                table_body[current_id].GLDESCRIPTION = e.DESCRIPTION;
                table_body[current_id].ID_B_GL_CODE = e.GLCODE;
            }

            else if(current_model=="PRODUCTTYPE"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE2 = e.AC_ANALYSIS_CODE 
                table_body[current_id].PRODUCTTYPE = e.AC_ANALYSIS_CODE_DESC
            }
            else if(current_model=="CHANNEL"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE3 = e.AC_ANALYSIS_CODE 
                table_body[current_id].CHANNEL = e.AC_ANALYSIS_CODE_DESC
            }

            else if(current_model=="REINSURANCECOMPANY"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE4 = e.AC_ANALYSIS_CODE 
                table_body[current_id].REINSURANCECOMPANY = e.AC_ANALYSIS_CODE_DESC
            }

            else if(current_model=="ASSETFUND"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE5 = e.AC_ANALYSIS_CODE 
                table_body[current_id].ASSETFUND = e.AC_ANALYSIS_CODE_DESC
            }

            else if(current_model=="PROJECTCODEDESC"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE8 = e.AC_ANALYSIS_CODE 
                table_body[current_id].PROJECTCODEDESC = e.AC_ANALYSIS_CODE_DESC
            }

            else if(current_model=="PERSONCODEDESC"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE9 = e.AC_ANALYSIS_CODE 
                table_body[current_id].PERSONCODEDESC = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].PERSONCODE = e.AC_ANALYSIS_CODE;
            }
            
        }

        this.setState({
            table_body: table_body,
            table_modal_popup : false,
            // show_submit_button : false,
            table_model_body :[],
            model : false ,
            current_model : '',
            current_id : ''
        })
    }  
    
    
    getPopupSelectedProductLoaded = (table_body, model_current_id) => {
       
        if(model_current_id){
            console.log('model_current_id', model_current_id)
            let temp_data = {};
            if(model_current_id=="FUNDTYPE"){
                let _temp_details  = this.props.fund_type_project_code_l1.filter((list_details)=>list_details.AC_ANALYSIS_CODE==table_body.ID_ANALYSIS_CODE1)
                if(_temp_details.length>0){
                    temp_data.FUNDTYPE = _temp_details[0].AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE1= _temp_details[0].AC_ANALYSIS_CODE
                }
                else{
                    temp_data.FUNDTYPE = ''
                    temp_data.ID_ANALYSIS_CODE1= ''
                }
                return temp_data;
            }

            else if(model_current_id=="PRODUCTTYPE"){
                let _temp_details  = this.props.fund_type_project_code_l2.filter((list_details)=>list_details.AC_ANALYSIS_CODE==table_body.ID_ANALYSIS_CODE2)
                if(_temp_details.length>0){
                    temp_data.PRODUCTTYPE = _temp_details[0].AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE2= _temp_details[0].AC_ANALYSIS_CODE
                }
                else{
                    temp_data.PRODUCTTYPE = ''
                    temp_data.ID_ANALYSIS_CODE2= ''
                }
                return temp_data;
            }

            else if(model_current_id=="CHANNEL"){
                let _temp_details  = this.props.fund_type_project_code_l3.filter((list_details)=>list_details.AC_ANALYSIS_CODE==table_body.ID_ANALYSIS_CODE3)
                if(_temp_details.length>0){
                    temp_data.CHANNEL = _temp_details[0].AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE3= _temp_details[0].AC_ANALYSIS_CODE
                }
                else{
                    temp_data.CHANNEL = ''
                    temp_data.ID_ANALYSIS_CODE3= ''
                }
                return temp_data;
            }

            else if(model_current_id=="REINSURANCECOMPANY"){
                let _temp_details  = this.props.fund_type_project_code_l4.filter((list_details)=>list_details.AC_ANALYSIS_CODE==table_body.ID_ANALYSIS_CODE4)
                if(_temp_details.length>0){
                    temp_data.REINSURANCECOMPANY = _temp_details[0].AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE4= _temp_details[0].AC_ANALYSIS_CODE
                }
                else{
                    temp_data.REINSURANCECOMPANY = ''
                    temp_data.ID_ANALYSIS_CODE4= ''
                }
                return temp_data;
            }

            else if(model_current_id=="ASSETFUND"){
                let _temp_details  = this.props.fund_type_project_code_l5.filter((list_details)=>list_details.AC_ANALYSIS_CODE==table_body.ID_ANALYSIS_CODE5)
                if(_temp_details.length>0){
                    temp_data.ASSETFUND = _temp_details[0].AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE5 = _temp_details[0].AC_ANALYSIS_CODE
                }
                else{
                    temp_data.ASSETFUND = ''
                    temp_data.ID_ANALYSIS_CODE1= ''
                }
                return temp_data;
            }

            else if(model_current_id=="PROJECTCODEDESC"){
                let _temp_details  = this.props.fund_type_project_code_l8.filter((list_details)=>list_details.AC_ANALYSIS_CODE==table_body.ID_ANALYSIS_CODE8)
                if(_temp_details.length>0){
                    temp_data.PROJECTCODEDESC = _temp_details[0].AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE8 = _temp_details[0].AC_ANALYSIS_CODE
                }
                else{
                    temp_data.PROJECTCODEDESC = ''
                    temp_data.ID_ANALYSIS_CODE8= ''
                }
                return temp_data;
            }

            else if(model_current_id=="PERSONCODEDESC"){
                let _temp_details  = this.props.fund_type_project_code_l9.filter((list_details)=>list_details.AC_ANALYSIS_CODE==table_body.ID_ANALYSIS_CODE9)
                if(_temp_details.length>0){
                    temp_data.PERSONCODEDESC = _temp_details[0].AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE8 = _temp_details[0].AC_ANALYSIS_CODE
                }
                else{
                    temp_data.PERSONCODEDESC = ''
                    temp_data.ID_ANALYSIS_CODE8= ''
                }
                return temp_data;
            }

            else if(model_current_id=="GLDESCRIPTION"){
                let _temp_details  = (this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode) ? this.props.gl_code.FFRaisePO.dsGLCode.filter((list_details)=>list_details.GLCODE==table_body.ID_B_GL_CODE) : []
                if(_temp_details.length>0){
                    temp_data.GLDESCRIPTION = _temp_details[0].DESCRIPTION;
                    temp_data.ID_B_GL_CODE = _temp_details[0].GLCODE;
                }
                else{
                    temp_data.GLDESCRIPTION = ''
                    temp_data.ID_B_GL_CODE= ''
                }

                console.log('GLDESCRIPTION', temp_data)
                return temp_data;
            }

            else if(model_current_id=="costCentre"){

                console.log('this.props.cost_centre_code', this.props.cost_centre_code)
                let _temp_details  = (this.props.cost_centre_code) ? this.props.cost_centre_code.filter((list_details)=>list_details.CDM_DEPT_CODE==table_body.ID_ANALYSIS_CODE7) : []
                if(_temp_details.length>0){
                    temp_data.prdAcctIndex = _temp_details[0].AM_ACCT_INDEX;
                    temp_data.ID_ANALYSIS_CODE7 = _temp_details[0].CDM_DEPT_CODE;
                    temp_data.costCentre = _temp_details[0].CDM_DEPT_CODE+'-'+_temp_details[0].AM_ACCT_DESC+':'+_temp_details[0].AM_ACCT_CODE;
                    temp_data.ID_COST_CENTER  = _temp_details[0].AM_ACCT_CODE
                    temp_data.ID_COST_CENTER_DESC  = _temp_details[0].AM_ACCT_DESC

                }
                else{
                    temp_data.prdAcctIndex = ''
                    temp_data.ID_ANALYSIS_CODE7 = ''
                    temp_data.costCentre = ''
                    temp_data.ID_COST_CENTER  = ''
                    temp_data.ID_COST_CENTER_DESC  = ''
                }
                return temp_data;
            }
        }
    }

    getPopupSelectedProduct = (e, details, selected) => {
        let {model_current_id, table_body} = this.state;
        if(!table_body.length){
            table_body = (this.props.purchased_items.getPurchaseRequestItemsDetails) ? this.props.purchased_items.getPurchaseRequestItemsDetails : []
        }
    
        let _final_result =[]
        if(table_body.length){
           
            table_body.forEach((list,index)=>{
                let temp_data = Object.assign({} , list ,  e)
                if(model_current_id=="FUNDTYPE"){
                    temp_data[model_current_id]= e.AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE1= e.AC_ANALYSIS_CODE
                    temp_data.FUNDTYPE = e.AC_ANALYSIS_CODE_DESC
                }
                else if(model_current_id=="deliveryAddress"){
                    temp_data[model_current_id]= e.AM_ADDR_LINE1
                    temp_data.DeliveryAddr= e.AM_ADDR_CODE
                }
                else if(model_current_id=="costCentre"){
                    temp_data[model_current_id]= e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE
                    temp_data.prdAcctIndex = e.AM_ACCT_INDEX;
                    temp_data.ID_ANALYSIS_CODE7 = e.CDM_DEPT_CODE;
                    temp_data.costCentre = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE;
                    temp_data.ID_COST_CENTER  = e.AM_ACCT_CODE
                    temp_data.ID_COST_CENTER_DESC  = e.AM_ACCT_DESC

                }
               
               
                else if(model_current_id=="GLDESCRIPTION"){
                    temp_data[model_current_id]=e.DESCRIPTION
                    temp_data.GLDESCRIPTION = e.DESCRIPTION;
                    temp_data.ID_B_GL_CODE = e.GLCODE;
                }

                else if(model_current_id=="PRODUCTTYPE"){
                    temp_data[model_current_id] = e.AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE2 = e.AC_ANALYSIS_CODE 
                    temp_data.PRODUCTTYPE = e.AC_ANALYSIS_CODE_DESC
                }
                else if(model_current_id=="CHANNEL"){
                    temp_data[model_current_id] = e.AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE3 = e.AC_ANALYSIS_CODE 
                    temp_data.CHANNEL = e.AC_ANALYSIS_CODE_DESC
                }

                else if(model_current_id=="REINSURANCECOMPANY"){
                    temp_data[model_current_id] = e.AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE4 = e.AC_ANALYSIS_CODE 
                    temp_data.REINSURANCECOMPANY = e.AC_ANALYSIS_CODE_DESC
                }

                else if(model_current_id=="ASSETFUND"){
                    temp_data[model_current_id] = e.AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE5 = e.AC_ANALYSIS_CODE 
                    temp_data.ASSETFUND = e.AC_ANALYSIS_CODE_DESC
                }

                else if(model_current_id=="PROJECTCODEDESC"){
                    temp_data[model_current_id] = e.AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE8 = e.AC_ANALYSIS_CODE 
                    temp_data.PROJECTCODEDESC = e.AC_ANALYSIS_CODE_DESC
                    temp_data.PROJECTCODE = e.AC_ANALYSIS_CODE;

                }

                else if(model_current_id=="PERSONCODEDESC"){
                    temp_data[model_current_id] = e.AC_ANALYSIS_CODE_DESC
                    temp_data.ID_ANALYSIS_CODE9 = e.AC_ANALYSIS_CODE 
                    temp_data.PERSONCODEDESC = e.AC_ANALYSIS_CODE_DESC
                    temp_data.PERSONCODE = e.AC_ANALYSIS_CODE;
                    
                }

                
                _final_result.push(temp_data)
            })
        }


        this.setState({
            // show_submit_button : false,
            table_body: _final_result,
            table_model_body :[],
            modal_popup : false ,
            model_current_id : ''
        })

    }

    handlePopup(input,details){

        let _get_all_state = this.state;
        let _target_id = input.target.getAttribute('data-name');
        let _target_name = input.target.getAttribute('data-details');
        let _width_details = {}
        console.log('_target_id', _target_id)
        console.log('_target_name', _target_name)
        let _details = {
            model : true ,
            custom_modal_popup : false,
            table_display :true,
            current_model : _target_name,
            current_id : _target_id,
            table_model_header : [],
            table_model_body : []
        }


        if(_target_name=="FUNDTYPE"){
            _details.table_model_header = [
                    {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                    {name : "Code", id:"AC_ANALYSIS_CODE"},
                ];
             _details.table_model_body = this.props.fund_type_project_code_l1;
             _details.fund_transfer_l1 = [_target_id]
             _details.modal_title = "Fund Type (L1)"

        }
        else if(_target_name=="deliveryAddress"){
            _details.table_model_header = [
                {name : "Code", id:"AM_ADDR_CODE", key:true},
                {name : "Address", id:"AM_ADDR_LINE1"},
                {name : "City", id:"AM_CITY"},
                {name : "State", id:"STATE"},
                {name : "Post Code", id:"AM_POSTCODE"},
                {name : "Country", id:"AM_COUNTRY"},
            ];
             _details.table_model_body = this.props.delivery_address;
             _details.da = [_target_id]
             _details.modal_title = "Delivery Address"
        }

        
        else if(_target_name=="PRODUCTTYPE"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l2;
            _details.modal_title = "Product Type"
        }

        else if(_target_name=="CHANNEL"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l3;
            _details.modal_title = "Channel"
        }

        else if(_target_name=="REINSURANCECOMPANY"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l4;
            _details.modal_title = " Reinsurance Company (L4)"
            console.log('REINSURANCECOMPANY',  _details.table_model_body,   _details.table_model_header)
        }

        else if(_target_name=="ASSETFUND"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l5;
            _details.modal_title = "Asset Fund (L5)"
        }

        else if(_target_name=="costCentre"){
            _details.table_model_header = [
                {name : "Budget Account Code", id:"AM_ACCT_CODE", key:true},
                {name : "Budget Account", id:"AM_ACCT_DESC"},
            ];
            _details.table_model_body = this.props.cost_centre_code;
            _details.modal_title = "Cost Centre Code (L7)"
        }

        else if(_target_name=="PERSONCODEDESC"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l9
            _details.modal_title = "Person Code (L9)"
        }

        

        else if(_target_name=="PROJECTCODEDESC"){
            _details.table_model_header  = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body =this.props.fund_type_project_code_l8
            _details.modal_title = "Project / ACR (L8) Code"
        }

        else if(_target_name=="GLDESCRIPTION"){
            _details.table_model_header  = [
                {name : "Description", id:"GLCODE", key:true},
                {name : "Code", id:"DESCRIPTION"},
            ];
            _details.table_model_body = (this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode) ? this.props.gl_code.FFRaisePO.dsGLCode : []
            _details.modal_title = "Select GL Code"
        }

        else if(_target_name=="ID_WITHHOLDING_TAX"){
            _width_details  = _get_all_state.table_body[_target_id]
            _details.model  = false
            _details.custom_modal_popup = true
        }

        let _main_details = Object.assign({}, _get_all_state, _details)
        this.setState({
            table_modal_popup : _main_details.model,
            width_hold : _width_details,
            custom_modal_popup : _main_details.custom_modal_popup,
            custom_modal_type: _main_details.current_id,
            table_display : _main_details.table_display,
            current_model :  _main_details.current_model,
            current_id :  _main_details.current_id,
            table_model_header :  _main_details.table_model_header,
            table_model_body :  _main_details.table_model_body,
            custim_model_text_value : (_width_details && _width_details.ID_WITHHOLDING_TAX) ?_width_details.ID_WITHHOLDING_TAX : '',
            custim_model_check_box : (_width_details && _width_details.ID_WITHHOLDING_OPT) ?_width_details.ID_WITHHOLDING_OPT : '',
            custim_model_taxtarea_value : (_width_details && _width_details.ID_WITHHOLDING_REMARKS) ?_width_details.ID_WITHHOLDING_REMARKS : '',
            ccc :  _main_details.ccc,
            da :  _main_details.da,
            modal_body:'',
            modal_title : _main_details.modal_title

        })
    }

    makeDuplicate = (e) =>{
        let {table_body, products, slected_items} = this.state;
        if(!slected_items.length){
            this.setState({
                status:false,
                table_display:false,
                validation : true, 
                modal_title : 'Validation',
                modal_body:'Select Atleast One Product'
            })
        }
        else{
            let _get_selected = []
            slected_items.forEach((list)=>{
                let _get_duplicate =   table_body.filter((list_element, index)=> index ==list)
                if(_get_duplicate.length){
                    table_body.push(_get_duplicate[0])
                }
            })

            this.setState({
                delete:true,
                table_body:table_body,
            })
         
        }

    }
    
    removeItem = (e, details) =>{
        console.log('removeItem', e, details);
        let {table_body, products, slected_items} = this.state;
        
        slected_items.forEach((list)=>{
            let _details = table_body.filter((list_element, index)=> index!=list)
            let _selected_items = slected_items.filter((list_element)=> list_element!=list)
            this.setState({
                delete:true,
                slected_items : _selected_items ,
                table_body: (_details ? _details  : [])
            })
        })
    }

    commonfunction = async (e2psearch) => {
        e2psearch.type = e2psearch.e2psearch.prNo === '' || null ? 'new' : 'mod';
        e2psearch.mode = this.props.location === undefined || null ? 'bc' : 'cc';
        let ss = this.state.Addressvalue[0];
        let billingAddress = {
            "pr_cost": this.state.purchaseRequestDetailsModifiedData.reduce((a, val) => a += (val.QUANTITY * val.UNITCOST) + val.GST, 0),
            "AM_ADDR_CODE": ss.AM_ADDR_CODE,
            "AM_ADDR_LINE1": ss.AM_ADDR_LINE1,
            "AM_ADDR_LINE2": ss.AM_ADDR_LINE2,
            "AM_ADDR_LINE3": ss.AM_ADDR_LINE3,
            "AM_POSTCODE": ss.AM_POSTCODE,
            "AM_STATE": ss.AM_STATE,
            "AM_CITY": ss.AM_CITY,
            "AM_COUNTRY": ss.AM_COUNTRY
        }
        Object.assign(e2psearch.e2psearch, billingAddress);
        let prCustomList = [];
        for (let index = 0; index < this.state.products.length; index++) {
            const element = this.state.purchaseRequestDetailsModifiedData[index];
            let temp = {
                "PCD_PR_LINE": index + 1,
                "PCD_FIELD_NO": "1",
                "PCD_FIELD_VALUE": element.segmentation
            }
            prCustomList.push(temp);
        }
        let itemList = { "itemList": this.state.purchaseRequestDetailsModifiedData };
        const object3 = { ...e2psearch, ...itemList }
        object3.customFieldList = prCustomList;

    }

    addItem = () => {
        this.setState({
            addmodel:true
        })
    }

    deleteFile = (val, type) => {
        let _temp_details = localStorage.getItem('e2p_req_details')
        if(_temp_details){
            _temp_details = JSON.parse(_temp_details)
        }
        val.AttachType = type;
        if(val.AttachType=="I"){
            this.setState({internal_delete:true,  local_render : false})
        }
        else{
             this.setState({external_delete:true,  local_render : false})
        }
        val.modeType =(_temp_details && _temp_details.OldDocNo) ?  "Mod" : "New";
        if(val.hasOwnProperty('CDA_ATTACH_FILENAME')){
            let _tempdetails  = {
                strFile: val.CDA_ATTACH_FILENAME,
                strFile1 :  val.CDA_HUB_FILENAME,
                AttachType:"I",
                Text: val.CDA_FILESIZE,
                ID: val.CDA_ATTACH_INDEX,
              
            
            }
            val = Object.assign({}, val, _tempdetails) 
        }

        val = {"CDA_DOC_TYPE":"IPP","AttachType":"I","modeType":(_temp_details && _temp_details.OldDocNo) ?  "Mod" : "New","ID":val.ID,"CDA_DOC_NO":""}
        val.CDA_DOC_TYPE = "IPP";
        val.CDA_DOC_NO = (_temp_details && _temp_details.OldDocNo) ? _temp_details.OldDocNo: "";
        this.props.get_delete_file(val);
    }

    handledateHeader = (e, details) => {
        this.setState({
            main_date: e
        })

       let {table_body} = this.state
       let _temp_date = new Array();
       let _temp_dates = new Array();
       table_body.forEach((list,index)=>{
            let _date_name = 'itemList.'+index+'.'+index+'.delivery';
            this.props.change(_date_name, e)
            _temp_dates.push(e)
            _temp_date.push(list);
       })

    
       this.setState({
            table_body : _temp_date,
            main_date : details,
            dates : _temp_dates
       })
    }

    void_pr = async() => {
        if((this.state.address && this.state.address.VenCompIDX) && localStorage.getItem('e2p_req_details')){
            let _temp_details = localStorage.getItem('e2p_req_details');
            if(_temp_details){
                _temp_details = JSON.parse(_temp_details)
            }
            let _final_datas = {
                invoiceIndex :_temp_details.InvIdx,
                invoiceNo : _temp_details.OldDocNo,
                vendorIndex : (this.state.address && this.state.address.VenCompIDX) ? this.state.address.VenCompIDX : '',
            }
            this.setState({ loading:true})
            let _status =  await ApiExtract(VoidE2P, _final_datas)
            if(_status){
                this.setState({
                    status:_status.status,
                    table_display:false,
                    model : true, 
                    modal_title : '',
                    submit_type : "void",
                    modal_body:_status.message,
                    loading:false
                })
               
            }
        }
    }

    async checkValidDoc(sub_type){
        let _status = true
        let _values = {}
        let _values_main = (this.props.request_form && this.props.request_form.values ) ? {...this.props.request_form.values} : {} ;
        let _tem_idx = localStorage.getItem('e2p_req_details')
        if(_tem_idx){
            _tem_idx = JSON.parse(_tem_idx)
            _tem_idx = _tem_idx.InvIdx
        }
        _values = Object.assign({},  _values_main.e2psearch)
        let {address} = this.state;
        let _temp_details = {
            DocNo : _values.DocNo,
            DocDate :  (_values.DocDate) ? FromateDate_YY_MM_DD(_values.DocDate) : new Date(),
            VenCompIDX : (address && address.VenCompIDX) ? address.VenCompIDX : '',
            PaymentAmt : _values.PaymentAmt,
            InvIdx :_tem_idx
        }
        if(_temp_details){
            let _status =  await ApiExtract(CheckInvDuplicate, _temp_details)
            if(_status){
                if(_status.response && _status.response.isExistData){
                    this.setState({
                        status: false,
                        confimation:true,
                        confimation_pop:true,
                        loading:false,
                        confimation_type : sub_type,
                        submit_type : 'multiinvoice',
                        modal_body: `${_status.message} ?`,
                    })
                    _status = false;
                    return _status
                }
                else if(!_status.status){
                    
                    this.setState({
                        status: _status.status,
                        model:true,
                        modal_body:  _status.message,
                        loading:false,
                    })
                }

                _status = _status.status
                return _status
            }
        }
        return _status;
    }

    async handlefiltersubmit(values){
        
        let _payment_type = (this.state.address && this.state.address.IC_PAYMENT_METHOD) ? this.state.address.IC_PAYMENT_METHOD : '';
        let _values_main = (this.props.request_form && this.props.request_form.values ) ? {...this.props.request_form.values} : {} ;
        let _submit_type  =  (values.submit_type) ? values.submit_type : '';
        let _get_temp_details = localStorage.getItem('e2p_req_details')
        let {table_body, sub_master_doc} = this.state 
        table_body = table_body.filter((list_details) => list_details.removed!=0)
        table_body = table_body.map((list_details )=>{
            let _temp_details = list_details;
            _temp_details.CC_COY_ID = _temp_details.ID_PAY_FOR;
            return _temp_details
        })
        
        let _values = {};
        if(_submit_type=="continue"){
            let _submit_details = GetContinueDocument()
            _values = Object.assign({}, _submit_details, _values_main.e2psearch)
        }
        else{
            _values = Object.assign({},  _values_main.e2psearch)
        }

        _values.BankAccount =  this.state.address.IC_bank_acct
        _values.BankCode =  this.state.address.IC_bank_code
        _values.VenCompIDX =  this.state.address.VenCompIDX
        _values.VendorName =  this.state.address.VendorName
        _values.VenAddrLine1 =  this.state.address.IC_ADDR_LINE1
        _values.VenAddrLine2 =  this.state.address.IC_ADDR_LINE2
        _values.VenAddrLine3 =  this.state.address.IC_ADDR_LINE3
        _values.VenAddrCity =  this.state.address.IC_STATE2
        
        _values.VenAddrState =  this.state.address.IC_state
        _values.VenAddrCountry =  this.state.address.IC_country
        _values.MasterDoc = this.state.MasterDoc
        _values.PaymentMethod = _payment_type
        _values.ManualPONo = (_values.ManualPONo!="undefined" && typeof _values.ManualPONo !=="undefined") ?  _values.ManualPONo : '';
        _values.lateReason = (_values.lateReason!="undefined" && typeof _values.lateReason !=="undefined") ?  _values.lateReason : '';
        _values.rbtnCoyTypeSelectedValue = (this.state.doc_emp_type && this.state.doc_emp_type=='Vendor')  ? "V" : "E"
        _values.DocDate = (_values.DocDate) ? FromateDate_YY_MM_DD(_values.DocDate) : new Date()
        if(_submit_type=="save" || _submit_type=="submit"){
            _get_temp_details =  JSON.parse(_get_temp_details)
            if(_get_temp_details){
                _values.InvIdx  = _get_temp_details.InvIdx;
                _values.OldDocNo  = _get_temp_details.OldDocNo;
                _values.OldVenCompIDX  = ( _values.OldVenCompIDX) ?  _values.OldVenCompIDX : _get_temp_details.vendor_id
                if(_get_temp_details.reload_data=='true'){
                    _values.VendorName = (this.state.loaded_details &&  this.state.loaded_details.VendorNameMain) ? this.state.loaded_details.VendorNameMain : _values.VendorName
                }
            }
        }
        
       
        this.setState({
            loading:true
        })

        if(_submit_type=="save"){
            this.props.GetE2PWithHoldingTax({invIndxId:_values.OldDocNo})
            _values.oldDocNo = _values.OldDocNo
            _values.mode = (_values.OldDocNo) ? 'edit' : ''
            _values.MasterDoc = this.state.MasterDoc

            

           
            if(_payment_type!="TT" || _values.CurrencyCode !="MYR"){
                _values.btnType = 'Save'
                let _temp_submit_details = true;
                if(table_body && table_body.length){
                    _temp_submit_details = await this.saveItem(table_body)
                    _values.items = table_body
                }
                else{
                    _temp_submit_details = true;
                }

                
                if(this.state.MasterDoc=="Y" && sub_master_doc && sub_master_doc.length){
                    let _temp_submit_details = await this.saveMaster()
                    if(_temp_submit_details){
                        _values.subDoc = sub_master_doc.map((list)=>{
                            let _temp_details =  {...list}
                            _temp_details.docDate = FromateDate_YY_MM_DD(_temp_details.docDate)
                            return _temp_details
                        })
                    }

                }
                else{
                    _temp_submit_details = true;
                }

                
               
                if(_temp_submit_details){
                    let _status =  await ApiExtract(E2PSaveDocDetials, _values)
                    if(_status){
                        this.setState({
                            show_submit_button : true, 
                            status: _status.status,
                            model:true,
                            modal_body: _status.message,
                            loading:false,
                        })
                    }
                }
                else{
                    this.setState({
                        loading:false,
                    })
                }
            }
            else{
                this.setState({
                    status: false,
                    model:true,
                    modal_body: "Please select foreign currency for TT",
                    loading:false,
                })
            }
        }
        else if(_submit_type=="submit"){
            let _update_pay = true
            let _msg = ''
            if(_payment_type!="TT" || _values.CurrencyCode !="MYR"){
                _values.btnType = 'Submit'
                _values.MasterDoc = this.state.MasterDoc
                _values.items = table_body

                if(this.state.MasterDoc=="Y" && sub_master_doc && sub_master_doc.length){
                   
                    let _temp_submit_details = await this.saveMaster()
                    console.log('sub_master_doc_1', sub_master_doc, _temp_submit_details)
                    if(_temp_submit_details){
                        _values.subDoc = sub_master_doc.map((list)=>{
                            let _temp_details =  list
                            _temp_details.docDate = FromateDate_YY_MM_DD(_temp_details.docDate)
                            return _temp_details
                        })
                    }

                    let _sub_payment =  (sub_master_doc) ? sub_master_doc.reduce((a, val) => a += parseFloat(val.docAmount), 0): '0.00'
                    let _sub_total  = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) =>a += (parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST)), 0) : 0;
                    let _sub_gst  = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat(val.ID_GST_VALUE),  0) : 0;
                    let _sst_output_tax = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat((val.ID_RECEIVED_QTY * val.ID_UNIT_COST)*(val.ID_GST/100)),  0) : 0;
                    let _total  = parseFloat(_sub_gst) + parseFloat(_sub_total) + parseFloat(_sst_output_tax)

                    _msg = "All all fields in Sub-Document"
                    if(_sub_payment != _total){
                        _msg = "Sub-Document total must be equal to Total (incl.SST) :"
                    }

                    _update_pay = _temp_submit_details
                
                }
                
                
                if(_update_pay){
                    let _status =  await ApiExtract(E2PSaveDocDetials, _values)
                    if(_status){
                        this.setState({
                            status: _status.status,
                            model:true,
                            modal_body: _status.message,
                            loading:false,
                            reload_submit : (_status.response && _status.response.isRedirect) ? false  : true,
                        })
                        if(_status.status && _status.response.isRedirect){
                            let _temp_details_lc = localStorage.getItem('e2p_req_details')
                            if(_temp_details_lc){
                                _temp_details_lc = JSON.parse(_temp_details_lc)
                            }
                            let _temp_details = {
                                intInvIdx : (this.state.InvIdx) ? this.state.InvIdx : _values.InvIdx,
                                inv_no : (_temp_details_lc) ? _temp_details_lc.OldDocNo : '',
                                vendor_id : (this.state.address && this.state.address.VenCompIDX) ? this.state.address.VenCompIDX : '',
                                PaymentAmt: this.state.table_body.reduce((a, val) =>a += (parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + parseFloat(val.ID_GST_VALUE)), 0),
                                "isResident":(this.state.address && this.state.address.IC_RESIDENT_TYPE) ? this.state.address.IC_RESIDENT_TYPE : 'N',
                                dsapplist:(_status.response && _status.response.dsapplist) ? _status.response.dsapplist : []
                            }
                            localStorage.setItem('e2p_aprov_details', JSON.stringify(_temp_details))
                            this.props.history.push({
                                pathname : 'e2p_approval',
                                datas : _temp_details
                            })
                        }
                    }
                   
                }
                this.setState({
                    status: false,
                    model:true,
                    modal_body:_msg,
                    loading:false,
                })
            }
            else{
                this.setState({
                    status: false,
                    model:true,
                    modal_body: "Please select foreign currency for TT",
                    loading:false,
                })
            }
            
        }
        else{
            if(_payment_type!="TT" || _values.CurrencyCode !="MYR"){
                _values.btnType = ''
                let _temp_status = await this.checkValidDoc(_submit_type);
                if(_temp_status){
                    let _status =  await ApiExtract(E2PSaveDocDetials, _values)
                    if(_status){
                        if(_status.status){
                            localStorage.setItem('e2p_req_details',JSON.stringify({
                                InvIdx :  _status.response.doc.insertId,
                                OldDocNo : _values.DocNo,
                                vendor_id : (this.state.address && this.state.address.VenCompIDX) ? this.state.address.VenCompIDX : ''
                            }))
                            this.setState({
                                show_add_line : true,
                                loading:false,
                                InvIdx : _status.response.doc.insertId
                            })
                        }
                    }
                }
            }
            else{
                this.setState({
                    status: false,
                    model:true,
                    modal_body: "Please select foreign currency for TT",
                    loading:false,
                })
            }
        }

       
    }

    async handlefiltersubmit_valid(values){
        let _values_main = (this.props.request_form && this.props.request_form.values ) ? {...this.props.request_form.values} : {} ;
        let _submit_type  =  (values.submit_type) ? values.submit_type : '';
        let _get_temp_details = localStorage.getItem('e2p_req_details')
        let {table_body} = this.state 
        table_body = table_body.filter((list_details) => list_details.removed!=0)
        let _values = {};
        if(_submit_type=="continue"){
            let _submit_details = GetContinueDocument()
            _values = Object.assign({}, _submit_details, _values_main.e2psearch)
        }
        else{
            _values = Object.assign({},  _values_main.e2psearch)
        }

        _values.BankAccount =  this.state.address.IC_bank_acct
        _values.BankCode =  this.state.address.IC_bank_code
        _values.VenCompIDX =  this.state.address.VenCompIDX
        _values.VendorName =  this.state.address.VendorName
        _values.VenAddrLine1 =  this.state.address.IC_ADDR_LINE1
        _values.VenAddrLine2 =  this.state.address.IC_ADDR_LINE2
        _values.VenAddrLine3 =  this.state.address.IC_ADDR_LINE3
        _values.VenAddrCity =  this.state.address.IC_STATE2
        _values.VenAddrState =  this.state.address.IC_state
        _values.VenAddrCountry =  this.state.address.IC_country
        _values.PaymentMethod = 'IBG'
        _values.MasterDoc = this.state.MasterDoc
       
        _values.DocDate = (_values.DocDate) ? FromateDate_YY_MM_DD(_values.DocDate) : new Date()
        if(_submit_type=="save" || _submit_type=="submit"){
            _get_temp_details =  JSON.parse(_get_temp_details)
            if(_get_temp_details){
                _values.InvIdx  = _get_temp_details.InvIdx;
                _values.OldDocNo  = _get_temp_details.OldDocNo
                _values.OldVenCompIDX  = _get_temp_details.vendor_id
                if(_get_temp_details.reload_data=='true'){
                    _values.VendorName = (this.state.loaded_details &&  this.state.loaded_details.VendorNameMain) ? this.state.loaded_details.VendorNameMain : _values.VendorName
                }
            }
          
        }
        
       
        this.setState({
            loading:true
        })

        if(_submit_type=="submit"){
            // let _temp_status = await this.checkValidDoc();
            // if(_temp_status){
                _values.btnType = 'Submit'
                let _status = await ApiExtract(E2PSaveDocDetials, _values)
                if(_status){
                    this.setState({
                        status: _status.status,
                        model:true,
                        modal_body: _status.message,
                        loading:false,
                        confimation_type : '',
                    })
                    if(_status.status){
                        let _temp_details_lc = localStorage.getItem('e2p_req_details')
                        if(_temp_details_lc){
                            _temp_details_lc = JSON.parse(_temp_details_lc)
                        }
                        let _temp_details = {
                            intInvIdx : (this.state.InvIdx) ? this.state.InvIdx : _values.InvIdx,
                            inv_no : (_temp_details_lc) ? _temp_details_lc.OldDocNo : '',
                            vendor_id : (this.state.address && this.state.address.VenCompIDX) ? this.state.address.VenCompIDX : '',
                            PaymentAmt: this.state.table_body.reduce((a, val) =>a += (parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + parseFloat(val.ID_GST_VALUE)), 0),
                            "isResident":(this.state.address && this.state.address.IC_RESIDENT_TYPE) ? this.state.address.IC_RESIDENT_TYPE : 'N',
                            dsapplist:(_status.response && _status.response.dsapplist) ? _status.response.dsapplist : []
                        }
                        localStorage.setItem('e2p_aprov_details', JSON.stringify(_temp_details))
                        // this.props.history.push({
                        //     pathname : 'e2p_approval',
                        //     datas : _temp_details
                        // })
                    }
                }
            // }
        }
        else{
            let _status =  await ApiExtract(E2PSaveDocDetials, _values)
            if(_status){
                if(_status.status){
                    localStorage.setItem('e2p_req_details',JSON.stringify({
                        InvIdx :  _status.response.doc.insertId,
                        OldDocNo : _values.DocNo,
                        vendor_id : (this.state.address && this.state.address.VenCompIDX) ? this.state.address.VenCompIDX : '',
                    }))
                    this.setState({
                        show_add_line : true,
                        loading:false,
                        InvIdx : _status.response.doc.insertId
                    })
                }
            }
        }

       
    }

    handleQtyChange = async (value, type) =>{
        
        if(value && type=="total"){
           await this.setState({
                input_qty: value
            })
        }
        else if(value && type=="sst"){
            await this.setState({
                input_sst:value,
            })
        }



        let {input_qty, input_sst} = this.state;
        console.log('handleQtyChange', input_qty, input_sst)
        if(input_qty!='' && input_sst!=''){
            this.props.change('e2psearch.PaymentAmt', (parseFloat(input_qty) + parseFloat(input_sst)))
        }
        else if(input_qty!=''){
            this.props.change('e2psearch.PaymentAmt', (parseFloat(input_qty)))
        }
        else{
            this.props.change('e2psearch.PaymentAmt', (parseFloat(input_sst)))
        }
    }

    saveItem = async (_submit_details) =>{
        let {table_body, products} = this.state;
        let _date_inst = new Date();
        let _result = true;
        
        console.log('saveItem', table_body)
        if(table_body.length){
            await table_body.forEach((list_details)=>{   
                if(!list_details.hasOwnProperty('ID_PRODUCT_DESC') || !list_details.ID_PRODUCT_DESC){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Transaction Description is required'
                    })

                    _result = false
                }
                else if(!list_details.hasOwnProperty('ID_B_GL_CODE') || !list_details.ID_PRODUCT_DESC){
                    this.setState({
                        model:true,
                        status:false,
                        modal_title : 'Validation',
                        modal_body : 'GL Code is required'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('ID_GST_INPUT_TAX_CODE') || !list_details.ID_GST_INPUT_TAX_CODE){
                    this.setState({
                        model:true,
                        status:false,
                        modal_title : 'Validation',
                        modal_body : 'Input Tax Code is required'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('PROJECTCODEDESC') || !list_details.PROJECTCODEDESC){
                    this.setState({
                        model:true,
                        status:false,
                        modal_title : 'Validation',
                        modal_body : 'Project Code is required'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('costCentre') || !list_details.costCentre){
                    this.setState({
                        model:true,
                        status:false,
                        modal_title : 'Validation',
                        modal_body : 'Cost Centre is required'
                    })
                    _result = false
                }
                else{
                     _result = true
                }
            })
            return _result
        }
        else{
            return false
        }
        

        
    }

    saveMaster = async () =>{
        let {sub_master_doc} = this.state;
        let _result = true;
        if(sub_master_doc.length){
            await sub_master_doc.forEach((list_details)=>{   
                if(!list_details.hasOwnProperty('docNo') || !list_details.docNo){
                    this.setState({
                        validation:true,
                        status:false,
                        modal_body : 'Enter Document Number'
                    })

                    _result = false
                }
                else if(!list_details.hasOwnProperty('docDate') || !list_details.docDate){
                    this.setState({
                        validation:true,
                        status:false,
                        modal_body : 'Enter Date'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('docAmount') || !list_details.docAmount){
                    this.setState({
                        validation:true,
                        status:false,
                        modal_title : 'Validation',
                        modal_body : 'Enter Amount'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('docGstAmount')){
                    this.setState({
                        validation:true,
                        status:false,
                        modal_title : 'Validation',
                        modal_body : 'Enter SST Amount'
                    })
                    _result = false
                }

              
                else{
                     _result = true
                }
            })
            return _result
        }
        else{
            return false
        }
        

        
    }

    async SelecthandleChange  (name, e){
        let _table_body = this.state.table_body
        console.log('table_body_sel', _table_body, name)
        let  _details  = e.target.name;
        let  _value  = e.target.value;
        if(_details && _value){
            let _details_name =  _details.split('.')
            let _id  = _details_name[1]
            let  _qty_input = _details_name[3];
            if(_qty_input=='ID_PAY_FOR'){
                _table_body[name].ID_PAY_FOR = _value
                _table_body[name].CC_COY_ID = _value
            }

            if(_qty_input=='ID_GST_REIMB'){
                _table_body[name].ID_GST_REIMB = _value
            }

            if(_qty_input == "ID_GST_INPUT_TAX_CODE"){
                _table_body[name].ID_GST_INPUT_TAX_CODE = _value
                if(_value){
                    _value = _value.replace ( /[^\d.]/g, '');
                    if(!isNaN(_value) && _value){
                        _table_body[name].ID_GST = parseFloat(_value);
                    }
                    else{
                        _table_body[name].ID_GST = 0;
                    }
                }
                else{
                    _table_body[name].ID_GST = 0;
                }
            }

            if(_qty_input == "ID_CATEGORY"){
                _table_body[name].ID_CATEGORY = _value
            }

        }

        console.log('table_body_change', _table_body)
        this.setState({
            // show_submit_button : false,
            table_body : _table_body
        })

    }

    handle_checkbox = (_vlaue) =>{
        if(_vlaue<2){
            this.setState({
                custim_model_check_box : _vlaue,
                custim_model_taxtarea_value : '',
            })
        }
       else{
            this.setState({
                custim_model_text_value : '',
                custim_model_check_box : _vlaue
            })
       }
    }

    delete_function = (details) =>{
        if(details){
            let _details_main = (this.props.request_form && this.props.request_form.values && this.props.request_form.values.e2psearch) ? this.props.request_form.values.e2psearch  : {}
            let {table_body} = this.state
            let _temp_details = ''
            _temp_details = table_body.map((list_details, index)=>{
                if(list_details.ID_INVOICE_LINE == details.ID_INVOICE_LINE){
                    list_details.removed=0
                    return list_details
                }
                return list_details
            })
           
            if(_temp_details && _temp_details.length){
                this.setState({
                    table_body :  _temp_details
                })
            }
            
        }
    }

    UploadMultiGL = async() =>{
        let _values_main = (this.props.request_form && this.props.request_form.values ) ? {...this.props.request_form.values} : {} ;
        let _values = {};
        _values = Object.assign({},  _values_main.e2psearch)
        if(_values.DocNo && this.state.address && this.state.address.VendorName){
            let _temp_details = {
                "DocNo":_values.DocNo,
                "VendorName":this.state.address.VendorName,
                "VenCompIDX":this.state.address.VenCompIDX,
                "TotalAmtNoGST":_values.TotalAmtNoGST,
                "GSTAmt":_values.GSTAmt,
                "PaymentAmt":parseFloat(_values.TotalAmtNoGST) + parseFloat(_values.GSTAmt)
            }
            this.setState({
                loading: true
            })
            let _status =  await ApiExtractFiles(MultiGL, this.state.show_multi_gl_file, _temp_details)
            if(_status){
                this.setState({ loading:false})
                if(_status.status){
                    this.setState({
                        status:  _status.status,
                        model:true,
                        submit_type:"multigl",
                        modal_body:'Invoice uploaded successfully',
                        loading:false,
                    })
                }
                else{
                    this.setState({
                        status:  _status.status,
                        model:true,
                        modal_body: _status.message,
                        loading:false,
                    })
                }
                
            }
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: 'Choose a file to upload' ,
                loading:false,
            })
        }
    }

    UploadMultiInvoice = async() =>{
        if(this.state.show_multi_invoice_file){
            let _temp_details = {}
            _temp_details.VendorName = this.state.address.VendorName
            _temp_details.VenCompIDX = this.state.address.VenCompIDX
            _temp_details.VenAddrLine1  = this.state.address.IC_ADDR_LINE1
            _temp_details.VenAddrLine2 = this.state.address.IC_ADDR_LINE2
            _temp_details.VenAddrLine3 = this.state.address.IC_ADDR_LINE3
            _temp_details.VenAddrPostCode = this.state.address.IC_POSTCODE
            _temp_details.VenAddrState = this.state.address.IC_state
            _temp_details.VenAddrCity = this.state.address.IC_CITY
            _temp_details.VenAddrCountry = this.state.address.IC_country
            _temp_details.CurrencyCode = 'MYR'
            _temp_details.PaymentMethod = this.state.address.IC_PAYMENT_METHOD
            _temp_details.BankCode = this.state.address.IC_bank_code
            _temp_details.BankAccount = this.state.address.IC_bank_acct
            this.setState({
                loading: true
            })
            let _status =  await ApiExtractFiles(MultiInvoice, this.state.show_multi_invoice_file, _temp_details)
            if(_status){
                this.setState({ loading:false})
                if(_status.status){
                    this.setState({
                        status:  _status.status,
                        model:true,
                        modal_body:'Invoice uploaded successfully',
                        loading:false,
                    })
                }
                else{
                    this.setState({
                        status:  _status.status,
                        model:true,
                        modal_body: _status.message,
                        loading:false,
                    })
                }
                
            }
            
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: 'Choose a file to upload' ,
                loading:false,
            })
        }
    }

    ProcessDoc = (details, file_name) => {
        let _temp_details = (this.props.request_form && this.props.request_form.values && this.props.request_form.values.e2psearch) ? this.props.request_form.values.e2psearch  : {}
        let _details = Object.assign({},_temp_details);
        if(details=="gl"){
            if(_details.DocNo && _details.PaymentAmt && (this.state.address && this.state.address.VendorName) && (_details.DocDate)){
                this.props.GetMultiGLTemplate({"DocNo":_details.DocNo,"VendorName":(this.state.address && this.state.address.VendorName) ? this.state.address.VendorName : '',"DocDate": TodayDateSalash(_details.DocDate), strFile:file_name})
            }
            else{
                this.setState({
                    status: false,
                    model:true,
                    modal_body: 'Document No or Document Date  or Vendor or Payment Amount is empty ' ,
                    loading:false,
                })
            }
        }
        else if(details=="inv"){
            if((this.state.address && this.state.address.VendorName)){
                this.props.GetMultiInvoiceTemplate({"VendorName":(this.state.address && this.state.address.VendorName) ? this.state.address.VendorName : '', strFile:file_name})
            }
            else{
                this.setState({
                    status: false,
                    model:true,
                    modal_body: 'Choose Vendor to Upload Multi Invoice' ,
                    loading:false,
                })
            }
        }
    }

    ShowMultiGl = () =>{
        this.setState({
            modal_title : 'Batch Upload of multiple GL Debits',
            show_multi_gl : true     
        })
    }

    ShowMultiInvoice = () =>{
        if(this.state.address){
            this.setState({
                modal_title : 'Batch Upload of Multiple Invoice',
                show_multi_invoice : true     
            })
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: 'Please select vendor to upload multiple Invoices' ,
            })
        }
       
    }

    handle_add_master = () =>{
        this.setState({table_master_popup:true})
    }

    GetSubDoc = (details) =>{
        if(details && details.length){
            let _details  = this.state.sub_master_doc
            _details.push(...details)

            console.log('sub_master_doc', _details)
            this.setState({
                table_master_popup : false,
                sub_master_doc : _details
            })
        }
    }

    render(){
       
        let { handleSubmit } = this.props
        let { approverDetails} = this.props.approval_details
        let { sub_master_doc } = this.state
        let  _table_header = [
            // {name : "Line", id:"ITEMINDEX", key:true, width:'100px'},
            {name : "Pay For", id:"ID_PAY_FOR",type:"select",key:false, value:(this.props.pop_pay_for && this.props.pop_pay_for.data) ? this.props.pop_pay_for.data : [], width:'100px'},
            {name : "Disb./Reimb.", id:"ID_GST_REIMB", width:'130px', type:"select", value:[{value:"D", name:"Disbursement"},{value:"R", name:"Reimbursement"},{value:"N/A", name:"N/A"}]},
            {name : "Transaction Description", id:"ID_PRODUCT_DESC", width:'167px', type:"input",rem:true},
            {name : "Amount (excl.SST)", id:"ID_UNIT_COST", width:'100px', type:"number"},
            {name : "SST Amount", id:"ID_GST_VALUE", width:'100px', type:"number"},
            {name : "Input Tax Code", id:"ID_GST_INPUT_TAX_CODE", width:'100px',type:"select", value:(this.props.pop_tax_code && this.props.pop_tax_code.data) ? this.props.pop_tax_code.data : [], width:'100px'},
            {name : "Output tax code ", id:"ID_GST_RATE", key:false,width:'100px',type:"select", value:[{value:"", name:"N/A"}], width:'100px', select_status:"disable"},
            {name : "Category", id:"ID_CATEGORY", width:'100px', type:"select", value:[{value:"Life", name:"Life"},{value:"Non-Life", name:"Non-Life"},{value:"Mixed", name:"Mixed"}]},
            {name : "GL CODE", id:"GLDESCRIPTION",type:"click", key:false, width:'150px', rem:true},
           
            {name : "Fund Type (L1)", id:"FUNDTYPE", key:false, width:'100px',type:"click"},
            {name : "Product Type (L2)", id:"PRODUCTTYPE", key:false, width:'100px',type:"click"},
            {name : "Channel (L3)", id:"CHANNEL", key:false, width:'100px',type:"click"},
            {name : "Reinsurance Company (L4)", id:"REINSURANCECOMPANY", key:false, width:'100px',type:"click"},
            {name : "Asset Fund (L5)", id:"ASSETFUND", key:false, width:'100px',type:"click"},
            {name : "Project (L8)", id:"PROJECTCODEDESC", key:false, type:"click", width:'114px'},
            {name : "Person Code (L9)", id:"PERSONCODEDESC", key:false, type:"click", width:'114px'},
            {name : "Cost Centre Code (L7)", id:"costCentre", key:false, type:"click", width:'114px'},
            {name : "Withholding Tax (%)", id:"ID_WITHHOLDING_TAX", key:false, type:"click",width:'200px'},
            
        ];

        let _details = (this.props.request_form && this.props.request_form.values && this.props.request_form.values.e2psearch) ? this.props.request_form.values.e2psearch  : {}
        if(_details.DocType=="Credit Note" || _details.DocType=="Debit Note"){
            _table_header.splice(2, 0,   {name : "Invoice Number", id:"ID_REF_NO", width:'167px', type:"input", rem:true}); 
            _table_header.join()
        }
        else{
            
        }

        let  _approver_header = [
            {name : "S No", id:"FA_ACTIVE_AO", width:'85px', key:true, type:"index"},
            {name : "Performed By", id:"AO_NAME", width:'85px', key:false},
            {name : "User ID", id:"FA_AO", width:'150px'},
            {name : "Date Time", id:"FA_ACTION_DATE", width:'100px', dataFormat:"datetime"},
            {name : "Remarks", id:"FA_AO_REMARK", width:'144px',formatter: (cellContent, row) => {
                return (
                    (row.FA_AO_REMARK) ? row.FA_AO_REMARK : ' - '
                )
            }}
        ];

        let  _total_sub_grid = [
            {name : "S No", id:"FA_ACTIVE_AO", width:'85px', key:true, type:"index"},
            {name : "Performed By", id:"AO_NAME", width:'85px', key:false},
            {name : "User ID", id:"FA_AO", width:'150px'},
            {name : "Date Time", id:"FA_ACTION_DATE", width:'100px', dataFormat:"datetime"},
            {name : "Remarks", id:"FA_AO_REMARK", width:'144px',formatter: (cellContent, row) => {
                return (
                    (row.FA_AO_REMARK) ? row.FA_AO_REMARK : ' - '
                )
            }}
        ];
        
        let _sub_total  = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) =>a += (parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST)), 0) : 0;
        let _sub_gst  = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat(val.ID_GST_VALUE),  0) : 0;
        let _sst_output_tax = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat((val.ID_RECEIVED_QTY * val.ID_UNIT_COST)*(val.ID_GST/100)),  0) : 0;
        let _total  = parseFloat(_sub_gst) + parseFloat(_sub_total) + parseFloat(_sst_output_tax)

        return <Fragment>
            <PageHeading 
                heading="Create E2P Document" 
                subheading="When raising a new E2P document, click Continue button to continue entering the line items. To add more line items, click on the Add Line button. Once it is ready, click on the Submit button to submit to the approving officers." 
            />
              {this.props.upload_document && this.props.upload_document.loading ? <Loader /> : '' } 
              {this.props.file_upload_external && this.props.file_upload_external.loading ? <Loader /> : '' } 
              {this.props.file_delete && this.props.file_delete.loading ? <Loader /> : '' } 
              {this.props.ed_loading ? <Loader /> : '' } 
              {this.props.pri_popup_details && this.props.pri_popup_details.loading ? <Loader /> : '' } 
              {this.props.pri_ncpopup_details && this.props.pri_ncpopup_details.loading ? <Loader /> : '' } 
              {this.props.pri_loading  ? <Loader /> : '' } 
              {this.props.spr_loading  ? <Loader /> : '' } 
              {this.state.loading  ? <Loader /> : '' } 
              {this.props.dr_loading  ? <Loader /> : '' } 
              {this.props.gl_loading ? <Loader /> : '' } 
              {this.props.rc_loading ? <Loader /> : '' } 
              {this.props.approval_loading ? <Loader /> : '' } 
              {this.props.e2p_multi_doc_lo ? <Loader /> : '' } 
              {this.props.vl_loading ? <Loader /> : '' } 
              
              
              
              <TabHeading color={'bg-info text-white'}> Document Header</TabHeading> 
                <form>
                <div className="row mt-2">    
                    <div className='col-12'>
                        <div className="row mt-2"> 
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className="col-12" >
                                        <div className="row">    
                                            <div className="col-md-12 col-12 col-lg-4"><label>Master Document : </label></div>
                                            <div className="col">
                                                <label className="mr-2"><input type="radio" value="yes" name="master_coument" checked={(this.state.MasterDoc=="Y") ? true : false}  disabled={this.state.disable_checkbox}
                                                onClick={()=>{
                                                    this.setState({
                                                        MasterDoc : 'Y'
                                                    })
                                                }}
                                                 /> Yes </label>
                                                <label><input type="radio" value="yes" name="master_coument" checked={(this.state.MasterDoc=="N") ? true : false} disabled={this.state.disable_checkbox} 
                                                onClick={()=>{
                                                    this.setState({
                                                        MasterDoc : 'N',
                                                        sub_master_doc : []
                                                    })
                                                }}
                                                /> No </label>
                                            </div>
                                        </div>
                                    </div>
                                    <Field type="text" name="e2psearch.DocType" component={FromSelect} className="form-control" placeholder="Document Type " label="Document Type : ">
                                        <option selected value="">Select Document Type</option>
                                        <option value="Invoice">Invoice</option>
                                        <option value="Bill">Bill</option>
                                        <option value="Credit Note">Credit Note</option>
                                        <option value="Debit Note">Debit Note</option>
                                        <option value="Letter">Letter</option>
                                        
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row">
                                            <Field type="text" defaultValue={'MYR'} name="e2psearch.CurrencyCode" component={FromSelect} className="form-control" placeholder="Currency " label="Currency : " disable_input={this.state.disable_input} >
                                            <option value="AUD">Australian Dollar</option>
                                            <option value="BDT">Bangladeshi Taka</option>
                                            <option value="BND">Brunei Dollar</option>
                                            <option value="CAD">Canadian Dollar</option>
                                            <option value="CNY">Chinese Renminbi</option>
                                            <option value="DKK">Danish Kroner</option>
                                            <option value="EUR">European Euro</option>
                                            <option value="HKD">Hongkong Dollar</option>
                                            <option value="INR">Indian Rupee</option>
                                            <option value="IDR">Indonesian Rupiah</option>
                                            <option value="JPY">Japanese Yen</option>
                                            <option value="KRW">Korean Won</option>
                                            <option defaultValue value="MYR">Malaysian Ringgit</option>
                                            <option value="TWD">New Taiwan Dollar</option>
                                            <option value="NOK">Norwegian Kroner</option>
                                            <option value="NZD">NZ Dollar</option>
                                            <option value="PKR">Pakistan Rupee</option>
                                            <option value="PHP">Philippine Peso</option>
                                            <option value="SAR">Saudi Riyal</option>
                                            <option value="SGD">Singapore Dollar</option>
                                            <option value="LKR">Sri Lanka Rupee</option>
                                            <option value="GBP">Sterling Pound</option>
                                            <option value="SEK">Swedish Krona</option>
                                            <option value="CHF">Swiss Franc</option>
                                            <option value="THB">Thai Baht</option>
                                            <option value="AED">UAE Dirham</option>
                                            <option value="USD">US Dollar</option>
                                    </Field>
                                  
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" req={true} name="e2psearch.DocNo" normalize={RemoveBlankSpace} component={FromInputs} className="form-control" placeholder="Document No " label=" Document No : " rem={true} />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="e2psearch.TotalAmtNoGST" normalize={NormalizeNumbers} component={FromInputs} className="form-control" placeholder="Total Amount(excl.SST) " label="Total Amount(excl.SST)  : "  onChange={(e)=>{this.handleQtyChange(e.target.value, 'total')}}  rem={true}/>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="e2psearch.DocDate"  selected={this.state.date_details} dateformate="DD/MM/YYYY" component={FormDatePicker} maxDate = {new Date()} className="form-control" placeholder="Document Date " label="Document Date  : "   onChange={this.handleDate.bind(this)} rem={true}  />       
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="e2psearch.GSTAmt" normalize={NormalizeNumbers} component={FromInputs} className="form-control" placeholder="SST Amount " label="SST Amount : "    onChange={(e)=>{this.handleQtyChange(e.target.value, 'sst')}}/>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="e2psearch.ManualPONo" component={FromInputs} className="form-control" placeholder="Manual PO Number " label="Manual PO Number : "  />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="e2psearch.PaymentAmt" component={FromInputs} className="form-control" placeholder="Payment Amount : " rem={true} label="Payment Amount : "  readonly={true}  rem={true}/>
                                </div>
                            </div>
                            
                            <div className="col-12 col-md-6 mt-2 mb-2 ">
                                <div className="row mt-2">
                                    <div className="col-md-12"><label>Document Due Date : </label></div>
                                    <div className="col-md-12">{(this.state.doc_due_date ? this.state.doc_due_date : '')}</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <div className="col-md-12"><label>Payment Mode : </label></div>
                                    <div className="col-md-12">{(this.state.address && this.state.address.IC_PAYMENT_METHOD) ? HandlePayment(this.state.address.IC_PAYMENT_METHOD) : ''}</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mt-2">
                                <div className="row">
                                    <div className="col-md-12"><label>Credit Term : </label></div>
                                    <div className="col-md-12">{(this.state.address && this.state.address.IC_credit_terms) ?  this.state.address.IC_credit_terms+' Days' : ''}</div>
                                </div>
                                <div className="row mt-3">    
                                   
                                    <div className="col">
                                        
                                        <label className="mr-2"><input type="radio" value="yes" name="doc_main_type" onClick={(e)=>this.handleVendorType('Vendor')}  checked={this.state.doc_emp_type=="Vendor" ? true : false } /> Vendor  </label>
                                        <label><input type="radio" value="yes" name="doc_main_type" onClick={(e)=>this.handleVendorType('Employee')}    checked={this.state.doc_emp_type=="Employee" ? true : false }/> Employee </label>
                                        
                                      
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <Field type="text" name="e2psearch.VendorName" component={FromSelect} className="form-control" placeholder="Vendor " label="Vendor : " rem={true} onChange={(e) => this.handleSelectChange(e.target.value)} rem={true}>
                                        <option value=""> Select Vendor List </option>
                                        {(this.props.vendor_list &&  this.props.vendor_list.data) ? this.props.vendor_list.data.map((list_details)=>{
                                               return <option value={list_details.IC_INDEX}>{list_details.IC_COY_NAME}</option>
                                        }) :''}
                                    </Field>
                                </div>
                                <div className="row mt-2 details">
                                    <div className="col-md-12 vendor_label"><label>Vendor Address : </label></div>
                                    <Field type="text" name="e2psearch.VenAddrLine1" component={FromInputs} className="form-control" placeholder="Address 1" label="" readonly={true} />
                                    <Field type="text" name="e2psearch.VenAddrLine2" component={FromInputs} className="form-control" placeholder="Address 2" label="" readonly={true} />
                                    <Field type="text" name="e2psearch.VenAddrLine3" component={FromInputs} className="form-control" placeholder="Address 3" label="" readonly={true} />
                                    <Field type="text" name="e2psearch.VenAddrPostCode" component={FromInputs} className="form-control" placeholder="PostCode" label="" readonly={true} />
                                    <Field type="text" name="e2psearch.VenAddrCity" component={FromInputs} className="form-control" placeholder="City" label="" readonly={true} />
                                    <Field type="text" name="e2psearch.VenAddrState" component={FromInputs} className="form-control" placeholder="State" label="" readonly={true} />
                                    <Field className="form-control textboxstyle" component={FromInputs} name="e2psearch.VenAddrCountry" placeholder="Country"  label="" readonly={true} />
                                    <Field type="text" name="e2psearch.InternalRemark" component={FromInputs} className="form-control" placeholder="Internal Remarks " label="Internal Remarks : " />
                                   
                                    <Field type="text" name="e2psearch.BeneficiaryDetails" component={FromInputs} className="form-control" placeholder="Beneficiary Details " label="Beneficiary Details : " />
                                    <FromUplods name="e2psearch.internalAttachment" id ="internal_attachment" decs=" Recommended file size is 10240 KB" label="Attachment" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.internal_file_name}/> 
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">  
                                            <div className="col-12">
                                                <label className="form_label">Files Attached : </label>
                                                {(this.state.internal_attachment && this.state.internal_attachment.length) ? this.state.internal_attachment.map((val, index) => {
                                                    if (val.CDA_TYPE === 'I') {
                                                        return <p className="downloadPointer"><u><span onClick={()=>this.download_file(val)}>{(val.strFile) ? val.strFile :val.CDA_ATTACH_FILENAME} &nbsp;&nbsp;</span></u> <span className="btn btn-sm btn-danger delete-doc" onClick={() => this.deleteFile(val, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                                    }
                                                }) : 'No files attached'}
                                            </div>
                                            <div className="col-12">
                                                <p style={{color: 'green'}}><span className="text-danger">*</span> indicates required field</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2 disbaled_date">
                                   <Field type="text" name="e2psearch.PRCSSentDate" selected={this.state.date_details} dateformate="DD/MM/YYYY" component={FormDatePicker} minDate = {new Date()} className="form-control" placeholder="PSD Sent Date " label="PSD Sent Date : "   onChange={this.handleDate.bind(this)} readonly={true}  rem={true}/>       
                                </div>
                                <div className="row mt-2 disbaled_date">
                                   <Field type="text" name="e2psearch.PRCSReceivedDate" selected={this.state.date_details} dateformate="DD/MM/YYYY" component={FormDatePicker} minDate = {new Date()} className="form-control" placeholder="PSD Received Date " label="PSD Received Date : "   onChange={this.handleDate.bind(this)} readonly={true}  rem={true}/>       
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-12"><label>Bank Code[Bank A/C No.] :</label></div>
                                    <div className="col-md-12">{(this.state.address && this.state.address.IC_bank_acct) ?  this.state.address.IC_bank_code+'['+ this.state.address.IC_bank_acct+']' : ''}</div>
                                </div>
                            </div>
                           
                           
                            
                        </div>
                    </div>
                    </div>   

                    
                    {(sub_master_doc && sub_master_doc.length) ? 
                    <Fragment>
                    <TabHeading color={'bg-info text-white margin-botton-none'}> Sub-Document </TabHeading> 
                    <table className="table table-striped head-info">
                            <thead>
                                <tr>
                                    <th style={{'width':'40px'}}>S/No</th>
                                    <th>Document No <span className="text-danger">*</span></th>
                                    <th>Document Date </th>
                                    <th>Amount </th>
                                    <th>SST Amount </th>
                                    <th> </th>
                                </tr>                            
                            </thead>  
                            <tbody>
                                {this.build_details()}
                            </tbody>
                    </table>
                    <TotalGrid
                        table_header = {_total_sub_grid}
                        body_text={['Total']}
                        body_value={[(this.state.sub_master_doc) ? this.state.sub_master_doc.reduce((a, val) => a += parseFloat(val.docAmount), 0).toFixed(2): '0.00']}
                        body_type={['text']}
                        text_grid={3}
                        total={5}
                        total_td={3}
                        body_loop={4}
                        adjust={11}
                    />
                    </Fragment>
                    : ''}

                    {(approverDetails && approverDetails.length && approverDetails.length>1) ? 
                    <Fragment>
                    <TabHeading color={'bg-info text-white margin-botton-none'}> Approval Flow </TabHeading> 
                    <div className="row">
                        <div className="col-md-12">
                            <BootstrapCustomTableStatic 
                                table_header={_approver_header} 
                                table_body={(approverDetails) ? approverDetails : []} 
                                mode={'radio'}
                                select={false} 
                            />
                        
                        </div>
                    </div>
                    </Fragment> : ''}
                    
                    <div className="row mt-2">    
                    <div className='col-12'>   
                      
                        {(this.state.table_body && this.state.table_body.length) ? 
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={this.state.table_body} 
                            products={this.getProducts} 
                            select={false} 
                            serial={true}
                            selected_items={this.state.slected_items}
                            serial_text={'Line'}
                            selectname={'itemcode'} 
                            delete_function = {this.delete_function}
                            responsive={true} 
                            delete={true}
                            headerclick={this.handleheaderlinks}
                            extratotal={true}
                            colcount={_table_header.length+1}
                            subtotal={_sub_total}
                            sstamount={_sub_gst}
                            sstamount_out={_sst_output_tax}
                            grandtotal={_total}
                            table_id="line"
                            segmentation = {(this.props.segmentation) ? this.props.segmentation : []}
                            changefunction = {this.handleChange}
                            inputPrefix = 'itemList'
                            handle_popup= {this.handlePopup}
                            handle_date={this.handleDateTable.bind(this)}
                            dates={this.state.dates}
                            select_function_inex = {this.select_function_inex}
                            handledate = {this.handledate.bind(this)}
                            select_change = {this.SelecthandleChange}
                            handledateHeader = {this.handledateHeader.bind(this)}
                            main_date = ''
                            change={this.props.change}
                         
                        />

                    : ''}
                    </div>
                </div>
                    <div className="col-12 mt-3 text-center">
                    
                       
                        {(!localStorage.getItem('e2p_req_details') && this.state.table_body.length ==0)  ? <button className="btn btn-sm btn-outline-success ml-2" type="button" onClick={handleSubmit(values => this.handlefiltersubmit({  ...values, submit_type: 'continue'}))} >Continue</button> : ''}
                        {(localStorage.getItem('e2p_req_details') || this.state.table_body.length >= 1 )  ? <button className="btn btn-sm btn-outline-primary ml-2" type="button" onClick={handleSubmit(values => this.handlefiltersubmit({  ...values, submit_type: 'save'}))} type="button">Save</button> : ''}
                        {((localStorage.getItem('e2p_req_details')  && this.state.show_submit_button) || (this.state.table_body.length >= 1 && this.state.show_submit_button) )  ? <button className="btn btn-sm btn-outline-success ml-2" type="button" onClick={handleSubmit(values => this.handlefiltersubmit({  ...values, submit_type: 'submit'}))}>Submit</button> : ''}
                        {(localStorage.getItem('e2p_req_details')) ? <button type="button" className="btn btn-sm btn-outline-info ml-2" onClick={this.ShowAddline} >Add Line</button> : ''}
                        <button className="btn btn-sm btn-outline-secondary ml-2" type="button"  onClick={()=>this.ShowMultiGl()}>Continue With Multi GL</button>
                        <button className="btn btn-sm btn-outline-warning ml-2" type="button"  onClick={()=>this.ShowMultiInvoice()}>Multi Invoices</button>
                        {(this.state.list_details && this.state.list_details.from_listing) ? <button className="btn btn-sm btn-outline-danger ml-2"  onClick={()=>this.void_pr()} type="button" >Void</button> : '' }
                        {(this.state.MasterDoc=='Y')? <button className="btn btn-sm btn-outline-info ml-2" type="button" onClick={() =>this.handle_add_master()} >Add Sub</button> : ''}
                    </div>                    
                </form>
                <Modal size="lg" open={this.state.table_master_popup} header ={true} title ={'Master Document'} closemodel={this.closemodel} footer={false}>
                        <Fragment>
                            <Master  GetSubDoc={this.GetSubDoc}/>    
                        </Fragment>
                </Modal>
                <Modal size="lg" open={this.state.table_modal_popup} header ={true} title ={this.state.modal_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.emptySelectedProduct }>Save</button> : ''}
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                    <h5>{this.state.modal_body}</h5>
                    {(this.state.table_display) ?  
                    <Fragment>
                        <form onSubmit={handleSubmit(this.handleformsubmit.bind(this))}>
                            <div className="mt-2">
                                <BootstrapTable
                                    table_header={this.state.table_model_header} 
                                    table_body={this.state.table_model_body} 
                                    select={true} 
                                    mode={'radio'}
                                    radioname={'code'} 
                                    responsive={false} 
                                    products = {this.getSelectedProduct}
                                    selected_checkbox={this.state.selected}
                                    inputPrefix = 'raisePOForm'
                                />
                            </div>
                        </form>
                    </Fragment>
                    :''}
                </Modal>
                <Modal size="xl" open={this.state.show_add_line} header ={true} title ={"Add E2P Document Line"} sub_title={''} closemodel={this.HideAddline}>
                        
                    <Fragment>
                        <p>You can save e2p as draft copy by pressing the Save button or Cancel button to cancel the changes</p>
                        <form onSubmit={handleSubmit(this.handleformsubmit.bind(this))}>
                            <div className="mt-2">

                                <DocumentPop {...this.props} updateData={this.updateData} HideAddline = {this.HideAddline}    doc_type = {_details.DocType}/>
                            </div>
                        </form>
                    </Fragment>
                  
                </Modal>
                <Modal size="lg" open={this.state.show_multi_gl} header ={true} title ={this.state.modal_title} closemodel={this.CloseShowMultiGl}>
                    <TabHeading color={'bg-info text-white'}> Document Info</TabHeading> 
                    <div className="row">
                            <div className="col-md-12 col-12 col-lg-2"><label>Document No : </label></div>
                            <div className="col"><p>{(this.props.request_form && this.props.request_form.values && this.props.request_form.values.e2psearch) ? this.props.request_form.values.e2psearch.DocNo : ''}</p></div>
                            <div className="col-md-12 col-12 col-lg-3"><label>Document Date : </label></div>
                            <div className="col"><p>{(this.state.date_details ) ? FromateDate(this.state.date_details) : ''}</p></div>
                    </div>
                    <div className="row mt-2">
                            <div className="col-md-12 col-12 col-lg-2"><label>Vendor Name : </label></div>
                            <div className="col"><p>{(this.state.address && this.state.address.VendorName) ? this.state.address.VendorName : ''}</p></div>
                    </div>
                    <TabHeading color={'bg-info text-white'}> Multi GL Upload</TabHeading> 
                    <div className="row">
                        <FromUplods name="multi_gl_file_upload" id="multi_gl_file_upload" decs=" Recommended file size is 10240 KB" label="File Location : " buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.internal_file_name} upload_button={false}/> 
                    </div>
                    <div className="row mt-2">
                        <div className="col-12 download_link_span" onClick={()=>this.ProcessDoc('gl', 'MultiGLDebits.xls')}>Download Multi GL Upload Template : <span>MultiGLDebits.xls[93KB]</span></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-12">
                            <button className="btn btn-sm btn-outline-primary" type="button"  onClick={()=>this.UploadMultiGL()}>Upload</button>
                        </div>
                    </div>
                </Modal>
                <Modal size="lg" open={this.state.show_multi_invoice} header ={true} title ={this.state.modal_title} closemodel={this.CloseMultiInvoice}>
                    <TabHeading color={'bg-info text-white'}> Multi Invoice Upload</TabHeading> 
                    <div className="row">
                        <FromUplods name="multi_invoice_file_upload" id="multi_invoice_file_upload" decs=" Recommended file size is 10240 KB" label="File Location : " buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.internal_file_name} upload_button={false}/> 
                    </div>
                    <div className="row mt-2">
                        <div className="col-12 download_link_span" onClick={()=>this.ProcessDoc('inv','MultiInvoice.xls')}>  Download Multi Invoice Upload Template : <span>MultiInvoice.xls[720KB]</span></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-12">
                            <button className="btn btn-sm btn-outline-primary" type="button"  onClick={()=>this.UploadMultiInvoice()}>Upload</button>
                        </div>
                    </div>
                </Modal>
                <Modal open={this.state.modal_popup} header ={true} title ={this.state.modal_popup_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.emptyPopupSelectedProduct }>Save</button> : ''}
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                    {(this.state.modal_popup_body) ?  
                    <Fragment>
                        <form onSubmit={handleSubmit(this.handlepopformsubmit.bind(this))}>
                            <div className="mt-2">
                                <BootstrapTable
                                    table_header={this.state.modal_popup_header} 
                                    table_body={this.state.modal_popup_body} 
                                    select={true} 
                                    mode={'radio'}
                                    radioname={'code'} 
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
              <Modal className="modal-table-display" size="lg" open={this.state.custom_modal_popup} header ={true} title ={"Withholding Tax"} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  
                    <Fragment>
                        <button type='button' className='btn btn-outline-warning btn-sm' onClick={ this.ClearWithhold  }>Clear</button>
                        <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.updateWithholdData }>Save</button> 
                    </Fragment>: ''}
                    <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                       <table className="table table-striped">
                           <tbody>
                                <tr>
                                    <td style={{"width": "150px"}}>Withholding Tax : </td>
                                    <td style={{"width": "120px"}} ><input onChange={(e)=>{this.setState({ custim_model_text_value : e.target.value })}} value={this.state.custim_model_text_value} type="text" className="form-control" disabled={(this.state.custim_model_check_box=='2' || this.state.custim_model_check_box=='') ? 'disabled' : ''} /></td>
                                    <td style={{"width": "50px"}} >%</td>
                                    <td >
                                     
                                        <input type="radio" onClick={(e)=>this.handle_checkbox(e.target.value)} value="0" name="tax_type" checked={(this.state.custim_model_check_box==0 && this.state.custim_model_check_box!='') ? true : false} /> WHT applicable and payable by Company
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="radio"  onClick={(e)=>this.handle_checkbox(e.target.value)} value="1" name="tax_type" checked={(this.state.custim_model_check_box==1) ? true : false}  /> WHT applicable and payable by Vendor
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="radio"  onClick={(e)=>this.handle_checkbox(e.target.value)} value="2" name="tax_type"  checked={(this.state.custim_model_check_box==2) ? true : false} /> Not Applicable
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        If Not Please Key in the late Reason
                                        <textarea onChange={(e)=>{this.setState({
                                            custim_model_taxtarea_value : e.target.value
                                         })}} className="form-control" disabled={(this.state.custim_model_check_box=='' || this.state.custim_model_check_box==0 || this.state.custim_model_check_box==1) ? 'disabled' : ''} value={this.state.custim_model_taxtarea_value}> </textarea>
                                    </td>
                                </tr>
                           </tbody>
                       </table>
                    
              </Modal>
              
               <Alert 
                    title={this.state.modal_title} 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closeModel}
                />

                <ConfirmationModel
                    title="" 
                    confimation = {true}
                    message={this.state.modal_body} 
                    status={this.state.confimation} 
                    show={this.state.confimation_pop} 
                    onConfirm={this.onConfirm}
                    onCancel = {this.onCancel}
                />
               
     </Fragment>
    }
}

Request = reduxForm({
    form:'request_details',
    enableReinitialize : true,
    destroyOnUnmount : true,
    validate : E2PREquest,
    onSubmitFail: errors => scrollToInvalid(errors),
    
})(Document)

export default Request;
