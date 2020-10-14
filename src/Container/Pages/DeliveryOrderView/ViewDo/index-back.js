import React, {Component, Fragment } from 'react';
import {reduxForm } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../Component/Loader'
import {TodayDateSalash, addDate} from '../../../../Component/Dates'
import Enum from '../../../../Common/GlobalEnum'
import {GetViewDOClick} from '../../../../Actions/Vendor'
import {GetGenerateDOPDF} from '../../../../Actions/Requester'
import {connect} from 'react-redux';

class ViewDO extends Component {

    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)
        this.get_dopdf_details = this.get_dopdf_details.bind(this)
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
            submit_type:'save',
            view_do_details : {},
            view_do_details_table : []
        }
    }

    static getDerivedStateFromProps(props, state){
        console.log('view_do_details', props.view_do_details)
        if((state.rendered) && (props.view_do_details)){
         
            return {
                rendered:false,
                save_rendered:true,
                view_do_details : (props.view_do_details) ? props.view_do_details[0] : [], 
                attachment:props.view_do_details.attachFileList
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

    componentDidMount(){
        let _details = Object.assign({}, this.props.location.datas)
        _details.strDONo = _details.DOM_DO_NO;
        _details.strSCoyID = _details.DOM_S_COY_ID;
        _details.IntPOIdx = _details.POM_PO_Index;
        _details.PONo = _details.POM_PO_No;
        this.setState({
            products :_details,
            model:false,
            modal_body :'',
            redirect_tab: (this.props.location) ? this.props.location.redirect_to_tab : ''
        })
        let _post_data = this.props.location.datas
        this.props.GetPreviewDO(_details)
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
            "strDocNo": (this.props.view_do_details  && this.props.view_do_details.poDetailsList && this.props.view_do_details.poDetailsList.DO_MSTR  &&this.props.view_do_details.poDetailsList.DO_MSTR.length) ? this.props.view_do_details.poDetailsList.DO_MSTR[0].DOM_DO_NO :'' ,
            "blnTemp": "false",
            "strIndex": "",
            "seq": "",
            "pFrontOfficeSite": "",
            "AttachType": "H",
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
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


    documentDownload(filePath){
        this.props.download_file(filePath)
    }

    handleTableInputs(details, names, new_details){
        let {table_inputs} = this.state;
        let _empty_details = new Array();
        let _new_details = new Array()
       
        if(names=="Outs"){
            console.log('handleTableInputs', names)
            _empty_details[`${new_details}`] = {
                [names] :  (details.target.value && details.target.value >= 0 ) ? details.target.value : 0
            };
        }
        else{
            _empty_details[`${new_details}`] = {
                [names] :  (details.target.value) ? details.target.value : ' '
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

    render(){
        console.log('view_do_details', this.props.view_do_details)
         const _table_header = [
            {name : "Line", id:"Line", width:'58px', key:true, type:'index'},
            {name : "Item Code", id:"POD_VendOR_Item_Code", width:'97px'},
            {name : "Item Name", id:"POD_Product_Desc", width:'102px'},
            {name : "UOM", id:"POD_UOM", width:'70px'},
            {name : "EDD (Date)", id:"POM_CREATED_DATE", width:'104px', formatter: (cellContent, row) => {
                return addDate(row.POM_CREATED_DATE, row.POD_ETD, 'days')
            }},
            {name : "Warranty Terms(Mths)", id:"POD_Warranty_Terms", width:'177px', dataFormat:'price'},
            {name : "MPQ", id:"POD_Min_Pack_Qty", width:'64px', dataFormat:'price'},
            {name : "MOQ", id:"POD_Min_ORder_Qty", width:'67px', dataFormat:'price'},
            {name : "Ordered", id:"POD_ORDERED_QTY", width:'84px', dataFormat:'price'},
            {name : "Outstd", id:"POD_ORDERED_QTY", width:'80px', formatter: (cellContent, row) => {
                return <div className="text-right">{parseFloat(row.POD_ORDERED_QTY - row.POD_DELIVERED_QTY - row.POD_CANCELLED_QTY).toFixed(2)}</div>
            }},
            {name : "Ship", id:"Outs", width:'80px' },
            {name : "Remarks", id:"DOD_REMARKS", width:'135px',sort:false},

        ];

        const _table_header_do = [
            {name : "S.No", id:"date_created", width:'50px', key:true, type:'index'},
            {name : "DO Date", id:"date_created", width:'50px', dataFormat:'date'},
            {name : "DO Number", id:"DOM_DO_NO", width:'130px',formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_dopdf_details(row)}>{row.DOM_DO_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Created By", id:"DOM_Created_By", width:'80px'},

        ];

        const { handleSubmit } = this.props
        return <Fragment>
                 {(this.props.loading) ? <Loader /> : '' }
                 {(this.props.fl_loading) ? <Loader /> : '' }
                 {(this.props.gdopdf_loading) ? <Loader /> : '' }
                 
                 <PageHeading 
                    heading="" 
                    subheading="Click the Save button to save the new PO as draft DO. Click the Submit button to submit the DO to the buyer." 
                />
                <TabHeading color={'bg-info text-white'}>Delivery Order Details</TabHeading> 
                <div className="row">
                    <div className="col-12 col-lg-2"><label>DO Number : </label></div>
                    <div className="col"><p>{(this.props.view_do_details && this.props.view_do_details.DO_DETAILS && this.props.view_do_details.DO_DETAILS.length) ? this.props.view_do_details.DO_DETAILS[0].DOM_DO_NO :' To be Allocated by the system ' }</p></div>
                    <div className="col-12 col-lg-2"><label>Delivery Date : </label></div>
                    <div className="col"> <p>{TodayDateSalash()}</p></div>
                   
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>PO Number : </label></div>
                    <div className="col"><p>{(this.state.products) ? this.state.products.POM_PO_No : '' }</p></div>
                    <div className="col-12 col-lg-2"><label>Customer Name :  </label></div>
                   
                    <div className="col"><p>{(this.props.view_do_details  && this.props.view_do_details.poDetailsList && this.props.view_do_details.poDetailsList.POMSTR  &&this.props.view_do_details.poDetailsList.POMSTR.length) ? this.props.view_do_details.poDetailsList.POMSTR[0].POM_BUYER_NAME :'' }</p></div>
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Payment Terms : </label></div>
                    <div className="col"><p>{(this.props.view_do_details  && this.props.view_do_details.poDetailsList && this.props.view_do_details.poDetailsList.POMSTR  &&this.props.view_do_details.poDetailsList.POMSTR.length) ? this.props.view_do_details.poDetailsList.POMSTR[0].POM_PAYMENT_TERM:'' }</p></div>
                    <div className="col-12 col-lg-2"><label>Shipment Terms :</label></div>
                    <div className="col"><p>{(this.props.view_do_details  && this.props.view_do_details.poDetailsList && this.props.view_do_details.poDetailsList.POMSTR  &&this.props.view_do_details.poDetailsList.POMSTR.length) ? this.props.view_do_details.poDetailsList.POMSTR[0].POM_SHIPMENT_TERM:'' }</p></div>
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Payment Method :    </label></div>
                    <div className="col"><p>{(this.props.view_do_details  && this.props.view_do_details.poDetailsList && this.props.view_do_details.poDetailsList.POMSTR  &&this.props.view_do_details.poDetailsList.POMSTR.length) ? this.props.view_do_details.poDetailsList.POMSTR[0].POM_PAYMENT_METHOD:'' }</p></div>
                    <div className="col-12 col-lg-2"><label>Shipment Method : </label></div>
                    <div className="col"><p>{(this.props.view_do_details  && this.props.view_do_details.poDetailsList && this.props.view_do_details.poDetailsList.POMSTR  &&this.props.view_do_details.poDetailsList.POMSTR.length) ? this.props.view_do_details.poDetailsList.POMSTR[0].POM_SHIPMENT_MODE:'' }</p></div>
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Ship To : </label></div>
                    <div className="col"><address>{(this.props.view_do_details  && this.props.view_do_details.poDetailsList && this.props.view_do_details.poDetailsList.PO_DETAILS && this.props.view_do_details.poDetailsList.PO_DETAILS.length) ?  this.props.view_do_details.poDetailsList.PO_DETAILS[0].POD_D_Addr_Line1 +`, `+this.props.view_do_details.poDetailsList.PO_DETAILS[0].POD_D_Addr_Line2+', '+this.props.view_do_details.poDetailsList.PO_DETAILS[0].POD_D_Addr_Line3+', '+this.props.view_do_details.poDetailsList.PO_DETAILS[0].POD_D_PostCode+''+this.props.view_do_details.poDetailsList.PO_DETAILS[0].POD_D_City+', '+this.props.view_do_details.poDetailsList.PO_DETAILS[0].POD_D_State_desc+', '+this.props.view_do_details.poDetailsList.PO_DETAILS[0].POD_D_Country_desc : ''}</address></div>
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
                            table_body={(this.props.view_do_details && this.props.view_do_details.poDetailsList  && this.props.view_do_details.poDetailsList.PO_DETAILS) ? this.props.view_do_details.poDetailsList.PO_DETAILS : [] } 
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
                            table_body={(this.props.view_do_details && this.props.view_do_details.DOSumm ) ? this.props.view_do_details.DOSumm : [] } 
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
                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.history.goBack()} >Back</button>
                            </div>
                            <div className="col-12 col-sm-6">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>{this.HandleSave(this.props.view_do_details, 'Save')}}>View Do</button>
                        
                            </div>
                        </div>
                    </div>  
                </div>
               
               
        </Fragment>
    }
}



const mapStateToProps = state => ({
    view_do_details : state.deliveryorder_view.responseList,
    fl_loading : state.deliveryorder_view.loading,
    gdopdf_loading : state.generate_dopdf.loading,
})
const mapDispatchToProps = dispatch => ({
    GetViewDOClick  : (values) => dispatch(GetViewDOClick(values)),
    get_generate_dopdf   : (values) => dispatch(GetGenerateDOPDF(values)),
})
const ViewDOHolder = connect(mapStateToProps, mapDispatchToProps)(ViewDO);
export default ViewDOHolder;