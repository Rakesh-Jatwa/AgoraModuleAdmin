import React, { Component, Fragment } from "react";
import Loader from "../../../../../Component/Loader";
import PageHeading from "../../../../../Component/Heading/PageHeading";
import TabHeading from "../../../../../Component/Heading/TabHeading";
import { connect } from "react-redux";
import Alert from "../../../../../Component/Modal/alert";
import { ApiExtract } from "../../../../../Common/GetDatas";

import {
  ContractCatUserAssignmentGetDropDownList,
  ContractCatUserAssignmentgetDropDownData,
  ContractCatUserAssignmentAssignUsers,
  GetPurchaserAssignmentData,
} from "../../../../../Apis/SysAdmin";

class DashboardListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Record Saved.',
      show: false,
      contractRefList: [],
      radioSelectionTab: "contractCatalogue",
      selectedPurchasers: [],
      resetButtonDisabled: true,
      saveButtonDisabled: true,
      selectedItemToAssign:[],
      selectedItemToRemove: []
    };
  }

  componentDidMount() {
    this.getContractRefNo();
  }

  getContractRefNo = async () => {
    let response = await ApiExtract(ContractCatUserAssignmentGetDropDownList, {
      viewBy: this.state.radioSelectionTab,
      companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
    });
    console.log(" get ref list", response);
    this.setState({
      contractRefList: response.response,
    });
  };

  get_details = (row) => {
    this.props.change_tab("Matrix", row.DM_FIXED_ROLE_ID);
  };

  handleSelectToView = async (e) => {
    this.setState({
      ContractRefNo: e,
      availablePurchasers: [],
      selectedPurchasers: [],
    });
    console.log(e);
    console.log(localStorage.getItem("profile"));
    console.log(JSON.parse(localStorage.getItem("profile")));
    let response = await ApiExtract(ContractCatUserAssignmentgetDropDownData, {
      companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
      groupIndex: e,
      viewBy: this.state.radioSelectionTab,
      userId: "buyer",
    });
    if (response && response.response) {
      console.log("responseresponse", response);
      console.log(" get ref list", response.response);
      this.setState({
        availablePurchasers: response.response.availablePurchasers
          ? response.response.availablePurchasers
          : response.response.availableContractCatalogue,
        selectedPurchasers: response.response.selectedPurchasers
          ? response.response.selectedPurchasers
          : response.response.selectedContractCatalogue,
        saveButtonDisabled: e ? false: true,
        resetButtonDisabled: e ? true: true,
      });
    }
  };

  handleAdd = async (e) => {
    let id =
      this.state.radioSelectionTab === "contractCatalogue"
        ? "groupIndex"
        : "userId";
    let ids =
      this.state.radioSelectionTab === "contractCatalogue"
        ? "userIds"
        : "catalogueIndex";

    let response = await ApiExtract(ContractCatUserAssignmentAssignUsers, {
      viewBy: this.state.radioSelectionTab,
      companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],

      [id]: this.state.ContractRefNo,
      [ids]: this.state.selectedPurchasers.map((item) => {
        return item.UM_USER_ID ? item.UM_USER_ID : item.CDM_GROUP_INDEX;
      }),
    });
    if (response && response.status) {
      this.setState({
        show: true,
      })
      this.handleSelectToView(this.state.ContractRefNo);
    }
    console.log(response.response);
  };

  handleRadio(val) {
    this.setState(
      {
        radioSelectionTab: val,
        availablePurchasers: [],
        selectedPurchasers: [],
        contractRefList: [],
      },
      () => {
        console.log(this.state.radioSelectionTab);
        this.getContractRefNo();
      }
    );
  }

  handleAvailablePurchaserSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = 0;
      if(this.state.radioSelectionTab === "purchasers"){
        itemIndex = this.state.availablePurchasers.findIndex(ele =>
          ele.CDM_GROUP_INDEX.toString() ===  selectedOptions[i].value
        );
      } else {
        itemIndex = this.state.availablePurchasers.findIndex(ele =>
          ele.UM_USER_ID ===  selectedOptions[i].value
        );
      }
      tempArray.push(this.state.availablePurchasers[itemIndex]);
    }
    this.setState({
      selectedItemToAssign: tempArray
    });
  }

  handleSelectedPurchaserSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = 0;
      if(this.state.radioSelectionTab === "purchasers"){
        itemIndex = this.state.selectedPurchasers.findIndex(ele =>
          ele.CDM_GROUP_INDEX.toString() ===  selectedOptions[i].value
        );
      } else {
        itemIndex = this.state.selectedPurchasers.findIndex(ele =>
          ele.UM_USER_ID ===  selectedOptions[i].value
        );
      }
      tempArray.push(this.state.selectedPurchasers[itemIndex]);
    }
    this.setState({
      selectedItemToRemove: tempArray
    });
  }

  handleAssignSelection = () => {
    let tempArray = this.state.availablePurchasers;
    tempArray = tempArray.filter(e => !this.state.selectedItemToAssign.includes(e));
    this.setState({
      selectedPurchasers: this.state.selectedPurchasers.concat(this.state.selectedItemToAssign),
      availablePurchasers: tempArray,
      selectedItemToAssign: [],
      resetButtonDisabled: false,
    })
  }

  handleRemoveSelection = () => {
    let selectedTempArray = this.state.selectedPurchasers;
    selectedTempArray = selectedTempArray.filter(e => !this.state.selectedItemToRemove.includes(e))
    let availableTempArray = this.state.availablePurchasers.concat(this.state.selectedItemToRemove);
    this.setState({
      availablePurchasers: availableTempArray,
      selectedPurchasers: selectedTempArray,
      selectedItemToRemove: [],
      resetButtonDisabled: false,
    })
  }

  reset() {
    this.handleSelectToView(this.state.ContractRefNo);
  }

  render() {
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
        <Alert
           title=""
           message={this.state.message}
           status={this.state.status}
           show={this.state.show}
           confimation={false}
           showCancel={false}
           confirm={() =>{ this.setState({show: false}) }}
           />
        <div className="show_list">
          <PageHeading
            heading=""
            subheading="Step 1: Create, delete or modify Contract Catalogue."
          />
          <PageHeading
            heading=""
            subheading="Step 2: Assign item master to Contract Catalogue."
          />
          <PageHeading
            heading=""
            subheading="=> Step 3: Assign User to Contract Catalogue."
          />
          <div className="row mt-2">
            <div className="col-12 col-md-1">
              <label>
                <strong>View By :</strong>{" "}
              </label>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-check form-check-inline">
                <input
                  classNmae="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  onChange={(e) => this.handleRadio(e.target.value)}
                  id="inlineRadio2"
                  value="contractCatalogue"
                  checked={this.state.radioSelectionTab === "contractCatalogue"}
                />
                <label className="form-check-label ml-2" for="inlineRadio2">
                  Contract Catalogue
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  classNmae="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  onChange={(e) => this.handleRadio(e.target.value)}
                  id="inlineRadio2"
                  value="purchasers"
                  checked={this.state.radioSelectionTab === "purchasers"}
                />
                <label className="form-check-label ml-2" for="inlineRadio2">
                  Purchasers
                </label>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12 col-md-12">
              <p>Please select Contract Catalogue.</p>
            </div>
          </div>
          <TabHeading color={"bg-info text-white"}>Search Criteria</TabHeading>
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="row mb-3">
                <div className="col-12 col-md-3 ">
                  {this.state.radioSelectionTab === "purchasers" ? (
                    <label>Purchasers: </label>
                  ) : (
                    <label>Contract Catalogue: </label>
                  )}
                </div>
                <div className="col-12 col-md-5">
                  {this.state.radioSelectionTab === "purchasers" ? (
                    <select
                      className="form-control"
                      onChange={(e) => this.handleSelectToView(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {/* <option value="">5425465</option> */}
                      {this.state.contractRefList &&
                        this.state.contractRefList.map((data) => (
                          <option value={data.UM_USER_ID}>{data.three}</option>
                        ))}
                    </select>
                  ) : (
                    <select
                      className="form-control"
                      onChange={(e) => this.handleSelectToView(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {/* <option value="">5425465</option> */}
                      {this.state.contractRefList &&
                        this.state.contractRefList.map((data) => (
                          <option value={data.CDM_GROUP_INDEX}>
                            {data.CDM_GROUP_CODE}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive select_cstm">
            <table className="table">
              <thead className="thead-primary">
                <th>Available Purchasers </th>
                <th className="align-middle">
                  <span className="invisible">Assign/Remove Value</span>
                </th>
                <th>Selected Purchasers </th>
              </thead>
              {this.state.radioSelectionTab === "purchasers" ? (
                <tbody>
                  <tr>
                    <td className="align-middle">
                      {
                        this.state.availablePurchasers && this.state.availablePurchasers.length > 0 ?(
                          <select
                            className="form-control"
                            onChange={(e) => this.handleAvailablePurchaserSelect(e)}
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
                            this.state.availablePurchasers.map((data, index) => (
                              <option key={index} value={data.CDM_GROUP_INDEX}>{data.CDM_GROUP_CODE}</option>
                            ))
                          }
                        </select>
                        ):
                        <textarea></textarea>
                      }
                    </td>
                    <td className="align-middle text-center btn_md">
                      <div className="col-12">
                        <button
                          onClick={() => this.handleAssignSelection()}
                          type="button"
                          disabled={
                            !this.state.contractRefList ||
                            !this.state.contractRefList.length
                          }
                          className="btn btn-outline-success btn-sm"
                        >
                          Assign
                        </button>
                        <br />
                        <button
                          type="button"
                          onClick={() => this.handleRemoveSelection()}
                          className="btn btn-outline-danger btn-sm mt-2"
                          disabled={
                            !this.state.availablePurchasers ||
                            !this.state.availablePurchasers.length
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                    <td className="align-middle">
                    {
                        this.state.selectedPurchasers && this.state.selectedPurchasers.length > 0 ?(
                          <select
                            className="form-control"
                            onChange={(e) => this.handleSelectedPurchaserSelect(e)}
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
                            this.state.selectedPurchasers.map((data, index) => (
                              <option key={index} value={data.CDM_GROUP_INDEX}>{data.CDM_GROUP_CODE}</option>
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
              ) : (
                <tbody>
                  <tr>
                    <td className="align-middle">
                      {
                          this.state.availablePurchasers && this.state.availablePurchasers.length > 0 ?(
                            <select
                              className="form-control"
                              onChange={(e) => this.handleAvailablePurchaserSelect(e)}
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
                              this.state.availablePurchasers.map((data, index) => (
                                <option key={index} value={data.UM_USER_ID}>{data.three}</option>
                              ))
                            }
                          </select>
                          ):
                          <textarea></textarea>
                    }
                    </td>
                    <td className="align-middle text-center btn_md">
                      <div className="col-12">
                        <button
                          onClick={() => this.handleAssignSelection()}
                          type="button"
                          disabled={!this.state.contractRefList || !this.state.contractRefList.length}
                          className="btn btn-outline-success btn-sm"
                        >
                          Assign
                        </button>
                        <br />
                        <button
                          type="button"
                          onClick={() => this.handleRemoveSelection()}
                          className="btn btn-outline-danger btn-sm mt-2"
                          disabled={!this.state.availablePurchasers || !this.state.availablePurchasers.length}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                    <td className="align-middle">
                      {
                          this.state.selectedPurchasers && this.state.selectedPurchasers.length > 0 ?(
                            <select
                              className="form-control"
                              onChange={(e) => this.handleSelectedPurchaserSelect(e)}
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
                              this.state.selectedPurchasers.map((data, index) => (
                                <option key={index} value={data.UM_USER_ID}>{data.three}</option>
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
              )}
            </table>
          </div>
          <div className="col-12 col-md-6 mt-3 pl-1">
            <div className="row mb-3">
              <div className="col-12">
                <button
                  type="button"
                  onClick={() => this.handleAdd()}
                  className="btn btn-outline-success btn-sm"
                  disabled={this.state.saveButtonDisabled}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => this.reset()}
                  className="btn btn-outline-success btn-sm ml-2"
                  disabled={this.state.resetButtonDisabled}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 pl-3">
            <div className="row mb-2">
              <div>
                <ul className="pl-1 ml-0 list_style">
                  <li>
                    {" "}
                    a) To assign Purchasers to the Contract Catalogue, choose
                    the name from 'Available Purchasers' and click Assign button
                    <span class="text-danger">*</span>
                    .
                  </li>
                  <li>
                    {" "}
                    b) To remove/unassigned purchaser from the Contract
                    Catalogue, choose the 'Selected Purchasers' and click Remove
                    button
                    <span class="text-danger">*</span>
                    .
                    {" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  dashboard_listing: state.dashboard_listing.responseList_2,
  loading: state.dashboard_listing.loading
});

const mapDispatchToProps = (dispatch) => ({
});

const DashboardListingHolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardListing);
export default DashboardListingHolder;
