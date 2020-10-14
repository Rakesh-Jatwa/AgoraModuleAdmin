import React, {Component, Fragment} from 'react';
import {reduxForm } from 'redux-form';
import TabHeading from '../../../../Component/Heading/TabHeading';
import PageHeading from '../../../../Component/Heading/PageHeading';
import {connect} from 'react-redux';
import {GetUserGroupList, GetCountry, GetTaxCodeRate} from '../../../../Actions/Eadmin'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../Component/Loader'
import {UserAccountSave, GeneratePassword, UserAccountDelete} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'

class HolidayCalender extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
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
            search_object : {
                hm_country: "",
                hm_state: "",
                hm_year: ""
            },
            save_object : {
                "TM_TAX_INDEX":"",
                "TM_TAX_CODE": "",
                "TM_TAX_DESC": "",
                "COUNTRY": "",
                "TM_COUNTRY_CODE": "MY",
                "TM_TAX_TYPE": "P",
                "TAXRATE": "",
                "TM_TAX_RATE": "ZR"
            },
            user_details : {
                "CompanyId":"",
                "UserID":"",
                "Name":"",
                "Email":"",
                "Status":"",
                "DeleteInd":"N",
                "NextExpiredDt":"",
                "strUserGroup":"",
                "strUserGroupName":""
            },
            type : '',
            table_body :[],
            bindGrid : [],
          
        }
    }

    componentDidMount(){
        this.props.GetTaxCodeRate()
        this.props.GetCountry()
        let {save_object, user_details} = this.state
        if(this.props.type=="add"){
            let  {datas} = this.props
            this.setState({
                type :this.props.type,
                bindGrid :  datas.bindGrid,
            })
        }
        else if(this.props.type=="modify"){
            let  {datas} = this.props
            let _temp_user = Object.assign({},user_details, datas.userDetails)
            this.setState({
                user_details : _temp_user,
                type :this.props.type,
                bindGrid :  datas.bindGrid,
            })
        }
      
    }


    closemodel = () => {
        this.setState({
            show : false
        })
        if(this.state.status && (this.state.submit_type!="generatepass")){
            this.props.close()
        }
    }

    ChangeValue = async(values, target_id) =>{
       let {user_details, bindGrid} = this.state; 
       if(target_id=="UserID"){
            user_details.UserID  = values;
       }
       else if(target_id=="Name"){
            user_details.Name  = values;
       }
       else if(target_id=="Email"){
            user_details.Email  = values;
       }
       else if(target_id=="Status"){
            user_details.Status  = values;
       }

       else if (target_id=="DeleteInd"){
           if(values.target.checked){
                user_details.DeleteInd = "Y"
           }
           else{
                user_details.DeleteInd = "N"
           }
       }
       else if (target_id=="UU_USRGRP_ID"){
            let _tem_details = values.getAttribute('data-appid');
            user_details.strUserGroup = values.options[values.selectedIndex].value;
            user_details.strUserGroupName = _tem_details;
            bindGrid[0].UU_USRGRP_ID = values.options[values.selectedIndex].value;
       }
       this.setState({
            user_details : user_details,
            bindGrid : bindGrid
       })
       console.log('ChangeValue_user_details', user_details)
    }


    Reset = () => {
        this.setState({
            list : (this.props.policy_list && this.props.policy_list.length) ? this.props.policy_list : [],
            render : false
        })
    }

    
  
    ClearAll = () =>{
        let {type, user_details} = this.state
        if(type=="add"){
            user_details.UserID ="";
            user_details.Status ="";
            user_details.Name ="";
            user_details.Email ="";
            this.setState({
                user_details : user_details
            })
        }
        else{
            user_details.Status ="";
            user_details.Name ="";
            user_details.Email ="";
            this.setState({
                user_details : user_details
            })
        }
      
    }

    handlefromsubmit= async(values={}) =>{
       let {user_details, type} = this.state
       if(user_details){
            let _details_main = user_details
            _details_main.modeType = type;
            _details_main.strUserGroupId = _details_main.strUserGroup
            _details_main.strAppPackageId = (_details_main.strAppPackageId) ? _details_main.strAppPackageId :  _details_main.strUserGroupName
            let _status_details = await this.saveItem()
            if(_status_details){
                this.setState({loading:true})
                let _status = await ApiExtract(UserAccountSave, _details_main);
                if(_status){
                    this.setState({
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
       else{
           this.setState({
               status:false,
               loading:false,
               submit_type :"save",
               show:true,
               title : '',
               message : 'Fill all required fields',
           })
       }
    }

    Delete = async() =>{
        let {user_details} = this.state;
        if(user_details.UserID){
            this.setState({loading:true})
            let _status = await ApiExtract(UserAccountDelete,  {deleteData:[{pUserId : user_details.UserID}]});
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
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
    }

    GeneratePass = async() =>{
        let {user_details} = this.state;
        if(user_details && user_details.UserID){
            this.setState({loading:true})
            let _status = await ApiExtract(GeneratePassword, {userId: user_details.UserID});
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :"generatepass",
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
                message : 'User details is empty',
            })
        }
    }
  
  
    saveItem = async () =>{
        let {user_details, type} = this.state
        let _date_inst = new Date();
        let _result = true;
        if(!user_details.hasOwnProperty('DeleteInd') || !user_details.DeleteInd){
            this.setState({
                show:true,
                modal_title : '',
                status :false,
                message : 'Account Locked is Required'
            })
            _result = false
        } 
        else if(!user_details.hasOwnProperty('Email') || !user_details.Email){
            this.setState({
                show:true,
                modal_title : '',
                status :false,
                message : 'Email is Required'
            })
            _result = false
        } 
        else if(!user_details.hasOwnProperty('Status') || !user_details.Status){
            this.setState({
                show:true,
                modal_title : '',
                status :false,
                message : 'Status is Required'
            })
            _result = false
        } 
        else if(!user_details.hasOwnProperty('DeleteInd') || !user_details.DeleteInd){
            this.setState({
                show:true,
                modal_title : '',
                status :false,
                message : 'DeleteInd is Required'
            })
            _result = false
        } 
        else if(!user_details.hasOwnProperty('strUserGroup') || !user_details.strUserGroup){
            this.setState({
                show:true,
                modal_title : '',
                status :false,
                message : 'User Group is Required'
            })
            _result = false
        } 
        else if(!user_details.hasOwnProperty('strUserGroupName') || !user_details.strUserGroupName){
            this.setState({
                show:true,
                modal_title : '',
                status :false,
                message : 'User Group is Required'
            })
            _result = false
        } 
        return _result;
       
    }
  
    

    render(){
        const { handleSubmit } = this.props
        let {type, save_object, user_details, bindGrid} = this.state   
        let {country, tax_code_rate} = this.props
        const _table_header = [
            {name : "Package", id:"AP_APP_NAME", width:'50px', key:true},
            {name : "User Type", id:"USER_TYPE", width:'100px'},
            {name : "User Group", id:"UU_USRGRP_ID", width:'100px', formatter: (cellContent, row) => {
                return <select className="form-control" data-appid={row.AP_APP_ID} value={row.UU_USRGRP_ID} onChange={(e)=>this.ChangeValue(e.target, "UU_USRGRP_ID")}>
                    <option value="">--Select--</option>
                    {row.dropDownList.map((list,index)=>{
                       return <option value={list.UGM_USRGRP_ID} key={index}>{list.UGM_USRGRP_NAME}</option>
                    })}
                </select>
            }},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.tx_loading) ? <Loader /> : '' }
              {(this.props.ct_loading) ? <Loader /> : '' }
             
                <PageHeading heading="User Account Maintenance" subheading="" />
                <TabHeading color={'bg-info text-white'}>{this.props.type == 'add'? 'Add User Account' : 'Modify User Account'}</TabHeading> 
            
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row mt-2">
                        <div className="col-12 col-sm-6">
                            <div className="row tax_code_maintenance">
                                <div className="col-12">
                                    <label>User ID <sapn className="text-danger">*</sapn> :</label>
                                    <input disabled={(type=="add") ? false  : true} type="text" name="UserID" className="form-control" value={user_details.UserID} onChange={(e)=>this.ChangeValue(e.target.value, "UserID")}/>
                                </div>
                                <div className="col-12 mt-2">
                                    <label>User Name <sapn className="text-danger">*</sapn> :</label>
                                    <input type="text" name="Name" className="form-control" value={user_details.Name} onChange={(e)=>this.ChangeValue(e.target.value, "Name")}/>
                                </div>
                                <div className="col-12 mt-2">
                                    <label>Email<sapn className="text-danger">*</sapn> :</label>
                                    <input type="text" name="Email" className="form-control" value={user_details.Email} onChange={(e)=>this.ChangeValue(e.target.value, "Email")}/>
                                </div>
                                <div className="col-12  mt-3">
                                    <label className="mr-2">Status : </label>
                                    <div className="status_checked">
                                        <input type="radio" className="" name="status" value="A" checked={(user_details.Status=='A') ? true : this.props.type=='add' ? true : false} onChange={(e)=>this.ChangeValue("A", "Status")}/>  Active 
                                    </div>
                                    <div  className="status_checked">
                                        <input type="radio" name="status" value="I" checked={(user_details.Status=='I') ? true : false} onChange={(e)=>this.ChangeValue("I", "Status")}/> Inactive 
                                    </div>
                                </div>
                                <div className="col-12 mt-3">
                                    <label className="mr-2">Account Locked : </label>
                                    <div  className="status_checked">
                                        <input disabled={(type=="add") ? true : false } type="checkbox" name="status" value="Y" checked={(user_details.DeleteInd=='Y') ? true : false} onChange={(e)=>this.ChangeValue(e, "DeleteInd")}/> 
                                    </div>
                                </div>
                                <div className="col-12 mt-3">
                                    <p><sapn className="text-danger">*</sapn><span className="text-success"> indicates required field</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <BootstrapCustomTable 
                                table_header={_table_header} 
                                table_body={bindGrid} 
                                products={this.getProducts} 
                                select={false} 
                                selectname={'pr_no'} 
                                responsive={true} 
                                click={false}
                                table_name="issue_grn"
                            />
                        </div>
                        <div className='col-12 mt-2'>   
                            <button type="submit" className="btn btn-sm btn-outline-success">Save</button>
                            {(type=="modify") ?
                            <Fragment>
                                <button type="button" className="btn btn-sm btn-outline-primary ml-2" onClick={()=>this.GeneratePass()}>Generate Password</button>
                                <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={()=>this.Delete()}>Delete</button>
                            </Fragment> : ''}
                            <button type="button" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.ClearAll()}>Clear</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary ml-2" onClick={()=>this.props.close()}>Back</button>
                        </div>
                    </div>
                </form>
                <Alert 
                    confirm={this.closemodel} 
                    title={this.state.title}
                    message={this.state.message}
                    status={this.state.status}
                    show={this.state.show}
                />
        </Fragment>
    }
}

const mapStateToProps = state => ({
    ug_list : state.ug_list.responseList,
    loading : state.ug_list.loading,
    country : state.ed_country.responseList,
    ct_loading : state.ed_country.loading,
    tax_code_rate : state.tax_code_rate.responseList,
    tx_loading : state.tax_code_rate.loading,
})

const mapDispatchToProps = dispatch => ({
    GetUserGroupList  : () => dispatch(GetUserGroupList()),
    GetCountry : () => dispatch(GetCountry()),
    GetTaxCodeRate  : () => dispatch(GetTaxCodeRate()),
})


const HolidayCalenderHolder = connect(mapStateToProps, mapDispatchToProps)(HolidayCalender);
export default reduxForm({
    form:'HolidayCalenderHolder',
})(HolidayCalenderHolder);