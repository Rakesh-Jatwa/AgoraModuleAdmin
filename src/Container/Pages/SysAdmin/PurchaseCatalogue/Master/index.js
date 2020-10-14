import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader';
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux';
import Alert from '../../../../../Component/Modal/alert';
import { GetDashboardList, GetFixedRoles } from '../../../../../Actions/Eadmin';
import {
  GetPurchaseCateSearchData,
  PurchaserCatalogue,
  PostModifyPurchaseCatalogue,
  PostDeletePurchaseCatalogue
} from '../../../../../Actions/SysAdmin';

import { AddPurchaseCatalogue } from '../../../../../Apis/SysAdmin';
import { ApiExtract } from '../../../../../Common/GetDatas';
import { UserDetails } from '../../../../../Common/LocalStorage';

let Profile_details = UserDetails();

class DashboardListing extends Component {
  constructor(props) {
    super(props);
    this.closeModel = this.closeModel.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.state = {
      products: [],
      purchase_cate_data_state: [],
      new_purchase_cate_data: [],
      modal_body: '',
      modal: false,
      status: false,
      rendered: false,
      showAddSection: false,
      title: '',
      message: '',
      show_roles: false,
      show: false,
      selectedRow: false,
      showModifySection: false,
      selectedRowIndex: 0,
      addItem: '',
      addMofidyItem:'',
      selectedCatalogIndex: 0,
      modifySelectedIndex: -1,
      openAlert: false,
      alertMessage: '',
      showCancel: false,
      isCheckAllChecked: false,
      listBoxLabelValue:'--Select--',
      selectedItem: [],
      showPurchaseCatalogueRequired: false,
      search_object: {
        frm: 'listing',
        role: '',
        panelName: '',
      },
      getData: {
        companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"]
      },
    };
    this.addTextInput = React.createRef();
    this.modifyTextInput = React.createRef();
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleAddSection = this.handleAddSection.bind(this);
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

    console.log('Profile_details111', Profile_details);
    this.handleGetPurchaseData();
  }

  handleGetPurchaseData = async () => {
    let { getData } = this.state;
    if (getData) {
      this.props.GetPurchaseCateSearchData(this.state.getData);
      this.props.PurchaserCatalogue(this.state.getData);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.purchase_cate_data !== this.props.purchase_cate_data){
      let tempArray = this.props.purchase_cate_data;
      for(let i= 0; i< this.props.purchase_cate_data.length; i++){
        tempArray[i]={
          ...tempArray[i],
          isChecked: false
        }
      }
      this.setState({
        purchase_cate_data_state: tempArray
      });
    }

    if (!prevState.showAddSection && this.state.showAddSection) {
        this.addTextInput.current.focus();
    }

    if (!prevState.showModifySection && this.state.showModifySection) {
        this.modifyTextInput.current.focus();
    }
  }

  closeModel(details) {
    this.setState({
      show: false,
    });
  }

  Search = async () => {
    let tempArray =  this.state.purchase_cate_data_state;
    let newTempArray =  this.state.new_purchase_cate_data;
    tempArray.forEach(element => element.isChecked = false );
    newTempArray.forEach(element => element.isChecked = false );
    this.setState({
      purchase_cate_data_state: tempArray,
      new_purchase_cate_data: newTempArray,
      isCheckAllChecked: false
    });
    if(this.state.listBoxLabelValue === '--Select--'){
      this.setState({
        selectedRow: false
      });
    }
  };

