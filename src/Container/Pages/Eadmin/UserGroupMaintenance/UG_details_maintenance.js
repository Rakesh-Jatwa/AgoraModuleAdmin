import React, {Component, Fragment} from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import {GetApplicationPackage, GetFixedRoles, GetUserGroupDetails} from '../../../../Actions/Eadmin'
import BootstrapCustomTable from '../../../../Component/Table/EadminTableSelection'
import Loader from '../../../../Component/Loader'
import {UserGroupSave, SaveAccessRights, UserGroupDelete} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'
import {FromSelect,FromInputs} from '../../../../Component/From/FromInputs'
import {scrollToInvalid} from '../../../../Actions/Common/Functions'
import {AddUserGroup} from '../../../../validation/EadminValidation'
class SecurityPolicyMaintenance extends Component {
    constructor(props){
        super(props);
        this.handleupdate = this.handleupdate.bind(this)
        this.closemodel = this.closemodel.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.state = {
            products:[],
            render:false,
            loading:false,
            start_data:'',
            end_data:'',
            title:'',
            message:'',
            status:false,
            show:false,
            checked_initial : [0,1,2],
            checked_details:[],
            list: [],
            userGroupId : '',
            appPackageId : '',
            rerender:false,
            role : '',
            type : '',
            modeType: '',
            show_table :false,
            show_details : '',
            search_object : {
                "userGroupId":"",
                "userGroupName":"",
                "appPackageId":"",
                "role":"",
                "type":""
            },
            checked:true,
            rightsData:[],
          readOnly: true,
          Seleceted_checkedBoxes:'',
          selecetedData_mainCheckbox:''
        }
    }
 componentWillMount(){
        this.props.reset('UG_details_maintenance')
        this.props.GetApplicationPackage();
        this.props.GetFixedRoles();
        if(this.props.modeType=="modify"){
            console.log('this.props.edit_details', this.props.edit_details)
            this.props.GetUserGroupDetails(this.props.edit_details)
        }

    }

 closemodel = () => {
        if(this.state.status && this.state.type=="delete"){
            this.props.close();
        }
        this.setState({
            show : false
        })
    }

    componentDidUpdate(prevProps){

        if(this.props.modeType=="modify" && !this.state.rerender && this.props.ug_details && this.props.ug_details.hasOwnProperty('userGroupId')
          && this.props.ug_details.userGroupId == this.props.edit_details.userGroupId && !this.props.ug_loading
         ){
            let _temp_details = this.resetModify();
            this.setState({
                search_object : _temp_details,
                rerender : true,
            })

        }
    }

     resetModify() {
          if(this.props.modeType=="modify" && this.props.ug_details && this.props.ug_details.hasOwnProperty('userGroupId')){
            let _details = this.props.ug_details

            console.log('_details check  ',_details);

            let _temp_details = {
                "userGroupId":_details.userGroupId,
                "userGroupName":_details.userGroupName,
                "appPackageId":_details.appPackageId,
                "role":_details.role,
                "type":_details.type,
            }
            this.props.initialize(_temp_details)
            return _temp_details;
        }
    }

