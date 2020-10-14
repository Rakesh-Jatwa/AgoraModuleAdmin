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
class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.state = {
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
            showAddVendor: false,
            search_object : {
                "frm":"listing",
                "role" : "",
                "panelName":""
            }
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
        this.props.GetFixedRoles()
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

             {
               !this.state.showAddVendor ?
              <div className="show_list">
                  <PageHeading
                        heading=""
                        subheading="Fill in the search criteria and click Search button to list the relevant approved vendors. Click the Add button to add new approved vendor."
                  />
                  <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                  <form>
                        <div classNmae="row">
                            <div className="">
                            <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> Vendor ID : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Name : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            <div className="row mt-3">
                                <div className="col-12 text-right">
                                    <button type="button" className="btn btn-outline-success btn-sm">Search</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Clear</button>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-12">
                                    <div className="table-responsive check_table">
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="thead-primary">
                                            <th><input type="checkbox" /></th>
                                            <th> Vendor ID </th>
                                            <th>Name</th>
                                            <th>Business Registration No.</th>
                                            <th>SST Registration No.</th>
                                            <th>SST Rate</th>
                                            <th>SST Tax Code (Purchase)</th>
                                            <th>Payment Terms</th>
                                            <th>Payment Method</th>
                                            <th>Invoice Based On</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="align-middle"><input type="checkbox" value="1" /></td>
                                                <td className="align-middle"><a href="/#/vendor_master_vendor_details"> 3339201I178 </a></td>
                                                <td className="align-middle">  iTAc MS
                                                </td>
                                                <td className="align-middle">680298-A
                                                </td>
                                                <td className="align-middle">2344234</td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>N/A</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>N/A</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>30 Days</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>Local Bank Transfer</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>GRN</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="align-middle"><input type="checkbox" value="1" /></td>
                                                <td className="align-middle"> 3339201I178 </td>
                                                <td className="align-middle">  iTAc MS
                                                </td>
                                                <td className="align-middle">680298-A
                                                </td>
                                                <td className="align-middle">2344234</td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>N/A</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>N/A</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>30 Days</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>Local Bank Transfer</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>GRN</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="align-middle"><input type="checkbox" value="1" /></td>
                                                <td className="align-middle"> 3339201I178 </td>
                                                <td className="align-middle">  iTAc MS
                                                </td>
                                                <td className="align-middle">680298-A
                                                </td>
                                                <td className="align-middle">2344234</td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>N/A</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>N/A</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>30 Days</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>Local Bank Transfer</option>
                                                    </select>
                                                </td>
                                                <td className="align-middle">
                                                    <select className="form-control">
                                                        <option>GRN</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="align-middle pl-2" colSpan="10"><p className="pl-2">7 record(s) found. <span>1 page(s) found.</span></p></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                </div>
                                </div>
                        </div>
                            </div>
                    <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm"
                                      onClick={()=> this.setState({showAddVendor: true})}
                                    >Add</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2">Save</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Delete</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div> : null
              }
                {
                  this.state.showAddVendor ?
                  <div className="add_approved">
                          <PageHeading
                              heading="Add Approved Vendor (from all vendors list below)"
                              subheading="Fill in the search criteria and click Search button to list the relevant vendors for approving."
                          />
                          <PageHeading
                              heading=""
                              subheading="Select vendors by click on the checkbox and update the Payment Terms and Payment Method."
                          />
                         <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                         <div className="row mt-2">
                          <div className="col-12 col-md-6">
                              <div className="row mt-2">
                                      <div className="col-12 col-md-4"><label> Vendor ID : </label></div>
                                      <div className="col-12 col-md-6">
                                          <input name="" type="text" className="form-control" placeholder="" />
                                          <div className="text-danger"></div>
                                      </div>
                                  </div>
                          </div>
                          <div className="col-12 col-md-6">
                                  <div className="row mt-2">
                                      <div className="col-12 col-md-4"><label>Name : </label></div>
                                      <div className="col-12 col-md-6">
                                          <input name="" type="text" className="form-control" placeholder="" />
                                          <div className="text-danger"></div>
                                      </div>
                                  </div>
                          </div>
                      </div>
                      <div className="row mt-3">
                          <div className="col-12 text-right">
                              <button type="button" className="btn btn-outline-success btn-sm">Search</button>
                              <button type="button" className="btn btn-outline-danger btn-sm ml-2">Clear</button>
                          </div>
                      </div>
                      <div className="row mt-3">
                          <div className="col-12">
                              <button type="button" className="btn btn-outline-danger btn-sm"
                                onClick={()=> this.setState({showAddVendor: false})}
                              >Back</button>
                              <button type="button" className="btn btn-outline-success btn-sm ml-2">Save</button>
                          </div>
                      </div>
                    </div> : null
                }
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
