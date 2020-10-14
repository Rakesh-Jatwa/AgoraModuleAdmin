import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
// import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import Alert from '../../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../../Common/GetDatas'
import {
        CommodityUsernameDropDown,
        CommodityGetData,
        CommodityDataSave
} from '../../../../../Apis/SysAdmin'


class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.getDropdownValue = this.getDropdownValue.bind(this)
        this.saveUserData = this.saveUserData.bind(this)
        this.getCommodityUserNames = this.getCommodityUserNames.bind(this)
        this.selectedAllItems = this.selectedAllItems.bind(this)

        this.state = {
            commodityUserNames:[],
            commoditDropDownData:[],
            companyId :JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            userId : JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            selectedUserName:"null",
            allChecked:false,
            showAlert:false,
            status : false,
            rendered: false,
        }
    }

    // static getDerivedStateFromProps(props,state){
    //     if(props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList){
    //         return {
    //             products:props.dashboard_listing.responseList,
    //             rendered:true ,
    //         }
    //     }
    // }

    componentDidMount(){
        this.getCommodityUserNames()
    }

    componentDidUpdate(prevProps) {
      if(this.props.active_key !== prevProps.active_key){
        this.setState({
            commoditDropDownData: [],
            selectedUserName : "null"
        })
      }
    }


    getCommodityUserNames = async() => {
        let data = {
            "companyId": this.state.companyId,
            "purchasingOfficer": "",
            "financeManager": "Finance Manager",
            "financeOfficer": "Finance Officer",
            "blnFinance": true
        }

        let response = await ApiExtract(CommodityUsernameDropDown, data);
        console.log("response",response)
        if(response.response){
                this.setState({
                    commodityUserNames: response.response,
                })
        }
    }


    getDropdownValue = async(_value) => {
        let commoditDropDownData = []
        var name = _value

        this.setState({
            commoditDropDownData : commoditDropDownData,
            selectedItems: [],
        })             

        if (name === "null"){
            commoditDropDownData = []
        } else {
            let data = {
                "companyId": this.state.companyId,
                "userId": name
            }
            let response = await ApiExtract(CommodityGetData, data);
            let list = []
            if(response.status === true){
                for( let i=0; i<response.response.length; i++) {
                    list[i] = {
                      "CT_NAME": response.response[i].CT_NAME,
                      "selected": "Yes", //response.response[i].CT_NAME,
                      "CT_ROOT_PREFIX": response.response[i].CT_ROOT_PREFIX,
                      "CT_PARENT_ID": response.response[i].CT_PARENT_ID,
                      "CT_ID": response.response[i].CT_ID,                
                        }
                }
            }else{
                this.setState({
                    alertMessage: "Unexpected error",
                    showAlert: true            
                })
            }

            commoditDropDownData = list
        }
        this.setState({
            commoditDropDownData: commoditDropDownData,
            selectedUserName: name,
        })

    }


    saveUserData = async() => {
        var selectedItems = this.state.selectedItems
        var showAlert, status, alertMessage
        if (selectedItems.length) {
            // let tempArray = this.state.commoditDropDownData.filter(function(ele){ return ele.CT_NAME !== selectedItems[0].CT_NAME;})
            let data = {
                "isChecked": "Y",
                "uaCoyId": this.state.companyId,
                "uaUserId": this.state.userId,
                "purchasingOfficer": "Purchasing Officer",
                "uaType": "CT",
                "uaAssignValue": selectedItems[0].CT_ROOT_PREFIX
            }
            let response = await ApiExtract(CommodityDataSave, data)
                if (response.status === true) {
                    console.log('response',response)
                    showAlert = true
                    status = true
                    alertMessage ="Record Saved"
                    this.getDropdownValue(this.state.selectedUserName)
                }else if (response.status === false) {
                    showAlert = true
                    alertMessage = response.message
                    status = false
                }else{
                    showAlert = true
                    status = false
                    alertMessage = "Unexpected error."
                }            
            }else {
                showAlert = true
                status = false
                alertMessage = "Selection required." 
            }
        this.setState({
            showAlert: showAlert,
            status: status,
            alertMessage: alertMessage
        })
    }

    selectedAllItems = (_products, details) =>{
        let tempArray = this.state.selectedItems;
        if(details){
            tempArray = _products
        }else{            
            tempArray = tempArray.filter(function(ele){ return ele !== _products; })
        }
        this.setState({
            selectedItems: tempArray
        })
    }

    onRowSelectHandler = (values, details) => {
        let tempArray = this.state.selectedItems;
        if(details){
            tempArray.push(values);
        } else {
            tempArray = tempArray.filter(function(ele){ return ele !== values; })
        }
        console.log(tempArray)
        this.setState({
            selectedItems: tempArray
        })
    }


    closeAlert (){
        this.setState({
            showAlert : false,
            alertMessage : "",
            status : false,
        })
    }

    render(){
        const {commodityUserNames} = this.state
        const _header =  [
            {name : "Commodity Types", id : "CT_NAME", key : true, sort: true},
            {name : "Selected", id : "selected", key : false, sort: true},
        ];

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }

             <Alert
                title = "Alert!"
                message = {this.state.alertMessage}
                status = {this.state.status}
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
                    subheading="Step3: Assign Billing Address to selected User Account"
                />
                <PageHeading
                    heading=""
                    subheading="Step4: Assign Finance Viewing Department to selected User Account"
                />
                <PageHeading
                    heading=""
                    subheading="=>Step5: Assign Commodity Type to selected User Account"

                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                <form>
                 <div className="row mb-4">
                        <div className="col-12 col-md-6">
                            <div className="row">
                                <div className="col-12 col-md-3 "><label>User Name : </label></div>
                                <div className="col-12 col-md-6">
                                    <select className="form-control"
                                      value={this.state.selectedUserName}
                                      onChange={(e) => this.getDropdownValue(e.target.value)}
                                    >
                                        <option value="null">--Select--</option>

                                        {

                                            commodityUserNames || commodityUserNames.length ? commodityUserNames.map((id, index) => (
                                                <option key={index} id={id.USER} value={id.UM_USER_ID}>{id.USER}</option>
                                                ))
                                            :
                                            null

                                        }

                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>


                    {
                        this.state.commoditDropDownData.length  && this.state.commoditDropDownData?
                                        <BootstrapCustomTable
                                                    table_header={_header}
                                                    table_body={this.state.commoditDropDownData}
                                                    select={true}
                                                    selectname={'pr_no'}
                                                    responsive={true}
                                                    click={false}
                                                    table_name="issue_grn"
                                                    pagination={true}
                                                    selectall={this.selectedAllItems}
                                                    products={this.onRowSelectHandler}
                                                />
                                                :
                                                null
                    }

                    <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">

                                    {this.state.selectedUserName !=="null"

                                    ?
                                        <button type="button" onClick={this.saveUserData} className="btn btn-outline-success btn-sm">Save</button>
                                    :
                                        <button type="button" className="btn btn-outline-success btn-sm disabled">Save</button>
                                    }

                                </div>
                            </div>
                        </div>
                    </form>
                </div>


     </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing : state.dashboard_listing.responseList_2,
    loading : state.dashboard_listing.loading,
    fixed_roles : state.fixed_roles.responseList
})

const mapDispatchToProps = dispatch => ({
    // GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
