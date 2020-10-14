import React,{Component, Fragment} from 'react';
import {FromCheckBoxFull,FromCheckBox, FromInputs, FromUplods, FromSelect, FormPlainInput, FormDatePicker} from '../../../Component/From/FromInputs'
import {connect} from 'react-redux';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {Field, reduxForm , change} from 'redux-form';
import BootstrapCustomTable from '../../../Component/Table'
import Common from '../../../Common'
import {TodayDateSalash, addDate} from '../../../Component/Dates'
import Modal from '../../../Component/Modal'
import Alert from '../../../Component/Modal/alert'
import Loader from '../../../Component/Loader'
import {CalcDate} from  '../../../Component/Dates'
import {UserDetails } from '../../../Common/LocalStorage'
import {ApiExtract} from '../../../Common/GetDatas'
import BootstrapTable from '../../../Component/Table/BootstrapCustomTablePr'
import {GetPrSave, GetSavePo, GetPrDto, GetPrDtoSave} from '../../../Actions/Common'
import {SavePurchaseRequest, VoidPR} from '../../../Apis/RequesterServices'
import {RfqPOSubmit, FFPoAddress} from '../../../Apis/Approver'
import {UploadDocuments,FundTypeOrPersonCodeORProjectCodeAction, FillAddressAction, DeliveryAddressAction, CostCentreCodeAction, SegmentationAction,GetSearchPRList, 
    GetSearchPRCancelList, GetPurchaseRequestItemsDetails, GetFillAddress, GetDeleteFile, GetPurchaseRequestItemsDetailsPopUp, GetFFRaisePOScreen, GetApppoDetails} from '../../../Actions/Requester'
import {GetViewSinglePr} from '../../../Actions/Approver'
import { GetDownloadFile} from '../../../Actions/Vendor'

let serial = 0;

