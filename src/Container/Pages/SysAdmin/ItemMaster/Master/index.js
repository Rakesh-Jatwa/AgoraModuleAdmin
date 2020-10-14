import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic';
import Alert from '../../../../../Component/Modal/alert';
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin';
import { GetSearchResult } from '../../../../../Actions/SysAdmin';
import {DashboardList} from '../../../../../Apis/Eadmin';
import {ApiExtract} from '../../../../../Common/GetDatas';

class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.state = {
            products:[],
            modal_body : '',
            modal : false,
            status : false,
            modal : false,
            rendered: false,
            title:'',
            message:'',
            show_roles:false,
            status:false,
            show:false,
            itemCode: '',
            comodityType: '',
            itemName: '',
            spotChecked: false,
            stockChecked: false,
            mroChecked: false,
            showSearchTable: false,
            selectedItem:[],
            search_object : {
                "frm":"listing",
                "role" : "",
                "panelName":""
            }
        }
        this.searchClickHandler = this.searchClickHandler.bind(this);
        this.onClearHandle = this.onClearHandle.bind(this);
        this.onRowSelectHandler = this.onRowSelectHandler.bind(this);
    }

    static getDerivedStateFromProps(props,state){
        if(props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList){
            return {
                products:props.dashboard_listing.responseList,
                rendered:true ,
            }
        }
    }

    componentDidMount(){
        this.props.GetDashboardList(this.state.search_object)
        this.props.GetFixedRoles()
    }

    closeModel (details){
        this.setState({
            show : false,
        })
    }

    Search = async() =>{
        let {search_object} = this.state;
        if(search_object){
            this.props.GetDashboardList(this.state.search_object)
        }

    }

    handleSelect = (e) =>{
        let _details = e.target.value;
        if(_details){
            let _temp_details = this.state.search_object
            _temp_details.role = _details
        }
    }

    handleInput = (e) =>{
        let _details = e.target.value;
        if(_details){
            let _temp_details = this.state.search_object
            _temp_details.panelName = _details
        }
    }

    get_details = (row) =>{
         this.props.change_tab('Matrix',row.DM_FIXED_ROLE_ID)
    }

    searchClickHandler = () => {
        let data = {
            "strCoyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "strItemType": "B",
            "strDel": "N"
        };
        this.setState({
            showSearchTable: true
        });
        this.props.GetSearchResult(data);
    }

    onClearHandle = () =>{
       this.setState({
        itemCode: '',
        comodityType: '',
        itemName: '',
        spotChecked: false,
        stockChecked: false,
        mroChecked: false
       });
    }

    onRowSelectHandler = (row, isSelected, e) => {
        let tempArray = this.state.selectedItem;
        debugger;
        if(isSelected){
            tempArray.push(row);
        } else {
            tempArray = tempArray.filter(function(ele){ return ele !== row; })
        }
        this.setState({
            selectedItem: tempArray
        })
    }
    render(){

        const _table_header =  [
            {name : "Item Code", id:"PM_VENDOR_ITEM_CODE", key:true, width:'101px'},
            {name : "Item Name", id:"PM_PRODUCT_DESC", key:false, width:'127px'},
            {name : "Commodity Type", id:"CT_NAME", key:false, width:'126px'},
            {name : "UOM", id:"PM_UOM", key:false, width:'60px'},
            {name : "Status", id:"STATUS_DESC", key:false, width:'60px'}
        ];

       let searchList = this.props.search_result.sort((a, b) => a.PM_VENDOR_ITEM_CODE.localeCompare(b.PM_VENDOR_ITEM_CODE));

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }

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
                                        <div className="row">
                                            <div className="col-12 col-md-2 pl-0"><label>Item Code: </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" className="form-control" placeholder=""
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
                                            <div className="col-12 col-md-3 pl-0"><label>Commodity Type: </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" className="form-control" placeholder=""
                                                    value={this.state.comodityType}
                                                    onChange={(e)=>{
                                                        this.setState({comodityType: e.target.value})
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
                                            <div className="col-12 col-md-2 pl-0"><label>Item Name: </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" className="form-control" placeholder=""
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
                                                                this.onSpotChange({spotChecked: e.target.checked})
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
                                    <button type="submit" className="btn btn-sm btn-outline-success"
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
                    <div className='col-12'>
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
                                    <button type="button" className="btn btn-outline-success btn-sm">Add</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2"
                                        onClick={() => {this.props.onCloseHandle()}}
                                    >Close</button>
                                </div>
                            </div>
                        </div>
                </div>


     </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing : state.dashboard_listing.responseList_2,
    loading : state.dashboard_listing.loading,
    fixed_roles : state.fixed_roles.responseList,
    search_result: state.search_result.responseList
})

const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles  : (values) => dispatch(GetFixedRoles(values)),
    GetSearchResult: (values) => dispatch(GetSearchResult(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
