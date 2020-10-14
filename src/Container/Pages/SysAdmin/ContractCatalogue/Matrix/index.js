import React, { Component, Fragment } from "react";
import Loader from "../../../../../Component/Loader";
import PageHeading from "../../../../../Component/Heading/PageHeading";
import TabHeading from "../../../../../Component/Heading/TabHeading";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import BootstrapCustomTableNoSearch from "../../../../../Component/Table/BootstrapCustomTableNoSearch";
import Alert from "../../../../../Component/Modal/alert";
import { GetDashboardList, GetFixedRoles } from "../../../../../Actions/Eadmin";
import { DashboardSave } from "../../../../../Apis/Eadmin";
import { ApiExtract } from "../../../../../Common/GetDatas";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";

import {
  AddSearchResult,
  CommoditySearchResult,
  ContractCatGetContractRefNo,
  ContractCatAssignItem,
  ContractCatViewItem,
  ContractCatGetAvailablePurchasers,
  ContractCatGetCurrency,
} from "../../../../../Apis/SysAdmin";
import { Link } from "react-router-dom";
import {
  UserDetails,
  UserDetailsMain,
  PutLocalstorage,
} from "../../../../../Common/LocalStorage";
import ConfirmationModel from "../../../../../Component/Modal/ConfirmationModel";

class DashboardMaster extends Component {
  constructor(props) {
    super(props);
    this.closeModel = this.closeModel.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductsall = this.getProductsall.bind(this);
    this.handleChangeCommodity = this.handleChangeCommodity.bind(this);

    this.state = {
      products: [],
      addproducts: [],
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
        frm: "matrix",
        role: "",
      },
      searchTable: [],
      contractRefList: [],
      ContractRefNo: "",
      showAddModal: false,
      showModifyModal: false,
      modify_data: [],
      currencyList: [],
      MI: false,
      SP: false,
      ST: false,
      searchList: {
        strCoyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
        strItemType: "B",
        strBCItemIdx: "",
        strCode: "",
        strName: "",
        strComType: "",
        strDel: "",
        pItemType: [],
        strStk: "",
      },

      addList: [],

      selected: [],
      // options: [],
      selectedOption: "",
      show: false,
      confimation_pop: false,
      alert_title: false,
      alert_message: "",
      showCancel: false,
      commoditySearchList: [],
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
    this.props.GetFixedRoles();
    this.getContractRefNo();
    this.handleContractCatGetCurrency();
    this.handleChangeCommodity("");
  }

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
  componentDidUpdate() {
    let _details = this.props.get_role();
    let { search_object } = this.state;
    if (_details && _details.role_id && _details.render) {
      this.props.block_render();
      this.handleSelect(_details.role_id);
      search_object.role = _details.role_id;
      this.setState({
        search_object: search_object,
      });
    }
  }

  ContractCatGetAvailablePurchasers = async () => {
    let response = await ApiExtract(ContractCatGetAvailablePurchasers, {
      companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
      groupIndex: 2,
    });
    console.log("responseresponse", response);
  };
  closeModel(details) {
    this.setState({
      show: false,
    });
  }

  ChangeValue = async (values, props) => {
    let { products } = this.state;
    let _details = [];
    if (products && products.length) {
      _details = await products.map((list_item, index) => {
        if (list_item.dm_dashboard_id == props.dm_dashboard_id) {
          list_item.dm_panel_name = values;
          return list_item;
        } else {
          return list_item;
        }
      });
    }
    this.setState({
      products: _details,
    });
  };

  Save = async () => {
    let { products } = this.state;
    if (products && products.length) {
      let _temp_details = {
        frm: "master",
        dashboardData: products,
      };
      this.setState({ loading: true });
      let _status = await ApiExtract(DashboardSave, _temp_details);
      if (_status) {
        this.setState({
          loading: false,
          show: true,
          title: "",
          status: _status.status,
          message: _status.message ? _status.message : "Security policy saved",
        });
      }
    } else {
      this.setState({
        loading: false,
        show: true,
        title: "",
        status: false,
        message: "No master item to save",
      });
    }
  };

