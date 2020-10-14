import React, { Component, Fragment } from "react";
import Loader from "../../../../../Component/Loader";
import PageHeading from "../../../../../Component/Heading/PageHeading";
import TabHeading from "../../../../../Component/Heading/TabHeading";
import { connect } from "react-redux";
import BootstrapCustomTable from "../../../../../Component/Table/BootstrapCustomTableStatic";
import Alert from "../../../../../Component/Modal/alert";
import { ApiExtract } from "../../../../../Common/GetDatas";
import {
  ContractCAtassignMultipleUsersGetData,
  ContractCatAssignMultipleUsersSave,
} from "../../../../../Apis/SysAdmin";
class DashboardListing extends Component {
  constructor(props) {
    super(props);
    this.handleSelectToView = this.handleSelectToView.bind(this);

    this.state = {
      message: 'Record Saved.',
      show: false,
      availableCatalogue: [],
      availablePurchasers: [],
      selectedCatalogue: [],
      selectedPurchasers: [],
      selectedCatalogueItemToAssign: [],
      selectedPurchaserItemToAssign: [],
      selectedCatalogueItemToRemove: [],
      selectedPurchaserItemToRemove: []
    };
  }

  componentDidMount() {
    this.handleSelectToView();
  }

  handleSelectToView = async () => {
    this.setState({
      selectedPurchasers: [],
      selectedCatalogue: [],
    });
    let response = await ApiExtract(ContractCAtassignMultipleUsersGetData, {
      companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
    });
    this.setState(
      {
        availableCatalogue: response.response.availableCatalogue,
        availablePurchasers: response.response.availablePurchasers,
      },
      () => {
        console.log("availableCatalogue", this.state.availableCatalogue);
        console.log("availablePurchasers", this.state.availablePurchasers);
      }
    );
    console.log("responseMULTI", response.response);
  };

  handleAdd = async (e) => {
    console.log("abc");
    if (this.state.selectedPurchasers) {
      let response = await ApiExtract(ContractCatAssignMultipleUsersSave, {
        groupIndex: this.state.selectedCatalogue.map((item)=>( item.CDM_GROUP_INDEX )),
        userId: this.state.selectedPurchasers.map((item) => ( item.UM_USER_ID ))
      });
      if (response && response.status) {
        this.setState({
          show: true,
        })
        this.handleSelectToView();
      }
      console.log(response.response);
    }
  }

  handleAvailableCatalogueSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = this.state.availableCatalogue.findIndex(ele =>
          ele.CDM_GROUP_INDEX.toString() ===  selectedOptions[i].value
      );
      tempArray.push(this.state.availableCatalogue[itemIndex]);
    }
    this.setState({
      selectedCatalogueItemToAssign: tempArray
    });
  }

  handleSelectedCatalogueSelect = (evt) => {
      let selectedOptions = evt.target.selectedOptions;
      let tempArray = [];
      for(let i=0; i<selectedOptions.length; i++){
        let itemIndex = this.state.selectedCatalogue.findIndex(ele =>
            ele.CDM_GROUP_INDEX.toString() ===  selectedOptions[i].value
          );
        tempArray.push(this.state.selectedCatalogue[itemIndex]);
      }
      this.setState({
        selectedCatalogueItemToRemove: tempArray
      });
  }

  handleCatalogueAssign = () => {
      let tempArray = this.state.availableCatalogue;
      tempArray = tempArray.filter(e => !this.state.selectedCatalogueItemToAssign.includes(e));
      this.setState({
        selectedCatalogue: this.state.selectedCatalogue.concat(this.state.selectedCatalogueItemToAssign),
        availableCatalogue: tempArray,
        selectedCatalogueItemToAssign: []
      })
  }

  handleCatalogueRemove = () => {
      let selectedTempArray = this.state.selectedCatalogue;
      selectedTempArray = selectedTempArray.filter(e => !this.state.selectedCatalogueItemToRemove.includes(e));
      let availableTempArray = this.state.availableCatalogue.concat(this.state.selectedCatalogueItemToRemove);
      this.setState({
        availableCatalogue: availableTempArray,
        selectedCatalogue: selectedTempArray,
        selectedCatalogueItemToRemove: []
      })
  }

  handleAvailablePurchaserSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = this.state.availablePurchasers.findIndex(ele =>
          ele.UM_USER_ID.toString() ===  selectedOptions[i].value
        );
      tempArray.push(this.state.availablePurchasers[itemIndex]);
    }
    this.setState({
      selectedPurchaserItemToAssign: tempArray
    });
  }

  handleSelectedPurchaserSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = this.state.selectedPurchasers.findIndex(ele =>
          ele.UM_USER_ID.toString() ===  selectedOptions[i].value
      );
      tempArray.push(this.state.selectedPurchasers[itemIndex]);
    }
    this.setState({
      selectedPurchaserItemToRemove: tempArray
    });
  }


  handlePurchaserAssign = () => {
      let tempArray = this.state.availablePurchasers;
      tempArray = tempArray.filter(e => !this.state.selectedPurchaserItemToAssign.includes(e));
      this.setState({
        selectedPurchasers: this.state.selectedPurchasers.concat(this.state.selectedPurchaserItemToAssign),
        availablePurchasers: tempArray,
        selectedPurchaserItemToAssign: []
      });
  }

  handlePurchaserRemove = () => {
      let selectedTempArray = this.state.selectedPurchasers;
      selectedTempArray = selectedTempArray.filter(e => !this.state.selectedPurchaserItemToRemove.includes(e));
      let availableTempArray = this.state.availablePurchasers.concat(this.state.selectedPurchaserItemToRemove);
      this.setState({
        availablePurchasers: availableTempArray,
        selectedPurchasers: selectedTempArray,
        selectedPurchaserItemToRemove: []
      })
  }

  reset() {
    this.handleSelectToView();
  }

  render() {
    console.log('')
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
          <div className="table-responsive select_cstm mt-4">
            <table className="table">
              <thead className="thead-primary">
                <th>Available Catalogue </th>
                <th className="align-middle">
                  <span className="invisible">Assign/Remove Value</span>
                </th>
                <th>Selected Catalogue </th>
              </thead>
              <tbody>
                <tr>
                  <td className="align-middle">
                    {
                      this.state.availableCatalogue && this.state.availableCatalogue.length > 0 ?(
                        <select
                          className="form-control"
                          onChange={(e) => this.handleAvailableCatalogueSelect(e)}
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
                          this.state.availableCatalogue.map((data, index) => (
                            <option key={index} value={data.CDM_GROUP_INDEX}>{data.three}</option>
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
                        onClick={() => this.handleCatalogueAssign()}
                        type="button"
                        disabled={!this.state.availableCatalogue || !this.state.availableCatalogue.length}
                        className="btn btn-outline-success btn-sm"
                      >
                        Assign
                      </button>
                      <br />
                      <button
                        type="button"
                        onClick={() => this.handleCatalogueRemove()}
                        className="btn btn-outline-danger btn-sm mt-2"
                        disabled={
                          !this.state.selectedCatalogue ||
                          !this.state.selectedCatalogue.length
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                  <td className="align-middle">
                    {
                      this.state.selectedCatalogue && this.state.selectedCatalogue.length > 0 ?(
                        <select
                          className="form-control"
                          onChange={(e) => this.handleSelectedCatalogueSelect(e)}
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
                          this.state.selectedCatalogue.map((data, index) => (
                            <option key={index} value={data.CDM_GROUP_INDEX}>{data.three}</option>
                          ))
                        }
                      </select>
                      ):
                      <textarea></textarea>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="table">
              <thead className="thead-primary">
                <th>Available Purchasers </th>
                <th className="align-middle">
                  <span className="invisible">Assign/Remove Value</span>
                </th>
                <th>Selected Purchasers </th>
              </thead>
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
                        onClick={() => this.handlePurchaserAssign()}
                        type="button"
                        disabled={!this.state.availablePurchasers ||!this.state.availablePurchasers.length}
                        className="btn btn-outline-success btn-sm"
                      >
                        Assign
                      </button>
                      <br />
                      <button
                        type="button"
                        onClick={() => this.handlePurchaserRemove()}
                        className="btn btn-outline-danger btn-sm mt-2"
                        disabled={!this.state.selectedPurchasers ||!this.state.selectedPurchasers.length}
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
                      ):
                      <textarea></textarea>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-12 col-md-12 mt-3 pl-1">
            <div className="row mb-3">
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={() => this.handleAdd()}
                  disabled={!(this.state.selectedCatalogue.length && this.state.selectedPurchasers.length)}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => this.reset()}
                  className="btn btn-outline-success btn-sm ml-2"
                  disabled={!(this.state.selectedCatalogue.length && this.state.selectedPurchasers.length)}
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
  loading: state.dashboard_listing.loading,
});

const mapDispatchToProps = (dispatch) => ({
});

const DashboardListingHolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardListing);
export default DashboardListingHolder;
