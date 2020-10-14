
import React,{Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Loader from '../../../../../Component/Loader';
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {DeliveryUserNameDropDown, countryDropDownList, stateDropDownList, DeliverySearchAddress} from '../../../../../Apis/SysAdmin'
import {GetDashboardList, GetCountry, GetFixedRoles} from '../../../../../Actions/Eadmin';
import { State } from '../../../../../Apis/Eadmin';
import { SearchUserManagementDeliveryBillingAddress, SearchBillingDeliveryAddress } from '../../../../../Apis/SysAdmin';
import { ApiExtract } from '../../../../../Common/GetDatas';
import {DashboardSave} from '../../../../../Apis/Eadmin'


class DashboardMaster extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.userNameDelivery = this.userNameDelivery.bind(this)
        this.getStateList = this.getStateList.bind(this)
        this.searchDeliveryAddress = this.searchDeliveryAddress.bind(this)
        this.getRadioValue = this.getRadioValue.bind(this)
        this.resetState = this.resetState.bind(this)
        this.onRowSelectHandler = this.onRowSelectHandler.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        
        this.state = {
            companyId :JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            userId : JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            deliveryUserNames:[],
            countryData:[],
            stateData:[],
            addressData:[],
            selectedItems:[],
            addressData:[],
            selectUserName:"",
            dCode:"",
            dCity:"",
            selectedCountry:"",
            selectedState:"",
            addType:"S",
            showAlert:false,

            products:[],
            modal_body : '',
            modal : false,
            status : false,
            modal : false,
            rendered: false,
            title:'',
            message:'',
            show_roles:false,
            status:false,
            show:false,
            search_object : {
                "frm":"matrix",
                "role":""
            }
        }
        this.baseState = this.state
    }

    static getDerivedStateFromProps(props,state){
        if(props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList){
            return {
                products:props.dashboard_listing.responseList,
                rendered:true ,
            }
        }
    }

    componentDidMount(){
        this.userNameDelivery()
        this.props.GetCountry();
    }


    userNameDelivery = async() =>{
        let data = {
            "type": "D",
            "companyId": this.state.companyId,
            "userId": this.state.userId
        }
        let response = await ApiExtract(DeliveryUserNameDropDown, data);
        let countryData = await ApiExtract(countryDropDownList,data);
        if(response.response){
            this.setState({
                deliveryUserNames: response.response,
                countryData:countryData.response    
            })
        }
    }

    getStateList = async(e) =>{
        let code = e.target.value
        let data = {
            "countryCode" : code
        }
        let response = await ApiExtract(stateDropDownList, data);
        this.setState({
            stateData : response.response,
            selectedCountry : code 
        });
    }


    searchDeliveryAddress = async() => {
        let data = {
            "loggedInUserId": this.state.userId,
            "companyId": this.state.companyId,
            "type": "D",
            "userName": this.state.selectUserName,
            "code": this.state.dCode,
            "city": this.state.dCity,
            "state": this.state.selectedState,
            "country": this.state.selectedCountry,
            "rbtnType": this.state.addType//"A"
        }

        let response = await ApiExtract(DeliverySearchAddress, data);
        let list = []
        

        if (response.response){
            for( let i=0; i < response.response.length; i++) {
                list[i] = {
                    "AM_ADDR_CODE": response.response[i].AM_ADDR_CODE,
                    "AM_ADDR_LINE1": response.response[i].AM_ADDR_LINE1,
                    "AM_CITY": response.response[i].AM_CITY,
                    "AM_POSTCODE": response.response[i].AM_POSTCODE,
                    "state": response.response[i].state,
                    "AM_COUNTRY": response.response[i].AM_COUNTRY,
                    "COUNTRY": response.response[i].AM_CITY,
                    "AM_SELECTED": response.response[i].AM_SELECTED === "Y" ? "Yes" : "No",
                }
            }
        }

        this.setState({
            addressData : list 
        });
    }

    onRowSelectHandler = (row, isSelected, e) => {
        let tempArray = this.state.selectedItems;
        
        if(!isSelected){
            tempArray = tempArray.filter(value => value.AM_ADDR_LINE1 != row.AM_ADDR_LINE1);

        } else {
            tempArray.push(row);
        }        
        this.setState({
            selectedItems: tempArray
        })
    }



    getRadioValue (e) { 
        this.setState({
            addType : e.target.value 
        });
    }


    resetState () {
        this.setState({
            selectUserName : "",
            dCode : "",
            dCity : "",
            selectedCountry : "",
            selectedState : "",
            addType : "S",
        })
    }

    closeModel (details){
        this.setState({
            show : false,
        })
    }

    closeAlert (){
        this.setState({
            showAlert : false,
        })
    }


    ChangeValue = async(values, props) =>{
        let {products} = this.state;
        let _details = [];
        if(products && products.length){
            _details =  await products.map( (list_item, index)=>{
                if(list_item.dm_dashboard_id == props.dm_dashboard_id){
                    list_item.dm_panel_name = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            products : _details
        })
    }

    Save = async() =>{
        let {products} = this.state;
        if(products && products.length){
            let _temp_details ={
                frm:"master",
                dashboardData : products
            }
            this.setState({loading:true})
            let _status = '';//await ApiExtract(DashboardSave, _temp_details);
            if(_status){
                this.setState({
                    loading:false,
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
        }
        else{
            this.setState({
                loading:false,
                show:true,
                title : '',
                status :false,
                message : 'No master item to save',
            })
        }
    }

    handleSelect = (e) =>{
        let _details = e;
        if (_details) {
            let _temp_details = this.state.search_object
            _temp_details.role = _details

            this.setState({
                show_roles:true,
                rendered:false
            })
            this.props.GetDashboardList(_temp_details)
        }

    }
    

    render(){

        const _header =  [
            {name : "Code", id:"AM_ADDR_CODE", key:true},
            {name : "Address Line", id:"AM_ADDR_LINE1", key:false},
            {name : "City", id:"AM_CITY", key:false},
            {name : "State", id:"state", key:false},
            {name : "Post Code", id:"AM_POSTCODE", key:false},
            {name : "Country", id:"COUNTRY", key:false},
            {name : "Country Code", id:"AM_COUNTRY", key:false},
            {name : "Selected", id:"AM_SELECTED", key:false},
        ];



       
        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
             <Alert
                title = "Alert!"
                message = {this.state.alertMessage}
                show = {this.state.showAlert}
                confirm = {() =>{this.closeAlert()}}
                />


              <div className="show_list">  
              <PageHeading 
                    heading=""
                    subheading="Step1: Create, modify or delete User Account"   
                />
                <PageHeading
                    heading=""
                    subheading="Step2: Assign Delivery Address to selected User Account" 
                />
                <PageHeading
                    heading="" 
                    subheading="=>Step3: Assign Billing Address to selected User Account" 
                />
                <PageHeading
                    heading="" 
                    subheading="Step4: Assign Finance Viewing Department to selected User Account" 
                />
                <PageHeading
                    heading="" 
                    subheading="Step5: Assign Commodity Type to selected User Account" 
                />

                 <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                <form>
                 <div className="row mb-4">
                        <div className="col-12 col-md-6">
                            <div className="row">
                                <div className="col-12 col-md-3 "><label>User Name : </label></div>
                                <div className="col-12 col-md-6">

                                    <select className="form-control" onChange={(e)=> 
                                         this.setState({
                                            selectUserName : e.target.value
                                        }),
                                        this.searchDeliveryAddress
                                    }>
                                        <option value="">--select--</option>
                                        {
                                            this.state.deliveryUserNames || this.state.deliveryUserNames.length ? this.state.deliveryUserNames.map((id, index) => (
                                                <option key={index} id={id.UM_USER_ID} value={id.UM_USER_ID}>{id.USER}</option>
                                                ))
                                            : null
                                        }

                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-12 col-md-6">
                            <div className="row">
                                <div className="col-12 col-md-3 "><label>Code : </label></div>
                                <div className="col-12 col-md-6">

                                    <input type="text" name="" className="form-control" placeholder="" value={this.state.dCode} onChange={(e)=>this.setState({
                                        dCode : e.target.value  
                                    })} />

                                     <div className="text-danger"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="row">
                                <div className="col-12 col-md-3 "><label>City : </label></div>
                                <div className="col-12 col-md-6">

                                     <input type="text" name="" className="form-control" placeholder="" value={this.state.dCity} onChange={(e)=>this.setState({
                                        dCity : e.target.value  
                                    })}/>

                                     <div className="text-danger"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-12 col-md-6">
                            <div className="row">
                                <div className="col-12 col-md-3 "><label>State : </label></div>
                                <div className="col-12 col-md-6">

                                    <select className="form-control" value={this.state.selectedState} onChange={(e)=>this.setState({
                                        selectedState : e.target.value  
                                    })}>
                                        <option value="">--select--</option>
                                        {
                                            this.state.stateData || this.state.stateData.length ? this.state.stateData.map((id, index) => (
                                                <option key={id.CODE_ABBR} id={id.CODE_ABBR} value={id.CODE_ABBR}>{id.CODE_DESC}</option>
                                                ))
                                            : null
                                        }

                                    </select>

                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="row">
                                <div className="col-12 col-md-3 "><label>Country : </label></div>
                                <div className="col-12 col-md-6">

                                    <select className="form-control" value={this.state.selectedCountry} onChange={this.getStateList}>
                                        <option value="">--select--</option>
                                        {
                                            this.state.countryData || this.state.countryData.length ? this.state.countryData.map((id, index) => (
                                                <option key={id.CODE_ABBR} id={id.CODE_ABBR} value={id.CODE_ABBR}>{id.CODE_DESC}</option>
                                                ))
                                            : null
                                        }

                                    </select>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-12 col-md-6">
                        <div className="form-check form-check-inline">

                            <input classNmae="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio122" checked={this.state.addType === "A" ? "checked" : null } value="A" onChange = {this.getRadioValue} />
                            <label className="form-check-label ml-2" for="inlineRadio122">All Delivery Address</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input classNmae="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio243" value="S" checked={this.state.addType === "S" ? "checked" : null } onChange = {this.getRadioValue} />
                            <label className="form-check-label ml-2" for="inlineRadio243">Selected Delivery Address</label>
                        </div>

                        </div>
                </div>

                    <div className="row mt-2">

                        <div className="col-12 col-md-12 mt-2 text-right"><button type="button" className="btn btn-sm btn-outline-success" onClick={this.searchDeliveryAddress}>Search</button>
                        <button type="reset" className="btn btn-sm btn-outline-danger ml-2" onClick={this.resetState}>Clear</button></div>
                    </div>
                    <div style={{"marginTop":"2%"}}>
                    </div>
                    {
                        this.state.addressData.length  && this.state.addressData?
                                        <BootstrapCustomTable
                                                    table_header={_header}

                                                    table_body={this.state.addressData}
                                                    select={true}
                                                    selectname={'addresses'}
                                                    responsive={true}
                                                    click={false}
                                                    table_name="addresses_table"
                                                    pagination={true}
                                                    products={this.onRowSelectHandler}
                                                />
                                                :
                                                null
                    }


                    <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm">Save</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm btn-sm ml-2" >Reset</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Remove All Delivery Address</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
     </Fragment>
    }
}

const mapStateToProps = state => ({
    dashboard_listing : state.dashboard_listing.responseList_1,
    loading : state.dashboard_listing.loading,
    fixed_roles : state.fixed_roles.responseList,
    country : state.ed_country.responseList,
})

const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetCountry  : () => dispatch(GetCountry()),
})

const DashboardMasterHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardMaster);
export default DashboardMasterHolder
