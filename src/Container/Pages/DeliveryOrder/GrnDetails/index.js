import React, {Component, Fragment } from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import {FromInputsParallel,FormDatePickerParallel, FromUplodsParallel } from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../Component/Loader' 
import {TodayDateSalash, TodayDate, convertDateToYear, addDate} from '../../../../Component/Dates'
import Enum from '../../../../Common/GlobalEnum'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {HandlePaymentTerm, CheckFileDetails} from '../../../../Actions/Common/Functions'
import {UploadDocuments, GetGenerateDOPDF} from '../../../../Actions/Requester'
import { GetDoSearch,GetViewDOClick,GetDownloadFile,GetDeleteFile} from '../../../../Actions/Vendor'
import {SaveDo, DeleteDO} from '../../../../Apis/Vendor'
import {floatnumbers_length_6} from '../../../../validation/TableValidation'
import {connect} from 'react-redux';





class IssueGRN extends Component {

    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)
        this.get_dopdf_details = this.get_dopdf_details.bind(this)
        this.closemodel = this.closemodel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.SendUpload = this.SendUpload.bind(this)
        this.FileUpload = this.FileUpload.bind(this);
        this.handleTableInputs = this.handleTableInputs.bind(this);
        this.state = {
            products : [],
            start_data:new Date(),
            end_data:new Date(),
            file_name:'',
            files:[],
            table_inputs:[],
            modal_title:'',
            modal_body:'',
            model:false,
            status:true,
            loading:false,
            attachment : [],
            delete : false, 
            rendered:true,
            save_rendered:false,
            render_table_input:false,
            submit_type:'save',
            number : ''
        }
    }

     static getDerivedStateFromProps(props, state){

        if((state.rendered) && (props.get_issue_grn) && (props.get_issue_grn.attachFileList)){
            return {
                rendered:false,
                save_rendered:true,
                attachment:props.get_issue_grn.attachFileList
            }
        }
        else if((!state.delete) && (!state.rendered) && (props.upload_document) && (props.upload_document.displayAttachFile)){
            return {
                attachment:props.upload_document.displayAttachFile
            }
        }
        else if( (!state.rendered) && state.delete && (props.file_delete) && (props.file_delete.displayAttachFile)){
            return {
                attachment:props.file_delete.displayAttachFile
            }
        }
        return {props, state}
    }


    closemodel = () => {
        this.setState({
            model : false,
            modal_body:'',
        })
        if(this.state.status && this.state.submit_type=="Submit"){
            this.props.CloseGrn()
        }
        else if(this.state.status && this.state.submit_type=="Save"){
            let _post_data = this.props.datas
            this.props.post_issue_grn(_post_data);
        }
        else if(this.state.status && this.state.submit_type=="delete"){
            this.props.clear_download();
            this.props.CloseGrn()
        }
       
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

    componentDidMount(){
        this.props.reset('DeliveryOrderView')
        this.setState({
            products : this.props.datas,
            model:false,
            modal_body :'',
        })
        let _post_data =  this.props.datas;
        this.props.post_issue_grn(_post_data);
        this.props.change('ApproveDto.DOM_S_REF_DATE', new Date())
    }

    componentDidUpdate(){
       if(this.state.save_rendered){
           if(this.props.get_issue_grn && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.DO_MSTR && this.props.get_issue_grn.poDetailsList.DO_MSTR.length>0){
              let _enterd_details = this.props.get_issue_grn.poDetailsList.DO_MSTR[0];
               _enterd_details.DOM_S_REF_DATE = TodayDateSalash(_enterd_details.DOM_S_REF_DATE)
                this.props.initialize({
                    ApproveDto : _enterd_details
               })
           }
           this.setState({
            save_rendered:false
           })
       }

       if(this.props.get_issue_grn && this.props.get_issue_grn.poDetailsList  && this.props.get_issue_grn.poDetailsList.PO_DETAILS && this.state.render_table_input==false){
            let _temp_details = this.props.get_issue_grn.poDetailsList.PO_DETAILS;
            if(_temp_details.length){
                let _temp_array = new Array();
                _temp_details.forEach((enumObject, index)=>{
                let _ship_qty = (enumObject.DOD_SHIPPED_QTY==null) ? enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY : enumObject.DOD_SHIPPED_QTY
                    // if(_ship_qty>0){
                        _temp_array[index] = {
                            Outs : parseFloat(_ship_qty).toFixed(2),
                            DOD_REMARKS : enumObject.DOD_REMARKS
                       }
                    // }
                })
                if(_temp_array.length){
                    this.setState({
                        table_inputs : _temp_array,
                        render_table_input : true 
                    })
                }
            }
           
       }
    }

    handlefromsubmit(values){
        
        let _form_value = values;
        let _initial_obj = {
            PoNumber: "",
            DoNumber: "",
        }
        _form_value.issueGrn = Object.assign({}, _initial_obj,(_form_value.issueGrn) ? _form_value.issueGrn : _form_value )
        this.props.post_issue_grn(_form_value);
    }

    get_details(details){
        this.props.history.push({
            pathname : '/deliveryorderview',
            datas : details.datas,
        })
    }

    FileUpload = (attachment) => {
        this.setState({delete:false})
        let _get_details  = attachment.target;
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        
        let req = {
            "pEnumUploadType": Enum.EnumUploadType.DOAttachment,
            "strDocType": "DO",
            "pEnumUploadForm":  Enum.EnumUploadFrom.FrontOff,
            "strDocNo": (this.props.get_issue_grn  && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.DO_MSTR  &&this.props.get_issue_grn.poDetailsList.DO_MSTR.length) ? this.props.get_issue_grn.poDetailsList.DO_MSTR[0].DOM_DO_NO :'' ,
            "blnTemp": "true",
            "strIndex": "",
            "seq": "",
            "pFrontOfficeSite": "",
            "AttachType": "H",
            "ItemCode": "",
            "LineNo": "",
            "POLine": "H",
            "modeType": "New"
        }
        if(this.state.internal_file && _file_name == "ApproveDto.internalAttachment"){
            req.AttachType = 'H';
            
            this.props.UploadDocuments(this.state.internal_file, req)
            attachment.value="";
             this.setState({
                delete:false,
                internal_file:'',
                internal_file_name:'',
                external_file:'',
                external_file_name:''
            })
            
        }
        else{
            req.AttachType = '';
            this.setState({
                model:true,
                status:false,
                modal_body:'Choose a file to upload'
            })
        }
       
    }

 

    SendUpload = (e) => {
        let _details  = CheckFileDetails(e);
        if(_details.status){
            if(e.target.name=="ApproveDto.internalAttachment"){
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
        else{
            this.setState({
                model:true,
                status:false,
                modal_body:_details.message
            })
        }
        
    }


    checkQty = (deliver_order_details) => {
        let res = true;
        for (let index = 0; index < deliver_order_details.length; index++) {
            let _tem_details = deliver_order_details[index];
            let _dod_ship  =   (_tem_details.DOD_SHIPPED_QTY !== "" || null) ? _tem_details.DOD_SHIPPED_QTY : ( _tem_details.POD_ORDERED_QTY - _tem_details.POD_DELIVERED_QTY);
            let _ship_calc = (_tem_details.POD_ORDERED_QTY - _tem_details.POD_DELIVERED_QTY - _tem_details.POD_CANCELLED_QTY)

            _dod_ship = (_dod_ship) ? parseFloat(_dod_ship).toFixed(2): _dod_ship
            _ship_calc = parseFloat(_ship_calc).toFixed(2)
            console.log('_tem_details', _dod_ship, _ship_calc, parseFloat(_ship_calc) < parseFloat(_dod_ship))
            if (parseFloat(_ship_calc) < parseFloat(_dod_ship)) {
                res = false;
                break;
            }
        }
        return res;
    }


    async RemoveDeliveryOrder(delivery_no,action){
        if(action){
            let _details = {
                strDONo : delivery_no
            }
            this.setState({loading:true})
            let _status = await ApiExtract(DeleteDO, _details)
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: (_status && _status.response && _status.response.message) ? _status.response.message : '',
                    loading:false,
                    number : _status.number,
                    submit_type : action
                })
            }
        }
    }

    async HandleSave(details,action){
        let new_details = true;
        let exec_details = false;
        let {table_inputs} = this.state;
        let _details = (this.props.delivery_form.values) ? this.props.delivery_form.values.ApproveDto : {};
        let {DO_MSTR, DO_DETAILS, PO_DETAILS} = details.poDetailsList
        
        let otherDetails = {
            "DOM_S_REF_NO": "", 
            "DOM_S_REF_DATE": "",
            "DOM_UI_S_REF_DATE": (this.state.start_data) ? this.state.start_data : null, 
            "DOM_WAYBILL_NO": "", 
            "DOM_FREIGHT_CARRIER": "", 
            "DOM_FREIGHT_AMT": "", 
            "DOM_DO_REMARKS": ""
        };

        otherDetails = Object.assign({}, otherDetails, _details);
        let reqData = {
            "saveDOData": {
                "dtDoListData": {
                    "dtDOMstrList": [
                        {
                            "DOM_DO_Date": TodayDateSalash(),
                            "DOM_S_Ref_No": (otherDetails.DOM_S_REF_NO) ? otherDetails.DOM_S_REF_NO :'',
                            "DOM_S_REF_DATE": convertDateToYear(otherDetails.DOM_S_REF_DATE),
                            "DOM_PO_INDEX": this.state.products.POM_PO_Index,
                            "DOM_D_Addr_Code": this.state.products.POD_D_ADDR_CODE,
                            "DOM_WAYBILL_NO": otherDetails.DOM_WAYBILL_NO,
                            "DOM_FREIGHT_CARRIER": otherDetails.DOM_FREIGHT_CARRIER,
                            "DOM_FREIGHT_AMT": otherDetails.DOM_FREIGHT_AMT,
                            "DOM_DO_REMARKS": otherDetails.DOM_DO_REMARKS,
                            "DOM_CREATED_DATE": TodayDateSalash(),
                            "POD_PO_NO": this.state.products.POM_PO_No,
                            "POD_D_Addr_Line1": PO_DETAILS[0].POD_D_Addr_Line1,
                            "POD_D_Addr_Line2": PO_DETAILS[0].POD_D_Addr_Line2,
                            "POD_D_Addr_Line3": PO_DETAILS[0].POD_D_Addr_Line3,
                            "POD_D_State": PO_DETAILS[0].POD_D_PostCode,
                            "POD_D_Country": PO_DETAILS[0].POD_D_Country,
                            "POD_D_City": PO_DETAILS[0].POD_D_City,
                            "POD_B_COY_ID": PO_DETAILS[0].POD_COY_ID,

                            
                        }
                    ],
                    "dtDODtlsList": []
                },
                "strPONo": this.state.products.POM_PO_No,
                "intPOIdx": this.state.products.POM_PO_Index,
                "lblDONo": DO_MSTR.length > 0 ? DO_MSTR[0].DOM_DO_NO : "",
                "actionType": action,
                "modeType": DO_MSTR.length > 0 ? "Edit" : "New",
                "BCoyID": this.state.products.POM_B_COY_ID,

 
            }
        }

        for (let index = 0; index < PO_DETAILS.length; index++) {
            const element = PO_DETAILS[index];
            let _out_qty =  element.POD_ORDERED_QTY - element.POD_DELIVERED_QTY
            _out_qty = (_out_qty) ? parseFloat(_out_qty).toFixed(2) : 0.00
            let temp = {
                "DOD_DO_LINE": index,
                "DOD_PO_LINE": element.POD_Po_Line,
                "DOD_DO_QTY": _out_qty,
                "DOD_SHIPPED_QTY": (table_inputs && table_inputs.length && table_inputs[index] && table_inputs[index].Outs >= 0 ) ? parseFloat(table_inputs[index].Outs).toFixed(2) : _out_qty,
                "DOD_REMARKS": (table_inputs && table_inputs.length && table_inputs[index] && table_inputs[index].DOD_REMARKS && typeof table_inputs[index].DOD_REMARKS != 'undefined') ? table_inputs[index].DOD_REMARKS : (element.DOD_REMARKS!="undefined" && typeof element.DOD_REMARKS!="undefined") ? element.DOD_REMARKS : '',
                "DOD_Outstanding": "",
                "DOD_LotNo": ""
            }

            if(temp.DOD_SHIPPED_QTY=='NaN' || isNaN(temp.DOD_SHIPPED_QTY)){
                temp.DOD_SHIPPED_QTY = 0;
            }
            
            if(this.checkQty(PO_DETAILS)){                
                // if(table_inputs && table_inputs.length && table_inputs[index] && table_inputs[index].Outs >= 0 && parseFloat(table_inputs[index].Outs)==0 && (element.POD_DELIVERED_QTY!=element.POD_ORDERED_QTY)){
                //     new_details = false;
                //     this.setState({
                //         model:true,
                //         status:false,
                //         modal_body:'Shipment quantity must be greater than 0'
                //     })
                //     break;
                // }
                // else 
                if(parseFloat(temp.DOD_SHIPPED_QTY) > parseFloat(temp.DOD_DO_QTY) ){
                    new_details = false;
                    this.setState({
                        model:true,
                        status:false,
                        modal_body:'Shipment quantity is greater than ordered quantity'
                    })
                    break;
                }
                else if( temp.DOD_SHIPPED_QTY != (element.POD_ORDERED_QTY - element.POD_DELIVERED_QTY - element.POD_CANCELLED_QTY) && action=="Submit" && (!temp.DOD_REMARKS)){
                    let _remarks = temp.DOD_REMARKS
                    if(!_remarks){
                        new_details = false;
                        this.setState({
                            model:true,
                            status:false,
                            modal_body:'Please Enter Remarks'
                        })
                        break;
                    }
    
                }
                reqData.saveDOData.dtDoListData.dtDODtlsList.push(temp);
            }
            else{
                new_details = false;
                this.setState({
                    model:true,
                    status:false,
                    modal_body:'Please Valid Quantity'
                })
            }
        }


        if(new_details && reqData.saveDOData.dtDoListData.dtDODtlsList){
            let _temp_details = reqData.saveDOData.dtDoListData.dtDODtlsList;
            let _filters = _temp_details.filter((list, index)=>list.DOD_SHIPPED_QTY>0)
          
            if(_filters && _filters.length<=0){
                exec_details = false 
                this.setState({
                    model:true,
                    status:false,
                    modal_body:'Enter Shipping Quantity'
                })
            }
            else{
                exec_details = true
            }
        }


        
        if(exec_details){
            this.setState({loading:true})
            let _status = await ApiExtract(SaveDo, reqData)
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                    number : _status.number,
                    submit_type : action
                })
            }
        }
        
       
    }

    deleteFile(filePath, attachType){
        filePath.AttachType = attachType;
        filePath.modeType = "New";
        this.props.delete_file(filePath)
        this.setState({delete:true})
    }

    documentDownload(filePath){
        this.props.download_file(filePath)
    }

    handleTableInputs(details, names, new_details){
        let {table_inputs} = this.state;
        let _empty_details = new Array();
        let _new_details = new Array()
       
        if(names=="Outs"){
            _empty_details[`${new_details}`] = {
                [names] :  details.target.value
            };
        }
        else{
            _empty_details[`${new_details}`] = {
                [names] : details.target.value
            };
        }
     
        _new_details[`${new_details}`] = Object.assign({}, table_inputs[`${new_details}`],  _empty_details[`${new_details}`])
        table_inputs[`${new_details}`] = _new_details[`${new_details}`]
        this.setState({
                table_inputs : table_inputs
        })
    }

    get_dopdf_details(details){
        let inputData = { 'DOM_S_COY_ID': details.DOM_S_Coy_ID, 'DOM_DO_NO': details.DOM_DO_NO }
        this.props.get_generate_dopdf(inputData);
    }

    ClearAll = () =>{
        let {table_inputs} = this.state;
        if(table_inputs && table_inputs.length){
            table_inputs.forEach((list, index)=>{
                table_inputs[index].DOD_REMARKS = ' '
            })

            this.setState({table_inputs : table_inputs})
        }
        this.props.reset('DeliveryOrderView')
    }
   

    render(){
      
         const _table_header = [
            {name : "Line", id:"Line", width:'58px', key:true, type:'index'},
            {name : "Item Code", id:"POD_VendOR_Item_Code", width:'97px', dataFormat:'validatedata'},
            {name : "Item Name", id:"POD_Product_Desc", width:'102px'},
            {name : "UOM", id:"POD_UOM", width:'70px'},
            {name : "EDD (Date)", id:"POM_CREATED_DATE", width:'104px', formatter: (cellContent, row) => {
                return addDate(row.POM_CREATED_DATE, row.POD_ETD, 'days')
            }},
            {name : "Warranty Terms(Mths)", id:"POD_Warranty_Terms", width:'68px',formatter: (cellContent, row) => {
                return (
                     <div className="text-right">{(row.POD_Warranty_Terms) ? row.POD_Warranty_Terms : '0'}</div>
                )
            }},
            {name : "MPQ", id:"POD_Min_Pack_Qty", width:'64px', dataFormat:'price'},
            {name : "MOQ", id:"POD_Min_ORder_Qty", width:'67px', dataFormat:'price'},
            {name : "Ordered", id:"POD_ORDERED_QTY", width:'84px', dataFormat:'price'},
            {name : "Outstd", id:"POD_ORDERED_QTY", width:'80px', formatter: (cellContent, row) => {
                return <div className="text-right">{parseFloat(row.POD_ORDERED_QTY - row.POD_DELIVERED_QTY - row.POD_CANCELLED_QTY).toFixed(2)}</div>
            }},
            {name : "Ship", id:"Outs", width:'80px', dataFormat:'shipinputmain'},
            {name : "Remarks", id:"DOD_REMARKS", width:'135px',sort:false, dataFormat:'delremarkstext'},

        ];

        const _table_header_do = [
            {name : "S.No", id:"date_created", width:'50px', key:true, type:'index'},
            {name : "DO Date", id:"date_created", width:'50px', dataFormat:'date'},
            {name : "DO Number", id:"DOM_DO_NO", width:'130px',formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_dopdf_details(row)}>{row.DOM_DO_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Created By", id:"UM_USER_NAME", width:'80px'},

        ];

        
        let _do_details = (this.props.get_issue_grn && this.props.get_issue_grn.poDetailsList  && this.props.get_issue_grn.poDetailsList.PO_DETAILS) ? this.props.get_issue_grn.poDetailsList.PO_DETAILS : [] 
        // _do_details = _do_details.map((enumObject)=>{
        //     let _ship_qty = (enumObject.DOD_SHIPPED_QTY=='') ? enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY : enumObject.DOD_SHIPPED_QTY
           
        //     if(_ship_qty>0){
        //         console.log('_ship_qty', _ship_qty)
        //         return enumObject
        //     }
        //     return null
        // })
        // _do_details = _do_details.filter((list_details)=>list_details!=null)
        // console.log('_do_details', _do_details)
        const { handleSubmit } = this.props
        return <Fragment>
                 {(this.props.loading) ? <Loader /> : '' }
                 {(this.state.loading) ? <Loader /> : '' }
                 {(this.props.file_upload_ld) ? <Loader /> : '' }
                 {(this.props.file_delete_ld) ? <Loader /> : '' }
                 {(this.props.fd_loading) ? <Loader /> : '' }
                 {(this.props.deliver_view_ld) ? <Loader /> : '' }
                 {(this.props.gdopdf_loading) ? <Loader /> : '' }
                 {(this.props.fdo_loading) ? <Loader /> : '' }
                 
                 
                <PageHeading 
                    heading="" 
                    subheading="Click the Save button to save the new PO as draft DO. Click the Submit button to submit the DO to the buyer." 
                />
                <TabHeading color={'bg-info text-white'}>Delivery Order Details</TabHeading> 
                <div className="row">
                    <div className="col-12 col-lg-2"><label>DO Number : </label></div>
                    <div className="col"><p>{(this.props.get_issue_grn && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.DO_MSTR && this.props.get_issue_grn.poDetailsList.DO_MSTR.length) ? this.props.get_issue_grn.poDetailsList.DO_MSTR[0].DOM_DO_NO :' To be Allocated by the system ' } <sapn className="ml-2 text-danger">{'(Open)'}</sapn></p></div>
                    <div className="col-12 col-lg-2"><label>Delivery Date : </label></div>
                    <div className="col"> <p>{TodayDateSalash()}</p></div>
                   
                   
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>PO Number : </label></div>
                    <div className="col"><p>{(this.state.products) ? this.state.products.POM_PO_No : '' }</p></div>
                    <div className="col-12 col-lg-2"><label>Customer Name :  </label></div>
                   
                    <div className="col"><p>{(this.props.get_issue_grn  && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.POMSTR  &&this.props.get_issue_grn.poDetailsList.POMSTR.length) ? this.props.get_issue_grn.poDetailsList.POMSTR[0].POM_BUYER_NAME :'' }</p></div>
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Payment Terms : </label></div>
                    <div className="col"><p>{(this.props.get_issue_grn  && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.POMSTR  &&this.props.get_issue_grn.poDetailsList.POMSTR.length) ? HandlePaymentTerm(this.props.get_issue_grn.poDetailsList.POMSTR[0].POM_PAYMENT_TERM):'' }</p></div>
                    <div className="col-12 col-lg-2"><label>Shipment Terms :</label></div>
                    <div className="col"><p>{(this.props.get_issue_grn  && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.POMSTR  &&this.props.get_issue_grn.poDetailsList.POMSTR.length) ? this.props.get_issue_grn.poDetailsList.POMSTR[0].POM_SHIPMENT_TERM:'' }</p></div>
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Payment Method :    </label></div>
                    <div className="col"><p>{(this.props.get_issue_grn  && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.POMSTR  &&this.props.get_issue_grn.poDetailsList.POMSTR.length) ? this.props.get_issue_grn.poDetailsList.POMSTR[0].POM_PAYMENT_METHOD:'' }</p></div>
                    <div className="col-12 col-lg-2"><label>Shipment Method : </label></div>
                    <div className="col"><p>{(this.props.get_issue_grn  && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.POMSTR  &&this.props.get_issue_grn.poDetailsList.POMSTR.length) ? this.props.get_issue_grn.poDetailsList.POMSTR[0].POM_SHIPMENT_MODE:'' }</p></div>
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Ship To : </label></div>
                    <div className="col"><address>{(this.props.get_issue_grn  && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.PO_DETAILS && this.props.get_issue_grn.poDetailsList.PO_DETAILS.length) ?  this.props.get_issue_grn.poDetailsList.PO_DETAILS[0].POD_D_Addr_Line1 +`, `+this.props.get_issue_grn.poDetailsList.PO_DETAILS[0].POD_D_Addr_Line2+', '+this.props.get_issue_grn.poDetailsList.PO_DETAILS[0].POD_D_Addr_Line3+', '+this.props.get_issue_grn.poDetailsList.PO_DETAILS[0].POD_D_PostCode+''+this.props.get_issue_grn.poDetailsList.PO_DETAILS[0].POD_D_City+', '+this.props.get_issue_grn.poDetailsList.PO_DETAILS[0].POD_D_State_desc+', '+this.props.get_issue_grn.poDetailsList.PO_DETAILS[0].POD_D_Country_desc : ''}</address></div>
                </div>

                <div className="row mt-2">
                    <Field type="text" name="ApproveDto.DOM_WAYBILL_NO" component={FromInputsParallel} className="form-control" placeholder="Air Way Bill No" label="Air Way Bill No" />
                    <Field type="text" name="ApproveDto.DOM_S_REF_NO"  component={FromInputsParallel} className="form-control" placeholder="Our Ref. No " label="Our Ref. No" />
                </div>
                <div className="row mt-2">
                    <Field type="text" name="ApproveDto.DOM_FREIGHT_CARRIER" component={FromInputsParallel} className="form-control" placeholder="Freight Carrier" label="Freight Carrier" />
                    <Field type="text" name="ApproveDto.DOM_S_REF_DATE" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Our Ref Date" label="Our Ref Date" onChange={this.handleDate.bind(this, 'start_date')} />
                </div>
                <div className="row mt-2">
                    <Field type="text" name="ApproveDto.DOM_FREIGHT_AMT" normalize={floatnumbers_length_6} component={FromInputsParallel} className="form-control" placeholder="Freight Amount" label="Freight Amount" />
                    
                </div>
               
                <div className="mt-2 row">
                    <div className="col-12" style={{padding:'0px'}}>  
                            <Field type="text" name="ApproveDto.DOM_DO_REMARKS" component={FromInputsParallel} className="form-control" placeholder=" Remarks" label=" Remarks"  />
                            <div className="col-12 col-sm-6">
                            <div className="row mt-2">
                                <FromUplodsParallel name="ApproveDto.internalAttachment" id ="external_attachment" label="Attachment :" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                            </div> 
                        </div>
                    </div>
                </div>

                

                <div className="mt-2 row">
                    <div className="col-lg-12 col-md">
                        <div className="row">
                        <label className="col-12 col-sm-3 col-md-2">Files Attached : </label>
                        <div className="col-12 col-sm-9 col-md-10 file_vendor_details">
                            {(this.state.attachment && this.state.attachment.length && this.state.attachment[0].Text!=='No Files Attached') ? this.state.attachment.map((list)=>{
                                return <p className="download-files"><u><span onClick={() => this.documentDownload(list, 'H')}>{list.strFile} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u> <span ><i onClick={() => this.deleteFile(list, 'H')} className="fa fa-trash" aria-hidden="true"></i></span></p>
                            }): 'No files attached'}
                           
                        </div>
                        </div>
                    </div>
                </div>
            
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={_do_details} 
                            select={false} 
                            change={true}
                            getInputs={this.handleTableInputs}
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                            input_values = {this.state.table_inputs}
                            sorting={false}
                        />
                    </div>
                </div>
               

                <div className="row mt-2"> 
                    <div className="col-lg-4 col-md-4">
                        Delivery Order Summary For Purchase Order:
                    </div>
                    <div className="col">
                        {(this.state.products) ? this.state.products.POM_PO_No : '' }
                    </div>
                </div>
                <div className="row mt-2">    
                    <div className='col-12'>  
                     
                        <BootstrapCustomTable 
                            table_header={_table_header_do} 
                            table_body={(this.props.get_issue_grn && this.props.get_issue_grn.DOSumm ) ? this.props.get_issue_grn.DOSumm : [] } 
                            select={false} 
                            change={true}
                            getInputs={this.handleTableInputs}
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                        />
                    </div>
                </div>

                <div className="row mt-2"> 
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 col-sm-6 text-left go-back">
                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.goBack()} >Back</button>
                            </div>
                            <div className="col-12 col-sm-6">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>{this.HandleSave(this.props.get_issue_grn, 'Save')}}>Save</button>
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success" onClick={()=>{this.HandleSave(this.props.get_issue_grn, 'Submit')}}>Submit</button>
                               
                                {(this.props.get_issue_grn && this.props.get_issue_grn.poDetailsList  && this.props.get_issue_grn.poDetailsList.DO_MSTR && this.props.get_issue_grn.poDetailsList.DO_MSTR.length > 0)? <button type="button" className="ml-4 btn btn-sm btn-outline-danger" onClick={()=>{this.RemoveDeliveryOrder((this.props.get_issue_grn && this.props.get_issue_grn.poDetailsList && this.props.get_issue_grn.poDetailsList.DO_MSTR && this.props.get_issue_grn.poDetailsList.DO_MSTR.length) ? this.props.get_issue_grn.poDetailsList.DO_MSTR[0].DOM_DO_NO : '', 'delete')}}>Delete DO</button> : ""}
                                <button type="reset" className="ml-4 btn btn-outline-danger btn-sm" onClick={this.ClearAll} >Reset</button>
                            </div>
                        </div>
                    </div>  
                </div>
                <Alert 
                message={this.state.modal_body}
                status={this.state.status} 
                show={this.state.model} 
                confirm={this.closemodel}/>
               
        </Fragment>
    }
}




