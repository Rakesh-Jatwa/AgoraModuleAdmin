import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import {FromInputs, FormDatePicker, FormRadioButton, FormRadioButtonSpan} from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Common from '../../../../Common'
import {FromateDate} from '../../../../Component/Dates'
import Modal from '../../../../Component/Modal'
import Alert from '../../../../Component/Modal/alert'

const _table_body = Common.prs_Data();
class Cancellation extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.updateData = this.updateData.bind(this)
        this.closemodel = this.closemodel.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.state = {
            products:[],
            start_data:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            all_check_value:[],
            model:false,
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }


    closeModel = () => {
        this.setState({
            modal : false
        })
    }

    

    handlefromsubmit(values){
    
        let _form_value = values;
        let _initial_obj = {
            PRNumber: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data  : null ,
            UIEndDate: (this.state.end_data) ? this.state.end_data  : null ,
            dteDateTo: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            dteDateFr: (this.state.end_data) ? FromateDate(this.state.end_data)  :"",
        }
        _form_value.PurchaseRequestCancellation = Object.assign({}, _initial_obj,(_form_value.PurchaseRequestCancellation) ? _form_value.PurchaseRequestCancellation : _form_value )
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_prlist(_form_value)
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than or equal to Start date',
                    status :false,
                    modal : true
                })

            }
        }
        else{
            this.props.get_search_prlist(_form_value)
        }
       

    }

    handleheaderlinks(values){
        let _target_name = values.target.getAttribute('data-field');
        if(_target_name){
            this.setState({
                model:true,
                modal_title:_target_name
            })
        }
    }

    updateData(data, type) {
        if(type=="cancel"){
            let _details = {
                lblPRNo: data.PRM_PR_No,
                PRIndex: data.PRM_PR_Index,
                CurrentAppSeq: "",
                strRemark: "",
                caller: ""
            }
            this.props.get_cancel_pr(_details);
        }
        else if(type=="void"){
            this.props.get_void_pr(data);
        }
        else if(type=="view"){
            this.props.get_generate_prpdf(data);
        }
    }

    getProducts (values){
        let _all_products = this.state.products;
        if(values.hasOwnProperty('itemcode')){
            _all_products.push(values.itemcode)
            this.setState({
                products : _all_products
            })
        }
    }

    closemodel = () => {
        this.setState({
            model : false
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

    componentDidUpdate(prevProps, prevState){
        if(this.props.pr_status.strMsg!=prevProps.pr_status.strMsg){
            this.setState({
                model:true
            })
        }
    }

    viewPageDetails(details, cell, row){
        this.props.get_pr_details(cell)
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: cell,
            type:'cancel'
        })
    }


    ClearAll = () => {
        this.setState({
            checked_details:  [],
            start_data:'',
            end_data:''
        })
        this.props.reset('PoCancellation')
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PR No.", id:"PRM_PR_No", width:'200px', key:true,  key:true,formatter: (cellContent, row) => {
                return (
                  <button className="btn btn-outline-primary btn-sm" size="sm" variant="primary"  onClick={() => this.viewPageDetails(cellContent, row)} ><span className="row_name">{row.PRM_PR_No}</span> <span className="row_symbol">{row.PRM_URGENT === "1" ? ' U' : ''}</span></button >
                )
            }},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'100px', formatter: (cellContent, row) => {
                return (
                    (row.PRM_PR_TYPE === 'CC' || row.PRM_PR_TYPE === 'cc')? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Creation Date", id:"PRM_CREATED_DATE", width:'144px'},
            {name : "Submission Date", id:"PRM_SUBMIT_DATE", width:'144px'},
        ];

       
       
        return <Fragment>
             {(this.props.sp_loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
            <PageHeading 
                heading="Purchase Request Cancellation" 
                subheading="" 
            />


                <Modal open={this.state.model} header ={false}  closemodel={this.closemodel} footer={true} footercontent={<div className="text-center" style={{width:'100%'}}><button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></div>}>
                        <h6>{this.props.pr_status.strMsg}</h6>
                 </Modal>
        
              <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
               
                <div className="row mt-2">    
                    <div className='col-12 col-md-6'>   
                        <div className="row">     
                            <Field type="text" name="PurchaseRequestCancellation.strPRNo" component={FromInputs} className="form-control" placeholder="PR No." label="PR No." />
                        </div> 
                       
                  
                        <div className="row  mt-3">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">PR Type :</label>
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-12">  
                                <Field type="text" name="PurchaseRequestCancellation.strPRType" selected={this.state.end_data} component={FormRadioButton} label="Contract PR" checkvalue="CC" selected={false}/> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="PurchaseRequestCancellation.strPRType" selected={this.state.end_data} component={FormRadioButton} label="Non-Contract PR"  checkvalue="NonCont"  selected={false}/> 
                            </div>
                        </div>
                    </div>  
                    <div className='col-12 col-md-6'>   
                        <div className="row">   
                            <Field type="text" name="PurchaseRequestCancellation.UIStartDate" selected={this.state.start_data} component={FormDatePicker} className="form-control" placeholder="Start Date " label="Start Date"    onChange={this.handleDate.bind(this, 'start_date')} />
                        </div> 
                        <div className="row mt-2">   
                            <Field type="text" name="PurchaseRequestCancellation.UIEndDate" selected={this.state.end_data} value={this.state.end_data} component={FormDatePicker} className="form-control" placeholder="End Date " label="End Date" minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')} /> 
                        </div>   
                    </div> 
                       
                    <div className="col-12">
                        <div className="text-center mt-2 row">
                            <div className="col-12 mt-2">
                        
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                        
                                <button type="button" className="ml-4  btn btn-outline-primary btn-sm">Select All</button>
                        
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button>
                            
                            </div>
                        </div>
                    </div>
                    

                </div> 
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_product_list && this.props.search_product_list) ? this.props.search_product_list: [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            headerclick={this.handleheaderlinks}
                            getData = {this.updateData}
                        />

                    </div>
                </div>
              
            </form>
            <Alert 
                message={this.state.modal_body}
                status={this.state.status} 
                show={this.state.modal} 
                confirm={this.closeModel}
            />
     </Fragment>
    }
}

export default reduxForm({
    form:'PoCancellation',
})(Cancellation);
