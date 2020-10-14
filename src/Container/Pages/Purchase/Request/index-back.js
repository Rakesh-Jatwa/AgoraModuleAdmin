import React,{Component, Fragment} from 'react';
import {FromCheckBoxFull,FromCheckBox, FromInputs, FromUplods, FormPlainInput, FormDatePicker} from '../../../../Component/From/FromInputs'
import {connect} from 'react-redux';
import PageHeading from '../../../../Component/Heading/PageHeading';
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm , arrayRemove, unregisterField} from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table'
import Common from '../../../../Common'
import {TodayDateSalash, addDate} from '../../../../Component/Dates'
import Modal from '../../../../Component/Modal'
import Alert from '../../../../Component/Modal/alert'
import Loader from '../../../../Component/Loader'
import {CalcDate} from  '../../../../Component/Dates'
import {UserDetails } from '../../../../Common/LocalStorage'
import {ApiExtract} from '../../../../Common/GetDatas'
import BootstrapTable from '../../../../Component/Table/BootstrapCustomTablePr'
import {GetPrSave, GetPrDto} from '../../../../Actions/Common'
import {SavePurchaseRequest, VoidPR} from '../../../../Apis/RequesterServices'
import CategoPopup from '../../CatloguePopup'
import BuyerCatalogue from '../../BuyerCatloguePopup'
import FreeForm from '../../FreeForm'
import {Link} from 'react-router-dom'
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
        this.getPage_details = this.getPage_details.bind(this)
        this.handlepopformsubmit = this.handlepopformsubmit.bind(this)
        this.SelecthandleChange = this.SelecthandleChange.bind(this)
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
            nc_popup:false,
            rerenderd:false,
            redate:false,
            Urgent:false,
            nc_type:"nc",
            pop_size : 'SM',
            save_item_details:{},
            submit_type:'',
            model : false,
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            nc_pop_up_details : []
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
       console.log('handledate', table_body)
       this.setState({
            table_body : _temp_date,
            // main_date : details,
       })
    }

    getPage_details(details, cell){
      
        let _req ='';
        if((this.props.location && this.props.location.datas && this.props.location.datas.strType=="cc")){
             this.setState({loading:true})
             _req = { "pid": details.PRODUCTCODE, "companyType": "B", "index": "", "draft": "0", "Ref": details.CDM_GROUP_CODE };
             localStorage.setItem('item_details',JSON.stringify(_req));
             window.open('/#/itemCodePage', '_blank');
             this.setState({loading:false})
        }
        else if((this.props.location && this.props.location.datas && this.props.location.datas.strType=="bc")){
            this.setState({loading:true})
            _req = { "pid": details.PRODUCTCODE, "companyType": "B", "index": "", "draft": "0"}
             localStorage.setItem('item_details',JSON.stringify(_req));
             window.open('/#/itemCodePage', '_blank');
             this.setState({loading:false})
        }
        else{
            this.setState({loading:true})
            _req = { "pid": details.PRODUCTCODE, "companyType": "B", "index": "", "draft": "0"}
            localStorage.setItem('item_details',JSON.stringify(_req));
            window.open('/#/itemCodePage', '_blank');
            this.setState({loading:false})
        }
        
    }

    receiveproducts = (product) =>{
        let _get_selected_items = product
        if(_get_selected_items){
            if(this.props.location && this.props.location.datas && this.props.location.datas.strType=="cc"){
                this.props.get_details_popup({
                    productList: _get_selected_items,
                    viewState: "new",
                    strType: "cc"
                });
                this.setState({
                    popup:false,
                    delete:false,
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
                    delete:false,
                })
            }
            else{
              
                let _nc_pop_up_details = _get_selected_items
                let _nc_pop_up = new Array();
                let temp_details =  this.state.nc_pop_up_details
                console.log('temp_details', temp_details, _nc_pop_up_details)
                let _pro_details = this.state.table_body.length;
               
                
                _nc_pop_up_details.forEach((list,index)=>{
                    if(list.PM_PRODUCT_CODE==''){
                        temp_details[_pro_details+index] = list
                        console.log('_nc_pop_up_details',list , _pro_details)
                    }
                })
              
                this.props.get_nc_popup({
                    productList: _get_selected_items,
                    viewState: "new",
                    strType: "bc"
                });
                this.setState({
                    nc_pop_up_details : temp_details,
                    nc_popup:false,
                    delete:false,
                })

                console.log('temp_details', temp_details)

            }
          
        }
       
       
    }

    static async getDerivedStateFromProps (nextProps, prevState){

        console.log('getDerivedStateFromProps', prevState.table_body)
        let _details_main = prevState
        
        
        if((!prevState.rendered) && nextProps.location && nextProps.location.datas && nextProps.location.datas.productList && prevState.table_body && nextProps.purchased_items &&  nextProps.purchased_items.getPurchaseRequestItemsDetails && prevState.table_body.length != nextProps.purchased_items.getPurchaseRequestItemsDetails){
            _details_main.rendered = true;
            _details_main.redate =  true;
            _details_main.strPrNO = prevState.strPrNO;
            _details_main.slected_items = []
            _details_main.table_body = nextProps.purchased_items.getPurchaseRequestItemsDetails
            
            _details_main.table_body = await _details_main.table_body.map((list_details)=>{
                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_CODE==="DA004"})
                    if(_default_address.length){
                        let _tem_details = list_details
                        _tem_details.Segmentation  = 'Standard Material'
                        _tem_details.deliveryAddress  = _default_address[0].Address
                        return _tem_details
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
            _details_main.strPrNO = prevState.strPrNO;
            _details_main.slected_items = []
            _details_main.table_body = (nextProps.purchased_items.getPurchaseRequestItemsDetails[1]) ? nextProps.purchased_items.getPurchaseRequestItemsDetails[1] : []
           
            _details_main.internal_attachment = (nextProps.purchased_items.companyDocAttachments) ? nextProps.purchased_items.companyDocAttachments : []
            _details_main.extrnal_attachment = (nextProps.purchased_items.companyDocAttachments) ? nextProps.purchased_items.companyDocAttachments : []
            return _details_main
        }


        if((!prevState.rendered) && prevState.save_item_details && (!prevState.save_item_details.productList) && prevState.table_body && nextProps.purchased_items &&  nextProps.purchased_items.getPurchaseRequestItemsDetails && prevState.table_body.length != nextProps.purchased_items.getPurchaseRequestItemsDetails){
            _details_main.rendered = true;
            _details_main.rerenderd =  true;
            _details_main.redate =  false;
            _details_main.strPrNO = prevState.strPrNO;
            _details_main.slected_items = []
            _details_main.table_body = (nextProps.purchased_items.getPurchaseRequestItemsDetails[1]) ? nextProps.purchased_items.getPurchaseRequestItemsDetails[1] : []
           
            _details_main.internal_attachment = (nextProps.purchased_items.companyDocAttachments) ? nextProps.purchased_items.companyDocAttachments : []
            _details_main.extrnal_attachment = (nextProps.purchased_items.companyDocAttachments) ? nextProps.purchased_items.companyDocAttachments : []
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
            _details_main.strPrNO = prevState.strPrNO;
            _details_main.table_body = await _details_main.table_body.map((list_details)=>{

                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_CODE==="DA004"})
                    if(_default_address.length){
                        
                        let _tem_details = list_details
                        _tem_details.Segmentation  = 'Standard Material'
                        _tem_details.deliveryAddress  = _default_address[0].Address
                        return _tem_details
                    }
                }
                return list_details
            })
            return _details_main
        }

        if(prevState.table_body && nextProps.nc_popup &&  nextProps.nc_popup.getPurchaseRequestItemsDetails && (!prevState.nc_popup) && (!nextProps.pri_ncpopup_details.status)){
            let _details = prevState.table_body
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
            _details_main.strPrNO = prevState.strPrNO;
            _details_main.table_body = await _details_main.table_body.map((list_details)=>{
                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_CODE==="DA004"})
                    if(_default_address.length){
                        let _tem_details = list_details
                        _tem_details.Segmentation  = 'Standard Material'
                        _tem_details.deliveryAddress  = _default_address[0].Address
                        return _tem_details

                    }
                }
                return list_details
            })

            console.log('get_nc_popup', _details_main)
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

        if(prevState.external_delete &&  (!prevState.internal_delete) && nextProps.external_delete.responseList && nextProps.external_delete.responseList.displayAttachFile && nextProps.external_delete.responseList.displayAttachFile.attachFileList){
           _details_main.extrnal_attachment = nextProps.external_delete.responseList.displayAttachFile.attachFileList;
           return _details_main
        }

        if(prevState.external_upload &&  (!prevState.internal_upload)  && nextProps.file_upload_external && nextProps.file_upload_external.responseList && nextProps.file_upload_external.responseList.displayAttachFile && nextProps.file_upload_external.responseList.displayAttachFile.attachFileList){
           _details_main.extrnal_attachment = nextProps.file_upload_external.responseList.displayAttachFile.attachFileList;
           return _details_main
        }

        
     
        if(prevState.rendered && prevState.table_body){
            _details_main.table_body = prevState.table_body
            return _details_main
        }
      


        return nextProps, prevState;
    }

    componentDidMount(){
        let _get_selected_items = this.props.location.datas
          if(localStorage.getItem('pr_details')){
            let _details = JSON.parse(localStorage.getItem('pr_details'))
            this.setState({
                save_item_details : _details,
                nc_type : (_details.strType=='bc' || _details.strType=='BC' || _details.strType=='Non-Contract') ? 'nc' : 'cc'
            })
            this.props.get_details(_details);
        }
        if(localStorage.getItem('pr_approval_flow')){
            this.setState({
                submit_type : 'submit'
            })
        }
        if(localStorage.getItem('pr_approval_flow')){
            window.open("/#/prapprovalSelect","_self");
        }

       


        if(_get_selected_items){
            this.props.get_details(_get_selected_items);
        }

        this.props.change('prDto.requestName', UserDetails().UM_USER_NAME)
        this.props.change('prDto.prNo',this.state.strPrNO)
        this.props.FundTypeOrPersonCode({ type: "L1" })
        this.props.FundTypeOrPersonCode({ type: "L8" })
        this.props.FundTypeOrPersonCode({ type: "L9" })
        this.props.FillAddress()
        this.props.DeliveryAddress()
        this.props.CostCentreCode()
        this.props.SegmentationAction()
        this.props.get_fill_address()
        this.props.cl_code_access()
        this.props.change('prDto.PrintCustom',true)
        this.props.change('prDto.PrintRemark',true)
        this.props.change('prDto.date',new Date())
    }

    closeModel (details){
        this.setState({
            addmodel : false,
            validation:false
        })

        
        if(this.state.submit_type=="save"){
            window.location.reload();
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
        if(this.state.rerenderd){
            let _pr_numner = '';
            let _table_body = [];
            if(this.props.purchased_items && this.props.purchased_items.getPurchaseRequestItemsDetails){
                  let _main_details = this.props.purchased_items.getPurchaseRequestItemsDetails[0];
                  let _item_list= this.state.table_body
                  let _item_details = (this.props.purchased_items.getPurchaseRequestItemsDetails && this.props.purchased_items.getPurchaseRequestItemsDetails.length>=1) ? this.props.purchased_items.getPurchaseRequestItemsDetails[1] : []
                  let _details = (_main_details && _main_details[0]) ? _main_details[0] : {};
                  let _temp_array = new Array();
                  let _user_details = {
                      prNo : _details.PRM_PR_NO,
                      requestName : _details.PRM_REQ_NAME,
                      requestContact : _details.PRM_REQ_PHONE,
                      internalRemarks : _details.PRM_INTERNAL_REMARK,
                      date : _details.PRM_CREATED_DATE ? TodayDateSalash(_details.PRM_CREATED_DATE) : new Date(),
                      attentionTo : _details.PRM_S_ATTN,
                      externalRemarks : _details.PRM_EXTERNAL_REMARK,
                      Urgent : (_details.PRM_URGENT=="1") ? true : false,
                      PrintCustom : 1,
                      PrintRemark : 1,
                  }
                  _pr_numner = _user_details.prNo;
                  if(_item_details && _item_details.length>0){
                    
                     _item_details.forEach((item_details, index)=>{
                        let delivery = [(item_details.PRODUCTCODE) ? item_details.PRODUCTCODE : index];

                        let _build_array = new Object()
                        _build_array = {
                            [delivery] : { 
                                "GIFT":item_details.GIFT,
                                "delivery" :addDate(new Date(), item_details.ETD),
                                "QUANTITY": item_details.QUANTITY,
                                'WarrantyTerms' : item_details.WARRANTYTERMS,
                                'Segmentation' :  item_details.PCD_FIELD_VALUE,
                                'ETD' : item_details.ETD,
                                'Remarks' : item_details.REMARK
                            }
                        }
    
                       
                        _temp_array.push(_build_array)
                      })
                  }
                  
                  let _main_object = {
                      prDto : Object.assign({}, _details, _user_details),
                      itemList : _temp_array
                  }

                 console.log('_main_object', _main_object)
        
                 if(_item_list && _item_list.length){
                    _item_list.forEach((list,index)=>{
                            let temp_data = {}
                            let _item_details = {}
                            temp_data.deliveryAddress= list.PRD_D_ADDR_LINE1+''+list.PRD_D_ADDR_LINE2+''+list.PRD_D_ADDR_LINE3
                            temp_data.costCentre= list.CDM_DEPT_CODE+'-'+list.AM_ACCT_DESC
                            temp_data.prdAcctIndex = list.ACCT;
                            temp_data.prdAcctIndex = list.ACCT;
                            temp_data.COUNTRY = list.PRD_D_COUNTRY
                            temp_data.AM_ADDR_CODE =  list.DADDRCODE
                            temp_data.AM_ADDR_LINE1 =  list.PRD_D_ADDR_LINE1
                            temp_data.AM_ADDR_LINE2 =  list.PRD_D_ADDR_LINE2
                            temp_data.AM_ADDR_LINE3 =  list.PRD_D_ADDR_LINE3
                            temp_data.AM_CITY =  list.PRD_D_CITY
                            temp_data.AM_STATE =  list.PRD_D_STATE
                            temp_data.AM_COUNTRY =  list.PRD_D_COUNTRY
                            temp_data.AM_POSTCODE =  list.PRD_D_POSTCODE
                            temp_data.Remarks =  list.REMARK;
                            temp_data.REMARKS =  list.REMARK;
                            temp_data.GIFT =  list.GIFT;
                            temp_data.Segmentation =  list.PCD_FIELD_VALUE;
                            
                            _item_details = Object.assign({} , list ,  temp_data);
                        _table_body.push(_item_details)
                            
                    })
                    this.props.initialize(_main_object)
                    this.setState({
                        rerenderd:false,
                        Urgent:(_details && _details.PRM_URGENT=="1") ? true : false,
                        strPrNO : _pr_numner,
                        // pr_value : _pr_numner,
                        table_body : _table_body
                    })
                  }

                  
            } 
            
        }
        if(this.state.redate){
           if(this.state.table_body && this.state.table_body.length){
                this.state.table_body.forEach((item_details, index)=>{
                    let _new_date = new Date((new Date()).valueOf() + 1000*3600*24);
                    let _delivery = (item_details.PRODUCTCODE) ? 'itemList.'+index+'.'+[item_details.PRODUCTCODE]+'.delivery' :  'itemList.'+index+'.'+index+'.delivery';
                    let _Segmentation = (item_details.PRODUCTCODE) ? 'itemList.'+index+'.'+[item_details.PRODUCTCODE]+'.Segmentation' :  'itemList.'+index+'.'+index+'.Segmentation';
                  
                    
                    this.props.change(_delivery, _new_date);
                    this.props.change(_Segmentation, 'Standard Material');
                    console.log('Standard Material', _Segmentation)
                })
            }
            this.setState({
             redate:false
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
                   
                    let _length = 0
                    let _main_values = event.target.value .toString()
                    let _count = _main_values.indexOf('.')
                    if(event.target.value && _count>=0){
                        _length = 9
                    }
                    else{
                        _length = 6
                    }

                    
                   
                    if(event.target.value && event.target.value.length <= _length){
                        let _value = (event.target.value) ? event.target.value.slice(0,_length) : '';   
                        table_element_value['AMOUNT']  =  (_value && _value) ? _value * parseFloat(table_element_value['UNITCOST']) : table_element_value['UNITCOST']
                        table_element_value['QUANTITY'] = (_value) ? parseInt(_value)  : ''
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
                if(_qty_input == "WarrantyTerms"){
                    table_element_value['WarrantyTerms'] = event.target.value
                    table_element_value[id] = event.target.value
                }
                if(_qty_input == "GIFT"){
                    table_element_value['GIFT'] = event.target.value
                }
                if(_qty_input == "Segmentation"){
                    console.log('table_element_value[id]', table_element_value[id])
                    table_element_value['Segmentation'] = event.target.value
                    
                }
              
                _new_table_body[_name] = table_element_value
            })
        }
    

        let _total_amount = 0;
        let _sst_amount = 0;
        let _sub_amount =0 ;
        _table_body.forEach((_datas,index)=>{
            _table_body[index].PRODUCTCODE = (_table_body[index].PRODUCTCODE) ? _table_body[index].PRODUCTCODE : index;
            _sub_amount += parseFloat(event.QUANTITY).toFixed(2) * parseFloat(_datas.UNITCOST).toFixed(2)
            _sst_amount += parseFloat(_datas.GSTRate).toFixed(2)
            _total_amount += ((_datas.QUANTITY * _datas.UNITCOST) + _datas.GST).toFixed(2)
        })

        this.setState({
            table_body:_table_body,
            datas:_data,
            sub_amount : _sst_amount,
            total_amount : _total_amount,
            sst_amount : _sst_amount
        })

    
        return event.target.value;
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
                _table_body[name].Segmentation = _value
            }
        }
        this.setState({
            table_body : _table_body
        })

        // let _new_table_body = new Array();
        // let _table_body = this.state.table_body;
        // let _temp_table_body  = _table_body.filter((table_element, index) => { return index == _name})

        // if(_temp_table_body.length){
        //    await _temp_table_body.forEach((table_element_value, index) => {
        //         let temp_name = `itemList.${_name}.${table_element_value.PRODUCTCODE}.`
        //         if(_qty_input == "GIFT"){
        //             table_element_value['GIFT'] = event.target.value
        //         }
        //         if(_qty_input == "Segmentation"){
        //             console.log('_temp_name',temp_name+'Segmentation' )
        //             this.props.change(temp_name+'Segmentation',event.target.value)
        //         }
        //     })
        // }
    

        // this.setState({
        //     table_body:_table_body,
        // })

    }


    async handlefiltersubmit(values){
            let _main_values   =    this.props.request_form;
            let _submit_details  =  (values.submit_type) ? values.submit_type : '';
          
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
            console.log('_temp_holder_1',_itemList)
            if(_itemList){
                let _validate_data = await this.saveItem();
                let _GetPrSave = GetPrSave();
                let _GetPrDto = GetPrDto();
                let _empty_details = new Array()
                if(_GetPrSave && _validate_data){
                    
                    let _main_form_data =  values.prDto;
                    _main_form_data.Urgent = (this.state.Urgent) ? 1 : 0;
                    _main_form_data.PrintCustom = (_main_form_data.PrintCustom) ? "1" : "0";
                    _main_form_data.PrintRemark = (_main_form_data.PrintRemark) ? "1" : "0";
                    _main_form_data.date = (_main_form_data.date) ?  TodayDateSalash(_main_form_data.date) : TodayDateSalash(new Date())
                    let _details = Object.assign({},_GetPrSave , _main_form_data)
                    _details.prType = (this.props.location && this.props.location.datas && this.props.location.datas.strType) ? this.props.location.datas.strType: 'bc' ;
                    let _address_details = this.props.fill_address;
                    let temp_object = {}
                    temp_object.prNo = (this.state.pr_value) ? this.state.pr_value : this.state.strPrNO;
                    if(_address_details.dsBilling){
                        let {dsBilling}  = _address_details
                        if(dsBilling.length){
                            dsBilling = dsBilling[0]
                        }
                      
                        temp_object.AM_ADDR_CODE = dsBilling.AM_ADDR_CODE;
                        temp_object.AM_ADDR_LINE1 = dsBilling.AM_ADDR_LINE1;
                        temp_object.AM_ADDR_LINE2 = dsBilling.AM_ADDR_LINE2;
                        temp_object.AM_ADDR_LINE3 = dsBilling.AM_ADDR_LINE3;
                        temp_object.AM_POSTCODE = dsBilling.AM_POSTCODE;
                        temp_object.AM_STATE = dsBilling.AM_STATE;
                        temp_object.AM_CITY = dsBilling.AM_CITY;
                        temp_object.AM_COUNTRY = dsBilling.AM_COUNTRY;
                    }
                    else if(this.props.delivery_address && this.props.delivery_address.length){
                        let _default_address = this.props.delivery_address.filter((list)=>{return list.AM_ADDR_CODE==="DA004"})
                        if(_default_address.length){
                            _default_address = _default_address[0];
                            temp_object.AM_ADDR_CODE = _default_address.AM_ADDR_CODE;
                            temp_object.AM_ADDR_LINE1 = _default_address.AM_ADDR_LINE1;
                            temp_object.AM_ADDR_LINE2 = _default_address.AM_ADDR_LINE2;
                            temp_object.AM_ADDR_LINE3 = _default_address.AM_ADDR_LINE3;
                            temp_object.AM_POSTCODE = _default_address.AM_POSTCODE;
                            temp_object.AM_STATE = _default_address.AM_STATE;
                            temp_object.AM_CITY = _default_address.AM_CITY;
                            temp_object.AM_COUNTRY = _default_address.AM_COUNTRY;
                        }
                       
                    }
                    _details = Object.assign({},_details , temp_object)
                    _details.pr_cost = this.state.table_body.reduce((a, val) => a += (((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST)? val.UNITCOST : 0)) + ((val.GST)? val.GST : 0), 0);
                
                    let _custom_field = []
                
                    if(_itemList){
                        let _matched_id = 0;
                        await _itemList.forEach((list_sub_item, index_list)=>{
                            _matched_id += 1
                            // list_sub_item.forEach((list, index)=>{
                                let index ='';
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
                                console.log('_table_body_filter', _table_body)
                                for (var i=0;i< _table_body.length; i++) {
                                    if (_table_body[i].PRODUCTCODE == index && _table_body[i].PRODUCTCODE == index) {
                                        console.log('con1 ', _table_body[i].PRODUCTDESC, _table_body[i].PRODUCTCODE)
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
                                        _table_body[i].reMarks = (_table_body[i].Remarks) ?  _table_body[i].Remarks : '';
                                        _table_body[i].REMARK =  (_table_body[i].Remarks) ?  _table_body[i].Remarks : '';
                                       
                                        _table_body[i].deliveryDate =  CalcDate(_table_body[i].delivery)
                                        _table_body[i].QUANTITY =  (_table_body[i].QUANTITY) ? parseFloat(_table_body[i].QUANTITY).toFixed(2) : 0
                                        _table_body[i].ETD =  CalcDate(_table_body[i].delivery)
                                        _table_body[i].Segmentation =  (list['Segmentation']) ? list['Segmentation'] : "Standard Material"
                                        _table_body[i].warrentyTerms =  (list['WarrantyTerms']) ? list['WarrantyTerms'] : "0"
                                        _table_body[i].PRODUCTCODE = (_table_body[i].UNITCOST) ? _table_body[i].PRODUCTCODE : '';  
                                        if(!_table_body[i].AM_ADDR_CODE){
                                            let _default_address = this.props.delivery_address.filter((list)=>{return list.AM_ADDR_CODE==="DA004"})
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
                                        _table_body[i].ITEMLINE  = i 
                                        let _temp_details = Object.assign({},_GetPrDto , _table_body[i])
                                   
                                        _empty_details.push(_temp_details)
                                        _custom_field.push({
                                            "PCD_PR_LINE": _matched_id ,
                                            "PCD_FIELD_NO": "1",
                                            "PCD_FIELD_VALUE": (_table_body[i] && _table_body[i]!==undefined) ? _table_body[i].Segmentation : 'Critical'
                                        })
    
                                        
                                        break; 
                                    }
                                   
                                }
                            // })
                            
                        })
                    }

                    console.log('_empty_details', _empty_details)

                    if(_empty_details.length>0){

                      
                        let _final_datas ={
                            prDto : _details,
                            itemList : _empty_details,
                            type : (this.state.pr_value || this.state.strPrNO)   ? 'mod' : 'new' ,
                            mode : (this.props.location && this.props.location.datas && this.props.location.datas.strType ) ?  this.props.location.datas.strType: 'bc' ,
                            customFieldList : _custom_field,
                        }

                        let _local_details = localStorage.getItem('pr_details')
                        if(_local_details){
                            _local_details = JSON.parse(_local_details);
                            _final_datas.mode = _local_details.strType
                            _details.prType = _local_details.strType
                        }

                        this.setState({
                            loading:true
                        })
                
                        let _status =  await ApiExtract(SavePurchaseRequest, _final_datas)
                        if(_status){
                            if(_status.status){
                                this.setState({
                                    status: _status.status,
                                    validation:true,
                                    modal_body: _status.message,
                                    loading:false,
                                    submit_type:'submit',
                                    pr_value : (_status.response && _status.response.strPrNO && _status.response.strPrNO.length > 0) ?  _status.response.strPrNO[0].cp_param_value : ''
                                })
            
                                
                                
            
                                if((this.state.pr_value && _submit_details=="submit") ||  (this.state.strPrNO && _submit_details=="submit")){
                                    this.setState({
                                        status: false,
                                        validation:false
                                    })
                                    localStorage.setItem('pr_details', JSON.stringify({viewState:'mod', strType:  _details.prType, prid:_status.response.strPrNO[0].cp_param_value}))
                                    localStorage.setItem('pr_approval_flow', JSON.stringify({
                                        pathname:'/prapprovalSelect',
                                        datas: {
                                            'pr_no':  (this.state.pr_value) ? this.state.pr_value : this.state.strPrNO,
                                            'pr_cost': this.state.table_body.reduce((a, val) => a += ((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST) ? val.UNITCOST : 0) + ((val.GST) ? val.GST : 0), 0),
                                            'msg': 0
                                        }
                                    }))
                                    window.location.reload()
                                }
                                else{
                                   localStorage.setItem('pr_details', JSON.stringify({viewState:'mod', strType:  _details.prType, prid:_status.response.strPrNO[0].cp_param_value}))
                                    this.setState({
                                        submit_type:'save'
                                    })
                                }
                                this.props.change('prDto.prNo', _status.response.strPrNO[0].cp_param_value);
                            }
                            else{
                                this.setState({
                                    status: _status.status,
                                    validation:true,
                                    modal_body: _status.message,
                                    loading:false,
                                })
                            }
                        }
                    }
                    else{
                        this.setState({
                            status: false,
                            validation:true,
                            modal_body: 'Please Add a product to submit Purchase Request',
                            loading:false,
                        })
                    }
                }
            }
            else{
              
                this.setState({
                    status: false,
                    validation:true,
                    modal_body: 'Please Update Quantity',
                    loading:false,
                })
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
            _modal_title = "Select Fund Type"

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
            _table_model_body = this.props.delivery_address;
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
            _modal_title = "Select Person Code"
        }

        else if(details.id=="PROJECTCODEDESC"){
            _table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _table_model_body =this.props.fund_type_project_code_l8
            _modal_title = "Select Project / ACR Code"
        }

        else if(details.id=="GLDESCRIPTION"){
            _table_model_header = [
                {name : "Description", id:"DESCRIPTION", key:true},
                {name : "Code", id:"GLCODE"},
            ];
            _table_model_body =(this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode) ? this.props.gl_code.FFRaisePO.dsGLCode : []
            _modal_title = "Select GL Code"
        }

        


        else if(details.id=="Segmentation"){
            _table_model_header = [
                {name : "Description", id:"CF_FIELD_VALUE", key:true},
            ];
             _table_model_body = (this.props.segmentation) ? this.props.segmentation : []
             console.log('_table_model_body', _table_model_body)
             _modal_title = "Select Custom Fields"
        }
        
        
        this.setState({
            modal_popup:true,
            modal_popup_header:_table_model_header,
            modal_popup_title:_modal_title,
            modal_popup_body:_table_model_body,
            model_current_id: details.id,
            pop_size:_modal_size 
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
            "pEnumUploadType": "0",
            "strDocType": "PR",
            "pEnumUploadForm": "0",
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
        if(_file_name == "prDto.internalAttachment" && this.state.internal_file){
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
        else if(_file_name == "prDto.externalAttachment" && this.state.external_file){
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
        if(e.target.name=="prDto.internalAttachment"){
            this.setState({
                internal_file : e.target.files[0],
                internal_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
            })
        }
        else if(e.target.name=="prDto.externalAttachment"){
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
                    temp_data[model_current_id]= e.Address
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

        if(model_current_id=="Segmentation" && e.CF_FIELD_INDEX){
            table_body.forEach((list,index)=>{
                    let _date_name = 'itemList.'+index+'.'+list.PRODUCTCODE+'.Segmentation';
                    console.log('_date_name', _date_name, e)
                    this.props.change(_date_name, e.CF_FIELD_VALUE)
            })
          
        }

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
             _details.pop_size = "lg"
             _details.modal_title = "Select Fund Type"

        }
        else if(_target_name=="deliveryAddress"){
            _details.table_model_header = [
                {name : "Code", id:"AM_ADDR_CODE", key:true},
                {name : "Address", id:"Address"},
                {name : "City", id:"AM_CITY"},
                {name : "State", id:"STATE"},
                {name : "Post Code", id:"AM_POSTCODE"},
                {name : "Country", id:"AM_COUNTRY"},
            ];
             _details.table_model_body = this.props.delivery_address;
             _details.da = [_target_id]
             _details.pop_size = "xl"
             _details.modal_title = "Select Delivery Address"
        }
        else if(_target_name=="costCentre"){
            _details.table_model_header = [
                {name : "Budget Account Code", id:"AM_ACCT_CODE", key:true},
                {name : "Budget Account", id:"AM_ACCT_DESC"},
            ];
             _details.table_model_body = this.props.cost_centre_code;
             _details.ccc = [_target_id]
             _details.pop_size = "xl"
             _details.modal_title = "Select Default Budget Account"
        }
        else if(_target_name=="PERSONCODEDESC"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.fund_transfer_l9 = [_target_id]
            _details.pop_size = "lg"
            _details.table_model_body = this.props.fund_type_project_code_l9
            _details.modal_title = "Select Person Code"
        }

        else if(_target_name=="PROJECTCODEDESC"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
          
             _details.fund_transfer_l8 = [_target_id]
             _details.pop_size = "lg"
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

        else if(_target_name=="Segmentation"){
        //    let {table_body} = this.state
        //    let _temp_date = new Array();
        //    let _temp_dates = new Array();
        //    table_body.forEach((list,index)=>{
        //         let _date_name = 'itemList.'+index+'.'+list.PRODUCTCODE+'.Segmentation';
        //         this.props.change(_date_name, )
        //         _temp_dates.push(e)
        //         _temp_date.push(list);
        //    })
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
            pop_size : _details.pop_size,
            fund_type_project_code_l9 :  _main_details.fund_type_project_code_l9,
            fund_type_project_code_l8 :  _main_details.fund_type_project_code_l8,
            modal_title : _main_details.modal_title

        })
    }

    
    makeDuplicate = async (e) =>{
        let _form_value  = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
        let {table_body, products, slected_items} = this.state;
     
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


    removeItem = async (e, details) =>{
        console.log('removeItem', this.props.request_form)
        let {table_body, products, slected_items, nc_pop_up_details} = this.state;
        console.log('slected_items', slected_items)
        let _form_value  = (this.props.request_form && this.props.request_form.values) ? this.props.request_form.values : {}
        if(slected_items && slected_items.length){
            let _updated = false;
            let _all_table_body = table_body;
            let _all_table_body_selected = slected_items;
            let _get_selected_item_list = slected_items;
            let _nc_pop_up_details = this.state.nc_pop_up_details
            _all_table_body.sort()
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
                    _all_table_body_selected  = _all_table_body_selected.filter((list_element)=> list_element!=list)
                    _nc_pop_up_details = nc_pop_up_details.filter((list_element, index)=> list_element!=list)
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
                    _nc_pop_up_details = nc_pop_up_details.filter((list_element, index)=> list_element!=(list-idx))
                }

                if (idx === array.length - 1){ 
                    console.log('_all_table_body', _all_table_body, list, idx, array)
                    this.setState({
                        delete:true,
                        slected_items : _all_table_body_selected ,
                        table_body: (_all_table_body ? _all_table_body  : []),
                        nc_pop_up_details : _nc_pop_up_details
                    })
                }

                console.log('_all_table_body', _all_table_body, _all_table_body.length)
            })
        }
        else{
            this.setState({
                status: false,
                validation:true,
                modal_body: 'Select Atleast One Line Item to Remove',
                loading:false
            })
        }
        
    }

    commonfunction = async (prDto) => {
        prDto.type = prDto.prDto.prNo === '' || null ? 'new' : 'mod';
        prDto.mode = this.props.location === undefined || null ? 'bc' : 'cc';
        let ss = this.state.Addressvalue[0];
        let billingAddress = {
            "pr_cost": this.state.purchaseRequestDetailsModifiedData.reduce((a, val) => a += (((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST)? val.UNITCOST : 0)) + ((val.GST)? val.GST : 0), 0),
            "AM_ADDR_CODE": ss.AM_ADDR_CODE,
            "AM_ADDR_LINE1": ss.AM_ADDR_LINE1,
            "AM_ADDR_LINE2": ss.AM_ADDR_LINE2,
            "AM_ADDR_LINE3": ss.AM_ADDR_LINE3,
            "AM_POSTCODE": ss.AM_POSTCODE,
            "AM_STATE": ss.AM_STATE,
            "AM_CITY": ss.AM_CITY,
            "AM_COUNTRY": ss.AM_COUNTRY
        }
        Object.assign(prDto.prDto, billingAddress);
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
        const object3 = { ...prDto, ...itemList }
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
       
        if(this.state.strPrNO){
            let _final_datas = {
                PRM_PR_No : this.state.strPrNO
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

     saveItem = async () =>{
        let {table_body, products} = this.state;
        let _date_inst = new Date();
        let _result = true;
      
        if(table_body.length){
            await table_body.forEach((list_details)=>{   
                if(!list_details.hasOwnProperty('removed')){
                    if(!list_details.hasOwnProperty('FUNDTYPEDESC') || !list_details.FUNDTYPEDESC){
                        this.setState({
                            validation:true,
                            modal_title : '',
                            modal_body : 'Please Select valid Fund Type'
                        })
                        _result = false
                    }

                    else if(!list_details.hasOwnProperty('PROJECTCODEDESC') || !list_details.PROJECTCODEDESC){
                        this.setState({
                            validation:true,
                            modal_title : '',
                            modal_body : 'Please Select valid Project / ACR Code'
                        })
                        _result = false
                    }

                
                    
                    else if(!list_details.hasOwnProperty('costCentre') || !list_details.costCentre){
                        this.setState({
                            validation:true,
                            modal_title : '',
                            modal_body : 'Please Select valid Cost Centre Code'
                        })
                        _result = false
                    }

                    else if(!list_details.hasOwnProperty('deliveryAddress') || !list_details.deliveryAddress){
                        this.setState({
                            validation:true,
                            modal_title : '',
                            modal_body : 'Please Select valid Delivery Address'
                        })
                        _result = false
                    }

                    else if(!list_details.hasOwnProperty('QUANTITY') || (list_details.QUANTITY<=0) || (list_details.QUANTITY=='')){
                        this.setState({
                            validation:true,
                            modal_title : '',
                            modal_body : 'Please enter valid quantity'
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


    confirm_function = (type, text) => {
        
        if(type=="delete"){
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
                confimation:true,
                confimation_pop:true,
                confimation_type : type,
                status_text : text,
                modal_body: `Are you sure that you want to ${text}`,
            })
        }
       

    }

    render(){
    
     console.log('get_nc_popup', this.state.table_body)
     const { handleSubmit } = this.props
        const _table_header = [
            // {name : "Line", id:"ITEMINDEX", key:true, width:'100px'},
            {name : "Gift", id:"GIFT",type:"select",key:false, value:[{value:"N", name:"NO"}, {value:"Y", name:"YES"}], width:'100px'},
            {name : "Fund Type (L1)", id:"FUNDTYPEDESC", type:"click", width:'148px', dataFormat:'select'},
            {name : "Person Code (L9)", id:"PERSONCODEDESC", type:"click", width:'138px'},
            {name : "Project / ACR (L8) Code ", id:"PROJECTCODEDESC", type:"click", width:'157px'},
            {name : "Item Code", id:"VENDORITEMCODE", width:'100px', type:"product_link"},
            {name : "GL Description (GL CODE)", id:"GLDESCRIPTION",type:"click", key:false, width:'150px'},
            {name : "Category Code", id:"CATEGORYCODE", key:false,width:'100px', value:[{value:"0", name:"yes"},{value:"1", name:"no"}], width:'100px'},,
            {name : "Item Name", id:"PRODUCTDESC", key:false, width:'150px'},
            {name : "Quantity", id:"QUANTITY", key:false,type:"number", width:'79px'},
            {name : "Commodity Type", id:"COMMODITY", key:false, disabled:true, width:'150px'},
            {name : "UOM", id:"UOM",  disabled:true, width:'100px'},
            {name : "Currency", id:"CURRENCY", key:false, width:'100px'},
            {name : "Contract Price", id:"UNITCOST", key:false,  width:'100px', type:"price" , align:'right'},
            {name : "Amount", id:"AMOUNT", key:false, width:'100px', type:"price", align:'right'},
            {name : "SST Rate", id:"GSTRate", key:false, width:'100px', type:"price", align:'right'},
            {name : "SST Amount", id:"GST", key:false, width:'100px', type:"price", align:'right'},
            {name : "SST Tax Code (Purchase, L6)", id:"GstTaxCode", key:false, width:'100px'},
            {name : "Cost Centre Code (L7)", id:"costCentre", key:false, type:"click", width:'114px'},
            {name : "Delivery Address", id:"deliveryAddress", key:false, type:"click", width:'134px'},
            {name : "Est. Date of Delivery (dd/mm/yyyy)", id:"delivery", key:false, type:"date", width:'143px'},
            {name : "Warranty Terms (months)", id:"WarrantyTerms", key:false, type:"number", width:'107px'},
            {name : "Segmentation", id:"Segmentation", key:false, type:"select_click", width:'120px',value:this.props.segmentation},
            {name : "Remarks", id:"Remarks", key:false,type:"textarea", width:'200px'},
        ];

        if(this.props.location && this.props.location.datas && this.props.location.datas.strType=="bc"){
            _table_header[13].name = "Last Txn Price"
        }
        if(this.props.location && !this.props.location.datas ){
            _table_header[13].name = "Last Txn Price"
        }

        


        return <Fragment>
            <PageHeading 
                heading="Raise Purchase Request" 
                subheading="Fill in the required field(s) and click the Save button to create the PR or Submit button to submit the PR." 
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
            
              
              <TabHeading color={'bg-info'}>Purchase Request Header</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefiltersubmit.bind(this))}>
                
               
                <div className="row mt-2">    
                    <div className='col-12 col-md-6'>
                        <div className="row mt-2">    
                      
                            <Field type="text" name="prDto.prNo" component={FromInputs} className="form-control" placeholder="To be Allocated by the system" label="PR Number : " readonly={true} />
                        </div>
                        <div className="row mt-2">    
                            <Field type="text" name="prDto.requestName" component={FromInputs} className="form-control" placeholder="Requester Name" label="Requester Name : " readonly={true} />
                        </div>
                        <div className="row mt-2">    
                            <Field type="text" name="prDto.requestContact" component={FromInputs} className="form-control" placeholder="Requester Contact" label="Requester Contact : " />
                        </div>
                        <div className="row mt-2">  
                            <Field type="text" name="prDto.internalRemarks" component={FromInputs} className="form-control" placeholder="Internal Remarks " label="Internal Remarks : " />
                        </div>
                        <div className="row mt-2">  
                            <FromUplods name="prDto.internalAttachment" id ="internal_attachment" decs=" Recommended file size is 10240 KB" label="Internal Attachment" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.internal_file_name}/> 
                        </div>
                        <div className="row mt-2">  
                            <div className="col-12">
                                <div className="">
                                    <label className="auto_width">Internal Attachment : </label>
                                    {(this.state.internal_attachment && this.state.internal_attachment.length) ? this.state.internal_attachment.map((val, index) => {
                                        if (val.CDA_TYPE === 'I') {
                                            console.log('internal_attachment', val)
                                            return <p className="downloadPointer"><u><span onClick={()=>this.download_file(val)}>{(val.strFile1) ? val.strFile :val.CDA_ATTACH_FILENAME} &nbsp;&nbsp;</span></u> <span className="btn btn-sm btn-danger delete-doc" onClick={() => this.deleteFile(val, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    }) : <div className="auto_width">No files attached</div>}
                                </div>
                            </div>
                        </div>
                    </div>   
                    
                    <div className='col-12 col-md-6'>
                        <div className="row mt-2">  
                            <Field type="text" name="prDto.date" selected={this.state.date_details} dateformate="DD/MM/YYYY" component={FormDatePicker} minDate = {new Date()} className="form-control" placeholder="Date " label="Date :"   onChange={this.handleDate.bind(this)} readonly={true}/>       
                        </div>
                        <div className="row mt-2">  
                            <Field type="text" name="prDto.attentionTo" component={FromInputs} className="form-control" placeholder="Attention To" label="Attention To : " />       
                        </div>
                        <div className="row mt-2">  
                            <Field type="text" name="prDto.externalRemarks" component={FromInputs} className="form-control" placeholder="External Remarks" label="External Remarks : "  />
                        </div>
                        <div className="row mt-2">  
                        </div>
                        <div className="row mt-2">  
                            <FromUplods name="prDto.externalAttachment" id ="external_attachment" decs="Recommended file size is 10240 KB" label="External Attachment " buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                           
                        </div>
                        <div className="row mt-2"> 
                            <div className="col-12">
                                <label  className="auto_width">External Attachment : </label>
                                {(this.state.extrnal_attachment && this.state.extrnal_attachment.length>=1) ? this.state.extrnal_attachment.map((val, index) => {
                                    if (val.CDA_TYPE === 'E') {
                                        return <p className="downloadPointer"><u><span onClick={()=>this.download_file(val)}>{(val.strFile) ? val.strFile :val.CDA_ATTACH_FILENAME} &nbsp;&nbsp;</span></u> <span className="btn btn-sm btn-danger delete-doc" onClick={() => this.deleteFile(val, 'E')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                    }
                                 }): <div className="auto_width">No files attached</div>}
                            </div>
                        </div>
                   
                    
                        <div className="row mt-2">  
                        <Field  id="prDto.Urgent" component={FromCheckBox} type="checkbox" name="prDto.Urgent" label="Urgent " checked={this.state.Urgent} onClick={()=>{this.setState({
                            Urgent : (this.state.Urgent) ? false : true 
                        })}} />
                        </div>
                        <div className="row mt-2">    
                            <div className="col-12"> 
                                <p>If you do not want "Custom Fields" or"Remark" to appear in PO, please uncheck the appropriate boxes. :</p>
                                <div className="row mt-2">
                                
                                    <Field  id="custom_fields" component={FromCheckBoxFull} type="checkbox" name="prDto.PrintCustom" label="Custom Fields" checked={this.state.form_checks.includes(0)} />
                                    <Field  id="remark" component={FromCheckBoxFull} type="checkbox" name="prDto.PrintRemark" label="Remark" checked={this.state.form_checks.includes(1)} />
                                  
                                </div>
                            </div>
                        </div>
                    </div>   
                </div> 
                
                <div className="row mt-2">    
                    <div className='col-12 quantity-pr'>   
                      
                        
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.state.table_body && this.state.table_body.length > 0) ? this.state.table_body : []} 
                            products={this.getProducts} 
                            select={true} 
                            serial={true}
                            selected_items={this.state.slected_items}
                            serial_text={'Line'}
                            selectname={'itemcode'} 
                            responsive={true} 
                            headerclick={this.handleheaderlinks}
                            extratotal={true}
                            colcount={_table_header.length}
                            subtotal={(this.state.table_body && this.state.table_body.length>0) ? this.state.table_body.reduce((a, val) => a += ((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST) ? val.UNITCOST : 0) , 0) : 0}
                            sstamount={(this.state.table_body && this.state.table_body.length>0) ? this.state.table_body.reduce((a, val) => a += (val.GST) ? val.GST : 0 , 0).toFixed(2) : 0}
                            grandtotal={(this.state.table_body && this.state.table_body.length>0) ? this.state.table_body.reduce((a, val) =>
                                a += (((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST) ? val.UNITCOST : 0)) + ((val.GST) ? val.GST : 0), 0) : 0}
                            table_id="line"
                            segmentation = {(this.props.segmentation) ? this.props.segmentation : []}
                            changefunction = {this.handleChange}
                            inputPrefix  = 'itemList'
                            handle_popup = {this.handlePopup}
                            handle_date={this.handleDateTable.bind(this)}
                            dates={this.state.dates}
                            select_function_inex = {this.select_function_inex}
                            handledate = {this.handledate.bind(this)}
                            handledateHeader = {this.handledateHeader.bind(this)}
                            main_date = ''
                            change={this.props.change}
                            product_details = {this.getPage_details}
                            select_change = {this.SelecthandleChange}
                        />


                    </div>
                </div>
                <div className="col-12 mt-3 text-center">
                    <button className="btn btn-sm btn-outline-success" onClick={handleSubmit(values => this.handlefiltersubmit({  ...values, submit_type: 'save'}))} type="button">Save</button>
                    <button className="btn btn-sm btn-outline-primary ml-2" onClick={handleSubmit(values => this.handlefiltersubmit({  ...values, submit_type: 'submit'}))}>Submit</button>
                    <button className="btn btn-sm btn-outline-info ml-2" type="button" onClick={(e)=>this.addItem(e)}>Add Item</button>
                    <button className="btn btn-sm btn-outline-secondary ml-2" type="button" onClick={()=>this.confirm_function('delete', ' permanently delete this item(s)?')}>Remove Item</button>
                    <button className="btn btn-sm btn-outline-danger ml-2"  type="button"    onClick={(e)=>this.makeDuplicate(e)}>Duplicate Line Item </button>
                    <button  disabled={(this.state.strPrNO=='') ? true : false} className= {(this.state.strPrNO) ? "btn btn-sm btn-outline-danger ml-2 " : "btn btn-sm btn-outline-danger disabled ml-2" }  type="button"  onClick={(e)=>this.void_pr(e)}>Void PR </button>
                </div>
                </form>
            
              
                <Modal size="lg" open={this.state.addmodel} header ={true} title ={'Add Item'} closemodel={this.closeModel}>
                   {(this.props.location && this.props.location.datas && this.props.location.datas.strType && (this.props.location.datas.strType!="cc" && this.props.location.datas.strType!="Contract" && this.state.nc_type!="cc")) ?
                       
                       <Fragment>
                           
                            <label className="mr-2" ><input type="radio" name="form_type" id="radio1" value="Non-Contract"   onClick={(e)=>this.setState({nc_type:'nc'})} checked={(this.state.nc_type=='nc' || this.state.nnc_typec=='') ? true : false}/>Buyer Catalogue Item </label> 
                                <br></br>
                            <label><input type="radio" name="form_type" id="radio1" value="Contract" onClick={(e)=>this.setState({nc_type:'ff'})} checked={(this.state.nc_type=='ff') ? true : false}/>Free Form</label>
                        </Fragment>
                    : (this.props.location && this.props.location.datas && this.props.location.datas.strType && (this.props.location.datas.strType=="cc"|| this.props.location.datas.strType=="Contract" || this.state.nc_type=="cc" ) ) ?  ''  : 
                    <Fragment> 
                            {(this.state.nc_type!='cc') ? 
                              <Fragment> 
                                <label className="mr-2" ><input type="radio" name="form_type" id="radio1" value="Non-Contract"    onClick={(e)=>this.setState({nc_type:'nc'})} checked={(this.state.nc_type=='nc' || this.state.nc_type=='') ? true : false}/>Buyer Catalogue Item </label> 
                                    <br></br>
                                <label><input type="radio" name="form_type" id="radio1" value="Contract" onClick={(e)=>this.setState({nc_type:'ff'})} checked={(this.state.nc_type=='ff') ? true : false}/>Free Form</label>
                                </Fragment>
                            :''}
                    </Fragment>
                   }
                    
                    {(this.props.location && this.props.location.datas && (this.props.location.datas.strType=="cc"|| this.props.location.datas.strType=="Contract")) ?<CategoPopup select getdata={this.receiveproducts} closemodel={this.closeModel}  /> : ''}
                    {(this.props.location && this.props.location.datas && (this.props.location.datas.strType=="bc" || this.props.location.datas.strType=="Non-Contract") && this.state.nc_type=="nc") ? <BuyerCatalogue select getdata={this.receiveproducts} closemodel={this.closeModel}  /> : ''}
                    {(this.props.location && this.props.location.datas && (this.props.location.datas.strType=="bc" || this.props.location.datas.strType=="Non-Contract") && this.state.nc_type=="ff") ? <FreeForm type="ff" select getdata={this.receiveproducts} closemodel={this.closeModel}  /> : ''}
                    {(this.props.location && !this.props.location.datas && this.state.nc_type=="cc") ? <CategoPopup select getdata={this.receiveproducts} closemodel={this.closeModel}  /> : ''}
                    {(this.props.location && !this.props.location.datas && this.state.nc_type=="nc") ? <BuyerCatalogue select getdata={this.receiveproducts} closemodel={this.closeModel}  />  : ''}
                    {(this.props.location && !this.props.location.datas && this.state.nc_type=="ff") ? <FreeForm type="ff" select getdata={this.receiveproducts} closemodel={this.closeModel}  />  : ''}
                 
                   
                </Modal>
                <Modal size={this.state.pop_size} open={this.state.model} header ={true} title ={this.state.modal_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
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
                    title={''} 
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
                <Modal size="lg" open={this.state.modal_popup} header ={true} title ={this.state.modal_popup_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.updateData }>Save</button> : ''}
                        <button type='button' size={this.state.pop_size} className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
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
    form:'po_request_main',
    enableReinitialize : true,
    destroyOnUnmount : true,
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


export default Request;
