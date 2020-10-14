import React, { Component, Fragment } from "react";
import Loader from "../../../../../Component/Loader";
import PageHeading from "../../../../../Component/Heading/PageHeading";
import TabHeading from "../../../../../Component/Heading/TabHeading";
import { connect } from "react-redux";
import Alert from "../../../../../Component/Modal/alert";
import { GetDashboardList, GetFixedRoles } from "../../../../../Actions/Eadmin";
import { DashboardList } from "../../../../../Apis/Eadmin";
import { ApiExtract } from "../../../../../Common/GetDatas";
import BootstrapCustomTableNoSearch from "../../../../../Component/Table/BootstrapCustomTableNoSearch";
import BootstrapCustomTable from "../../../../../Component/Table/BootstrapCustomTableStatic";
import { Button, Modal } from "react-bootstrap";
import ConfirmationModel from "../../../../../Component/Modal/ConfirmationModel";
import Select from "react-select";

import {
  ContractCatalogueSearch,
  ContractCatalogueAddModify,
  ContractCatalogueDelete,
  ContractCatalogueViewItem,
  ContractCatalogueExtend,
  searchVendorCompany,
} from "../../../../../Apis/SysAdmin";
import { FormDatePickerParallelNoLabel } from "../../../../../Component/From/FromInputs";
import { Field, reduxForm } from "redux-form";

