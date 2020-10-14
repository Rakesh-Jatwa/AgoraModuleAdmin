import React,{Component, Fragment} from 'react';

import {connect} from 'react-redux';

import {GetContractRefNoAndDesc, GetCommodityTypeList, GetVendorNameListService, SearchContractCatalogue, RaisePR, DeliveryAddressAction} from '../../Actions/Requester'

import PageHeading from '../../Component/Heading/PageHeading';

import TabHeading from '../../Component/Heading/TabHeading';

import {LoginValidation} from '../../validation'

import Common from '../../Common'

import FromFilter from '../ContractCatalogueSearch'

import BootstrapCustomTable from '../../Component/Table/BootstrapCustomTable'

import {PutLocalstorage, GetLocalstorage} from '../../Common/LocalStorage'

import Loader from '../../Component/Loader'

import Alert from '../../Component/Modal/alert'

import {Field, reduxForm } from 'redux-form';

import {FromInputs, FromSelect, CheckBoxInline} from '../../Component/From/FromInputs'

import SelectField from '../../Component/SelectField'

import {RemoveSpecialCharacter} from '../../Actions/Common/Functions'







class Dashboard extends Component{

    constructor(props){

        super(props);

        this.rise_pr  = this.rise_pr.bind(this);

        this.getProducts = this.getProducts.bind(this);

        this.handlefiltersubmit = this.handlefiltersubmit.bind(this)

        this.handleCheckChieldElement = this.handleCheckChieldElement.bind(this)

        this.getProductsall = this.getProductsall.bind(this)

        this.show_table = this.show_table.bind(this)

        this.state = {

            products:[],

            open:false,

            loading:false,

            checkbox:[],

            table_display:false,

            isChecked:false,

            vendor_details : ''

        }

    }



    rise_pr(data){

        localStorage.removeItem('pr_details')

        let _all_products = this.state.products;

        console.log('_all_products', _all_products)

      

        if(_all_products.length){

            this.props.RaisePR(_all_products)

            this.props.history.push({

                pathname:'/purchaseRequest',

                selected_items: _all_products,

                datas: {

                    productList:_all_products,

                    viewState: 'new',

                    strType: 'cc'

                },

                

            })

        }

        else{

            this.setState({open:true})

        }

       

       

    }



    show_table = () =>{

        this.setState({

            table_display:true

        })

    }



    componentDidMount(){

        localStorage.removeItem('pr_details')

        this.props.GetContractRefNoAndDesc()

        this.props.GetCommodityTypeList()

        this.props.GetVendorNameListService()

        this.props.DeliveryAddressAction()

    }

    



    componentDidUpdate(){

        if(this.props.pr_response && this.props.pr_response.message){

            let _details = this.state.products

            let _existing_contracts = GetLocalstorage('contract')

            let _push_products = [];

            if(_existing_contracts){

                _existing_contracts = JSON.parse(_existing_contracts);

                if(_existing_contracts.productList.length){

                    _existing_contracts.productList.forEach((_existing_contract)=>{

                        _push_products.push(_existing_contract)

                    })

                    

                }

            }

            if(_details.length){

                _details.forEach((_detail)=>{

                    let _filtered_datas =  _push_products.filter((list)=>{

                        return list.CDI_PRODUCT_CODE == _detail.CDI_PRODUCT_CODE

                    })

                    if(!_filtered_datas.length){

                        _push_products.push(_detail);

                    }

                })

               

            }



            if(_push_products.length){

                let _final_object = {

                    productList: _push_products,

                    viewState: "new",

                    strType: "cc",

                }

                PutLocalstorage('contract', JSON.stringify(_final_object))

            }



           

            this.props.history.push({

                pathname:'/purchaseRequest',

                selected_items: _push_products,

                mode: 'cc',

                type: 'new'

            })

        }

    }



    componentDidCatch(error, info){

    }

   

