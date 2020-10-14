import React, {Component, Fragment } from 'react';
import {connect} from 'react-redux'
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import {ApiExtract} from '../../../Common/GetDatas'
import {FromateDate, TodayDateSalash} from '../../../Component/Dates';
import {E2PPoCancellation} from '../../../Apis/RequesterServices'
import {GetGRNDetailsClick, GetGenerateDOPDF} from '../../../Actions/Requester'
import {GetGeneratePOPDF} from '../../../Actions/Vendor'
import {FromTextareaParallel} from '../../../Component/From/FromInputs'
import {Field, reduxForm} from 'redux-form';
import Alert from '../../../Component/Modal/alert'
import { GetViewPOClick} from '../../../Actions/Approver'
import {GetGenerateCRPDF} from '../../../Actions/Vendor'
import ConfirmationModel from '../../../Component/Modal/ConfirmationModel'
import BackButton from '../../../Component/Buttons/Back'


class GrnGeneration extends Component {

    constructor(props){
        super(props)
        this.closemodel = this.closemodel.bind(this)
        this.get_details = this.get_details.bind(this)
        this.handleDate = this.handleDate.bind(this);
        this.handleTableInputs = this.handleTableInputs.bind(this);
        this.ViewDo = this.ViewDo.bind(this);
        this.ViewPo = this.ViewPo.bind(this);
        this.ViewPdf = this.ViewPdf.bind(this);
        this.ClearAll = this.ClearAll.bind(this);
        this.state = {
            details:'',
            start_data:new Date(),
            products:[],
            model: false,
            final_status:false,
            modal_title : '',
            modal_body : '',
            model_text:'',
            table_inputs:[],
            grn_details:'' ,
            type:'check',
            status:false,
            loading:false,
            remarks : '',
            table_body :[],
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            cr_number : '',
        }

    }

