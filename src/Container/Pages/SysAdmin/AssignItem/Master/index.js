import React,{Component, Fragment} from 'react';
import { Modal } from "react-bootstrap";
import Select from "react-select";
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic';
import Alert from '../../../../../Component/Modal/alert';
import {
    AddSearchResult,
    CommoditySearchResult
} from '../../../../../Apis/SysAdmin';
import {ApiExtract} from '../../../../../Common/GetDatas';
import { GetSearchResult, SaveItemDetailsData } from '../../../../../Actions/SysAdmin';

class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.state = {
            search_result_state: [],
            products:[],
            modal_body : '',
            modal : false,
            status : false,
            rendered: false,
            title:'',
            message:'',
            show_roles:false,
            show:false,
            itemCode: '',
            commodityType: {'label': '', 'value': ''},
            itemName: '',
            spotChecked: false,
            stockChecked: false,
            mroChecked: false,
            showSearchTable: false,
            selectedItem:[],
            openAlert: false,
            alertMessage: 'Please make at least on selection!',
            showCancel: false,
            commoditySearchList: [],
            search_object : {
                "frm":"listing",
                "role" : "",
                "panelName":""
            }
        }
        this.searchClickHandler = this.searchClickHandler.bind(this);
        this.onClearHandle = this.onClearHandle.bind(this);
        this.onRowSelectHandler = this.onRowSelectHandler.bind(this);
        this.onSaveHandle = this.onSaveHandle.bind(this);
    }

    componentDidMount(){
        this.getCommodityTypeList("");
    }

    getCommodityTypeList = async (selectedOption) => {
        console.log("selectedOption", selectedOption);
        let response = await ApiExtract(
          CommoditySearchResult,
          { searchCommodity: selectedOption }
        );

        if (response && response.response) {
            this.setState({
                selectedOption,
                commoditySearchList: response.response.map((item) => {
                  let obj = {};
                  obj.value = item.CT_NAME.split(' ')[0].toLowerCase();
                  obj.label = item.CT_NAME;
                  return obj;
                }),
            });
        }
      };

    searchClickHandler = () => {
        let data = {
            "strCoyId": this.state.commodityType.value,
            "strItemType": "B",
            "strDel": "N"
        };
        this.setState({
            showSearchTable: true,
            loading: true
        });
        this.getSearchResult(data);
    }

    getSearchResult = async (data) =>{
        let response = await ApiExtract(AddSearchResult, data);
        if(response && response.response){
            let tempArray = response.response;
            for(let i= 0; i< response.response.length; i++){
                tempArray[i]={
                ...tempArray[i],
                "STATUS_DESC": 'Active'
                }
            }

            if(this.state.itemName) {
                tempArray = tempArray.filter( ele =>( ele.PM_PRODUCT_DESC.toLowerCase().indexOf(this.state.itemName.toLowerCase()) > -1))
            }

            if(this.state.itemCode) {
                tempArray = tempArray.filter( ele =>( ele.PM_VENDOR_ITEM_CODE.toLowerCase().indexOf(this.state.itemCode.toLowerCase()) > -1))
            }
            this.setState({
                search_result_state: tempArray,
                loading: false
            })
        }
    }

    onClearHandle = () =>{
       this.setState({
        itemCode: '',
        commodityType: {label: '', value: ''},
        itemName: '',
        spotChecked: false,
        stockChecked: false,
        mroChecked: false
       });
    }

    onRowSelectHandler = (row, isSelected, e) => {
        let tempArray = this.state.selectedItem;
        if(isSelected){
            tempArray.push(row);
        } else {
            tempArray = tempArray.filter(function(ele){ return ele !== row; })
        }
        this.setState({
            selectedItem: tempArray
        })
    }

    onSaveHandle = () => {
        let companyID = JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"];
        let itemArray = this.state.selectedItem;
        let data = [];
        if(this.state.selectedItem.length === 0){
            this.setState({
                openAlert:true
            })
            return;
        }

        for(let i= 0; i< itemArray.length; i++){
            data[i]= {
                "cboCatalogueBuyer": this.props.cboCatalogueBuyer,
                "productCode": itemArray[i].PM_PRODUCT_CODE,
                "companyId": companyID,
                "entBy": "sysadmin"
            }
        }
        this.props.SaveItemDetailsData(data);
        setTimeout(()=>{
            this.props.onCloseHandle()
        }, 1000);
    }

    handleConfirmation = () => {
        this.setState({
            openAlert: false
        })
    }

    handleCommodityChange = (selectedOption) => {
        this.setState({ commodityType: selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    render(){

        const _table_header =  [
            {name : "Item Code", id:"PM_VENDOR_ITEM_CODE", key:true, width:'101px'},
            {name : "Item Name", id:"PM_PRODUCT_DESC", key:false, width:'127px'},
            {name : "Commodity Type", id:"CT_NAME", key:false, width:'126px'},
            {name : "UOM", id:"PM_UOM", key:false, width:'60px'},
            {name : "Status", id:"STATUS_DESC", key:false, width:'60px'}
        ];

        let searchList = this.state.search_result_state.sort((a, b) => a.PM_VENDOR_ITEM_CODE.localeCompare(b.PM_VENDOR_ITEM_CODE));
        return <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }

                <div className="show_list">
                    <Modal
                        className="ctmMdl"
                        show={this.props.showAssignItem}
                        onHide={() => this.props.onCloseHandle()}
                        centered
                    >
                        <Modal.Header>
                            <h5>Assign Items</h5>
                            <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={() => this.props.onCloseHandle()}
                            >
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </Modal.Header>
                        <Modal.Body>

                            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                            <form>
                                    <div classNmae="row">
                                        <div className="col-12 col-sm-12">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6">
                                                    <div className="row">
                                                        <div className="col-12 col-md-12 pl-0"><label>Item Code: </label></div>
                                                        <div className="col-12 col-md-12 pl-0">
                                                            <input name="" className="form-control w-75" placeholder=""
                                                                value={this.state.itemCode}
                                                                onChange={(e)=>{
                                                                    this.setState({itemCode: e.target.value})
                                                                }}
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
                                                        className="form-control w-75"
                                                        name="selectedOption"
                                                        value={this.state.commodityType.value}
                                                        onChange={(e) => this.handleCommodityChange(e.target.selectedOptions[0])}
                                                    >
                                                      <option value="">--Select--</option>
                                                      {
                                                        this.state.commoditySearchList.length > 0 && this.state.commoditySearchList.map(data=>(
                                                          <option value={data.value}>
                                                            {data.label}
                                                          </option>
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
                                                        <div className="col-12 col-md-12 pl-0"><label>Item Name: </label></div>
                                                        <div className="col-12 col-md-12 pl-0">
                                                            <input name="" className="form-control  w-75" placeholder=""
                                                                value={this.state.itemName}
                                                                onChange={(e)=>{
                                                                    this.setState({itemName: e.target.value})
                                                                }}
                                                            />
                                                            <div className="text-danger"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-12 col-md-6">
                                                        <div className="row">
                                                            <div className="col-12 col-md-2 pl-0"><label>Item type: </label></div>
                                                            <div className="col-12 col-md-8">
                                                                <div className="form-check form-check-inline">
                                                                    <input classNmae="form-check-input" type="checkbox" name="check1" id="check"
                                                                        value=""
                                                                        checked={this.state.spotChecked}
                                                                        onChange={(e)=>{
                                                                            this.setState({spotChecked: e.target.checked})
                                                                        }}
                                                                    />
                                                                    <label className="form-check-label ml-2" for="inlineRadio2">Spot</label>
                                                                </div>
                                                                <div className="form-check form-check-inline">
                                                                    <input classNmae="form-check-input" type="checkbox" name="check" id="inlineRadio2"
                                                                        value=""
                                                                        checked={this.stockChecked}
                                                                        onChange={(e)=>{
                                                                            this.setState({stockChecked: e.target.checked})
                                                                        }}
                                                                    />
                                                                    <label className="form-check-label ml-2" for="inlineRadio2">Stock</label>
                                                                </div>
                                                                <div className="form-check form-check-inline">
                                                                    <input classNmae="form-check-input" type="checkbox" name="check" id="inlineRadio2"
                                                                        value=""
                                                                        checked={this.state.mroChecked}
                                                                        onChange={(e)=>{
                                                                            this.setState({mroChecked: e.target.checked})
                                                                        }}
                                                                    />
                                                                    <label className="form-check-label ml-2" for="inlineRadio2">MRO</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-12 mt-2 text-right">
                                                <button type="button" className="btn btn-sm btn-outline-success"
                                                onClick={()=>{ this.searchClickHandler() }}
                                                >
                                                Search
                                                </button>
                                                <button type="reset" className="btn btn-sm btn-outline-danger ml-2"
                                                    onClick={()=>{ this.onClearHandle()}}
                                                >Clear</button></div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className='col-12 mt-3'>
                                    {
                                        this.state.showSearchTable ? (
                                            <BootstrapCustomTable
                                                table_header={_table_header}
                                                table_body={searchList}
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
                                </div>
                                <div className="col-12 col-md-6 mt-3 pl-1">
                                        <div className="row mb-3">
                                            <div className="col-12">
                                                <button type="button" className="btn btn-outline-success btn-sm"
                                                    onClick={() => {this.onSaveHandle()}}
                                                    disabled={!this.state.showSearchTable}
                                                >Save</button>
                                                <button type="button" className="btn btn-outline-danger btn-sm ml-2"
                                                    onClick={() => {this.props.onCloseHandle()}}
                                                >Close</button>
                                            </div>
                                        </div>
                                </div>
                        </Modal.Body>
                    </Modal>
                    <Alert
                        title=""
                        message={this.state.alertMessage}
                        status={this.state.status}
                        show={this.state.openAlert}
                        confimation={false}
                        showCancel={this.state.showCancel}
                        confirm={() =>{ this.handleConfirmation() }}
                    />
                    <PageHeading
                        heading=""
                        subheading=""
                    />

                </div>


     </Fragment>
    }
}


const mapStateToProps = state => ({
    loading : state.dashboard_listing.loading,
})

const mapDispatchToProps = dispatch => ({
    GetSearchResult: (values) => dispatch(GetSearchResult(values)),
    SaveItemDetailsData: (values) => dispatch(SaveItemDetailsData(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