class Request extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.closemodel = this.closemodel.bind(this);
        this.handleformsubmit = this.handleformsubmit.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updateData = this.updateData.bind(this)
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
       
        
        this.handlepopformsubmit = this.handlepopformsubmit.bind(this)
        this.state = {
            table_body :  [],
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
            rerenderd:false,
            redate:false,
            Urgent:0,
            vendor_details:{},
            customFieldMstr : {},
            strPONo : '',
            po_number : '',
            PRItemDetails : [],
            QuotationShipment :{},
            RFQ_Mstr:{},
            POData : GetSavePo(),
            prIndex :'',
            strDeliveryDefault : '',
            strBillDefault : '',
            rfqVendorDetails : [],
            rfqItemDetails : [],
            final_message:'',
            BillAddrCode: '',
            submit_type: '',
            save_item_details : {},
            vendorID : '',
            vendorName : '',
            show_save_button : false
        }

    }

    handlepopformsubmit = () =>{
         
    }

    convert_datas = () =>{

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

    receiveproducts = (product) =>{
        let _get_selected_items = product
        if(_get_selected_items){
            this.props.get_details_popup({
                productList: _get_selected_items,
                viewState: "new",
                strType: "cc"
            });
        }
       
        this.setState({
            popup:false,
            // table_body:table_body,
        })
    }

    static async getDerivedStateFromProps(nextProps, prevState){
        let _details_main = prevState
       
        if((!prevState.rendered) && nextProps.location && nextProps.location.datas ){
            _details_main.strDeliveryDefault = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.strDeliveryDefault : {};
            _details_main.strBillDefault = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.strBillDefault : {};
            _details_main.BillAddrCode = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.strBillDefault : {};
            _details_main.RFQ_Mstr = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.RFQ_Mstr : {};
            _details_main.rfqItemDetails = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.rfqItemDetails : [];
            _details_main.rfqVendorDetails = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.rfqVendorDetails : [];
            _details_main.QuotationShipment = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.QuotationShipment : [];
            _details_main.PRItemDetails = (nextProps.location && nextProps.location.datas && nextProps.location.datas.dsItem ) ? nextProps.location.datas.dsItem.PRItemDetails : [];
            _details_main.strPONo = (nextProps.location && nextProps.location.datas && nextProps.location.datas.dsItem ) ? nextProps.location.datas.dsItem.strPONo : 0;
            _details_main.customFieldMstr =(nextProps.location && nextProps.location.datas && nextProps.location.datas.dsItem ) ? nextProps.location.datas.dsItem.customFieldMstr : 0;
            _details_main.prIndex = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.prIndex : '';
            _details_main.rendered = true;
            _details_main.redate =  true;
            _details_main.po_number = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.po_number : '';
            _details_main.Urgent =  (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.strUrgent : '';
            _details_main.table_body = (nextProps.location && nextProps.location.datas) ? nextProps.location.datas.rfqItemDetails : [];
            _details_main.slected_items = []
            _details_main.table_body = await _details_main.table_body.forEach(async (list_details, index)=>{
                _details_main.table_body[index] =  Object.assign({}, list_details, _details_main.PRItemDetails[index])
                _details_main.table_body[index].GIFT = 'N';
                _details_main.table_body[index].GLDESCRIPTION ='';
                _details_main.table_body[index].costCentre =''
                _details_main.table_body[index].DeliveryAddr =(nextProps.location && nextProps.location.datas) ? nextProps.location.datas.strDeliveryDefault : '';
                _details_main.table_body[index].segmentation = 'Standard Material'
                _details_main.table_body[index].deliveryUIDate = addDate(new Date(), _details_main.table_body[index].ETD)
                _details_main.table_body[index].PRODUCT_TYPE = ''
                _details_main.table_body[index].POD_ORDERED_QTY = ( _details_main.table_body[index].POD_ORDERED_QTY) ? _details_main.table_body[index].POD_ORDERED_QTY :  _details_main.table_body[index].QUANTITY
                await nextProps.location.datas.rfqItemDetails.forEach((list_details)=>{
                    if(nextProps.delivery_address.length){
                       let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_CODE==="DA004"})
  
                        if(_default_address.length){
                            _details_main.table_body[index].deliveryAddress = _default_address[0].Address
                            _details_main.table_body[index].DeliveryAddr = _default_address[0].AM_ADDR_CODE
                            _details_main.table_body[index].AM_ADDR_CODE = _default_address[0].AM_ADDR_CODE
                            
                            
                        }
                        else{
                            _details_main.table_body[index].deliveryAddress  = ''
                        }
                    }
                   
                })
            })            
            return _details_main
        }

       
        if((!prevState.rendered) && prevState.save_item_details && nextProps.get_fill_address_po && nextProps.get_fill_address_po.dsBilling && nextProps.get_fill_address_po.dsBilling.length && (!prevState.save_item_details.productList) &&  nextProps.po_details.allInfo && prevState.table_body.length != nextProps.po_details.allInfo){
            _details_main.rendered = true;
            _details_main.rerenderd =  false;
            _details_main.redate =  false;
            _details_main.show_save_button = true;
            _details_main.lblPONo = prevState.lblPONo;
            _details_main.slected_items = []
            _details_main.table_body = (nextProps.po_details.allInfo && nextProps.po_details.allInfo.POD_DETAILS) ? nextProps.po_details.allInfo.POD_DETAILS: []
            _details_main.table_body = await _details_main.table_body.forEach(async (list_details, index)=>{
                _details_main.table_body[index] =  Object.assign({}, list_details, _details_main.PRItemDetails[index])
                _details_main.table_body[index].GIFT = 'N';
                _details_main.table_body[index].GLDESCRIPTION ='';
                _details_main.table_body[index].costCentre =''
                _details_main.table_body[index].DeliveryAddr =(nextProps.location && nextProps.location.datas) ? nextProps.location.datas.strDeliveryDefault : '';
                _details_main.table_body[index].segmentation = 'Standard Material'
                _details_main.table_body[index].deliveryUIDate = addDate(new Date(), _details_main.table_body[index].ETD)
                _details_main.table_body[index].PRODUCT_TYPE = ''
                _details_main.table_body[index].POD_ORDERED_QTY = ( _details_main.table_body[index].POD_ORDERED_QTY) ? _details_main.table_body[index].POD_ORDERED_QTY :  _details_main.table_body[index].QUANTITY
                await _details_main.table_body.forEach((list_details)=>{
                    if(nextProps.get_fill_address_po.dsBilling.length  && (!_details_main.table_body[index].DeliveryAddr)){
                       let _default_address = nextProps.get_fill_address_po.dsBilling.filter((list)=>{return list.AM_ADDR_CODE=='DA004'})
                        if(_default_address.length){
                            _details_main.table_body[index].deliveryAddress = _default_address[0].Address
                            _details_main.table_body[index].DeliveryAddr = _default_address[0].AM_ADDR_CODE
                            _details_main.table_body[index].AM_ADDR_CODE = _default_address[0].AM_ADDR_CODE
                        }
                        else{
                            _details_main.table_body[index].deliveryAddress  = ''
                        }
                    }

                    // if(nextProps.cost_centre_code && nextProps.cost_centre_code.length>0) {
                       
                    //     let _cc_details = nextProps.cost_centre_code.filter((list_details)=> list_details.AM_ACCT_CODE == list_details.costCentre)
                    //     if(_cc_details && _cc_details.length > 0) {
                    //         _details_main.table_body[index].ACCT = _cc_details[0].AM_ACCT_INDEX;
                    //         _details_main.table_body[index].costCentre = _cc_details[0].CDM_DEPT_CODE+'-'+_cc_details[0].AM_ACCT_DESC+':'+_cc_details[0].AM_ACCT_CODE;
                    //     }
                    // }
                   
                })
            })            
            _details_main.internal_attachment = (nextProps.po_details.allInfo && nextProps.po_details.allInfo.POD_DETAILS) ? nextProps.po_details.allInfo.COMPANY_DOC_ATTACHMENT : []
            _details_main.extrnal_attachment = (nextProps.po_details.allInfo && nextProps.po_details.allInfo.POD_DETAILS) ? nextProps.po_details.allInfo.COMPANY_DOC_ATTACHMENT : []
            return _details_main
        }
      
       

        if(prevState.internal_delete &&  (!prevState.external_delete) &&  nextProps.file_delete && nextProps.file_delete.responseList && nextProps.file_delete.responseList.displayAttachFile && nextProps.file_delete.responseList.displayAttachFile){
            _details_main.internal_attachment =   nextProps.file_delete.responseList.displayAttachFile;
           return _details_main
        }

        if(prevState.internal_upload &&  (!prevState.external_upload) && nextProps.upload_document && nextProps.upload_document.responseList && nextProps.upload_document.responseList.displayAttachFile && nextProps.upload_document.responseList.displayAttachFile){
            _details_main.internal_attachment =  nextProps.upload_document.responseList.displayAttachFile;
           return _details_main
        }

        if(prevState.external_delete &&  (!prevState.internal_delete) && nextProps.external_delete && nextProps.external_delete.displayAttachFile){
            _details_main.extrnal_attachment =  nextProps.external_delete.displayAttachFile;
           return _details_main
        }

        if(prevState.external_upload &&  (!prevState.internal_upload)  && nextProps.file_upload_external && nextProps.file_upload_external.responseList && nextProps.file_upload_external.responseList.displayAttachFile && nextProps.file_upload_external.responseList.displayAttachFile){
            _details_main.extrnal_attachment = nextProps.file_upload_external.responseList.displayAttachFile;
           return _details_main
        }
      
        return nextProps, prevState;
    }

    componentDidMount(){
       
        
        if(localStorage.getItem('po_from')){
            let _details = JSON.parse(localStorage.getItem('po_from'))
            this.setState({
                save_item_details : _details,
            })
            this.props.GetApppoDetails({PO_NO : _details.POM_PO_NO, index : _details.POM_PO_INDEX});
        }
        this.props.initialize({raisePOForm:{requestName:UserDetails().UM_USER_NAME,prNo:this.state.strPrNO }});
        this.props.FundTypeOrPersonCode({ type: "L1" })
        this.props.FundTypeOrPersonCode({ type: "L8" })
        this.props.FundTypeOrPersonCode({ type: "L9" })
        this.props.FillAddress()
        // this.props.DeliveryAddress()
        this.props.CostCentreCode()
        this.props.SegmentationAction()
        this.props.get_fill_address()
        this.props.GetFFRaisePOScreen()
        this.props.change('raisePOForm.PrintCustom',true)
        this.props.change('raisePOForm.PrintRemark',true)
        this.props.change('raisePOForm.date',new Date())
    }

    closeModel (details){
        this.setState({
            addmodel : false,
            validation:false
        })
        
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


    componentDidUpdate(){
      
        if(this.state.rerenderd && this.props.cost_centre_code && this.props.cost_centre_code.length){
            let _pr_numner = '';
            let _table_body = [];
            // if(this.props.purchased_items && this.props.purchased_items.rfqItemDetails){

                  let _temp_array = {};
                  let  let_details = this.state.rfqVendorDetails
                  if(let_details && let_details.billingAddress){
                   
                    let _state_data = this.state.POData
                    let _billing_address = let_details.billingAddress
                    if(_billing_address){
                        _state_data.BillAddrLine1 = _billing_address.AM_ADDR_LINE1;
                        _state_data.BillAddrLine2 = _billing_address.AM_ADDR_LINE2;
                        _state_data.BillAddrLine3 = _billing_address.AM_ADDR_LINE3;
                        _state_data.BillAddrPostCode = _billing_address.AM_POSTCODE;
                        _state_data.BillAddrCity = _billing_address.AM_CITY;
                        _state_data.BillAddrState = _billing_address.AM_STATE;
                        _state_data.BillAddrCountry = _billing_address.COUNTRY;
                        _state_data.InternalRemark =  _billing_address.POM_INTERNAL_REMARK;
                        _state_data.ExternalRemark =  _billing_address.POM_External_Remark;
                        
                        _state_data.CurrencyCode = (let_details.CM_CURRENCY_CODE) ? let_details.CM_CURRENCY_CODE : 'MYR';
                        _state_data.PaymentMethod = (let_details.pay_term_name) ? let_details.pay_term_name : "Cheque" ;
                        _state_data.PaymentType = (let_details.PaymentType) ? let_details.PaymentType : "30 Days" ;
                        _state_data.ShipmentMode = (let_details.ship_mode_name) ? let_details.ship_mode_name : "Not Applicable";
                        _state_data.ShipmentTerm = (let_details.ShipmentTerm) ? let_details.ship_mode_name : "Not Applicable";
                        _state_data.date = new Date();
                        _state_data.Vendor = let_details.CM_COY_NAME
                    }
                   
                    _temp_array.raisePOForm = _state_data
                    this.props.initialize(_temp_array)
                    this.setState({
                            rerenderd:true,
                            Urgent:1,
                            strPrNO : '',
                            POData : _state_data
                     })
                  }


                  else if(this.props.po_details && this.props.po_details.allInfo){
                    let _main_details = (this.props.po_details.allInfo) ? this.props.po_details.allInfo.POM_DETAILS : [];
                    let _custom_fields  = (this.props.po_details.allInfo) ? this.props.po_details.allInfo.POM_DETAILS : [];
                    let _item_list= this.state.table_body
                    let _item_details =  (this.props.po_details.allInfo) ? this.props.po_details.allInfo.POD_DETAILS : [];
                    let _details = (_main_details && _main_details[0]) ? _main_details[0] : {};
                    let _temp_array = new Array();
                    let _user_details = {
                        prNo : _details.POM_PO_NO,
                        Vendor : _details.POM_PO_NO,
                        CurrencyCode : _details.POM_CURRENCY_CODE,
                        PaymentType:  (_details.POM_PAYMENT_TERM) ? _details.POM_PAYMENT_TERM : '30 Days',
                        PaymentMethod  : (_details.POM_PAYMENT_METHOD && _details.POM_PAYMENT_METHOD != 'undefined') ? _details.POM_PAYMENT_METHOD : 'Cheque',
                        ShipmentTerm : _details.POM_SHIPMENT_TERM,
                        ShipmentMode : _details.POM_SHIPMENT_MODE,
                        Shipvia : _details.POM_SHIP_VIA,
                        Attn : _details.POM_S_ATTN,
                        BillTo : _details.POM_B_ADDR_CODE,
                        BillAddrLine1 : _details.POM_B_ADDR_LINE1,
                        BillAddrLine2 : _details.POM_B_ADDR_LINE2,
                        BillAddrLine3 : _details.POM_B_ADDR_LINE3,
                        BillAddrPostCode : _details.POM_B_POSTCODE,
                        BillAddrCity : _details.POM_B_CITY,
                        BillAddrState : _details.STATE,
                        BillAddrCountry : _details.CT,
                        InternalRemark  :_details.POM_INTERNAL_REMARK,
                        ExternalRemark : _details.POM_External_Remark,
                        
                        Date : TodayDateSalash(_details.POM_CREATED_DATE),
                        date: TodayDateSalash(_details.POM_CREATED_DATE),
                        Urgent : (_details.PRM_URGENT=="1") ? true : false,
                        PrintCustom : 1,
                        PrintRemark : 1,
                        Vendor : _details.POM_S_COY_NAME
                    }
  

                    _pr_numner = _user_details.prNo;
                    _item_details.forEach((item_details, index)=>{
                      let delivery = [item_details.PRODUCTCODE];
                      let _build_array = new Object()
                      _build_array = {
                          [delivery] : { 
                              "GIFT":item_details.POD_GIFT,
                              "GST":item_details.GST,
                              "UNITCOST":item_details.UNITCOST,
                            //   "delivery" :addDate(new Date(), item_details.POD_ETD)
                              "QUANTITY": item_details.QUANTITY,
                              'WarrantyTerms' : item_details.POD_WARRANTY_TERMS,
                              'Segmentation' :  item_details.PCM_FIELD_NAME,
                              'ETD' : item_details.POD_ETD,
                              'Remarks' : item_details.POD_REMARK
                          }
                      }
  
                     
                      _temp_array.push(_build_array)
                    })
                    let _main_object = {
                        raisePOForm : Object.assign({}, _details, _user_details),
                        itemList : _temp_array
                    }
  
                   
          
  
                    _item_list.forEach((list,index)=>{
                          console.log('inital_list_item', list)
                          let cost_center_code = (this.props.cost_centre_code && this.props.cost_centre_code.length>0) ? this.props.cost_centre_code.filter((list_details)=> list_details.AM_ACCT_CODE == list.costCentre) : []
                          let temp_data = {}
                          let _item_details = {}
                          temp_data.deliveryAddress= list.POD_D_ADDR_LINE1+''+list.POD_D_ADDR_LINE2+''+list.POD_D_ADDR_LINE3
                          temp_data.costCentre= list.costCentre+'-'+list.AM_ACCT_DESC
                          temp_data.ACCT = list.prdAcctIndex;
                          temp_data.COUNTRY = list.POD_D_COUNTRY
                          temp_data.AM_ADDR_CODE =  list.POD_D_ADDR_CODE
                          temp_data.AM_ADDR_LINE1 =  list.PRD_D_ADDR_LINE1
                          temp_data.AM_ADDR_LINE2 =  list.PRD_D_ADDR_LINE2
                          temp_data.AM_ADDR_LINE3 =  list.PRD_D_ADDR_LINE3
                          temp_data.AM_CITY =  list.PRD_D_CITY
                          temp_data.AM_STATE =  list.PRD_D_STATE
                          temp_data.AM_COUNTRY =  list.PRD_D_COUNTRY
                          temp_data.AM_POSTCODE =  list.PRD_D_POSTCODE
                          temp_data.Remarks =  list.REMARK;
                          temp_data.REMARK =  list.REMARK;
                          temp_data.WarrantyTerms = list.WARRANTYTERMS;
                          temp_data.WARRANTYTERMS = list.WARRANTYTERMS;
                          temp_data.GIFT =  list.GIFT;
                          temp_data.deliveryUIDate =  addDate(new Date(), list.POD_ETD);
                          temp_data.POD_ORDERED_QTY =  (list.POD_ORDERED_QTY) ? list.POD_ORDERED_QTY : list.QUANTITY; 
                          temp_data.Segmentation =  list.PCD_FIELD_VALUE;
                          temp_data.segmentation =  list.PCD_FIELD_VALUE;
                          
                          _item_details = Object.assign({} , temp_data,list);
                          if(cost_center_code && cost_center_code.length > 0){
                                _item_details.ACCT = cost_center_code[0].AM_ACCT_INDEX;
                                _item_details.costCentre = cost_center_code[0].CDM_DEPT_CODE+'-'+cost_center_code[0].AM_ACCT_DESC+':'+cost_center_code[0].AM_ACCT_CODE;
                          }
                         _table_body.push(_item_details)

                    })
                    this.props.initialize(_main_object)
                    this.setState({
                      rerenderd:true,
                      Urgent:(_details && _details.PRM_URGENT=="1") ? true : false,
                      strPrNO  : _pr_numner,
                      BillAddrCode  :  _details.POM_B_ADDR_CODE,
                      lblPONo  : _pr_numner,
                      pr_value : _pr_numner,
                      table_body : _table_body,
                      vendorID: _details.POM_S_COY_ID,
                      vendorName: _details.POM_S_COY_NAME,
                      RFQ_Mstr : {RFQ_Num : _pr_numner},
                      BillAddrCode : _user_details.BillTo,
                      customFieldMstr : _custom_fields,
                      address : {BillAddrCode : _user_details.BillTo},
                      POData : _user_details
                  })
              } 
               
        }



        if(this.state.redate){
           if(this.state.table_body && this.state.table_body.length){
                this.state.table_body.forEach((item_details, index)=>{
                    let _delivery = 'itemList.'+index+'.'+[item_details.PRODUCTCODE]+'.delivery';
                    this.props.change(_delivery, new Date())
                })
            }
            this.setState({
             redate:false
           })
        }

        this.props.change('raisePOForm.PrintCustom',true)
        this.props.change('raisePOForm.PrintRemark',true)

    }

    handleSelectChange = async (value) =>{
        this.setState({loading:true})
        let _final_datas = {strCode: value}
        let _status =  await ApiExtract(FFPoAddress, _final_datas)
        if(_status){
          if(_status.response && _status.response.address && _status.response.address.length > 0){
            let _temp_adress = _status.response.address[0]
            _temp_adress.BillAddrCode = value
            _temp_adress.BillAddrLine1 = _temp_adress.AM_ADDR_LINE1
            _temp_adress.BillAddrLine2 = _temp_adress.AM_ADDR_LINE2
            _temp_adress.BillAddrLine3 = _temp_adress.AM_ADDR_LINE3
            _temp_adress.BillAddrCity = _temp_adress.AM_CITY
            _temp_adress.BillAddrState = _temp_adress.AM_STATE
            _temp_adress.BillAddrCountry = _temp_adress.AM_COUNTRY
            _temp_adress.BillAddrPostCode = _temp_adress.AM_POSTCODE

            this.props.change('raisePOForm.BillAddrLine1', _temp_adress.AM_ADDR_LINE1)
            this.props.change('raisePOForm.BillAddrLine2', _temp_adress.AM_ADDR_LINE2)
            this.props.change('raisePOForm.BillAddrLine3', _temp_adress.AM_ADDR_LINE3)
            this.props.change('raisePOForm.BillAddrCity', _temp_adress.AM_CITY)
            this.props.change('raisePOForm.BillAddrState', _temp_adress.AM_STATE)
            this.props.change('raisePOForm.BillAddrCountry', _temp_adress.AM_COUNTRY)
            this.props.change('raisePOForm.BillAddrPostCode', _temp_adress.AM_POSTCODE)
            this.setState({
                address : _temp_adress,
                strBillDefault: value,
                BillAddrCode : value,
                loading:false
            })
          }
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
                _get_details = this.props.purchased_items.rfqItemDetails
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

    async handleChange  (event, select_details){
         
        let  _details  = event.target.name;
        let _name = event.target.getAttribute("data-id");
        let _data = this.state.datas;
        let id = event.target.getAttribute("data-inputname");
        let _qty_input = '';

       
        if(_details){
            let _details_name =  _details.split('.')
            _name = _details_name[1]
            id  = _details_name[1]
            _qty_input = _details_name[3];
        }

        let _new_table_body = new Array();
        let _table_body = this.state.table_body;
        let _temp_table_body  = _table_body.filter((table_element, index) => { return index == _name})

        if(_temp_table_body.length){
           await _temp_table_body.forEach((table_element_value, index) => {
                if(_qty_input == "QUANTITY"){
                    if(event.target.value && event.target.value.length <= 9){
                        let _value = event.target.value;
                        table_element_value['AMOUNT']  =  (event.target.value) ? event.target.value * parseFloat(table_element_value['UNITCOST']) : table_element_value['UNITCOST']
                        table_element_value['QUANTITY'] = (event.target.value) ? parseInt(event.target.value)  : ''
                        table_element_value[id] = _value
                    }

                    if(event.target.value && event.target.value.length <= 6){
                        let _value = event.target.value;
                        table_element_value['AMOUNT']  =  (event.target.value) ? event.target.value * parseFloat(table_element_value['UNITCOST']) : table_element_value['UNITCOST']
                        table_element_value['QUANTITY'] = (event.target.value) ? parseInt(event.target.value)  : ''
                        table_element_value[id] = _value
                    }
                    
                    else if(event.target.value == 0){
                        let _value = (event.target.value) ? event.target.value.slice(0,5) : '';                    
                        table_element_value['AMOUNT']  =  0
                        table_element_value['QUANTITY'] = 0
                        table_element_value[id] = _value
                    }
                    
                }
                if(_qty_input == "Remarks"){
                    table_element_value['Remarks'] = event.target.value
                }
                if(_qty_input == "Remarks"){
                    table_element_value['Remarks'] = event.target.value
                }
                if(_qty_input == "UNITCOST"){
                    table_element_value['UNITCOST'] = event.target.value
                }
                if(_qty_input == "GST"){
                    console.log('123')
                    table_element_value['GST'] = parseFloat((event.target.value) ? event.target.value : 0)
                }
                if(_qty_input == "GIFT"){
                    table_element_value['GIFT'] = event.target.value
                }
                if(_qty_input == "Segmentation"){
                    console.log('table_element_value[id]', table_element_value[id])
                    table_element_value['Segmentation'] = event.target.value
                    
                }


                
                if(table_element_value[id]){
                    table_element_value[id] =  event.target.value
                }

                console.log('table_element_value', table_element_value)
                _new_table_body[_name] = table_element_value
            })
        }
    

        let _total_amount = 0;
        let _sst_amount = 0;
        let _sub_amount = 0 ;
     
        _table_body.forEach((_datas,index)=>{
            
            _table_body[index].PRODUCTCODE = (_table_body[index].PRODUCTCODE) ? _table_body[index].PRODUCTCODE : index;
        })

        this.setState({
            table_body:_table_body,
            datas:_data,
        })

    
        return event.target.value;
    }
    async handlefiltersubmit(values, details){
        let _table_body = this.state.table_body;
        let _POData = this.state.POData;
        let _GetPrSave = GetSavePo();
        let _form_details = (this.props.request_form && this.props.request_form.values && this.props.request_form.values.raisePOForm) ? this.props.request_form.values.raisePOForm : {}
        let _GetPrDto = GetPrDtoSave();
     
        console.log('handlefiltersubmit',values, this.props.request_form)

        let _details ='';
        if(values){
            let _form_details = (this.props.request_form && this.props.request_form.values && this.props.request_form.values.raisePOForm) ? this.props.request_form.values.raisePOForm : {}
            _details = Object.assign({},_GetPrSave , _form_details)
        }

        if(this.state.address  && this.state.address.AM_ADDR_LINE1 ){
            _POData = Object.assign({}, _details, _POData, this.state.address)
            _POData.Urgent = (_POData.Urgent) ? 1: 0
        }
        else{
            _POData = Object.assign({}, _details, _POData)
            _POData.Urgent = (_POData.Urgent) ? 1: 0
        }

        _POData.InternalRemark = (_form_details.InternalRemark) ? _form_details.InternalRemark : '';
        _POData.ExternalRemark = (_form_details.ExternalRemark) ? _form_details.ExternalRemark : '';
        _POData.PaymentMethod  = (_form_details.PaymentType) ? _form_details.PaymentType : '';
        _POData.PaymentType  = (_form_details.PaymentMethod) ? _form_details.PaymentMethod : '';

        console.log('_POData', _POData);

        _table_body.forEach((list,index)=>{
            _table_body[index].GIFT = (_table_body[index].GIFT=='Y' && _table_body[index].GIFT=='Yes') ? 'Y' : 'N';
        })

        console.log('_table_body', _table_body);
        let _save_item = await this.saveItem(_details)
        if(_save_item){
            let _final_datas ={
                    "POCost":this.state.table_body.reduce((a, val) =>a += (val.QUANTITY * val.UNITCOST) + val.GST, 0).toFixed(2),
                    "hidBaseAmt":1,
                    "prIndex":this.state.prIndex,
                    "modeType":(this.state.pr_value) ? "mod" : "new",
                    "modePR":"pr",
                    "RFQ_Num":this.state.RFQ_Mstr.RFQ_Num,
                    "ListingFromRFQ":"false",
                    POData : _POData,
                    POitemDetails : _table_body,
                    customFieldMstr : this.state.customFieldMstr,
                    customFieldDetailsMstr : this.state.customFieldMstr,
            }
    
            _final_datas.POData.VendorID = (_final_datas.POitemDetails.length) ? _final_datas.POitemDetails[0].COYID : 0;
            _final_datas.POData.VendorID  = (this.state.vendorID) ? this.state.vendorID : _final_datas.POData.VendorID
            _final_datas.POData.RfqIndex = this.state.strPONo
            _final_datas.POData.BillAddrCode = this.state.strBillDefault
            _final_datas.POData.QuoNo = this.state.po_number
            _final_datas.POData.ShipAmt = 1
            _final_datas.POData.lblPONo = (this.state.pr_value) ? this.state.pr_value : "";
            _final_datas.POData.POCost =  this.state.table_body.reduce((a, val) =>a += (val.QUANTITY * val.UNITCOST) + val.GST, 0).toFixed(2);
            _final_datas.POData.BillingMethod = "GRN";
            _final_datas.POData.ExchangeRate = "1.0";
            _final_datas.POData.ShipmentMode =  (_details.raisePOForm) ? _details.raisePOForm : 'Not Applicable';
            _final_datas.POData.ShipmentTerm =  (_details.ShipmentTerm) ? _details.ShipmentTerm : 'Not Applicable';
           
            let _temp_details = {}
            _temp_details.RFQPOSubmit = _final_datas;

            

            this.setState({loading:true})
            let _status = await ApiExtract(RfqPOSubmit, _temp_details)
            if(_status  && values.submit_type=="submit"){
                this.setState({
                    status: _status.status,
                    loading:false,
                    pr_value : (_status.response && _status.response.message) ? _status.response.message : ''
                })
              
              
                if(_status.status){
                    let _rfq = (_status.response && _status.response.message) ? _status.response.message : '';
                    let temp = {  RFQ_Num :'',lblPONo :'', POCost :'', prIndex :''}
                    if(_status.status && _rfq){
                        temp.RFQ_Num =  _rfq;
                        temp.lblPONo = _rfq;
                        temp.POCost =  this.state.table_body.reduce((a, val) =>a += (val.QUANTITY * val.UNITCOST) + val.GST, 0).toFixed(2);
                        temp.prIndex = this.state.prIndex;
                        this.props.history.push({
                            pathname:'/po_approval_setup',
                            datas: temp
                        })
                    }
                   
                }
           }
           else if(_status  && values.submit_type=="save"){
                this.props.change('raisePOForm.prNo', _status)
                this.setState({
                    status: _status.status,
                    validation:true,
                    modal_body: _status.message,
                    final_message : (_status.response) ? _status.response.message : '',
                    loading:false,
                    pr_value : (_status.response && _status.response.message) ? _status.response.message : ''
                })
            }
        }
        
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
        let _modal_size= 'sm';
        if(details.id=="FUNDTYPEDESC"){
            _table_model_header = [
                    {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                    {name : "Code", id:"AC_ANALYSIS_CODE"},
                ];
            _table_model_body = this.props.fund_type_project_code;
            _modal_title = "Select Fund Type (L1)"

        }
        else if(details.id=="deliveryAddress"){
            _table_model_header = [
                {name : "Code", id:"AM_ADDR_CODE", key:true},
                {name : "Address", id:"Address"},
                {name : "City", id:"AM_CITY"},
                {name : "State", id:"STATE"},
                {name : "Post Code", id:"AM_POSTCODE"},
                {name : "Country", id:"AM_COUNTRY"},
            ];
            _table_model_body = (this.props.get_fill_address_po && this.props.get_fill_address_po.dsBilling) ? this.props.get_fill_address_po.dsBilling : []
            _modal_title = "Select Delivery Address"
            _modal_size = "xl"
        }
        else if(details.id=="costCentre"){
            _table_model_header = [
                {name : "Budget Account Code", id:"AM_ACCT_CODE", key:true},
                {name : "Budget Account", id:"AM_ACCT_DESC"},
            ];
            _table_model_body = this.props.cost_centre_code;
            _modal_title = "Select Default Budget Account"
        }
        else if(details.id=="PERSONCODEDESC"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body = this.props.fund_type_project_code_l9
            _modal_title = "Select Person Code (L9)"
        }

        else if(details.id=="PROJECTCODEDESC"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body =this.props.fund_type_project_code_l8
            _modal_title = "Select Project / ACR (L8) Code"
        }

        else if(details.id=="GLDESCRIPTION"){
            _table_model_header = [
                {name : "Description", id:"DESCRIPTION", key:true},
                {name : "Code", id:"GLCODE"},
            ];
            _table_model_body = (this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode) ? this.props.gl_code.FFRaisePO.dsGLCode : []
            _modal_title = "Select GL Code"
        }

    

        else if(details.id=="Segmentation"){
            _table_model_header = [
                {name : "Description", id:"CF_FIELD_VALUE", key:true},
            ];
             _table_model_body = (this.props.segmentation) ? this.props.segmentation : []
             _modal_title = "Select Custom Fields"
        }
        
        this.setState({
            modal_popup:true,
            modal_popup_header:_table_model_header,
            modal_popup_title:_modal_title,
            modal_popup_body:_table_model_body,
            model_current_id: details.id,
        })
       
    }

    updateData() {
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
        })
    }

    FileUpload = (attachment) => {
        let _get_details  = attachment.target;
        let _file_name ='';
       
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType": 0,
            "strDocType": "PO",
            "pEnumUploadForm": 0,
            "strDocNo": "",
            "blnTemp": "false",
            "strIndex": "",
            "seq": "",
            "pFrontOfficeSite": "",
            "AttachType": attachment,
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
            "modeType": (this.state.strPrNO) ? "Mod" : "New"
        }
       
        if(_file_name == "raisePOForm.internalAttachment" && this.state.internal_file){
            req.AttachType = 'I';
           
            this.setState({
                external_delete : false,
                external_upload : false,
                internal_delete : false,
                internal_upload : true,
                rendered : true,
                filename:'',
                internal_file : '',
                internal_file_name :'',
            })
            attachment.target.value = null
            this.props.UploadDocuments(this.state.internal_file, req)
        }
        else if(_file_name == "raisePOForm.externalAttachment" && this.state.external_file){
            req.AttachType = 'E';
           
            this.setState({
                internal_delete : false,
                internal_upload : false,
                external_delete : false,
                external_upload : true,
                rendered : true,
                filename:'',
                external_file : '',
                external_file_name :'',
            })
            attachment.target.value = null
            this.props.UploadDocuments(this.state.external_file, req)
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

    SendUpload = (e) => {
        if(e.target.name=="raisePOForm.internalAttachment"){
            this.setState({
                internal_file : e.target.files[0],
                internal_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
            })
        }
        else if(e.target.name=="raisePOForm.externalAttachment"){
            this.setState({
                external_file : e.target.files[0],
                external_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
            })
        }
        else{

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

    async SelecthandleChange  (name, e){
        let _table_body = this.state.table_body
        let  _details  = e.target.name;
        let  _value  = e.target.value;
        if(_details && _value){
            let _details_name =  _details.split('.')
            let _id  = _details_name[1]
            let  _qty_input = _details_name[3];
            if(_qty_input=='GIFT'){
                _table_body[name].GIFT = _value
            }
            if(_qty_input == "Segmentation"){
                console.log('_table_body', _table_body)
                _table_body[name].Segmentation = _value
            }
        }
        this.setState({
            table_body : _table_body
        })

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
        if(!table_body.length){
            table_body = this.props.purchased_items.rfqItemDetails
        }
        if(current_id!='' && current_model && table_body[current_id]){
            let _details =  Object.assign({},table_body[current_id],  e)
            table_body[current_id] = _details;
            if(current_model=="FUNDTYPEDESC"){
                table_body[current_id][current_model]= e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].FUNDTYPE = e.AC_ANALYSIS_CODE
            }
            else if(current_model=="deliveryAddress"){
                table_body[current_id][current_model]= e.AM_ADDR_LINE1
                table_body[current_id].DeliveryAddr= e.AM_ADDR_CODE
            }
            else if(current_model=="costCentre"){
                table_body[current_id].prdAcctIndex = e.AM_ACCT_INDEX;
                table_body[current_id].costCentre = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE;
                table_body[current_id][current_model]= e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE
            }
            else if(current_model=="PERSONCODEDESC"){
                table_body[current_id].PERSONCODE = e.AC_ANALYSIS_CODE;
                table_body[current_id][current_model]=e.AC_ANALYSIS_CODE_DESC
            }
            else if(current_model=="PROJECTCODEDESC"){
                table_body[current_id].PROJECTCODE = e.AC_ANALYSIS_CODE;
                table_body[current_id][current_model]=e.AC_ANALYSIS_CODE_DESC;
            }

            else if(current_model=="GLDESCRIPTION"){
                table_body[current_id].GLDESCRIPTION = e.GLCODE + e.DESCRIPTION
                table_body[current_id].GLCODE = e.GLCODE 
                table_body[current_id][current_model] = e.GLCODE + e.DESCRIPTION
            }
        }

        this.setState({
            table_body: table_body,
            table_model_body :[],
            model : false ,
            current_model : '',
            current_id : ''
        })
    }  
    
    getPopupSelectedProduct = (e, details, selected) => {
        let {model_current_id, table_body} = this.state;
        if(!table_body.length){
            table_body = (this.props.purchased_items.rfqItemDetails) ? this.props.purchased_items.rfqItemDetails : []
        }

       
        
        let _final_result =[]
        if(table_body.length){
           
            table_body.forEach((list,index)=>{
                let temp_data = Object.assign({} , list ,  e)
                if(model_current_id=="FUNDTYPEDESC"){
                    temp_data[model_current_id]= e.AC_ANALYSIS_CODE_DESC
                    temp_data.FUNDTYPE = e.AC_ANALYSIS_CODE
                }
                else if(model_current_id=="deliveryAddress"){
                    temp_data[model_current_id]= e.AM_ADDR_LINE1
                }
                else if(model_current_id=="costCentre"){
                    temp_data[model_current_id]= e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE
                    temp_data.prdAcctIndex = e.AM_ACCT_INDEX;
                    temp_data.costCentre = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE;
                }
                else if(model_current_id=="PERSONCODEDESC"){
                    temp_data[model_current_id]=e.AC_ANALYSIS_CODE_DESC
                    temp_data.PERSONCODE = e.AC_ANALYSIS_CODE;

                }
                else if(model_current_id=="PROJECTCODEDESC"){
                    temp_data[model_current_id]=e.AC_ANALYSIS_CODE_DESC
                    temp_data.PROJECTCODE = e.AC_ANALYSIS_CODE;
                }
                else if(model_current_id=="GLDESCRIPTION"){
                    temp_data[model_current_id]=e.DESCRIPTION;
                    temp_data.GLDESCRIPTION = e.GLCODE + e.DESCRIPTION;
                    temp_data.GLCODE = e.GLCODE;
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

    handlePopup(input,details){
       
        let _get_all_state = this.state;
        let _target_id = input.target.getAttribute('data-name');
        let _target_name = input.target.getAttribute('data-details');
        let _details = {
            model : true ,
            table_display :true,
            current_model : _target_name,
            current_id : _target_id,
            table_model_header : [],
            table_model_body : []
        }

        if(_target_name=="FUNDTYPEDESC"){
            _details.table_model_header = [
                    {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                    {name : "Code", id:"AC_ANALYSIS_CODE"},
                ];
             _details.table_model_body = this.props.fund_type_project_code;
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
             _details.table_model_body = (this.props.get_fill_address_po && this.props.get_fill_address_po.dsBilling) ? this.props.get_fill_address_po.dsBilling : []
             _details.da = [_target_id]
             _details.modal_title = "Delivery Address"
        }
        else if(_target_name=="costCentre"){
            _details.table_model_header = [
                {name : "Budget Account Code", id:"AM_ACCT_CODE", key:true},
                {name : "Budget Account", id:"AM_ACCT_DESC"},
            ];
             _details.table_model_body = this.props.cost_centre_code;
             _details.ccc = [_target_id]
             _details.modal_title = "Cost Centre Code (L7)"
        }
        else if(_target_name=="PERSONCODEDESC"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.fund_transfer_l9 = [_target_id]
            _details.table_model_body = this.props.fund_type_project_code_l9
            _details.modal_title = "Person Code (L9)"
        }

        else if(_target_name=="PROJECTCODEDESC"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
          
             _details.fund_transfer_l8 = [_target_id]
             _details.table_model_body =this.props.fund_type_project_code_l8
             _details.modal_title = "Project / ACR (L8) Code"
        }

        else if(_target_name=="GLDESCRIPTION"){
            _details.table_model_header = [
                {name : "Description", id:"DESCRIPTION", key:true},
                {name : "Code", id:"GLCODE"},
            ];
          
             _details.fund_transfer_l8 = [_target_id]
             _details.pop_size = "lg"
             _details.table_model_body = (this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode) ? this.props.gl_code.FFRaisePO.dsGLCode : []
             _details.modal_title = "Select Project Gl Code"
        }

        let _main_details = Object.assign({}, _get_all_state, _details)
  
        this.setState({
            model : _main_details.model,
            table_display : _main_details.table_display,
            current_model :  _main_details.current_model,
            current_id :  _main_details.current_id,
            table_model_header :  _main_details.table_model_header,
            table_model_body :  _main_details.table_model_body,
            fund_transfer_l1 :  _main_details.fund_transfer_l1,
            ccc :  _main_details.ccc,
            da :  _main_details.da,
            modal_body:'',
            fund_type_project_code_l9 :  _main_details.fund_type_project_code_l9,
            fund_type_project_code_l8 :  _main_details.fund_type_project_code_l8,
            modal_title : _main_details.modal_title

        })
    }

    makeDuplicate = async (e) =>{
        let _form_value  = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
        let {table_body, products, slected_items} = this.state;
        console.log('slected_items', slected_items)
        let _combain_array = table_body;
        if(!slected_items.length){
            this.setState({
                status:false,
                table_display:false,
                validation : true, 
                modal_title : '',
                modal_body:'Select Atleast One Product'
            })
        }
        else{
            
            let _get_selected = []
            await slected_items.forEach((list)=>{
                let _get_duplicate =   table_body.filter((list_element, index)=> {
                        return index==list
                })
                let _temp_duplicate = [..._get_duplicate]
                if(_temp_duplicate.length){
                    let _length_name  =  parseInt(table_body.length) ;
                    if(_length_name){
                             _temp_duplicate.forEach((list_element)=>{
                            let _name = `itemList.${_length_name}.${list_element.PRODUCTCODE}.`
                            this.props.change(_name+'Remarks', list_element.Remarks)
                            this.props.change(_name+'QUANTITY', list_element.QUANTITY)
                            this.props.change(_name+'WarrantyTerms', list_element.WARRANTYTERMS)
                            this.props.change(_name+'Segmentation', 'Standard Material')
                            this.props.change(_name+'delivery',new Date((new Date()).valueOf() + 1000*3600*24))
                        })
                    }
                }
                
                let _temp_duplicate_1 = _temp_duplicate.map(function(details,index){
                    let _details = Object.assign({}, details)
                    _details.ITEMINDEX  = ( table_body.length) ?  table_body.length+1 : 0;  
                    _details.ITEMLINE  = ( table_body.length) ?  table_body.length+1 : 0;  
                    return _details
                })
                
                if(_temp_duplicate && _temp_duplicate.length){ 
                    _combain_array.push(_temp_duplicate_1[0])
                }
            })

            this.setState({
                delete:true,
                table_body:_combain_array,
            })
         
        }

    }
    
    removeItem = (e, details) =>{
        let {table_body, products, slected_items} = this.state;
        if(!table_body.length){
            table_body = this.props.purchased_items.rfqItemDetails
        }
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

    commonfunction = async (raisePOForm) => {
        raisePOForm.type = raisePOForm.raisePOForm.prNo === '' || null ? 'new' : 'mod';
        raisePOForm.mode = this.props.location === undefined || null ? 'bc' : 'cc';
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
        Object.assign(raisePOForm.prDto, billingAddress);
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
        const object3 = { ...raisePOForm, ...itemList }
        object3.customFieldList = prCustomList;

    }

    addItem = () => {
        this.setState({
            addmodel:true
        })
    }

    deleteFile = (val, type) => {
        val.AttachType = type;
        if(val.AttachType=="I"){
            this.setState({ 
                internal_delete : true,
                internal_upload : false,
                external_delete : false,
                external_upload : false
            })
        }
        else{
           
             this.setState({
                internal_delete : false,
                internal_upload : false,
                external_delete : true,
                external_upload : false
             })
        }
        val.modeType = "New";
        if(val.hasOwnProperty('CDA_ATTACH_FILENAME')){
            let _tempdetails  = {
                strFile: val.CDA_ATTACH_FILENAME,
                strFile1 :  val.CDA_HUB_FILENAME,
                Text: val.CDA_FILESIZE,
                ID: val.CDA_ATTACH_INDEX,
            }
            val = Object.assign({}, val, _tempdetails)
       }
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
            let _date_name = 'itemList.'+index+'.'+list.PRODUCTCODE+'.delivery';
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
        if(this.props.location && this.props.location && this.props.location.datas && this.props.location.datas.prid){
            let _final_datas = {
                PRM_PR_No : this.props.location.datas.prid
            }

            this.setState({ loading:true})
            let _status =  await ApiExtract(VoidPR, _final_datas)
            if(_status){
                this.setState({
                    status: _status.status,
                    validation:true,
                    modal_body: _status.message,
                    loading:false
                })
               
            }
        }
    }

     saveItem = async (_submit_details) =>{
        let {table_body, products} = this.state;
        let _date_inst = new Date();
        let _result = true;
      
        if(table_body.length){
            await table_body.forEach((list_details)=>{   
                if(!list_details.hasOwnProperty('FUNDTYPEDESC') || !list_details.FUNDTYPEDESC){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Select valid Fund Type (L1)'
                    })
                    _result = false
                }
                else if(!list_details.hasOwnProperty('PERSONCODEDESC') || !list_details.PERSONCODEDESC){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Select valid Person Code (L9)'
                    })
                    _result = false
                }
                else if(!list_details.hasOwnProperty('GLDESCRIPTION') || !list_details.GLDESCRIPTION){
                    this.setState({
                        validation:true,
                        modal_title : '',
                        modal_body : 'Please Select valid GL Description '
                    })
                    _result = false
                }
                else if(!list_details.hasOwnProperty('PROJECTCODEDESC') || !list_details.PROJECTCODEDESC){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Select valid Project / ACR (L8) Code'
                    })
                    _result = false
                }

                else if(!_submit_details && !_submit_details.raisePOForm && !_submit_details.raisePOForm.BillTo){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Choose Billto'
                    })
                    _result = false
                }

                else if(!_submit_details && !_submit_details.raisePOForm && !_submit_details.raisePOForm.Vendor){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Choose Vendor Name'
                    })
                    _result = false
                }

                else if(!_submit_details && _submit_details.raisePOForm && _submit_details.raisePOForm.PaymentType){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Choose Payment Terms'
                    })
                    _result = false
                }

                else if(!_submit_details && !_submit_details.raisePOForm && !_submit_details.raisePOForm.PaymentMethod){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Choose Payment Method'
                    })
                    _result = false
                }

                else if(!_submit_details && !_submit_details.raisePOForm && !_submit_details.raisePOForm.ShipmentTerm){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Choose Shipment Terms'
                    })
                    _result = false
                }

                else if(!_submit_details && !_submit_details.raisePOForm && !_submit_details.raisePOForm.ShipmentMode){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Choose Shipment Mode'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('AM_ADDR_CODE') || !list_details.AM_ADDR_CODE){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Select Delivery Address'
                    })
                    _result = false
                }

              
                else if(!this.state.BillAddrCode){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Choose Billing Address'
                    })
                    _result = false
                }

             
                

                
                
                else if(!list_details.hasOwnProperty('GLDESCRIPTION') || !list_details.GLDESCRIPTION){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'GL Description (GL CODE)'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('costCentre') || !list_details.costCentre){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Select valid Cost Centre Code (L7)'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('deliveryAddress') || !list_details.deliveryAddress){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Select valid Delivery Address'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('QUANTITY') || (list_details.QUANTITY<=0) || (list_details.QUANTITY=='')){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Please enter valid quantity'
                    })
                    _result = false
                }
                else{
                   
                }

            })
        }
        return _result

        
    }

    ChangeUrget = () =>{
        this.setState({
            Urgent : (this.state.Urgent==1) ? 0 : 1 
        })
    }

    render(){
    
    
     const { handleSubmit } = this.props
        const _table_header = [
            // {name : "Line", id:"ITEMINDEX", key:true, width:'100px'},
            {name : "Gift", id:"GIFT", width:'44px'},
            {name : "Fund Type (L1)", id:"FUNDTYPEDESC", type:"click", width:'148px', dataFormat:'select'},
            {name : "Person Code (L9)", id:"PERSONCODEDESC", type:"click", width:'138px'},
            {name : "Project / ACR (L8) Code ", id:"PROJECTCODEDESC", type:"click", width:'157px'},
            {name : "GL Description (GL CODE)", id:"GLDESCRIPTION",type:"click", key:false, width:'150px'},
            {name : "Category Code", id:"CATEGORYCODE", key:false, width:'100px', type:"select", align:'right', select_status:"disable",key:false, value:[{value:"", name:"NS"}]},
            {name : "Item Name", id:"PRODUCTDESC", width:'100px'},
            {name : "MPQ", id:"POD_MIN_PACK_QTY", key:false, width:'79px', type:"price"},
            {name : "PO Qty", id:"POD_ORDERED_QTY", key:false, disabled:true, width:'67px',type:"price"},
            {name : "Unit Price", id:"UNITCOST",  disabled:true, width:'100px',type:"price"},
            {name : "Amount", id:"AMOUNT", key:false, width:'100px',type:"price"},
            {name : "SST Rate", id:"GSTRate", key:false, width:'100px', type:"select", align:'right', select_status:"disable",key:false, value:[{value:"", name:"NS"}]},
            {name : "SST Amount", id:"GST", key:false, width:'100px', type:"price", align:'right'},
            {name : "SST Tax Code (Purchase, L6)", id:"GstTaxCode", key:false, width:'100px', type:"select", select_status:"disable",key:false, value:[{value:"", name:"NS"}]},
            {name : "Cost Centre Code (L7)", id:"costCentre", key:false, type:"click", width:'114px'},
            {name : "Delivery Address", id:"deliveryAddress", key:false, type:"click", width:'134px'},
            {name : "Est. Date of Delivery (dd/mm/yyyy)", id:"deliveryUIDate", key:false, width:'143px'},
            {name : "Warranty Terms (months)", id:"WARRANTYTERMS", key:false,  width:'107px',type:"price"},
            {name : "Segmentation", id:"segmentation", key:false, type:"text", width:'120px'},
            {name : "Remarks", id:"REMARK", key:false, width:'200px'},
        ];


        return <Fragment>
            <PageHeading 
                heading="Raise Purchase Order" 
                subheading="Fill in the required field(s) and click the Save button to create the PR or Submit button to submit the PR." 
            />
              {this.props.upload_document && this.props.upload_document.loading ? <Loader /> : '' } 
              {this.props.file_upload_external && this.props.file_upload_external.loading ? <Loader /> : '' } 
              {this.props.file_delete && this.props.file_delete.loading ? <Loader /> : '' } 
              {this.props.ed_loading ? <Loader /> : '' } 
              {this.props.pri_popup_details && this.props.pri_popup_details.loading ? <Loader /> : '' } 
              {this.props.pri_loading  ? <Loader /> : '' } 
              {this.props.spr_loading  ? <Loader /> : '' } 
              {this.state.loading  ? <Loader /> : '' } 
              {this.props.dr_loading  ? <Loader /> : '' } 
              {this.props.gl_loading ? <Loader /> : '' }
              {this.props.po_loading ? <Loader /> : '' }
              
              
              <TabHeading color={'bg-info color-white'}>Purchase Order Header</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefiltersubmit.bind(this))}>
                
               
                <div className="row mt-2">    
                    <div className='col-12'>
                        <div className="row mt-2"> 
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <Field type="text" name="raisePOForm.prNo" component={FromInputs} className="form-control" placeholder="To be Allocated by the system" label="PO Number :" readonly={true} />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <Field type="text" name="raisePOForm.date" selected={this.state.date_details} dateformate="DD/MM/YYYY" component={FormDatePicker} minDate = {new Date()} className="form-control" placeholder="Date " label="Date"   onChange={this.handleDate.bind(this)} readonly={true}/>   
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="raisePOForm.Vendor" component={FromInputs} className="form-control" placeholder="Vendor Name" label="Vendor* :"   readonly={true}/>   
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="raisePOForm.CurrencyCode" component={FromInputs} className="form-control" placeholder="Currency Code" label="Currency Code* :"  />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field className="form-control textboxstyle" defaultValue={'1'} component={FromSelect} label="Payment Terms* :" name="raisePOForm.PaymentType" readOnly>
                                            <option >--Select--</option>
                                            <option value="Cash On delivery">Cash On delivery</option>
                                            <option value="7 Days">7 Days</option>
                                            <option value="14 Days">14 Days</option>
                                            <option value="15 Days">15 Days</option>
                                            <option value="21 Days">21 Days</option>
                                            <option defaultValue="1" value="30 Days">30 Days</option>
                                            <option value="45 Days">45 Days</option>
                                            <option value="60 Days">60 Days</option>
                                            <option value="90 Days">90 Days</option>
                                            <option value="120 Days">120 Days</option>
                                            <option value="180 Days">180 Days</option>
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field className="form-control textboxstyle" component={FromSelect} name="raisePOForm.PaymentMethod" label="Payment Method* :" readOnly>
                                            <option defaultValue=''>--Select--</option>
                                            <option value="Bank Draft">Bank Draft</option>
                                            <option value="Cashier's Order">Cashier's Order</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Local Bank Transfer">Local Bank Transfer</option>
                                            <option value="Telegraphic Transfer">Telegraphic Transfer</option>
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field className="form-control textboxstyle" component={FromSelect} name="raisePOForm.ShipmentTerm" label=" Shipment Terms* :" readOnly>
                                        <option defaultValue=''>--Select--</option>
                                        <option value="CFR">CFR</option>
                                        <option value="CIF">CIF</option>
                                        <option value="CIP">CIP</option>
                                        <option value="CPT">CPT</option>
                                        <option value="DAF">DAF</option>
                                        <option value="DDP">DDP</option>
                                        <option value="DDU">DDU</option>
                                        <option value="DEQ">DEQ</option>
                                        <option value="DES">DES</option>
                                        <option value="EXW">EXW</option>
                                        <option value="FAS">FAS</option>
                                        <option value="FCA">FCA</option>
                                        <option value="FOB">FOB</option>
                                        <option value="Not Applicable">Not Applicable</option>
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field className="form-control textboxstyle" component={FromSelect} name="raisePOForm.ShipmentMode" label=" Shipment Mode* :" readOnly>
                                        <option defaultValue=''>--Select--</option>
                                        <option value="Air Cargo">Air Cargo</option>
                                        <option value="Bus Service">Bus Service</option>
                                        <option value="Freight Forwarder">Freight Forwarder</option>
                                        <option value="Intermodal Carriage">Intermodal Carriage</option>
                                        <option value="Motor Freight - lTL">Motor Freight - lTL</option>
                                        <option value="Motor Freight - TL">Motor Freight - TL</option>
                                        <option value="Not Applicable">Not Applicable</option>
                                        <option value="Parcel Post">Parcel Post</option>
                                        <option value="Pipeline">Pipeline</option>
                                        <option value="Private Parcel">Private Parcel</option>
                                        <option value="Rail Freight - CL">Rail Freight - CL</option>
                                        <option value="Rail Freight - LCL">Rail Freight - LCL</option>
                                        <option value="Water Freight - Coastal">Water Freight - Coastal</option>
                                        <option value="Water Freight - Inland">Water Freight - Inland</option>
                                        <option value="Water Freight - Intercoast">Water Freight - Intercoast</option>
                                    </Field>
                                </div>
                            </div>
                       
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="raisePOForm.Shipvia" component={FromInputs} className="form-control" placeholder="Ship via " label="Ship via" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="raisePOForm.Attn" component={FromInputs} className="form-control" placeholder="Attention To " label="Attention To"  />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                 
                        <div className="col-12 col-sm-6 mt-2 details" >
                           
                            <Field className="form-control textboxstyle" select_value={(this.state.address && this.state.address.BillAddrCode) ? this.state.address.BillAddrCode : 1 } component={FromSelect} name="raisePOForm.BillTo" label="Bill To * :" change_detuct={this.handleSelectChange}>
                                    <option value=""> Select BillTo </option>
                                    {(this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.billTo) ? this.props.gl_code.FFRaisePO.billTo.map((list_details)=>{
                                        return (<option value={list_details.AM_ADDR_CODE}>{list_details.AM_ADDR_CODE}</option>)
                                    }) :''}
                            </Field>
                            <Field type="text" name="raisePOForm.BillAddrLine1" component={FromInputs} className="form-control" placeholder="Address 1" label="Address 1" readonly={true} />
                            <Field type="text" name="raisePOForm.BillAddrLine2" component={FromInputs} className="form-control" placeholder="Address 2" label="Address 2" readonly={true} />
                            <Field type="text" name="raisePOForm.BillAddrLine3" component={FromInputs} className="form-control" placeholder="Address 3" label="Address 3" readonly={true} />
                            <Field type="text" name="raisePOForm.BillAddrPostCode" component={FromInputs} className="form-control" placeholder="PostCode" label="PostCode" readonly={true} />
                            <Field type="text" name="raisePOForm.BillAddrCity" component={FromInputs} className="form-control" placeholder="City" label="City" readonly={true} />
                            <Field type="text" name="raisePOForm.BillAddrState" component={FromInputs} className="form-control" placeholder="State" label="State" readonly={true} />
                            <Field className="form-control textboxstyle" component={FromSelect} name="raisePOForm.BillAddrCountry" label="Country :" readonly={true}>
                            <Field type="text" name="raisePOForm.requestContact" component={FromInputs} className="form-control" placeholder="Requester Contact" label="Requester Contact" readonly={true} />
                                    <option value="MY">Malaysia</option>
                            </Field>
                            <Field type="text" name="raisePOForm.InternalRemark" component={FromInputs} className="form-control" placeholder="Internal Remarks " label="Internal Remarks " />
                           
                            <FromUplods name="raisePOForm.internalAttachment" id ="internal_attachment" decs=" Recommended file size is 10240 KB" label="Internal Attachment" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.internal_file_name}/> 
                               
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">  
                                    <div className="col-12">
                                        <label className="form_label">Internal File Attached : </label>
                                        {(this.state.internal_attachment && this.state.internal_attachment.length) ? this.state.internal_attachment.map((val, index) => {
                                            if (val.CDA_TYPE === 'I') {
                                                return <p className="downloadPointer"><u><span onClick={()=>this.download_file(val)}>{(val.strFile) ? val.strFile :val.CDA_ATTACH_FILENAME} &nbsp;&nbsp;</span></u> <span className="btn btn-sm btn-danger delete-doc" onClick={() => this.deleteFile(val, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                            }
                                        }) : 'No Files Attached'}
                                    </div>
                                </div>
                            </div>
                           
                            <Field type="text" name="raisePOForm.ExternalRemark" component={FromInputs} className="form-control" placeholder="External Remarks" label="External Remarks :"  />
                        
                            <FromUplods name="raisePOForm.externalAttachment" id ="external_attachment" decs="Recommended file size is 10240 KB" label="External Attachment :" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                              
                            <div className="col-12 col-md-6">
                               
                                <label  className="form_label">External File Attached : </label>
                                    {(this.state.extrnal_attachment && this.state.extrnal_attachment.length) ? this.state.extrnal_attachment.map((val, index) => {
                                        if (val.CDA_TYPE === 'E') {
                                            return <p className="downloadPointer"><u><span onClick={()=>this.download_file(val)}>{(val.strFile) ? val.strFile :val.CDA_ATTACH_FILENAME} &nbsp;&nbsp;</span></u> <span className="btn btn-sm btn-danger delete-doc" onClick={() => this.deleteFile(val, 'E')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    }): 'No Files Attached'}
                                </div>
                          
                           
                                <Field  id="raisePOForm.Urgent" component={FromCheckBox} type="checkbox" name="raisePOForm.Urgent" label="Urgent " checked={(this.state.Urgent) ? true : false } onClick={this.ChangeUrget} />
                           
                           
                                <div className="col-12"> 
                                    <p>If you do not want "Custom Fields" or"Remark" to appear in PO, please uncheck the appropriate boxes. :</p>
                                    <div className="row mt-2">
                                    
                                        <Field  id="custom_fields" component={FromCheckBoxFull} type="checkbox" name="raisePOForm.PrintCustom" label="Custom Fields" checked={this.state.form_checks.includes(0)} />
                                        <Field  id="remark" component={FromCheckBoxFull} type="checkbox" name="raisePOForm.PrintRemark" label="Remark" checked={this.state.form_checks.includes(1)} />
                                    
                                    
                                </div>
                            </div>
                        </div>
                    </div>   
               
                
                <div className="row mt-2">    
                    <div className='col-12'>   
                      
                        
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={this.state.table_body} 
                            products={this.getProducts} 
                            select={true} 
                            serial={true}
                            selected_items={this.state.slected_items}
                            serial_text={'Line'}
                            selectname={'itemcode'} 
                            responsive={true} 
                            headerclick={this.handleheaderlinks}
                            extratotal={true}
                            colcount={_table_header.length+1}
                            subtotal={this.state.table_body.reduce((a, val) => a += val.QUANTITY * val.UNITCOST, 0).toFixed(2)}
                            sstamount={this.state.table_body.reduce((a, val) => a += val.GST, 0).toFixed(2)}
                            grandtotal={this.state.table_body.reduce((a, val) =>
                                a += (val.QUANTITY * val.UNITCOST) + val.GST, 0).toFixed(2)}
                            table_id="line"
                            segmentation = {(this.props.segmentation) ? this.props.segmentation : []}
                            changefunction = {this.handleChange}
                            inputPrefix = 'itemList'
                            handle_popup= {this.handlePopup}
                            handle_date={this.handleDateTable.bind(this)}
                            dates={this.state.dates}
                            select_function_inex = {this.select_function_inex}
                            handledate = {this.handledate.bind(this)}
                            handledateHeader = {this.handledateHeader.bind(this)}
                            main_date = ''
                            change={this.props.change}
                            select_change = {this.SelecthandleChange}
                        />


                    </div>
                </div>
                <div className="col-12 mt-3 text-center">
                    {this.state.show_save_button && <button className="btn btn-sm btn-outline-success" onClick={handleSubmit(values => this.handlefiltersubmit({  ...values, submit_type: 'save'}))} type="button">Save</button> }
                    <button className="btn btn-sm btn-outline-primary ml-2" onClick={handleSubmit(values => this.handlefiltersubmit({  ...values, submit_type: 'submit'}))}>Submit</button>
                   
                </div>
                </form>
            
              
                
                <Modal open={this.state.model} header ={true} title ={this.state.modal_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.updateData }>Save</button> : ''}
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
                                    inputPrefix = 'PrDto'
                                />
                            </div>
                        </form>
                    </Fragment>
                    :''}
                </Modal>
                <Alert 
                    title={this.state.modal_title} 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.validation} 
                    confirm={this.closeModel}
                />
                <Modal open={this.state.modal_popup} header ={true} title ={this.state.modal_popup_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.updateData }>Save</button> : ''}
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
     </Fragment>
    }
}