    closemodel = () => {
        this.setState({
            model : false,
            modal_body:'',
        })
       
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

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="submit"){
            this.handlefromsubmit()
        }
        else if(_confimation_type=="approve"){
            this.ApprovePr()
        }
        else if(_confimation_type=="reject"){
            this.RejectPr()
        }

    }



    close = () => {
        this.setState({ open: false });
        this.props.onUpdate(this.props.defaultValue);
    }

    componentDidMount(){
        let _details = this.props.location.datas
        this.props.reset('GrnGeneration')
        this.props.change('ApproveDto.StartDate', new Date())
        this.setState({
            details: this.props.location.datas,
            products : this.props.location.datas
        })
        this.props.GetViewPOClick(this.props.location.datas)
        
    }

    static getDerivedStateFromProps(props, state){
         if(props.grnd_generation.get_PODetail && props.grnd_generation.get_PODetail.poDEtails){
             console.log('main_details', props.grnd_generation.get_PODetail.poDEtails[0])
             return {
                details : props.grnd_generation.get_PODetail.poDEtails[0]
             }
         }
         return null
    }

    async handlefromsubmit(){
        let {details, table_inputs, remarks} = this.state;
        let _temp_details_main = [...table_inputs]
        let _details_table = new Array()
        let _exec = true;
        let _table_body = (this.props.grnd_generation && this.props.grnd_generation.getlineitem && this.props.grnd_generation.getlineitem.lineitemDetails) ? this.props.grnd_generation.getlineitem.lineitemDetails: [] 
        if(this.state.remarks){
           await _temp_details_main.forEach((_tbl_input, max_index)=>{
                if(_tbl_input.POD_CANCELLED_QTY && _tbl_input.POD_CANCELLED_QTY>0){
                    let _temp_details = _table_body.filter((list_details, index)=>index==max_index)
                    if(_temp_details && _temp_details.length > 0 ){
                  
                        if(_tbl_input.POD_CANCELLED_QTY <= (parseFloat(_temp_details[0].POD_ORDERED_QTY - _temp_details[0].POD_DELIVERED_QTY - _temp_details[0].POD_CANCELLED_QTY).toFixed(2))){
                            _exec = true;
                            _details_table.push({ "lineno":_temp_details[0].POD_PO_LINE,"qty_cancel": _tbl_input.POD_CANCELLED_QTY, "remarks": (_tbl_input && _tbl_input.REMARKS) ? _tbl_input.REMARKS : '' })
                        }
                        else{
                            _exec = false;
                            this.setState({
                                status: false,
                                model:true,
                                modal_body: 'Rejected Quantity is greater than Outstanding Quantity',
                                loading:false,
                            })
                            return false
                        }
                    }
                }
            })

            if(!_exec){
                return false
            }
    
            if(_exec && _details_table && _details_table.length){
              
                let _details = {
                    "vendor": details.POM_S_COY_ID,
                    "INDEX": details.POM_PO_INDEX,
                    "REMARK":remarks,
                    "status":"5",
                    "Cancelled":"5",
                    "po_no": details.POM_PO_NO,
                    "items": _details_table
                }
    
                this.setState({
                    loading:true
                })
        
                let _status =  await ApiExtract(E2PPoCancellation, _details)
                if(_status){
                    this.setState({
                        status: _status.status,
                        model:true,
                        modal_body: _status.message,
                        loading:false,
                        cr_number : (_status.response && _status.response.CR_NO) ? _status.response.CR_NO : '',
                    })
                }
                else{
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
                    status: false,
                    model:true,
                    modal_body: "Select atleast once product to cancel",
                    loading:false,
                })
            }
           
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: "Please Enter Remarks",
                loading:false,
            })
        }
      
    }

    get_details(details){
        this.props.history.push({
            pathname : details.pathname,
            datas : details.datas,
        })
    }

    handleTableInputs(details, names, new_details){
        let {table_inputs} = this.state;
        let _empty_details = new Array();
        let _new_details = new Array()
        console.log('handleTableInputs', details.target.value)
        if(names=="POD_CANCELLED_QTY"){
            _empty_details[`${new_details}`] = {
                [names] :  (details.target.value && details.target.value>0) ? details.target.value : 0
            };
        }
        else{
            _empty_details[`${new_details}`] = {
                [names] :  (details.target.value) ? details.target.value : ''
            };
        }
       
        

        _new_details[`${new_details}`] = Object.assign({}, table_inputs[`${new_details}`],  _empty_details[`${new_details}`])
        table_inputs[`${new_details}`] = _new_details[`${new_details}`]
        console.log('handleTableInputs_1',table_inputs)
        this.setState({
                table_inputs : table_inputs
        })
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

    ViewPo(){
         let data = { 'POM_B_Coy_ID': this.state.products.POM_B_COY_ID, 'POM_PO_No': this.state.products.POM_PO_NO }
         this.props.GetGeneratePOPDF(data)
    }

    ViewDo(){
        this.props.GetGenerateDOPDF(this.state.products)
    }

    ViewPdf = () =>{
        let _temp_Details = {
            CR_NO : this.state.cr_number,
            po_no : (this.state.products) ? this.state.products.POM_PO_NO : '',
            strBCoyID : (this.state.products) ? this.state.products.POM_B_COY_ID  : '',
        }
        this.props.GetGenerateCRPDF(_temp_Details)
    }

    ClearAll= () =>{
        this.props.reset(GrnGeneration)
        this.setState({
            remarks : '',
            table_inputs : []
        })
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Line", id:"POD_Po_Line", width:'58px', type:"index", key:true },
            {name : "Item Code", id:"POD_B_ITEM_CODE", width:'100px', dataFormat:'validatedata'},
            {name : "Item Name", id:"POD_PRODUCT_DESC", width:'143px'},
            {name : "UOM", id:"POD_UOM", width:'68px'},
            {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'68px', dataFormat:'price'},
            {name : "Warranty Terms", id:"POD_WARRANTY_TERMS", width:'140px', dataFormat:'price'},
            {name : "Order Qty", id:"POD_ORDERED_QTY", width:'92px', dataFormat:'price'},
            {name : "Receive Qty", id:"DOD_SHIPPED_QTY", width:'124px', dataFormat:'price'},
            {name : "Rejected Qty", id:"POD_REJECTED_QTY", width:'119px', dataFormat:'price'},
            {name : "Outstd", id:"POD_REJECTED_QTY", width:'96px',  formatter: (cellContent, row) => {
                return <div className="text-right">{parseFloat(row.POD_ORDERED_QTY - row.POD_DELIVERED_QTY - row.POD_CANCELLED_QTY).toFixed(2)}</div>
            }},
            {name : "Qty to cancel", id:"POD_CANCELLED_QTY", width:'96px', dataFormat:'doinput'},
            {name : "Remarks", id:"REMARKS", width:'200px', dataFormat:'textarea'},
        ];

        
        return <Fragment>
            
                 {(this.props.loading) ? <Loader /> : '' }
                 {(this.state.loading) ? <Loader /> : '' }
                 {(this.props.grndg_loading) ? <Loader /> : '' }
                 {(this.props.dopdf_loading) ? <Loader /> : '' }
                 {(this.props.popdf_loading) ? <Loader /> : '' }
                 {(this.props.grn_submit && this.props.grn_submit.loading) ? <Loader /> : '' }
                 {(this.props.dr_loading) ? <Loader /> : '' }
                 {(this.props.generate_CRPDF) ? <Loader /> : '' }
                 
                 
                <PageHeading 
                    heading="" 
                    subheading="Fill in the CR Remarks and click the Submit button for PO Cancellation. " 
                />
                <TabHeading color={'d-flex bg-info text-white p-1 mt-2 mb-3'}>PO Cancellation</TabHeading> 
                <form>
                    <div className="row mt-2">
                        <div className="col-md-2 collg-2"><label>PO Number : </label></div>
                        <div className="col-md-3 col-g-3"><div className="row"><p>{(this.state.details) ? this.state.details.POM_PO_NO : ''}</p></div></div>
                        <div className="col-md-2 collg-2"><label>Order Date :</label></div>
                        <div className="col-md-3 col-g-3"><p>{(this.state.details) ? TodayDateSalash(this.state.details.POM_PO_DATE) : ''}</p></div>
                    </div>
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.grnd_generation && this.props.grnd_generation.getlineitem && this.props.grnd_generation.getlineitem.lineitemDetails) ? this.props.grnd_generation.getlineitem.lineitemDetails: [] } 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={false}
                            change={true}
                            getInputs={this.handleTableInputs}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                            button_text="Set"
                            input_values = {this.state.table_inputs}
                        />
                    </div>
                </div>
                <div className="mt-2 row">
                    <Field  rem={true} type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} className="form-control" placeholder=" CR Remarks" label="CR Remarks"  onChange={(e)=>this.setState({
                            remarks : e.target.value
                    })}/>
                </div>
              
                    <div className="mt-2 row">
                        <div className="col-12 col-sm-6 text-left go-back">
                            <div className="row">
                                <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history} />
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 text-right">
                               {(!this.state.cr_number) ?  <button type="button" className="ml-4 btn btn-sm btn-outline-primary"onClick={()=>this.confirm_function('submit','cancel This PO')}>Submit</button> : ''}
                               {(this.state.cr_number) ?  <button type="button" className="ml-4 btn btn-sm btn-outline-info" onClick={()=>this.ViewPdf()}> View CR</button> : ''}
                               {(!this.state.cr_number) ?   <button type="reset" className="ml-4 btn btn-sm btn-outline-danger" onClick={()=>this.ClearAll()}>Clear</button> : ''}
                        </div>
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
                message={this.state.modal_body}
                status={this.state.status} 
                show={this.state.model} 
                confirm={this.closemodel}
            />
           
        </Fragment>
    }
}


const mapStateToProps = state => ({
    grnd_generation : state.view_po_details.responseList,
    grndg_loading : state.view_po_details.loading,
    dopdf_loading : state.generate_dopdf.loading,
    popdf_loading : state.generate_popdf.loading,
    dr_loading : state.file_download.loading,
    generate_CRPDF : state.generate_CRPDF.loading,
})
  
const mapDispatchToProps = dispatch => ({
    GetGRNDetailsClick  : (values) => dispatch(GetGRNDetailsClick(values)),
    GetGenerateDOPDF : (values) => dispatch(GetGenerateDOPDF(values)),
    GetGeneratePOPDF : (values) => dispatch(GetGeneratePOPDF(values)),
    GetViewPOClick : (values) => dispatch(GetViewPOClick(values)),
    GetGenerateCRPDF : (values) => dispatch(GetGenerateCRPDF(values)),
    
})

  
const GrnGenerationHolderMain = connect(mapStateToProps, mapDispatchToProps)(GrnGeneration);

export default reduxForm({
    form:'GrnGeneration',
})(GrnGenerationHolderMain);