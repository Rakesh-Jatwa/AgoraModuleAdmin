import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {convertDateToYear, CompareDate} from '../../../../Component/Dates'
import {AppendPrStatus, FOrmatePRMassApprove} from '../../../../Actions/Common/Functions'
import {PrMassApproval} from '../../../../Apis/Approver'
import {ApiExtract} from '../../../../Common/GetDatas'
import {UserDetails} from '../../../../Common/LocalStorage'
import Alert from '../../../../Component/Modal/alert'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import {FromInputsParallel, FormDatePickerParallel, FormRadioButton, FormDatePickerParallelCustomClass} from '../../../../Component/From/FromInputs'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.getProductsall = this.getProductsall.bind(this)
        this.getProducts = this.getProducts.bind(this)
        
        this.get_details = this.get_details.bind(this);
        this.state = {
            products:[],
            open:false,
            loading:false,
            start_data:'',
            end_data:'',
            check_value:false,
            all_check_value:[],
            model:false,
            message : '',
            status:false,
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

    componentDidMount(){
        
        let _initial_obj = new Object();
        _initial_obj.ApproveDto = {
            PRNumber: "",
            VendorName : "",
            StartDate: "",
            EndDate: "",
            prType : "",
        }
        this.props.get_search_list(_initial_obj)
    }

    closemodel = () => {
        this.setState({
            open : false,
            modal : false
        })
    }

    get_details(details){
        this.props.history.push({
            pathname : '/viewpr',
            datas : details,
        })
    }

    get_vendor(details){
        if(details.SNAME=="Multiple Vendors"){
            var data = { "PRM_PR_NO": details.PRM_PR_No}
            this.props.history.push({
                pathname : '/multi_vendor_details_page',
                datas : data,
            })
        }
        else{
            var data = { "v_com_id": details.SNAMEID}
            this.props.history.push({
                pathname : '/vendorDetailsPage',
                datas : data,
            })
        }
      
    }

    getDetails(){

    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
            })
       }
    }

    async  getProductsall (_products, details){
        let _all_products = this.state.products;
        let _user_etails = UserDetails()
        if(_products.length){
            if(details){
                for(let i=0;i<_products.length;i++){
                    let _temp_Details  =  FOrmatePRMassApprove(_products[i], _user_etails.UM_USER_ID)
                    _all_products.push(_temp_Details)
                    if (i != _products.length) {
                        await this.setState({products : _all_products})
                    }
                }
            }
            else{
                let _temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                    _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.PRIndex != _products[i].PRM_PR_Index);
                    if (i != _products.length) {
                            this.setState({products : _temp_query})
                    }
                }
            }
        }
    }

    async  getProducts (values, details){
        let _all_products = this.state.products;
        let _user_etails = UserDetails()
        let _temp_details = {}
        if(details){
            _temp_details = FOrmatePRMassApprove(values, _user_etails.UM_USER_ID)
           _all_products.push(_temp_details)
           await this.setState({
                products : _all_products
            })
        }
        else{
            let _products = this.state.products.filter((fieldValue, index) => fieldValue.PRIndex != values.PRM_PR_Index);
             await this.setState({
                products : _products
            })
        }
    }

    handlefromsubmit(values){
        let _form_value = values;
        let _initial_obj = {
            PRNumber: "",
            VendorName : "",
            StartDate: (this.state.start_data) ? convertDateToYear(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? convertDateToYear(this.state.end_data)  :"",
            prType : "",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        _form_value.StartDate = (this.state.start_data) ? convertDateToYear(this.state.start_data)  :"";
        _form_value.EndDate = (this.state.end_data) ? convertDateToYear(this.state.end_data)  :"";
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_list({ApproveDto:_form_value})
            }
            else{
                this.setState({
                    message : 'End date should be greater than or equal to Start date',
                    status :false,
                    open : true
                })

            }
        }
        else{
            this.props.get_search_list({ApproveDto:_form_value})
        }
       
    }

    CLearAll = () =>{
        this.setState({
            products:[],
            start_data:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            all_check_value:[],
        })
        this.props.reset_form()
    }

    ApproveAll = async() =>{
        let {products} = this.state
        if(products.length){
           this.setState({loading:true})
           let _status = await ApiExtract(PrMassApproval, { "approveData":products});
           if(_status){
                this.setState({
                    open:true,
                    loading:false,
                    status: _status.status,
                    message : _status.message
                })
           }
        }
        else{
            this.setState({
                open:true,
                message : 'Please make atleast only one selection!',
                status : false
            })
        }
    }



    render(){
        
        
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PR Number", id:"PRM_PR_No", width:'200px', key:true,
            formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.PRM_PR_No} 
                            <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span>
                            {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}
                    </button>
                )
            }},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'78px',
            formatter: (cellContent, row) => {
                return (
                    (row.PRM_PR_TYPE === 'cc' || row.PRM_PR_TYPE==='CC') ? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Submitted Date", id:"PRM_SUBMIT_DATE", width:'144px',dataFormat:'date'},
            {name : "Buyer", id:"PRM_REQ_NAME", width:'102px'},
            {name : "Buyer Department", id:"CDM_DEPT_NAME", width:'144px'},
            {name : "Vendor Name", id:"SNAME", width:'162px',formatter: (cellContent, row) => {
                return (row.SNAME) ? <button className="btn btn-small btn-outline-info" variant="primary" onClick={() => this.get_vendor(row)}>{row.SNAME}</button> : ''
    
            }},
            {name : "Status", id:"STATUS_DESC", width:'110px',formatter: (cellContent, row) => {
                return (row.STATUS_DESC) ? AppendPrStatus(row.STATUS_DESC, row) : ''
            }},
            
        ];
        
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))} autoComplete="off">
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant PR for approval. Click the PR Number to go to PR approval page." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="ApproveDto.PRNumber" component={FromInputsParallel} className="form-control" placeholder="PR No. " label="PR No. :" />
                            <Field type="text" name="ApproveDto.VendorName" component={FromInputsParallel} className="form-control" placeholder="Vendor Name " label="Vendor Name : " />
                        </div>

                        <div className="row  mt-3">
                            <div className="col-lg-1 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">PR Type : </label>
                            </div>
                            <div className="col-12 col-lg-2 ml-5"> 
                                <Field type="text" name="ApproveDto.prType"  component={FormRadioButton} label="Contract PR" checkvalue="CC" selected={false}/> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="ApproveDto.prType"  component={FormRadioButton} label="Non-Contract PR"  checkvalue="NonCont"  selected={false}/> 
                            </div>
                        </div>
                                           

                        <div className="row">
                            <Field type="text" name="ApproveDto.StartDate" onChange={this.handleDate.bind(this, 'start_date')}  selected={this.state.start_data} component={FormDatePickerParallelCustomClass} class_name="col-12 col-sm-5 approvepr-starte-date" placeholder="Start Date " label="Start Date : " clear={true}/>
                            <Field type="text" name="ApproveDto.EndDate" onChange={this.handleDate.bind(this, 'end_date')}  selected={this.state.end_data}  minDate= {this.state.start_data} component={FormDatePickerParallelCustomClass} class_name="col-12 col-sm-4" placeholder="End Date " label="End Date : " clear={true}/>
                            <div className="col-sm-3 mt-2 text-right">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-primary">Search</button>
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.CLearAll()}>Clear</button>
                            </div>
                        </div>
                       
                  
                    </div>  
                   
                       
                    
                </div> 
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result && this.props.search_result.list) ? this.props.search_result.list : [] } 
                            products={this.getProducts} 
                            select={true} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            products={this.getDetails}
                            table_name="issue_grn"

                            selectall={this.getProductsall}
                            products={this.getProducts} 
                        />
                    </div>
                </div>
                </form>
                <div className="row mt-2">
                        <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.ApproveAll()}>Mass Approve</button> </div>
                </div>
                <Alert 
                    title="" 
                    message={this.state.message} 
                    status={this.state.status} 
                    show={this.state.open} 
                    confirm={this.closemodel}
                />
        </Fragment>
    }
}

export default reduxForm({
    form:'ApprovalList',
})(ApprovalRejectList);
