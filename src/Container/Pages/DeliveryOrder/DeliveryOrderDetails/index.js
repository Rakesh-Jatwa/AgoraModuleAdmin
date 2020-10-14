import React, {Component, Fragment } from 'react';
import TabHeading from '../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../Component/Loader' 
import {TodayDateSalash, addDate} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {HandlePaymentTerm, CheckFileDetails} from '../../../../Actions/Common/Functions'

class DeliveryOrderDetails extends Component {
    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)
        this.closemodel = this.closemodel.bind(this);
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
            this.props.CloseGrn()
        }
       
    }

   
    get_details(details){
        this.props.history.push({
            pathname : '/deliveryorderview',
            datas : details.datas,
        })
    }


    documentDownload(filePath){
        this.props.download_file(filePath)
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
         let {DOAttachment, dsAllInfo, dsDOSumm} = this.props
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
            {name : "PO Qty", id:"POD_Ordered_Qty", width:'67px', dataFormat:'price'},
            {name : "Shipped Qty", id:"DOD_SHIPPED_QTY", width:'67px', dataFormat:'price'},
            {name : "GRN Qty", id:"POD_RECEIVED_QTY", width:'67px', formatter: (cellContent, row) => {
                return <div className="text-right">{parseFloat(row.POD_RECEIVED_QTY - row.POD_REJECTED_QTY).toFixed(2)}</div>
            }},
            {name : "Remarks", id:"DOD_REMARKS", width:'67px'},

        ];

        return <Fragment>
                 {(this.props.loading) ? <Loader /> : '' }
                 {(this.state.loading) ? <Loader /> : '' }
                 {(this.props.file_upload_ld) ? <Loader /> : '' }
                 {(this.props.file_delete_ld) ? <Loader /> : '' }
                 {(this.props.fd_loading) ? <Loader /> : '' }
                 {(this.props.deliver_view_ld) ? <Loader /> : '' }
                 {(this.props.gdopdf_loading) ? <Loader /> : '' }
                 {(this.props.fdo_loading) ? <Loader /> : '' }
                 
                <TabHeading color={'bg-info text-white'}>Delivery Order Details</TabHeading> 
                <div className="row">
                    <div className="col-12 col-lg-2"><label>DO Number : </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].DOM_DO_NO :' To be Allocated by the system ' } </p></div>
                    <div className="col-12 col-lg-2"><label>Status</label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].Status_Desc : '' }</p></div>
                </div>
                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>PO Number : </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].POM_PO_No : '' }</p></div>
                    <div className="col-12 col-lg-2"><label>Customer Name :  </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].POM_BUYER_NAME :'' }</p></div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Bill No  : </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? `${(dsAllInfo[0].POM_B_Addr_Line1) ? dsAllInfo[0].POM_B_Addr_Line1+',\n' : ''} ${(dsAllInfo[0].POM_B_Addr_Line2) ? dsAllInfo[0].POM_B_Addr_Line2+',\n' : ''} ${(dsAllInfo[0].POM_B_Addr_Line3) ? dsAllInfo[0].POM_B_Addr_Line3+',\n' : ''} ${(dsAllInfo[0].POM_B_POSTCODE) ? dsAllInfo[0].POM_B_POSTCODE+',\n': ''} ${(dsAllInfo[0].POM_B_STATE) ? dsAllInfo[0].POM_B_STATE+',\n':''} ${(dsAllInfo[0].POM_B_COUNTRY) ? dsAllInfo[0].POM_B_COUNTRY+'\n':''}` : '' }</p></div>
                    <div className="col-12 col-lg-2"><label>Ship No :  </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? `${(dsAllInfo[0].DOM_D_Addr_Line1) ? dsAllInfo[0].DOM_D_Addr_Line1+',\n' : ''} ${(dsAllInfo[0].DOM_D_Addr_Line2) ? dsAllInfo[0].DOM_D_Addr_Line2+',\n' : ''} ${(dsAllInfo[0].DOM_D_Addr_Line3) ? dsAllInfo[0].DOM_D_Addr_Line3+',\n' : ''} ${(dsAllInfo[0].DOM_D_POSTCODE) ? dsAllInfo[0].DOM_D_POSTCODE+',\n': ''} ${(dsAllInfo[0].DOM_D_STATE) ? dsAllInfo[0].DOM_D_STATE+',\n':''}  ${(dsAllInfo[0].DOM_D_COUNTRY) ? dsAllInfo[0].DOM_D_COUNTRY+'\n':''}` : '' }</p></div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Delivery Date : </label></div>
                    <div className="col"><p>{TodayDateSalash()}</p></div>
                    <div className="col-12 col-lg-2"><label>Our Ref No. :  </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].DOM_S_REF_NO :'' }</p></div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Payment Terms : </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? HandlePaymentTerm(dsAllInfo[0].POM_Payment_TERM) :'' }</p></div>
                    <div className="col-12 col-lg-2"><label>Our Ref Date :  </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? TodayDateSalash(dsAllInfo[0].DOM_S_REF_DATE) :'' }</p></div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Shipment Terms : </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].POM_Shipment_Term :'' }</p></div>

                    <div className="col-12 col-lg-2"><label>Payment Method :  </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].POM_PAYMENT_METHOD :'' }</p></div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label>Air Way Bill No. : </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].DOM_WAYBILL_NO :'' }</p></div>
                    <div className="col-12 col-lg-2"><label>Shipment Mode :  </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].POM_Shipment_Mode :'' }</p></div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-lg-2"><label> Remarks : </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length) ? dsAllInfo[0].DOM_DO_REMARKS :'' }</p></div>
                    <div className="col-12 col-lg-2"><label>Freight Amount :  </label></div>
                    <div className="col"><p>{(dsAllInfo && dsAllInfo.length &&  dsAllInfo[0].DOM_FREIGHT_AMT) ?  parseFloat( dsAllInfo[0].DOM_FREIGHT_AMT).toFixed(4):'0.0000' }</p></div>
                </div>

                <div className="mt-2 row">
                    <div className="col-lg-12 col-md">
                        <div className="row">
                        <label className="col-12 col-sm-3 col-md-2">File(s) Attached : </label>
                        <div className="col-12 col-sm-9 col-md-10 file_vendor_details">
                            {(DOAttachment && DOAttachment.length && DOAttachment[0].Text!=='No Files Attached') ? DOAttachment.map((list)=>{
                                return <p className="download-files"><u><span onClick={() => this.documentDownload(list, 'H')}>{list.strFile} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u> </p>
                            }): 'No files attached'}
                           
                        </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={dsAllInfo} 
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
                
              
                <Alert 
                message={this.state.modal_body}
                status={this.state.status} 
                show={this.state.model} 
                confirm={this.closemodel}/>
               
        </Fragment>
    }
}



export default DeliveryOrderDetails
