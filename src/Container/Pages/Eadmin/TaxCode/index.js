import React, {Component, Fragment} from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable_Update_Pagination'
import {GetTaxCodeList, GetState, GetHolidayList} from '../../../../Actions/Eadmin'
import {TaxType} from '../../../../Actions/Common/Functions'
import Loader from '../../../../Component/Loader'
import {PolicyListSave, TaxCodeDelete, TaxCodeDetails} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'
import {FromInputsParallel} from '../../../../Component/From/FromInputs'  
import TaxCodeAlter from './TaxCodeAlter'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
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
            confimation_pop:false ,
            search_object : {
                hm_country: "",
                hm_state: "All",
                hm_year: ""
            },
            modify_details : {}
            
          
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
            let _products = this.state.products.filter((fieldValue, index) => fieldValue.TM_TAX_INDEX != values.TM_TAX_INDEX);
             await this.setState({
                products : _products
            })
        }
    }
 
    Reset = () => {
        this.setState({
            list : (this.props.policy_list && this.props.policy_list.length) ? this.props.policy_list : [],
            render : false
        })
    }

    
    Save = async() => {
       let {list} = this.state
       if(list && list.length){
            let _status = await ApiExtract(PolicyListSave, list);
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :"save",
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
        console.log('handlefromsubmit', _values, values)
        this.props.GetTaxCodeList(_values)
        this.setState({
            show_table : true,
            search_object : _values
        })
    }

    Add = () =>{
        this.setState({
            show_details : 'add',
        })
    }

    Modify = async() =>{
        let {products, search_object} = this.state;
        if(products.length){
            if(products.length==1){
                products = products[0]
                let _status = await ApiExtract(TaxCodeDetails, products);
                if(_status){
                    this.setState({
                        loading:false,
                        show_details :"modify",
                        show:false,
                        modify_details : (_status.response && _status.response.length>=1) ? _status.response[0] : {}
                    })
                }
              
            }
            else{
                this.setState({
                    show:true,
                    status :false,
                    message : 'Please make only one selection',
                })
            }
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
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
                message : 'Please make atleast only one selection!',
            })
        }
    }

    Delete = async() =>{
        let {products} = this.state;
        if(products.length){
            let _status = await ApiExtract(TaxCodeDelete, {delData:products});
            if(_status){
                this.handlefromsubmit()
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
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
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

    handleChange = (e) =>{
        this.props.GetState({countryCode : e})
    }

    ClodeAdd = () =>{
     //   this.handlefromsubmit()
        this.setState({
            show_details: ''
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



    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "No", id:"TM_TAX_INDEX", width:'50px', key:true, key:true,type:"index"},
            {name : "Tax Code", id:"TM_TAX_CODE", width:'50px'},
            {name : "Description", id:"TM_TAX_DESC", width:'100px'},
            {name : "Country", id:"COUNTRY", width:'100px'},
            {name : "Type", id:"TM_TAX_TYPE", width:'100px' ,formatter: (cellContent, row) => {
                    return TaxType(row.TM_TAX_TYPE)
                },
            },
            
            {name : "Rate", id:"TAXRATE", width:'100px'}
        ];
        let {country, pro_state, holiday_list, tax_code_list} = this.props
        let {country_name, state_name} = this.state
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.st_loading) ? <Loader /> : '' }
              
            
              
              <Fragment>
                <PageHeading  heading="Tax Code" subheading="Fill in the search criteria and click Search button to list the relevant tax code. Click the Add button to add new tax code. "  />
                <TabHeading color={'bg-info text-white margin-bottom-none'}> Search Criteria</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className='row'> 
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <Field type="text" name="strCode" component={FromInputsParallel} className="form-control" placeholder="Tax Code" label="Tax Code" />
                          
                                <div className="col-12 col-md-6 mt-2">
                                    <button type="submit" className="btn btn-sm btn-outline-success" >Search</button>
                                    <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.ClearAll()}>Clear</button>
                                </div>
                            </div>
                        </div>
                      
                    </div>  
                </form>
                {(this.state.show_details=="add") ? 
                    <TaxCodeAlter
                        datas = {this.state.search_object}
                        close = {this.ClodeAdd}
                        country_name = {country_name}
                        state_name = {state_name}
                        type={this.state.show_details}
                        
                    /> 
                : ''}
                 {(this.state.show_details=="modify") ? 
                  <TaxCodeAlter
                      datas = {this.state.modify_details}
                      close = {this.ClodeAdd}
                      country_name = {country_name}
                      state_name = {state_name}
                      type={this.state.show_details}
                  /> 
              : ''}
              {this.state.show_details=="add" || this.state.show_details=="modify" ? <div className="col-12 mt-3">
                    <p><sapn className="text-danger">*</sapn><span className="text-success"> indicates required field</span></p>
                </div>:null}
                 <div className="row mt-4">    
                 {(this.state.show_table) ?  <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={tax_code_list} 
                            products={this.getProducts}
                            select={true} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={false}
                            table_name="issue_grn"
                        />
                    </div>: ''} 
                    {/* {(this.state.show_details=="") ? */}
                    <div className="col-md-6 col-lg-6 text-left mt-2">
                        <button type="button" disabled={this.state.show_details && this.state.show_details=="modify"? true :false} className={`btn btn-sm ${this.state.show_details=="modify" ? "custom-disabled-btn-outline-success" : ""} btn-outline-success`} onClick={()=>this.Add()}>Add</button>
                        <button type="button" disabled={((!this.state.show_details ||  this.state.show_details=="add") && !this.state.show_table) || this.state.show_details=="add"? true :false} className={`btn btn-sm ${(!this.state.show_details ||  this.state.show_details=="add") && !this.state.show_table || this.state.show_details=="add" ? "custom-disabled-btn-outline-primary" : ""} btn-outline-primary ml-2`} onClick={()=>this.Modify()}>Modify</button>
                        <button type="reset" disabled={(!this.state.show_details || this.state.show_details=="modify" &&  this.state.show_details=="add") && !this.state.show_table || (this.state.show_details=="modify" ||  this.state.show_details=="add") ? true :false} className={`btn btn-sm ${(!this.state.show_details || this.state.show_details=="modify" &&  this.state.show_details=="add") && !this.state.show_table || (this.state.show_details=="modify" ||  this.state.show_details=="add") ? "custom-disabled-btn-outline-danger" : ""} btn-outline-danger ml-2`} onClick={()=>this.confirm_function('delete', 'permanently delete this item(s)')}>Delete</button>
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
    tax_code_list : state.tax_code_list.responseList,
    loading : state.tax_code_list.loading,
    pro_state : state.ed_state.responseList,
    st_loading : state.ed_state.loading,
    holiday_list : state.holiday_list.responseList,
})

const mapDispatchToProps = dispatch => ({
    GetTaxCodeList  : (values) => dispatch(GetTaxCodeList(values)),
    GetState : (values) => dispatch(GetState(values)),
    GetHolidayList : (values) => dispatch(GetHolidayList(values))
})


const HolidayCalenderHolder = connect(mapStateToProps, mapDispatchToProps)(HolidayCalender);
export default reduxForm({
    form:'TaxCode',
})(HolidayCalenderHolder);