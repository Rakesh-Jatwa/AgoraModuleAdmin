import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin'
import {FormDatePickerParallelForAudit} from '../../../../../Component/From/FromInputs'
import moment from 'moment'
import {Field,reduxForm } from 'redux-form';
import SelectField from '../../../../../Component/SelectField'
//import {GetDownloadFile} from '../../../Actions/Approver'
import { GetSearchResult,GetItemMasterAudit } from '../../../../../Actions/SysAdmin'
import {FromateDate, FromateDate_YY_MM_DD} from '../../../../../Component/Dates'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import {ApiExtract} from '../../../../../Common/GetDatas'
class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.state = {
            products:[],
            modal_body : '',
            modal : false,
            status : false,
            modal : false,
            start_data:'',
            end_data:'',
            rendered: false,
            title:'',
            message:'',
            show_roles:false,
            status:false,
            show:false,
            search_list: [],
            itemCodeRequired: false,
            search_object : {
                "frm":"listing",
                "role" : "",
                "panelName":""
            }
        }
    }

    static getDerivedStateFromProps(props,state){
        console.log('props.search_result ',props.search_result);
        if(props.search_result){
            let search_list = [];
            search_list = props.search_result.map((list)=>{
                return {
                  value:  list.PM_PRODUCT_INDEX,
                  label:  list.PM_VENDOR_ITEM_CODE,
                }
            })
            return {
                search_list:search_list,
                rendered:true
            }
        }
    }

    async componentDidMount(){
        await this.props.GetSearchResult({
            "strCoyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "strItemType": "B",
            "strBCItemIdx": "",
            "strCode": "",
            "strName": "",
            "strComType": "",
            "strDel": "N",
            "pItemType": ""
        })
    }

    handleDate = (name, date) =>{
        if(name === "start_date"){
             this.setState({
                 start_data:date,
                 end_data:date
             })
        }
        else if(name === "end_date"){
             this.setState({
                 end_data:date
             })
        }
     }


     handleChange = (e) => {
         this.setState({[e.target.name]:e.target.value});
     }

    handlefromsubmit= async(values={}) =>{
        let {start_data,end_data,itemName,itemCode} = this.state;
        let data =
        {
            startDate: (start_data) ? moment(start_data).format("YYYY-MM-DD hh:mm:ss")  :"",
            endDate: (this.state.end_data) ? moment(end_data).format("YYYY-MM-DD hh:mm:ss") :"",
            itemName:itemName,
            itemCode: itemCode,
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            hidCode: this.state.hidCode
        }

        if(itemCode){
            this.props.GetItemMasterAudit(data);
        }
        else{
            this.setState({
                loading:false,
                show: true,
                title : '',
                status : false,
                message : "Select Start date, Item Code",
                itemCodeRequired: true
            })
        }
     }

     HandleChange = (value) =>{
        console.log('value ',value);
        this.setState({hidCode: value.value,itemCode: value.label})
        this.setState({
            search_details :value
        })
    }

    render(){

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }

              <div className="show_list">
              <PageHeading
                    subheading="Microsoft Excel is required in order to open the report in Excel format. "
                />
                <TabHeading color={'bg-info text-white'}>Report Criteria</TabHeading>
                <form>
                        <div classNmae="row mt-2">
                            <div className="col-12 col-md-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6 pl-0">
                                        <Field type="text" name="startDate" selected={this.state.start_data} component={FormDatePickerParallelForAudit} className="form-control" placeholder="Start Date" label="Start Date" onChange={this.handleDate.bind(this, 'start_date')} maxDate={new Date()}/>
                                    </div>
                                    <div className="col-12 col-md-6 pr-1">
                                        <Field type="text" name="endDate" selected={this.state.end_data}  component={FormDatePickerParallelForAudit} className="form-control" placeholder="End Date" label="End Date" onChange={this.handleDate.bind(this, 'end_date')} minDate={this.state.start_data} maxDate={new Date()}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-3"><label>Item Code: <span className="text-danger">*</span>. </label></div>
                                            <div className="col-12 col-md-6">
                                                <SelectField options={this.state.search_list} selectedOption={this.state.search_details} handleChange={this.HandleChange}/>
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-3"><label>Item Name: </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="itemName" type="text" className="form-control"  onChange={this.handleChange.bind(this)} placeholder=""  value={this.state.itemName} />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-3"><label>Report Type: <span className="text-danger">*</span>. </label></div>
                                            <div className="col-12 col-md-6">
                                            <select name="fileType" value={this.state.fileType} className="form-control" onChange={this.handleChange.bind(this)}>
                                                <option value="">Report Type</option>
                                                <option value="excel">Excel</option>
                                                <option value="pdf">PDF</option>
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-4 mt-4">
                                    <div className="col-12 col-md-6">
                                        <div className="row">
                                        <p className="pl-3">Note - *indicates required field  </p>
                                        </div>
                                    </div>
                                </div>

                    </form>
                    <div className="col-12 col-md-12 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" onClick={this.handlefromsubmit.bind(this)} className="btn btn-outline-success btn-sm">Submit</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Clear</button>
                                </div>
                            </div>
                    </div>
                      {
                        this.state.itemCodeRequired ?
                        <div className="row mb-4 mt-4">
                          <div className="col-12 col-md-6">
                              <div className="text-danger">Item Code is Required.</div>
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
    search_result: state.search_result.responseList,
    loadingSearch: state.search_result.loading,
    d_loading : state.view_single_pr.loading,
    floading : state.file_download.loading,
    pdf_loading : state.generate_prpdf.loading
})

const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles  : (values) => dispatch(GetFixedRoles(values)),
    GetSearchResult: (values) => dispatch(GetSearchResult(values)),
    GetItemMasterAudit  : (values) => dispatch(GetItemMasterAudit(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default reduxForm({
    form:'DashboardListingHolder',
})(DashboardListingHolder);
