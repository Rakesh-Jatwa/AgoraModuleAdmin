import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader';
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux';
import Alert from '../../../../../Component/Modal/alert';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic';
import { GetDashboardList, GetFixedRoles } from '../../../../../Actions/Eadmin';
import {
  GetPurchaseCateSearchData,
  GetPurchaserCatalogueData,
  DeleteItemPurchaseCatalogue
} from '../../../../../Actions/SysAdmin';
import AssignItem from '../../AssignItem';

class ItemAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchase_cate_data_state: [],
      new_purchase_cate_data: [],
      get_purchase_cate_data_state: [],
      modal_body: '',
      modal: false,
      status: false,
      rendered: false,
      title: '',
      message: '',
      show_roles: false,
      show: false,
      showListing: false,
      showAssignItem: false,
      selectedPurchaser: -1,
      optionsState:'',
      openAlert: false,
      showCancel: false,
      alertMessage:'',
      getData: {
        companyId: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"]
      },
    };

    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    this.props.GetFixedRoles();
    this.handleGetPurchaseData();
  }

  handleGetPurchaseData = async () => {
    let { getData } = this.state;
    if (getData) {
      this.props.GetPurchaseCateSearchData(this.state.getData);
    }
  };

  componentDidUpdate(prevProps) {
    if(prevProps.purchase_cate_data !== this.props.purchase_cate_data){
      this.setState({
        purchase_cate_data_state: this.props.purchase_cate_data
      })
    }

    if(prevProps.get_purchase_cate_data !== this.props.get_purchase_cate_data){
      let tempArray = this.props.get_purchase_cate_data;
      for(let i= 0; i< this.props.get_purchase_cate_data.length; i++){
        tempArray[i]={
          ...tempArray[i],
          isChecked: false
        }
      }
      this.setState({
        get_purchase_cate_data_state: tempArray
      });
    }
  }

  handleSelect = (e) => {
    let _details = e.target.value;
    if (_details) {
      let selectedOptionDetails = this.props.purchase_cate_data.filter( data =>
        data.BCM_GRP_DESC === _details
      )

      this.setState({
        show_roles: true,
        rendered: false,
        showListing: true,
        selectedPurchaser: selectedOptionDetails[0].BCM_CAT_INDEX,
        optionsState:selectedOptionDetails[0].BCM_GRP_DESC
      });
      this.props.GetPurchaserCatalogueData(selectedOptionDetails[0].BCM_CAT_INDEX);
    } else {
      this.setState({
        showListing: false,
        optionsState:''
      });
    }
  };

  addItem = () => {
    this.setState({
      showAssignItem: true
    })
  };

  onCloseHandle = () => {
    this.setState({
      showAssignItem: false
    });
    this.props.GetPurchaserCatalogueData(this.state.selectedPurchaser);
  }

  onRowSelectHandler = (row, isSelected, e) => {
      let tempArray = this.state.new_purchase_cate_data;
      if(isSelected){
          tempArray.push(row);
      } else {
          tempArray = tempArray.filter(function(ele){ return ele !== row; })
      }
      this.setState({
          new_purchase_cate_data: tempArray
      })
  }

  removeItem =() => {
    let message = '';
    if(this.state.new_purchase_cate_data.length > 0 ){
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
  }

  onCancel = () => {
    this.setState({
      openAlert: false,
      addMofidyItem:''
    });
  };

  handleConfirmation = () => {
    let selectedPurchaser = this.state.new_purchase_cate_data;
    let selectedData = [];
    for(let i=0, j=0; i<selectedPurchaser.length; i++) {
        selectedData[j] = selectedPurchaser[i].BCI_ITEM_INDEX;
        j++;
    }
    let data = {
      "indexes": selectedData
    };
    this.setState({
      openAlert: false,
    });

    if(selectedData.length > 0 && this.state.showCancel){
      this.props.DeleteItemPurchaseCatalogue(data, this.state.selectedPurchaser);
    }
  }

  render() {
    const _table_header =  [
        {name : "Item Code", id:"PM_VENDOR_ITEM_CODE", key:true, width:'101px'},
        {name : "Item Name", id:"PM_PRODUCT_DESC", key:false, width:'127px'},
        {name : "Commodity Type", id:"CT_NAME", key:false, width:'126px'},
        {name : "UOM", id:"PM_UOM", key:false, width:'60px'},
    ];
    this.getPurchaseCateData = this.state.get_purchase_cate_data_state;
    console.log('getPurchaseCateData',  this.getPurchaseCateData);
    return (
      <div>
        {
          this.state.showAssignItem ?
            <AssignItem
              showAssignItem = {this.state.showAssignItem}
              onCloseHandle={this.onCloseHandle}
              cboCatalogueBuyer = {this.state.selectedPurchaser }
            /> :(
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
                subheading="Step 1: Create user defined Purchase Catalogue."
              />
              <PageHeading
                heading=""
                subheading="=> Step 2: Assign item master to Purchaser Catalogue."
              />
              <PageHeading
                heading=""
                subheading="Step 3: Assign purchaser to Purchaser Catalogue."
              />
              <PageHeading subheading="The system comes with the Default Purchaser Catalogue which can be immediately assigned to the Purchaser." />
              <PageHeading subheading="Note: Default Purchaser Catalogue consists of all items in the Item Master that have been created in the system. " />
              <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
              <div className="row">
                <div className="col-12 col-md-12 mb-3">
                  <div className="row">
                    <div className="col-12 col-md-3 ">
                      <label>Purchaser Catalogue: </label>
                    </div>
                    <div className="col-12 col-md-5">
                      <select className="form-control"
                        value={this.state.optionsState}
                        onChange={(e) =>{this.handleSelect(e)}}
                      >
                        <option value="">--Select--</option>
                        {
                          this.state.purchase_cate_data_state &&
                            this.state.purchase_cate_data_state.map((data, index) => (
                              <option value={data.BCM_GRP_DESC} key={index}>
                                {data.BCM_GRP_DESC}
                              </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {
              this.state.showListing && this.getPurchaseCateData
              && this.getPurchaseCateData.length > 0 ? (
                <BootstrapCustomTable
                    table_header={_table_header}
                    table_body={this.getPurchaseCateData}
                    select={true}
                    selectname={'pr_no'}
                    responsive={true}
                    click={false}
                    table_name="issue_grn"
                    pagination={true}
                    products={this.onRowSelectHandler}
                />
              ) : null
              }
              {
                this.state.showListing ? (
                <div>
                  <div className="col-12 col-md-6 mt-3 pl-1">
                    <div className="row mb-3">
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={() => this.addItem()}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm ml-2"
                          disabled={this.getPurchaseCateData.length === 0}
                          onClick={() => this.removeItem()}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 pl-3">
                  <div className="row mb-2">
                    <div>
                      <ul className="pl-1 ml-0 list_style">
                        <li>
                          a) Click Add button to add new item master to the selected user
                          defined Purchaser Catalogue (Not applicable to Default
                          Purchaser Catalogue).
                        </li>
                        <li>
                          b) Click Remove button to delete item master from the selected
                          user defined Purchaser Catalogue (Not applicable to Default
                          Purchaser Catalogue).{' '}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
                ) : null
              }
            </div>
          </Fragment>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dashboard_listing: state.dashboard_listing.responseList_1,
  loading: state.dashboard_listing.loading,
  fixed_roles: state.fixed_roles.responseList,
  purchase_cate_data: state.purchase_cate_data.responseList,
  get_purchase_cate_data: state.get_purchase_cate_data.responseList
});

const mapDispatchToProps = (dispatch) => ({
  GetDashboardList: (values) => dispatch(GetDashboardList(values)),
  GetFixedRoles: (values) => dispatch(GetFixedRoles(values)),
  GetPurchaseCateSearchData: (values) => dispatch(GetPurchaseCateSearchData(values)),
  GetPurchaserCatalogueData: (values) => dispatch(GetPurchaserCatalogueData(values)),
  DeleteItemPurchaseCatalogue: (values, selectedPurchaser) => dispatch(DeleteItemPurchaseCatalogue(values, selectedPurchaser)),
});

const DashboardMasterHolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemAssignment);
export default DashboardMasterHolder;