  handleSelect = (e) => {
    let _details = e;
    if (_details) {
      let _temp_details = this.state.search_object;
      _temp_details.role = _details;

      this.setState({
        show_roles: true,
        rendered: false,
      });
      this.props.GetDashboardList(_temp_details);
    }
  };
  handleSelectToView = async (e) => {
    this.setState({
      ContractRefNo: e,
    });
    let response = await ApiExtract(ContractCatViewItem, {
      index: e,
    });
    console.log(" get ref list", response.response);
    this.setState(
      {
        // products: [],
        searchTable: response.response.map((item) => {
          let obj = {};
          obj.currencyCode = item.CDI_CURRENCY_CODE;
          obj.gst = item.CDI_GST;
          obj.gstRate = item.CDI_GST_RATE === "N/A" ? 'ZERO(0%)' : item.CDI_GST_RATE;
          obj.gstTaxCode = item.CDI_GST_TAX_CODE;
          obj.productCode = item.CDI_PRODUCT_CODE;
          obj.productDesc = item.CDI_PRODUCT_DESC;
          obj.remark = item.CDI_REMARK;
          obj.unitCost = parseFloat(item.CDI_UNIT_COST).toFixed(4);
          obj.uom = item.CDI_UOM;
          obj.vendorItemCode = item.CDI_VENDOR_ITEM_CODE;
          obj.groupIndex = item.CDM_GROUP_INDEX;
          obj.entBy = "sysadmin";
          obj.modBy = "sysadmin";
          obj.checked = false;
          return obj;
        }),
      },
      () => {
        console.log(this.state.searchTable);
      }
    );
  };
  getContractRefNo = async () => {
    let response = await ApiExtract(ContractCatGetContractRefNo, {});
    console.log(" get ref list", response);
    this.setState({
      contractRefList: response.response,
    });
  };
  // comodity search
  handleChangeCommodity = async (selectedOption) => {
    console.log("selectedOption", selectedOption);
    let response = await ApiExtract(
      CommoditySearchResult,
      { searchCommodity: selectedOption },
      () => {}
    );

    if (response) {
      console.log("handleChangeCommodity", response.response);
    }
    this.setState(
      {
        selectedOption,
        commoditySearchList: response.response.map((item) => {
          let obj = {};
          obj.value = item.CT_ID;
          obj.label = item.CT_NAME;
          return obj;
        }),
      },
      () => {
        console.log("selectedOption", this.state.selectedOption, response);
      }
    );
  };

  handleSelectChange = (evt) => {
    debugger;
    this.setState({ selectedOption: evt.target.selectedOptions[0] });
    //this.handleChangeCommodity(selectedOption);
    console.log(`Option selected:`, evt.target.selectedOptions[0]);
  };
  // modify
  handleContractCatAssignItem = async (name) => {
    if (this.state.products && this.state.products.length > 0) {
      let response = await ApiExtract(
        ContractCatAssignItem,
        {
          action: name,
          itemList: this.state.products.map((item) => {
            delete item.checked;
            return item;
          }),
        },
        () => {
          console.log("saved");
        }
      );
      console.log(" get ref list", response);
      this.setState({
        // contractRefList: response.response,
        showModifyModal: false,
      });
      this.handleSelectToView(this.state.ContractRefNo);
    }
  };

  // add
  handleAddCatAssignItem = async () => {
    if (this.state.products && this.state.products.length > 0) {
      let response = await ApiExtract(
        ContractCatAssignItem,
        {
          action: "add",
          itemList: this.state.addList,
        },
        () => {
          this.setState({
            showModifyModal: false,
          });
          this.handleSelectToView(this.state.ContractRefNo);
        }
      );
      console.log(" get ref list", response);
      this.setState({
        contractRefList: response.response,
      });
    }
  };