    async  getProducts (values, details){
        let _all_products = this.state.products
        if(details){
            values.checked = "false"
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

  ClearAll = (e) =>{
        e.preventDefault();
        this.props.reset('UG_details_maintenance')
        this.resetModify();
    }

 handlefromsubmit= async(values) =>{
       let  _values = (values) ? values : {};
       _values  = Object.assign({},this.state.search_object, _values)
       _values.modeType = this.props.modeType
       if(_values.hasOwnProperty('submit_type') && _values.submit_type=="rights"){
            _values.modeType = _values.submit_type
       }
       if(_values){
            this.setState({loading :true})
            let _status = await ApiExtract(UserGroupSave, _values);
            if(_status && _status.response){
                let tempArray = _status.response.rightsData || [];
                let rightsData = [];
                for(let i= 0; i< tempArray.length; i++){
                    tempArray[i]={
                    ...tempArray[i],
                    isChecked: false
                    }
                }
                this.setState({
                    status:_status.status,
                    loading:false,
                    show:(_values.modeType=="rights") ? false : true ,
                    title : '',
                    message :_status.message,
                    modeType : _values.modeType,
                    rightsData:tempArray
                })
            }
       }
    }

 handleSelect = (list, type) =>{
    let {search_object} = this.state
        if(type=="role"){
            search_object.role = list.target.value
            this.setState({
                search_object : search_object
            })
        }
        else if(type=="type"){
            search_object.type = list.target.value
            this.setState({
                search_object : search_object
            })
        }
        else if(type=="appPackageId"){
            search_object.appPackageId =  list.target.value
            this.setState({
                search_object : search_object
            })
        }
        console.log('handleSelect', search_object)
    }

    handleupdate = (target, list_id, menu_id) =>{

        let {rightsData} = this.state
        let _access_details = {}
        if(target.checked){

            _access_details = rightsData.map((list_details, index)=>{
                if(list_details.menuId==menu_id){
                    list_details[list_id] = 'Y'
                }
                return list_details
            })

        }
        else{
             _access_details = rightsData.map((list_details, index)=>{
                if(list_details.menuId == menu_id){
                    list_details[list_id] = null
                }
                return list_details
            })
        }

        this.setState({
            rightsData :  _access_details
        })
    }

 handlerowheader = (target, menu_id) =>{
       let {rightsData} = this.state
        let _access_details = {}
        console.log('handlerowheader============>rightsDatarightsData',rightsData)
        if(target.checked){
              _access_details = rightsData.map((list_details, index)=>{
                 if(list_details.menuId === menu_id){
                    list_details.allowInsert = 'Y';
                    list_details.allowUpdate = 'Y';
                    list_details.allowDelete = 'Y';
                    list_details.allowView = 'Y';

                }

                return list_details
            })
        }
        else{
             _access_details = rightsData.map((list_details, index)=>{
                if(list_details.menuId === menu_id){
                    list_details.allowInsert = 'N';
                    list_details.allowUpdate = 'N';
                    list_details.allowDelete = 'N';
                    list_details.allowView =  'N';

                }
                return list_details
            })
        }
        console.log('_access_details',_access_details)
        this.setState({
            rightsData :  _access_details
        })
    }

    handlemainheader = (target, menuParent) =>{
       let {rightsData} = this.state
        let _access_details = {}
        console.log('handlemainheader',target)

       if(target.checked){
             _access_details = rightsData.map((list_details, index)=>{
                if(list_details.menuLevel.startsWith(menuParent)){
                    list_details.allowInsert = 'Y'
                    list_details.allowUpdate = 'Y'
                    list_details.allowDelete = 'Y'
                    list_details.allowView = 'Y'
                    list_details.isChecked =false
                }
                return list_details
            })
        }
        else{
             _access_details = rightsData.map((list_details, index)=>{
                if(list_details.menuLevel.startsWith(menuParent)){
                    list_details.allowInsert = null
                    list_details.allowUpdate = null
                    list_details.allowDelete = null
                    list_details.allowView = null
                    list_details.isChecked =true

                }
                return list_details
            })
        }
     console.log('_access_details',_access_details)
        this.setState({
            rightsData :  _access_details
        })
    }

    Save = async() =>{
      let {rightsData} = this.state
        let _access_details = {}
        if(rightsData && rightsData.length){
            let _temp_details = this.state.search_object
            _temp_details.rightsData = rightsData
            this.setState({loading:true})
            let _status = await ApiExtract(SaveAccessRights, _temp_details);
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    show:true,
                    title : '',
                    message :_status.message,
                    modeType : '',
                })
            }
        }
        else{
            this.setState({
                status:false,
                loading:false,
                show:true,
                title : '',
                message : 'User rights is empty',
            })
        }
    }

    Cancel = () =>{
        this.setState({
            modeType : '',
        })
    }

    Delete = async() =>{
        let {search_object} = this.state;
        if(search_object){
            let _details_main = search_object
            _details_main.modeType = "single";
            this.setState({loading:true})
            let _status = await ApiExtract(UserGroupDelete, _details_main);
            if(_status){
                this.setState({
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

    render(){

        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Screen Name", id:"menuName", width:'100px', type:"text", key:true},
            {name : "Allow Add", id:"allowInsert", width:'100px', type:"checked"},
            {name : "Allow Update", id:"allowUpdate", width:'100px', type:"checked"},
            {name : "Allow Delete", id:"allowDelete", width:'100px', type:"checked"},
            {name : "Allow View", id:"allowView", width:'100px', type:"checked"},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.fr_loading) ? <Loader /> : '' }
              {(this.props.ug_loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
                <PageHeading  heading="User Group Details Maintenance" subheading=""  />
                <TabHeading color={'bg-info text-white margin-bottom-none'}>{this.props.modeType=="modify" ? "Modify" : "Add"} User Group Details</TabHeading>

                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className='row add-from'>
                        <div className="col-12 col-sm-12 col-md-6">
                            <div className='row'>
                                <Field rem={true} type="text" name="userGroupId" component={FromInputs} className="form-control" placeholder="User Group ID " label="User Group ID :"  readonly = {(this.state.modeType=="rights" || this.props.modeType=="modify") ? true : false}/>
                                <Field rem={true} type="text" name="userGroupName" component={FromInputs} className="form-control" placeholder="User Group Name" label="User Group Name :" readonly = {(this.state.modeType=="rights" ) ? true : false}/>
                                <Field label={'Application Package :'} rem={true} name="appPackageId" component={FromSelect} onChange={(e)=>this.handleSelect(e,'appPackageId')} disable_input={(this.state.modeType=="rights" || this.props.modeType=="modify") ? true : false}>
                                    <option value="">--Select--</option>
                                    {(this.props.applicaton_package && this.props.applicaton_package.length) ? this.props.applicaton_package.map((list)=>{
                                      return <option value={list.AP_APP_ID}>{list.AP_APP_NAME}</option>
                                    }) :''}
                                </Field>
                                <Field label={'Role :'} rem={true} name="role" component={FromSelect} onChange={(e)=>this.handleSelect(e,'role')} disable_input={(this.state.modeType=="rights") ? true : false}>
                                    <option value="">--Select--</option>
                                    {(this.state.search_object && this.state.search_object.appPackageId=="eProcure" && this.props.fixed_roles && this.props.fixed_roles.length) ? this.props.fixed_roles.map((list)=>{
                                      return <option value={list.FR_ROLE_ID}>{list.FR_ROLE_ID}</option>
                                    }) :''}
                                </Field>
                                <Field  label={'Type :'} rem={true} name="type" component={FromSelect} onChange={(e)=>this.handleSelect(e,'type')} disable_input={(this.state.modeType=="rights") ? true : false}>
                                    <option value="">--Select--</option>
                                    <option value="BUYER">Buyer</option>
                                    <option value="HUB">Hub</option>
                                    <option value="VENDOR">Vendor</option>
                                </Field>
                                <div style={{color:'green',"margin-top":"10px"}}>* indicates required field</div>
                                {(this.state.modeType!="rights") ?
                                <div className="col-md-12 col-lg-12 text-right mt-3">
                                    <button type="submit" className="btn btn-sm btn-outline-success" >Save</button>
                                    {(this.props.modeType=="modify") ? <button type="button"  onClick={handleSubmit(values => this.handlefromsubmit({  ...values, submit_type: 'rights'}))} className="btn btn-sm btn-outline-primary ml-2">Grant Access Rights</button> : ''}
                                    <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={(e)=>this.ClearAll(e)}>Reset</button>
                                    {(this.props.modeType=="modify") ? <button type="submit" className="btn btn-sm btn-outline-secondary ml-2" onClick={()=>this.Delete()}>Delete</button> : ''}
                                    <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={()=>this.props.close()}>Back</button>
                                </div>: ''}

                            </div>
                        </div>
                    </div>
                </form>
                {(this.state.modeType=="rights") ?
                    <Fragment>
                        <BootstrapCustomTable
                            table_header={_table_header}
                            table_body={this.state.rightsData}
                            handleupdate = {this.handleupdate}
                            handlerowheader = {this.handlerowheader}
                            handlemainheader = {this.handlemainheader}


                        />
                         <button type="submit" className="btn btn-sm btn-outline-success" onClick={()=>this.Save()}>Save</button>
                         <button type="submit" className="btn btn-sm btn-outline-danger ml-2" onClick={()=>this.Cancel()}>Cancel</button>
                    </Fragment>
                : null }
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
    applicaton_package : state.applicaton_package.responseList,
    loading : state.applicaton_package.loading,

    fixed_roles : state.fixed_roles.responseList,
    fr_loading : state.fixed_roles.loading,

    ug_details : state.ug_details.responseList,
    ug_loading : state.ug_details.loading,
})

const mapDispatchToProps = dispatch => ({
    GetUserGroupDetails  : (values) => dispatch(GetUserGroupDetails(values)),
    GetApplicationPackage : () => dispatch(GetApplicationPackage()),
    GetFixedRoles : () => dispatch(GetFixedRoles()),

})

SecurityPolicyMaintenance  = reduxForm({
    form:'UG_details_maintenance',
    validate:AddUserGroup,
    onSubmitFail: errors => scrollToInvalid(errors),
})(SecurityPolicyMaintenance)

const SecurityPolicyMaintenanceHolder = connect(mapStateToProps, mapDispatchToProps)(SecurityPolicyMaintenance);
export default SecurityPolicyMaintenanceHolder
