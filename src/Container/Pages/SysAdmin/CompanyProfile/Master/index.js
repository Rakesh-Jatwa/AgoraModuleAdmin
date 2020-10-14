import React, { Component, Fragment, useState } from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import { GetDashboardList, GetFixedRoles } from '../../../../../Actions/Eadmin'
import { DashboardList } from '../../../../../Apis/Eadmin'
import { ApiExtract } from '../../../../../Common/GetDatas'
// import {  companyNameList } from "../../";

import {
    companyNameList, parentDropDown, stateDropDownList,
    countryDropDownList, paymentTermsDropDownList, currencyDropDownList,
    paymentMethodsDropDownList, companyProfileDataPost,

} from "../../../../../Apis/SysAdmin";
class DashboardListing extends Component {
    constructor(props) {
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        // this.reset() = this.reset(this)
        this.state = {
            products: [],
            modal_body: '',
            modal: false,
            status: false,
            modal: false,
            rendered: false,
            title: '',
            message: '',
            show_roles: false,
            status: false,
            show: false,
            search_object: {
                "frm": "listing",
                "role": "",
                "panelName": ""
            },
            DRPValues: [],
            StateListCode: [],
            country_list: [],
            paymentTerms: [],
            paymentsMethods: [],
            currencyData: [],

            addData:{
               status:true,
               companyid: "",
               Companyname: "",
               parentcompany:"",
               Companylong:"",
               companytype:"",
               registration:"",
               package:"",
               sstr:"",
               userlicense:"",
               startdate:"",
               reportuser:"",
               enddate:"",
               ad1:"",
               ad2:"",
               ad3:"",
               city:"",
               state:"",
               postcode:"",
               country:"",
               websites:"",
               email:"",
               currency:"",
               passwordduration: "",
               paymentterms:"",
               paymentmethod:"",
               companylogo: "",
               doc: "",
               yreg: "",
               paidup:"",
               ownership:"",
               businessNature:"",
               specify: "",
               commodityType:"",
               organize: "",
               bankname:"",
               bankac:"",
               bankbranch:"",
               bankcode:"",
               paidd:"",
            }


        }


    }

    reset = () =>{
        window.location.reload()
        this.state.addData = []
    }


    static getDerivedStateFromProps(props, state) {
        if (props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList) {
            return {
                products: props.dashboard_listing.responseList,
                rendered: true,
            }
        }
    }

    componentDidMount() {
        this.props.GetDashboardList(this.state.search_object)
        this.props.GetFixedRoles()
        this.get_company_name()
        this.get_parent_dropdown()
        this.state_DropDown_list()
        this.country_DropDown_list()
        this.currency_DropDown_list()
        this.paymentTerms_DropDown_list()
        this.payments_Methods_DropDown_list()



    }

    closeModel(details) {
        this.setState({
            show: false,
        })
    }

    Search = async () => {
        let { search_object } = this.state;
        if (search_object) {
            this.props.GetDashboardList(this.state.search_object)
        }

    }

    handleSelect = (e) => {

        let _details = e.target.value;
        if (_details) {
            let _temp_details = this.state.search_object
            _temp_details.role = _details
        }
    }

    handleInput = (e) => {
        let _details = e.target.value;
        if (_details) {
            let _temp_details = this.state.search_object
            _temp_details.panelName = _details
        }
    }

    get_details = (row) => {
        this.props.change_tab('Matrix', row.DM_FIXED_ROLE_ID)
    }