  handleCheckElement = async (item, e) => {
    let checked = e.target.checked;
    let products = this.state.products;
    if (checked == false) {
      console.log(checked);

      let index = products.findIndex(
        (x) => x.vendorItemCode == item.vendorItemCode
      );
      products.splice(index, 1);
    } else {
      products.push(item);
    }
    this.setState(
      {
        products,
        searchTable: this.state.searchTable.map((val) => {
          if (val.vendorItemCode == item.vendorItemCode) {
            val.checked = checked;
          }
          return val;
        }),
      },
      () => {
        console.log(this.state.searchTable);
        console.log(this.state.products);
      }
    );
  };
  handleSelectAll(checked) {
    if (checked == true) {
      this.setState({
        products: this.state.searchTable.map((item) => {
          item.checked = checked;
          return item;
        }),
        searchTable: this.state.searchTable.map((item) => {
          item.checked = checked;
          return item;
        }),
      });
    } else {
      this.setState({
        products: [],
        searchTable: this.state.searchTable.map((item) => {
          item.checked = checked;
          return item;
        }),
      });
    }
  }

  handleAddModal = () => {
    let addList = this.state.addList;
    addList.groupIndex = this.state.ContractRefNo;
    this.setState({
      addList,
      showAddModal: !this.state.showAddModal,
    });
    this.onClear();
  };
  handleModifyModal = () => {
    // if (this.state.products.length > 0) {
    this.setState(
      {
        showModifyModal: !this.state.showModifyModal,
      },
      () => {
        if (this.state.showModifyModal == false) {
          this.handleSelectToView(this.state.ContractRefNo);
          console.log("this.state.showModifyModal", this.state.showModifyModal);
        }
      }
    );
    // }
  };
  handleAddValues = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let searchList = this.state.searchList;

