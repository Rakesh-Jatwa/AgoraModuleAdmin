import React,{Component, Fragment} from 'react';
import {connect} from 'react-redux'
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin'
import {
  GetUserAccountList,
  AddUpdateUserManagementDetails,
  GetUserGroupList,
  GetDepartmentList,
  DeleteUserData,
  UnlockUserAccount,
  ActivateDeactivateUser,
  GeneratePassword
} from '../../../../../Apis/SysAdmin'
import {ApiExtract} from '../../../../../Common/GetDatas'

class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.onRowSelectHandler = this.onRowSelectHandler.bind(this)
        this.selectedAllItems = this.selectedAllItems.bind(this)
        this.getUserAccountList = this.getUserAccountList.bind(this)

        this.state = {
            title:'',
            message:'',
            show_roles:false,
            status:false,
            show:false,
            unlockClick: false,
            activateUser: false,
            deactivateUser: false,
            userID: '',
            userName: '',
            selectedDepartment: '',
            selectedDepartmentCode: '',
            showAddUserAccount: false,
            addUserID: '',
            addUserName: '',
            addUserEmail: '',
            addUserTelephoneNo: '',
            addUserFaxNo: '',
            addUserActive: false,
            addUserDesignation: '',
            addUserPOApprovalLimit: 0,
            addUserPRApprovalLimit: 0,
            addUserInvoiceApprovalLimit: 0,
            showModifyUserAccount: false,
            modifyUserID: '',
            modifyUserName: '',
            modifyUserEmail: '',
            modifyUserTelephoneNo: '',
            modifyUserFaxNo: '',
            modifyUserActive: false,
            modifyUserDesignation: '',
            modifyUserPOApprovalLimit: 0,
            modifyUserPRApprovalLimit: 0,
            modifyUserInvoiceApprovalLimit: 0,
            searchUserAccountData: [],
            userAvailableGroupsList: [],
            userSelectedGroupsList: [],
            selectedItemToAssign: [],
            selectedItemToRemove: [],
            selectedItem: [],
            departMentList: [],
            search_object : {
              "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
              "userId": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
              "userName": "",
              "strCompany": "",
              "CompanyIdToken": "",
              "role": "Super Admin",
              "viewState": "VENDOR"
            }
        }
    }

    componentDidMount(){
        this.getUserAccountList(this.state.search_object);
        this.getUserGroupList();
        this.getDepartmentList();
    }

    getDepartmentList = async() => {
        let response = await ApiExtract(GetDepartmentList, {
            "mode": "add",
            "companyId": "pamb"
        });
        if(response && response.response){
          this.setState({
            departMentList: response.response
          })
        }
    }

    getUserAccountList = async (data) => {
      console.log(data)
      let response = await ApiExtract(GetUserAccountList, data);
      if(response && response.response && response.status){
        console.log(response.response)
        this.setState({
          searchUserAccountData: response.response
        })
      }
    }

    getUserGroupList = async () => {
      let response = await ApiExtract(GetUserGroupList, {
        "mode": "update",
        "companyType": "BUYER",
        "userId": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
        "companyId":  JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
      });
      if(response && response.response){
        this.setState({
          userAvailableGroupsList: response.response.availableGroups,
          userSelectedGroupsList: response.response.selectedGroups
        })
      }
    }

    closeModel (details){
        this.setState({
            show : false,
        })
    }

    Search = (e) =>{
        e.preventDefault();
        let search_object = {
          "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
          "userId": this.state.userID,
          "userName": this.state.userName,
          "strCompany": "",
          "CompanyIdToken": "",
          "role": "Super Admin",
          "viewState": "VENDOR"
        }
        this.getUserAccountList(search_object)

    }

    handleSelect = (e) =>{
        let _details = e.target.value;
        if(_details){
            let _temp_details = this.state.search_object
            _temp_details.role = _details
        }
    }

    handleInput = (e) =>{
        let _details = e.target.value;
        if(_details){
            let _temp_details = this.state.search_object
            _temp_details.panelName = _details
        }
    }

    get_details = (row) =>{
         this.props.change_tab('Matrix',row.DM_FIXED_ROLE_ID)
    }

    handleClear = ()=> {
      this.setState({
        userID: '',
        userName: '',
      })
    }

    handleAddSaveClick = async() => {
      let response = await ApiExtract(GeneratePassword,{});
      if(response && response.response){
        let group = this.state.userSelectedGroupsList.map(data=>( data.UGM_USRGRP_NAME));
        let data= {
            "action": "add",
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "loggedInUserId": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            "userId": this.state.addUserID,
            "name": this.state.addUserName,
            "userGroup": group,
            "departmentId": this.state.selectedDepartment,
            "email": this.state.addUserEmail,
            "phone": this.state.addUserTelephoneNo,
            "fax": this.state.addUserFaxNo,
            "designation": this.state.addUserDesignation,
            "prApprovalLimit": this.state.addUserPRApprovalLimit,
            "poApprovalLimit": this.state.addUserPOApprovalLimit,
            "invoiceApprovalLimit": this.state.addUserInvoiceApprovalLimit,
            "passwordExpiration": "2020-02-14 17:34:52",
            "status": this.state.addUserActive ? "A" : "A",
            "accountLocked": 0,
            "modBy": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            "password": response.response,
            "appPkg": "eProcure"
          }

          AddUpdateUserManagementDetails(data);
        }
      }


      handleModifySaveClick = async () => {
        let response = await ApiExtract(GeneratePassword, {});
        if(response && response.response){
        let data= {
            "action": "update",
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "loggedInUserId": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            "userId": this.state.modifyUserID,
            "name": this.state.modifyUserName,
            "userGroup": [
                this.state.userAvailableGroupsList,
                this.state.userSelectedGroupsList
            ],
            "departmentId": "DP002",
            "email": this.state.modifyUserEmail,
            "phone": this.state.modifyUserTelephoneNo,
            "fax": this.state.modifyUserFaxNo,
            "designation": this.state.modifyUserDesignation,
            "prApprovalLimit": this.state.modifyUserPRApprovalLimit,
            "poApprovalLimit": this.state.modifyUserPOApprovalLimit,
            "invoiceApprovalLimit": this.state.modifyUserInvoiceApprovalLimit,
            "passwordExpiration": "2020-02-14 17:34:52",
            "status": this.state.modifyUserActive ? "A" : "A",
            "accountLocked": 0,
            "modBy": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            "password": "Admin@123",
            "appPkg": "eProcure"
          }

          AddUpdateUserManagementDetails(data);

        }
    }

    selectedAllItems = (_products, details) =>{
        let tempArray = this.state.selectedItem;
        if(details){
            tempArray = _products
        }else{            
            tempArray =[] //tempArray.filter(function(ele){ return ele !== _products; })
        }
        console.log(_products,details,tempArray)

        this.setState({
            selectedItem: tempArray
        })
    }

    onRowSelectHandler = (values, details) => {
        let tempArray = this.state.selectedItem;
        if(details){
            tempArray.push(values);
        } else {
            tempArray = tempArray.filter(function(ele){ return ele !== values; })
        }
        console.log(values,details,tempArray)
        this.setState({
            selectedItem: tempArray
        })
    }

    handleAvailableGroupListSelect = (evt) => {
      let selectedOptions = evt.target.selectedOptions;
      let tempArray = [];
      for(let i=0; i<selectedOptions.length; i++){
        let itemIndex = this.state.userAvailableGroupsList.findIndex(ele =>
          ele.UGM_USRGRP_ID ===  selectedOptions[i].value
        );
        tempArray.push(this.state.userAvailableGroupsList[itemIndex]);
      }
      this.setState({
        selectedItemToAssign: tempArray
      });
    }

    onDepartmentSelect = (evt) =>{
      let value = evt.target.value;
      let tempArray = [];
      if(value) {
        this.setState({
          selectedDepartment: value
        })

      } else {
        this.setState({
          selectedDepartment: ''
        })
      }
    }

    handleSelectedGroupListSelect = (evt) => {
      let selectedOptions = evt.target.selectedOptions;
      let tempArray = [];
      for(let i=0; i<selectedOptions.length; i++){
        let itemIndex = this.state.userSelectedGroupsList.findIndex(ele =>
          ele.UGM_USRGRP_ID ===  selectedOptions[i].value
        );
        tempArray.push(this.state.userSelectedGroupsList[itemIndex]);
      }
      this.setState({
        selectedItemToRemove: tempArray
      });
    }

    onAssignClick = () => {
      let tempArray = this.state.userAvailableGroupsList;
      tempArray = tempArray.filter(e => !this.state.selectedItemToAssign.includes(e));
      this.setState({
        userSelectedGroupsList: this.state.userSelectedGroupsList.concat(this.state.selectedItemToAssign),
        userAvailableGroupsList: tempArray,
        selectedItemToAssign: [],
        resetButtonDisable: false,
      })
    }

    onRemoveClick = () => {
      let selectedTempArray = this.state.userSelectedGroupsList;
      selectedTempArray = selectedTempArray.filter(e => !this.state.selectedItemToRemove.includes(e))
      let availableTempArray = this.state.userAvailableGroupsList.concat(this.state.selectedItemToRemove);
      this.setState({
        userAvailableGroupsList: availableTempArray,
        userSelectedGroupsList: selectedTempArray,
        selectedItemToRemove: [],
        resetButtonDisable: false,
      })
    }

    handleUserDelete = ()=> {
      let selectedData = this.state.selectedItem;
      let message = '';
      if(selectedData.length > 0){
        message = 'Are you sure that you want to permanently delete this item(s)?';
        this.setState({
          message,
          showCancel: true
        });
      } else {
        message = 'Please make at least on selection!';
        this.setState({
          message,
          showCancel: false
        });
      }
      this.setState({
        show: true
      });
    }

    onModifyClickHandler = () =>{
      let selectedData = this.state.selectedItem;
      console.log(selectedData)
      let message = '';
      if(selectedData.length < 1) {
        message = 'Please make one selection!';
        this.setState({
          showCancel: false,
          message,
          show: true
        });
      } else if(selectedData.length === 1) {
        this.setState({
            showModifyUserAccount:true,
            modifyUserID: selectedData[0].UM_USER_ID,
            modifyUserName: selectedData[0].UM_USER_NAME,
            modifyUserAvailableGroupsList:this.state.userAvailableGroupsList,
            modifyUserSelectedGroupsList: selectedData[0].group,
            modifyUserDepartment: selectedData[0].CDM_DEPT_NAME,
            modifyUserEmail: selectedData[0].email,
            modifyUserTelephoneNo: selectedData[0].phoneNumber,
            modifyUserFaxNo: selectedData[0].faxNo,
            modifyUserDesignation: selectedData[0].addUserDesignation,
            modifyUserPRApprovalLimit: selectedData[0].prApprovalLimit,
            modifyUserPOApprovalLimit: selectedData[0].poApprovalLimit,
            modifyUserInvoiceApprovalLimit: selectedData[0].invoiceApprovalLimit,
            modifyUserActive: selectedData[0].active
        });
      } else {
        message = 'Please choose only one selection!';
        this.setState({
          showCancel: false,
          message,
          show: true
        });
      }
    }

    handleConfirmation = () => {
      this.closeModel();
      if(this.state.showCancel) {
        if(this.state.unlockClick) {
          this.unlockUsersAccountData();
        } else if(this.state.deactivateUser || this.state.activateUser) {
          this.activateDeactivateUser();
        } else {
          let selectedData = this.state.selectedItem.map(data=>( data.UM_USER_ID));

          let data = {
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "userId": selectedData,
            "loggedInUserId": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            "companyIdToken": "",
            "pHubLevel": true
          };

          DeleteUserData(data);
        }
      }
    }

    unlockUserAccount = ()=> {
      let selectedData = this.state.selectedItem;
      let message = '';
      if(selectedData.length > 0){
        message = 'Are you sure that you want to unlock this item(s)?';
        this.setState({
          message,
          showCancel: true,
          unlockClick: true,
        });
      } else {
        message = 'Please make at least on selection!';
        this.setState({
          message,
          showCancel: false
        });
      }
      this.setState({
        show: true,
      });
    }

    unlockUsersAccountData = () => {
      let data = {
        "userId": "aao1 ",
        "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
        "loginFrequncy": 1
      }
      UnlockUserAccount(data);

      this.setState({
        unlockClick: false
      });
    }

    activateUser = ()=> {
      let selectedData = this.state.selectedItem;
      let message = '';
      if(selectedData.length > 0){
        message = 'Are you sure that you want to activate this item(s)?';
        this.setState({
          message,
          showCancel: true,
          activateUser: true,
        });
      } else {
        message = 'Please make at least on selection!';
        this.setState({
          message,
          showCancel: false
        });
      }
      this.setState({
        show: true,
      });
    }

    deActivateUser = ()=> {
      let selectedData = this.state.selectedItem;
      let message = '';
      if(selectedData.length > 0){
        message = 'Are you sure that you want to deactivate this item(s)?';
        this.setState({
          message,
          showCancel: true,
          deactivateUser: true,
        });
      } else {
        message = 'Please make at least on selection!';
        this.setState({
          message,
          showCancel: false
        });
      }
      this.setState({
        show: true,
      });
    }

    activateDeactivateUser = () => {
      let data = {
          "pHubLevel": false,
          "companyIdToken": "",
          "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
          "userId": "ESV264747",
          "loggedInUserId": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
          "activeInactiveStatus": "A"
      }
      ActivateDeactivateUser(data);

      this.setState({
        showCancel: false,
        activateUser: false,
        deactivateUser: false,
      });
    };

    render() {

        const _table_header = [
            {name : "User ID", id:"UM_USER_ID", key:true, width:'140px',formatter: (cellContent, row) => {
                return <button className="btn btn-sm btn-outline-primary" type="button"
                  onClick={(e) => console.log(e)}>{row.UM_USER_ID} </button >
            }},
            {name : "User Name", id:"UM_USER_NAME", key:false, width:'140px'},
            {name : "User Group", id:"group", key:false, width:'180px',formatter: (cellContent, row) => {
              return <div> {row.group.map((value,index)=>(
                <><span>{value.UGM_USRGRP_NAME} </span><br/></>
                ))}
                </div>
              }},
            {name : "Dept Name", id:"CDM_DEPT_NAME", key:false, width:'100px'},
            {name : "Status", id:"UM_STATUS", key:false, width:'50px'},
            {name : "Account Locked", id:"UM_DELETED", key:false, width:'50px'}
        ];

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             <Alert
                 title=""
                 message={this.state.message}
                 status={this.state.status}
                 show={this.state.show}
                 confimation={false}
                 showCancel={this.state.showCancel}
                 onCancel={() =>{this.closeModel()}}
                 confirm={() =>{ this.handleConfirmation() }}/>
              <div className="show_list">
              <PageHeading 
                    heading=""
                    subheading="=>Step1: Create, modify or delete User Account"
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
                    subheading="Step5: Assign Commodity Type to selected User Account"

                />
                {
                  !this.state.showAddUserAccount && !this.state.showModifyUserAccount ?
                  <div>
                    <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                      <form onSubmit={(e)=>this.Search(e)}>
                        <div className="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">

                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>User ID : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.userID}
                                                  onChange={(e)=>{this.setState({userID: e.target.value})}}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>User Name : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.userName}
                                                  onChange={(e)=>{this.setState({userName: e.target.value})}}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>

                                  <div className="col-12 col-md-4">
                                      <div className="col-12 col-md-12 mt-2 text-right"><button type="submit" className="btn btn-sm btn-outline-success"
                                      >Search</button>
                                      <button type="reset" className="btn btn-sm btn-outline-danger ml-2"
                                        onClick={()=>this.handleClear()}
                                      >Clear</button></div>
                                  </div>

                                </div>


                                <div className="row mt-4">
                                    <div className="table-responsive check_table" style={{overflowX: 'hidden'}}>
                                    <BootstrapCustomTable
                                      table_header={_table_header}
                                      table_body={this.state.searchUserAccountData}
                                      select={true}
                                      selectname={'pr_no'}
                                      responsive={true}
                                      click={false}
                                      table_name="issue_grn"
                                      pagination={true}
                                      selectall={this.selectedAllItems}
                                      products={this.onRowSelectHandler}
                                    />

                                </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="col-12 col-md-12 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm"
                                      onClick={()=>{this.setState({showAddUserAccount: true})}}
                                    >Add</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                      onClick={()=>this.onModifyClickHandler()}
                                    >Modify</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2"
                                      onClick={()=>this.handleUserDelete()}
                                    >Delete</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                      onClick={()=>this.unlockUserAccount()}
                                    >Unlock User Account</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                      onClick={()=>this.activateUser()}
                                    >Activate</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2"
                                      onClick={()=>this.deActivateUser()}
                                    >Deactivate</button>
                                </div>
                            </div>
                        </div>
                    </div> : null
                  }
                  {
                          this.state.showAddUserAccount ?
                          <div className="add_user">
                          <TabHeading color={'bg-info text-white'}> Add User Account</TabHeading>
                          <div className="row">
                              <div className="col-12 col-sm-12">
                          <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>User ID<span className="text-danger">*</span> : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="text" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserID}
                                                    onChange={(e)=> this.setState({addUserID: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>User Name<span className="text-danger">*</span> : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="text" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserName}
                                                    onChange={(e)=> this.setState({addUserName: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-12">
                                          <div className="row mt-2">
                                          <div className="col-12 col-md-2 line-height"><label>User Group<span className="text-danger">*</span> : </label></div>
                                              <div className="col-12 col-md-10">
                                              <div className="table-responsive select_cstm">
                                              <table className="table">
                                                  <tbody>
                                                      <tr>
                                                          <td className="align-middle">
                                                            {
                                                              this.state.userAvailableGroupsList && this.state.userAvailableGroupsList.length > 0 ?(
                                                                <select
                                                                  className="form-control"
                                                                  onChange={(e) => this.handleAvailableGroupListSelect(e)}
                                                                  multiple={true}
                                                                  style={{
                                                                    'height': '150px',
                                                                    'width': '100%',
                                                                    'resize': 'none',
                                                                    'padding': '10px 25px',
                                                                    'marginTop': 25,
                                                                  }}
                                                                >
                                                                {
                                                                  this.state.userAvailableGroupsList.map((data, index) => (
                                                                    <option key={index} value={data.UGM_USRGRP_ID}>{data.UGM_USRGRP_NAME}</option>
                                                                  ))
                                                                }
                                                              </select>
                                                            )
                                                              :
                                                                <textarea></textarea>
                                                          }
                                                          </td>
                                                          <td className="align-middle text-center btn_md">
                                                              <div className="col-12">
                                                                  <button type="button" className="btn btn-outline-success btn-sm"
                                                                    onClick={()=> {this.onAssignClick()}}
                                                                  >&#62;</button>
                                                                  <br/>
                                                                  <button type="button" className="btn btn-outline-danger btn-sm mt-2"
                                                                    onClick={()=> {this.onRemoveClick()}}
                                                                  >&#x3c;</button>
                                                              </div>
                                                          </td>
                                                          <td className="align-middle">
                                                          {
                                                              this.state.userSelectedGroupsList && this.state.userSelectedGroupsList.length > 0 ?(
                                                                <select
                                                                  className="form-control"
                                                                  onChange={(e) => this.handleSelectedGroupListSelect(e)}
                                                                  multiple={true}
                                                                  style={{
                                                                    'height': '150px',
                                                                    'width': '100%',
                                                                    'resize': 'none',
                                                                    'padding': '10px 25px',
                                                                    'marginTop': 25,
                                                                  }}
                                                                >
                                                                {
                                                                  this.state.userSelectedGroupsList.map((data, index) => (
                                                                    <option key={index} value={data.UGM_USRGRP_ID}>{data.UGM_USRGRP_NAME}</option>
                                                                  ))
                                                                }
                                                              </select>
                                                            )
                                                              :
                                                                <textarea></textarea>
                                                          }
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                              </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Department Name : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <select className="form-control"
                                                    value={this.state.selectedDepartment}
                                                    onChange={(e)=>{this.onDepartmentSelect(e)}}
                                                  >
                                                      <option value="">--Select--</option>
                                                      {
                                                        this.state.departMentList.map(data=>(
                                                          <option value={data.CDM_DEPT_CODE}>{data.CDM_DEPT_NAME}</option>
                                                        ))
                                                      }
                                                  </select>
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Email<span className="text-danger">*</span> : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="email" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserEmail}
                                                    onChange={(e)=> this.setState({addUserEmail: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Phone No. : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="text" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserTelephoneNo}
                                                    onChange={(e)=> this.setState({addUserTelephoneNo: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Fax No. : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="text" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserFaxNo}
                                                    onChange={(e)=> this.setState({addUserFaxNo: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Designation : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="text" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserDesignation}
                                                    onChange={(e)=> this.setState({addUserDesignation: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div> 
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>PR Approval Limit<span className="text-danger">*</span> : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="text" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserPRApprovalLimit}
                                                    onChange={(e)=> this.setState({addUserPRApprovalLimit: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>PO Approval Limit<span className="text-danger">*</span> : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="text" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserPOApprovalLimit}
                                                    onChange={(e)=> this.setState({addUserPOApprovalLimit: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Invoice Approval Limit<span className="text-danger">*</span> : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <input type="text" name="" className="form-control" placeholder=""
                                                    value={this.state.addUserInvoiceApprovalLimit}
                                                    onChange={(e)=> this.setState({addUserInvoiceApprovalLimit: e.target.value})}
                                                  />
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Password Expiration : </label></div>
                                              <div className="col-12 col-md-6">
                                                  <div>03/09/2020</div>
                                                  <div className="text-danger"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Status : </label></div>
                                              <div className="col-12 col-md-6">
                                              <div className="form-check form-check-inline">
                                                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                                        selected={this.state.addUserActive}
                                                        onSelected={(e)=> this.setState({addUserActive: e.target.selected})}
                                                      />
                                                      <label className="form-check-label ml-2" for="inlineRadio2">Active</label>
                                                  </div>
                                                  <div className="form-check form-check-inline">
                                                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value=""
                                                        selected={!this.state.addUserActive}
                                                        onSelected={(e)=> this.setState({addUserActive: !e.target.selected})}
                                                      />
                                                      <label className="form-check-label ml-2" for="inlineRadio2">Inactive</label>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-6">
                                          <div className="row mt-2">
                                              <div className="col-12 col-md-4"><label>Account Locked : </label></div>
                                              <div className="col-12 col-md-6">
                                              <div className="form-check form-check-inline">
                                                      <input className="form-check-input" type="checkbox" name="account-locked" id="account-locked" value="" disabled />
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                          </div>
                          </div>
                          <div className="row mb-3">
                                  <div className="col-12 mt-2">
                                      <p><span className="text-danger">*</span> indicates required field</p>
                                  </div>
                          </div>
                          <div className="col-12 col-md-12 mt-3 pl-1">
                              <div className="row mb-3">
                                  <div className="col-12">
                                      <button type="button" className="btn btn-outline-danger btn-sm"
                                        onClick={()=>{this.setState({showAddUserAccount: false,selectedItem:[]})}}
                                      >Back</button>
                                      <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                        onClick={()=>{this.handleAddSaveClick()}}
                                      >Save</button>
                                  </div>
                              </div>
                          </div>
                  </div> : null
                }
                {
                        this.state.showModifyUserAccount ?
                        <div className="add_user">
                        <TabHeading color={'bg-info text-white'}> Modify User Account</TabHeading>
                        <div className="row">
                            <div className="col-12 col-sm-12">
                        <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>User ID<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserID}
                                                  onChange={(e)=> this.setState({modifyUserID: e.target.value})}
                                                  disabled
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>User Name<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserName}
                                                  onChange={(e)=> this.setState({modifyUserName: e.target.value})}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                        <div className="col-12 col-md-2 line-height"><label>User Group<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-10">
                                            <div className="table-responsive select_cstm">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                      <td className="align-middle">
                                                        {
                                                          this.state.modifyUserAvailableGroupsList && this.state.modifyUserAvailableGroupsList.length > 0 ?(
                                                            <select
                                                              className="form-control"
                                                              onChange={(e) => this.handleAvailableGroupListSelect(e)}
                                                              multiple={true}
                                                              style={{
                                                                'height': '150px',
                                                                'width': '100%',
                                                                'resize': 'none',
                                                                'padding': '10px 25px',
                                                                'marginTop': 25,
                                                              }}
                                                            >
                                                            {
                                                              this.state.modifyUserAvailableGroupsList.map((data, index) => (
                                                                <option key={index} value={data.UGM_USRGRP_ID}>{data.UGM_USRGRP_NAME}</option>
                                                              ))
                                                            }
                                                          </select>
                                                        )
                                                          :
                                                            <textarea></textarea>
                                                      }
                                                      </td>
                                                      <td className="align-middle text-center btn_md">
                                                          <div className="col-12">
                                                              <button type="button" className="btn btn-outline-success btn-sm"
                                                                onClick={()=> {this.onAssignClick()}}
                                                              >&#62;</button>
                                                              <br/>
                                                              <button type="button" className="btn btn-outline-danger btn-sm mt-2"
                                                                onClick={()=> {this.onRemoveClick()}}
                                                              >&#x3c;</button>
                                                          </div>
                                                      </td>
                                                      <td className="align-middle">
                                                      {
                                                          this.state.modifyUserSelectedGroupsList && this.state.modifyUserSelectedGroupsList.length > 0 ?(
                                                            <select
                                                              className="form-control"
                                                              onChange={(e) => this.handleSelectedGroupListSelect(e)}
                                                              multiple={true}
                                                              style={{
                                                                'height': '150px',
                                                                'width': '100%',
                                                                'resize': 'none',
                                                                'padding': '10px 25px',
                                                                'marginTop': 25,
                                                              }}
                                                            >
                                                            {
                                                              this.state.modifyUserSelectedGroupsList.map((data, index) => (
                                                                <option key={index} value={data.UGM_USRGRP_ID}>{data.UGM_USRGRP_NAME}</option>
                                                              ))
                                                            }
                                                          </select>
                                                        )
                                                          :
                                                            <textarea></textarea>
                                                      }
                                                      </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Department Name : </label></div>
                                            <div className="col-12 col-md-6">
                                                <select className="form-control">
                                                    <option>--Select--</option>
                                                </select>
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Email<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="email" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserEmail}
                                                  onChange={(e)=> this.setState({modifyUserEmail: e.target.value})}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Phone No. : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserTelephoneNo}
                                                  onChange={(e)=> this.setState({modifyUserTelephoneNo: e.target.value})}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Fax No. : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserFaxNo}
                                                  onChange={(e)=> this.setState({modifyUserFaxNo: e.target.value})}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Designation : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserDesignation}
                                                  onChange={(e)=> this.setState({modifyUserDesignation: e.target.value})}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>PR Approval Limit<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserPRApprovalLimit}
                                                  onChange={(e)=> this.setState({modifyUserPRApprovalLimit: e.target.value})}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>PO Approval Limit<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserPOApprovalLimit}
                                                  onChange={(e)=> this.setState({modifyUserPOApprovalLimit: e.target.value})}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Invoice Approval Limit<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder=""
                                                  value={this.state.modifyUserInvoiceApprovalLimit}
                                                  onChange={(e)=> this.setState({modifyUserInvoiceApprovalLimit: e.target.value})}
                                                />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Password Expiration : </label></div>
                                            <div className="col-12 col-md-6">
                                                <div>03/09/2020</div>
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Status : </label></div>
                                            <div className="col-12 col-md-6">
                                            <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                                      selected={this.state.modifyUserActive}
                                                      onSelected={(e)=> this.setState({modifyUserActive: e.target.selected})}
                                                    />
                                                    <label className="form-check-label ml-2" for="inlineRadio2">Active</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value=""
                                                      selected={!this.state.modifyUserActive}
                                                      onSelected={(e)=> this.setState({modifyUserActive: !e.target.selected})}
                                                    />
                                                    <label className="form-check-label ml-2" for="inlineRadio2">Inactive</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Account Locked : </label></div>
                                            <div className="col-12 col-md-6">
                                            <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="account-locked" id="account-locked" value="" disabled />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        </div>
                        <div className="row mb-3">
                                <div className="col-12 mt-2">
                                    <p><span className="text-danger">*</span> indicates required field</p>
                                </div>
                        </div>
                        <div className="col-12 col-md-12 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-danger btn-sm"
                                      onClick={()=>{this.setState({showModifyUserAccount: false,selectedItem:[]})}}
                                    >Back</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                      onClick={()=>{this.handleModifySaveClick()}}
                                    >Save</button>
                                </div>
                            </div>
                        </div>
                </div> : null
              }
            </div>
     </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing : state.dashboard_listing.responseList_2,
    loading : state.dashboard_listing.loading,
})

const mapDispatchToProps = dispatch => ({
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