    handlefromsubmit(values){

        let {products} =  this.state;

        if(products.length){

            this.props.history.push('/purcahase-request')

        }

        else{

            this.setState({

                open : true

            })

        }

       

    }



    handleCheckChieldElement(event, details){

        

        let {checkbox} = this.state

        let _value = `'${event.target.value}'`

        if(event.target.checked){

            checkbox.push(_value);

            this.setState({checkbox:checkbox})

        }

        else{

            let checkbox_filter = this.state.checkbox.filter((fieldValue, index) => fieldValue !== _value);

            this.setState({

                checkbox : checkbox_filter

           })

        }

     

    }



    handlefiltersubmit(values){

        let _form_value = values;

        let {checkbox} = this.state 

        let _checkbox = checkbox.toString();

        let _initial_obj = {

            ItemCode: "",

            ContractRefNo: "",

            ContractDescription: "",

            ItemName: "",

            CommodityType: "",

            itemTypeList: checkbox.toString(),

        }

        _form_value.contractcatlog = Object.assign({}, _initial_obj,(_form_value.contractcatlog) ? _form_value.contractcatlog : _form_value )

        _form_value.contractcatlog.itemTypeList = _checkbox;

        _form_value.contractcatlog.Vendor = (this.state.vendor_details && this.state.vendor_details.value) ? this.state.vendor_details.value : '';

        _form_value.contractcatlog = RemoveSpecialCharacter(_form_value.contractcatlog)

        _form_value.contractcatlog.itemTypeList = _checkbox

        this.props.SearchContractCatalogue(_form_value)

        

    }



    closemodel = () => {

        this.setState({

            open : false

        })

    }



    getPage_details(details, cell, row){

        console.log('getPage_details',details, cell, row)

        let _req = { "pid": cell.CDI_PRODUCT_CODE, "companyType": "B", "index": "", "draft": "0", "Ref": cell.CDM_GROUP_CODE };

        localStorage.setItem('item_details',JSON.stringify(_req));

        window.open('/#/itemCodePage', '_blank');

    }



    async  getProducts (values, details){

        let _all_products = this.state.products;

        console.log('values.CDI_PRODUCT_CODE', values.CDI_PRODUCT_CODE)

        if(details){

            values.checked = "false"

            _all_products.push(values)

           await this.setState({

                products : _all_products

            })

        }

        else{

            let _products = this.state.products.filter((fieldValue, index) => fieldValue.CDI_PRODUCT_CODE != values.CDI_PRODUCT_CODE);

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

                    _products.checked = "false"

                    _all_products.push(_products[i])

                    if (i != _products.length) {

                        await this.setState({products : _all_products})

                    }

                }

            }