import moment from "moment";
class DashboardListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      selectedItem: [],
      saveArray:[],
      status: false,
      show: false,
      showCancel: false,
      searchData: {
        contractRefNo: "",
        description: "",
        vendorCompany: "",
        startDate: "",
        endDate: "",
      },

      addData: {
        contractRefNo: "",
        description: "",
        vendorCompany: "",
        startDate: "",
        endDate: "",
      },

      search_object: {
        frm: "listing",
        role: "",
        panelName: "",
      },
      searchTable: [],
      errors: {
        contractRefNo: "",
        description: "",
        vendorCompany: "",
        startDate: "",
        endDate: "",
      },
      error: {
        contractRefNo: "",
        description: "",
        vendorCompany: "",
        startDate: "",
        endDate: "",
      },
      showViewModal: false,
      showModifyModal: false,
      showAddModal: false,
      viewItems: [],
      show: false,
      confimation_pop: false,
      alert_title: false,
      alert_message: "",
      extendDate: ''
    };
    this.onRowSelectHandler = this.onRowSelectHandler.bind(this);
  }

  componentDidMount() {
    this.handleSelectVendorComp("");
  }

  componentWillUpdate(prevProps){
    if(prevProps.active_key !== this.props.active_key){
      this.clear();
      this.clearAllData();
    }
  }

  clearAllData = () => {
    this.setState({
      searchTable: []
    })
  }

  handleAddModal = () => {
    this.setState(
      {
        addData: {
          contractRefNo: "",
          description: "",
          vendorCompany: "",
          startDate: "",
          endDate: "",
        },
        errors: {
          contractRefNo: "",
          description: "",
          vendorCompany: "",
          startDate: "",
          endDate: "",
        },
        showAddModal: !this.state.showAddModal,
        modalType: "add",
      },
      () => {
        if (this.state.showAddModal == false && this.state.searchTable.length) {
          this.handleContractCatalogueSearch();
        }
        console.log("this.state.addData", this.state.addData);
      }
    );
  }

  clear = () => {
    this.setState({
      searchData: {
        contractRefNo: "",
        description: "",
        vendorCompany: "",
        startDate: "",
        endDate: "",
      },
    });
  }

  handleModifyModal = () => {
    let addData = this.state.addData;
    addData.endDate = new Date(this.state.selectedItem[0].CDM_END_DATE);
    addData.contractRefNo = this.state.selectedItem[0].CDM_GROUP_CODE;
    addData.description = this.state.selectedItem[0].CDM_GROUP_DESC;
    addData.startDate = new Date(this.state.selectedItem[0].CDM_START_DATE);
    addData.vendorCompany = this.state.selectedItem[0].CM_COY_NAME;
    addData.oldRefNo = JSON.parse(
      JSON.stringify(this.state.selectedItem[0].CDM_GROUP_CODE)
    );
    this.props.change('modify-startdate', addData.startDate);
    this.props.change('modify-enddate', addData.endDate);
    this.setState(
      {
        addData,
        showAddModal: !this.state.showAddModal,
        modalType: "modify",
      },
      () => {
        console.log("adddata", this.state.addData);
        if (this.state.showAddModal == false) {
          this.handleContractCatalogueSearch();
        }
      }
    );
  }

  handleViewModal = () => {
    this.setState(
      {
        showViewModal: !this.state.showViewModal,
      },
      () => {
        if (this.state.showViewModal == false) {
          this.handleContractCatalogueSearch();
        }
      }
    );
  };
  handleExtendModal = () => {
    this.setState(
      {
        showExtendModal: !this.state.showExtendModal,
      },
      () => {
        if (this.state.showExtendModal == false) {
          this.handleContractCatalogueSearch();
        }
      }
    );
  };

  Modify = async () => {
    let { products, search_object, selectedItem } = this.state;
    console.log(products);
    if (selectedItem.length) {
      if (selectedItem.length == 1) {
        this.handleModifyModal();
      } else {
        this.setState({
          show: true,
          status: false,
          alert_message: "Please make only one selection",
        });
      }
    } else {
      this.setState({
        show: true,
        status: false,
        alert_message: "Please make atleast only one selection!",
      });
    }
  };

  View = async () => {
    let { products, search_object, selectedItem } = this.state;
    console.log(products);
    if (selectedItem.length) {
      if (selectedItem.length == 1) {
        let response = await ApiExtract(
          ContractCatalogueViewItem,
          {
            index: this.state.selectedItem[0].CDM_GROUP_INDEX,
          },
          () => {}
        );
        console.log("ContractCatalogueSearch", response);
        this.setState(
          {
            viewItems: response.response.map(data=>(
              {
                ...data,
                CDI_UNIT_COST: parseFloat(data.CDI_UNIT_COST).toFixed(4),
                CDI_GST_RATE: data.CDI_GST_RATE === "N/A" ? 'ZERO(0%)' : ''
              }
            )),
          },
          () => {
            console.log("viewItems", this.state.viewItems);
          }
        );

        this.handleViewModal();
      } else {
        this.setState({
          show: true,
          status: false,
          alert_message: "Please make only one selection",
        });
      }
    } else {
      this.setState({
        show: true,
        status: false,
        alert_message: "Please make atleast only one selection!",
      });
    }
  }

  Extend = async () => {
    let { products, search_object, selectedItem } = this.state;
    console.log(products);
    if (selectedItem.length) {
      this.handleExtendModal();
    } else {
      this.setState({
        show: true,
        status: false,
        alert_message: "Please make atleast only one selection!",
      });
    }
  }

  Delete = async () => {
    let { products, search_object, selectedItem } = this.state;
    console.log(products);
    if (selectedItem.length > 0) {
      this.setState({
        _confimation_type: "delete",
        show: true,
        alert_message: "Are you sure that you want to permanently delete this item(s)?",
        showCancel: true
      });
    } else {
      this.setState({
        show: true,
        status: false,
        alert_message: "Please make atleast only one selection!",
      });
    }
  }

  handleAddValues = (e, val) => {
    console.log(e);
    let searchData = this.state.searchData;
    if (val) {
      searchData[val] = e ? e : '';
    } else {
      let name = e.target.name;
      let value = e.target.value;
      searchData[name] = value;
    }
    this.setState(
      {
        searchData,
      },
      () => {
        console.log(this.state);
      }
    );
  }
  // abh
  handleAddChange = (e, val) => {
    console.log(e);
    console.log(val);
    let addData = this.state.addData;
    if (val) {
      addData[val] = e === null ? '' : e;
    } else {
      let name = e.target.name;
      let value = e.target.value;
      addData[name] = value;
    }
    this.setState(
      {
        addData,
      },
      () => {
        console.log(this.state);
      }
    );
  }

  handleExtendChange = (e, val) => {
    this.setState(
      {
        [val]: e,
      },
      () => {
        console.log(this.state);
      }
    );
  }

  validate() {
    let addData = this.state.addData;
    let errors = this.state.errors;
    addData.vendorCompany =
      this.state.selectedOption && this.state.selectedOption.label
        ? this.state.selectedOption.label
        : "";

    errors.contractRefNo =
      addData.contractRefNo == "" ? "Contract Ref. No. is Required" : "";
    errors.vendorCompany =
      addData.vendorCompany == "" ? "Vendor Company is required." : "";
    errors.description =
      addData.description == "" ? "Description is required." : "";
    errors.startDate = addData.startDate == "" ? "Start Date is required." : "";
    errors.endDate = addData.endDate == "" ? "End Date is required." : "";
    console.log(addData);
    console.log(errors);
    this.setState({
      errors,
    });
    return Object.keys(errors).every((k) => errors[k] == "");
  }

  handleAddModifyApi = async () => {
    if (this.validate()) {
      let response = await ApiExtract(
        ContractCatalogueAddModify,
        {
          mode: this.state.modalType == "modify" ? "Mod" : "Add",
          companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
          contractRefNo: this.state.addData.contractRefNo,
          oldRefNo: this.state.addData.oldRefNo,
          description: this.state.addData.description,
          vendorCompany: this.state.selectedOption.label,
          startDate: this.state.addData.startDate ? moment(new Date(this.state.addData.startDate)).format(
            "YYYY-MM-DD HH:mm:ss"
          ) : '',
          endDate:this.state.addData.endDate ? moment(new Date(this.state.addData.endDate)).format(
            "YYYY-MM-DD HH:mm:ss"
          ) : '',
          index:
            this.state.modalType == "modify"
              ? this.state.products[0].CDM_GROUP_INDEX
              : "",
          catType:
            this.state.modalType == "modify"
              ? this.state.products[0].CDM_TYPE
              : "C",
          vendorId:
            this.state.modalType == "modify"
              ? this.state.products[0].CDM_S_COY_ID
              : "",
          userId: "",
        },
        () => {}
      );
      if (response) {
        this.handleAddModal();
        this.setState({
          products: [],
        });
      }
      console.log("ContractCatalogueAddModify", response);
    }
  }

  handleSelectVendorComp = async (e) => {
    console.log(e);
    let response = await ApiExtract(searchVendorCompany, {
      vendorComapnyName: e,
    });
    if (response && response.response) {
      console.log("searchVendorCompanyresponseresponse", response.response);
      this.setState({
        vendorComapnyList: response.response.map((x) => {
          let obj = {};
          obj.value = x.CM_COY_ID;
          obj.label = x.CM_COY_NAME;
          return obj;
        }),
      });
    }
  }

  handleSelectChange = (evt) => {
    this.setState({ selectedOption: evt.target.selectedOptions[0] });
    this.handleSelectVendorComp(evt.target.selectedOptions[0].label);
    console.log(`Option selected:`, evt.target.selectedOptions[0]);
  };

  onRowSelectHandler = (row, isSelected, e) => {
   console.log(e.target.value);
    let tempArray = this.state.products;
    if(isSelected){
        tempArray = row;
    } else {
        let index = tempArray.findIndex((ele) =>{
          return ele.CDM_GROUP_INDEX === row.CDM_GROUP_INDEX
        });
        tempArray.splice(index, 1);
    }
    this.setState({
      products: tempArray
    },()=>{console.log('-------->',this.state.products)});

  }
  handleExtendApi = async () => {
    let response = await ApiExtract(
      ContractCatalogueExtend,
      {
        extendDt: moment(new Date(this.state.extendDate)).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
        catType: this.state.products.CDM_TYPE,
        index: this.state.products.CDM_GROUP_INDEX,
      },
      () => {}
    );
    if (response) {
      this.handleExtendModal();
    }
    console.log("ContractCatalogueExtend", response);

  }

  handleContractCatalogueSearch = async () => {
    console.log(
      "this.state.searchData.startDate",
      this.state.searchData.startDate
    );
    console.log(
      "this.state.searchData.startDate",
      this.state.searchData.startDate.toString().length
    );
    if(this.state.searchData.startDate > this.state.searchData.endDate) {
      this.setState({
        alert_message: 'End date should be greater than Start date',
        show: true
      })
    } else {
      let response = await ApiExtract(
      ContractCatalogueSearch,
      {
        companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
        catType: "C",
        contractRefNo: this.state.searchData.contractRefNo,
        description: this.state.searchData.description,
        vendorCompany: this.state.searchData.vendorCompany,
        startDate:
          this.state.searchData.startDate &&
          this.state.searchData.startDate.toString().length
            ? moment(new Date(this.state.searchData.startDate)).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "",
        endDate:
          this.state.searchData.endDate &&
          this.state.searchData.endDate.toString().length
            ? moment(new Date(this.state.searchData.endDate)).format(
                "YYYY-MM-DD HH:mm:ss"
              )
              : "",
          index: "",
          type: "",
        },
        () => {}
      );
      console.log("ContractCatalogueSearch", response);
      this.setState(
        {
          searchTable: response.response,
        },
        () => {
          console.log("searchTable", this.state.searchTable);
          console.log("products", this.state.products);
        }
      );
    }
  }

  handleDeleteApi = async () => {
    let products = this.state.selectedItem;
    if (products.length) {
      if (products.length == 1) {
        let response = await ApiExtract(
          ContractCatalogueDelete,
          {
            companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            index: this.state.products[0].CDM_GROUP_INDEX,
          },
          () => {}
        );
        if (response) {
          // this.handleExtendModal();
        }
        console.log("ContractCatalogueExtend", response);
      }
    }
  }

  onRowSelectHandler = (row, isSelected, e) => {

      let tempArray = this.state.selectedItem;
      if(isSelected){
          tempArray.push(row);
      } else {
          let index = tempArray.findIndex((ele) =>{
            return ele.CDM_GROUP_INDEX === row.CDM_GROUP_INDEX
          });
          tempArray.splice(index, 1);
      }
      this.setState({
        selectedItem: tempArray
      });

  }

  closemodel = () => {
    this.setState({
      show: false,
      showCancel: false
    });
  };

  onCancel = () => {
    this.setState({
      show: false,
      showCancel: false
    });
  };

  onConfirm = () => {
    let _confimation_type = this.state.confimation_type;
    this.setState({ confimation_pop: false });
    // if (_confimation_type == "delete") {
    this.handleDeleteApi();
    // }
  };

  onCancel = () => {
    this.setState({
      show: false,
      showCancel: false
    });
  };

  handleDate = (date) => {
    console.log("date", date);
    this.setState(
      {
        startDate: date,
      },
      () => {
        console.log(this.state.startDate);
      }
    );
  };

  render() {
    const _table_header = [
      {
        name: "Contract Ref.No",
        id: "CDM_GROUP_CODE",
        key: true,
        width: "101px",
      },
      {
        name: "Description",
        id: "CDM_GROUP_DESC",
        key: false,
        width: "127px",
      },
      {
        name: "Vendor Company",
        id: "CM_COY_NAME",
        key: false,
        width: "60px",
      },
      {
        name: "Start Date",
        dataFormat: "date",
        id: "CDM_START_DATE",
        key: false,
        width: "60px",
      },
      {
        name: "End Date",
        dataFormat: "date",
        id: "CDM_END_DATE",
        key: false,
        width: "60px",
      },
    ];
    const _table_header2 = [
      {
        name: "Item Code",
        id: "CDI_VENDOR_ITEM_CODE",
        key: true,
        width: "50px",
      },
      { name: "Item Name", id: "CDI_PRODUCT_DESC", key: false, width: "127px" },
      { name: "Currency", id: "CDI_CURRENCY_CODE", key: false, width: "30px" },
      { name: "Price", id: "CDI_UNIT_COST", key: false, width: "30px", dataFormat:"cdi_unit_cost"},
      { name: "SST Rate", id: "CDI_GST_RATE", key: false, width: "30px"},
      {
        name: "SST Tax Code (Purchase)",
        id: "CDI_GST_TAX_CODE",
        key: false,
        width: "40px",
      },
      { name: "UOM", id: "CDI_UOM", key: false, width: "25px" },
      { name: "Remarks", id: "CDI_REMARK", key: false, width: "60px" },
    ];

    const _table_header3 = [
      {
        name: "Contract Ref.No",
        id: "CDM_GROUP_CODE",
        key: true,
        width: "101px",
      },
      {
        name: "Description",
        id: "CDM_GROUP_DESC",
        key: false,
        width: "127px",
      },
      {
        name: "Vendor Company",
        id: "CM_COY_NAME",
        key: false,
        width: "120px",
      },
      {
        name: "Start Date",
        dataFormat: "date",
        id: "CDM_START_DATE",
        key: false,
        width: "35px",
      },
      {
        name: "End Date",
        dataFormat: "date",
        id: "CDM_END_DATE",
        key: false,
        width: "35px",
      },
    ];
    return (
      <Fragment>
        {this.props.loading ? <Loader /> : ""}
        {this.props.dashboard_listing &&
        this.props.dashboard_listing.loading ? (
          <Loader />
        ) : (
          ""
        )}
        {this.state.loading ? <Loader /> : ""}

        <div className="show_list">
          <PageHeading
            heading=""
            subheading="Step 1: Create, delete or modify Contract Catalogue"
          />
          <PageHeading
            heading=""
            subheading="Step 2: Assign item master to Contract Catalogue"
          />
          <PageHeading
            heading=""
            subheading="Step 2: Assign User to Contract Catalogue"
          />
          <TabHeading color={"bg-info text-white"}>Search Criteria</TabHeading>
          <form>
            <div classNmae="row">
              <div className="col-12 col-sm-12  pl-0 pr-0">
                <div className="row mt-2">
                  <div className="col-12 col-md-4">
                    <div className="row mt-2">
                      <div className="col-12 col-md-6">
                        <label>Contract Ref. No.: </label>
                      </div>
                      <div className="col-12 col-md-6">
                        <input
                          name="contractRefNo"
                          className="form-control"
                          placeholder=""
                          onChange={(e) => this.handleAddValues(e)}
                          value={this.state.searchData.contractRefNo}
                        />
                        <div className="text-danger">
                          {this.state.error.contractRefNo}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="row mt-2">
                      <div className="col-12 col-md-6">
                        <label>Description : </label>
                      </div>
                      <div className="col-12 col-md-6">
                        <input
                          name="description"
                          className="form-control"
                          placeholder=""
                          onChange={(e) => this.handleAddValues(e)}
                          value={this.state.searchData.description}
                        />
                        <div className="text-danger">
                          {this.state.error.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="row mt-2">
                      <div className="col-12 col-md-6">
                        <label>Vendor Company : </label>
                      </div>
                      <div className="col-12 col-md-6">
                        <input
                          name="vendorCompany"
                          className="form-control"
                          placeholder=""
                          onChange={(e) => this.handleAddValues(e)}
                          value={this.state.searchData.vendorCompany}
                        />
                        <div className="text-danger">
                          {this.state.error.vendorCompany}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 col-md-4">
                    <div className="row mt-2">
                      <div className="col-12 col-md-6">
                        <label>Start Date :</label>
                      </div>
                      <Field
                        type="text"
                        name="payment_date"
                        value={this.state.searchData.startDate}
                        selected={this.state.searchData.startDate}
                        component={FormDatePickerParallelNoLabel}
                        className="form-control"
                        placeholder="startDate"
                        onChange={(e) => this.handleAddValues(e, "startDate")}
                        clear={true}
                        rem={true}
                      />
                      <div className="text-danger">
                        {this.state.errors.startDate}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="row mt-2">
                      <div className="col-12 col-md-6">
                        <label>End Date : </label>
                      </div>
                      <Field
                        type="text"
                        name="endDate"
                        value={this.state.searchData.endDate}
                        selected={this.state.searchData.endDate}
                        component={FormDatePickerParallelNoLabel}
                        className="form-control"
                        placeholder="endDate"
                        onChange={(e) => this.handleAddValues(e, "endDate")}
                        clear={true}
                        rem={true}
                      />
                      <div className="text-danger">
                        {this.state.errors.endDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 col-md-12 mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => this.handleContractCatalogueSearch()}
                      className="btn btn-sm btn-outline-success"
                    >
                      Search
                    </button>
                    <button
                      onClick={() => this.clear()}
                      type="button"
                      className="btn btn-sm btn-outline-danger ml-2"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="mt-3">
            {this.state.searchTable && this.state.searchTable.length ? (
              <BootstrapCustomTable
                search={true}
                table_header={_table_header}
                table_body={this.state.searchTable}
                select={true}
                selectname={"pr_no"}
                products={this.onRowSelectHandler}
                responsive={true}
                click={false}
                table_name="issue_grn"
                pagination={true}
              />
            ) : null}
          </div>

          <div className="col-12 col-md-6 mt-3 pl-1">
            <div className="row mb-3">
              <div className="col-12">
                <button
                  onClick={() => this.handleAddModal()}
                  type="button"
                  className="btn btn-outline-success btn-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => this.Modify()}
                  type="button"
                  className="btn btn-outline-success btn-sm ml-2"
                  disabled={
                    !this.state.searchTable || !this.state.searchTable.length
                  }
                >
                  Modify
                </button>
                <button
                  onClick={() => this.Delete("")}
                  type="button"
                  disabled={
                    !this.state.searchTable || !this.state.searchTable.length
                  }
                  className="btn btn-outline-danger btn-sm ml-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => this.View()}
                  type="button"
                  disabled={
                    !this.state.searchTable || !this.state.searchTable.length
                  }
                  className="btn btn-outline-info btn-sm ml-2"
                >
                  View Contract Items
                </button>
                <button
                  type="button"
                  disabled={
                    !this.state.searchTable || !this.state.searchTable.length
                  }
                  onClick={() => this.Extend()}
                  className="btn btn-outline-success btn-sm ml-2"
                >
                  Extend Items
                </button>
              </div>
            </div>
          </div>
          <div className="modify">
            <Modal
              className="ctmMdl"
              show={this.state.showViewModal}
              onHide={() => this.handleViewModal("")}
              centered
            >
              <Modal.Header>
              <h5>Contract Item List</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => this.handleViewModal("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div classNmae="row">
                    <div className="col-12 col-sm-12">
                      <div className="row mt-2">
                        <div className="table-responsive">
                          <div className="col-12">
                            {this.state.viewItems &&
                            this.state.viewItems.length ? (
                              <BootstrapCustomTableNoSearch
                                search={false}
                                table_header={_table_header2}
                                table_body={this.state.viewItems}
                                responsive={true}
                                click={false}
                                table_name="issue_grn"
                                pagination={true}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="col-12 col-md-6 mt-3 pl-1">
                  <div className="row mb-3">
                    <div className="col-12">
                      <button
                        onClick={() => this.handleViewModal("")}
                        type="button"
                        className="btn btn-outline-danger btn-sm ml-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
            <Modal
              className="ctmMdl ctmMdl_cotract"
              show={this.state.showAddModal}
              onHide={() => this.handleAddModal("")}
              centered
            >
              <Modal.Header>
                <h5>Modidy Contract Catalogue</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => this.handleAddModal("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Modal.Header>
              <Modal.Body>
                <TabHeading color={"bg-info text-white"}>
                  Modify Contract
                </TabHeading>
                <div classNmae="row">
                  <div className="col-12 col-sm-12">
                    <div className="row mt-2">
                      <div className="col-12 col-md-12">
                        <div className="row">
                          <div className="col-12 col-md-3 pl-0">
                            <label>
                              Contract Ref. No. <span className="text-danger">*</span>:{" "}
                            </label>
                          </div>

                          <div className="col-12 col-md-9">
                            <input
                              type="text"
                              name="contractRefNo"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => this.handleAddChange(e)}
                              value={this.state.addData.contractRefNo}
                            />
                            <div className="text-danger">
                              {this.state.errors.contractRefNo}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12 col-md-12">
                        <div className="row">
                          <div className="col-12 col-md-3 pl-0">
                            <label>
                              Description <span className="text-danger">*</span>:{" "}
                            </label>
                          </div>
                          <div className="col-12 col-md-9">
                            <input
                              type="text"
                              name="description"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => this.handleAddChange(e)}
                              value={this.state.addData.description}
                            />
                            <div className="text-danger">
                              {this.state.errors.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 col-md-12">
                        <div className="row">
                          <div className="col-12 col-md-3 pl-0">
                            <label>
                              Start Date <span className="text-danger">*</span>:{" "}
                            </label>
                          </div>
                          <Field
                            type="text"
                            name="modify-startdate"
                            value={this.state.addData.startDate}
                            selected={this.state.addData.startDate}
                            component={FormDatePickerParallelNoLabel}
                            className="form-control"
                            placeholder="startDate"
                            onChange={(e) =>
                              this.handleAddChange(e, "startDate")
                            }
                            clear={true}
                            rem={true}
                          />
                          <div className="text-danger">
                            {this.state.errors.startDate}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 col-md-12">
                        <div className="row">
                          <div className="col-12 col-md-3 pl-0">
                            <label>
                              End Date <span className="text-danger">*</span>:{" "}
                            </label>
                          </div>
                          <Field
                            type="text"
                            name="modify-enddate"
                            value={this.state.addData.endDate}
                            selected={this.state.addData.endDate}
                            component={FormDatePickerParallelNoLabel}
                            className="form-control"
                            placeholder="endDate"
                            onChange={(e) => this.handleAddChange(e, "endDate")}
                            clear={true}
                            rem={true}
                          />
                          <div className="text-danger">
                            {this.state.errors.endDate}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 col-md-12">
                        <div className="row">
                          <div className="col-12 col-md-3 pl-0">
                            <label>
                              Vendor Company<span className="text-danger">*</span>:{" "}
                            </label>
                          </div>
                          <div className="col-12 col-md-9">
                            <select
                              className="form-control"
                              name="selectedOption"
                              value={this.state.selectedOption}
                              onChange={(e) => this.handleSelectChange(e)}
                            >
                              <option value="">--Select--</option>
                              {
                                this.state.vendorComapnyList && this.state.vendorComapnyList.map(data =>(
                                  <option value={data.value}>{data.label}</option>
                                ))
                              }
                            </select>
                            <div className="text-danger">
                              {this.state.errors.vendorCompany}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-0 mb-3">
                  <div class="col-12 col-md-6">
                    <p>
                      <span class="text-danger">*</span>
                        indicates required field
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6 mt-3 pl-1">
                  <div className="row mb-3">
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() => this.handleAddModifyApi()}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => this.handleAddModal("")}
                        type="button"
                        className="btn btn-outline-danger btn-sm ml-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
            <Modal
              className="ctmMdl"
              show={this.state.showExtendModal}
              onHide={() => this.handleExtendModal("")}
              centered
            >
              <Modal.Header>
                <h5>Extend Contract Catalogue</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => this.handleExtendModal("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Modal.Header>
              <Modal.Body>
                <TabHeading color={"bg-info text-white"}>
                  Extend Contract Catalogue
                </TabHeading>
                <form>
                  <div classNmae="row">
                    <div className="col-12 col-sm-12">
                      <div className="row mt-3 mb-3">
                        <div className="col-12 col-md-6">
                          <div className="row">
                            <div className="col-12 col-md-3 pl-0 mt-1">
                              <label>
                                Extend Date <span className="text-danger">*</span>:{" "}
                              </label>
                            </div>
                            <div className="col-12 col-md-9">
                              <Field
                                type="text"
                                name="extendDate"
                                value={this.state.extendDate}
                                selected={this.state.extendDate}
                                component={FormDatePickerParallelNoLabel}
                                className="form-control"
                                placeholder="startDate"
                                onChange={(e) =>
                                  this.handleExtendChange(e, "extendDate")
                                }
                                clear={true}
                                rem={true}
                              />
                              <div className="text-danger"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div>
                  {this.state.products ? (
                    <BootstrapCustomTableNoSearch
                      select={true}
                      table_header={_table_header3}
                      table_body={this.state.selectedItem}
                      responsive={true}
                      click={false}
                      table_name="issue_grn"
                      products={this.onRowSelectHandler}
                      />
                  ) : null}
                </div>
                <div className="row mt-2">
                    <div className="col-12 col-md-12">
                        <div className="row mt-2">
                            <div className="col-12 col-md-12">
                                <p>Note-<span className="text-danger">*</span> indicates required field</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mt-3 pl-1">
                  <div className="row mb-3">
                    <div className="col-12">
                      <button
                        onClick={() => this.handleExtendApi("")}
                        type="button"
                        className="btn btn-outline-success btn-sm ml-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => this.handleExtendModal("")}
                        type="button"
                        className="btn btn-outline-success btn-sm ml-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          </div>
        </div>
        <Alert
          confirm={this.closemodel}
          title={this.state.alert_title}
          message={this.state.alert_message}
          status={this.state.status}
          show={this.state.show}
          showCancel={this.state.showCancel}
          onCancel={() =>{this.onCancel()}}
          onConfirm={(e) => this.onConfirm()}
          confimation={false}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  dashboard_listing: state.dashboard_listing.responseList_2,
  loading: state.dashboard_listing.loading,
  fixed_roles: state.fixed_roles.responseList,
});

const mapDispatchToProps = (dispatch) => ({
  GetDashboardList: (values) => dispatch(GetDashboardList(values)),
  GetFixedRoles: (values) => dispatch(GetFixedRoles(values)),
});

const DashboardListingHolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardListing);
export default reduxForm({
  form: "TaxCode",
})(DashboardListingHolder);