const mapStateToProps = state => ({
    get_issue_grn : state.deliveryorder_view.responseList,
    save_do_error : state.save_do,
    save_do : state.save_do.responseList,
    delivery_form : state.form.DeliveryOrderView,
    upload_document : state.file_upload_external.responseList,
    file_delete : state.file_delete_external.responseList,
    fd_loading : state.file_delete_external.loading,
    fdo_loading : state.file_download.loading,
    file_upload_ld : state.file_upload_external.loading,
    file_delete_ld : state.file_delete.loading,
    deliver_view_ld : state.deliveryorder_view.loading,
    gdopdf_loading : state.generate_dopdf.loading,    
})

const mapDispatchToProps = dispatch => ({
    post_issue_grn  : (values) => dispatch(GetViewDOClick(values)),
    GetDoSearch  : (values) => dispatch(GetDoSearch(values)),
    reset_form  : (values) => dispatch(reset(values)),
    download_file  : (values) => dispatch(GetDownloadFile(values)),
    delete_file  : (values) => dispatch(GetDeleteFile(values)),
    get_generate_dopdf  : (values) => dispatch(GetGenerateDOPDF(values)),
    UploadDocuments  : (file, values) => dispatch(UploadDocuments(file, values)),
    
})

const IssueGRNHolder = connect(mapStateToProps, mapDispatchToProps)(IssueGRN);
export default reduxForm({
    form:'DeliveryOrderView',
    enableReinitialize : true,
    destroyOnUnmount :true,
})(IssueGRNHolder);
