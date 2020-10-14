import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin'
import {DashboardList} from '../../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../../Common/GetDatas'

import {
    PersonalSettingDetailsSave,
    GetpageLoadPersonalDetails,

} from '../../../../../Apis/SysAdmin'
class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.state = {

            status: false,
            rendered: false,
            showCancel: false,
            title: '',
            message: '',
            show: false,
            confimation:false,
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
                "frm":"listing",
                "role" : "",
                "panelName":""
            },
             data : { UserName:'',
              Email:'',
              Phone:'',
              Fax:'',
              Designation:'',
              NewPassword:'',
              ConfirmNewPassword:'',
              Recordsdisplayperpage:'',
              radio1:''
            },
            // obj:'',
            SaveArray:[],
            configureData:[],
            DDearchArray:[],
            UM_USER_ID:'',
            UM_USER_ID: '',
            UM_USER_NAME: '',
            CDM_DEPT_NAME:'',
            UM_DEPT_ID:'',
            UM_DESIGNATION:'',
            UM_EMAIL:'',
            UM_FAX_NO: '',
            UM_NEXT_EXPIRE_DT:'',
            UM_RECORD_COUNT: '',
            UM_TEL_NO: '',
        }
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
        this.props.GetDashboardList(this.state.search_object)
        this.props.GetFixedRoles();
        this._onPageLoadPersonalDetails();


    }

    closeModel (details){
        this.setState({
            show : false,
        })
    }

    Search = async() =>{
        let {search_object} = this.state;
        if(search_object){
            this.props.GetDashboardList(this.state.search_object)
        }

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

    catchValuesonChange = (e) =>{
        let name = e.target.name;
        let value = e.target.value;
        let data = this.state.data
        data[name] = value;
        this.setState({
            data
        },
        ()=>{
            console.log('==================>',this.state)
        })

      }
      _onPageLoadPersonalDetails = async() =>{

        let response = await ApiExtract(GetpageLoadPersonalDetails, {
            "companyId":JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "userId": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
        });

        this.setState({
            DDearchArray:response.response.personalDetail,
            UM_USER_ID:response.response.personalDetail[0].UM_USER_ID,
            UM_USER_NAME:response.response.personalDetail[0].UM_USER_NAME,
            CDM_DEPT_NAME:response.response.personalDetail[0].CDM_DEPT_NAME,
            UM_DEPT_ID:response.response.personalDetail[0].UM_DEPT_ID,
            UM_DESIGNATION:response.response.personalDetail[0].UM_DESIGNATION,
            UM_EMAIL:response.response.personalDetail[0].UM_EMAIL,
            UM_FAX_NO:response.response.personalDetail[0].UM_FAX_NO,
            UM_NEXT_EXPIRE_DT:response.response.personalDetail[0].UM_NEXT_EXPIRE_DT.split("T")[0],
            UM_RECORD_COUNT:response.response.personalDetail[0].UM_RECORD_COUNT,
            UM_TEL_NO:response.response.personalDetail[0].UM_TEL_NO,


        })
       
        if(response){
            console.log('_onPageLoadPersonalDetails*******----------->',response.response.personalDetail);
        }
    }

      onSaveFormData = () =>{
          if(this.state.UM_USER_NAME==='' || !this.state.UM_USER_NAME.length){
              this.setState({
                  errorUM_USER_NAME :"Username is required" 
              })
              return false
          }
           else if(!this.state.UM_USER_NAME==='' || this.state.UM_USER_NAME.length){
            this.setState({
                errorUM_USER_NAME :'' 
            })
          }
          if(this.state.UM_EMAIL===''|| !this.state.UM_EMAIL.length){
            this.setState({
                errorUM_EMAIL :"Email is required"
            })
            return false
          }
        else if(!this.state.UM_EMAIL==='' || this.state.UM_EMAIL.length){
            this.setState({
                errorUM_EMAIL :'' 
            })
          }
          if(this.state.UM_TEL_NO===''|| !this.state.UM_TEL_NO.length){
            this.setState({
                errorUM_TEL_NO :"Phone is required"
            })
            return false
          }
        else if(!this.state.UM_TEL_NO==='' || this.state.UM_TEL_NO.length){
            this.setState({
                errorUM_TEL_NO :'' 
            })
          }
          if(this.state.UM_FAX_NO===''|| !this.state.UM_FAX_NO.length){
            this.setState({
                errorUM_FAX_NO :"Fax is required"
            })
            return false
          }
        else if(!this.state.UM_FAX_NO==='' || this.state.UM_FAX_NO.length){
            this.setState({
                errorUM_FAX_NO :'' 
            })
          } 
          if(this.state.UM_DESIGNATION===''|| !this.state.UM_DESIGNATION.length){
            this.setState({
                errorUM_DESIGNATION :"Designation is required"
            })
            return false
          }
        else if(!this.state.UM_DESIGNATION==='' || this.state.UM_DESIGNATION.length){
            this.setState({
                errorUM_DESIGNATION :'' 
            })
          }
          if(this.state.data.NewPassword ==='' || !this.state.data.NewPassword.length){
            this.setState({
                errorNewPassword :"New Password is required"
            })
            return false
          }
        else if(!this.state.data.NewPassword===''|| this.state.data.NewPassword.length){
            this.setState({
                errorNewPassword :'' 
            })
        }
        if(this.state.data.ConfirmNewPassword ==='' || !this.state.data.ConfirmNewPassword.length){
            this.setState({
                errorConfirmNewPassword :"Confirm New Password is required"
            })
            return false
          }
        else if(!this.state.data.ConfirmNewPassword===''|| this.state.data.ConfirmNewPassword.length){
            this.setState({
                errorConfirmNewPassword:'' 
            })
        }
          
        this.personal_Details_Save();
        console.log(this.state.DDearchArray[0].CDM_DEPT_NAME);
      }
      personal_Details_Save = async() =>{
        
        let response = await ApiExtract(PersonalSettingDetailsSave, {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            userid: "sysadmin",
            // username:(this.state.UM_USER_NAME==='')?this.state.data.UserName:this.state.UM_USER_NAME,
            username:this.state.UM_USER_NAME,
            loggedinUserId: JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            email: this.state.UM_EMAIL,
            phone:this.state.UM_TEL_NO,
            fax:this.state.UM_FAX_NO,
            status: "A",
            modBy: "sysadmin",
            deleted: "N",
            pHubLevel: false,
            groups: [],
            appPkg: "eProcure",
            departmentId:(this.state.UM_DEPT_ID==='')?"DP0040":this.state.UM_DEPT_ID,
            appLimit: 0.0,
            recordsPerPage:this.state.UM_RECORD_COUNT,
            password: this.state.data.NewPassword,
            designation:(this.state.UM_DESIGNATION==='')?this.state.data.Designation:this.state.UM_DESIGNATION
        });

    //    if(response.status===true){
    //        this.state.show = true,
    //     this.setState({
    //         show: true,
    //         message: 'Record Saved',
    //         show:false
    //       })
         
    //    }
        if(response){
            console.log('personal_Details_Save*******----------->',response);

        }
       
    }


    closeModel() {
        this.setState({
            show: false,
            status: false,
            message: '',
            confimation: false,
            showCancel: false,
            showCancel:false
        })
    }

    handleConfirmation = () => {
       this.personal_Details_Save();
    }

      resetSaveArray = ()=>{
       console.log(this.state.data);
       let UserName = this.state.data.UserName ='';
       let ConfirmNewPassword = this.state.data.ConfirmNewPassword ='';
       let Designation = this.state.data.Designation ='';
       let Email = this.state.data.Email ='';
       let Fax = this.state.data.Fax ='';
       let NewPassword = this.state.data.NewPassword ='';
       let Phone = this.state.data.Phone ='';
       let Recordsdisplayperpage = this.state.data.Recordsdisplayperpage ='';
       let radio1 = this.state.data.radio1 ='';
    //    apis data blank set
        //  let  UM_USER_ID = this.state.UM_USER_ID ='';
         let UM_USER_NAME = this.state.UM_USER_NAME ='';
        //  let CDM_DEPT_NAME =  this.state.CDM_DEPT_NAME ='';
         let UM_DEPT_ID =  this.state.UM_DEPT_ID ='';
         let UM_DESIGNATION =this.state.UM_DESIGNATION ='';
         let UM_EMAIL =this.state.UM_EMAIL ='';
         let UM_FAX_NO =this.state.UM_FAX_NO ='';
        //  let UM_NEXT_EXPIRE_DT =this.state.UM_NEXT_EXPIRE_DT ='';
         let UM_RECORD_COUNT =  this.state.UM_RECORD_COUNT ='';
         let UM_TEL_NO =this.state.UM_TEL_NO ='';

       this.setState({
        UserName,
        ConfirmNewPassword,
        ConfirmNewPassword,
        Designation,
        Email,
        Fax,
        NewPassword,
        Phone,
        Recordsdisplayperpage,
        radio1,
        // UM_USER_ID,
        UM_USER_NAME,
        // CDM_DEPT_NAME,
        UM_DEPT_ID,
        UM_DESIGNATION,
        UM_EMAIL,
        UM_FAX_NO,
        // UM_NEXT_EXPIRE_DT,
        UM_RECORD_COUNT,
        UM_TEL_NO,
       })
       console.log('=============>',this.state.data)
   }



    render(){

        const _table_header = [
            {name : "Catalogue", id:"DM_FIXED_ROLE_ID",  formatter: (cellContent, row) => {
                return (
                    <button type="button" className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.DM_FIXED_ROLE_ID}</button>
                )
            },
        },
        {name : "Purchaser", id:"DM_PANEL_NAME", key:true}]



        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }


             <Alert
                title=""
                message={this.state.message}
                status={this.state.status}
                show={this.state.show}
                confimation={this.state.confimation}
                showCancel={this.state.showCancel}
                onCancel={() =>{this.closeModel()}}
                confirm={() =>{ this.handleConfirmation() }}/>

              <div className="show_list">
              <PageHeading
                    heading=""
                    subheading="Modify the relevant field and click the Save button to save the changes"
                />
                 <TabHeading color={'bg-info text-white'}>Modify Personal Details</TabHeading>
                 <form>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>User ID : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <span>{this.state.UM_USER_ID}</span>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>User Name<span classNmae="text-danger">*</span> : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="UserName" type="text" className="form-control" placeholder="System" value={this.state.UM_USER_NAME} onChange ={(e)=>this.setState({UM_USER_NAME:e.target.value})}/>
                                                      <div className="text-danger">{this.state.errorUM_USER_NAME}</div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>User Group : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <p>Buyer Super Admin<br/>
                                                    E2P Enquiry (Finance Dept)<br/>
                                                    P2P Buyer Administrator <br/>
                                                    P2P Finance Officer<br/>
                                                    P2P Purchasing Manager<br/>
                                                    P2P Report Administrator</p>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Department Name : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <p>{this.state.CDM_DEPT_NAME} </p>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Email<span classNmae="text-danger">*</span> : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="Email" type="email" className="form-control" placeholder="aaa@strateqgroup.com" value={this.state.UM_EMAIL} onChange ={(e)=>this.setState({UM_EMAIL:e.target.value})} />
                                                      <div className="text-danger">{this.state.errorUM_EMAIL}</div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Phone : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="Phone" type="tel" className="form-control" placeholder="+60" value={this.state.UM_TEL_NO} onChange ={(e)=>this.setState({UM_TEL_NO:e.target.value})} />
                                                         <div className="text-danger">{this.state.errorUM_TEL_NO}</div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Fax : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="Fax" type="tel" className="form-control" placeholder="+60" value={this.state.UM_FAX_NO} onChange ={(e)=>this.setState({UM_FAX_NO:e.target.value})} />
                                                    <div className="text-danger">{this.state.errorUM_FAX_NO}</div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Designation<span classNmae="text-danger">*</span> : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="Designation" type="text" className="form-control" placeholder="System Admin" value={this.state.UM_DESIGNATION} onChange ={(e)=>this.setState({UM_DESIGNATION:e.target.value})} />
                                                    <div className="text-danger">{this.state.errorUM_DESIGNATION}</div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>New Password : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="NewPassword" type="password" className="form-control" placeholder="" value={this.state.data.NewPassword} onChange ={(e)=>this.catchValuesonChange(e)} />
                                                    <div className="text-danger">{this.state.errorNewPassword}</div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Confirm New Password : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="ConfirmNewPassword" type="password" className="form-control" placeholder="" value={this.state.data.ConfirmNewPassword} onChange ={(e)=>this.catchValuesonChange(e)} />
                                                    <div className="text-danger">{this.state.errorConfirmNewPassword}</div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Password Expiration  : </label></div>
                                                <div className="col-12 col-md-6">
                                                     <p>{this.state.UM_NEXT_EXPIRE_DT}</p>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Records display per page : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <select className="form-control" name="Recordsdisplayperpage" value={this.state.UM_RECORD_COUNT} onChange ={(e)=>this.setState({UM_RECORD_COUNT:e.target.value})}>
                                                        <option>20</option>
                                                        <option>30</option>
                                                        <option>40</option>
                                                        <option>50</option>
                                                   </select>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Staff Claim Email Notification : </label></div>
                                                <div className="col-12 col-md-6"  value={this.state.data.radio1} onChange ={(e)=>this.catchValuesonChange(e)}  checked={this.state.data.value?this.state.data.value==='On':this.state.data.value==='Off'}  >
                                                    <div className="form-check form-check-inline pl-0">
                                                        <input classNmae="form-check-input" type="radio" name="radio1" value="On"  />
                                                        <label className="form-check-label ml-2" for="prefix1"> On </label>
                                                    </div>
                                                    <div className="form-check form-check-inline pl-0">
                                                        <input classNmae="form-check-input" type="radio" name="radio1"  value ="Off"/>
                                                        <label className="form-check-label ml-2" for="prefix1">Off</label>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2"><div class="col-12 col-md-12 py-2 px-2 text-success">
                                <p>Note -<span className="text-danger">*</span> indicates required field </p>
                                </div></div>
                            </div>
                        </div>
                    <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm"onClick={()=>{this.onSaveFormData()}}>Save</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={()=>{this.resetSaveArray()}}>Reset</button>
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
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles  : (values) => dispatch(GetFixedRoles(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
