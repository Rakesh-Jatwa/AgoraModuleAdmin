import React,{Component, Fragment} from 'react';
import {FromCheckBoxFull,FromCheckBox, FromInputs, FromUplods, FormPlainInput, FormDatePicker, FromSelect} from '../../../../Component/From/FromInputs'
import {connect} from 'react-redux';
import PageHeading from '../../../../Component/Heading/PageHeading';
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm , change} from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table'
import Common from '../../../../Common'
import {TodayDateSalash,FromateDateMonth, addDate} from '../../../../Component/Dates'
import Modal from '../../../../Component/Modal'
import Alert from '../../../../Component/Modal/alert'
import Loader from '../../../../Component/Loader'
import {CalcDate} from  '../../../../Component/Dates'
import {UserDetails } from '../../../../Common/LocalStorage'
import {ApiExtract} from '../../../../Common/GetDatas'
import BootstrapTable from '../../../../Component/Table/BootstrapCustomTablePr'
import {GetPrSave,GetFFSave, GetFFDto,  GetPrDto, GetFreeFormSave} from '../../../../Actions/Common'
import {SavePurchaseRequest, GetDeliveryAddress, VoidPR} from '../../../../Apis/RequesterServices'
import {FFPoAddress, FFPOSubmit, VendorDetailMethod} from '../../../../Apis/Approver'
import FreeForm from '../../FreeForm'
import {CheckFileDetails} from '../../../../Actions/Common/Functions'
import {GetVendorDetailMethod} from '../../../../Actions/Approver'

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
        this.SelecthandleChange = this.SelecthandleChange.bind(this)
        this.handlepopformsubmit = this.handlepopformsubmit.bind(this)
        this.state = {
            table_body :  [],
            table_model_header : [
                {name : "Description", id:"description", key:true},
                {name : "Code", id:"code"},
            ],
            product_list : [],
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
            Urgent:0,
            nc_type:"nc",
            address : '',
            lblPONo : '',
            save_item_details:'',
            POM_DETAILS : {},
            POD_DETAILS : {},
            CUSTOM_FILED : {},
            CUSSTOM_FILED_DETAILS : {},
            COMPANY_DOC_ATTACHMENT : {},
            shipping_charge : 0,
            submit_type : '',
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            address_set:false,
            default_dl_address : '',
            billing_method : 'GRN',
            billing_render: false,
            billing_type_update: false,
            vendorID:'',
            budget_details : {},
            diable_payment:true,
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

    handleSelectChange = async (value) =>{
        this.setState({loading:true})
        let _final_datas = {strCode: value}
        let _status =  await ApiExtract(FFPoAddress, _final_datas)
        if(_status){
          
          if(_status.response && _status.response.address && _status.response.address.length > 0){
            let _temp_adress = _status.response.address[0]
           
            
            _temp_adress.BillAddrCode = value
            this.props.change('raisePOForm.BillAddrLine1', _temp_adress.AM_ADDR_LINE1)
            this.props.change('raisePOForm.BillAddrLine2', _temp_adress.AM_ADDR_LINE2)
            this.props.change('raisePOForm.BillAddrLine3', _temp_adress.AM_ADDR_LINE3)
            this.props.change('raisePOForm.BillAddrCity', _temp_adress.AM_CITY)
            this.props.change('raisePOForm.BillAddrState', _temp_adress.STATE)
            this.props.change('raisePOForm.BillAddrCountry', _temp_adress.COUNTRY)
            this.props.change('raisePOForm.BillAddrPostCode', _temp_adress.AM_POSTCODE)
           
            this.setState({
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
                this.setState({
                    product_list : _get_selected_items,
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

                this.setState({
                    product_list : _get_selected_items,
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

                this.setState({
                    product_list : _get_selected_items,
                })
            }
          
        }
       
       
    }

    select_all_tabel_index = (element) =>{
        let get_details = this.state.table_body
        if(element.target && element.target.checked){
            let _details = []
            get_details.forEach((list, index)=>{
                let _pro_code = (list.PRODUCTCODE) ? list.PRODUCTCODE : index
                _details.push(`${index}`)
            })
            this.setState({
                slected_items : _details,
                select_all : true
            })
        }
        else{
            this.setState({ slected_items :[], select_all:false })
        }
    }

    static async getDerivedStateFromProps (nextProps, prevState){
        let _details_main = prevState
       if((!prevState.rendered) && nextProps.location && nextProps.location.datas && nextProps.location.datas.productList && prevState.table_body && nextProps.purchased_items &&  nextProps.purchased_items.getPurchaseRequestItemsDetails && prevState.table_body.length != nextProps.purchased_items.getPurchaseRequestItemsDetails){
            _details_main.rendered = true;
            _details_main.redate =  true;
            _details_main.slected_items = []
            _details_main.table_body = nextProps.purchased_items.getPurchaseRequestItemsDetails
            await _details_main.table_body.forEach((list_details, index)=>{
                _details_main.table_body[index] = Object.assign(list_details, prevState.product_list[index])
               
            })
            _details_main.table_body = await _details_main.table_body.map((list_details, sub_index)=>{
                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_CODE===prevState.default_dl_address})
                    if(_default_address.length){
                        list_details.PRODUCTCODE = sub_index
                        list_details.MPQ  = 1
                        list_details.Segmentation  = 'Standard Material'
                        list_details.Test  = '10'
                        list_details.deliveryAddress  = _default_address[0].Address
                        return list_details
                    }
                }
                return list_details
            })
            return _details_main
        }

        if((!prevState.rendered) && nextProps.location && nextProps.location.datas && (!nextProps.location.datas.productList) && prevState.table_body && nextProps.purchased_items &&  nextProps.purchased_items.getPurchaseRequestItemsDetails && prevState.table_body.length != nextProps.purchased_items.getPurchaseRequestItemsDetails){
            _details_main.rendered = true;
            _details_main.rerenderd =  true;
            _details_main.redate =  true;
           
            _details_main.slected_items = []
            _details_main.table_body = (nextProps.purchased_items.getPurchaseRequestItemsDetails[1]) ? nextProps.purchased_items.getPurchaseRequestItemsDetails[1] : []
            await _details_main.table_body.forEach((list_details, index)=>{
                _details_main.table_body[index] = Object.assign(list_details, prevState.product_list[index])
            })
            _details_main.internal_attachment = (nextProps.purchased_items.companyDocAttachments) ? nextProps.purchased_items.companyDocAttachments : []
            _details_main.extrnal_attachment = (nextProps.purchased_items.companyDocAttachments) ? nextProps.purchased_items.companyDocAttachments : []
            return _details_main
        }


        if((!prevState.rendered) && prevState.save_item_details && (!prevState.save_item_details.productList) && prevState.table_body && nextProps.purchased_items &&  nextProps.po_details.allInfo && prevState.table_body.length != nextProps.po_details.allInfo){
            _details_main.rendered = true;
            _details_main.rerenderd =  true;
            _details_main.redate =  false;
            _details_main.lblPONo = prevState.lblPONo;
            _details_main.slected_items = []
            _details_main.table_body = (nextProps.po_details.allInfo && nextProps.po_details.allInfo.POD_DETAILS) ? nextProps.po_details.allInfo.POD_DETAILS: []
            _details_main.internal_attachment = (nextProps.po_details.allInfo && nextProps.po_details.allInfo.POD_DETAILS) ? nextProps.po_details.allInfo.COMPANY_DOC_ATTACHMENT : []
            _details_main.extrnal_attachment = (nextProps.po_details.allInfo && nextProps.po_details.allInfo.POD_DETAILS) ? nextProps.po_details.allInfo.COMPANY_DOC_ATTACHMENT : []
            return _details_main
        }

         if(prevState.table_body && nextProps.pri_popup &&  nextProps.pri_popup.getPurchaseRequestItemsDetails && (!prevState.popup) && (!nextProps.pri_popup_details.status)){
            let _details = prevState.table_body
            let _pre_defined_date = {
                itemList : []
            }
            if(_details && _details.length){
                nextProps.pri_popup.getPurchaseRequestItemsDetails.map((list,index)=>{
                   
                     _details.push(list)
                })
            }
            else{
                _details = nextProps.pri_popup.getPurchaseRequestItemsDetails
            }
            _details_main.slected_items = []
            _details_main.popup =  true 
            _details_main.table_body = _details
            _details_main.redate =  true;
            await _details_main.table_body.forEach((list_details, index)=>{
                _details_main.table_body[index] = Object.assign(list_details, prevState.product_list[index])
            })
            _details_main.table_body = await _details_main.table_body.map((list_details, index)=>{
             
                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_CODE===prevState.default_dl_address})
                    if(_default_address.length){
                        let _tem_details = list_details
                        _tem_details.PRODUCTCODE =  index
                        list_details.MPQ  = 1
                        _tem_details.PRODUCTDESC = (_tem_details.PRODUCTDESC) ? _tem_details.PRODUCTDESC : index
                        _tem_details.Segmentation  = (_tem_details.Segmentation) ? _tem_details.Segmentation :  'Standard Material'
                        _tem_details.Test  = (_tem_details.Test) ? _tem_details.Test :  '10'
                        _tem_details.deliveryAddress  =  (_tem_details.deliveryAddress) ? _tem_details.deliveryAddress : _default_address[0].Address
                        return list_details
                    }
                }
                return list_details
            })
            return _details_main
        }

        if(prevState.table_body && nextProps.nc_popup &&  nextProps.nc_popup.getPurchaseRequestItemsDetails && (!prevState.nc_popup) && (!nextProps.pri_ncpopup_details.status)){
            let _details = prevState.table_body
            let _index_details = 0
            let _pre_defined_date = {
                itemList : []
            }
            if(_details && _details.length){
                nextProps.nc_popup.getPurchaseRequestItemsDetails.map((list,index)=>{
                     _details.push(list)
                })
            }
            else{
                _details = nextProps.nc_popup.getPurchaseRequestItemsDetails
            }
            _details_main.slected_items = []
            _details_main.nc_popup =  true 
            _details_main.table_body = _details
            _details_main.redate =  true;

            await _details_main.table_body.forEach((list_details, index)=>{
                if(list_details.PRODUCTDESC){
                    _details_main.table_body[index] = list_details
                    
                }
                else{
                    _details_main.table_body[index] = Object.assign(list_details, prevState.product_list[_index_details])
                    _index_details =  _index_details+1
                }
            })
            _details_main.table_body = await _details_main.table_body.map((list_details, sub_index)=>{
                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_CODE===prevState.default_dl_address})
                    if(_default_address.length){
                        nextProps.change(`itemList.${sub_index}.${sub_index}.PRODUCTDESC`, (list_details.PRODUCTDESC) ? list_details.PRODUCTDESC :list_details.ITEM_DESC)
                        list_details.PRODUCTCODE = sub_index
                        list_details.PRODUCTDESC = (list_details.PRODUCTDESC) ? list_details.PRODUCTDESC :list_details.ITEM_DESC;
                        list_details.Segmentation  = ( list_details.Segmentation) ?  list_details.Segmentation : 'Standard Material'
                        list_details.Test  = '10'
                        list_details.MPQ  = 1
                        
                        list_details.deliveryAddress = _default_address[0].Address
                        return list_details
                    }
                }
                return list_details
            })
            return _details_main
        }

        if(prevState.internal_delete &&  (!prevState.external_delete) &&  nextProps.file_delete && nextProps.file_delete.responseList && nextProps.file_delete.responseList.displayAttachFile && nextProps.file_delete.responseList.displayAttachFile){
           _details_main.internal_attachment = nextProps.file_delete.responseList.displayAttachFile;
           return _details_main
        }

        if(prevState.internal_upload &&  (!prevState.external_upload) && nextProps.upload_document && nextProps.upload_document.responseList && nextProps.upload_document.responseList.displayAttachFile && nextProps.upload_document.responseList.displayAttachFile){
           _details_main.internal_attachment = nextProps.upload_document.responseList.displayAttachFile;
           return _details_main
        }

        if(prevState.external_delete &&  (!prevState.internal_delete) && nextProps.external_delete.responseList && nextProps.external_delete.responseList.displayAttachFile && nextProps.external_delete.responseList.displayAttachFile){
            _details_main.extrnal_attachment = nextProps.external_delete.responseList.displayAttachFile;
           return _details_main
        }

        if(prevState.external_upload &&  (!prevState.internal_upload)  && nextProps.file_upload_external && nextProps.file_upload_external.responseList && nextProps.file_upload_external.responseList.displayAttachFile && nextProps.file_upload_external.responseList.displayAttachFile){
         
            _details_main.extrnal_attachment = nextProps.file_upload_external.responseList.displayAttachFile;
           return _details_main
        }

      
        return nextProps, prevState;
    }

    async componentDidMount(){
    

        this.setState({
            loading:true
        })
        let _status =  await ApiExtract(GetDeliveryAddress, [])
        if(_status){
            if(_status.status){
                this.setState({
                    default_dl_address : _status.response
                })
            }
        }
        this.setState({
            loading:false
        })

        if(localStorage.getItem('free_from')){
            let _details = JSON.parse(localStorage.getItem('free_from'))
            this.setState({
                save_item_details : _details,
            })
            this.props.GetApppoDetails({PO_NO : _details.POM_PO_NO, index : _details.POM_PO_INDEX});
        }
 

        if(this.props.location && this.props.location.datas && this.props.location.datas=="from_approval"){
             window.location.reload()   
        }
        
       

        this.props.FundTypeOrPersonCode({ type: "L1" })
        this.props.FundTypeOrPersonCode({ type: "L8" })
        this.props.FundTypeOrPersonCode({ type: "L9" })
        this.props.FillAddress()
        this.props.DeliveryAddress()
        this.props.CostCentreCode()
        this.props.SegmentationAction()
        this.props.get_fill_address()
        this.props.cl_code_access()
        this.props.change('raisePOForm.PrintCustom',true)
        this.props.change('raisePOForm.PrintRemark',true)
        this.props.change('raisePOForm.Date',new Date())
        this.props.change('raisePOForm.CurrencyCode','MYR')
        this.props.change('raisePOForm.PaymentType','Cheque')
        this.props.change('raisePOForm.ShipmentMode','Not Applicable')
        this.props.change('raisePOForm.ShipmentTerm','Not Applicable')
        this.props.change('raisePOForm.BillAddrCountry','MY')
        this.props.change('raisePOForm.PaymentTerm','30 Days')
        this.props.free_form_details();
        this.props.GetFillTax()
        
    }

    closeModel (details){
        this.setState({
            addmodel : false,
            validation:false
        })
        if(this.state.submit_type && this.state.status){
            window.location.reload()
        }

        if(this.state.submit_type=="exceeds"){
            
            let _details = this.state.budget_details
            _details.page="raiseFFPO"
            _details.amount = (this.state.table_body && this.state.table_body.length>0) ? this.state.table_body.reduce((a, val) => a += (((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST) ? val.UNITCOST : 0)) + ((val.GST) ? val.GST : 0) + parseFloat(this.state.shipping_charge), 0) : 0
            this.props.history.push({
                pathname:'/budget_check',
                data : _details
            })
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


    componentDidUpdate(){
        if(!this.state.rerenderd && !this.state.address_set && this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.billTo){
            let _main_details =  (this.props.po_details.allInfo) ? this.props.po_details.allInfo.POM_DETAILS : [];
            let _sub_details = (_main_details && _main_details.length>0 && _main_details[0]) ? _main_details[0] : {};
            if(_sub_details && _sub_details.POM_B_ADDR_CODE){
              
            }
            else{
                let _details = (this.props.fill_address && this.props.fill_address.dsBilling && this.props.fill_address.dsBilling.length>0) ? this.props.fill_address.dsBilling[0] : {}
                if(_details){

                    this.props.change('raisePOForm.BillTo', _details.AM_ADDR_CODE);
                    this.props.change('raisePOForm.BillAddrLine1', _details.AM_ADDR_LINE1)
                    this.props.change('raisePOForm.BillAddrLine2', _details.AM_ADDR_LINE2)
                    this.props.change('raisePOForm.BillAddrLine3', _details.AM_ADDR_LINE3)
                    this.props.change('raisePOForm.BillAddrCity', _details.AM_CITY)
                    this.props.change('raisePOForm.BillAddrState', _details.STATE)
                    this.props.change('raisePOForm.BillAddrCountry', _details.COUNTRY)
                    this.props.change('raisePOForm.BillAddrPostCode', _details.AM_POSTCODE)
                    this.setState({
                        address : {BillAddrCode:_details.AM_ADDR_CODE},
                        address_set : true,
                    })
                }
            }
            
            
        }


        if(this.state.rerenderd && this.props.cost_centre_code && this.props.cost_centre_code.length){
            let _temp_dates = new Array()
            let _pr_numner = '';
            let _table_body = [];
          

            if(localStorage.getItem('free_from') && this.props.po_details && this.props.po_details.allInfo){
               
                  let _main_details = (this.props.po_details.allInfo) ? this.props.po_details.allInfo.POM_DETAILS : [];
                  let _item_list= this.state.table_body
                  let _item_details =  (this.props.po_details.allInfo) ? this.props.po_details.allInfo.POD_DETAILS : [];
                  let _custom_field =  (this.props.po_details.allInfo) ? this.props.po_details.allInfo.CUSTOM_FILED : [];
                  let _custom_field_details  = (this.props.po_details.allInfo) ? this.props.po_details.allInfo.CUSSTOM_FILED_DETAILS : [];
                  
                  let _details = (_main_details && _main_details[0]) ? _main_details[0] : {};
                  let _temp_array = new Array();
                  let _user_details = {
                      prNo : _details.POM_PO_NO,
                      Vendor : _details.POM_S_COY_ID,
                      vendorID: _details.POM_S_COY_ID,
                      vendorName: _details.POM_S_COY_NAME,
                      CurrencyCode : _details.POM_CURRENCY_CODE,
                      PaymentTerm : _details.POM_PAYMENT_TERM,
                      PaymentType : _details.POM_PAYMENT_METHOD,
                      ShipmentTerm : _details.POM_SHIPMENT_TERM,
                      ShipmentMode : _details.POM_SHIPMENT_MODE,
                      ShipVia : _details.POM_SHIP_VIA,
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
                      Urgent : (_details.PRM_URGENT=="1") ? true : false,
                      PrintCustom : 1,
                      PrintRemark : 1,
                  }
                  

                  _pr_numner = _user_details.prNo;
                  _item_details.forEach((item_details, index)=>{
                    _temp_dates.push(addDate(new Date(), item_details.ETD))
                    let delivery = [index];
                    let _build_array = new Object()
                    _build_array = {
                        [delivery] : { 
                            "PRODUCTDESC" : item_details.PRODUCTDESC,
                            "GIFT":(item_details.POD_GIFT == 'Y' || item_details.POD_GIFT=='Yes') ? 'Y' : 'N',
                            "GST":item_details.GST,
                            "UNITCOST":item_details.UNITCOST,
                            "delivery" :addDate(new Date(), item_details.ETD),
                            "QUANTITY": item_details.QUANTITY,
                            'WarrantyTerms' : item_details.POD_WARRANTY_TERMS,
                            'Segmentation' : (item_details.PCD_FIELD_VALUE) ? item_details.PCD_FIELD_VALUE.replace('_', '') : '',
                            'ETD' : item_details.POD_ETD,
                            'MPQ' : '1',
                            'GSTRate_FF' : item_details.GSTRate,
                            'GSTRate_FF_SST' : item_details.GSTRate,
                            'Remarks' : item_details.POD_REMARK
                        }
                       
                    }

                    let _custom_master_details = _custom_field_details.filter((list_cms,index_details)=>{
                        return  list_cms.PCD_PR_LINE == (index+1)
                    })
                    if(_custom_master_details.length>0){
                        _custom_master_details.forEach((list_cust,index)=>{
                            let _temp_details = _custom_field.filter((list,index)=>list.PCM_FIELD_NO == list_cust.PCD_FIELD_NO)
                            if(_temp_details.length){
                                _build_array[delivery][_temp_details[0].PCM_FIELD_NAME] = list_cust.PCD_FIELD_VALUE;
    
                            }
                        })
                    }
                
                    _temp_array.push(_build_array)
                  })

                  let _main_object = {
                      raisePOForm : Object.assign({}, _details, _user_details),
                      itemList : _temp_array
                  }

                 
        

                 

                  if(_item_list && _item_list.length){
                    _item_list.forEach((list,index)=>{
                            let cost_center_code = (this.props.cost_centre_code && this.props.cost_centre_code.length>0) ? this.props.cost_centre_code.filter((list_details)=> list_details.AM_ACCT_CODE == list.costCentre) : []
                            let temp_data = {}
                            let _item_details = {}
                          
                            temp_data.deliveryAddress= (temp_data.deliveryAddress) ?  temp_data.deliveryAddress  : list.PRD_D_ADDR_LINE1+' '+list.PRD_D_ADDR_LINE2+' '+list.PRD_D_ADDR_LINE3
                            temp_data.costCentre = (temp_data.costCentre) ?  temp_data.costCentre : list.AM_ACCT_DESC+':'+list.costCentre
                            temp_data.prdAcctIndex = (temp_data.prdAcctIndex) ? temp_data.prdAcctIndex : list.ACCT ;
                            temp_data.ACCT = list.ACCT;
                            temp_data.POD_ACCT_INDEX = list.ACCT;
                            temp_data.COUNTRY = (temp_data.COUNTRY) ? temp_data.COUNTRY :  list.PRD_D_COUNTRY;
                            temp_data.AM_ADDR_CODE = (temp_data.AM_ADDR_CODE) ? temp_data.AM_ADDR_CODE :  list.DADDRCODE;
                            temp_data.AM_ADDR_LINE1 = (temp_data.AM_ADDR_LINE1) ? temp_data.AM_ADDR_LINE1 : list.PRD_D_ADDR_LINE1
                            temp_data.AM_ADDR_LINE2 = (temp_data.AM_ADDR_LINE2) ? temp_data.AM_ADDR_LINE2 : list.PRD_D_ADDR_LINE2
                            temp_data.AM_ADDR_LINE3 = (temp_data.AM_ADDR_LINE3) ? temp_data.AM_ADDR_LINE3 : list.PRD_D_ADDR_LINE3
                            temp_data.AM_CITY =  (temp_data.AM_CITY) ? temp_data.AM_CITY :  list.PRD_D_CITY
                            temp_data.AM_STATE =  (temp_data.AM_STATE) ? list.PRD_D_STATE  :  list.PRD_D_CITY
                            temp_data.AM_COUNTRY = (temp_data.AM_COUNTRY) ?  list.PRD_D_COUNTRY  :  list.PRD_D_CITY
                            temp_data.AM_POSTCODE = (temp_data.AM_POSTCODE) ? temp_data.AM_POSTCODE : list.PRD_D_POSTCODE
                            temp_data.Remarks = (temp_data.Remarks) ? temp_data.Remarks : list.REMARK;
                            temp_data.REMARKS = (temp_data.REMARKS) ? temp_data.REMARKS : list.REMARK;
                            temp_data.GIFT = (list.POD_GIFT=='Y' || list.POD_GIFT=='Yes') ? 'Y' : 'N' ;
                            temp_data.GST_RATE = list.GST_RATE
                            temp_data.GSTRate_FF = list.GSTRate
                            temp_data.GSTRate_FF_SST = list.GSTRate
                            temp_data.MPQ = 1
                            _item_details = Object.assign({} , list ,  temp_data);
                            _item_details.PRODUCTCODE =  index;
                            if(cost_center_code && cost_center_code.length > 0){
                                _item_details.ACCT = cost_center_code[0].AM_ACCT_INDEX;
                                _item_details.costCentre = cost_center_code[0].CDM_DEPT_CODE+'-'+cost_center_code[0].AM_ACCT_DESC+':'+cost_center_code[0].AM_ACCT_CODE;
                            }
                            _item_details.AMOUNT = parseFloat(_item_details.UNITCOST)  * parseFloat(_item_details.QUANTITY) 
                           
                            let _custom_master_details = _custom_field_details.filter((list_cms,index_details)=>{
                                return  list_cms.PCD_PR_LINE == (index+1)
                            })
                            if(_custom_master_details.length>0){
                                _custom_master_details.forEach((list_cust,index)=>{
                                    let _temp_details = _custom_field.filter((list,index)=>list.PCM_FIELD_NO == list_cust.PCD_FIELD_NO)
                                    if(_temp_details.length){
                                        _item_details[_temp_details[0].PCM_FIELD_NAME] = list_cust.PCD_FIELD_VALUE;
                                    }
                                })
                            }

                            _table_body.push(_item_details)
                            

                    })
                    this.props.initialize(_main_object)
                    this.setState({
                        rerenderd:false,
                        Urgent:(_details && _details.POM_URGENT=="1") ? true : false,
                        strPrNO : _pr_numner,
                        table_body : _table_body
                    })
                  }

                  
                  this.props.initialize(_main_object)
                  this.setState({
                    dates : [],
                    rerenderd:false,
                    Urgent:(_details && _details.POM_URGENT=="1") ? true : false,
                    strPrNO : _pr_numner,
                    lblPONo : _pr_numner,
                    table_body : _table_body,
                    shipping_charge : (_details && _details.POM_SHIP_AMT) ? _details.POM_SHIP_AMT : 0,
                    address : {BillAddrCode : _user_details.BillTo},
                    vendorID : _details.POM_S_COY_ID
                })
            } 
            else {
               
            }
            
        }

        if(this.state.redate){
            if(this.state.table_body && this.state.table_body.length){
                
                 let details = 0
                 let {dates} = this.state
                 let _temp_date = new Array();
                 let _custom_field =  (this.props.po_details.allInfo) ? this.props.po_details.allInfo.CUSTOM_FILED : [];
                 let _custom_field_details  = (this.props.po_details.allInfo) ? this.props.po_details.allInfo.CUSSTOM_FILED_DETAILS : [];
                 let _temp_values  = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
                 if(_temp_values){
                     _temp_values = _temp_values.itemList
                 }
                 _temp_values = (_temp_values && _temp_values.length) ? _temp_values.length : 0
 
 
                 this.state.table_body.forEach(async (item_details, index)=>{
                    
                     if(index >= _temp_values && item_details.removed !== 1){
                         dates[index] =  new Date((new Date()).valueOf() + 1000*3600*24);
                         let _new_date = new Date((new Date()).valueOf() + 1000*3600*24);
                         let _delivery = (item_details.PRODUCTCODE) ? 'itemList.'+index+'.'+item_details.PRODUCTCODE+'.delivery' :  'itemList.'+index+'.'+index+'.delivery';
                         let _qty = (item_details.PRODUCTCODE) ? 'itemList.'+index+'.'+item_details.PRODUCTCODE+'.QUANTITY' :  'itemList.'+index+'.'+index+'.QUANTITY';
                         
                         await this.props.change(_delivery, _new_date);
                         await this.props.change(_qty, (item_details.QUANTITY) ? item_details.QUANTITY : '0.00');
                     }
                    
                     
                 })
 
                 if(dates && dates.length){
                     this.setState({
                         dates :dates
                     })
                 }
 
             }
             this.setState({
                 redate:false,
                
            })
        }

        if(!this.state.billing_render && this.state.vendorID){
            this.props.GetVendorDetailMethod({
                strVendor : this.state.vendorID
            })
            this.setState({
                billing_render : true
            })
        }

        if(!this.state.billing_type_update && this.props.VendorDetail.length>0){
            this.setState({
                billing_type_update : true,
                billing_method : (this.props.VendorDetail && this.props.VendorDetail.length>0) ? this.props.VendorDetail[0].CV_BILLING_METHOD : 'GRN'
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
                        table_element_value['QUANTITY'] = (event.target.value) ? parseFloat(event.target.value)  : ''
                        table_element_value[id] = _value
                    }

                    if(event.target.value && event.target.value.length <= 6){
                        let _value = event.target.value;
                        table_element_value['AMOUNT']  =  (event.target.value) ? event.target.value * parseFloat(table_element_value['UNITCOST']) : table_element_value['UNITCOST']
                        table_element_value['QUANTITY'] = (event.target.value) ? parseFloat(event.target.value)  : ''
                        table_element_value[id] = _value
                    }
                    
                    else if(event.target.value == 0){
                        let _value = (event.target.value) ? event.target.value.slice(0,5) : '';                    
                        table_element_value['AMOUNT']  =  0
                        table_element_value['QUANTITY'] = 0
                        table_element_value[id] = _value
                    }
                    
                }
                if(_qty_input == "WarrantyTerms"){
                    table_element_value['WarrantyTerms'] = event.target.value
                    table_element_value['WARRANTYTERMS'] = event.target.value
                }

                if(_qty_input == "WARRANTYTERMS"){
                    table_element_value['WarrantyTerms'] = event.target.value
                    table_element_value['WARRANTYTERMS'] = event.target.value
                    
                }

                
                if(_qty_input == "Remarks"){
                    table_element_value['Remarks'] = event.target.value
                }
                if(_qty_input == "PRODUCTDESC"){
                    table_element_value['PRODUCTDESC'] = event.target.value
                }
                
                if(_qty_input == "UNITCOST"){
                    table_element_value['UNITCOST'] = event.target.value
                    table_element_value['AMOUNT'] = (event.target.value) ? event.target.value * parseFloat(table_element_value['QUANTITY']) : table_element_value['QUANTITY']
                }
                if(_qty_input == "GST"){
                    table_element_value['GST'] = parseFloat((event.target.value) ? event.target.value : 0)
                }
                if(_qty_input == "GIFT"){
                    table_element_value['GIFT'] = event.target.value
                }
                if(_qty_input == "Segmentation"){
                  
                    table_element_value['Segmentation'] = event.target.value
                    table_element_value['segmentation'] = event.target.value
                    table_element_value['PCD_FIELD_VALUE'] = event.target.value
                }

                if(_qty_input == "segmentation"){
                    table_element_value['Segmentation'] = event.target.value
                    table_element_value['segmentation'] = event.target.value
                    table_element_value['PCD_FIELD_VALUE'] = event.target.value
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

    async SelecthandleChange  (name, e){
        let _table_body = this.state.table_body
        console.log('table_body_sel', _table_body, name)
        let  _details  = e.target.name;
        let  _value  = e.target.value;
        let  _value_target   = e.target
        if(_details && _value){
            let _details_name =  _details.split('.')
            let _id  = _details_name[1]
            let  _qty_input = _details_name[3];

            if(_qty_input=='GIFT'){
                _table_body[name].GIFT = _value
            }

            if(this.props.gl_code && this.props.gl_code.dvwCus){
                this.props.gl_code.dvwCus.forEach((list_main, details)=>{
                    if(list_main.CF_FIELD_NAME==_qty_input){
                        _table_body[name][list_main.CF_FIELD_NAME] = _value
                    }
                })
            }


            if(_qty_input == "Segmentation"){
                _table_body[name].Segmentation = _value
                _table_body[name].segmentation = _value
                _table_body[name].PCD_FIELD_VALUE = _value
            }

            if(_qty_input == "segmentation"){
                _table_body[name].Segmentation = _value
                _table_body[name].segmentation = _value
                _table_body[name].PCD_FIELD_VALUE = _value
            }

            if(_qty_input == "GSTRate_FF"){
               
                _table_body[name].Segmentation = _value
                _table_body[name].segmentation = _value
                _table_body[name].PCD_FIELD_VALUE = _value
                _table_body[name].GSTRate_FF =  (_value_target.options[_value_target.selectedIndex].value!='N/A') ? _value_target.options[_value_target.selectedIndex].value : 0;
                _table_body[name].GSTRate_FF_SST =  (_value_target.options[_value_target.selectedIndex].value!='N/A') ? _value_target.options[_value_target.selectedIndex].value : 0;
                
                _table_body[name].GSTRATE =  (_value_target.options[_value_target.selectedIndex].value!='N/A') ? _value_target.options[_value_target.selectedIndex].value : 0;
                _table_body[name].GSTRate =  (_value_target.options[_value_target.selectedIndex].value!='N/A') ? _value_target.options[_value_target.selectedIndex].value : 0;
                _table_body[name].GST =  (_value_target.options[_value_target.selectedIndex].value!='N/A') ? _value_target.options[_value_target.selectedIndex].value : 0;
                _table_body[name].gst = (_value_target.options[_value_target.selectedIndex].value!='N/A') ? _value_target.options[_value_target.selectedIndex].value : 0;
            
                _table_body[name].Tax = _value_target.options[_value_target.selectedIndex].text;
                _table_body[name].GstTaxCode = _value_target.options[_value_target.selectedIndex].text;
                _table_body[name].GSTRateDesc = _value_target.options[_value_target.selectedIndex].text;
                _table_body[name].RRDT_GST =  (_value_target.options[_value_target.selectedIndex].value!='N/A') ? _value_target.options[_value_target.selectedIndex].value : 0;
            }
        }
        this.setState({
            table_body : _table_body
        })

    }

    async handlefiltersubmit_1(values){


        let _main_values   =    this.props.request_form;
        let _custom_filed_details = [];
        let _submit_details  =  (values.submit_type) ? values.submit_type : '';
        let _table_total = (this.state.table_body && this.state.table_body.length>0) ? this.state.table_body.reduce((a, val) => a += ((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST) ? val.UNITCOST : 0) , 0) : 0;
        let _table_sst = (this.state.table_body && this.state.table_body.length>0) ? this.state.table_body.reduce((a, val) => a += (val.GST) ? (val.QUANTITY * val.UNITCOST) * (val.GST/100) : 0 , 0).toFixed(2) : 0

      
        if(values && values.submit_type=="submit"){
            let _form_vales = values.prDto;
        }
        else{
            values = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
        }
        
        if(!values.itemList){
            values = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
        }

        let _table_body = this.state.table_body
        let _temp_details = values.itemList
        let _temp_holder = new Array();

       let _values = _table_body.forEach((list,index)=>{
            if(!list.hasOwnProperty('removed')){
                if (values && values.itemList && values.itemList[index]){
                    _temp_holder.push(values.itemList[index])
                }
            }
        })

        if(_temp_holder && _temp_holder.length){
            if(_temp_holder.length > 0){
                values.itemList = _temp_holder
            }
        }


    
        let _itemList =  values.itemList;
        let _validate_data = await this.saveItem(values);
        let _GetPrSave = GetFFSave();
        let _GetPrDto = GetFFDto();
        let _empty_details = new Array()
        if(_validate_data){
            if(_table_body.length>0){
                let _main_form_data =  values.raisePOForm;
                
                _main_form_data.Urgent = (this.state.Urgent==1) ? 1 : 0;
                _main_form_data.PrintCustom = (_main_form_data.PrintCustom) ? "1" : "0";
                _main_form_data.PrintRemark = (_main_form_data.PrintRemark) ? "1" : "0";
                _main_form_data.ExchangeRate = "1.0"
                _main_form_data.Date = (_main_form_data.Date) ?  (_main_form_data.Date) : TodayDateSalash(new Date())
                let _details = Object.assign({},_GetPrSave , _main_form_data)
                _details.prType = (this.props.location && this.props.location.datas && this.props.location.datas.strType && this.props.location.datas.strType=="bc") ?  'bc': 'cc' ;
                let _address_details = this.props.fill_address;
                let temp_object = {}
                temp_object.prNo = (this.state.pr_value) ? this.state.pr_value : this.state.strPrNO;
                temp_object.BillingMethod = this.state.billing_method;

                temp_object.BillAddrCode = (this.state.address && this.state.address.BillAddrCode) ? this.state.address.BillAddrCode : 0
                let _listed_address = (this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.billTo) ? this.props.gl_code.FFRaisePO.billTo : {}
                if( _listed_address && _listed_address.length){
                    let _temp_address = _listed_address.filter((list)=>{return  list.AM_ADDR_CODE == temp_object.BillAddrCode})
                    if(_temp_address && _temp_address.length<=0){
                        this.setState({
                            status: false,
                            validation:true,
                            modal_body: `Your default billing Address ${temp_object.BillAddrCode} is inactive. Choose billing address`,
                            loading:false,
                        })
                        return false
                    }
                }
                if(_address_details.dsBilling){
                    let {dsBilling}  = _address_details
                    if(dsBilling.length){
                        dsBilling = dsBilling[0]
                    }

                    temp_object.POCost =  parseFloat(_table_total) + parseFloat(_table_sst) + parseFloat(this.state.shipping_charge);
                    temp_object.Urgent = (this.state.Urgent) ? 1 : 0;
                    temp_object.POM_URGENT  = (this.state.Urgent) ? 1 : 0;
                    temp_object.AM_ADDR_CODE = dsBilling.AM_ADDR_CODE;
                    temp_object.AM_ADDR_LINE1 = dsBilling.AM_ADDR_LINE1;
                    temp_object.AM_ADDR_LINE2 = dsBilling.AM_ADDR_LINE2;
                    temp_object.AM_ADDR_LINE3 = dsBilling.AM_ADDR_LINE3;
                    temp_object.AM_POSTCODE = dsBilling.AM_POSTCODE;
                    temp_object.AM_STATE = dsBilling.AM_STATE;
                    temp_object.AM_CITY = dsBilling.AM_CITY;
                    temp_object.AM_COUNTRY = dsBilling.AM_COUNTRY;
                }
                else{
                    this.setState({
                        status: false,
                        validation:true,
                        modal_body: 'Please setup default billing address',
                        loading:false,
                    })
                    return false
                }
                _details = Object.assign({},_details , temp_object)
                _details.pr_cost = this.state.table_body.reduce((a, val) => a += (val.QUANTITY * val.UNITCOST) + val.GST, 0);
                _details.lblPONo = (this.state.lblPONo) ? this.state.lblPONo :'';
                _details.VendorID = _details.Vendor
                _details.ShipAmt = this.state.shipping_charge
                console.log('_details', _details)

                let _custom_field = []
            
                if(_itemList){
                    let _matched_id = 0;
                    await _itemList.forEach((list_sub_item, index)=>{
                        _matched_id += 1
                        // list_sub_item.forEach((list, index)=>{
                            let _item_main_index= index+1
                            let list = (list_sub_item[0]) ? list_sub_item[0] : {};
                            index = list_sub_item[0];
                            if(list_sub_item){
                                let _temp_details = Object.keys(list_sub_item)
                                if(_temp_details.length){
                                    list =  list_sub_item[_temp_details[0]]
                                    index = _temp_details[0]
                                }

                            }

                            
                            _table_body = _table_body.filter((list)=>{return  list.removed !== 1})
                            for (var i=0;i<_table_body.length; i++) {
                                if (_table_body[i].PRODUCTCODE == index && _table_body[i].PRODUCTCODE == index) {
                                    // _prev_code = _table_body[i].PRODUCTCODE;
                                    for(let list_items in list) {
                                        if(_table_body[i][list_items]){
                                                _table_body[i][list_items] = list[list_items]
                                        }
                                        if(list_items=="delivery"){
                                            _table_body[i].delivery = list[list_items];
                                            _table_body[i].deliveryUIDate = new Date( _table_body[i].delivery)
                                        }
                                    }

                                    _table_body[i].PRODUCTDESC = (_table_body[i].PRODUCTDESC) ? _table_body[i].PRODUCTDESC :_table_body[i].ITEM_DESC;
                                    _table_body[i].reMarks = (_table_body[i].Remarks) ?  _table_body[i].Remarks : '';
                                    _table_body[i].REMARK =  (_table_body[i].Remarks) ?  _table_body[i].Remarks : '';
                                    _table_body[i].deliveryDate =  CalcDate(_table_body[i].delivery)
                                    _table_body[i].QUANTITY =  (_table_body[i].QUANTITY) ? parseFloat(_table_body[i].QUANTITY).toFixed(2) : 0
                                    _table_body[i].ETD =  CalcDate(_table_body[i].delivery)
                                    _table_body[i].PCD_PR_LINE = _item_main_index;
                                    _table_body[i].MPQ = 1;
                            
                               

                                    _table_body[i].ITEMLINE = _item_main_index;
                                    _table_body[i].GSTRATE = (_table_body[i].GSTRate) ?  _table_body[i].GSTRate : 0;
                                    _table_body[i].GST = (_table_body[i].GSTRATE) ?  _table_body[i].GSTRATE : 0;
                                    _table_body[i].GstTaxCode = (_table_body[i].GstTaxCode) ?  _table_body[i].GstTaxCode : 'N/A';
                                    _table_body[i].GST_RATE = (_table_body[i].GstTaxCode) ?  _table_body[i].GstTaxCode : 'N/A';
                                    
                                    _table_body[i].ACCT = _table_body[i].ACCT;
                                    _table_body[i].POD_ACCT_INDEX = _table_body[i].ACCT;
                                    _table_body[i].Segmentation =  (list['Segmentation']) ? list['Segmentation'] : "Standard Material"
                                    _table_body[i].warrentyTerms =  (list['WarrantyTerms']) ? list['WarrantyTerms'] : "1"
                                    if(!_table_body[i].AM_ADDR_CODE){
                                        let _default_address = this.props.delivery_address.filter((list)=>{return list.AM_ADDR_CODE===this.state.default_dl_address})
                                        if(_default_address.length){
                                            _default_address = _default_address[0];
                                            _table_body[i].AM_ADDR_CODE = _default_address.AM_ADDR_CODE;
                                            _table_body[i].AM_ADDR_LINE1 = _default_address.AM_ADDR_LINE1;
                                            _table_body[i].AM_ADDR_LINE2 = _default_address.AM_ADDR_LINE2;
                                            _table_body[i].AM_ADDR_LINE3 = _default_address.AM_ADDR_LINE3;
                                            _table_body[i].AM_POSTCODE = _default_address.AM_POSTCODE;
                                            _table_body[i].AM_STATE = _default_address.AM_STATE;
                                            _table_body[i].AM_CITY = _default_address.AM_CITY;
                                            _table_body[i].AM_COUNTRY = _default_address.AM_COUNTRY;
                                        }
                                    }
                                    _table_body[i].AMOUNT =  (this.props.location && this.props.location.datas && this.props.location.datas.strType && this.props.location.datas.strType=="bc") ?  0 : _table_body[i].AMOUNT 
                                    let _temp_details = Object.assign({},_GetPrDto , _table_body[i])
                                    _empty_details.push(_temp_details)
                                    
                                    if(this.props.gl_code && this.props.gl_code.dvwCus){
                                        this.props.gl_code.dvwCus.forEach((list_details)=>{
                                            if((_table_body[i] && _table_body[i]!==undefined) && _table_body[i].hasOwnProperty(list_details.CF_FIELD_NAME) ){
                                                console.log('list_details.CF_FIELD_NAME', list_details.CF_FIELD_NAME, _table_body[i][list_details.CF_FIELD_NAME])
                                                _custom_field.push({
                                                    "PCD_PR_INDEX": _item_main_index,
                                                    "PCD_PR_LINE" : _item_main_index,
                                                    "PCD_FIELD_NO": list_details.CF_FIELD_NO,
                                                    "PCD_FIELD_VALUE": _table_body[i][list_details.CF_FIELD_NAME]
                                                })
                                            }
                                            else if(list_details.CF_FIELD_NAME=="Segmentation"){
                                                _custom_field.push({
                                                    "PCD_PR_INDEX": _item_main_index,
                                                    "PCD_PR_LINE" : _item_main_index,
                                                    "PCD_FIELD_NO": list_details.CF_FIELD_NO,
                                                    "PCD_FIELD_VALUE": "Standard Material"
                                                })
                                            }
                                            else if(list_details.CF_FIELD_NAME=="Test"){
                                                _custom_field.push({
                                                    "PCD_PR_INDEX": _item_main_index,
                                                    "PCD_PR_LINE" : _item_main_index,
                                                    "PCD_FIELD_NO": list_details.CF_FIELD_NO,
                                                    "PCD_FIELD_VALUE": "10"
                                                })
                                            }
                                            else{
                                                
                                            }
                                            
                                        })
                                    }
                                }


                            }
                        // })
                        
                    })
                }

                console.log('_empty_details', _empty_details)

                _empty_details.forEach((sub_s_list, sub_s_index)=>{
                    _empty_details[sub_s_index].PRODUCTCODE = ''
                })
                
                let _seg_main = (this.props.gl_code && this.props.gl_code.dvwCus) ? this.props.gl_code.dvwCus.filter((list_details)=>list_details.CF_FIELD_NAME=='Segmentation') : []
                let _seg = [];
                if(_seg_main && _seg_main.length > 0){

                    _seg_main.forEach((list_main, details)=>{
                        _seg[details] = {
                            "PCD_PR_INDEX": list_main.CF_FIELD_INDEX,
                            "PCD_PR_LINE" : list_main.CF_FIELD_INDEX,
                            "PCD_FIELD_NO": (_seg_main && _seg_main.length>0) ? _seg_main[0].CF_FIELD_NO : 0,
                            "PCD_FIELD_VALUE" : list_main.FIELDVALUE
                        }
                    })
                    
                }

                if(this.props.gl_code && this.props.gl_code.dvwCus){
                    this.props.gl_code.dvwCus.map((list_details)=>{
                        _custom_filed_details.push({
                            PCD_FIELD_NO : list_details.CF_FIELD_NO,
                            PCD_FIELD_VALUE : list_details.CF_FIELD_NAME,
                        })
                    })
                }


             
                let _final_datas ={
                    "POCost":parseFloat(_table_total) + parseFloat(_table_sst) + parseFloat(this.state.shipping_charge),
                    "prIndex":this.state.prIndex,
                    "modeType":(this.state.lblPONo) ? 'mod' :'new',
                    "modePR": (this.state.lblPONo) ? 'po' :'',
                    "RFQ_Num":"",
                    "ListingFromRFQ":"false",
                    "btnType":values.submit_type,
                    POData : _details,
                    POitemDetails : _empty_details,
                    customFieldMstr : (_custom_filed_details) ? _custom_filed_details : {},
                    customFieldDetailsMstr : _seg,
                    
                }
                console.log('_final_datas', JSON.stringify(_final_datas))
                console.log('_customFieldDetailsMstr', JSON.stringify(_seg), JSON.stringify(_custom_field))

                
                let _temp_details = {}
                _temp_details.RFQPOSubmit = _final_datas;
                this.setState({
                    loading:true
                })

                let _status =  await ApiExtract(FFPOSubmit, _temp_details)
                if(_status.status){
                    if(_status.status && _submit_details=="submit"){
                        // if(!_status.response.isBudgetExceed){
                        //     let _loc_temp = localStorage.getItem('free_from')
                        //     if(_loc_temp){
                        //         _loc_temp = JSON.parse(_loc_temp)
                        //     }
                        //     else{
                        //         localStorage.setItem('free_from', JSON.stringify({viewState:'mod', strType:_details.prType, prid:_status.message,POM_PO_NO:_status.message,  POM_PO_INDEX : _status.response.insertId}))
                        //     }
                        //     this.setState({ submit_type : 'submit'})
                        //     this.props.history.push({
                        //         pathname:'/po_approval_setup_ffpo',
                        //         datas: {
                        //             'approval_list': _status.response.ApprovalSetup,
                        //             'pr_no':  _status.message,
                        //             'pr_cost': this.state.table_body.reduce((a, val) => a += ((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST) ? val.UNITCOST : 0) + ((val.GST) ? val.GST : 0), 0) + parseFloat(this.state.shipping_charge),
                        //         }
                        //     })
                        // }
                        // else{
                        //     let _loc_temp = localStorage.getItem('free_from')
                        //     if(_loc_temp){
                        //         _loc_temp = JSON.parse(_loc_temp)
                        //     }
                        //     else{
                        //         localStorage.setItem('free_from', JSON.stringify({viewState:'mod', strType:_details.prType, prid:_status.message,POM_PO_NO:_status.message,  POM_PO_INDEX : _status.response.insertId}))
                        //     }

                        //     this.setState({
                        //         budget_details : {
                        //             AM_ACCT_CODE: _status.response.AM_ACCT_CODE,
                        //             AM_ACCT_DESC:  _status.response.AM_ACCT_DESC,
                        //             AM_ACCT_INDEX:  _status.response.AM_ACCT_INDEX,
                        //             AM_DEPT_INDEX:  _status.response.AM_DEPT_INDEX,
                        //         },
                        //         status: false,
                        //         validation:true,
                        //         modal_body: (_status.response) ? _status.response.exceedMsg : '',
                        //         loading:false,
                        //         submit_type : 'exceeds'
                        //     })
                        // }
                       
                    }
                    else if(_status.status && _submit_details=="save"){
                        let _loc_temp = localStorage.getItem('free_from')
                        if(_loc_temp){
                            _loc_temp = JSON.parse(_loc_temp)
                        }
                        else{
                            localStorage.setItem('free_from', JSON.stringify({viewState:'mod', strType:_details.prType, prid:_status.message,POM_PO_NO:_status.message,  POM_PO_INDEX : _status.response.insertId}))
                        }
                       
                        this.props.change('raisePOForm.prNo', _status.message)
                        this.setState({
                            status: _status.status,
                            validation:true,
                            submit_type : 'save',
                            modal_body: ` Purchase Order Number ${_status.message} has been created`,
                            loading:false,
                            lblPONo : _status.message
                        })
                        // window.location.reload()
                    }
                    
                }
            }

            else{
                this.setState({
                    status:false,
                    table_display:false,
                    validation : true, 
                    modal_title : '',
                    modal_body:'Select Atleast One Product to Raise po '
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
        if(details.id=="FUNDTYPEDESC"){
            _table_model_header = [
                    {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                    {name : "Code", id:"AC_ANALYSIS_CODE"},
                ];
            _table_model_body = this.props.fund_type_project_code;
            _modal_title = "Select Fund Type"

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
            _modal_title = "Select Delivery Address"
        }
        else if(details.id=="costCentre"){
            _table_model_header = [
                {name : "Budget Account Code", id:"AM_ACCT_CODE", key:true},
                {name : "Budget Account", id:"AM_ACCT_DESC"},
            ];
            _table_model_body = this.props.cost_centre_code;
            _modal_title = "Select Cost Centre Code "
        }
        else if(details.id=="PERSONCODEDESC"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body = this.props.fund_type_project_code_l9
            _modal_title = "Select Person Code"
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
        
            let _detauls = (this.props.gl_code && this.props.gl_code.dvwCus) ? this.props.gl_code.dvwCus.filter((list_details)=>list_details.CF_FIELD_NAME=='Segmentation') : []
            if(_detauls.length > 0){
                _table_model_body = _detauls[0].CF_VALUES
                _modal_title = "Select Custom Fields"
            }
        }

        else if(details.id=="Test"){
            _table_model_header = [
                {name : "Description", id:"CF_FIELD_VALUE", key:true},
            ];

            let _detauls = (this.props.gl_code && this.props.gl_code.dvwCus) ? this.props.gl_code.dvwCus.filter((list_details)=>list_details.CF_FIELD_NAME=='Test') : []
            if(_detauls.length > 0){
                _table_model_body = _detauls[0].CF_VALUES
                _modal_title = "Test"
            }
           
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
            "strDocNo":(this.state.strPrNO) ? this.state.strPrNO: "",
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
            this.props.UploadDocuments(this.state.internal_file, req)
            this.setState({
                external_delete : false,
                external_upload : false,
                internal_delete : false,
                internal_upload : true,
                filename:'',
                internal_file : '',
                internal_file_name :'',
            })
            attachment.target.value = null
        }
        else if(_file_name == "raisePOForm.externalAttachment" && this.state.external_file){
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

    SendUpload = (e) => {
        let _details  = CheckFileDetails(e);
        if(_details.status){
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
        else{
            this.setState({
                status: false,
                validation:true,
                modal_body:_details.message,
                loading:false,
            })
        }
    }

    handleDate = (details) =>{
        this.setState({
            date_details : details
        })
    }

    handleDateTable (details, name, id){
        if(details){
            let {dates, table_body} = this.state
            if(dates && dates.length){
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
            }
            else if(table_body && table_body.length){
                let _dates =  new Date((new Date()).valueOf() + 1000*3600*24);
                table_body.forEach((list,index)=>{
                    dates[index] = _dates;
                    if(index==id){
                        dates[index] = details;
                    }
                })
            }
            else{
                dates[id]=details
            }

            
            console.log('handleDateTable', dates)
        
            this.setState({
                dates: dates
            })
        }

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
       
        if(!table_body.length){
            table_body = this.props.purchased_items.getPurchaseRequestItemsDetails
        }
        if(current_id!='' && current_model && table_body[current_id]){
            let _details =  Object.assign({},table_body[current_id],  e)
            table_body[current_id] = _details;
            if(current_model=="FUNDTYPEDESC"){
                table_body[current_id][current_model]= e.AC_ANALYSIS_CODE_DESC
            }
            else if(current_model=="deliveryAddress"){
                table_body[current_id][current_model]= e.Address
                table_body[current_id].DeliveryAddr= e.AM_ADDR_CODE
                
                
                
            }
            else if(current_model=="costCentre"){
                table_body[current_id].ACCT = e.AM_ACCT_INDEX;
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
            table_body = (this.props.purchased_items.getPurchaseRequestItemsDetails) ? this.props.purchased_items.getPurchaseRequestItemsDetails : []
        }

       
        
        let _final_result =[]
        if(table_body.length){
           
            table_body.forEach((list,index)=>{
                let temp_data = Object.assign({} , list ,  e)
                if(model_current_id=="FUNDTYPEDESC"){
                    temp_data[model_current_id]= e.AC_ANALYSIS_CODE_DESC
                }
                else if(model_current_id=="deliveryAddress"){
                    temp_data[model_current_id]= e.AM_ADDR_LINE1
                    temp_data.DeliveryAddr= e.AM_ADDR_CODE
                }
                else if(model_current_id=="costCentre"){
                    temp_data[model_current_id]= e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE
                    temp_data.ACCT = e.AM_ACCT_INDEX;
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

                else if(model_current_id=="Segmentation"){
                    temp_data[model_current_id]=e.CF_FIELD_VALUE
                    temp_data.Segmentation = e.CF_FIELD_VALUE
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
             _details.modal_title = "Select Fund Type"

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
             _details.modal_title = "Select Delivery Address"
        }
        else if(_target_name=="costCentre"){
            _details.table_model_header = [
                {name : "Budget Account Code", id:"AM_ACCT_CODE", key:true},
                {name : "Budget Account", id:"AM_ACCT_DESC"},
            ];
             _details.table_model_body = this.props.cost_centre_code;
             _details.ccc = [_target_id]
             _details.modal_title = "Select Cost Centre Code"
        }
        else if(_target_name=="PERSONCODEDESC"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.fund_transfer_l9 = [_target_id]
            _details.table_model_body = this.props.fund_type_project_code_l9
            _details.modal_title = "Select Person Code"
        }

        else if(_target_name=="PROJECTCODEDESC"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
          
             _details.fund_transfer_l8 = [_target_id]
             _details.table_model_body =this.props.fund_type_project_code_l8
             _details.modal_title = "Select Project / ACR Code"
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
        console.log('_form_value', _form_value)
        let _combain_array = table_body;
        if(!slected_items.length){
            this.setState({
                status:false,
                table_display:false,
                validation : true, 
                modal_title : '',
                modal_body:'Please select at least one selection!'
            })
        }
        else{
            
            let {dates} = this.state
            console.log('makeDuplicate', dates)
            slected_items = slected_items.sort()
            let _get_selected = []
            await slected_items.forEach((list)=>{
                let _get_duplicate =   table_body.filter((list_element, index)=> {
                        return index==list
                })
                let _temp_duplicate = [..._get_duplicate]
                if(_temp_duplicate.length){
                    let _length_name  =  parseInt(table_body.length) ;
                    if(_length_name){
                        _temp_duplicate.forEach((list_element, index)=>{
                            let _current_delivery = new Date((new Date()).valueOf() + 1000*3600*24);
                            let _item_code = (list_element.PRODUCTCODE) ? list_element.PRODUCTCODE : parseInt(table_body.length)
                            let _form_value_list = _form_value.itemList[(list)?parseFloat(list) : 0]
                            console.log('list_element', list_element)
                            if(_form_value_list && _form_value_list.hasOwnProperty(_item_code)){
                                _form_value_list = _form_value_list[_item_code]
                                if(_form_value_list.delivery){
                                    var dateString = FromateDateMonth(_form_value_list.delivery)
                                    dateString = new Date(dateString);
                                    _current_delivery = dateString
                                }
                            }
                            dates[_length_name]  = _current_delivery
                            let _name = `itemList.${parseInt(table_body.length)}.${(list_element.PRODUCTCODE) ? parseInt(table_body.length) : parseInt(table_body.length)}.`
                            this.props.change(_name+'Remarks', list_element.Remarks)
                            this.props.change(_name+'QUANTITY', list_element.QUANTITY)
                            this.props.change(_name+'UNITCOST', list_element.UNITCOST)
                            this.props.change(_name+'WarrantyTerms', list_element.WARRANTYTERMS)
                            this.props.change(_name+'WARRANTYTERMS', list_element.WARRANTYTERMS)
                            this.props.change(_name+'Segmentation', (list_element.Segmentation) ? list_element.Segmentation : 'Standard Material')
                            this.props.change(_name+'delivery',_current_delivery)
                        })
                    }
                }


                
                let _temp_duplicate_1 = _temp_duplicate.map(function(details,index){
                    let _details = Object.assign({}, details)
                    _details.PRODUCTCODE  = ( table_body.length) ?  table_body.length : 0;  
                    _details.ITEMINDEX  = ( table_body.length) ?  table_body.length+1 : 0;  
                    _details.ITEMLINE  = ( table_body.length) ?  table_body.length+1 : 0;  
                    return _details
                })

                table_body.forEach(function(details,index){
                    let _current_delivery  = new Date((new Date()).valueOf() + 1000*3600*24);
                    if(!dates[index]){
                        dates[index]  = _current_delivery
                    }
                })
                

                if(_temp_duplicate && _temp_duplicate.length){ 
                    _combain_array.push(_temp_duplicate_1[0])
                }
            })

            console.log('_combain_array', _combain_array)

            this.setState({
                delete:true,
                table_body:_combain_array,
                dates :dates
            })
         
        }

    }
    
    removeItem = async (e, details) =>{
        let {table_body, products, slected_items, nc_pop_up_details} = this.state;
        let _form_value  = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
        if(slected_items && slected_items.length){
            let _updated = false;
            let _all_table_body = table_body;
            let _all_table_body_selected = slected_items;
            let _get_selected_item_list = slected_items;
          
            _all_table_body.sort()

            console.log('_all_table_body_selected', _all_table_body_selected)

            await slected_items.forEach(async (list, idx, array)=>{
                let _let_main_details = `itemList.${list}`
                _updated = true
                if(_all_table_body.length == table_body.length){
                    _all_table_body = _all_table_body.map((list_element, index)=>{
                        if(index==list){
                            let _details = {}
                            _details.removed = 1
                             return _details
                        }
                        else{
                            return list_element
                        }
                      
                    })

                    console.log('_all_table_body_selected', _all_table_body_selected)
                    _all_table_body_selected  = _all_table_body_selected.filter((list_element)=> list_element!=list)
               
                }
                else{
                    _all_table_body = _all_table_body.map((list_element, index)=>{
                        
                        if(index==list){
                           let _details = {}
                           _details.removed = 1
                            return _details
                        }
                        else{
                            return list_element
                        }
                      
                    })
                    _all_table_body_selected  = _all_table_body_selected.filter((list_element)=> list_element!=list)
                  
                }

                if (idx === array.length - 1){ 
                    console.log('_all_table_body', _all_table_body, list, idx, array)
                    this.setState({
                        delete:true,
                        slected_items : _all_table_body_selected ,
                        table_body: (_all_table_body ? _all_table_body  : []),
                    })
                }

                console.log('_all_table_body', _all_table_body, _all_table_body.length)
            })
        }
        else{
            this.setState({
                status: false,
                validation:true,
                modal_body: 'Please make at least one selection! ',
                loading:false
            })
        }
        
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
        Object.assign(raisePOForm.raisePOForm, billingAddress);
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
            this.setState({internal_delete:true})
        }
        else{
             this.setState({external_delete:true})
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

    async handlefiltersubmit(values){
        let _custom_field = []
        let _submit_details  =  (values.submit_type) ? values.submit_type : '';
        let _GetPrDto = GetFreeFormSave();
        let _save_item = await this.saveItem(values.raisePOForm)
        let _details =''
         _GetPrDto =  _GetPrDto.RFQPOSubmit
        if(values.raisePOForm){
            _details = Object.assign({},_GetPrDto.POData, values.raisePOForm)
            if(_details.POData){
                _details.POData.Urgent = (this.state.Urgent==1) ? 1 : 0;
            }
          
            if(values && values.submit_type=="submit"){
                let _form_vales = values.raisePOForm;
            }
            else{
                values = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
            }
            
            if(!values.itemList){
                values = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
            }
        }


        let _itemList =  values.itemList;
       
        

        let _item_details = await  this.state.table_body;
        let _new_date = new Date((new Date()).valueOf() + 1000*3600*24);
        _item_details.forEach((list,index)=>{
            _item_details[index] =  Object.assign({},_GetPrDto.POitemDetails,list)
            _item_details[index].PRODUCTCODE = "";
            _item_details[index].ExchangeRate = "1.0";
            _item_details[index].REMARK =  (_itemList && _itemList.length && _itemList[index] && _itemList[index].Remarks) ?  _itemList[index].Remarks : ' Remark 1 ';
            _item_details[index].Urgent = (this.state.Urgent==1) ? 1 : 0;
            _item_details[index].PRODUCTDESC =  (_item_details[index].PRODUCTDESC) ? _item_details[index].PRODUCTDESC : _item_details[index].ITEMCODE
            _item_details[index].ITEMLINE = _item_details.length == 0 ? 1 : _item_details.length + 1;
            _item_details[index].PCD_PR_LINE = _item_details.length == 0 ? 1 : _item_details.length + 1;
            _item_details[index].deliveryUIDate = (_item_details[index].delivery) ? new Date( _item_details[index].delivery) : _new_date;
            _item_details[index].ETD =  (_item_details[index].delivery) ? CalcDate(_item_details[index].delivery) : CalcDate(_new_date);
            if(!_item_details[index].AM_ADDR_CODE){
                let _default_address = this.props.delivery_address.filter((list)=>{return list.AM_ADDR_CODE===this.state.default_dl_address})
                if(_default_address.length){
                    _default_address = _default_address[0];
                    _item_details[index].AM_ADDR_CODE = _default_address.AM_ADDR_CODE;
                    _item_details[index].AM_ADDR_LINE1 = _default_address.AM_ADDR_LINE1;
                    _item_details[index].AM_ADDR_LINE2 = _default_address.AM_ADDR_LINE2;
                    _item_details[index].AM_ADDR_LINE3 = _default_address.AM_ADDR_LINE3;
                    _item_details[index].AM_POSTCODE = _default_address.AM_POSTCODE;
                    _item_details[index].AM_STATE = _default_address.AM_STATE;
                    _item_details[index].AM_CITY = _default_address.AM_CITY;
                    _item_details[index].AM_COUNTRY = _default_address.AM_COUNTRY;
                }
            }

            _custom_field.push({
                "PCD_PR_INDEX": 1 ,
                "PCD_FIELD_NO": "1",
                "PCD_FIELD_VALUE": (_item_details[index] && _item_details[index]!==undefined) ? _item_details[index].Segmentation : 'Standard Material'
            })

           

        })


        

        if(_save_item){
            let _final_datas ={
                    "POCost":this.state.table_body.reduce((a, val) => a += (((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST)? val.UNITCOST : 0)) + ((val.GST)? val.GST : 0), 0),
                    "prIndex":this.state.prIndex,
                    "modeType":(this.state.lblPONo) ? 'mod' :'new',
                    "modePR": (this.state.lblPONo) ? 'pr' :'',
                    "RFQ_Num":"",
                    "ListingFromRFQ":"",
                    POData : _details,
                    POitemDetails : _item_details,
                    // customFieldList : 
            }
    
            _final_datas.POData.VendorID = (_final_datas && _final_datas.POitemDetails.length) ? _final_datas.POitemDetails[0].COYID : 0;
            _final_datas.POData.BillAddrCode = (this.state.address && this.state.address.BillAddrCode) ? this.state.address.BillAddrCode : 0
            _final_datas.POData.QuoNo = this.state.po_number
            _final_datas.POData.POCost = _final_datas.POCost
            _final_datas.POData.RfqIndex = "NULL";
            _final_datas.POData.QuoNo = "NULL";
            _final_datas.POData.BillingMethod = this.state.billing_method;
            _final_datas.POData.VendorID = _final_datas.POData.Vendor
            _final_datas.POData.PrintRemark = (_final_datas.POData.PrintRemark) ? 1 : 0;
            _final_datas.POData.PrintCustom = (_final_datas.POData.PrintCustom) ? 1 : 0;
            _final_datas.POData.ExchangeRate = "1";
            _final_datas.POData.ShipAmt =  this.state.shipping_charge
            _final_datas.POData.lblPONo = (this.state.lblPONo) ? this.state.lblPONo :'';
          
            
            let _temp_details = {}
            _temp_details.RFQPOSubmit = _final_datas;
            this.setState({
                loading:true
            })

            let _status =  await ApiExtract(FFPOSubmit, _temp_details)
            if(_status.status){
                if(_status.status && _submit_details=="submit"){
                    this.props.history.push({
                        pathname:'/po_approval_setup_ffpo',
                        datas: {
                            'approval_list': _status.response.ApprovalSetup,
                            'pr_no':  _status.message,
                            'pr_cost': this.state.table_body.reduce((a, val) => a += (val.QUANTITY * val.UNITCOST) + val.GST, 0),
                        }
                    })
                }
                else if(_status.status && _submit_details=="save"){
                    this.props.change('raisePOForm.prNo',this.state.lblPONo)
                    console.log('_status.message', this.state.lblPONo)
                    this.setState({
                        status: _status.status,
                        validation:true,
                        modal_body: _status.message,
                        loading:false,
                        lblPONo : _status.message
                    })
                  
                }
            }
        }
        
    }



    saveItem = async (_submit_details) =>{
        console.log('_submit_details', _submit_details)
        let {table_body, products} = this.state;
        let _date_inst = new Date();
        let _result = true;
      
        if(table_body.length){
            await table_body.forEach((list_details)=>{   
                if(!list_details.hasOwnProperty('removed')){
                    if(!list_details.hasOwnProperty('FUNDTYPEDESC') || !list_details.FUNDTYPEDESC){
                        this.setState({
                            status : false,
                            validation: true,
                            modal_title : '',
                            modal_body : 'Please Select valid Fund Type'
                        })
                        _result = false
                    }

                    else if(!list_details.hasOwnProperty('PROJECTCODEDESC') || !list_details.PROJECTCODEDESC){
                        this.setState({
                            status : false,
                            validation: true,
                            modal_title : '',
                            modal_body : 'Please Select valid Project / ACR Code'
                        })
                        _result = false
                    }

                    else if(!_submit_details || !_submit_details.raisePOForm || !_submit_details.raisePOForm.Vendor){
                        this.setState({
                            status : false,
                            validation: true,
                            modal_title : 'Validation',
                            modal_body : 'Please Choose a vendor'
                        })
                        _result = false
                    }
    
                    else if(!this.state.address.BillAddrCode){
                        this.setState({
                            status : false,
                            validation: true,
                            modal_title : 'Validation',
                            modal_body : 'Choose Billing Address'
                        })
                        _result = false
                    }
                    
                    else if(!list_details.hasOwnProperty('costCentre') || !list_details.costCentre){
                        this.setState({
                            status : false,
                            validation: true,
                            modal_title : '',
                            modal_body : 'Please Select valid Cost Centre Code'
                        })
                        _result = false
                    }

                    else if(!list_details.hasOwnProperty('deliveryAddress') || !list_details.deliveryAddress){
                        this.setState({
                            status : false,
                            validation: true,
                            modal_title : '',
                            modal_body : 'Please Select valid Delivery Address'
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

                    else if(!list_details.hasOwnProperty('QUANTITY') || (list_details.QUANTITY<=0) || (list_details.QUANTITY=='')){
                        this.setState({
                            status : false,
                            validation: true,
                            modal_title : '',
                            modal_body : 'Please enter valid quantity'
                        })
                        _result = false
                    }

                    else if(!list_details.hasOwnProperty('UNITCOST') || (list_details.UNITCOST<=0) || (list_details.QUANTITY=='')){
                        this.setState({
                            status : false,
                            validation: true,
                            modal_title : '',
                            modal_body : 'Please enter valid unit price'
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

    confirm_function = (type, text) => {
        
        if(type=="delete"){
            let {slected_items} = this.state;
            if(slected_items && slected_items.length){
                this.setState({
                    status: false,
                    confimation:true,
                    confimation_pop:true,
                    confimation_type : type,
                    status_text : text,
                    modal_body: `Are you sure that you want to ${text}`,
                })
            }
            else{
                this.setState({
                    status: false,
                    validation:true,
                    modal_body: 'Please select at least one selection!',
                    loading:false
                })
            }
        }
        else{
            this.setState({
                status: false,
                confimation:true,
                confimation_pop:true,
                confimation_type : type,
                status_text : text,
                modal_body: `Are you sure that you want to ${text}`,
            })
        }
       

    }

    
    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="delete"){
            this.removeItem()
        }
    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

     saveItem_1 = async (_submit_details) =>{
         console.log('_submit_details', _submit_details)
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
                else if(!_submit_details || !_submit_details.raisePOForm || !_submit_details.raisePOForm.Vendor){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Choose a vendor'
                    })
                    _result = false
                }

                else if(!this.state.address.BillAddrCode){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Choose Billing Address'
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
                        modal_body : 'Please enter valid qunatity'
                    })
                    _result = false
                }
                // else if(!_submit_details.hasOwnProperty('Vendor') || (_submit_details.Vendor)){
                //     this.setState({
                //         validation:true,
                //         modal_title : 'Validation',
                //         modal_body : 'Please Select a Vendor '
                //     })
                //     _result = false
                // }
                // else if(!_submit_details.hasOwnProperty('BillAddrPostCode') || (_submit_details.BillAddrPostCode)){
                //     this.setState({
                //         validation:true,
                //         modal_title : 'Validation',
                //         modal_body : 'Please Select a Billing '
                //     })
                //     _result = false
                // }

            })
        }
        return _result

        
    }


    

    ChangeUrget = () =>{
        this.setState({
            Urgent : (this.state.Urgent==1) ? 0 : 1 
        })
    }

    shipping_charge_update = (details) =>{
        if(details >= 0){
            this.setState({
                shipping_charge : details
            })
        }
        else{
            this.setState({
                shipping_charge : 0
            })
        }
        
    }

    handleVendorChange = async(target) =>{
        if(target.value){
            this.setState({loading:true})
            let _final_datas = {strVendor: target.value}
            let _status =  await ApiExtract(VendorDetailMethod, _final_datas)
            if(_status){
                let {VendorDetail} = _status.response;
                if(VendorDetail){
                    this.setState({
                        billing_method : VendorDetail[0].CV_BILLING_METHOD,
                        loading :false
                    })
                }
                else{
                    this.setState({
                        loading :false
                    })
                }
            }
        }
    }

    render(){
     let _table_total = (this.state.table_body && this.state.table_body.length>0) ? this.state.table_body.reduce((a, val) => a += ((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST) ? val.UNITCOST : 0) , 0) : 0;
     let _table_sst = (this.state.table_body && this.state.table_body.length>0) ? this.state.table_body.reduce((a, val) => a += (val.GST) ? (val.QUANTITY * val.UNITCOST) * (val.GST/100) : 0 , 0).toFixed(2) : 0
     const { handleSubmit } = this.props
        let _table_header = [
            // {name : "Line", id:"ITEMINDEX", key:true, width:'100px'},
            {name : "Item Code", id:"VENDORITEMCODE", width:'100px'},
            {name : "Gift", id:"GIFT",type:"select",key:false, value:[{value:"N", name:"NO"}, {value:"Y", name:"YES"}], width:'84px'},
            {name : "Fund Type (L1)", id:"FUNDTYPEDESC", type:"click", width:'148px', dataFormat:'select'},
            {name : "Person Code (L9)", id:"PERSONCODEDESC", type:"click", width:'138px'},
            {name : "Project / ACR (L8) Code ", id:"PROJECTCODEDESC", type:"click", width:'157px'},
            
            {name : "GL Description (GL CODE)", id:"GLDESCRIPTION",type:"click", key:false, width:'150px'},
            {name : "Category Code", id:"CATEGORYCODE", key:false,width:'100px',type:"select", value:[{value:"", name:"N/A"}], width:'100px', select_status:"disable"},
            {name : "Item Name", id:"PRODUCTDESC", key:false, width:'150px', type:"input"},
            {name : "MPQ", id:"MPQ", key:false,width:'79px', type:"price"},
            {name : "Quantity", id:"QUANTITY", key:false,width:'79px', type:"number"},
            {name : "UOM", id:"UOM",  disabled:true, width:'100px', type:'textselect_ffo_po', value: (this.props.free_form && this.props.free_form.item) ? this.props.free_form.item : []},
            {name : "Unit Price", id:"UNITCOST", key:false,type:"number", width:'79px'},
           
            {name : "Amount", id:"AMOUNT", key:false, width:'100px', type:"price", align:'right'},
            {name : "SST Rate", id:"GSTRate_FF", key:false, width:'100px', align:'right', type:"select", value:this.props.fill_tax, width:'100px', select_status:"disable"},
            {name : "SST Amount", id:"GSTRate_FF_SST", key:false, width:'100px', type:"GSTRate_FF_SST", align:'right'},
            {name : "SST Tax Code (Purchase, L6)", id:"GstTaxCode", key:false, width:'100px',type:"select", value:[{value:"", name:"N/A"}], width:'100px', select_status:"disable"},
            {name : "Cost Centre Code (L7)", id:"costCentre", key:false, type:"click", width:'114px'},
            {name : "Delivery Address", id:"deliveryAddress", key:false, type:"click", width:'134px'},
            {name : "Est. Date of Delivery (dd/mm/yyyy)", id:"delivery", key:false, type:"date", width:'143px'},
            {name : "Warranty Terms (months)", id:"WarrantyTerms", key:false, type:"number", width:'107px'},
           

        ];

        let _detauls = (this.props.gl_code && this.props.gl_code.dvwCus) ? this.props.gl_code.dvwCus.map((list_details)=>{
            _table_header.push({
                name : list_details.CF_FIELD_NAME,
                id : list_details.CF_FIELD_NAME,
                key:false, 
                type:"select_click_ffo", 
                width:'120px',
                value:list_details.CF_VALUES
            })
        }) : ''

        _table_header.push({name : "Remarks", id:"Remarks", key:false,type:"textarea", width:'200px'})

       
        return <Fragment>
            <PageHeading 
                heading="Raise Free Form Purchase Order" 
                subheading="Fill in the required field(s) and click the Save button to create the PO or Submit button to submit the PO to the selected vendor. " 
            />
              {this.props.upload_document && this.props.upload_document.loading ? <Loader /> : '' } 
              {this.props.file_upload_external && this.props.file_upload_external.loading ? <Loader /> : '' } 
              {this.props.file_delete && this.props.file_delete.loading ? <Loader /> : '' } 
              {this.props.ed_loading ? <Loader /> : '' } 
              {this.props.pri_ncpopup_details && this.props.pri_ncpopup_details.loading ? <Loader /> : '' } 
              {this.props.pri_loading  ? <Loader /> : '' } 
              {this.props.spr_loading  ? <Loader /> : '' } 
              {this.state.loading  ? <Loader /> : '' } 
              {this.props.dr_loading  ? <Loader /> : '' } 
              {this.props.gl_loading ? <Loader /> : '' } 
              {this.props.po_loading ? <Loader /> : '' } 
              
              <TabHeading color={'bg-info text-white'}>Purchase Order Header</TabHeading> 
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
                                <div className="row disabled-input margin-top-none">
                                    <Field type="text" name="raisePOForm.Date" selected={this.state.date_details} dateformate="DD/MM/YYYY" component={FormDatePicker} minDate = {new Date()} className="form-control" placeholder="Date " label="Date :"   onChange={this.handleDate.bind(this)} readonly={true}/>   
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" rem={true} name="raisePOForm.Vendor" component={FromSelect} className="form-control" placeholder="Vendor Name" label="Vendor :" onChange={(e)=>this.handleVendorChange(e.target)}>
                                        <option value=""> Select Vendor </option>
                                        {(this.props.gl_code && this.props.gl_code.vendorDetails && this.props.gl_code.vendorDetails.VendorList) ? this.props.gl_code.vendorDetails.VendorList.map((list_details)=>{
                                               return <option value={list_details.value}>{list_details.label}</option>
                                        }) :''}
                                        
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="raisePOForm.CurrencyCode" component={FromInputs} className="form-control" placeholder="Currency Code" label="Currency Code :"  />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field className="form-control textboxstyle" component={FromSelect} label="Payment Terms :" rem={true} name="raisePOForm.PaymentTerm" disable_input={this.state.diable_payment}>
                                           
                                            <option value=""> Select Payment Terms </option>
                                            {(this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.paymentTerm) ? this.props.gl_code.FFRaisePO.paymentTerm.map((list_details)=>{
                                                return (<option value={list_details.CODE_DESC}>{list_details.CODE_DESC}</option>)
                                            }) :''}
                                            
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field className="form-control textboxstyle" component={FromSelect} name="raisePOForm.PaymentType" label="Payment Method :" rem={true}  readOnly>
                                          
                                            <option value=""> Select Payment Method </option>
                                            {(this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.paymentMethod) ? this.props.gl_code.FFRaisePO.paymentMethod.map((list_details)=>{
                                                return (<option value={list_details.CODE_DESC}>{list_details.CODE_DESC}</option>)
                                            }) :''}
                                            
                                    </Field>

                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field className="form-control textboxstyle" component={FromSelect} name="raisePOForm.ShipmentTerm" label=" Shipment Terms :" readOnly rem={true} >
                                           
                                            <option value=""> Select Shipment Terms </option>
                                            {(this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.shipmentTerm) ? this.props.gl_code.FFRaisePO.shipmentTerm.map((list_details)=>{
                                                return (<option value={list_details.CODE_DESC}>{list_details.CODE_DESC}</option>)
                                            }) :''}
                                    </Field>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field className="form-control textboxstyle" component={FromSelect} name="raisePOForm.ShipmentMode" label=" Shipment Mode :" readOnly rem={true} >
                                            <option defaultValue=''>--Select--</option>
                                          
                                            {(this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.shipmentMode) ? this.props.gl_code.FFRaisePO.shipmentMode.map((list_details)=>{
                                                return (<option value={list_details.CODE_DESC}>{list_details.CODE_DESC}</option>)
                                            }) :''}
                                    </Field>
                                </div>
                            </div>
                       
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="raisePOForm.ShipVia" component={FromInputs} className="form-control" placeholder="Ship via " label="Ship via :" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                    <Field type="text" name="raisePOForm.Attn" component={FromInputs} className="form-control" placeholder="Attention To" label="Attention To :"  />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                       
                        <div className="col-12 col-sm-6 mt-2 details" >
                           
                                <Field className="form-control textboxstyle" component={FromSelect} name="raisePOForm.BillTo" rem={true} label="Bill To :" change_detuct={this.handleSelectChange} select_value={(this.state.address) ? this.state.address.BillAddrCode : ''}>
                                        <option value=""> Select BillTo </option>
                                        {(this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.billTo) ? this.props.gl_code.FFRaisePO.billTo.map((list_details)=>{
                                            return (<option value={list_details.AM_ADDR_CODE}>{list_details.AM_ADDR_CODE}</option>)
                                        }) :''}
                                </Field>
                                <Field type="text" name="raisePOForm.BillAddrLine1" component={FromInputs} className="form-control" placeholder="Address 1" label="" readonly={true} />
                                <Field type="text" name="raisePOForm.BillAddrLine2" component={FromInputs} className="form-control" placeholder="Address 2" label="" readonly={true} />
                                <Field type="text" name="raisePOForm.BillAddrLine3" component={FromInputs} className="form-control" placeholder="Address 3" label="" readonly={true} />
                                <Field type="text" name="raisePOForm.BillAddrPostCode" component={FromInputs} className="form-control" placeholder="PostCode" label="" readonly={true} />
                                <Field type="text" name="raisePOForm.BillAddrCity" component={FromInputs} className="form-control" placeholder="City" label="" readonly={true} />
                                <Field type="text" name="raisePOForm.BillAddrState" component={FromInputs} className="form-control" placeholder="State" label="" readonly={true} />
                                <Field type="text" name="raisePOForm.BillAddrCountry" component={FromInputs} className="form-control" placeholder="Country" label="" readonly={true} />
                                <div className="col-12 mt-2">
                                <p style={{color: 'green'}}><span className="text-danger">*</span> indicates required field</p>
                                </div>
                           </div>
                           <div className="col-12 col-sm-6 mt-2 details" >
                            <Field type="text" name="raisePOForm.InternalRemark" component={FromInputs} className="form-control" placeholder="Internal Remarks " label="Internal Remarks :" />
                           
                            <FromUplods name="raisePOForm.internalAttachment" id ="internal_attachment" decs=" Recommended file size is 10240 KB" label="Internal Attachment " buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.internal_file_name}/> 
                               
                            <div className="col-12 col-md-6">
                                <div className="row mt-2">  
                                    <div className="col-12">
                                        <label className="form_label">Internal File Attached : </label>
                                        {(this.state.internal_attachment && this.state.internal_attachment.length) ? this.state.internal_attachment.map((val, index) => {
                                            if (val.CDA_TYPE === 'I') {
                                                return <p className="downloadPointer"><u><span onClick={()=>this.download_file(val)}>{(val.strFile) ? val.strFile :val.CDA_ATTACH_FILENAME} &nbsp;&nbsp;</span></u> <span className="btn btn-sm btn-danger delete-doc" onClick={() => this.deleteFile(val, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                            }
                                        }) : ''}
                                    </div>
                                </div>
                            </div>
                           
                            <Field type="text" name="raisePOForm.ExternalRemark" component={FromInputs} className="form-control" placeholder="External Remarks" label="External Remarks :"  />
                        
                            <FromUplods name="raisePOForm.externalAttachment" id ="external_attachment" decs="Recommended file size is 10240 KB" label="External Attachment " buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                              
                            <div className="col-12 col-md-6">
                               
                                <label  className="form_label">External File Attached: </label>
                                    {(this.state.extrnal_attachment && this.state.extrnal_attachment.length) ? this.state.extrnal_attachment.map((val, index) => {
                                        if (val.CDA_TYPE === 'E') {
                                            return <p className="downloadPointer"><u><span onClick={()=>this.download_file(val)}>{(val.strFile1) ? val.strFile :val.CDA_ATTACH_FILENAME} &nbsp;&nbsp;</span></u> <span className="btn btn-sm btn-danger delete-doc" onClick={() => this.deleteFile(val, 'E')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    }): 'No Files Attached'}
                                </div>
                          
                           
                                <Field  id="raisePOForm.Urgent" component={FromCheckBox} type="checkbox" name="raisePOForm.Urgent" label="Urgent" checked={(this.state.Urgent) ? true : false } onClick={this.ChangeUrget} />
                           
                           
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
                    <div className='col-12 po_form_details'>   
                      
                        
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
                            subtotal={_table_total}
                            sstamount={_table_sst}
                            grandtotal={parseFloat(_table_total)+parseFloat(_table_sst)+parseFloat(this.state.shipping_charge)}
                              table_id="line"
                            segmentation = {(this.props.segmentation) ? this.props.segmentation : []}
                            changefunction = {this.handleChange}
                            shipping_charge = {true}
                            inputPrefix = 'itemList'
                            shipping_amount = {this.state.shipping_charge}
                            shipping_charge_update = {this.shipping_charge_update}
                            handle_popup= {this.handlePopup}
                            handle_date={this.handleDateTable.bind(this)}
                            dates={this.state.dates}
                            select_function_inex = {this.select_function_inex}
                            handledate = {this.handledate.bind(this)}
                            handledateHeader = {this.handledateHeader.bind(this)}
                            main_date = ''
                            change={this.props.change}
                            select_change = {this.SelecthandleChange}
                            selectall = {this.select_all_tabel_index}
                        />


                    </div>
                </div>
                <div className="col-12 mt-3 text-center">
                    <button className="btn btn-sm btn-outline-success" onClick={handleSubmit(values => this.handlefiltersubmit_1({  ...values, submit_type: 'save'}))} type="button">Save</button>
                    <button className="btn btn-sm btn-outline-primary ml-2" onClick={handleSubmit(values => this.handlefiltersubmit_1({  ...values, submit_type: 'submit'}))}>Submit</button>
                    <button className="btn btn-sm btn-outline-info ml-2" type="button" onClick={(e)=>this.addItem(e)}>Add Item</button>
                    <button className="btn btn-sm btn-outline-secondary ml-2" type="button" onClick={()=>this.confirm_function('delete', ' permanently delete this item(s)?')}>Remove Item</button>
                    <button className="btn btn-sm btn-outline-danger ml-2"  type="button"  onClick={(e)=>this.makeDuplicate(e)}>Duplicate Line Item </button>
                    {(this.state.strPrNO) ? <button className="btn btn-sm btn-outline-danger ml-2"  type="button"  onClick={(e)=>this.void_pr(e)}>Void PO </button> : ''}
                </div>
                </form>
                {this.state.validatio}
                <Alert 
                    title={this.state.modal_title} 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.validation} 
                    confirm={this.closeModel}
                />

                <ConfirmationModel
                     title="" 
                     confimation = {true}
                     message={this.state.modal_body} 
                     status={this.state.status} 
                     show={this.state.confimation_pop} 
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />
              
                <Modal size="lg" open={this.state.addmodel} header ={true} title ={'Add Item'} closemodel={this.closeModel}>
                    <FreeForm select getdata={this.receiveproducts} closemodel={this.closeModel}  />
                   
                </Modal>
                <Modal size="lg" open={this.state.model} header ={true} title ={this.state.modal_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
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
                                    inputPrefix = 'raisePOForm'
                                />
                            </div>
                        </form>
                    </Fragment>
                    :''}
                </Modal>
             
                <Modal size="lg" open={this.state.modal_popup} header ={true} title ={this.state.modal_popup_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
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
                                    inputPrefix = 'raisePOForm'
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
    form:'free_form',
    enableReinitialize : true,
    destroyOnUnmount : true,
})(Request)

export default Request;
