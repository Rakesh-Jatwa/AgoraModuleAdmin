import React, {Component, Fragment} from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {GetUserGroupList} from '../../../../Actions/Eadmin'
import Loader from '../../../../Component/Loader'
import {PolicyListSave, UserGroupDelete} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'
import {FormDatePicker,FromInputsParallelForAllCompany} from '../../../../Component/From/FromInputs'
import UGDetailsMaintenance from './UG_details_maintenance'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
class SecurityPolicyMaintenance extends Component {
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
            show_table :false,
            edit_details : {},
            confimation_pop:false ,
            search_object : {
                "userGroupId":"PHP",
                "userGroupName":""
            },
          
        }
    }

    componentDidMount(){
    }


    closemodel = () => {
        this.setState({
            show : false
        })
    }


   
    async  getProducts (values, details){
        let _all_products = this.state.products
        if(details){
            values.checked = "false"
            values.appPackageId = values.UGM_APP_PKG
            values.userGroupId = values.UGM_USRGRP_ID
            _all_products.push(values)
            await this.setState({
                products : _all_products
            })
        }
        else{
            let _products = this.state.products.filter((fieldValue, index) => fieldValue.UGM_AUTO_NO != values.UGM_AUTO_NO);
             await this.setState({
                products : _products
            })
        }
    }
 


    ChangeValue = async(values, props) =>{
        let {list} = this.state;
        let _details = [];
        if(list && list.length){
            _details =  await list.map( (list_item, index)=>{
                if(list_item.LP_AUTO_NO == props.LP_AUTO_NO){
                    list_item.LP_VALUE = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            list : _details
        })
    }

    ChangeSelect = async (values, props) =>{
        let {list} = this.state;
        let _details = [];
        if(list && list.length){
            _details =  await list.map( (list_item, index)=>{
                if(list_item.LP_AUTO_NO == props.LP_AUTO_NO){
                    list_item.LP_PARAM_IND = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            list : _details
        })
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
        this.props.reset('SecurityPolicyMaintenanceHolder')
    }


    handlefromsubmit= (values={}) =>{
       let  _values = (values.DoListing) ? values.DoListing : {};       

       _values  = Object.assign({}, _values)

       console.log('_values ',_values);

       this.props.GetUserGroupList(_values)
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

    Modify = () =>{
        let {products} = this.state;      
 
        if(products.length){
            if(products.length==1){
                
              
                products = products[0]
                let _temp_details = {
                    userGroupId:products.UGM_USRGRP_ID,
                    appPackageId:products.UGM_APP_PKG
                }

                console.log('_temp_details[0] ',_temp_details);


                this.setState({
                    edit_details : JSON.parse(JSON.stringify(_temp_details)),
                    show_details : 'modify'
                })
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
                message : 'Please make at least one selection!',
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
                message : 'Please make at least one selection!',
            })
        }
    }

    Delete = async() =>{
        let {products, search_object} = JSON.parse(JSON.stringify(this.state));       
        if(products.length){
            let _details_main = search_object
            _details_main.modeType = "multiple";
            _details_main.delData = products
            this.setState({loading:true})
            products.modeType = "multiple";
            let _status = await ApiExtract(UserGroupDelete, _details_main);
            if(_status){
                this.handlefromsubmit()
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
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make at least one selection!',
            })
        }
    }

    hide_add = async () =>{
        await this.props.reset('UG_details_maintenance')
        this.handlefromsubmit();
        this.setProducts();
        this.setState({
            show_details : '',
        })
       // await this.props.reset('UG_details_maintenance')
    }

    async setProducts (){
        let _all_products = this.state.products       
        _all_products.length= 0;
        await this.setState({
            products : _all_products
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
        let {products} = this.state;
        if(products.length === 0){
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


    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "User Group ID", id:"UGM_USRGRP_ID", width:'100px', key:true, formatter: (cellContent, row) => {
                    return (
                        <span className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.UGM_USRGRP_ID}</span>
                    )
                },
            },
            {name : "User Group Name", id:"UGM_USRGRP_NAME", width:'100px'},
            {name : "Application Package", id:"UGM_APP_PKG", width:'100px'},
            {name : "Role", id:"UGM_FIXED_ROLE", width:'100px'},    
            {name : "Type", id:"UGM_TYPE", width:'100px'},    
            
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.state.show_details=="") ? 
              
              <Fragment>
                <PageHeading  heading="User Group Maintenance" subheading=""  />
                <TabHeading color={'bg-info text-white'}>Search Criteria </TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className='row'>     
                        <Field type="text" name="DoListing.userGroupId" component={FromInputsParallelForAllCompany} className="form-control" placeholder="User Group ID " label="User Group ID " />
                        <Field type="text" name="DoListing.userGroupName" component={FromInputsParallelForAllCompany} className="form-control" placeholder="User Group Name" label="User Group Name " />
                        <div className="col-md-12 col-lg-12 text-right mt-3">
                            <button type="submit" className="btn btn-sm btn-outline-success" >Search</button>
                            <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.ClearAll()}>Clear</button>
                        </div>
                    </div>  
                </form>
               
                <div className="row mt-2">    
                {(this.state.show_table) ?  <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.ug_list) ? this.props.ug_list : [] } 
                            products={this.getProducts}
                            select={true} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={false}
                            table_name="issue_grn"
                        />
                    </div> : ''} 
                    <div className="col-md-6 col-lg-6 text-left mt-2">
                        <button type="button" disabled={this.state.show_details && this.state.show_details=="modify"? true :false} className={`btn btn-sm ${this.state.show_details=="modify" ? "custom-disabled-btn-outline-success" : ""} btn-outline-success`} onClick={()=>this.Add()}>Add</button>
                        <button type="button" disabled={(!this.state.show_details ||  this.state.show_details=="add") && !this.state.show_table? true :false} className={`btn btn-sm ${(!this.state.show_details ||  this.state.show_details=="add") && !this.state.show_table ? "custom-disabled-btn-outline-primary" : ""} btn-outline-primary ml-2`} onClick={()=>this.Modify()}>Modify</button>
                        <button type="reset" disabled={(!this.state.show_details || this.state.show_details=="modify" &&  this.state.show_details=="add") && !this.state.show_table ? true :false} className={`btn btn-sm ${(!this.state.show_details || this.state.show_details=="modify" &&  this.state.show_details=="add") && !this.state.show_table ? "custom-disabled-btn-outline-danger" : ""} btn-outline-danger ml-2`} onClick={()=>this.confirm_function('delete', 'permanently delete this item(s)')}>Delete</button>
                    </div>                    
                </div>
                </Fragment>
                : ''}
                {(this.state.show_details=="add" || this.state.show_details=="modify") ?
                    <Fragment>
                        <UGDetailsMaintenance
                            close = {this.hide_add} 
                            modeType = {this.state.show_details}
                            edit_details = {this.state.edit_details}
                        />
                    </Fragment>
                 : ''}
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
    ug_list : state.ug_list.responseList,
    loading : state.ug_list.loading,
})

const mapDispatchToProps = dispatch => ({
    GetUserGroupList  : (value) => dispatch(GetUserGroupList(value)),
})


const SecurityPolicyMaintenanceHolder = connect(mapStateToProps, mapDispatchToProps)(SecurityPolicyMaintenance);
export default reduxForm({
    form:'UG_details_maintenance',
})(SecurityPolicyMaintenanceHolder);