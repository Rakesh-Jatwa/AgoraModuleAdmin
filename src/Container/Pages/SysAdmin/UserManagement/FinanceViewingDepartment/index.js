
import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import Alert from '../../../../../Component/Modal/alert' 
import {GetUsernameDropDown} from '../../../../../Actions/SysAdmin'
import {UsernameDropDown, GetDropDownData, SaveDropDownData} from '../../../../../Apis/SysAdmin'
import {ApiExtract} from '../../../../../Common/GetDatas'

class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.userNameDropDown = this.userNameDropDown.bind(this)
        this.selectDropdownValue = this.selectDropdownValue.bind(this)
        this.onRowSelectHandler = this.onRowSelectHandler.bind(this)
        this.selectedAllItems = this.selectedAllItems.bind(this)

        this.state = {
            userNames : [],
            dropDownData : [],
            selectedItems : [],
            profile_data : this.props.profile_data,
            selectedUserName : "null",
            status : false,
            showAlert : false,
            alertMessage : "",
            companyId : JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            userId : JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            role : JSON.parse(localStorage.getItem("profile"))["ROLE_NAME"]
        }
    }

    componentDidMount(){
        this.userNameDropDown()
    }

    componentDidUpdate(prevProps) {
      if(this.props.active_key !== prevProps.active_key){
        this.setState({
            dropDownData: [],
            selectedUserName : "null"
        })
      }
    }


    userNameDropDown = async() => {
        var data = {
            "companyId": this.state.companyId, //this.state.profile_data.UM_COY_ID,//companyId,  //JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "purchasingOfficer": "",
            "financeManager": "Finance Manager",
            "financeOfficer": "Finance Officer",
            "blnFinance": true,
            "userId": this.state.userId, // this.state.profile_data.UM_USER_ID, //JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            "role": this.state.role //this.state.profile_data.ROLE_NAME, //JSON.parse(localStorage.getItem("profile"))["ROLE_NAME"]
        }
        let response = await ApiExtract(UsernameDropDown, data);
        if (response.response){
                this.setState({
                    userNames: response.response,
                })
            }
    }

    selectDropdownValue = async(name) => {
        let dropDownData = []
        this.setState({
            dropDownData : dropDownData,
            selectedItems: []
        })
        if (name === "null"){
            dropDownData = []
        }else{
            let data = {
                "companyId": this.state.companyId,
                "userId": name
            }
            let response = await ApiExtract(GetDropDownData, data);
            let list = []
            if(response.status === true){
                    for( let i=0; i<response.response.length; i++) {
                        list[i] = {
                          "CDM_DEPT_NAME": response.response[i].CDM_DEPT_NAME,
                          "CDM_DEPT_CODE": response.response[i].CDM_DEPT_CODE,
                      }                    
              }
          }else{
            this.setState({
                alertMessage: "Unexpected error",
                showAlert: true            
            })
          }
            dropDownData = list
        }
        this.setState({
            dropDownData : dropDownData,
            selectedUserName : name,
        })

    }


    saveUserData = async() => {
        let {selectedItems} = this.state
        let showAlert, status, alertMessage
        if (selectedItems.length !== 0){
            let list=[]    
            for (var i = 0; i < selectedItems.length; i++) {
                list.push({
                    "companyId": this.state.companyId,
                    "userId":this.state.userId,
                    "strDeptCode": selectedItems[i].CDM_DEPT_CODE
                })
            }
            let data ={
                    "dgItemData": list
                }
            let response =  await ApiExtract(SaveDropDownData, data)
            console.log('response',response)
            if (response.status === true) {
                showAlert = true
                status = true
                alertMessage = "Record Saved."
                this.selectDropdownValue(this.state.selectedUserName)
            }else if (response.status === false) {
                    showAlert = true 
                    alertMessage = response.message
                }
        }else{
            showAlert = true
            alertMessage = "Selection Required!"
        }

        this.setState({
            showAlert : showAlert,
            alertMessage: alertMessage,
            status: status
        });
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
            showAlert: false,
            status: false,
            alertMessage: "",
        })
    }

    render(){

        const _header =  [
            {name : "Department Code", id : "CDM_DEPT_NAME", key : true, sort: true},
            {name : "Department Name", id : "CDM_DEPT_CODE", key : false, sort: true}
        ];

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
                    

             <Alert
                title = "Alert!"
                message = {this.state.alertMessage}
                show = {this.state.showAlert}
                status={this.state.status}
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
                    subheading="=>Step4: Assign Finance Viewing Department to selected User Account"
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
                                    <select className="form-control"
                                      value={this.state.selectedUserName}
                                      onChange={(e) => this.selectDropdownValue(e.target.value)}
                                    >
                                        <option value="null">--Select--</option>
                                        {
                                            this.state.userNames || this.state.userNames.length ? this.state.userNames.map((id, index) => (
                                                <option key={index} id={id.USER} value={id.UM_USER_ID}>{id.USER}</option>
                                                ))
                                            : null

                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                            {
                                this.state.dropDownData.length  && this.state.dropDownData?
                                                <BootstrapCustomTable
                                                            table_header={_header}
                                                            table_body={this.state.dropDownData}
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


                            <div className="row mb-3">
                                <div className="col-12">
                                    {this.state.selectedUserName !=="null"
                                    ?
                                        <button type="button"  onClick={this.saveUserData} className="btn btn-outline-success btn-sm">Save</button>
                                    :
                                        <button type="button" className="btn btn-outline-success btn-sm disabled">Save</button>
                                    }

                                </div>
                            </div>
                    </form>
                </div>
     </Fragment>
    }
}


const mapStateToProps = state => ({
    profile_data : state.profile_data,
})

const mapDispatchToProps = dispatch => ({
    GetUsernameDropDown  : (values) => dispatch(GetUsernameDropDown(values)),

})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
