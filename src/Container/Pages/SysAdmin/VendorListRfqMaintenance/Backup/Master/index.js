import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic';
import AddListModal from '../../../../../Component/Modal/addListModal';
import { GetDashboardList, GetFixedRoles } from '../../../../../Actions/Eadmin';
import { DashboardList } from '../../../../../Apis/Eadmin';
import { ApiExtract } from '../../../../../Common/GetDatas';

import {
    VendorListRfqMaintSearch,
    AddVendorListRfqMaint,
    AddModifyVendorListRfqMaint, 
    DeleteVendorListRfqMaint
} from '../../../../../Apis/SysAdmin';



class DashboardListing extends Component {
    constructor(props) {
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.searchList = this.searchList.bind(this)
        this.getInputValue = this.getInputValue.bind(this)
        this.openModal = this.openModal.bind(this)
        this.deleteList = this.deleteList.bind(this)
        this.state = {
            products: [],
            listData:[],
            selectedList:[],
            companyId :JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            userId : JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            list_search_query:"List028",
            modal_body: '',
            modal: false,
            status: false,
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
            }
        }
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
    }


    searchList = async () =>{
        let data = {
            "companyId": this.state.companyId,
            "userId": this.state.userId,
            "listName": this.state.list_search_query
        }
        console.log(data)
        let response = await ApiExtract(VendorListRfqMaintSearch, data);
        console.log("response.response",response.response)
        this.setState({
            listData:response.response
        })
    }

    getInputValue(e){
        this.setState({
            list_search_query:e.target.value
        })


    }
    
    deleteList = async () =>{
        // let data = this.state.selectedList
        let data = {
            "listIndexes": [
                10,
                11
            ]
        }

        let response = await ApiExtract(DeleteVendorListRfqMaint, data);
        console.log("Delete List",response)

    }


    openModal(){
        console.log("alert")
        this.setState({
            modalShow:true,
        })
        
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
                <AddListModal
                    show={this.state.modalShow}
                    heading="Add Vendor List"
                    onHide = {() => this.setState({modalShow:false})}
                    />
                <PageHeading
                    heading=""
                    subheading="Fill in the search criteria and click Search button to list the relevant vendor list. Click the Add button to add new vendor list."
                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                <form>
                    <div className="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>List Name : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="" type="text" onChange={this.getInputValue} className="form-control" placeholder="" />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-12 mt-3 pl-1">
                                    <div className="row mb-3">
                                        <div className="col-12 text-right">
                                            <button type="button" className="btn btn-outline-success btn-sm" onClick={this.searchList}>Search</button>
                                            <button type="reset" className="btn btn-outline-danger btn-sm ml-2">Clear</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive check_table">
                            <table className="table table-striped table-hover table-bordered">
                                <thead className="thead-primary">
                                    <th ><input type="checkbox" /></th>
                                    <th>List Name</th>
                                    <th>Vendor</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="align-middle"><input type="checkbox" value="1" /></td>
                                        <td className="align-middle">  List027   </td>
                                        <td className="align-middle">
                                                        9 Lives<br />
                                                        Accelte<br />
                                                        ABSOLUT
                                        </td>

                                    </tr>
                                    <tr>
                                        <td className="align-middle"><input type="checkbox" value="1" /></td>
                                        <td className="align-middle">  List027   </td>
                                        <td className="align-middle">
                                                        9 Lives<br />
                                                        Accelte<br />
                                                        ABSOLUT
                                        </td>

                                    </tr>
                                    <tr>
                                        <td className="align-middle"><input type="checkbox" value="1" /></td>
                                        <td className="align-middle">  List027   </td>
                                        <td className="align-middle">
                                                        9 Lives<br />
                                                        Accelte<br />
                                                        ABSOLUT
                                        </td>

                                    </tr>
                                    <tr>
                                        <td className="align-middle pl-2" colSpan="3"><p className="pl-2">3 record(s) found. <span>1 page(s) found.</span></p></td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div className="col-12 col-md-6 mt-3 pl-1">
                        <div className="row mb-3">
                            <div className="col-12">
                                <button type="button" className="btn btn-outline-success btn-sm" onClick={this.openModal}>Add</button>
                                <button type="button" className="btn btn-outline-success btn-sm ml-2">Modify</button>
                                <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={this.deleteList}>Delete</button>
                            </div>
                        </div>
                    </div>
                </form>
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