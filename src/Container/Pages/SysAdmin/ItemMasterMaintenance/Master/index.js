import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux'
import BootstrapCustomTableForTwentyRow from '../../../../../Component/Table/BootstrapCustomTableForTwentyRow'
import Alert from '../../../../../Component/Modal/alert'
import { GetDashboardList, GetFixedRoles } from '../../../../../Actions/Eadmin'
import { GetSearchResult } from '../../../../../Actions/SysAdmin'
//import { DashboardList, } from '../../../../../Apis/Eadmin'
import {FormDatePicker,FromSelectParallel, FromInputsParallel} from '../../../../../Component/From/FromInputs'
import { AddSearchResult ,ActivateDeactivateAdd } from '../../../../../Apis/SysAdmin'
import { ApiExtract } from '../../../../../Common/GetDatas'
import {Field, reduxForm, reset } from 'redux-form';
import Pagination from '../../../../../Component/Pagination'
import ItemTableRow from './component/ItemTableRow'
import ConfirmationModel from '../../../../../Component/Modal/ConfirmationModel';



class DashboardListing extends Component {
    constructor(props) {
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.getProducts = this.getProducts.bind(this)

        this.state = {
            products: [],
            search_result:[],
            modal_body: '',
            modal: false,
            status: false,
            modal: false,
            rendered: false,
            title: '',
            message: '',
            show_roles: false,
            shouldShow: false,
            status: false,
            show: false,
            search_object: {
                "strCoyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
                "strItemType": "B",
                "strBCItemIdx": "",
                "strCode": "",
                "strName": "",
                "strComType": "",
                "strDel": "N",
                "pItemType": ""
            },
            modify_details : {},
            confimation:false ,
            confimation_pop:false ,
            confimation_type : ''
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList) {
            return {
                itemList: props.dashboard_listing.responseList,
                rendered: true,
            }
        }
    }

    componentDidMount() {
        this.props.GetDashboardList(this.state.search_object)
        this.props.GetFixedRoles()
    }

    componentDidUpdate() {
    }

    closeModel(details) {
        this.setState({
            show: false,
        })
    }

    Search = async () => {
        let { search_object } = this.state;
        if (search_object) {
            this.props.GetDashboardList(this.state.search_object)
        }

    }

    handleSelect = (e) => {
        let _details = e.target.value;
        if (_details) {
            let _temp_details = this.state.search_object
            _temp_details.role = _details
        }
    }

    handleInput = (e) => {
        let _details = e.target.value;
        if (_details) {
            let _temp_details = this.state.search_object
            _temp_details.panelName = _details
        }
    }

    get_details = (row) => {
        this.props.change_tab('Matrix', row.DM_FIXED_ROLE_ID)
    }

    addButtonHandler = () => {
        this.props.history.push('/item_master.');
    }

    searchButtonHandler = async () => {
        await this.props.GetSearchResult({
            "strCoyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "strItemType": "B",
            "strBCItemIdx": "",
            "strCode": "",
            "strName": "",
            "strComType": "",
            "strDel": "N",
            "pItemType": ""
        })
    }

    handlefromsubmit= async(values={}) =>{
        let {search_object,strCode,strName,strComType} = this.state;
        search_object['strCode']= strCode ? strCode : '';
        search_object['strName']= strName ? strName : '';
        search_object['strComType']= strComType ? strComType : '';
       // let _values  = Object.assign({},search_object, values)
        if(search_object){
            let response = await ApiExtract(AddSearchResult, search_object);
            debugger;
            if(response && response.response){
                this.setState({
                    search_result: response.response,
                    shouldShow: true
                });
            }
        }
        else{
             this.setState({
                 status:false,
                 loading:false,
                 show:true,
                 title : '',
                 message : 'Country and Year is Required',
             })
        }

     }


    async  getProducts (values, details){
        let _all_products = this.state.products
        if(details){
            _all_products.push(values)
            await this.setState({
                products : _all_products
            })
        }
        else{
            let _products = this.state.products.filter((fieldValue, index) => fieldValue.PM_VENDOR_ITEM_CODE != values.PM_VENDOR_ITEM_CODE);
             await this.setState({
                products : _products
            })
        }
    }

