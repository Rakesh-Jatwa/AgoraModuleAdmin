import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {
  GetDepartmentSearchList,
  GetDepartmentApprovelListDropDown
} from '../../../../../Actions/SysAdmin'
import {
  DepartmentAddUpdate,
  DepartmentDeleteData
} from '../../../../../Apis/SysAdmin'
import { ApiExtract } from '../../../../../Common/GetDatas'
class DashboardListing extends Component {
    constructor(props) {
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
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
            modifyAndDeleteDisabled: true,
            departmentCode: '',
            departmentName: '',
            showAddDepartment: false,
            showModifyDepartment: false,
            invoiceApprovalList: [],
            search_object: {
                "departmentCode": "",
                "departmentName": ""
            }
        }
    }

    componentDidUpdate(prevProps) {
      if(prevProps.department_search_list !== this.props.department_search_list){
        this.setState({
          products: this.props.department_search_list
        })
      }
      if(prevProps.department_approvel_list !== this.props.department_approvel_list){
        this.setState({
          invoiceApprovalList: this.props.department_approvel_list
        })
      }
    }

    componentDidMount() {
        this.props.GetDepartmentApprovelListDropDown({
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"]
        });
    }

    closeModel(details) {
        this.setState({
            show: false,
        })
    }

    Search = () => {
        let { search_object } = this.state;
        if (search_object) {
          this.props.GetDepartmentSearchList(this.state.search_object);
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

    render() {

        const _table_header = [
            { name: "Department Code", id: "DM_FIXED_ROLE_ID", key: true},
            { name: "Department Name", id: "DM_PANEL_NAME", key: true },
            { name: "Approval Group(Resident)", id: "DM_PANEL_NAME", key: true },
            { name: "Approval Group (Non Resident)", id: "DM_PANEL_NAME", key: true }
          ]

          console.log('********************!!!!!!!!!!!!!!!!!!', this.state.invoiceApprovalList);

        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}

            <div className="show_list">
                {
                  !(this.state.showAddDepartment || this.state.showModifyDepartment) ?
                  <div>
                    <PageHeading
                        heading=""
                        subheading="Fill in the search criteria and click Search button to list the relevant departments. Click the Add button to add new department."
                    />
                    <TabHeading color={'bg-info text-white'}>Search Criteria </TabHeading>
                  </div> : null
                }
                <form>
                    <div classNmae="row">
                        <div>
                            {
                              !(this.state.showAddDepartment || this.state.showModifyDepartment) ?
                              <div>
                                <div className="row mt-2">
                                  <div className="col-12 col-md-6">
                                      <div className="row mt-2">
                                          <div className="col-12 col-md-4"><label> Dept. Code : </label></div>
                                          <div className="col-12 col-md-6">
                                              <input name="" type="text" className="form-control" placeholder=""
                                                value={this.state.departmentCode}
                                                onChange={(e)=>{this.setState({departmentCode: e.target.value})}}
                                              />
                                              <div className="text-danger"></div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-12 col-md-6">
                                      <div className="row mt-2">
                                          <div className="col-12 col-md-4"><label> Dept. Name : </label></div>
                                          <div className="col-12 col-md-6">
                                              <input name="" type="text" className="form-control" placeholder=""
                                                value={this.state.departmentName}
                                                onChange={(e)=>{this.setState({departmentName: e.target.value})}}
                                              />
                                              <div className="text-danger"></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="row mb-3 mt-3">
                                  <div className="col-12 text-right">
                                      <button type="button" className="btn btn-outline-success btn-sm">Search</button>
                                      <button type="button" className="btn btn-outline-danger btn-sm ml-2">Clear</button>
                                  </div>
                              </div>
                              </div> : null
                            }
                            {
                              this.state.showAddDepartment ?
                                <div className="add_department">
                                    <PageHeading
                                        heading=""
                                        subheading="Fill in the relevant info and click the Save button to save the department."
                                    />
                                    <TabHeading color={'bg-info text-white'}>Add Department </TabHeading>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Department Code<span className="text-danger">*</span> : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Department Name<span className="text-danger">*</span> : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>  Approval List For : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <select className="form-control">
                                                        <option value="Invoice">Invoice</option>
                                                    </select>
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Invoice Approval List  : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <select className="form-control">
                                                        <option>--Select--</option>
                                                        {
                                                          this.state.invoiceApprovalList.length > 0 ?
                                                            this.state.invoiceApprovalList.map((item)=> (
                                                              <option value={item.AGM_GRP_INDEX}>{item.AGM_GRP_NAME}</option>
                                                            )) : null
                                                        }
                                                    </select>
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-12">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-12">
                                                    <p>Note - <span className="text-danger">*</span> indicates required field</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rsd_section mt-2">

                                        <TabHeading color={'bg-info text-white'}>Resident Approval Flow</TabHeading>
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover table-bordered">
                                                <thead className="thead-primary">
                                                    <th>Approval Group</th>
                                                    <th>FO</th>
                                                    <th>FM</th>
                                                    <th>Type*</th>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                        <td className="align-middle">Rosmiza<br />
                                                          LEE LI <br />
                                                          PONG PU<br />
                                                          AHMAD N<br />
                                                          GAN LEO
                                                        </td>
                                                        <td className="align-middle">PONG PU</td>
                                                        <td className="align-middle"></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                        <td className="align-middle">Rosmiza<br />
                                                          LEE LI <br />
                                                          PONG PU<br />
                                                          AHMAD N<br />
                                                          GAN LEO
                                                        </td>
                                                        <td className="align-middle">PONG PU</td>
                                                        <td className="align-middle"></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                        <td className="align-middle">Rosmiza<br />
                                                          LEE LI <br />
                                                          PONG PU<br />
                                                          AHMAD N<br />
                                                          GAN LEO
                                                        </td>
                                                        <td className="align-middle">PONG PU</td>
                                                        <td className="align-middle"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="rsd_section mt-2">
                                        <TabHeading color={'bg-info text-white'}>Non-Resident Approval Flow </TabHeading>
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover table-bordered">
                                                <thead className="thead-primary">
                                                    <th>Approval Group</th>
                                                    <th>FO</th>
                                                    <th>FM</th>
                                                    <th>Type*</th>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                        <td className="align-middle">Rosmiza<br />
                                                          LEE LI <br />
                                                          PONG PU<br />
                                                          AHMAD N<br />
                                                          GAN LEO
                                                        </td>
                                                        <td className="align-middle">PONG PU</td>
                                                        <td className="align-middle"></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                        <td className="align-middle">Rosmiza<br />
                                                          LEE LI <br />
                                                          PONG PU<br />
                                                          AHMAD N<br />
                                                          GAN LEO
                                                         </td>
                                                        <td className="align-middle">PONG PU</td>
                                                        <td className="align-middle"></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                        <td className="align-middle">Rosmiza<br />
                                                          LEE LI <br />
                                                          PONG PU<br />
                                                          AHMAD N<br />
                                                          GAN LEO
                                                        </td>
                                                        <td className="align-middle">PONG PU</td>
                                                        <td className="align-middle"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row mb-3 mt-3">
                                        <div className="col-12">
                                            <button type="button" className="btn btn-outline-danger btn-sm"
                                              onClick={(e)=>this.setState({showAddDepartment: false})}
                                            >Back</button>
                                            <button type="button" className="btn btn-outline-success btn-sm ml-2">Add</button>
                                            <button type="button" className="btn btn-outline-success btn-sm ml-2">Save</button>
                                        </div>
                                    </div>
                                </div> : null
                            }
                            {
                              this.state.showModifyDepartment ?
                            <div className="add_department">
                                <PageHeading
                                    heading=""
                                    subheading="Fill in the relevant info and click the Save button to save the department."
                                />
                                <TabHeading color={'bg-info text-white'}>Modify Department </TabHeading>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>  Department Code<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control" value="DP0016" readOnly />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>  Department Name<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control" placeholder="Agency-Klang" />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>  Approval List For : </label></div>
                                            <div className="col-12 col-md-6">
                                                <select className="form-control">
                                                    <option readOnly>Invoice</option>
                                                </select>
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Invoice Approval List  : </label></div>
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
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-12">
                                                <p>Note - <span className="text-danger">*</span> indicates required field</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rsd_section mt-2">

                                    <TabHeading color={'bg-info text-white'}>Resident Approval Flow</TabHeading>
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover table-bordered">
                                            <thead className="thead-primary">
                                                <th>Approval Group</th>
                                                <th>FO</th>
                                                <th>FM</th>
                                                <th>Type*</th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                    <td className="align-middle">Rosmiza<br />
                                                LEE LI <br />
                                                PONG PU<br />
                                                AHMAD N<br />
                                                GAN LEO
                                            </td>
                                                    <td className="align-middle">PONG PU</td>
                                                    <td className="align-middle"></td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                    <td className="align-middle">Rosmiza<br />
                                                LEE LI <br />
                                                PONG PU<br />
                                                AHMAD N<br />
                                                GAN LEO
                                            </td>
                                                    <td className="align-middle">PONG PU</td>
                                                    <td className="align-middle"></td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                    <td className="align-middle">Rosmiza<br />
                                                LEE LI <br />
                                                PONG PU<br />
                                                AHMAD N<br />
                                                GAN LEO
                                            </td>
                                                    <td className="align-middle">PONG PU</td>
                                                    <td className="align-middle"></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                                <div className="rsd_section mt-2">

                                    <TabHeading color={'bg-info text-white'}>Non-Resident Approval Flow </TabHeading>
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover table-bordered">
                                            <thead className="thead-primary">
                                                <th>Approval Group</th>
                                                <th>FO</th>
                                                <th>FM</th>
                                                <th>Type*</th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                    <td className="align-middle">Rosmiza<br />
                                                LEE LI <br />
                                                PONG PU<br />
                                                AHMAD N<br />
                                                GAN LEO
                                            </td>
                                                    <td className="align-middle">PONG PU</td>
                                                    <td className="align-middle"></td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                    <td className="align-middle">Rosmiza<br />
                                                LEE LI <br />
                                                PONG PU<br />
                                                AHMAD N<br />
                                                GAN LEO
                                            </td>
                                                    <td className="align-middle">PONG PU</td>
                                                    <td className="align-middle"></td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle"> REQ265177 (RosmizawaERERE </td>
                                                    <td className="align-middle">Rosmiza<br />
                                                LEE LI <br />
                                                PONG PU<br />
                                                AHMAD N<br />
                                                GAN LEO
                                            </td>
                                                    <td className="align-middle">PONG PU</td>
                                                    <td className="align-middle"></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                                <div className="row mb-3 mt-3">
                                    <div className="col-12">
                                        <button type="button" className="btn btn-outline-danger btn-sm"
                                          onClick={(e)=>this.setState({showModifyDepartment: false})}
                                        >Back</button>
                                        <button type="button" className="btn btn-outline-success btn-sm ml-2">Save</button>
                                        <button type="button" className="btn btn-outline-danger btn-sm ml-2">Delete</button>
                                        <button type="button" className="btn btn-outline-danger btn-sm ml-2">Reset</button>
                                    </div>
                                </div>
                            </div> : null
                          }
                          {
                            !(this.state.showAddDepartment || this.state.showModifyDepartment) ?
                            <div className="table-responsive check_table">
                                <table className="table table-striped table-hover table-bordered">
                                    <thead className="thead-primary">
                                        <th ><input type="checkbox" /></th>
                                        <th>Department Code</th>
                                        <th>Department Name</th>
                                        <th>Approval Group(Resident)</th>
                                        <th>Approval Group (Non Resident)</th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="align-middle"><input type="checkbox" value="1" /></td>
                                            <td className="align-middle">  DP0003 </td>
                                            <td className="align-middle">Agency-Banting</td>
                                            <td className="align-middle">REQ265274 (Siti HakiERERE </td>
                                            <td className="align-middle">REQ265274 (Siti HakiERERE </td>
                                        </tr>
                                        <tr>
                                            <td className="align-middle"><input type="checkbox" value="1" /></td>
                                            <td className="align-middle">  DP0003 </td>
                                            <td className="align-middle">Agency-Banting</td>
                                            <td className="align-middle">REQ265274 (Siti HakiERERE </td>
                                            <td className="align-middle">REQ265274 (Siti HakiERERE </td>
                                        </tr>
                                        <tr>
                                            <td className="align-middle"><input type="checkbox" value="1" /></td>
                                            <td className="align-middle">  DP0003 </td>
                                            <td className="align-middle">Agency-Banting</td>
                                            <td className="align-middle">REQ265274 (Siti HakiERERE </td>
                                            <td className="align-middle">REQ265274 (Siti HakiERERE </td>
                                        </tr>
                                        <tr>
                                            <td className="align-middle pl-2" colSpan="5"><p className="pl-2">3 record(s) found. <span>1 page(s) found.</span></p></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div> : null
                        }
                        </div>
                    </div>
                    {
                      !(this.state.showAddDepartment || this.state.showModifyDepartment) ?
                        <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm"
                                      onClick={()=> this.setState({showAddDepartment: true})}
                                    >Add</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                      onClick={(e)=>this.setState({showModifyDepartment: true})}
                                      disabled={!this.state.modifyAndDeleteDisabled}
                                    >Modify</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                      disabled={!this.state.modifyAndDeleteDisabled}
                                    >Delete</button>
                                </div>
                            </div>
                        </div> : null
                    }
                </form>
            </div>
        </Fragment>
    }
}


const mapStateToProps = state => ({
  //dashboard_listing: state.dashboard_listing.responseList_2,
    loading: state.dashboard_listing.loading,
    department_approvel_list: state.department_approvel_list.responseList,
    department_search_list: state.department_search_list.responseList
})

const mapDispatchToProps = dispatch => ({
    GetDepartmentSearchList: (values) => dispatch(GetDepartmentSearchList(values)),
    GetDepartmentApprovelListDropDown: (values) => dispatch(GetDepartmentApprovelListDropDown(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
