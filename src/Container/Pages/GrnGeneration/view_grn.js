import React, {Component, Fragment } from 'react';
import {reduxForm } from 'redux-form';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import {TodayDateSalash} from '../../../Component/Dates'
import Enum from '../../../Common/GlobalEnum'
import {GetPreviewGRN} from '../../../Actions/Requester'
import {GetViewGRNPDF} from '../../../Actions/Vendor'
import {connect} from 'react-redux';
import BackButton from '../../../Component/Buttons/Back'
class ViewDO extends Component {

    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)

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
        this.setState({
            products :this.props.location.datas,
            model:false,
            modal_body :'',
        })
        let _post_data = this.props.location.datas
        this.props.GetPreviewGRN(this.props.location.datas);
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

    get_grnpdf_details = () =>{
        if(this.props.location && this.props.location.datas){
            this.props.GetViewGRNPDF(this.props.location.datas)
        }
        
    }

    documentDownload(filePath){
        this.props.download_file(filePath)
    }

  

    render(){
        const _table_header = [
            {name : "Level", id:"POD_Po_Line", width:'58px', type:"index", key:true },
            {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'100px', dataFormat:"validatedata" },
            {name : "Item Name", id:"POD_PRODUCT_DESC", width:'143px'},
            {name : "UOM", id:"POD_UOM", width:'68px'},
            {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'68px', dataFormat:'price'},
            {name : "PO Qty", id:"POD_ORDERED_QTY", width:'92px', dataFormat:'price'},
            {name : "Shipped Qty", id:"GD_RECEIVED_QTY", width:'92px', dataFormat:'price'},
            {name : "GRN Qty", id:"GD_RECEIVED_QTY",  width:'92px', formatter: (cellContent, row) => {
            return <div className="text-right">{parseFloat(row.GD_RECEIVED_QTY - row.GD_REJECTED_QTY).toFixed(2)}</div>
            }},
            {name : "Rejected Qty", id:"GD_REJECTED_QTY", width:'108px', dataFormat:'price'},
            {name : "Remarks", id:"GD_REMARKS", width:'108px'},
        ];

        const { handleSubmit } = this.props
        return <Fragment>
                 {(this.props.loading) ? <Loader /> : '' }
                 {(this.props.fl_loading) ? <Loader /> : '' }
                 {(this.props.gdopdf_loading) ? <Loader /> : '' }
                 {(this.props.vg_loading) ? <Loader /> : '' }
                 {(this.props.gr_loading) ? <Loader /> : '' }
                 
                 {/* <PageHeading 
                    heading="" 
                    subheading="Click the Save button to save the new PO as draft DO. Click the Submit button to submit the DO to the buyer." 
                /> */}
                <TabHeading color={'bg-info text-white'}>Goods Receipt Note Details</TabHeading> 
                <div className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>PO Number :	</label></div>
                        <div className="col"> {(this.props.view_grn && this.props.view_grn[0]) ? this.props.view_grn[0].POM_PO_NO : ''}</div>
                        <div className="col-12 col-md-2 col-lg-2"><label>	DO Number :</label></div>
                        <div className="col">{(this.props.view_grn && this.props.view_grn[0]) ? this.props.view_grn[0].DOM_DO_NO : ''}</div>
                </div>
                <div className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label> GRN Number :	</label></div>
                        <div className="col">{(this.props.view_grn && this.props.view_grn[0]) ?this.props.view_grn[0].GM_GRN_NO : ''}</div>
                        <div className="col-12 col-md-2 col-lg-2"><label>	 Created By :</label></div>
                        <div className="col">{(this.props.view_grn && this.props.view_grn[0]) ? this.props.view_grn[0].POM_BUYER_NAME: ''}</div>
                </div>
                <div className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>  GRN Date :		</label></div>
                        <div className="col">{(this.props.view_grn && this.props.view_grn[0]) ? TodayDateSalash(this.props.view_grn[0].POM_PO_DATE): ''}</div>
                        <div className="col-12 col-md-2 col-lg-2"><label>		 Actual Goods Received Date :	</label></div>
                        <div className="col">{(this.props.view_grn && this.props.view_grn[0]) ? TodayDateSalash(this.props.view_grn[0].POM_PO_DATE): ''}</div>
                </div>
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.view_grn && this.props.view_grn.length > 0 ) ? this.props.view_grn : [] } 
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
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 col-sm-6 text-left go-back">
                                <div className="row">
                                    <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history}/>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>this.get_grnpdf_details()}>View GRN</button>
                        
                            </div>
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
    view_grn : state.view_grn.responseList,
    vg_loading : state.view_grn.loading,
    gr_loading : state.generate_grnpdf.loading,
})
const mapDispatchToProps = dispatch => ({
    GetPreviewGRN  : (values) => dispatch(GetPreviewGRN(values)),
    GetViewGRNPDF   : (values) => dispatch(GetViewGRNPDF(values)),
})
const ViewDOHolder = connect(mapStateToProps, mapDispatchToProps)(ViewDO);
export default ViewDOHolder;