Request = reduxForm({
    form:'raise_po_main',
    enableReinitialize : true,
    destroyOnUnmount :false,
})(Request)



Request = connect(
  state => ({
    initialValues: {
        prDto:{
            requestName:UserDetails().UM_USER_NAME,
            prNo:(state.save_purchase_request && state.save_purchase_request.responseList && state.save_purchase_request.responseList.strPrNO) ? state.save_purchase_request.responseList.strPrNO[0].cp_param_value: ''
        }
  }})              
)(Request)


const mapStateToProps = state => ({
    purchase_request_items : state.purchase_request_items.responseList,
    pri_loading : state.purchase_request_items.loading,
    upload_document : state.upload_document,
    file_upload_external : state.file_upload_external,
    file_delete : state.file_delete,
    file_delete_external : state.file_delete_external,
    ed_loading: state.file_delete_external.loading,
    request_form : state.form.raise_po_main,
    fund_type_project_code : state.fund_type_project_code.responseList,
    fund_type_project_code_l8 : state.fund_type_project_code.responseListL8,
    fund_type_project_code_l9 : state.fund_type_project_code.responseListL9,
    address : state.address.responseList,
    delivery_address : state.delivery_address.responseList,
    cost_centre_code : state.cost_centre_code.responseList,
    segmentation : state.segmentation.responseList,
    search_product_list : state.search_product_list.responseList,
    sp_loading : state.search_product_list.loading,
    search_product_cancel_list : state.search_product_cancel_list.responseList,
    spl_loading : state.search_product_cancel_list.loading,
    pr_status : state.purchase_request_status.responseList,
    get_fill_address_po: state.get_fill_address.responseList,
    dr_loading : state.file_download.loading,
    pri_popup_details : state.purchase_request_items_popup,
    pri_popup : state.purchase_request_items_popup.responseList,
    gl_code : state.gl_code.responseList,
    gl_loading: state.gl_code.loading,
    external_delete : state.file_delete_external.responseList,
    po_details : state.po_details.responseList,
    po_loading : state.po_details.loading
  })
  
  const mapDispatchToProps = dispatch => ({
    UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
    FundTypeOrPersonCode  : (datas) => dispatch(FundTypeOrPersonCodeORProjectCodeAction(datas)),
    FillAddress  : () => dispatch(FillAddressAction()),
    // DeliveryAddress  : () => dispatch(DeliveryAddressAction()),
    CostCentreCode  : () => dispatch(CostCentreCodeAction()),
    SegmentationAction  : () => dispatch(SegmentationAction()),
    GetSearchPRList  : (values) => dispatch(GetSearchPRList(values)),
    GetSearchPRCancelList  : (values) => dispatch(GetSearchPRCancelList(values)),
    get_details : (values) =>dispatch(GetPurchaseRequestItemsDetails(values)),
    get_fill_address : (values) => dispatch(GetFillAddress(values)),
    get_delete_file  : (values) => dispatch(GetDeleteFile(values)),
    download : (values) => dispatch(GetDownloadFile(values)),
    GetViewSinglePr : (values) => dispatch(GetViewSinglePr(values)),
    GetApppoDetails : (values) => dispatch(GetApppoDetails(values)),
    GetFFRaisePOScreen : (values) => dispatch(GetFFRaisePOScreen(values)),
  })
  
  
const PurchaseDetails = connect(mapStateToProps, mapDispatchToProps)(Request);
export default PurchaseDetails;