  handleSelect = (e) => {
    let _details = e.target.value;
    let tempArray =  this.state.purchase_cate_data_state;
    tempArray.forEach(element => element.isChecked = false );
    if (_details) {
      let _temp_details = this.state.search_object;
      _temp_details.role = _details;
      let getData = this.state.purchase_cate_data_state.filter(
        (data) => data.BCM_GRP_DESC === _details
      );
      getData =[{
        ...getData[0],
        isChecked: false
      }];
      let selectedIndex = this.state.purchase_cate_data_state.findIndex(data => data.BCM_GRP_DESC === _details);
      this.setState({
        new_purchase_cate_data: getData,
        selectedCatalogIndex: selectedIndex,
        selectedRow : true,
        listBoxLabelValue: _details,
        isCheckAllChecked: false,
        purchase_cate_data_state: tempArray,
      });
    } else {
      this.setState({
        selectedRow: false,
        new_purchase_cate_data: [],
        isCheckAllChecked: false,
        purchase_cate_data_state: tempArray
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

  handleAddSection = () => {
    this.setState({
      addItem: '',
      showAddSection: !this.state.showAddSection,
      showModifySection: false,
      showPurchaseCatalogueRequired: false
    });

  };

  handleModifySection = () => {
    let message = '';
    let isPurchaserSelected = false;
    let numberOfPurchaserSelected = 0;
    let tempArray = this.state.selectedRow ? this.state.new_purchase_cate_data :
      this.state.purchase_cate_data_state;
    tempArray.forEach(element => {
      if(element.isChecked){
        isPurchaserSelected = true;
        numberOfPurchaserSelected ++;
      }
    })
    if(!isPurchaserSelected){
      message = 'Please make one selection!';
      this.setState({
        showCancel: false,
        alertMessage: message,
        openAlert: true
      });
    } else if(isPurchaserSelected && numberOfPurchaserSelected > 1){
        message = 'Please choose only one selection!';
        this.setState({
          showCancel: false,
          alertMessage: message,
          openAlert: true
        });
    } else {
      this.setState({
        showAddSection: false,
        showModifySection: !this.state.showModifySection,
      });
    }
  };

  handleModifyCancel = () => {
    this.setState({
      showAddSection: false,
      showModifySection: false,
      showPurchaseCatalogueRequired: false
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSave = () => {
    if(!this.state.addItem){
      this.setState({showPurchaseCatalogueRequired: true});
      return
    }
    let data = {
      companyId: Profile_details.UM_COY_ID.toLowerCase(),
      purchaseCatalogue: this.state.addItem,
      grpCode: '',
      bcmEntBy: Profile_details.UM_USER_ID.toLowerCase(),
      bcmModBy: Profile_details.UM_USER_ID.toLowerCase(),
    };
    let tempObj = {
       BCM_CAT_INDEX: '',
       BCM_GRP_CODE: "",
       BCM_GRP_DESC: this.state.addItem,
       SEQ: 2
     }
    this.setState({
      modifySelectedIndex: -1,
      addMofidyItem: '',
      addItem: '',
      listBoxLabelValue:'--Select--'
    });
    this.addPurchaseCatalogue(data);
  };

  addPurchaseCatalogue = async (data)=>{
    let response = await ApiExtract(AddPurchaseCatalogue, data);
    let message = ''
    if(response && response.status){
      message = 'Record saved.';
      this.handleGetPurchaseData();
    }

    if(response && !response.status){
      message = response.message
    }

    this.setState({
      alertMessage: message,
      showCancel: false,
      openAlert: true,
      showPurchaseCatalogueRequired: false
    });
  }

  handleClear = () => {
    this.setState({
      addItem: '',
      showPurchaseCatalogueRequired: false
    });
  };

  handleReset = () => {
    let tempArray = this.state.selectedRow ? this.state.new_purchase_cate_data :
      this.state.purchase_cate_data_state;
    let selectedCheckBox = tempArray.filter((data) =>
      data.isChecked
    );
    this.setState({
      addMofidyItem: selectedCheckBox[0].BCM_GRP_DESC,
      showPurchaseCatalogueRequired: false
    });
  };

  handleSearchClear = () => {
    this.setState({
      listBoxLabelValue: '--Select--'
    });
  };

  listSelectedCatalogue = (e) => {
    let tempArray = this.state.selectedRow ? this.state.new_purchase_cate_data :
      this.state.purchase_cate_data_state;
    if(e.target.value === 'checkAll'){
      this.setState({isCheckAllChecked: e.target.checked});
      tempArray.forEach(element => element.isChecked = e.target.checked );

    } else {
      this.setState({isCheckAllChecked: false});
      tempArray.forEach(element => {
        if(element.BCM_CAT_INDEX.toString() === e.target.value){
          element.isChecked = e.target.checked
        }
      });
    }
    let selectedCheckBox = tempArray.filter((data) =>
      e.target.value === data.BCM_CAT_INDEX.toString()
    );
    this.setState({
       addMofidyItem: this.state.selectedRow && e.target.checked ? (tempArray[0].BCM_GRP_DESC) :
        ((e.target.value === 'checkAll' || selectedCheckBox.length === 0 || !e.target.checked ) ? '' :
        selectedCheckBox[0].BCM_GRP_DESC),
       modifySelectedIndex: (e.target.value === 'checkAll' || !e.target.checked) ? -1 : e.target.value,
       selectedItem: tempArray.filter( ele =>( ele.isChecked))
     });
     if(this.state.selectedRow) {
      this.setState({
        new_purchase_cate_data: tempArray
      });
     } else {
      this.setState({
        purchase_cate_data_state : tempArray
      });
     }
  };

  handleModifyChange = (e) => {
    this.setState({
      addMofidyItem: e.target.value
    })
  }

  handleModifySave =(e) => {
    if(!this.state.addMofidyItem){
      this.setState({showPurchaseCatalogueRequired: true});
      return
    }
    let modifyData = {
      purchaserCatalogueId: this.state.modifySelectedIndex,
      companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
      purchaseCatalogue: this.state.addMofidyItem,
      grpCode: "",
      bcmModBy: 'sysAdmin'
    }

    this.setState({
      modifySelectedIndex: -1,
      addMofidyItem: '',
      showModifySection: !this.state.showModifySection,
      showPurchaseCatalogueRequired: false
    });
    this.props.PostModifyPurchaseCatalogue(modifyData);
  }

  handleDeleteSection = () => {
    let message = '';
    if(this.state.selectedItem.length > 0){
      message = 'Are you sure that you want to permanently delete this item(s)?';
      this.setState({ showCancel: true});
    } else {
      message = 'Please make at least on selection!';
      this.setState({ showCancel: false});
    }

    this.setState({
      alertMessage: message,
      openAlert: true
    });
  };

  onCancel = () => {
    this.setState({
      openAlert: false,
      addMofidyItem:''
    });
  };

  handleConfirmation = () => {
    let selectedPurchaser = this.state.selectedItem;
    let selectedData = [];
    for(let i=0, j=0; i<selectedPurchaser.length; i++) {
        selectedData[j] = selectedPurchaser[i].BCM_CAT_INDEX;
        j++;
    }
    let data = {
      purchaserCatalogueId: selectedData
    };
    this.setState({
      openAlert: false,
      modifySelectedIndex: -1,
      addMofidyItem:''
    });
    if(this.state.selectedItem.length > 0 && this.state.showCancel){
      this.props.PostDeletePurchaseCatalogue(data);
    }
  }

  onSort(event){
    const data = this.state.data;
    data.sort((a,b) => a[''].localeCompare(b['']))
    this.setState({data})
  }

  render() {

    const purchaseData = this.state.purchase_cate_data_state;
    console.log('products', this.props.purchase_cate_data );
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
            message={this.state.alertMessage}
            status={this.state.status}
            show={this.state.openAlert}
            confimation={false}
            showCancel={this.state.showCancel}
            onCancel={() =>{this.onCancel()}}
            confirm={() =>{ this.handleConfirmation() }}/>
        <div className="show_list">
        <PageHeading
            heading=""
            subheading="=> Step 1: Create user defined Purchase Catalogue."
          />
          <PageHeading
            heading=""
            subheading="Step 2: Assign item master to Purchaser Catalogue."
          />
          <PageHeading
            heading=""
            subheading="Step 3: Assign purchaser to Purchaser Catalogue."
          />
          <PageHeading
            heading=""
            subheading="Note: A Purchaser Catalogue consists of item lists that are assigned to the purchaser. Purchaser can only place PO on these allocated items."
          />
          <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="row">
                <div className="col-12 col-md-3">
                  <label>Purchaser Catalogue: </label>
                </div>
                <div className="col-12 col-md-5">
                  <select
                    className="form-control"
                    value={this.state.listBoxLabelValue}
                    onChange={(e) => this.handleSelect(e)}
                  >
                    <option value="">--Select--</option>
                    {purchaseData.map((data, index) => (
                      <option value={data.BCM_GRP_DESC} key={index}>
                        {data.BCM_GRP_DESC}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>
          <div className="row mb-4">
                  <div className="col-12 col-md-12 text-right">
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={() => this.Search()}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ml-2"
                      onClick={() =>{ this.handleSearchClear()}}
                    >
                      Clear
                    </button>
                  </div>

            </div>

          {
            this.state.showAddSection ? (
            <>
              {' '}
              <TabHeading color={'bg-info text-white'}>
                Please add the following value
              </TabHeading>
              <div className="row">
                <div className="col-12 col-md-12">
                  <div className="row">
                    <div className="col-12 col-md-3 ">
                      <label>
                          Purchaser Catalogue
                          <span class="text-danger">*</span>
                          :
                        </label>
                    </div>
                    <div className="col-12 col-md-5">
                      <input
                        className="form-control"
                        name="addItem"
                        value={this.state.addItem}
                        ref={this.addTextInput}
                        onChange={(e) => {this.handleChange(e)}}
                      />
                    </div>
                  </div>
                </div>

              </div>
                  <div className="row mb-4">
                    <div className="col-12 text-right">
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() =>{this.handleSave()}}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm ml-2"
                        onClick={() =>{this.handleClear()}}
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm ml-2"
                        onClick={this.handleAddSection}
                      >
                        Cancel
                      </button>
                    </div>
                </div>
            </>
          ) : null
          }
          {
            this.state.showModifySection ?
            (
              <>
                {' '}
                <TabHeading color={'bg-info text-white'}>
                  Please modify the following value
                </TabHeading>
                <div className="row">
                  <div className="col-12 col-md-12">
                    <div className="row">
                      <div className="col-12 col-md-3 ">
                        <label>
                          Purchaser Catalogue
                          <span class="text-danger">*</span>
                          :
                        </label>

                      </div>
                      <div className="col-12 col-md-5">
                        <input
                          className="form-control"
                          name="addItem"
                          value={this.state.addMofidyItem}
                          onChange={(e) => {this.handleModifyChange(e)}}
                          ref={this.modifyTextInput}
                        />
                      </div>
                    </div>
                  </div>

                </div>
                    <div className="row mb-4 mt-3">
                      <div className="col-12 text-right">
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={() =>{this.handleModifySave()}}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm ml-2"
                          onClick={() =>{this.handleReset()}}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm ml-2"
                          onClick={() => {this.handleModifyCancel()}}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
              </>
            ) : null
          }
          {
            this.state.showAddSection || this.state.showModifySection ?
            <div class="row mt-0 mb-3">
              <div class="col-12 col-md-6">
                <p>
                  <span class="text-danger">*</span>
                    indicates required field
                </p>
              </div>
            </div> : null
          }
          {
            this.state.showPurchaseCatalogueRequired ?
            <div class="row mt-0 mb-3">
              <div class="col-12 col-md-6">
                <span class="text-danger" style={{cursor: 'default'}}>Purchaser Catalogue is required.</span>
              </div>
            </div> : null
          }
          <div className="table-responsive check_table">
            <table className="table table-striped table-hover table-bordered">
              <thead className="thead-primary">
                <th>
                  <input
                    type="checkbox"
                    value="checkAll"
                    checked={this.state.isCheckAllChecked}
                    onChange={(e) => {this.listSelectedCatalogue(e)}}
                  />
                </th>
                <th onClick={e => this.onSort(e)}>
                Purchaser Catalogue
                <i class="fa fa-caret-up" for="sort"></i>
                </th>
                <th>Purchaser</th>
              </thead>
              <tbody>
                {
                this.state.selectedRow ?
                  this.state.new_purchase_cate_data &&
                    this.state.new_purchase_cate_data.map((data, index) => (
                      <tr key={index}>
                        <td className="align-middle">
                          <input
                            type="checkbox"
                            value={data.BCM_CAT_INDEX}
                            checked={data.isChecked}
                            onChange={(e) => {this.listSelectedCatalogue(e)}}
                          />
                        </td>
                        <td className="align-middle">{data.BCM_GRP_DESC}</td>
                        <td className="align-middle">
                          {
                            this.props.purchaser_catalogue_data && this.props.purchaser_catalogue_data.length > 0 ?
                            (
                              this.props.purchaser_catalogue_data[this.state.selectedCatalogIndex].purchaserList ?
                                this.props.purchaser_catalogue_data[this.state.selectedCatalogIndex].purchaserList.map( (data, key) =>
                                  <div key={key}>{data.UM_USER_NAME}</div>
                              ) : <div key>-</div>
                            ): null
                          }
                        </td>
                      </tr>
                    )) :
                    purchaseData.length > 0 && purchaseData.map( (data, index) => (
                      <tr key={index}>
                        <td className="align-middle">
                          <input type="checkbox"
                           value={data.BCM_CAT_INDEX}
                           checked={data.isChecked}
                           onChange={(e) => {this.listSelectedCatalogue(e)}}/>
                        </td>
                        <td className="align-middle">{data.BCM_GRP_DESC}</td>
                        <td className="align-middle">
                          {
                            this.props.purchaser_catalogue_data && this.props.purchaser_catalogue_data.length > 0 ?
                            (
                              this.props.purchaser_catalogue_data[index] &&
                              this.props.purchaser_catalogue_data[index].purchaserList ?
                              this.props.purchaser_catalogue_data[index].purchaserList.map( (data, key) =>
                              <div key={key}>{data.UM_USER_NAME}</div>
                              ) : <div>-</div>
                            ): null
                          }
                        </td>
                      </tr>
                    ))
                  }
                <tr>
                  <td className="align-middle pl-2" colSpan="3">
                    <p className="pl-2">
                      {
                      this.state.selectedRow ?
                        this.state.new_purchase_cate_data.length :
                        this.state.purchase_cate_data_state.length
                        } record(s) found. <span>1 page(s) found.</span>
                    </p>
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
                  onClick={() =>{this.handleAddSection()}}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm ml-2"
                  onClick={() => {this.handleModifySection()}}
                >
                  Modify
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm ml-2"
                  onClick={() => {this.handleDeleteSection()}}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 pl-3">
            <div className="row mb-2">
            <div>
                <ul className="pl-1 ml-0 list_style">
                  <li>
                    a) Default Purchaser Catalogue contains all item master that is
                    added to the system. The Default Purchaser Catalogue cannot
                    be deleted or modified
                  </li>
                  <li>b) Click Add button to add new Purchaser Catalogue</li>
                  <li>
                    c) Click Modify button to modify the user created Purchaser
                    Catalogue (Not applicable to Default Purchaser Catalogue)
                  </li>
                  <li>
                    d) Click Delete button to delete the user created Purchaser
                    Catalogue (Not applicable to Default Purchaser Catalogue)
                  </li>
                  <li>
                    e) To view item(s) assigned to the Purchaser Catalogue, click
                    'Item Assignment' Tab
                  </li>
                  <li>
                    {' '}
                    f) To view Purchaser(s) assigned to the Purchaser Catalogue,
                    click 'Purchaser Assignment' Tab
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
  purchaser_catalogue_data: state.purchaser_catalogue_data.responseList
});

const mapDispatchToProps = (dispatch) => ({
  GetDashboardList: (values) => dispatch(GetDashboardList(values)),
  GetFixedRoles: (values) => dispatch(GetFixedRoles(values)),
  // UserlistReducer: (values) => dispatch(UserlistReducer(values)),
  GetPurchaseCateSearchData: (values) => dispatch(GetPurchaseCateSearchData(values)),
  PurchaserCatalogue: (values) => dispatch(PurchaserCatalogue(values)),
  PostModifyPurchaseCatalogue: (values) => dispatch(PostModifyPurchaseCatalogue(values)),
  PostDeletePurchaseCatalogue: (values) => dispatch(PostDeletePurchaseCatalogue(values)),
  //   GetCancelledPRListingSearch : (values) => dispatch(GetCancelledPRListingSearch(values)),
});

const DashboardListingHolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardListing);
export default DashboardListingHolder;