    searchList[name] = value;
    this.setState(
      {
        searchList,
      },
      () => {
        console.log(this.state.searchList);
      }
    );
  };
  handleAddChecks = (e) => {
    let name = e.target.name;
    let value = e.target.checked;

    this.setState({
      [name]: value,
    });
  };
  onSearch = async () => {
    let searchList = this.state.searchList;
    if (this.state.MI == true) {
      searchList.pItemType.includes("MI")
        ? (searchList = searchList)
        : searchList.pItemType.push("MI");
    } else {
      let ind = searchList.pItemType.indexOf("MI");
      searchList.pItemType.splice(ind, 1);
    }
    if (this.state.ST == true) {
      searchList.pItemType.includes("ST")
        ? (searchList = searchList)
        : searchList.pItemType.push("ST");
    } else {
      let ind = searchList.pItemType.indexOf("ST");
      searchList.pItemType.splice(ind, 1);
    }
    if (this.state.SP == true) {
      searchList.pItemType.includes("SP")
        ? (searchList = searchList)
        : searchList.pItemType.push("SP");
    } else {
      let ind = searchList.pItemType.indexOf("SP");
      searchList.pItemType.splice(ind, 1);
    }
    searchList.strDel = "N";
    searchList.strItemType = "B";
    searchList.strCoyId = JSON.parse(localStorage.getItem("profile"))[
      "UM_COY_ID"
    ];
    searchList.strComType = this.state.selectedOption.value;
    console.log(this.state.searchList);
    let response = await ApiExtract(
      AddSearchResult,
      this.state.searchList,
      () => {}
    );
    this.setState(
      {
        addList: response.response,
      },
      () => {
        console.log("this.addList", this.state.addList);
      }
    );
  };

  handleSelectEditTable = (ind, e, name) => {
    let products = this.state.products;

    if (name.length > 0) {
      products[ind][name] = e;
      this.setState({
        products,
      });
    } else {
      let name = e.target.name;
      let value = e.target.value;
      products[ind][name] = value;
      this.setState({
        products,
      });
    }
  };

  onRowSelectHandler = (row, isSelected, e) => {
    let tempArray = this.state.selectedItem;
    if (isSelected) {
      tempArray.push(row);
    } else {
      tempArray = tempArray.filter(function (ele) {
        return ele !== row;
      });
    }
    this.setState({
      selectedItem: tempArray,
    });
  };

  async getProductsall(_products, details) {
    let _all_products = this.state.products;
    if (_products.length) {
      if (details) {
        for (let i = 0; i < _products.length; i++) {
          _all_products.push(_products[i]);
          if (i != _products.length) {
            await this.setState({ products: _all_products });
          }
        }
      } else {
        let _temp_query = _all_products;
        for (let i = 0; i < _products.length; i++) {
          _temp_query = _temp_query.filter(
            (fieldValue, index) =>
              fieldValue.vendorItemCode != _products[i].vendorItemCode
          );
          if (i != _products.length) {
            this.setState({ products: _temp_query });
          }
        }
      }
    }
  }
  async getAddProductsall(_products, details) {
    let _all_products = this.state.addProducts;
    if (_products.length) {
      if (details) {
        for (let i = 0; i < _products.length; i++) {
          _all_products.push(_products[i]);
          if (i != _products.length) {
            await this.setState({ addProducts: _all_products });
          }
        }
      } else {
        let _temp_query = _all_products;
        for (let i = 0; i < _products.length; i++) {
          _temp_query = _temp_query.filter(
            (fieldValue, index) =>
              fieldValue.vendorItemCode != _products[i].vendorItemCode
          );
          if (i != _products.length) {
            this.setState({ addProducts: _temp_query });
          }
        }
      }
    }
  }
  async getProducts(values, details) {
    console.log("values, details", values, details);
    console.log("getProducts");
    let _all_products = this.state.products;
    if (details) {
      _all_products.push(values);
      await this.setState({
        products: _all_products,
      });
    } else {
      let _products =
        this.state.products.length &&
        this.state.products.filter(
          (fieldValue, index) =>
            fieldValue.vendorItemCode != values.vendorItemCode
        );
      await this.setState(
        {
          products: _products,
        },
        () => {
          console.log(this.state.products);
        }
      );
    }
  }
  async getAddProducts(values, details) {
    console.log("values, details", values, details);
    console.log("getProducts");
    let _all_products = this.state.addproducts;
    if (details) {
      _all_products.push(values);
      await this.setState({
        addproducts: _all_products,
      });
    } else {
      let _products =
        this.state.addproducts.length &&
        this.state.addproducts.filter(
          (fieldValue, index) =>
            fieldValue.vendorItemCode != values.vendorItemCode
        );
      await this.setState({
        addproducts: _products,
      });
    }
  }

  Modify = async () => {
    let { products, search_object } = this.state;
    console.log(products);
    if (products.length) {
      this.handleModifyModal();
    } else {
      this.setState({
        show: true,
        status: false,
        alert_message: "Please make atleast only one selection!",
      });
    }
  };
  Delete = async () => {
    let { products } = this.state;
    console.log(products);
    if (products.length) {
      this.setState({
        _confimation_type: "delete",
        confimation_pop: true,
        showCancel: true,
        alert_message: "Are you sure that you want to permanently delete this item(s)?",
      });
    } else {
      this.setState({
        show: true,
        status: false,
        alert_message: "Please make atleast only one selection!",
      });
    }
  };

  closemodel = () => {
    this.setState({
      show: false,
    });
  };

  onCancel = () => {
    this.setState({
      confimation_pop: false,
    });
  };

  onConfirm = () => {
    this.setState({ confimation_pop: false });
    // if (_confimation_type == "delete") {
    this.handleContractCatAssignItem("delete");
    // }
  };

  onClear = () => {
    this.setState({
      searchList: {
        strCoyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
        strItemType: "B",
        strBCItemIdx: "",
        strCode: "",
        strName: "",
        strComType: "",
        strDel: "",
        pItemType: [],
        strStk: "",
      },
      MI: false,
      SP: false,
      ST: false,
      selectedOption: ""
    });
  };

  render() {
    const _table_header = [
      {
        name: "Item Code",
        id: "vendorItemCode",
        key: true,
        width: "60px",
      },
      { name: "Item Name", id: "productDesc", key: false, width: "127px" },
      { name: "Currency", id: "currencyCode", key: false, width: "60px" },
      { name: "Price", id: "unitCost", key: false, width: "60px", dataFormat: "cdi_unit_cost" },
      { name: "SST Rate", id: "gstRate", key: false, width: "60px" },
      {
        name: "SST Tax Code (Purchase)",
        id: "gstTaxCode",
        key: false,
        width: "60px",
      },
      { name: "UOM", id: "uom", key: false, width: "40px" },
      { name: "Remarks", id: "remark", key: false, width: "80px" },
    ];

    const _table_header2 = [
      { name: "Item Code", id: "vendorItemCode", key: true, width: "101px" },
      { name: "Item Name", id: "productDesc", key: false, width: "127px" },
      { name: "Currency", id: "currencyCode", key: false, width: "60px" },
      { name: "Price", id: "unitCost", key: false, width: "60px", dataFormat: "cdi_unit_cost" },
      { name: "SST Rate", id: "gstRate", key: false, width: "60px" },
      { name: "SST Tax Code (Purchase)", id: "gstTaxCode", key: false, width: "60px"},
      { name: "UOM", id: "uom", key: false, width: "60px" },
      { name: "Remarks", id: "remark", key: false, width: "60px" },
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
            subheading="Step 1: Create, delete or modify Contract Catalogue."
          />
          <PageHeading
            heading=""
            subheading="=> Step 2: Assign item master to Contract Catalogue."
          />
          <PageHeading
            heading=""
            subheading="Step 3: Assign User to Contract Catalogue."
          />
          <TabHeading color={"bg-info text-white"}>Search Criteria</TabHeading>
          <div className="row mb-4">
            <div className="col-12 col-md-6">
              <div className="row">
                <div className="col-12 col-md-3 ">
                  <label>Contract Ref. No.: </label>
                </div>
                <div className="col-12 col-md-9">
                  <select
                    className="form-control"
                    onChange={(e) => this.handleSelectToView(e.target.value)}
                    name="ContractRefNo"
                    value={this.state.ContractRefNo}
                  >
                    <option value="">--Select--</option>
                    {/* <option value="">5425465</option> */}
                    {this.state.contractRefList &&
                      this.state.contractRefList.map((data) => (
                        <option value={data.CDM_GROUP_INDEX}>
                          {data.CDM_ENT_BY}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            {this.state.searchTable && this.state.searchTable.length ? (
              <BootstrapCustomTableNoSearch
                table_header={_table_header}
                table_body={this.state.searchTable}
                select={true}
                selectname={"pr_no"}
                products={this.getProducts}
                selectall={this.getProductsall}
                responsive={true}
                click={false}
                table_name="issue_grn"
                pagination={true}
                search={false}
              />
            ) : null}
          </div>
          <div className="col-12 col-md-6 mt-3 pl-1">
            <div className="row mb-3">
              <div className="col-12">
                <button
                  onClick={() => this.handleAddModal("")}
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  disabled={
                    !this.state.searchTable || !this.state.searchTable.length
                  }
                >
                  Add
                </button>
                <button
                  onClick={() => this.Modify("")}
                  type="button"
                  disabled={
                    !this.state.searchTable || !this.state.searchTable.length
                  }
                  className="btn btn-outline-success btn-sm btn-sm ml-2"
                >
                  Modify
                </button>
                <button
                  onClick={() => this.Delete()}
                  // onClick={() => this.handleAddModal()}
                  type="button"
                  className="btn btn-outline-danger btn-sm ml-2"
                  disabled={
                    !this.state.searchTable || !this.state.searchTable.length
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 pl-3">
            <div className="row mb-2">
              <div>
                <ul className="pl-1 ml-0 list_style">
                  <li>
                    a) Click Add button to add new item master to the selected
                    Contract Catalogue.{" "}
                  </li>
                  <li>
                    b) Click Modify button to modify the currency, price or
                    remark of the contract item.
                  </li>
                  <li>
                    c) Click Remove button to delete the contract item from the
                    selected Contract Catalogue.{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="add_item">
            <Modal
              className="ctmMdl"
              show={this.state.showAddModal}
              onHide={() => this.handleAddModal("")}
              centered
            >
              <Modal.Header>
                <h5>Assign Items</h5>
                <button
                  onClick={() => this.handleAddModal("")}
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Modal.Header>
              <Modal.Body>
                <TabHeading color={"bg-info text-white"}>
                  Search Criteria
                </TabHeading>
                <form>
                  <div classNmae="row">
                    <div className="col-12 col-sm-12">
                      <div className="row mt-2">
                        <div className="col-12 col-md-6">
                          <div className="row">
                            <div className="col-12 col-md-12 pl-0">
                              <label>Item Code: </label>
                            </div>
                            <div className="col-12 col-md-12 pl-0">
                              <input
                                name="strCode"
                                value={this.state.searchList.strCode}
                                onChange={(e) => this.handleAddValues(e)}
                                className="form-control"
                                placeholder=""
                              />
                              <div className="text-danger"></div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="row">
                            <div className="col-12 col-md-12 pl-0">
                              <label>Commodity Type: </label>
                            </div>
                            <div className="col-12 col-md-12 pl-0">
                              <select
                                className="form-control"
                                name="selectedOption"
                                value={this.state.selectedOption.value}
                                onChange={(e) => this.handleSelectChange(e)}
                              >
                                <option value="">--Select--</option>
                                {
                                  this.state.commoditySearchList && this.state.commoditySearchList.map(data =>(
                                    <option value={data.value}>{data.label}</option>
                                  ))
                                }
                              </select>
                              <div className="text-danger"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 col-md-6">
                          <div className="row">
                            <div className="col-12 col-md-12 pl-0">
                              <label>Item Name: </label>
                            </div>
                            <div className="col-12 col-md-12 pl-0">
                              <input
                                name="strName"
                                value={this.state.searchList.strName}
                                onChange={(e) => this.handleAddValues(e)}
                                className="form-control"
                                placeholder=""
                              />
                              <div className="text-danger"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 col-md-6">
                          <div className="row">
                            <div className="col-12 col-md-2 pl-0">
                              <label>Item type: </label>
                            </div>
                            <div className="col-12 col-md-8">
                              <div className="form-check form-check-inline">
                                <input
                                  classNmae="form-check-input"
                                  type="checkbox"
                                  id="check"
                                  name="SP"
                                  checked={this.state.SP}
                                  onChange={(e) => this.handleAddChecks(e)}
                                />
                                <label
                                  className="form-check-label ml-2"
                                  for="inlineRadio2"
                                >
                                  Spot
                                </label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input
                                  classNmae="form-check-input"
                                  type="checkbox"
                                  id="inlineRadio2"
                                  name="ST"
                                  checked={this.state.ST}
                                  onChange={(e) => this.handleAddChecks(e)}
                                />
                                <label
                                  className="form-check-label ml-2"
                                  for="inlineRadio2"
                                >
                                  Stock
                                </label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input
                                  classNmae="form-check-input"
                                  type="checkbox"
                                  id="inlineRadio2"
                                  name="MI"
                                  checked={this.state.MI}
                                  onChange={(e) => this.handleAddChecks(e)}
                                />
                                <label
                                  className="form-check-label ml-2"
                                  for="inlineRadio2"
                                >
                                  MRO
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 col-md-12 mt-2 text-right">
                          <button
                            onClick={() => this.onSearch()}
                            type="button"
                            className="btn btn-sm btn-outline-success"
                          >
                            Search
                          </button>
                          <button
                            type="reset"
                            className="btn btn-sm btn-outline-danger ml-2"
                            onClick={() => this.onClear()}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive check_table">
                    <div className="table-responsive">
                      <div className="col-12 mt-3">
                        {this.state.addList.length > 0 ? (
                          <BootstrapCustomTableNoSearch
                            table_header={_table_header2}
                            table_body={this.state.addList}
                            select={true}
                            selectname={"pr_no"}
                            products={this.getAddProducts}
                            selectall={this.getAddProductsall}
                            responsive={true}
                            click={false}
                            table_name="issue_grn"
                            pagination={true}
                          />
                        ) : null}
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
                        onClick={this.handleAddModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>

          <div className="modify">
            <Modal
              className="ctmMdl"
              show={this.state.showModifyModal}
              onHide={() => this.handleModifyModal("")}
              centered
            >
              <Modal.Header>
                <h5>Modify Items</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => this.handleModifyModal("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Modal.Header>
              <Modal.Body>
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
                            {this.state.products &&
                              this.state.products.map((item, ind) => {
                                return (
                                  <tr>
                                    <td className="align-middle">
                                      {" "}
                                      {item.vendorItemCode}{" "}
                                    </td>
                                    <td className="align-middle">
                                      {item.productDesc}
                                    </td>
                                    <td className="align-middle">{item.uom}</td>
                                    <td className="align-middle">
                                      <select
                                        className="form-control"
                                        value={item.currencyCode}
                                        onChange={(e) =>
                                          this.handleSelectEditTable(
                                            ind,
                                            e.target.value,
                                            "currencyCode"
                                          )
                                        }
                                      >
                                        <option value="">--Select--</option>
                                        {this.state.currencyList &&
                                          this.state.currencyList.map(
                                            (data) => (
                                              <option value={data.CODE_ABBR}>
                                                {data.CODE_DESC}
                                              </option>
                                            )
                                          )}
                                      </select>
                                    </td>
                                    <td className="align-middle">
                                      <input
                                        type="search"
                                        name="unitCost"
                                        value={item.unitCost}
                                        class="form-control"
                                        style={{textAlign: 'right'}}
                                        onChange={(e) =>
                                          this.handleSelectEditTable(ind, e, "")
                                        }
                                        //   placeholder="0.9000"
                                      />
                                    </td>

                                    <td className="align-middle">
                                      <select
                                        class="form-control"
                                        value={item.gstRate}
                                        onChange={(e) =>
                                          this.handleSelectEditTable(
                                            ind,
                                            e.target.value,
                                            "gstRate"
                                          )
                                        }
                                      >
                                        <option value="">--Select--</option>
                                        <option value="ZERO">ZERO(0%)</option>
                                        <option value="ST0">ST(0%)</option>
                                        <option value="ST5">ST(5%)</option>
                                        <option value="ST6">ST(6%)</option>
                                        <option value="ST10">ST(10%)</option>
                                      </select>
                                    </td>
                                    <td className="align-middle">
                                      <select
                                        class="form-control"
                                        value={item.gstTaxCode}
                                        disabled
                                        onChange={(e) =>
                                          this.handleSelectEditTable(
                                            ind,
                                            e.target.value,
                                            "gstTaxCode"
                                          )
                                        }
                                      >
                                        <option value="">--Select--</option>
                                        <option value="ST10">ST10</option>
                                        <option value="TX8">TX8</option>
                                      </select>
                                    </td>
                                    <td className="align-middle">
                                      <textarea
                                        name="remark"
                                        value={item.remark}
                                        onChange={(e) =>
                                          this.handleSelectEditTable(ind, e, "")
                                        }
                                      ></textarea>
                                    </td>
                                  </tr>
                                );
                              })}
                            <tr>
                              <td className="align-middle pl-2" colSpan="8">
                                <p className="pl-2">
                                  {this.state.products.length} record(s) found.{" "}
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
                        onClick={() =>
                          this.handleContractCatAssignItem("update")
                        }
                        className="btn btn-outline-success btn-sm"
                      >
                        Save{" "}
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleModifyModal("")}
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
          </div>
          <Alert
            confirm={this.closemodel}
            title={this.state.alert_title}
            message={this.state.alert_message}
            status={this.state.status}
            show={this.state.show}
          />
          <Alert
            title={this.state.confimation_title}
            confimation={false}
            message={this.state.alert_message}
            status={this.state.status}
            show={this.state.confimation_pop}
            onConfirm={(e) => this.onConfirm()}
            onCancel={this.onCancel}
            showCancel={this.state.showCancel}
          />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  dashboard_listing: state.dashboard_listing.responseList_1,
  loading: state.dashboard_listing.loading,
  fixed_roles: state.fixed_roles.responseList,
});

const mapDispatchToProps = (dispatch) => ({
  GetDashboardList: (values) => dispatch(GetDashboardList(values)),
  GetFixedRoles: (values) => dispatch(GetFixedRoles(values)),
});

const DashboardMasterHolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardMaster);
export default DashboardMasterHolder;
