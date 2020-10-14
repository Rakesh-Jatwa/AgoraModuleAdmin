import React, {Component, Fragment } from 'react';
import {connect} from 'react-redux'
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import {ApiExtract} from '../../../Common/GetDatas'
import { Tabs, Tab } from 'react-bootstrap';
import {GRNSubmit} from '../../../Apis/RequesterServices'
import {GetGRNDetailsClick, GetGenerateDOPDF} from '../../../Actions/Requester'
import {GetGeneratePOPDF} from '../../../Actions/Vendor'
import {FormDatePickerParallel} from '../../../Component/From/FromInputs'
import {FromateDate_YY_MM_DD_HSS} from '../../../Component/Dates'
import {Field, reduxForm} from 'redux-form';
import Alert from '../../../Component/Modal/alert'
import { GetDownloadFile, GetViewGRNPDF} from '../../../Actions/Vendor'



class GrnGeneration extends Component {

    constructor(props){
        super(props)
        this.closemodel = this.closemodel.bind(this)
        this.get_details = this.get_details.bind(this)
        this.handleDate = this.handleDate.bind(this);
        this.handleTableInputs = this.handleTableInputs.bind(this);
        this.ViewDo = this.ViewDo.bind(this);
        this.ViewPo = this.ViewPo.bind(this);
        
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
            render:false,
            active_key : 'IssueGRN',
        }

    }

    closemodel = () => {
        this.setState({
            model : false,
            modal_body:'',
        })
        if(this.state.status){
            this.props.history.push({
                pathname:'/issueGrn'
            })
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
        console.log('_details', _details)
        this.props.GetGRNDetailsClick(_details)
        
    }

    componentDidUpdate(){
        let {table_inputs} = this.state
        let _prod_details =  (this.props.grnd_generation && this.props.grnd_generation.doDetails) ? this.props.grnd_generation.doDetails: [] 
        if(_prod_details){
            _prod_details =  _prod_details.filter((list)=>list.DOD_SHIPPED_QTY>0);
        }
        if((!this.state.render) && _prod_details.length){
             table_inputs =  _prod_details.map(()=>{
                return {
                    'POD_Rejected_Qty' : 0,
                    'REMARKS' : '',
                }
            })
            this.setState({
                table_inputs : table_inputs,
                render :true
            })       
        }
    }

    view_pdf = (datas) =>{
       
        let _details_main = this.props.location.datas
        console.log('view_pdf',datas,_details_main)
        if(_details_main){
            let _details = {}
            _details.POM_B_COY_ID = _details_main.DOM_S_COY_ID;
            _details.DO_Number = _details_main.DOM_DO_NO
            _details.USER_ID = _details_main.POM_B_COY_ID;
            _details.POM_PO_NO = _details_main.POM_PO_NO
            _details.GRN_Number = datas.GM_GRN_No
            this.props.ViewGRNPDF(_details)
        }

    }
    

    async handlefromsubmit(values){
        if(this.state.products){
            let {table_inputs} = this.state;
            let reqData = {
                "table1": {
                    "SCoyID": this.state.products.DOM_S_COY_ID,
                    "PONo": this.state.products.POM_PO_NO,
                    "DoNo": this.state.products.DOM_DO_NO,
                    "POIndex": this.state.products.POM_PO_INDEX,
                    "DOIndex": this.state.products.DOM_DO_INDEX,
                    "GRNNo": "",
                    "GRNIndex": "",
                    "GRNReceivedDt": FromateDate_YY_MM_DD_HSS(this.state.start_data),
                },
                "table2": []
            }
            
            let _temp_status = true;
            let _prod_details =  (this.props.grnd_generation && this.props.grnd_generation.doDetails) ? this.props.grnd_generation.doDetails: [] 
            if(_prod_details){
                _prod_details =  _prod_details.filter((list)=>list.DOD_SHIPPED_QTY>0);
            }

            for (let index = 0; index < _prod_details.length; index++) {
                const element = _prod_details[index];
                let _rej_qty ='';
                let temp = {
                    "PO_LINE": element.POD_Po_Line,
                    "Received_Qty": element.DOD_SHIPPED_QTY,
                    "Rejected_Qty": (table_inputs[index] && table_inputs[index].POD_Rejected_Qty &&  table_inputs[index].POD_Rejected_Qty !== undefined) ? table_inputs[index].POD_Rejected_Qty : 0,
                    "REMARKS":(table_inputs[index] && table_inputs[index].REMARKS  &&  table_inputs[index].POD_Rejected_Qty !== undefined) ? table_inputs[index].REMARKS : '',
                    "GRNType": ""
                }

                console.log('_temp_status', temp, this.props.grnd_generation.doDetails)

                if(temp.Rejected_Qty > 0 &&  (!temp.REMARKS)){
                    _temp_status = false
                    this.setState({
                        model:true,
                        type:'validation',
                        modal_body:'Please enter remarks '
                    })
                    break;
                  
                }
            

                reqData.table2.push(temp);
                _rej_qty =  (table_inputs[index] && table_inputs[index].POD_Rejected_Qty) ? table_inputs[index].POD_Rejected_Qty.replace(/^0+/, '') : 0
                if( temp.Rejected_Qty > temp.Received_Qty){
                    _temp_status = false
                    this.setState({
                        model:true,
                        type:'validation',
                        modal_body:'Rejected quantity can not exceed received quantity'
                    })
                    break;
                }
            }
            if(_temp_status){
                this.setState({loading:true})
                let _status = await ApiExtract(GRNSubmit, reqData)
                if(_status){
                    this.setState({
                        status: _status.status,
                        model:true,
                        modal_body: _status.message,
                        loading:false,
                    })
                }
            }
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
        console.log('details.target.value', details.target.value)
        if(names=="POD_Rejected_Qty"){
            _empty_details[`${new_details}`] = {
                [names] :  (details.target.value) ? details.target.value : ''
            };
        }
        else{
            _empty_details[`${new_details}`] = {
                [names] :  (details.target.value) ? details.target.value : ''
            };
        }
       
        console.log('handleTableInputs', _empty_details)

        _new_details[`${new_details}`] = Object.assign({}, table_inputs[`${new_details}`],  _empty_details[`${new_details}`])
        table_inputs[`${new_details}`] = _new_details[`${new_details}`]
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

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Line", id:"POD_Po_Line", width:'58px', type:"index", key:true },
            {name : "Item Code", id:"POD_B_Item_Code", width:'100px',  formatter: (cellContent, row) => {
                if(row.POD_B_Item_Code!=null && row.POD_B_Item_Code!='null' && row.POD_B_Item_Code){
                    return row.POD_B_Item_Code
                }
                else if(row.POD_VendOR_Item_Code!=null && row.POD_VendOR_Item_Code!='null' && row.POD_VendOR_Item_Code){
                    return row.POD_VendOR_Item_Code
                }
                else{
                    return 'N/A'
                }
            }},
            {name : "Item Name", id:"POD_Product_Desc", width:'143px'},
            {name : "UOM", id:"POD_UOM", width:'68px'},
            {name : "MPQ", id:"POD_Min_Pack_Qty", width:'68px', dataFormat:'price'},
            {name : "Order Qty", id:"POD_ORdered_Qty", width:'92px', dataFormat:'price'},
            {name : "Outstanding", id:"POD_OutstANDing", width:'115px', formatter: (cellContent, row) => {
                return <div className="text-right">{row.POD_OutstANDing === "" ? 0.00 : parseFloat(row.POD_ORdered_Qty - row.POD_Delivered_Qty).toFixed(2)}</div>
            }},
            
            {name : "Receive Qty", id:"DOD_SHIPPED_QTY", width:'108px', dataFormat:'price'},
            {name : "Reject Qty", id:"POD_Rejected_Qty", width:'96px', dataFormat:'doinput'},
            {name : "Location", id:"defaultLocationDesc", width:'88px', formatter: (cellContent, row) => {
                return <button className="btn btn-outline-primary btn-sm" type="button">Set</button>
            }},
            {name : "Remarks", id:"REMARKS", width:'200px', dataFormat:'textarea'},
        ];

        const _table_header_do_summary = [
            {name : "GRN Date", id:"GM_CREATED_DATE", width:'92px',dataFormat:'date'},
            {name : "GRN Received Date", id:"GM_Date_Received", width:'110px',dataFormat:'date'},
            {name : "GRN No", id:"GM_GRN_No", width:'95px', key:true, formatter: (cellContent, row) => {
                return <button className="btn btn-outline-primary btn-sm" type="button" onClick={()=>this.view_pdf(row)}>{row.GM_GRN_No}</button>
            }},
            {name : "Created by", id:"UM_USER_NAME", width:'132px'},
        ];
        

        

        let _prod_details =  (this.props.grnd_generation && this.props.grnd_generation.doDetails) ? this.props.grnd_generation.doDetails: [] 
        if(_prod_details){
            _prod_details =  _prod_details.filter((list)=>list.DOD_SHIPPED_QTY>0);
        }
        return <div id="tabs"> <Tabs defaultActiveKey="IssueGRN" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={(k) =>{
                    if(k=='GRNListing'){
                        this.props.history.push({
                        pathname:'/issueGrn',
                        redirect_to_tab : 'GRNListing'
                        })
                    }
            }}>
            <Tab eventKey="IssueGRN" title="Issue GRN">
                <Fragment>
                 {(this.props.loading) ? <Loader /> : '' }
                 {(this.state.loading) ? <Loader /> : '' }
                 {(this.props.grndg_loading) ? <Loader /> : '' }
                 {(this.props.dopdf_loading) ? <Loader /> : '' }
                 {(this.props.popdf_loading) ? <Loader /> : '' }
                 {(this.props.grn_submit && this.props.grn_submit.loading) ? <Loader /> : '' }
                 {(this.props.dr_loading) ? <Loader /> : '' }
                 {(this.props.gpdf_loading) ? <Loader /> : '' }
                 
                 
                <PageHeading 
                    heading="" 
                    subheading="Click the location button to change the default location and Submit button to issue GRN." 
                />
                <TabHeading color={'d-flex bg-info text-white p-1 mt-2 mb-3'}>Goods Receipt Note Generation</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row">
                        <div className="col-md-2 collg-2"><label>Vendor : </label></div>
                        <div><p>{(this.state.details) ? this.state.details.CM_COY_NAME : ''}</p></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-2 collg-2"><label>PO Number : </label></div>
                        <div className="col-md-3 col-g-3"><div className="row"><p>{(this.state.details) ? this.state.details.POM_PO_NO : ''}</p></div></div>
                        <div className="col-md-2 collg-2"><label>DO Number :</label></div>
                        <div className="col-md-3 col-g-3"><p>{(this.state.details) ? this.state.details.DOM_DO_NO : ''}</p></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-2 collg-2"><label>Default Location :   </label></div>
                        <div className="col-md-3 col-g-3"><p></p></div>
                        <div className="col-md-3 col-g-3"><label>Default Sub Location : </label></div>
                    </div>

                    <div className="row grn_date">
                        <Field type="text" name="ApproveDto.StartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control " placeholder="Actual Goods Received Date " label="Actual Goods Received Date :" onChange={this.handleDate.bind(this, 'start_date')} />
                    </div>

                    <div className="row mt-2">
                        <div className="col-md-2 col-g-3"><label>DO File(s) Attached : </label></div>
                        <div>
                          
                            {(this.props.grnd_generation && this.props.grnd_generation.attachFileList && this.props.grnd_generation.attachFileList.length  && (this.props.grnd_generation.attachFileList[0].Text!="No Files Attached") )? this.props.grnd_generation.attachFileList.map((val, index) => {
                                return <p className="download-files"><u><span onClick={() => this.props.GetDownloadFile({...val, DOM_S_COY_ID:(this.props.location && this.props.location.datas && this.props.location.datas.DOM_S_COY_ID) ? this.props.location.datas.DOM_S_COY_ID : ''})}>{val.strFile} ({val.Text})</span></u></p>
                            }) : <div className="download_text">No Files Attached</div>}
                        </div>
                    </div>
              
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={_prod_details} 
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
                        {(this.props.grnd_generation && this.props.grnd_generation.GRNSumm && this.props.grnd_generation.GRNSumm.length > 0) ? 
                        <Fragment>
                        <TabHeading color={'bg-info text-white margin-bottom-none'}>Grn History For Purchase Order : {(this.state.details) ? this.state.details.POM_PO_NO : ''}</TabHeading> 
                         <BootstrapCustomTable 
                            table_header={_table_header_do_summary} 
                            table_body={ this.props.grnd_generation.GRNSumm } 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            search={false}
                            table_name="issue_grn"
                        /></Fragment> : ''  } 
                    </div>

                </div>
           
                    <div className="mt-2 row">
                        <div className="col-12 col-sm-6 text-left go-back">
                            <button type="button" className=" mt-2 btn btn-outline-danger btn-sm" onClick={()=>this.props.history.goBack()} >Back</button>
                        </div>
                        <div className="col-12 col-sm-6 text-right">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-primary">Submit</button>
                                <button type="reset" className="ml-4 btn btn-sm btn-outline-danger">Clear</button>
                                <button type="button" className="ml-4 btn btn-sm btn-outline-success" onClick={()=>this.ViewPo()}>View PO</button>
                                <button type="button" className="ml-4 btn btn-outline-success btn-sm" onClick={()=>this.ViewDo()}>View DO</button>
                        </div>
                    </div>  
                
            </form>
        

            <Alert 
                message={this.state.modal_body}
                status={this.state.status} 
                show={this.state.model} 
                confirm={this.closemodel}
            />
           
        </Fragment>
            </Tab>
            <Tab eventKey="GRNListing" title="GRN Listing">
            
            </Tab>
            </Tabs>
        </div>
    }
}


const mapStateToProps = state => ({
    grnd_generation : state.grnd_generation.responseList,
    grndg_loading : state.grnd_generation.loading,
    dopdf_loading : state.generate_dopdf.loading,
    popdf_loading : state.generate_popdf.loading,
     dr_loading : state.file_download.loading,
     gpdf_loading : state.generate_grnpdf.loading,
})
  
const mapDispatchToProps = dispatch => ({
    GetGRNDetailsClick  : (values) => dispatch(GetGRNDetailsClick(values)),
    GetGenerateDOPDF : (values) => dispatch(GetGenerateDOPDF(values)),
    GetGeneratePOPDF : (values) => dispatch(GetGeneratePOPDF(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
    ViewGRNPDF: (values) => dispatch(GetViewGRNPDF(values)),
})

  
const GrnGenerationHolderMain = connect(mapStateToProps, mapDispatchToProps)(GrnGeneration);

export default reduxForm({
    form:'GrnGeneration',
})(GrnGenerationHolderMain);