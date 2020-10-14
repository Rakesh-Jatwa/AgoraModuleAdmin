import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader';
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux';
import Alert from '../../../../../Component/Modal/alert';
import { GetDashboardList, GetFixedRoles } from '../../../../../Actions/Eadmin';
import{ PurchaserAssignmentData, SaveItemOfPurchaser } from '../../../../../Actions/SysAdmin';

class DashboardListing extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.state = {
      products: [],
      available_purchaser_assignment_data: [],
      selected_purchaser_assignment_data: [], 
      modal_body: '',
      modal: false,
      status: false,
      rendered: false,
      title: '',
      message: '',
      show_roles: false,
      show: false,
      selectedItemToAssign: [],
      selectedItemToRemove: [],
      cboCatalogueBuyer: -1,
      saveButtonDisable: true,
      resetButtonDisable: true,
      search_object: {
        frm: 'listing',
        role: '',
        panelName: '',
      },
    };
    this.handleAvailablePurchaserSelect = this.handleAvailablePurchaserSelect.bind(this);
    this.handleSelectedPurchaserSelect = this.handleSelectedPurchaserSelect.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onAssignClick = this.onAssignClick.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
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
  }

  componentDidUpdate(prevProps) {
    if(prevProps.purchaser_assignment_data !== this.props.purchaser_assignment_data){
      this.setState({
        available_purchaser_assignment_data: this.props.purchaser_assignment_data.availablePurchasers,
        selected_purchaser_assignment_data: this.props.purchaser_assignment_data.selectedPurchasers
      });
    }
  }

  closeModal(details) {
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
      let data = {
        "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
        "cboCatalogueBuyer": parseInt(_details, 10)
      };
      this.setState({
        cboCatalogueBuyer: parseInt(_details, 10),
        saveButtonDisable: false
      });
      this.props.PurchaserAssignmentData(data);
    } else {
      this.setState({
        resetButtonDisable: true,
      });

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
    this.props.change_tab('Matrix', row.DM_FIXED_ROLE_ID);
  };

  handleAvailablePurchaserSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = this.state.available_purchaser_assignment_data.findIndex(ele =>
        ele.UM_USER_ID ===  selectedOptions[i].value
      );
      tempArray.push(this.state.available_purchaser_assignment_data[itemIndex]);
    }
    this.setState({
      selectedItemToAssign: tempArray
    });
  };

  handleSelectedPurchaserSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = this.state.selected_purchaser_assignment_data.findIndex(ele =>
        ele.UM_USER_ID ===  selectedOptions[i].value
      );
      tempArray.push(this.state.selected_purchaser_assignment_data[itemIndex]);
    }
    this.setState({
      selectedItemToRemove: tempArray
    });
  };

  onResetClick = () => {
    this.setState({
      available_purchaser_assignment_data: this.props.purchaser_assignment_data.availablePurchasers,
      selected_purchaser_assignment_data: this.props.purchaser_assignment_data.selectedPurchasers,
      selectedItemToAssign: [],
      selectedItemToRemove: []
    })
  };

  onAssignClick = () => {
    let tempArray = this.state.available_purchaser_assignment_data;
    tempArray = tempArray.filter(e => !this.state.selectedItemToAssign.includes(e));
    this.setState({
      selected_purchaser_assignment_data: this.state.selected_purchaser_assignment_data.concat(this.state.selectedItemToAssign),
      available_purchaser_assignment_data: tempArray,
      selectedItemToAssign: [],
      resetButtonDisable: false,
    })
  };

  onRemoveClick = () => {
    let selectedTempArray = this.state.selected_purchaser_assignment_data;
    selectedTempArray = selectedTempArray.filter(e => !this.state.selectedItemToRemove.includes(e))
    let availableTempArray = this.state.available_purchaser_assignment_data.concat(this.state.selectedItemToRemove);
    this.setState({
      available_purchaser_assignment_data: availableTempArray,
      selected_purchaser_assignment_data: selectedTempArray,
      selectedItemToRemove: [],
      resetButtonDisable: false,
    })
  };

  onSaveClick = () => {
    let tempArray = [];
    this.state.selected_purchaser_assignment_data.forEach( ele => {
      tempArray.push(ele.UM_USER_ID);
    });
    let data = {
      "cboCatalogueBuyer": this.state.cboCatalogueBuyer,
      "purchasers": tempArray
    };
    this.props.SaveItemOfPurchaser(data);
    this.setState({show: true});
  };

  render() {

    return (
      <Fragment>
        {this.props.loading ? <Loader /> : ''}
        {this.props.dashboard_listing &&
        this.props.dashboard_listing.loading ? (
          <Loader />
        ) : (
          ''
        )}
        {this.state.loading ? <Loader /> : ''}
        <Alert
            title=""
            message={'Record Saved'}
            status={this.state.status}
            show={this.state.show}
            confimation={false}
            showCancel={false}
            confirm={() =>{ this.closeModal() }}/>
        <div className="show_list">
          <PageHeading
            heading=""
            subheading="Step 1: Create user defined Purchase Catalogue."
          />
          <PageHeading subheading="Step 2: Assign item master to Purchaser Catalogue." />
          <PageHeading subheading="=> Step 3: Assign purchaser to Purchaser Catalogue." />
          <PageHeading subheading="Note: Please select Purchaser Catalogue." />
          <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="row mb-3">
                <div className="col-12 col-md-3 ">
                  <label>Purchaser Catalogue: </label>
                </div>
                <div className="col-12 col-md-5">
                  <select
                    className="form-control"
                    onChange={(e) => this.handleSelect(e)}
                  >
                    <option value="">--Select--</option>
                    {
                      this.props.purchase_cate_data &&
                        this.props.purchase_cate_data.map((data, index) => (
                          <option value={data.BCM_CAT_INDEX} key={index}>
                            {data.BCM_GRP_DESC}
                          </option>
                      ))
                    }
                  </select>
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
              <tbody>
                <tr>
                  <td className="align-middle">
                    {
                      this.state.available_purchaser_assignment_data && this.state.available_purchaser_assignment_data.length > 0 ?(
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
                          this.state.available_purchaser_assignment_data.map((data, index) => (
                            <option key={index} value={data.UM_USER_ID}>{data.three}</option>
                          ))
                        }
                      </select>
                    )
                      :
                        <textarea></textarea>
                  }
                  </td>
                  <td className="align-middle text-center btn_md">
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={()=>{this.onAssignClick()}}
                      >
                        Assign
                      </button>
                      <br />
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={()=>{this.onRemoveClick()}}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                  <td className="align-middle">
                  {
                      this.state.selected_purchaser_assignment_data && this.state.selected_purchaser_assignment_data.length > 0 ?(
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
                          this.state.selected_purchaser_assignment_data.map((data, index) => (
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
            </table>
          </div>
          <div className="col-12 col-md-6 mt-3 pl-1">
            <div className="row mb-3">
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={()=>{this.onSaveClick()}}
                  disabled={this.state.saveButtonDisable}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm ml-2"
                  onClick={()=>{this.onResetClick()}}
                  disabled={this.state.resetButtonDisable}
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
                    a) To assign Purchasers to the Purchaser Catalogue, choose the
                    name from 'Available Purchasers' and click Assign button.
                  </li>
                  <li>
                    {' '}
                    b) To remove/unassigned purchaser from the Purchaser Catalogue,
                    choose the 'Selected Purchasers' and click Remove button.{' '}
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
  fixed_roles: state.fixed_roles.responseList,
  purchase_cate_data: state.purchase_cate_data.responseList,
  purchaser_assignment_data: state.purchaser_assignment_data.responseList
});

const mapDispatchToProps = (dispatch) => ({
  GetDashboardList: (values) => dispatch(GetDashboardList(values)),
  GetFixedRoles: (values) => dispatch(GetFixedRoles(values)),
  PurchaserAssignmentData: (values) => dispatch(PurchaserAssignmentData(values)),
  SaveItemOfPurchaser: (values) => dispatch(SaveItemOfPurchaser(values))
});

const DashboardListingHolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardListing);
export default DashboardListingHolder;
