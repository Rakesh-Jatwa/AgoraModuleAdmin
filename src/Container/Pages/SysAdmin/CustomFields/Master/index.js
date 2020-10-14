import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux'
import { Button, Modal } from "react-bootstrap";
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import { GetDashboardList, GetFixedRoles } from '../../../../../Actions/Eadmin'
import { DashboardList } from '../../../../../Apis/Eadmin'
import { ApiExtract } from '../../../../../Common/GetDatas'

import {
    CustomFieldsNameDrop,
    SearchCustomFieldsApiData,
    CustomFieldsAddModify,
    CustomFieldsDelete,
    PostDeletePurchaseCatalogue,
} from '../../../../../Apis/SysAdmin'
class DashboardListing extends Component {
    constructor(props) {
        super(props);
        this.closeModel = this.closeModel.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.saveData = this.saveData.bind(this);
        this.listSelectedCatalogue = this.listSelectedCatalogue.bind(this);

        this.state = {
            products: [],
            selectedItems: [],
            modModule: '',
            modFieldname: '',
            modFieldvalue: '',
            disabledKey:true,
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
            showAddModal: false,
            showModifyModal: false,
            search_object: {
                "frm": "listing",
                "role": "",
                "panelName": ""
            },
            ShowTablesData: false,
            SaveInputVAlues: [],
            InputVAlues: {
                module: '',
                fieldName: '',
                fieldValue: '',
            },
            alertMessage: '',
            openAlert: false,
            showCancel: false,
            status: false,
            title: '',
            message: '',
            show: false,
            getCustomFieldsNameWithApis: [],
            searchArray: [],
            SaveChangValues: [],
            searchVAl: {
                filedsNames: '',
                modulesName: '',
            },
            glCodeSelectedItem: [],
            tempArray: [],
            list: [],
            deleteArray: [],
            selectedRow: false,
            new_purchase_cate_data: [],
            IndOfSearchArray: '',
            isCheckAllChecked: false,
            addMofidyItem: '',
            modifySelectedIndex: -1,
            checkedvallllll: [],

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
        this.getCustomFieldsNams();
        let tempArray = this.state.searchArray;
        for (let i = 0; i < this.state.searchArray.length; i++) {
            tempArray[i] = {
                ...tempArray[i],
                isChecked: false
            }
        }
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

    AddCustomFields = () => {
        this.setState({
            showAddModal: true
        });
    };
    SaveValuesAccordingModuleName = (e) => {
        let name = e.target.name
        let value = e.target.value;
        let searchVAl = this.state.searchVAl;
        searchVAl[name] = value;
        this.setState({
            searchVAl
        }, () => {
            console.log('valies---->', searchVAl)
        })
    }

    hideAddModal = () => {
        this.setState({
            showAddModal: false,
            searchVAl: ''
        });
    };

    hideModifyModal = () => {
        this.setState({
            showModifyModal: false,
            modModule: '',
            modFieldname: '',
            modFieldvalue: ''
        });
    };

    showTable = () => {
        this.setState({ ShowTablesData: true })
        this.state.searchArray.map((value, index) => {
            if (value.CF_MODULE === "PO") {
                this.ShowTableOnClickSearch();
            }
            else if (value.CF_MODULE == "PR") {
                this.ShowTableOnClickSearch();
            }
            else {
                this.ShowTableOnClickSearch();
            }
        });
        this.ShowTableOnClickSearch();
    }

    ShowTableOnClickSearch = async () => {
        let response = await ApiExtract(SearchCustomFieldsApiData, {
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "moduleName": this.state.searchVAl.modulesName,
            "fieldName": this.state.searchVAl.filedsNames
        });
        this.setState({
            searchArray: response.response
        })
        if (response) {
            console.log('resposne ShowTableOnClickSearch*******----------->', response);

        }
    }

    CatchValueOnChangeAddByAddButton = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let InputVAlues = this.state.InputVAlues;
        InputVAlues[name] = value;
        this.setState({
            InputVAlues
        },
            () => {
                console.log("this.state.saveData---->", this.state)
            }
        )

    }

    saveData = () => {
        this.setState({
            SaveInputVAlues: this.state.InputVAlues
        }
        );
        this.Save_formData_To_table();

    }

    Save_formData_To_table = async () => {
        let response = await ApiExtract(CustomFieldsAddModify, {
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "moduleName": this.state.InputVAlues.module,
            "fieldName": this.state.InputVAlues.fieldName,
            "value": this.state.InputVAlues.fieldValue,
            "action": "add"
        });

        this.showTable();
        this.setState({ ShowTablesData: true });
        if (response) {
            console.log('Save_formData_To_table*******----------->', response);
        }
    }

    onCancel = () => {
        this.setState({
            openAlert: false,

        });
    };

    handleDeleteSection = () => {
        let message = '';
        if (this.state.selectedItems.length > 0) {
            message = 'Are you sure that you want to permanently delete this item(s)?';
            this.setState({ showCancel: true });
        } else {
            message = 'Please make at least on selection!';
            this.setState({ showCancel: false });
        }
        this.setState({
            alertMessage: message,
            openAlert: true,
        });

    };


    handleConfirmation = (e) => {
        console.log('===============>', this.state.selectedItems,e);
        if(this.state.selectedItems.length===0 && this.state.selectedItems.length>1){

          }
        else{
            if(this.state.selectedItems.length>0){
                this.getCustomFieldsDelete();
                // this.setState({
                //     openAlert: true,
                //     showCancel:false

                // });
              }
     }

     this.showTable();
    }
    listSelectedCatalogue = (e) => {
        let selectedItems = this.state.selectedItems
        console.log(e.target.value, this.state.searchArray)
        let arr = this.state.searchArray.filter(val => val.CF_FIELD_INDEX == e.target.value)
        selectedItems.push(arr[0]);
        console.log(selectedItems);
        if (e.target.checked) {
            this.setState({
                selectedItems: selectedItems,
            })
        }
        else {
            this.setState({
                selectedItems: '',
            })
        }

    }

    modifySaveData = async () => {
        let response = await ApiExtract(CustomFieldsAddModify, {
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "moduleName": this.state.modModule,
            "fieldName": this.state.modFieldname,
            "value": this.state.modFieldvalue,
            "action": "mod"
        });
        this.setState({
            showCancel: false,
            alertMessage: response.message,
            openAlert: true,

        });
        if (response) {
            console.log('modifySaveData*******----------->', response);
        }
        this.showTable();

    }

    getCustomFieldsNams = async (e) => {
        let response = await ApiExtract(CustomFieldsNameDrop, {
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "moduleName": ""
        });

        this.setState({
            getCustomFieldsNameWithApis: response.response
        })
        if (response) {
            console.log('resposne customfileds----------->', response.response);
        }
    }

    getCustomFieldsDelete = async () => {
        let response = await ApiExtract(PostDeletePurchaseCatalogue, {
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "moduleName": this.state.selectedItems[0].CF_MODULE,
            "fieldName": this.state.selectedItems[0].CF_FIELD_NAME,
            "value": this.state.selectedItems[0].CF_FIELD_VALUE,
        });

        if (response.status == "SUCCESS") {
            let message = '';
            message = 'Data Deleted Successfully!!';
            this.setState({
                // alertMessage: message,
                // openAlert: true,

            });
        }
        if (response) {
            console.log('deleted succefully----------->', response.response);
        }
    }

    handleAddSection = () => {
        this.setState({
            addItem: '',
            showAddSection: !this.state.showAddSection,
            showModifySection: false,
            showPurchaseCatalogueRequired: false
        });
    };

    handleModifySection = () => {
        let message = ''
        let selectedItems = this.state.selectedItems;
        console.log(this.state.selectedItems)
        let modModule, modFieldname, modFieldvalue = this.state
        if (!selectedItems.length) {
            message = 'Please make one selection!';
            this.setState({
                showCancel: true,
                alertMessage: message,
                openAlert: true,

            });
        }
        else if (selectedItems > 1) {
            message = 'Please choose only one selection!';
            this.setState({
                showCancel: true,
                alertMessage: message,
                openAlert: true
            });

        } else {
            console.log('fghfhfgjh')

            this.setState({
                showModifyModal: true,
                modModule: selectedItems[0].CF_MODULE,
                modFieldname: selectedItems[0].CF_FIELD_NAME,
                modFieldvalue: selectedItems[0].CF_FIELD_VALUE
            })
        }

    };

    render() {

        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}
            <Alert
                title=""
                message={this.state.alertMessage}
                status={this.state.status}
                show={this.state.openAlert}
                confimation={false}
                showCancel={this.state.showCancel}
                onCancel={() => { this.onCancel() }}
                confirm={(e) => { this.handleConfirmation(e) }}
            />

            <div className="show_list">
                <PageHeading
                    heading=""
                    subheading=""
                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                <form>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Module : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="modulesName" value={this.state.modulesName} onChange={(e) => { this.SaveValuesAccordingModuleName(e) }}>
                                                <option>PO</option>
                                                <option>PR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Field Name : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control" name="filedsNames" value={this.state.filedsNames} onChange={(e) => { this.SaveValuesAccordingModuleName(e) }} >

                                                {this.state.getCustomFieldsNameWithApis.map(item => (
                                                    <option key={item.CF_FIELD_NO} value={item.CF_FIELD_NAME}>
                                                        {item.CF_FIELD_NAME}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3 mt-3">
                                <div className="col-12 text-right">
                                    <button type="button" className="btn btn-outline-success btn-sm" onClick={() => this.showTable()} >Search</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Clear</button>
                                </div>
                            </div>
                            <div className="row mt-4">

                                <div className="table-responsive check_table">

                                    <div className='col-12 mt-3 pl-0'>
                                        {
                                            this.state.ShowTablesData ? (
                                                <div>
                                                    <table className="table table-striped table-hover table-bordered">
                                                        <thead className="thead-primary">
                                                            <th>
                                                                <input
                                                                    type="checkbox"
                                                                    value="checkAll"
                                                                    checked={this.state.isCheckAllChecked}
                                                                    onChange={(e) => { this.listSelectedCatalogue(e) }}
                                                                />
                                                            </th>
                                                            <th>Module</th>
                                                            <th>Field Name</th>
                                                            <th>Values</th>

                                                        </thead>
                                                        <tbody>

                                                            {this.state.searchArray.map((data, index) =>
                                                                <tr key={index}>

                                                                    <td className="align-middle">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={data.CF_FIELD_INDEX}
                                                                            checked={data.isChecked}
                                                                            onChange={(e) => { this.listSelectedCatalogue(e) }}
                                                                        />
                                                                    </td>
                                                                    <td> {data.CF_MODULE}</td>
                                                                    <td>{data.CF_FIELD_NAME}</td>
                                                                    <td>{data.CF_FIELD_VALUE}</td>

                                                                </tr>)}
                                                            <tr>
                                                                <td className="align-middle pl-2" colSpan="3">
                                                                    <p className="pl-2">
                                                                        {
                                                                            this.state.selectedRow ?
                                                                                this.state.searchArray.length :
                                                                                this.state.searchArray.length
                                                                        } record(s) found. <span>1 page(s) found.</span>
                                                                    </p>
                                                                </td>
                                                                <td></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : null
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-12 col-md-6 mt-3 pl-1">
                        <div className="row mb-3">
                            <div className="col-12">
                                <button type="button" className="btn btn-outline-success btn-sm" onClick={() => this.AddCustomFields()}>Add</button>
                                <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                    name="addItem"
                                    value={this.state.addMofidyItem}
                                    onClick={() => { this.handleModifySection() }}>Modify</button>
                                <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={() => this.handleDeleteSection()}>Delete</button>
                            </div>
                        </div>
                    </div>

                    <div className="Add-custom-fields">
                        <Modal
                            className="ctmMdl ctmMdl_cotract"
                            show={this.state.showAddModal}
                            onHide={() => this.hideAddModal()}
                            centered
                        >
                            <Modal.Header>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={() => this.hideAddModal()}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Modal.Header>
                            <Modal.Body>
                                <TabHeading color={'bg-info text-white'}>Add Custom Fields</TabHeading>
                                <form>
                                    <div classNmae="row">
                                        <div className="col-12 col-sm-12">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-12">
                                                    <div className="row">
                                                        <div className="col-12 col-md-5 pl-0"><label>Module<span className="text-danger">*</span>: </label></div>
                                                        <div className="col-12 col-md-6">
                                                            <select className="form-control" aria-readonly name="module" value={this.state.module} onChange={(e) => this.CatchValueOnChangeAddByAddButton(e)}>
                                                                <option selected>PO</option>
                                                                <option>PR</option>
                                                            </select>
                                                            <div className="text-danger"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-12">
                                                    <div className="row">
                                                        <div className="col-12 col-md-5 pl-0"><label>Field Name<span className="text-danger">*</span>: </label></div>
                                                        <div className="col-12 col-md-6">
                                                            <input type="text" name="fieldName" className="form-control" placeholder="Segmentation" value={this.state.fieldName} onChange={(e) => this.CatchValueOnChangeAddByAddButton(e)} />
                                                            <div className="text-danger"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-12 col-md-12">
                                                    <div className="row">
                                                        <div className="col-12 col-md-5 pl-0"><label>Field Value<span className="text-danger">*</span>: </label></div>
                                                        <div className="col-12 col-md-6">
                                                            <input type="text" name="fieldValue" className="form-control" placeholder="Transactional" value={this.state.fieldValue} onChange={(e) => this.CatchValueOnChangeAddByAddButton(e)} />
                                                            <div className="text-danger"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div classNmae="row mb-4 mt-4">
                                        <div class="col-12 col-md-12 pl-0">
                                            <div class="row"><p class="pl-3">Note - <span className="text-danger">*</span>indicates required field  </p>
                                            </div>
                                        </div></div>
                                </form>
                                <div className="col-12 col-md-6 mt-3 pl-1">
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <button type="button" className="btn btn-outline-success btn-sm" onClick={() => { this.saveData() }}>Save</button>
                                            <button type="button" className="btn btn-outline-success btn-sm ml-2">Add</button>
                                            <button type="button" className="btn btn-outline-danger btn-sm ml-2"
                                                onClick={() => this.hideAddModal()}
                                            >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>

                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div className="modify-custom-fields">
                        <Modal
                            className="ctmMdl ctmMdl_cotract"
                            show={this.state.showModifyModal}
                            onHide={() => this.hideModifyModal()}
                            centered
                        >
                            <Modal.Header>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={() => this.hideModifyModal()}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Modal.Header>
                            <Modal.Body>
                                <TabHeading color={'bg-info text-white'}>Modify Custom Fields</TabHeading>
                                {
                                    this.state.selectedItems.length == 1 ?

                                        <form >
                                            <div classNmae="row">
                                                <div className="col-12 col-sm-12">
                                                    <div className="row mt-2">
                                                        <div className="col-12 col-md-12">
                                                            <div className="row">
                                                                <div className="col-12 col-md-5 pl-0"><label>Module<span className="text-danger">*</span>: </label></div>
                                                                <div className="col-12 col-md-6">

                                                                    <select className="form-control" name="modModule" disabled={this.state.disabledKey?false:true} value={this.state.modModule} onChange={(e) => this.setState({ modModule: e.target.value })}>
                                                                        <option value="PO">PO</option>
                                                                        <option value="PR">PR</option>
                                                                    </select>
                                                                    <div className="text-danger"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-2">
                                                        <div className="col-12 col-md-12">
                                                            <div className="row">
                                                                <div className="col-12 col-md-5 pl-0"><label>Field Name<span className="text-danger">*</span>: </label></div>
                                                                <div className="col-12 col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Segmentation" name="modFieldname" disabled={this.state.disabledKey}  value={this.state.modFieldname} onChange={(e) => this.setState({ modFieldname: e.target.value })} />
                                                                    <div className="text-danger"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-3">
                                                        <div className="col-12 col-md-12">
                                                            <div className="row">
                                                                <div className="col-12 col-md-5 pl-0"><label>Field Value<span className="text-danger">*</span>: </label></div>
                                                                <div className="col-12 col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Transactional" name="modFieldvalue" value={this.state.modFieldvalue} onChange={(e) => this.setState({ modFieldvalue: e.target.value })} />
                                                                    <div className="text-danger"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div classNmae="row mb-4 mt-4">
                                                <div class="col-12 col-md-12 pl-0">
                                                    <div class="row"><p class="pl-3">Note - <span className="text-danger">*</span>indicates required field  </p>
                                                    </div>
                                                </div></div>
                                        </form>

                                        :
                                        null
                                }

                                <div className="col-12 col-md-6 mt-3 pl-1">
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <button type="button" className="btn btn-outline-success btn-sm" onClick={() => { this.modifySaveData() }} >Save</button>
                                            <button type="button" className="btn btn-outline-success btn-sm ml-2" onClick={()=>this.setState({disabled:true})}>Add</button>
                                            <button type="button" className="btn btn-outline-danger btn-sm ml-2"
                                                onClick={() => this.hideModifyModal()}
                                            >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>

                            </Modal.Footer>
                        </Modal>
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
