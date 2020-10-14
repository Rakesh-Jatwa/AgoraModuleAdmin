import React,{Component, Fragment} from 'react';
import { FromInputs, FromUplods, FromSelect, FormDatePicker} from '../../../../../Component/From/FromInputs'
import {connect} from 'react-redux';
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {Field, reduxForm} from 'redux-form';
import BootstrapCustomTable from '../../../../../Component/Table/e2ptable'
import Alert from '../../../../../Component/Modal/alert'
import { GetContinueDocument, e2pItemsmultiple} from '../../../../../Actions/Common'
import Modal from '../../../../../Component/Modal'
import BootstrapTable from '../../../../../Component/Table/BootstrapCustomTablePr'
let serial = 0;

class Document extends Component{
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.handleformsubmit = this.handleformsubmit.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updateData = this.updateData.bind(this)
        this.handlePopup = this.handlePopup.bind(this)
        this.getSelectedProduct = this.getSelectedProduct.bind(this)
        this.getPopupSelectedProduct = this.getPopupSelectedProduct.bind(this)
        this.select_function_inex = this.select_function_inex.bind(this)
        this.receiveproducts = this.receiveproducts.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.handledateHeader = this.handledateHeader.bind(this)
        this.SelecthandleChange = this.SelecthandleChange.bind(this)
        this.emptySelectedProduct = this.emptySelectedProduct.bind(this)
        this.emptyPopupSelectedProduct = this.emptyPopupSelectedProduct.bind(this)
        this.handlepopformsubmit = this.handlepopformsubmit.bind(this)
        this.state = {
            table_body :  [],
            table_model_header : [
                {name : "Description", id:"description", key:true},
                {name : "Code", id:"code"},
            ],
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
            total : 0,
            InvIdx :'',
            table_modal_popup : '',
            local_render : false,
            loaded_details : {},
            custom_modal_popup : false,
            custom_modal_type:'All',
            custim_model_check_box : '0',
            custim_model_text_value : '',
            custim_model_taxtarea_value : '',
            re_render_registered_field : true,
        }
    }

    handlepopformsubmit = () =>{
    }

    convert_datas = () =>{

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

    static async getDerivedStateFromProps (nextProps, prevState){
        let _details_main = prevState
       if((!prevState.rendered) && nextProps.location && nextProps.location.datas && nextProps.location.datas.productList && prevState.table_body && nextProps.purchased_items &&  nextProps.purchased_items.getPurchaseRequestItemsDetails && prevState.table_body.length != nextProps.purchased_items.getPurchaseRequestItemsDetails){
            _details_main.rendered = true;
            _details_main.redate =  true;
            _details_main.slected_items = []
            _details_main.table_body = nextProps.purchased_items.getPurchaseRequestItemsDetails
            _details_main.table_body = await _details_main.table_body.map((list_details)=>{
                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_LINE1==="Level 9, Agency Distribution,"})
                    if(_default_address.length){
                        
                        return list_details.deliveryAddress = _default_address[0].AM_ADDR_LINE1
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
            _details_main.table_body = await _details_main.table_body.map((list_details)=>{

                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_LINE1==="evel 9, Agency Distribution,"})
                    if(_default_address.length){
                        return list_details.deliveryAddress = _default_address[0].AM_ADDR_LINE1
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
            _details_main.table_body = await _details_main.table_body.map((list_details)=>{

                if(nextProps.delivery_address.length){
                    let _default_address = nextProps.delivery_address.filter((list)=>{return list.AM_ADDR_LINE1==="Level 9, Agency Distribution,"})
                    if(_default_address.length){
                        return list_details.deliveryAddress = _default_address[0].AM_ADDR_LINE1
                    }
                }
                return list_details
            })
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

    async componentDidMount(){
        // this.props.reset('request_popup')
        let _details = e2pItemsmultiple()
        let _temp_details = this.props.fund_type_project_code_l1
        console.log('_temp_details', _temp_details)
        if(_temp_details && _temp_details.length){
            console.log('_temp_details', _temp_details)
        }
        this.setState({
            table_body : _details
        })
        
    
       
                

    }

    closeModel (details){
        this.setState({
            addmodel : false,
            validation:false,
            table_modal_popup : false,
            custom_modal_popup : false,
        })
        if(this.state.InvIdx){
            window.location.reload()
        }
    }

    updateWithholdData = (_details) =>{
        let {table_body} = this.state
        if(table_body && table_body.length){
            if(this.state.custom_modal_type=="All"){
                table_body.forEach((list_details, index)=>{
                    table_body[index].ID_WITHHOLDING_TAX =  this.state.custim_model_text_value
                    table_body[index].ID_WITHHOLDING_OPT =  this.state.custim_model_check_box
                    table_body[index].ID_WITHHOLDING_REMARKS = this.state.custim_model_taxtarea_value
                })
            }
            else{
                table_body.forEach((list_details, index)=>{
                    if(index==this.state.custom_modal_type){
                        table_body[index].ID_WITHHOLDING_TAX =  this.state.custim_model_text_value
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
                  let _item_details = this.props.purchased_items.getPurchaseRequestItemsDetails[1];
                  let _details = (_main_details && _main_details[0]) ? _main_details[0] : {};
                  let _temp_array = new Array();
                  let _user_details = {
                      prNo : _details.PRM_PR_NO,
                      requestName : _details.PRM_REQ_NAME,
                      requestContact : _details.PRM_REQ_PHONE,
                      internalRemarks : _details.PRM_INTERNAL_REMARK,
                      date : _details.PRM_CREATED_DATE,
                      attentionTo : _details.PRM_S_ATTN,
                      externalRemarks : _details.PRM_EXTERNAL_REMARK,
                      Urgent : (_details.PRM_URGENT=="1") ? true : false,
                      PrintCustom : 1,
                      PrintRemark : 1,
                  }
                  _pr_numner = _user_details.prNo;
                  _item_details.forEach((item_details, index)=>{
                    let delivery = [item_details.PRODUCTCODE];
                    let _build_array = new Object()
                    _build_array = {
                        [delivery] : { 
                            "GIFT":item_details.GIFT,
                            "delivery" :new Date(),
                            "QUANTITY": item_details.QUANTITY,
                            'WarrantyTerms' : item_details.WARRANTYTERMS,
                            'Segmentation' :  item_details.PCD_FIELD_VALUE,
                            'ETD' : item_details.ETD,
                            'Remarks' : item_details.REMARK
                        }
                    }

                   
                    _temp_array.push(_build_array)
                  })
                  let _main_object = {
                      e2psearch : Object.assign({}, _details, _user_details),
                      itemList : _temp_array
                  }

                 
        

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
                        _item_details.ID_ANALYSIS_CODE1  = 'ITNP'
                        _item_details.FUNDTYPEDESC  = 'IT Non-Linked-Par Fund'
                        _item_details.FUNDTYPE  = 'IT Non-Linked-Par Fund'
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
        if(this.state.redate){
           if(this.state.table_body && this.state.table_body.length){
                this.state.table_body.forEach((item_details, index)=>{
                     let _new_date = new Date((new Date()).valueOf() + 1000*3600*24);
                    let _delivery = 'itemList.'+index+'.'+index+'.delivery';
                    this.props.change(_delivery, _new_date)
                })
            }
            this.setState({
             redate:false
           })
        }

        if(this.state.re_render_registered_field && this.state.table_body.length > 0){
            this.state.table_body.forEach((list, index)=>{
                let _details_main = `itemList_popup.${index}.${index}`
                this.props.change(`${_details_main}.ID_GST_REIMB`, 'R')
                this.props.change(`${_details_main}.ID_CATEGORY`, 'Mixed')
            })
            this.setState({
                re_render_registered_field : false
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

            if(_qty_input == "ID_REF_NO"){
                table_element_value['ID_REF_NO']  =   event.target.value
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
            sst_amount : _sst_amount
        })

       

        return event.target.value;
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
            custom_modal_type:'All',
            modal_popup_header:_table_model_header,
            modal_popup_title:_modal_title,
            modal_popup_body:_table_model_body,
            model_current_id: details.id,
        })
       
    }

    updateData() {
    }

   


    closemodel = () => {
        this.setState({
            model : false,
            modal_popup : false,
            open:false,
            table_modal_popup : false,
            custom_modal_popup : false,
        })
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
            table_model_body :[],
            model : false ,
            current_model : '',
            current_id : ''
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
            table_body: _final_result,
            table_model_body :[],
            modal_popup : false ,
            model_current_id : ''
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

    handle_checkbox = (_vlaue) =>{
        this.setState({
            custim_model_check_box : _vlaue
        })
    }

    handlePopup(input,details){

        let _get_all_state = this.state;
        let _target_id = input.target.getAttribute('data-name');
        let _target_name = input.target.getAttribute('data-details');
        let _details = {
            model : true ,
            table_display :true,
            custom_modal_popup : false,
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
            _details.model  = false
            _details.custom_modal_popup = true
        }


        let _main_details = Object.assign({}, _get_all_state, _details)
        this.setState({
            table_modal_popup : _main_details.model,
            custom_modal_popup : _main_details.custom_modal_popup,
            custom_modal_type: _main_details.current_id,
            table_display : _main_details.table_display,
            current_model :  _main_details.current_model,
            current_id :  _main_details.current_id,
            table_model_header :  _main_details.table_model_header,
            table_model_body :  _main_details.table_model_body,
            
            ccc :  _main_details.ccc,
            da :  _main_details.da,
            modal_body:'',
            modal_title : _main_details.modal_title

        })
    }

  
    


    

    addItem = () => {
        this.setState({
            addmodel:true
        })
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

    HandleDocumentPop = async() =>{
        let {table_body} = this.state
        let _inial_status = false
            table_body =  table_body.filter((list_details)=>list_details.ID_PRODUCT_DESC && list_details.ID_B_GL_CODE)
            if(table_body.length>0){
                let _details = await this.saveItem(table_body)
                if(_details){
                    await table_body.forEach((list, index)=>{
                        _inial_status = _details
                        let _details_main = `itemList_popup.${index}.${index}`
                        this.props.change(`${_details_main}.ID_PAY_FOR`, '')
                        this.props.change(`${_details_main}.ID_GST_REIMB`, '')
                        this.props.change(`${_details_main}.ID_PRODUCT_DESC`, '')
                        this.props.change(`${_details_main}.ID_UNIT_COST`,'')
                        this.props.change(`${_details_main}.ID_GST_VALUE`,'')
                        this.props.change(`${_details_main}.ID_GST_INPUT_TAX_CODE`,'')
                        this.props.change(`${_details_main}.ID_CATEGORY`,'')
                    })
                    this.props.updateData(table_body)
                }
            }
            else{
                this.setState({
                    validation:true,
                    modal_title : 'Validation',
                    modal_body : 'GL Code is required'
                })
            }
    }
        
    

    HideDocumentPopup = async() =>{
        let {table_body} = this.state
        table_body =  table_body.filter((list_details)=>list_details.ID_PRODUCT_DESC && list_details.ID_B_GL_CODE)
        if(table_body.length>0){
            await table_body.forEach((list, index)=>{
                let _details_main = `itemList_popup.${index}.${index}`
                this.props.change(`${_details_main}.ID_PAY_FOR`, '')
                this.props.change(`${_details_main}.ID_GST_REIMB`, '')
                this.props.change(`${_details_main}.ID_PRODUCT_DESC`, '')
                this.props.change(`${_details_main}.ID_UNIT_COST`,'')
                this.props.change(`${_details_main}.ID_GST_VALUE`,'')
                this.props.change(`${_details_main}.ID_GST_INPUT_TAX_CODE`,'')
                this.props.change(`${_details_main}.ID_CATEGORY`,'')
            })
        }
        this.props.HideAddline()
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

      saveItem = async (table_body) =>{
        let _date_inst = new Date();
        let _result = true;
      
        if(table_body.length>0){
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
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'GL Code is required'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('ID_GST_INPUT_TAX_CODE') || !list_details.ID_GST_INPUT_TAX_CODE){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Input Tax Code is required'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('PROJECTCODEDESC') || !list_details.PROJECTCODEDESC){
                    this.setState({
                        validation:true,
                        modal_title : 'Validation',
                        modal_body : 'Project Code is required'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('costCentre') || !list_details.costCentre){
                    this.setState({
                        validation:true,
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
        return false
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
        this.setState({
            table_body : _table_body
        })

    }

    

    render(){
        let _sub_total  = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) =>a += (parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST)), 0) : 0;
        let _sub_gst  = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat(val.ID_GST_VALUE),  0) : 0;
        let _sst_output_tax = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat((val.ID_RECEIVED_QTY * val.ID_UNIT_COST)*(val.ID_GST/100)),  0) : 0;
        let _total  = parseFloat(_sub_gst) + parseFloat(_sub_total) + parseFloat(_sst_output_tax)

        let { handleSubmit } = this.props
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

        return <Fragment>
                    <BootstrapCustomTable 
                        table_header={_table_header} 
                        table_body={this.state.table_body} 
                        products={this.getProducts} 
                        select={false} 
                        serial={true}
                        selected_items={this.state.slected_items}
                        serial_text={'Line'}
                        selectname={'itemcode'} 
                        responsive={true} 
                        headerclick={this.handleheaderlinks}
                        extratotal={true}
                        colcount={_table_header.length}
                        subtotal={_sub_total}
                        sstamount={_sub_gst}
                        sstamount_out={_sst_output_tax}
                        grandtotal={_total}
                        table_id="line"
                        segmentation = {(this.props.segmentation) ? this.props.segmentation : []}
                        changefunction = {this.handleChange}
                        inputPrefix = 'itemList_popup'
                        handle_popup= {this.handlePopup}
                        handle_date={this.handleDateTable.bind(this)}
                        dates={this.state.dates}
                        select_function_inex = {this.select_function_inex}
                        handledate = {this.handledate.bind(this)}
                        select_change = {this.SelecthandleChange}
                        handledateHeader = {this.handledateHeader.bind(this)}
                        main_date = ''
                        change={this.props.change}
                        delete={false}
                    />
                     <div className="col-12 mt-3 text-center">
                        <button className="btn btn-sm btn-outline-success ml-2" type="button" onClick = {this.HandleDocumentPop} >Save</button>
                        <button className="btn btn-sm btn-outline-danger ml-2" type="button" onClick={()=>this.HideDocumentPopup()} >Close</button> 
                    </div>    
                        
                        <Modal closemodel={ this.closemodel } size="lg" open={this.state.table_modal_popup} header ={true} title ={this.state.modal_title} footer={true} footercontent={<Fragment>
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
                <Modal className="modal-table-display" size="lg" open={this.state.custom_modal_popup} header ={true} title ={"Withholding Tax"} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.updateWithholdData }>Save</button> : ''}
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                       <table className="table table-striped">
                           <tbody>
                                <tr>
                                    <td style={{"width": "150px"}}>Withholding Tax : </td>
                                    <td style={{"width": "120px"}} ><input onChange={(e)=>{this.setState({ custim_model_text_value : e.target.value })}} type="text" className="form-control" disabled={(this.state.custim_model_check_box=='2') ? 'disabled' : ''} /></td>
                                    <td style={{"width": "50px"}} >%</td>
                                    <td >
                                        <input type="radio" onClick={(e)=>this.handle_checkbox(e.target.value)} value="0" name="tax_type" /> WHT applicable and payable by Company
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="radio"  onClick={(e)=>this.handle_checkbox(e.target.value)} value="1" name="tax_type"  /> WHT applicable and payable by Vendor
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="radio"  onClick={(e)=>this.handle_checkbox(e.target.value)} value="2" name="tax_type"  /> Not Applicable
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        If Not Please Key in the lateReason
                                        <textarea onChange={(e)=>{this.setState({
                                            custim_model_taxtarea_value : e.target.value
                                         })}} className="form-control" disabled={(this.state.custim_model_check_box=='0' || this.state.custim_model_check_box=='1') ? 'disabled' : ''} >  </textarea>
                                    </td>
                                </tr>
                           </tbody>
                       </table>
                    
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
              <Alert 
                    title={''} 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.validation} 
                    confirm={this.closeModel}
                />
               
     </Fragment>
    }
}

Request = reduxForm({
    form:'request_popup',
    enableReinitialize : true,
    destroyOnUnmount :false,
    
})(Document)

export default Request;
