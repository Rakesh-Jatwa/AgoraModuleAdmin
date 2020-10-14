import React,{Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import Loader from '../../../Component/Loader'
import {reduxForm,  Field} from 'redux-form';
import Alert from '../../../Component/Modal/alert'
import {connect} from 'react-redux';
import {GetCatalogueDropdown, GetBuyerCatlogSearch, GetCommodityTypeList,RaisePR, EmptyItemDisplayDetails, DeliveryAddressAction} from '../../../Actions/Requester'
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTable'
import {FromInputs, FromSelect} from '../../../Component/From/FromInputs'
import {RemoveSpecialCharacter} from '../../../Actions/Common/Functions'

class BuyerCatalogue extends Component {
    constructor(props){
        super(props);
        this.rise_pr  = this.rise_pr.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getProductsall = this.getProductsall.bind(this);
        this.handlefiltersubmit = this.handlefiltersubmit.bind(this)
        this.handleCheckChieldElement = this.handleCheckChieldElement.bind(this)
        this.closeModel = this.closeModel.bind(this);
        this.state = {
            products:[],
            open:false,
            loading:false,
            checkbox:[],
        }
    }
    

    componentDidMount(){
        localStorage.removeItem('pr_details')
        this.props.GetCatalogueDropdown();
        this.props.GetCommodityTypeList();
        this.props.DeliveryAddressAction()
    }

    componentDidUpdate(){
        if(this.props.pr_response && this.props.pr_response.message){
            localStorage.removeItem('pr_details')
            this.props.history.push({
                pathname:'/purchaseRequest',
                selected_items: this.state.products,
                datas: {
                    productList:this.state.products,
                    strType: 'bc',
                    viewState: 'new'
                }
               
            })
        }
    }


    rise_pr(data){

        let _all_products = this.state.products;
        if(_all_products.length){
            this.props.RaisePR(_all_products)
        }
        else{
            this.setState({open:true})
        }
    }

    getProducts (values, details){
        let _all_products = this.state.products;
        if(details){
            values.checked = "false"
            _all_products.push(values)
            this.setState({
                products : _all_products
            })
        }
        else{
             let products = this.state.products.filter((fieldValue, index) => fieldValue.CDI_PRODUCT_CODE !== values.CDI_PRODUCT_CODE);
             this.setState({
                products : products
            })
        }
        console.log('_all_products', this.state.products)
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

    handleCheckChieldElement(event, details){
        
        let {checkbox} = this.state
        let _value = `'${event.target.value}'`
        if(event.target.checked){
            checkbox.push(_value);
            this.setState({checkbox:checkbox})
        }
        else{
            let checkbox_filter = this.state.checkbox.filter((fieldValue, index) => fieldValue !== _value);
            console.log('checkbox_filter',checkbox_filter)
            this.setState({
                checkbox : checkbox_filter
           })
        }
        
        console.log('handleCheckChieldElement',this.state.checkbox)
    }

    

    handlefiltersubmit(values){
      
        let _form_value = values;
        let {checkbox} = this.state
        let _checkbox = checkbox.toString();
        let _initial_obj = {
            ItemCode: "",
            BuyerCatalogue: "",
            ItemName: "",
            CommodityType: "",
            // itemTypeList: _checkbox,
        }
        _form_value.buyerDto = Object.assign({}, _initial_obj,(_form_value.buyerDto) ? _form_value.buyerDto : _form_value )
        _form_value.buyerDto.itemTypeList = _checkbox;
        _form_value.buyerDto = RemoveSpecialCharacter(_form_value.buyerDto)
        _form_value.buyerDto.itemTypeList = _checkbox;
        this.props.GetBuyerCatlogSearch(_form_value)
        
    }

    closeModel = () =>{
        this.setState({
            open:false,
        })
    }

    getPage_details(details, cell, row){
        console.log('getPage_details',details, cell, row)
        this.props.EmptyItemDisplayDetails()
        let _req = { "pid": cell.PM_PRODUCT_CODE, "companyType": "B", "index": "", "draft": "0"}
        localStorage.setItem('item_details',JSON.stringify(_req));
        window.open('/#/itemCodePage', '_blank');
    }

    SelectAll = () => {
        this.setState({
            checkbox:["'SP'", "'ST'", "'MI'"],
        })
    }

    ClearAll = () => {
        this.setState({
            checkbox:[]
        })
        this.props.reset('CatalogSearch')
    }  

    render(){
        const { handleSubmit } = this.props
        
        const _table_header = [
            {name : "Item Code", id:"PM_VENDOR_ITEM_CODE", key:true, width:'101px', formatter: (cellContent, row) => {
                return <button type="button" className="btn btn-sm btn-outline-primary" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.PM_VENDOR_ITEM_CODE}</button >
        
             }},
            {name : "Item Name", id:"PM_PRODUCT_DESC", key:false, width:'127px'},
            {name : "UOM", id:"PM_UOM", key:false, width:'60px'},
            {name : "Currency", id:"PM_LAST_TXN_PRICE_CURR", key:false, width:'86px'},
       
            {name : "Last Txn. Price ", id:"PM_LAST_TXN_PRICE", key:false, width:'115px',dataFormat:"number4"},
            {name : "Last Txn. Tax(%)", id:"PM_LAST_TXN_TAX", key:false, width:'102px',dataFormat:"price"},
            {name : "Last Txn. Vendor", id:"pm_last_txn_s_coy_id", key:false, width:'160px'},
        ];
        
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.pr_loading) ? <Loader /> : '' }
             <PageHeading 
                heading="Buyer Catalogue Search" 
                subheading="Select/fill in the search criteria and click Search button to list the relevant Buyer Catalogue. Click the Raise PR button to go to Raise PR page." 
            />
                <form onSubmit={handleSubmit(this.handlefiltersubmit.bind(this))}>
     
                    <div className="row mt-2">  
                        <div className='col-12 col-sm-12 col-lg-6'>  
                            <div className="row mt-2"> 
                                <Field type="text" name="buyerDto.ItemCode" component={FromInputs} className="form-control" placeholder="Item Code" label="Item Code : " />
                            </div>    
                            <div className="row mt-2"> 
                                <Field name="buyerDto.BuyerCatalogue" className="form-control mb-3" component={FromSelect} label={"Buyer Catalogue : "}>
                                        <option selected value="">--Select--</option>
                                        {this.props.catalogue_dropdown && this.props.catalogue_dropdown.catalogueDropdown && this.props.catalogue_dropdown.catalogueDropdown.map((list)=>{
                                            return   <option key={list.BCM_CAT_INDEX} value={list.BCM_CAT_INDEX}>{list.BCM_GRP_DESC}</option>
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
                                <Field type="text" name="buyerDto.ItemName" component={FromInputs} className="form-control" placeholder="Item Name" label="Item Name  : " />       
                        </div>   
                        <div className="row mt-2"> 
                        <Field name="buyerDto.CommodityType" className="form-control mb-3" component={FromSelect} label={"Commodity Type :"}>
                                <option selected value="">--Select--</option>
                                {this.props.commodity_list && this.props.commodity_list.CommodityList && this.props.commodity_list.CommodityList.map((list)=>{
                                    return     <option key={list.value} value={list.value} >{list.label}</option>
                                })} 
                            </Field>
                        </div>  
                        
                        <div className="row mt-2"> 
                            <div className="col-md-12 text-left">
                                <button type="submit" className="btn btn-sm btn-outline-info" id="showBtn">Search</button>
                                <button type="button" className="btn btn-outline-secondary btn-sm ml-2" onClick={this.SelectAll}>Select All</button>
                            <button type="button" className="btn btn-sm btn-outline-danger ml-2" ml-2="" onClick={this.ClearAll}>Clear</button>
                            </div>
                        </div>      
                    </div> 
                </div>
                </form>     
                <Alert 
                    title={'Validation Message'}
                    message='Please Select Atleast One Item'
                    status={this.state.status} 
                    show={this.state.open} 
                    confirm={this.closeModel}
                />
                <div className="row mt-2">    
                    <div className='col-12'>  
                    <hr></hr>
                        <BootstrapCustomTable table_header={_table_header} table_body={(this.props.buyer_catelogue_search && this.props.buyer_catelogue_search.getBuyerCatItems1) ? this.props.buyer_catelogue_search.getBuyerCatItems1 : []} products={this.getProducts} select={true} selectname={'itemcode'} selectall={this.getProductsall} />
                        <div className="row">
                            <div className="col-md-6 col-lg-6 text-left">
                                <button type="submit" className="btn btn-sm btn-outline-info" id="showBtn" onClick={this.rise_pr}>Raise PR</button>
                            </div>
                        </div>
                    </div>
                </div>
        </Fragment>
    }
}





const mapStateToProps = state => ({
    commodity_list : state.commodity_type_list.responseList,
    catalogue_dropdown : state.catalogue_dropdown.responseList,
    buyer_catelogue_search : state.buyer_catelogue_search.responseList,
    loading : state.buyer_catelogue_search.loading, 
    pr_loading: state.raise_pr.loading,
    pr_response: state.raise_pr.responseList
})

const mapDispatchToProps = dispatch => ({
    GetCommodityTypeList  : () => dispatch(GetCommodityTypeList()),
    GetCatalogueDropdown  : () => dispatch(GetCatalogueDropdown()),
    GetBuyerCatlogSearch  : (values) => dispatch(GetBuyerCatlogSearch(values)),
    RaisePR  : (values) => dispatch(RaisePR(values)),
    EmptyItemDisplayDetails : () =>EmptyItemDisplayDetails(),
    DeliveryAddressAction  : () => dispatch(DeliveryAddressAction()),
})

const BuyerCatalogueHolder = connect(mapStateToProps, mapDispatchToProps)(BuyerCatalogue);
export default reduxForm({
    form:'filter',
})(BuyerCatalogueHolder);