    async  getProductsall (_products, details){
        let _all_products = this.state.products;
        if(_products.length){
            if(details){
                for(let i=0;i<_products.length;i++){
                    _all_products.push(_products[i])
                    if (i != _products.length) {
                        await this.setState({products : _all_products})
                    }
                }
            }
            else{
                let _temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                        _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.PM_VENDOR_ITEM_CODE != _products[i].PM_VENDOR_ITEM_CODE);
                        if (i != _products.length) {
                             this.setState({products : _temp_query})
                        }

                }

            }
        }

    }


    Modify = () =>{
        let {products, search_object} = this.state;
        console.log('Modify ',products.length);
        if(products.length){
            if(products.length==1){
                products = products[0]
                let _temp_details  = {...products, ...search_object};
             //   _temp_details.hm_date = FromateDate_YY_MM_DD(_temp_details.hm_date)
                this.setState({
                    modify_details : _temp_details,
                    show_details : "modify"
                })
                this.props.history.push({
                        pathname:'/item_master.',
                        state: {
                            itemMaster:_temp_details
                        },
                        mode:"modify"
                    });
            }
            else{
                this.setState({
                    show:true,
                    status :false,
                    message : 'Please make only one selection',
                })
            }
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
    }

    confirm_function = (e, type, text) => {
        e.preventDefault()
        if(this.state.products.length === 0) {
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            });
            return false;
        }

        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            loading:false,
            modal_body: `Are you sure that you want to ${text} ?`,
        })
    }

    closemodel = async () => {
        this.setState({
            show : false
        })
        if(this.state.status && this.state.submit_type=="delete"){
         //   this.handlefromsubmit()
        }

        if(this.state.status && (this.state.submit_type=="status_alter" || this.state.submit_type=="unlock")){
          //  this.handlefromsubmit()
            window.location.reload();
        }

    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="delete"){
            this.Delete()
        }
        else if(_confimation_type=="unlock"){
            this.Unlock()
        }
        else if(_confimation_type=="activate"){
            this.StatusAlter('active')
        }
        else if(_confimation_type=="deactivate"){
            this.StatusAlter('deactive')
        }

    }

    StatusAlter = async(status) =>{
        let {products} = this.state;
        if(products.length){
            let _temp_json_detail= {};
            let _temp_details = [];
            products.forEach((list_details)=>{
                console.log('list_details ',list_details);
                _temp_details.push({"strProductCode" : list_details.PM_PRODUCT_CODE,
                    "strCoyId" : JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"]});
            })

            _temp_json_detail['companyId']= JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"];
            _temp_json_detail['strActive']= "Y";
            _temp_json_detail['UserId']= "sysadmin";
            _temp_json_detail['itemData']= _temp_details


            this.setState({loading:true})
            let _status = await ApiExtract(ActivateDeactivateAdd, {strAction :status,  data:_temp_json_detail});
            console.log('_status ',_status);
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :'status_alter',
                    show:true,
                    title : '',
                    status :_status.status,
                    message :_status.response && (_status.response.message) ? _status.response.message :'Item Master Updated',
                })
            }
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
    }


    // get_details = (row) =>{
    //     if(row){
    //         let _temp_details = {
    //             userGroupId:row.UGM_USRGRP_ID,
    //             appPackageId:row.UGM_APP_PKG
    //         }
    //         // this.setState({
    //         //     edit_details : _temp_details,
    //         //     show_details : 'modify'
    //         // })
    //         this.props.history.push({url:'/item_master.',state:);
    //     }
    //     else{
    //         this.setState({
    //             show:true,
    //             status :false,
    //             message : 'Please make atleast only one selection!',
    //         })
    //     }
    // }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const { handleSubmit } = this.props
        // const _table_header = [
        //     {
        //         name: "Catalogue", id: "DM_FIXED_ROLE_ID", formatter: (cellContent, row) => {
        //             return (
        //                 <button type="button" className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.DM_FIXED_ROLE_ID}</button>
        //             )
        //         },
        //     },
        //     { name: "Purchaser", id: "DM_PANEL_NAME", key: true }]


            const _table_header = [
                {name : "Item Code", id:"PM_VENDOR_ITEM_CODE", width:'50px', key:true, key:true},
                {name : "Item Name", id:"PM_PRODUCT_DESC", width:'50px'},
                {name : "Commodity Type", id:"CT_NAME", width:'100px'},
                {name : "UOM", id:"PM_UOM", width:'100px'},
                {name : "Status", id:"PM_DELETED", width:'100px', formatter: (cellContent, row) => {
                    return (
                        <div >{row.PM_DELETED == 'N'? 'Active' : 'Deactivated'}</div>
                )},}
            ];

            console.log('loadingSearch ',this.props.loadingSearch);

        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : ''}
            {this.props.loadingSearch ? <Loader /> : ''}
           {(!this.props.search_result.length > 0) && this.state.loading ? <Loader /> : ""}


            <div className="show_list">
                <PageHeading
                    heading="Item Listing"
                    subheading="Fill in the search criteria and click Search button to list the relevant items. Click the Add button to add new item."
                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                 <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-12 pl-0"><label>Item Code: </label></div>
                                        <div className="col-12 col-md-12 pl-0">
                                            <input name="strCode" className="form-control" onChange={this.handleChange.bind(this)} placeholder="Item Code"  />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-12"><label>Commodity Type: </label></div>
                                        <div className="col-12 col-md-12">
                                            <input name="strComType" className="form-control" onChange={this.handleChange.bind(this)} placeholder="Commodity Type"  />
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
                                            <input name="strName" className="form-control"  onChange={this.handleChange.bind(this)} placeholder="Item Name" value="" />
                                            <div className="text-danger"></div>
                                        </div>
                                        </div>
                                        </div>
                                    <div className="col-12 col-md-6">
                                       <div className="row">
                                       <div className="col-12 col-md-12"><label></label></div>
                                        <div className="col-12 col-md-12 pt-2">
                                        <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="checkbox" name="check1" id="check" value="" checked="checked" />
                                                <label className="form-check-label ml-2" for="inlineRadio2">Active</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="checkbox" name="check" id="inlineRadio2" value="" />
                                                <label className="form-check-label ml-2" for="inlineRadio2">Inactive</label>
                                            </div>
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
                                                <input classNmae="form-check-input" type="checkbox" name="check1" id="check" value="" />
                                                <label className="form-check-label ml-2" for="inlineRadio2">Spot</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="checkbox" name="check" id="inlineRadio2" value="" />
                                                <label className="form-check-label ml-2" for="inlineRadio2">Stock</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="checkbox" name="check" id="inlineRadio2" value="" />
                                                <label className="form-check-label ml-2" for="inlineRadio2">MRO</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-12 mt-2 text-right"><button type="submit" className="btn btn-sm btn-outline-success">Search</button>
                                    <button type="reset" className="btn btn-sm btn-outline-danger ml-2">Clear</button></div>
                            </div>
                        </div>
                    </div>
                </form>

                <div style={{ display: this.state.shouldShow ? '' : 'none' }}>
                <div className='col-12 mt-3'>

                       <BootstrapCustomTableForTwentyRow
                           table_header={_table_header}
                           table_body={(this.state.search_result) ? this.state.search_result : []}
                           products={this.getProducts}
                           select={true}
                           search={null}
                           selectname={'pr_no'}
                           responsive={true}
                           click={false}
                           table_name="issue_grn"
                           selectall={this.getProductsall}
                       />
                </div>

                   </div>
                <div className="col-12 col-md-6 mt-3 pl-1">
                    <div className="row mb-3">
                        <div className="col-12">
                            <button type="button" className="btn btn-outline-success btn-sm" onClick={this.addButtonHandler}>Add</button>
                            <button type="button" disabled={!this.state.shouldShow ? true : false} className={`btn btn-sm ${!this.state.shouldShow ? "custom-disabled-btn-outline-primary" : ""} btn-outline-primary ml-2`} onClick={()=>this.Modify()}>Modify</button>
                            <button type="button" disabled={!this.state.shouldShow ? true : false} className={`btn btn-sm ${!this.state.shouldShow ? "custom-disabled-btn-outline-secondary": ""} btn-outline-secondary ml-2`} onClick={(e)=>this.confirm_function(e, 'activate', 'activate this item(s)')}>Activate</button>
                            <button type="button" disabled={!this.state.shouldShow ? true : false} className={`btn btn-sm ${!this.state.shouldShow ? "custom-disabled-btn-outline-warning" : ""} btn-outline-warning ml-2`} onClick={(e)=>this.confirm_function(e, 'deactivate', 'deactivate this item(s)')}>Deactivate</button>
                        </div>
                    </div>
                </div>
            </div>

            <Alert
                    confirm={this.closemodel}
                    title={this.state.title}
                    message={this.state.message}
                    status={this.state.status}
                    show={this.state.show}
                />
                   <ConfirmationModel
                     title=""
                     confimation = {true}
                     message={this.state.modal_body}
                     status={this.state.status}
                     show={this.state.confimation_pop}
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />
        </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing: state.dashboard_listing.responseList_2,
  //  loading: state.dashboard_listing.loading,
    fixed_roles: state.fixed_roles.responseList,
    search_result: state.search_result.responseList  ,
    loadingSearch: state.search_result.loading
})

const mapDispatchToProps = dispatch => ({
    GetDashboardList: (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles: (values) => dispatch(GetFixedRoles(values)),
    GetSearchResult: (values) => dispatch(GetSearchResult(values)),
})


const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default reduxForm({
    form:'DashboardListingHolder',
})(DashboardListingHolder);
