import React, { Component, Fragment } from "react";
import Loader from "../../../../../Component/Loader";
import PageHeading from "../../../../../Component/Heading/PageHeading";
import TabHeading from "../../../../../Component/Heading/TabHeading";
import { connect } from "react-redux";
import BootstrapCustomTable from "../../../../../Component/Table/BootstrapCustomTableStatic";
import Alert from "../../../../../Component/Modal/alert";
import { GetDashboardList, GetFixedRoles } from "../../../../../Actions/Eadmin";
import { DashboardList } from "../../../../../Apis/Eadmin";
import { ApiExtract } from "../../../../../Common/GetDatas";
import { ContractCatGetCurrency } from "../../../../../Apis/SysAdmin";
class DashboardListing extends Component {
  constructor(props) {
    super(props);
    this.closeModel = this.closeModel.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.state = {
      products: [],
      modal_body: "",
      modal: false,
      status: false,
      modal: false,
      rendered: false,
      title: "",
      message: "",
      show_roles: false,
      status: false,
      show: false,
      search_object: {
        frm: "listing",
        role: "",
        panelName: "",
      },
      modify_data: [],
      currencyList: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.dashboard_listing &&
      props.dashboard_listing &&
      props.dashboard_listing.responseList
    ) {
      return {
        products: props.dashboard_listing.responseList,
        rendered: true,
      };
    }
  }

  componentDidMount() {
    this.props.GetDashboardList(this.state.search_object);
    this.props.GetFixedRoles();
    this.handleContractCatGetCurrency();
    console.log();
    this.setState({
      modify_data: JSON.parse(localStorage.getItem("modify_data")),
    });
  }

  closeModel(details) {
    this.setState({
      show: false,
    });
  }

  Search = async () => {
    let { search_object } = this.state;
    if (search_object) {
      this.props.GetDashboardList(this.state.search_object);
    }
  };

  handleSelect = (e) => {
    let _details = e.target.value;
    if (_details) {
      let _temp_details = this.state.search_object;
      _temp_details.role = _details;
    }
  };

  handleInput = (e) => {
    let _details = e.target.value;
    if (_details) {
      let _temp_details = this.state.search_object;
      _temp_details.panelName = _details;
    }
  };

  get_details = (row) => {
    this.props.change_tab("Matrix", row.DM_FIXED_ROLE_ID);
  };

  handleContractCatGetCurrency = async () => {
    let response = await ApiExtract(ContractCatGetCurrency, {}, () => {});
    console.log("ContractCatGetCurrency", response);
    this.setState(
      {
        currencyList: response.response,
      },
      () => {
        console.log("currencyList", this.state.currencyList);
      }
    );
  };
  render() {
    const _table_header = [
      {
        name: "Catalogue",
        id: "DM_FIXED_ROLE_ID",
        formatter: (cellContent, row) => {
          return (
            <button
              type="button"
              className="btn btn-outline-primary btn-small"
              onClick={() => this.get_details(row)}
            >
              {row.DM_FIXED_ROLE_ID}
            </button>
          );
        },
      },
      { name: "Purchaser", id: "DM_PANEL_NAME", key: true },
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
          <PageHeading heading="" subheading="" />
          <form>
            <div classNmae="row modify_item">
              <div>
                <div className="table-responsive">
                  <table className="table table-striped table-hover table-bordered">
                    <thead className="thead-primary">
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>UOM</th>
                      <th>Currency</th>
                      <th>Contract Price *</th>
                      <th>SST Rate*</th>
                      <th>SST Tax Code</th>
                      <th>Remarks</th>
                    </thead>
                    <tbody>
                      {this.state.modify_data &&
                        this.state.modify_data.map((item) => {
                          return (
                            <tr>
                              {/* CDI_CURRENCY_CODE: "MYR"
                        CDI_GST: 0
                        CDI_GST_RATE: "N/A"
                        CDI_GST_TAX_CODE: "NR"
                        CDI_PRODUCT_CODE: "2457"
                        CDI_REMARK: ""
                        CDI_UNIT_COST: 24.5
                        CDM_GROUP_INDEX: 3
                        checked: true */}
                              <td className="align-middle">
                                {" "}
                                {item.CDI_VENDOR_ITEM_CODE}{" "}
                              </td>
                              <td className="align-middle">
                                {item.CDI_PRODUCT_DESC}
                              </td>
                              <td className="align-middle">{item.CDI_UOM}</td>
                              <td className="align-middle">
                                <select
                                  className="form-control"
                                  value={item.CDI_CURRENCY_CODE}
                                  onChange={(e) =>
                                    this.handleSelectToView(e.target.value)
                                  }
                                >
                                  <option value="">--select--</option>
                                  {/* <option value="">5425465</option> */}
                                  {this.state.currencyList &&
                                    this.state.currencyList.map((data) => (
                                      <option value={data.CODE_ABBR}>
                                        {data.CODE_DESC}
                                      </option>
                                    ))}
                                </select>

                                
                              </td>
                              <td className="align-middle">
                                <input
                                  type="search"
                                  name="CDI_UNIT_COST"
                                  value={item.CDI_UNIT_COST}
                                  class="form-control"
                                  //   placeholder="0.9000"
                                />
                              </td>
                              <td className="align-middle">
                                <select class="form-control"
                                value={item.CDI_GST_RATE}>
                                  <option value="">--select--</option>
                                  <option value="ZERO">ZERO</option>
                                  <option value="ST0">ST0</option>
                                  <option value="ST5">ST5</option>
                                  <option value="ST6">ST6</option>
                                  <option value="ST10">ST10</option>
                                </select>
                              </td>
                              <td className="align-middle">
                                <select class="form-control" value = {item.CDI_GST_TAX_CODE} disabled>
                                  <option value="">--select--</option>
                                  <option value="ST10">ST10</option>
                                  <option value="TX8">TX8</option>
                                </select>
                              </td>
                              <td className="align-middle">
                                <textarea
                                  name="CDI_REMARK"
                                  value={item.CDI_REMARK}
                                ></textarea>
                              </td>
                            </tr>
                          );
                        })}
                      {/*  */}
                      <tr>
                        <td className="align-middle pl-2" colSpan="8">
                          <p className="pl-2">
                            {this.state.modify_data.length} record(s) found.{" "}
                            <span>1 page(s) found.</span>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
          <div className="col-12 col-md-6 mt-3 pl-1">
            <div className="row mb-3">
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm ml-2"
                >
                  Close
                </button>
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
export default DashboardListingHolder;