    get_company_name = async (e) => {
        let response = await ApiExtract(companyNameList, {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],

        });
        if(response.status){
            this.setState({
                CM_COY_ID: response.response[0].CM_COY_ID,
                CM_COY_NAME: response.response[0].CM_COY_NAME,
                CM_COY_LONG_NAME: response.response[0].CM_COY_LONG_NAME,
            });
        }

    };

    get_parent_dropdown = async (e) => {
        let response = await ApiExtract(parentDropDown, {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            groupIndex: e,
            viewBy: this.state.radioSelectionTab,
            userId: "buyer",
        });
        if(response.status){
                this.setState({
                    DRPValues: response.response

                });
        }
        if (response) {
            console.log('get_parent_dropdown', response.response);
        }
    };

    state_DropDown_list = async (e) => {
        let response = await ApiExtract(stateDropDownList, {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            groupIndex: e,
            viewBy: this.state.radioSelectionTab,
            userId: "buyer",
        });
        this.setState({
            StateListCode: response.response

        });

        if (response) {
            console.log('StateListCode------>', response);
        }
    };

    country_DropDown_list = async (e) => {
        let response = await ApiExtract(countryDropDownList, {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            groupIndex: e,
            viewBy: this.state.radioSelectionTab,
            userId: "buyer",
        });
        if(response.status){
                this.setState({
                    country_list: response.response

                });
        }
        if (response) {
            console.log('country_DropDown_list------>', response);
        }
    };

    paymentTerms_DropDown_list = async (e) => {
        let response = await ApiExtract(paymentTermsDropDownList, {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            groupIndex: e,
            viewBy: this.state.radioSelectionTab,
            userId: "buyer",
        });
        if(response.status){
                this.setState({
                    paymentTerms: response.response
                });
        }
        if (response) {
            console.log('paymentTermsDropDownList------>', response);
        }
    };

    currency_DropDown_list = async (e) => {
        let response = await ApiExtract(currencyDropDownList, {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            groupIndex: e,
            viewBy: this.state.radioSelectionTab,
            userId: "buyer",
        });
        if(response.status){
                this.setState({
                    currencyData: response.response
                });
        }
        if (response) {
            console.log('currencyDropDownlist------>', response);
        }
    };

    payments_Methods_DropDown_list = async (e) => {
        let response = await ApiExtract(paymentMethodsDropDownList, {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            groupIndex: e,
            viewBy: this.state.radioSelectionTab,
            userId: "buyer",
        });
    if(response.rstatus){
            this.setState({
                paymentsMethods: response.response
            });
    }
        if (response) {
            console.log('payments_Methods_DropDown_list------>', response.response);
        }
    };

    handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let addData = this.state.addData;

        addData[name] = value;
        this.setState({
           addData
        },
        () => {
            console.log(this.state);

          }
        )

    }
    handleClick = () => {
        this.setState(
            {
              addData: [],
              showAddModal: !this.state.showAddModal,
              modalType: "update",
            },

          );
          this.company_Profile_Data_Post();
          console.log("changefunctiondstatesData==================>",this.state.addData.paymentmethod)

        };


    company_Profile_Data_Post = async () => {

          let response = await ApiExtract(
            companyProfileDataPost,

            {
                "mod":this.state.modalType == "modify" ? "Mod" : "update",
                "iseprocure": false,
                "companyId":JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
                "status": "A",
                "companyName":this.state.addData.Companyname,
                "parentCompany":this.state.addData.parentcompany,
                "companyLongName":this.state.addData.Companylong,
                "companyType": this.state.addData.companytype,
                "businessRegistrationNo":this.state.addData.registration,
                "Package":this.state.addData.package,
                "sstRegistrationNo":this.state.addData.sstr,
                "userLicense": 700,
                "subscriptionStartDate": "2019-10-10 00:00:00",
                "reportUser":this.state.addData.reportuser,
                "subscriptionEndDate": "2020-10-10 00:00:00",
                "addressLine1": this.state.addData.ad1,
                "addressLine2": this.state.addData.ad2,
                "addressLine3": this.state.addData.ad3,
                "city":this.state.addData.city,
                "state":this.state.addData.state,
                "postCode": this.state.addData.postcode,
                "country": this.state.addData.country,
                "webSites": this.state.addData.websites,
                "email":this.state.addData.email,
                "phone":this.state.addData.phone,
                "fax": "0731-9479568962",
                "currency":this.state.addData.currency,
                "passwordDuration":this.state.addData.passwordduration,
                "paymentTerms":this.state.addData.paymentterms,
                "paymentMethods":this.state.addData.paymentmethod,
                "companyLogo":this.state.addData.companylogo,
                "tAndCDocument":this.state.addData.doc,
                "cmHubTandCFile": "",
                "yearOfRegistration":this.state.addData.yreg,
                "paidUpCapital": 1.0,
                "companyOwnership": "",
                "others":this.state.addData.specify,
                "businessNature": "",
                "commodityType": this.state.addData.commodityType,
                "organizationCode":this.state.addData.organize,
                "bankName":this.state.addData.bankname,
                "bankAccountNo":this.state.bankac,
                "bankBranchCode":this.state.addData.bankbranch,
                "bankCode":this.state.addData.bankcode,
                "cmLastDate": "2020-10-10 00:00:00",
                "taxCalulatedBy": "",
                "bcmSet": 0,
                "findeptMode": "N",
                "invAppr": "Y",
                "skinId": 1,
                "training": "N",
                "privLabeling": "N",
                "entBy": "sysadmin",
                "sku": 1,
                "transNo": 123,
                "contact": "Contact Person Name",
                "multiPo": "Y",
                "baCancel": "Y",
                "cmBankName": "",
                "licencePackage": this.state.addData.licencePackage,
                "modBy": ""
            }


        )


        if(response) {

            console.log("company dat",response);
             return response
     }
    };



    render() {
        const _table_header = [
            {
                name: "Catalogue", id: "DM_FIXED_ROLE_ID", formatter: (cellContent, row) => {
                    return (
                        <button type="button" className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.DM_FIXED_ROLE_ID}</button>
                    )
                },
            },
            { name: "Purchaser", id: "DM_PANEL_NAME", key: true }]
        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}

            <div className="show_list">
                <PageHeading
                    heading=""
                    subheading="Fill in the relevant field(s) and click the Save button to save the changes. "
                />

                <TabHeading color={'bg-info text-white'}>Modify company</TabHeading>

                <form>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Company ID <span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="companyid" type="text" className="form-control" placeholder={this.state.CM_COY_ID} readOnly value={this.state.addData.companyid} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Company Name<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="Companyname" type="text" className="form-control" placeholder={this.state.CM_COY_NAME} value={this.state.Companyname} onChange={(e) => { this.handleChange(e) }} readOnly />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Parent Company<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="parentcompany" value={this.state.parentcompany} onChange={(e) => { this.handleChange(e) }} >
                                                {this.state.DRPValues.length && this.state.DRPValues ? this.state.DRPValues.map(item => (
                                                    <option key={item.CM_COY_ID} value={item.CM_COY_NAME}>
                                                        {item.CM_COY_NAME}
                                                    </option>
                                                ))
                                                :
                                                null
                                            }

                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Company Long Name : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="Companylong" type="text" className="form-control" placeholder="" value={this.state.Companylong} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Company Type<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" readOnly name="companytype" value={this.state.companytype} onChange={(e) => { this.handleChange(e) }} >
                                                <option value="">--Select--</option>
                                                <option value="" selected>Buyer</option>
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Business Registration No.<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="registration" type="text" className="form-control" placeholder="107655U" readOnly value={this.state.registration} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Package : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" readOnly name="package" value={this.state.package} onChange={(e) => { this.handleChange(e) }} >
                                                <option value="">--Select--</option>
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>SST Registration No. : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="sstr" type="text" className="form-control" placeholder="2344234" value={this.state.sstr} readOnly onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>User License : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="userlicense" type="text" className="form-control" placeholder="700" value={this.state.userlicense} onChange={(e) => { this.handleChange(e) }} readOnly />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Subscription Start Date : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="startdate" type="text" className="form-control" placeholder="" value={this.state.startdate} onChange={(e) => { this.handleChange(e) }} readOnly />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label> Report User : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="reportuser" type="text" className="form-control" placeholder="5" value={this.state.reportuser} onChange={(e) => { this.handleChange(e) }} readOnly />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Subscription End Date : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="enddate" type="text" className="form-control" placeholder="" value={this.state.enddate} onChange={(e) => { this.handleChange(e) }} readOnly />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Address<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-8">
                                            <input name="ad1" type="text" className="form-control" placeholder="PJ" value={this.state.ad1} onChange={(e) => { this.handleChange(e) }} />
                                            <input name="ad2" type="text" className="form-control mt-2 mb-2" placeholder="Menara Prudential" value={this.state.ad2} onChange={(e) => { this.handleChange(e) }} />
                                            <input name="ad3" type="text" className="form-control" placeholder="No.10, Jalan Sultan Ismail" value={this.state.ad3} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>City<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="city" type="text" className="form-control" placeholder="Kuala Lumpur" value={this.state.city} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>State<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="state" value={this.state.state} onChange={(e) => { this.handleChange(e) }} >
                                                {this.state.StateListCode&& this.state.StateListCode.length ? this.state.StateListCode.map(item => (
                                                    <option key={item.CODE_ABBR} value={item.CODE_DESC}>
                                                        {item.CODE_DESC}
                                                    </option>
                                                )):null}
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Post Code<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="postcode" type="text" className="form-control" placeholder="50250" value={this.state.postcode} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Country<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="country" value={this.state.country} onChange={(e) => { this.handleChange(e) }} >
                                                {this.state.country_list.length?this.state.country_list.map(item => (
                                                    <option key={item.CODE_ABBR} value={item.CODE_DESC}>
                                                        {item.CODE_DESC}
                                                    </option>
                                                )):null}
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Web Sites : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input type="url" name="websites" className="form-control" placeholder="strateqgroup.com" value={this.state.websites} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Email<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="email" type="email" className="form-control" placeholder="safiyahs@strateqgroup.com" value={this.state.email} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label> Currency<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="currency" value={this.state.currency} onChange={(e) => { this.handleChange(e) }} >
                                                {this.state.currencyData.length ? this.state.currencyData.map(item => (
                                                    <option key={item.CODE_ABBR} value={item.CODE_DESC}>
                                                        {item.CODE_DESC}
                                                    </option>
                                                )):null}
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Password Duration<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-check form-check-inline">
                                                <input name="passwordduration" type="text" className="form-control form-check-input" placeholder="90" value={this.state.passwordduration} onChange={(e) => { this.handleChange(e) }} />
                                                <label className="form-check-label ml-2">Days</label>
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Payment Terms<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="paymentterms" value={this.state.paymentterms} onChange={(e) => { this.handleChange(e) }}  >
                                                {this.state.paymentTerms.length ? this.state.paymentTerms.map(item => (
                                                    <option key={item.CODE_ABBR} value={item.CODE_DESC}>
                                                        {item.CODE_DESC}
                                                    </option>
                                                )) : null}
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Payment Method<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="paymentmethod" value={this.state.paymentmethod} onChange={(e) => { this.handleChange(e) }} >
                                                {this.state.paymentsMethods.length ? this.state.paymentsMethods.map(item => (
                                                    <option key={item.CODE_ABBR} value={item.CODE_DESC}>
                                                        {item.CODE_DESC}
                                                    </option>
                                                )):null}
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label> Current Company Logo : </label></div>
                                        <div className="col-12 col-md-6">
                                            <div>No Logo</  div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 hint">
                                            <label>Company Logo : </label>
                                            <p>Recommended dimension is 130(W) x 70(H) pixels</p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <input name="companylogo" type="file" className="form-control" value={this.state.companylogo} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4">
                                            <a hre="#" className="text-primary">Preview PO Template</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 hint">
                                            <label>T&C Document Upload  : </label>
                                            <p>Recommended file size is 10240 KB</p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <input name="doc" type="file" className="form-control" value={this.state.doc} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4">
                                            <a hre="#" className="text-primary">dataseRFQ.docx</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TabHeading color={'bg-info text-white'}>Company Registration</TabHeading>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label><strong> Year of Registration :</strong></label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="yreg" value={this.state.yreg} onChange={(e) => { this.handleChange(e) }} >
                                                <option>--Select--</option>
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label><strong>Paid-up Capital :</strong></label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="paidup" value={this.state.paidup} onChange={(e) => { this.handleChange(e) }} >
                                                <option>--Select--</option>
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <input name="paidd" type="text" className="form-control" placeholder="" value={this.state.paidd} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label><strong> Company Ownership :</strong></label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="ownership" value={this.state.ownership} onChange={(e) => { this.handleChange(e) }} >
                                                <option>--Select--</option>
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label><strong>Others, Please specify :</strong></label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="specify" type="text" className="form-control" placeholder="" value={this.state.specify} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label><strong> Business Nature :</strong></label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="businessNature" value={this.state.businessNature} onChange={(e) => { this.handleChange(e) }} >
                                                <option>--Select--</option>
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label><strong>commodity Type:</strong></label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="commodityType" type="text" className="form-control" placeholder="" value={this.state.commodityType} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label><strong>Organization Code :</strong></label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="organize" type="text" className="form-control" placeholder="" value={this.state.organize} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Bank Name :</label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="bankname" type="text" className="form-control" placeholder="" value={this.state.bankname} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label> Bank Account No. :</label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="bankac" type="text" className="form-control" placeholder="" value={this.state.bankac} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label> Bank Branch Code :</label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="bankbranch" type="text" className="form-control" placeholder="" value={this.state.bankbranch} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label> Bank Code :</label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="bankcode" type="text" className="form-control" placeholder="" value={this.state.bankcode} onChange={(e) => { this.handleChange(e) }} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="col-12 col-md-6 mt-3 pl-1">
                    <div className="row mb-3">
                        <div className="col-12">
                            <p>Note - <span className="text-danger">*</span> indicates required field </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mt-3 pl-1">
                    <div className="row mb-3">
                        <div className="col-12">

                            <button type="button" onClick={() => { this.handleClick() }} className="btn btn-outline-success btn-sm ml-2">save</button>
                            <button type="reset" onClick={()=>{this.reset()}} className="btn btn-outline-success btn-sm ml-2">Reset</button>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing: state.dashboard_listing.responseList_2,
    loading: state.dashboard_listing.loading,
    fixed_roles: state.fixed_roles.responseList
})

const mapDispatchToProps = dispatch => ({
    GetDashboardList: (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles: (values) => dispatch(GetFixedRoles(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
