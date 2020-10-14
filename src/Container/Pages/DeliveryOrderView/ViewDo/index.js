import React, {Component, Fragment } from 'react';
import {reduxForm } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../Component/Loader'
import {TodayDateSalash, addDate} from '../../../../Component/Dates'
import Enum from '../../../../Common/GlobalEnum'
import {GetPreviewDO, GetDownloadFile} from '../../../../Actions/Approver'
import {GetGenerateDOPDF} from '../../../../Actions/Requester'
import {connect} from 'react-redux';
import BackButton from '../../../../Component/Buttons/Back'
import {HandlePaymentTerm} from '../../../../Actions/Common/Functions'

class ViewDO extends Component {

    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)
        this.get_dopdf_details = this.get_dopdf_details.bind(this)
        this.handleDate = this.handleDate.bind(this);
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
            view_do_details_table : [],
            view_do_list:[],
            view_do_summary:[],
            redirect_tab :'',
        }
    }

    static getDerivedStateFromProps(props, state){
        if((props.view_do_details) && props.view_do_details.hasOwnProperty('dsAllInfo')){
            return {
                view_do_details : (props.view_do_details.dsAllInfo && props.view_do_details.dsAllInfo.DOReport) ? props.view_do_details.dsAllInfo.DOReport[0] : [], 
                view_do_list : (props.view_do_details.dsAllInfo && props.view_do_details.dsAllInfo.DOReport) ? props.view_do_details.dsAllInfo.DOReport : [], 
                view_do_summary: (props.view_do_details.dsDOSumm) ? props.view_do_details.dsDOSumm : [], 
                attachment:props.view_do_details.DOAttachment
            }
        }
        else{
            return {
                view_do_details : [],
                view_do_list : [],
                view_do_summary : [],
                attachment : [],
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

    
    get_dopdf_details(details={}){
        console.log('get_dopdf_details', details, this.state.view_do_details)
        if(details && details.DOM_S_Coy_ID){
            let inputData = { 'DOM_S_COY_ID': details.DOM_S_Coy_ID, 'DOM_DO_NO': details.DOM_DO_NO }
            this.props.get_generate_dopdf(inputData);
        }
        else if(this.state.view_do_details && this.state.view_do_details.DOM_S_COY_ID){
            let inputData = { 'DOM_S_COY_ID': this.state.view_do_details.DOM_S_COY_ID, 'DOM_DO_NO': this.state.view_do_details.DOM_DO_NO }
            this.props.get_generate_dopdf(inputData);
        }
      
    }

    render(){
         const _table_header = [
            {name : "Line", id:"Line", width:'58px', key:true, type:'index'},
            {name : "Item Code", id:"POD_Vendor_Item_Code", width:'97px', dataFormat:'validatedata'},
            {name : "Item Name", id:"POD_Product_Desc", width:'102px'},
            {name : "UOM", id:"POD_UOM", width:'70px'},
            {name : "EDD (Date)", id:"POM_CREATED_DATE", width:'104px', formatter: (cellContent, row) => {
                return addDate(view_do_details.POM_PO_Date, row.POD_ETD, 'days')
            }},
            {name : "Warranty Terms(Mths)", id:"POD_Warranty_Terms", width:'177px',formatter: (cellContent, row) => {
                return (
                     <div className="text-right">{(row.POD_Warranty_Terms) ? row.POD_Warranty_Terms : '0'}</div>
                )
            }},
            {name : "MPQ", id:"POD_Min_Pack_Qty", width:'64px', dataFormat:'price'},
            {name : "MOQ", id:"POD_Min_Order_Qty", width:'67px', dataFormat:'price'},
            {name : "PO Qty", id:"POD_Ordered_Qty", width:'84px', dataFormat:'price'},
            {name : "Shipped Qty", id:"DOD_SHIPPED_QTY", width:'80px', dataFormat:'price'},
            {name : "GRN Qty", id:"DOD_DO_QTY", width:'80px' ,sort:false, formatter: (cellContent, row) => {
                return (
                     <div className="text-right">{(row.DOD_DO_QTY == row.DOD_SHIPPED_QTY) ? '0.00' : parseFloat(row.DOD_DO_QTY).toFixed(2)}</div>
                )
            }},
            {name : "Remarks", id:"DOD_REMARKS", width:'135px',sort:false, formatter: (cellContent, row) => {
                return (
                     <div>{(row.DOD_REMARKS!='undefined') ? row.DOD_REMARKS : ''}</div>
                )
            }},

        ];

        const _table_header_do = [
            {name : "S.No", id:"date_created", width:'50px', key:true, type:'index'},
            {name : "DO Date", id:"date_created", width:'50px', dataFormat:'date'},
            {name : "DO Number", id:"DOM_DO_NO", width:'130px',formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_dopdf_details(row)}>{row.DOM_DO_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span> {row.HAS_ATTACHEMENT==1 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}</button>
                )
            }},
            {name : "Created By", id:"UM_USER_NAME", width:'80px'},

        ];

        const { handleSubmit } = this.props
        let {view_do_details, view_do_list, view_do_summary} = this.state
        view_do_list = view_do_list.filter((list_details)=>list_details.DOD_SHIPPED_QTY!=0)
        
        return <Fragment>
                 {(this.props.loading) ? <Loader /> : '' }
                 {(this.props.fl_loading) ? <Loader /> : '' }
                 {(this.props.gdopdf_loading) ? <Loader /> : '' }
            
                 {/* <PageHeading 
                    heading="" 
                    subheading="Click the Save button to save the new PO as draft DO. Click the Submit button to submit the DO to the buyer." 
                /> */}
                <TabHeading color={'bg-info text-white active'}>Delivery Order Details</TabHeading> 
                <div className="row">
                    <div className="col-12 col-lg-2"><label>DO Number : </label></div>
                    <div className="col"><p>{(view_do_details ) ? view_do_details.DOM_DO_NO :' To be Allocated by the system ' }</p></div>

                    {(this.props.location && this.props.location.redirect_to_tab && this.props.location.redirect_to_tab=="GRNListing") ? 
                    <Fragment>
                        <div className="col-12 col-lg-2"><label>Status: </label></div>
                        <div className="col"><p>{(view_do_details ) ? view_do_details.Status_Desc:'' }</p></div>
                    </Fragment> : 
                    <Fragment>
                        <div className="col-12 col-lg-2"><label>Status : </label></div>
                        <div className="col"><p>{(this.state.products  && this.state.products.Status_Desc) ? this.state.products.Status_Desc : '' }</p></div>
                    </Fragment> }
      
                   
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>PO Number : </label></div>
                    <div className="col"><p>{(view_do_details) ? view_do_details.POM_PO_No : '' }</p></div>
                    <div className="col-12 col-lg-2"><label>Customer Name :  </label></div>
                    <div className="col"><p>{(this.state.products  && this.state.products.CM_COY_NAME) ? this.state.products.CM_COY_NAME : '' }</p></div>
                </div>
                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Bill TO : </label></div>
                    <div className="col"><p>{(view_do_details  ) ? 
                        <div>
                            <p>{view_do_details.POM_B_Addr_Line1}</p>
                            <p>{view_do_details.POM_B_Addr_Line2}</p>
                            <p>{view_do_details.POM_B_Addr_Line3}</p>
                            <p>{view_do_details.POM_B_POSTCODE}</p>
                            <p>{view_do_details.POM_B_STATE}</p>
                            <p>{view_do_details.POM_B_COUNTRY}</p>
                        </div>
                    : '' }</p></div>
                    <div className="col-12 col-lg-2"><label>Ship To :  </label></div>
                   
                    <div className="col"><p>{(view_do_details  ) ? 
                        <div>
                            <p>{view_do_details.POD_D_Addr_Line1}</p>
                            <p>{view_do_details.POD_D_Addr_Line2}</p>
                            <p>{view_do_details.POD_D_Addr_Line3}</p>
                            <p>{view_do_details.POD_D_PostCode}</p>
                            <p>{view_do_details.POD_D_State}</p>
                            <p>{view_do_details.POD_D_Country}</p>
                        </div>
                    : '' }</p></div>
                </div>
               <div className="row mt-2">
               <div className="col-12 col-lg-2"><label>Delivery Date : </label></div>
                    <div className="col"><p>{(view_do_details  ) ? TodayDateSalash(view_do_details.DOM_CREATED_DATE) : TodayDateSalash() }</p></div>
                    <div className="col-12 col-lg-2"><label>Our Ref No.  :</label></div>
                    <div className="col"><p>{(view_do_details ) ? view_do_details.DOM_S_REF_NO:'' }</p></div>
                </div>
                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Payment Terms : </label></div>
                    <div className="col"><p>{(view_do_details ) ? HandlePaymentTerm(view_do_details.POM_Payment_TERM):'' }</p></div>
                    
                    <div className="col-12 col-lg-2"><label>Our Ref Date : </label></div>
                    <div className="col"><p>{(view_do_details ) ? TodayDateSalash(view_do_details.POM_PO_Date) :'' }</p></div>
                   
                    
                  
                </div>
               <div className="row mt-2">
               <div className="col-12 col-lg-2"><label>Shipment Terms :</label></div>
                    <div className="col"><p>{(view_do_details ) ? view_do_details.POM_Shipment_Term:'' }</p></div>
                    <div className="col-12 col-lg-2"><label>Payment Method :    </label></div>
                    <div className="col"><p>{(view_do_details ) ? view_do_details.POM_PAYMENT_METHOD:'' }</p></div>
                  
                </div>
               <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label> Air Way Bill No.: </label></div>
                    <div className="col"><p>{(view_do_details ) ? view_do_details.DOM_WAYBILL_NO:'' }</p></div>
                    <div className="col-12 col-lg-2"><label> Shipment Mode : </label></div>
                    <div className="col"><p>{(view_do_details ) ? view_do_details.POM_Shipment_Mode:'' }</p></div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label> Freight Carrier : </label></div>
                    <div className="col"><p>{(view_do_details ) ? view_do_details.DOM_FREIGHT_CARRIER:'' }</p></div>
                    <div className="col-12 col-lg-2"><label> Freight Amount : </label></div>
                    <div className="col"><p>{(view_do_details &&  view_do_details.DOM_FREIGHT_AMT) ? parseFloat(view_do_details.DOM_FREIGHT_AMT).toFixed(4):'0.0000' }</p></div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label> Remarks : </label></div>
                    <div className="col"><p>{(view_do_details ) ? view_do_details.DOM_DO_REMARKS:'' }</p></div>

                </div>

             
               
               

                

                <div className="mt-2 row">
                    <div className="col-lg-12 col-md">
                        <div className="row">
                        <label className="col-12 col-sm-3 col-md-2">Files Attached : </label>
                        <div className="col-12 col-sm-9 col-md-10 file_vendor_details">
                            {(this.state.attachment && this.state.attachment.length && this.state.attachment[0].Text!=='No Files Attached') ? this.state.attachment.map((list)=>{
                                return <p className="download-files"><u><span onClick={() => this.documentDownload(list, 'H')}>{list.strFile} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u></p>
                            }): 'No files attached'}
                           
                        </div>
                        </div>
                    </div>
                </div>
            
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(view_do_list && view_do_list.length > 0 ) ? view_do_list : [] } 
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
               

                
                {(this.props.location && this.props.location.redirect_to_tab && this.props.location.redirect_to_tab=="GRNListing") ? '' :  
                <Fragment>
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
                                table_body={(view_do_summary && view_do_summary.length > 0 ) ? view_do_summary : [] } 
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
                </Fragment>
                }

                <div className="row mt-2"> 
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 col-sm-6 text-left go-back">
                                <div className="row">
                                    <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history}/>
                                </div>
                            </div>
                          
                            {(this.state.redirect_tab=="DOListing") ?
                            <div className="col-12 col-sm-6">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>this.get_dopdf_details()}>View Do</button>
                            </div> : ''}
                        </div>
                    </div>  
                </div>
               
               
        </Fragment>
    }
}



const mapStateToProps = state => ({
    view_do_details : state.view_do_details.responseList,
    fl_loading : state.view_do_details.loading,
    gdopdf_loading : state.generate_dopdf.loading,
})
const mapDispatchToProps = dispatch => ({
    GetPreviewDO  : (values) => dispatch(GetPreviewDO(values)),
    get_generate_dopdf   : (values) => dispatch(GetGenerateDOPDF(values)),
    download_file  : (values) => dispatch(GetDownloadFile(values)),
})
const ViewDOHolder = connect(mapStateToProps, mapDispatchToProps)(ViewDO);
export default ViewDOHolder;