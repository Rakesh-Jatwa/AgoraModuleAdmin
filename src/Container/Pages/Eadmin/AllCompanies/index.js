import React, {Component, Fragment} from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {GetCompanyList} from '../../../../Actions/Eadmin'
import {TaxType} from '../../../../Actions/Common/Functions'
import Loader from '../../../../Component/Loader'
import {CompareDate} from '../../../../Component/Dates'
import {CompanyStatusAlter, CompanyDelete} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'
import {FromInputsParallelForAllCompany} from '../../../../Component/From/FromInputs' 
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'




class HolidayCalender extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.hide_add = this.hide_add.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.state = {
            products:[],
            render:false,
            start_data:'',
            end_data:'',
            title:'',
            message:'',
            status:false,
            show:false,
            checked_initial : [0,1,2],
            checked_details:[],
            list: [],
            submit_type:'',
            show_details : '',
            country : [],
            show_table :false,
            edit_details : {},
            country_name : '',
            state_name : '',
            search_object : {
                pCompID: "",
                pCompName: ""
            },
            modify_details : {},
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            
          
        }
    }

    componentDidMount(){
        this.setState({
            country_name : 'Malaysia',
            state_name: 'All States'
        })
    }


    closemodel = () => {
        this.setState({
            show : false
        })
        if(this.state.status && this.state.submit_type=="delete"){
            this.handlefromsubmit()
        }

        if(this.state.status && this.state.submit_type=="status_alter"){
            this.handlefromsubmit()
        }


        
    }


   
    async  getProducts (values, details){
        let _all_products = this.state.products
        if(details){
            _all_products.push(values)
            await this.setState({
                products : _all_products
            })
        }
        else{
            let _products = this.state.products.filter((fieldValue, index) => fieldValue.CM_COY_ID != values.CM_COY_ID);
             await this.setState({
                products : _products
            })
        }
    }

      getProductsall = async(_products, details) => {
        let _all_products = this.state.products;
        if(_products.length){
            if(details){
                for(let i=0;i<_products.length;i++){
                    _all_products.push(_products[i])
                    if (i != _products.length) {
                        await this.setState({products : _all_products})
                    }
                }
            }
            else{
                let _temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                        _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.CM_COY_ID != _products[i].CM_COY_ID);
                        if (i != _products.length) {
                             this.setState({products : _temp_query})
                        }
                   
                }
                
            }
        }
        
    }
 
    Reset = () => {
        this.setState({
            list : (this.props.policy_list && this.props.policy_list.length) ? this.props.policy_list : [],
            render : false
        })
    }

    
    Delete = async() => {
        let {products} = this.state
        if(products && products.length){
           let _temp_details = products.map((list_details)=>{
               return {strCompid : list_details.CM_COY_ID}
           })
            let _status = await ApiExtract(CompanyDelete, {companyData:_temp_details});
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :"delete",
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
       }
    }

    StatusAlter = async(status) =>{
        let {products} = this.state
         if(products && products.length){
            let _temp_details = {
                strAction : status,
                companyData : products
            }
            let _status = await ApiExtract(CompanyStatusAlter, _temp_details);
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :"status_alter",
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
       }
    }

    ClearAll = () =>{
        this.props.reset('TaxCode')
    }


    handlefromsubmit= async(values={}) =>{
       let {search_object} = this.state
        let _values  = Object.assign({}, values)
        _values =  RemoveSpecialCharacter(_values)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.GetCompanyList(_values)
                this.setState({
                    show_table : true,
                    search_object : _values
                })
            }
            else{
                this.setState({
                    message : 'End date should be greater than or equal to Start date',
                    status :false,
                    show : true
                })

            }
        }
        else{
            this.props.GetCompanyList(_values)
            this.setState({
                show_table : true,
                search_object : _values
            })
        }
        
    }

    Add = () =>{
        this.setState({
            show_details : 'add',
        })
    }

 

    get_details = (row) =>{
        if(row){
            let _temp_details = {
                userGroupId:row.UGM_USRGRP_ID,
                appPackageId:row.UGM_APP_PKG
            }
            this.setState({
                edit_details : _temp_details,
                show_details : 'modify'
            })
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make at least one selection!',
            })
        }
    }

   

    hide_add = () =>{
        this.handlefromsubmit()
        this.setState({
            show_details : '',
        })
        this.props.reset('UG_details_maintenance')
    }

    ClearAll = () =>{
        this.props.reset('HolidayCalenderHolder')
    }

    ClodeAdd = () =>{
        this.handlefromsubmit()
        this.setState({
            show_details: ''
        })
    }

    confirm_function = (type, text) => {

        if(this.state.products.length === 0){
            this.setState({
                show:true,
                status :false,
                message : 'Please make at least one selection!',
            })  
            return false;
        }          

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
        if(_confimation_type=="delete"){
            this.Delete()
        }
        else if(_confimation_type=="activate"){
            this.StatusAlter('A')
        }
        else if(_confimation_type=="deactivate"){
            this.StatusAlter('I')
        }

    }


    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Company ID", id:"CM_COY_ID", width:'35px', key:true, key:true},
            {name : "Company Name", id:"CM_COY_NAME", width:'37px'},
            {name : "Company Type", id:"CM_COY_TYPE", width:'35px'},
            {name : "License Package", id:"COUNCM_LICENCE_PACKAGETRY", width:'38px'},
            {name : "No.of License Users", id:"CM_LICENCE_PACKAGE", width:'50px'},
            {name : "Subscription Start Date", id:"CM_SUB_START_DT", width:'50px',dataFormat:'date'},
            {name : "Subscription End Date", id:"CM_SUB_END_DT", width:'50px' ,dataFormat:'date'},
            {name : "Status", id:"CM_STATUS", width:'25px'},
        ];
        let {company_list} = this.props
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.st_loading) ? <Loader /> : '' }
              
            
              
              <Fragment>
                {/* <PageHeading  heading="Tax Code" subheading="Fill in the search criteria and click Search button to list the relevant tax code. Click the Add button to add new tax code. "  /> */}
                <PageHeading  heading="All Companies" subheading=""  />
                <TabHeading color={'bg-info text-white margin-bottom-none'}> Search Criteria</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className='row'> 
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <Field type="text" name="pCompID" component={FromInputsParallelForAllCompany} className="form-control" placeholder="Company ID" label="Company ID " />
                                <Field type="text" name="pCompName" component={FromInputsParallelForAllCompany} className="form-control" placeholder="Company Name" label="Company Name " />
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-12 mt-2 text-right">
                                    <button type="submit" className="btn btn-sm btn-outline-success" >Search</button>
                                    <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.ClearAll()}>Reset</button>
                                </div>
                            </div>
                        </div>
                      
                    </div>  
                </form>
              
           
                <div className="row mt-4">    
                {(this.state.show_table) ?  
                 <div >   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={company_list} 
                            products={this.getProducts}
                            select={true} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={false}
                            table_name="issue_grn"
                            selectall={this.getProductsall}
                            wrapperClasses="table-responsive" 
                        />
                    </div>: ''}
                  
                    <div className={`col-md-6 col-lg-6 text-left mt-2 ${!this.state.show_table && `custom-disabled`}`}>
                        <button type="reset" disabled={!this.state.show_table ? true :  false}  className="btn btn-sm btn-outline-danger mr-2" onClick={()=>this.confirm_function('delete', 'permanently delete this item(s)')}>Delete</button>
                        <button type="button" disabled={!this.state.show_table ? true :  false} className="btn btn-sm btn-outline-success mr-2" onClick={()=>this.confirm_function('activate', 'activate this item(s)')}>Activate</button>
                        <button type="button" disabled={!this.state.show_table ? true :  false} className="btn btn-sm btn-outline-primary mr-2" onClick={()=>this.confirm_function('deactivate', 'deactivate this item(s)')}>Deactivate</button>
                       
                    </div>
                </div> 
                </Fragment>
                <Alert 
                    confirm={this.closemodel} 
                    title={this.state.title}
                    message={this.state.message}
                    status={this.state.status}
                    show={this.state.show}
                />
                 <ConfirmationModel
                     title="" 
                     confimation = {true}
                     message={this.state.modal_body} 
                     status={this.state.status} 
                     show={this.state.confimation_pop} 
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />
        </Fragment>
    }
}

const mapStateToProps = state => ({
    company_list : state.company_list.responseList,
    loading : state.company_list.loading,
})

const mapDispatchToProps = dispatch => ({
    GetCompanyList  : (values) => dispatch(GetCompanyList(values)),
})


const HolidayCalenderHolder = connect(mapStateToProps, mapDispatchToProps)(HolidayCalender);
export default reduxForm({
    form:'TaxCode',
})(HolidayCalenderHolder);