            else{

                let _temp_query = _all_products

                for(let i=0;i<_products.length;i++){

                 

                        _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.CDI_PRODUCT_CODE != _products[i].CDI_PRODUCT_CODE);

                    

                        if (i != _products.length) {

                             this.setState({products : _temp_query})

                        }

                   

                }

                

            }

        }

        

    }



    

    SelectAll = () => {

        this.setState({

            checkbox:["'SP'", "'ST'", "'MI'"],

        })

    }



    ClearAll = () => {

        this.setState({

            checkbox:[],

            vendor_details : ''

        })

        this.props.reset('CatalogSearch')

    }   





    HandleChange = (selectedOption) =>{

        this.setState({

            vendor_details : selectedOption

        })

    }

    render(){

        const { handleSubmit } = this.props

        const _table_header = [

            {name : "Item Code", id:"CDI_VENDOR_ITEM_CODE", width:'120px', formatter: (cellContent, row) => {
               return <button type="button" className="btn btn-sm btn-outline-primary" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.CDI_VENDOR_ITEM_CODE}</button >
            }},

            {name : "Item Name", id:"CDI_PRODUCT_DESC", key:true, width:'232px'},

            {name : "Contract Ref. No.", id:"CDM_GROUP_CODE", key:false, width:'138px'},

            {name : "Contract Description", id:"CDM_GROUP_DESC", key:false, width:'160px'},

            {name : "Vendor", id:"CM_COY_NAME", key:false, width:'150px'},

            {name : "UOM", id:"CDI_UOM", key:false, width:'66px'},

            {name : "Currency", id:"CDI_CURRENCY_CODE", key:false, width:'90px'},

            {name : "Contract Price", id:"CDI_UNIT_COST", key:false, width:'121px',dataFormat:"number"},

            {name : "SST Rate", id:"CDI_GST_RATE", key:false, width:'90px',dataFormat:"validatedata"},

            {name : "SST Tax Code (Purchase)", id:"CDI_GST_TAX_CODE", key:false, width:'184px'},

            {name : "Remarks", id:"CDI_REMARK", key:false, width:'184px'},

       ];

        return <Fragment>

            {(this.props.loading) ? <Loader /> : '' }

            {(this.props.pr_loading) ? <Loader /> : '' }

            <Alert 

            title="" 

            message="Please select at least one selection!" 

            status={this.state.status} show={this.state.open} confirm={this.closemodel}/>

            <PageHeading 

                heading="Contract Catalogue Search" 

                subheading="Select/fill in the search criteria and click Search button to list the relevant Contract Catalogue. Click the Raise PR button to go to Raise PR page. Click the Raise PO button to go to Raise PO page." 

            />

            <TabHeading>Search Criteria</TabHeading> 

            <form onSubmit={handleSubmit(this.handlefiltersubmit.bind(this))}>

                <div className="row mt-2">  

                    <div className='col-12 col-sm-12 col-lg-6'>  

                        <div className="row mt-2"> 

                            <Field type="text" name="contractcatlog.ItemCode" component={FromInputs} className="form-control" placeholder="Item Code" label="Item Code : " />

                        </div>    

                        <div className="row mt-2"> 

                            <Field name="contractcatlog.ContractRefNo" className="form-control mb-3" component={FromSelect} label={"Contract Ref. No. :"}>

                                    <option selected value="">---Select---</option>

                                    {this.props.contract_ref_no_and_desc && this.props.contract_ref_no_and_desc.contractRefNo && this.props.contract_ref_no_and_desc.contractRefNo.map((list)=>{

                                        return   <option key={list.CDM_GROUP_INDEX} value={list.CDM_GROUP_INDEX}>{list.CDM_GROUP_CODE}</option>

                                    })}  

                            </Field>

                        </div>    

                        <div className="row mt-2"> 

                            

                            <Field name="contractcatlog.ContractDescription" className="form-control mb-3" component={FromSelect} label={"Contract Description :"}>

                                <option selected value="">---Select---</option>

                                {this.props.contract_ref_no_and_desc && this.props.contract_ref_no_and_desc.contractDescription && this.props.contract_ref_no_and_desc.contractDescription.map((list,index)=>{

                                    return   <option key={index} value={list.CDM_GROUP_DESC}>{list.CDM_GROUP_DESC}</option>

                                })} 

                            </Field>

                        </div>

                        <div className="row mt-2"> 

                        <div className="col-md-4 col-sm-4 col-lg-4"><label>Item Type :</label></div>

                            <div className="col-md-6 col-sm-6 col-lg-6">                            

                                <div className="form-check-inline">

                                    <label className="form-check-label">

                                        <input type="checkbox" className="form-check-input" id="Spot" value="SP" name="contractcatlog.itemTypeList" onChange={this.handleCheckChieldElement}   checked={this.state.checkbox.includes("'SP'")}/>Spot

                                    </label>

                                </div>

                                <div className="form-check-inline">

                                    <label className="form-check-label">

                                        <input type="checkbox" className="form-check-input" id="Stock" value="ST" name="contractcatlog.itemTypeList"  onChange={this.handleCheckChieldElement}   checked={this.state.checkbox.includes("'ST'")}/>Stock

                                    </label>

                                </div>

                                <div className="form-check-inline">

                                    <label className="form-check-label">

                                        <input type="checkbox" className="form-check-input" id="MRO" value="MI" name="contractcatlog.itemTypeList"  onChange={this.handleCheckChieldElement}   checked={this.state.checkbox.includes("'MI'")}/>MRO

                                    </label>

                                </div>

                            </div>

                        </div>

                    </div>

                

                    <div className='col-12 col-sm-12 col-lg-6'>  

                        <div className="row mt-2"> 

                                <Field type="text" name="contractcatlog.ItemName" component={FromInputs} className="form-control" placeholder="Item Name" label="Item Name : " />       

                        </div>   

                        <div className="row mt-2">

                            <div className="col-12">

                                <div className="row">

                                    <div className="col-md-12"><label>Vendor : </label></div>

                                </div>

                                <SelectField options={(this.props.vendor_name_list_service && this.props.vendor_name_list_service.VendorList) ? this.props.vendor_name_list_service.VendorList : []} handleChange={this.HandleChange} selectedOption={this.state.vendor_details}/>

                            </div> 

                        </div>      



                        <div className="row mt-2">

                            <Field name="contractcatlog.CommodityType" className="form-control mb-3" component={FromSelect} label={"Commodity Type :"}>

                                <option selected value="">---Select---</option>

                                {this.props.commodity_list && this.props.commodity_list.CommodityList && this.props.commodity_list.CommodityList.map((list)=>{

                                    return     <option key={list.value} value={list.value} >{list.label}</option>

                                })} 

                            </Field>

                        </div> 

                    <div className="row mt-2"> 

                        <div className="col-md-12 text-center">

                            <button type="submit" className="btn btn-sm btn-outline-info" id="showBtn" onClick={(e)=>this.show_table()}>Search</button>

                            <button type="button" className="btn btn-outline-secondary btn-sm ml-2" onClick={this.SelectAll}>Select All</button>

                            <button type="button" className="btn btn-sm btn-outline-danger ml-2" ml-2="" onClick={this.ClearAll}>Clear</button>

                        </div>

                    </div>      

                </div> 

            </div>      

            </form>

                {(this.state.table_display || (this.props.item_based_product && this.props.item_based_product.length)) ?  <div className="row mt-2">    

                    <div className='col-12'>  

                    <hr></hr>

                    <BootstrapCustomTable 

                        table_header={_table_header} 

                        table_body={this.props.item_based_product} 

                        products={this.getProducts} 

                        select={true} 

                        selectname={'itemcode'} 

                        selectall={this.getProductsall} />

                        <div className="row">

                            <div className="col-md-6 col-lg-6 text-left">

                                <button type="submit" className="btn btn-sm btn-outline-info" id="showBtn" onClick={this.rise_pr}>Raise PR</button>

                            </div>

                        </div>

                    </div>

                </div> : '' }

                

        </Fragment>

    }

}



const mapStateToProps = state => ({

    commodity_list : state.commodity_type_list.responseList,

    contract_ref_no_and_desc : state.contract_ref_no_and_desc.responseList,

    vendor_name_list_service : state.vendor_name_list_service.responseList,

    item_based_product : state.item_based_search.responseList,

    loading: state.item_based_search.loading,

    pr_loading: state.raise_pr.loading,

    pr_response: state.raise_pr.responseList

})



const mapDispatchToProps = dispatch => ({

    GetContractRefNoAndDesc  : () => dispatch(GetContractRefNoAndDesc()),

    GetCommodityTypeList  : () => dispatch(GetCommodityTypeList()),

    GetVendorNameListService  : () => dispatch(GetVendorNameListService()),

    SearchContractCatalogue  : (values) => dispatch(SearchContractCatalogue(values)),

    DeliveryAddressAction  : () => dispatch(DeliveryAddressAction()),

    RaisePR  : (values) => dispatch(RaisePR(values)),

})





const MainDashbaord = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default reduxForm({

    form:'CatalogSearch',

    validate:LoginValidation

})(MainDashbaord);