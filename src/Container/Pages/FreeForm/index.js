import React,{Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import Loader from '../../../Component/Loader'
import Alert from '../../../Component/Modal/alert'
import {connect} from 'react-redux';
import {GetFreeFormDetails, RaisePR} from '../../../Actions/Requester'
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTable'
import {UserDetails} from '../../../Common/LocalStorage';
const _table_header = [
    {name : "Item Code", id:"PM_VENDOR_ITEM_CODE", key:true, width:'101px'},
    {name : "Item Name", id:"PM_PRODUCT_DESC", key:false, width:'127px'},
    {name : "UOM", id:"PM_UOM", key:false, width:'60px'},
    {name : "Currency", id:"PM_LAST_TXN_PRICE_CURR", key:false, width:'86px'},
    {name : "Contract Price", id:"PM_LAST_TXN_PRICE_CURR", key:false, width:'115px'},
    {name : "Last Txn. Price ", id:"PM_LAST_TXN_PRICE", key:false, width:'115px'},
    {name : "Last Txn. Tax(%)", id:"PM_LAST_TXN_TAX", key:false, width:'123px'},
    {name : "Last Txn. Vendor", id:"pm_last_txn_s_coy_id", key:false, width:'200px'},
];


class BuyerCatalogue extends Component {
    constructor(props){
        super(props);
        this.rise_pr  = this.rise_pr.bind(this);
        this.getProducts = this.getProducts.bind(this);
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
        this.props.GetFreeFormDetails();
    }

    componentDidUpdate(){
        if(this.props.pr_response && this.props.pr_response.message && this.props.history){
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


    rise_pr(){
        let _all_products = this.state.products;
        this.props.closemodel()
        if(_all_products.length){
            this.props.RaisePR(_all_products)
            this.props.getdata(_all_products)
            this.setState({
                open:false
            })
        }
    }

    getProducts (values){
        let _all_products = this.state.products;
        if(_all_products){
            _all_products.push(values)
            this.setState({
                products : _all_products
            })
        }
    }

    handleCheckChieldElement(event){
        let {checkbox} = this.state
        let _value = `'${event.target.value}'`
        if(checkbox.indexOf(_value)<0){
            checkbox.push(_value);
            this.setState({checkbox:checkbox})
        }
    }

    handle_change = (item_value, index, type ) =>{
        let _pre_build = this.state.products;

        let _details = {
            PM_PRODUCT_CODE: "",
            COMMDITY_TYPE:  "PAMB General",
            CDI_GROUP_INDEX: "",
            CDI_UOM : "",
        }
    
      
        if(index in _pre_build){
            let _details =  _pre_build[index];
            _details.CDI_UOM = (type=="select") ? (item_value).trim() : _details.CDI_UOM;
            _details.ITEM_DESC = (type=="input") ? item_value : _details.ITEM_DESC;
            _details.COMMDITY_TYPE = (type=="commodityType") ? item_value :  _details.COMMDITY_TYPE;
            _details.RD_QUANTITY = (type=="RD_QUANTITY") ? item_value : _details.RD_QUANTITY;
            _details.RD_DELIVERY_LEAD_TIME = (type=="RD_DELIVERY_LEAD_TIME") ? item_value : _details.RD_DELIVERY_LEAD_TIME;
            _pre_build[index] = _details
        }
        else{

            _details.CDI_UOM = (type=="select") ? (item_value).trim() : '';
            _details.ITEM_DESC = (type=="input") ? item_value : '';
            _details.RD_QUANTITY = (type=="RD_QUANTITY") ? item_value : _details.RD_QUANTITY;
            _details.COMMDITY_TYPE = (type=="commodityType") ? item_value :  _details.COMMDITY_TYPE;
            _details.RD_DELIVERY_LEAD_TIME = (type=="RD_DELIVERY_LEAD_TIME") ? item_value : _details.RD_DELIVERY_LEAD_TIME;
            _pre_build[index] = _details
        }
        
        this.setState({ products : _pre_build})
    }

    build_select = (item_details) =>{
        let _build_select  ='';
        let _options =  (this.props.free_form && this.props.free_form.item) ? this.props.free_form.item : []
        if(_options){
            _build_select =  <select className="form-control" name={`item_option_name[${item_details}]`} id={item_details} defaultValue={''} onChange={(e)=>this.handle_change(e.target.value, item_details,'select')}>   
                <option value={''}>Select  UOM</option> 
                {_options.map((list)=>{
                    return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                })}
            </select>
            return _build_select
        }
    }

  

    build_select_com_type = (item_details) =>{
        let _build_select  ='';
        let _options =  (this.props.free_form && this.props.free_form.item && this.props.free_form.commodityType  && this.props.free_form.commodityType.CommodityList && this.props.free_form.commodityType.CommodityList) ? this.props.free_form.commodityType.CommodityList : []

        if(_options){
            _build_select =  <select className="form-control" name={`commodityType[${item_details}]`} id={item_details} defaultValue={'PAMB General'} onChange={(e)=>this.handle_change(e.target.value, item_details,'commodityType')}>   
                {/* <option value=""> Select a Commodity Type</option> */}
                {_options.map((list)=>{
                    return <option value={list.label} >{list.label}</option>
                })}
            </select>
            return _build_select
        }
    }


    build_details = () =>{
        let _details = [];
        for(var i=0; i<10; i++){
            let _main_details = i
            _details[i] = <tr>
                <td>{i+1}</td>
                <td><input className="form-control" defaultValue={''} name={`item_name[${i}]`} id={_main_details} onChange={(e)=>this.handle_change(e.target.value, _main_details,'input')}/></td>
                <td>{this.build_select(i)}</td>
                {this.props.type=="ff" && 
                  <td>{this.build_select_com_type(i)}</td>
                }

                {this.props.type=="rfq" && 
                    <Fragment>
                         <td><input className="form-control"type="number"   defaultValue={''} name={`RD_QUANTITY[${i}]`} id={_main_details} onChange={(e)=>this.handle_change(e.target.value, _main_details,'RD_QUANTITY')}/></td>
                         <td><input className="form-control" type="number" defaultValue={''} name={`RD_DELIVERY_LEAD_TIME[${i}]`} id={_main_details} onChange={(e)=>this.handle_change(e.target.value, _main_details,'RD_DELIVERY_LEAD_TIME')}/></td>
                    </Fragment>
                }
              
            </tr>
        }
        return _details;
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
            itemTypeList: _checkbox,
        }
        _form_value.buyerDto = Object.assign({}, _initial_obj,(_form_value.buyerDto) ? _form_value.buyerDto : _form_value )
        this.props.GetBuyerCatlogSearch(_form_value)
        
    }

    closeModel = () =>{
        this.setState({
            open:false,
        })
    }
    render(){
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.fl_loading) ? <Loader /> : '' }
            
            
                
                <Alert 
                    title={'Validation Message'}
                    message='Please Select Atleast One Item'
                    status={this.state.status} 
                    show={this.state.open} 
                    confirm={this.closeModel}
                />
                <div className="row mt-2">    
                    <div className='col-12'> 
                        {this.build_details}
                        <table className="table table-striped head-info">
                            <thead>
                                <th style={{'width':'40px'}}>No</th>
                                <th>Item Name <span className="text-danger">*</span></th>
                                <th>UOM <span className="text-danger">*</span></th>
                                {this.props.type=="ff" && 
                                  <th>Commodity Type <span className="text-danger">*</span></th>
                                }
                                {this.props.type=="rfq" && 
                                <Fragment>
                                    <th>Qty</th>
                                    <th>Delivery Lead Time(Days)</th>
                                 </Fragment>
                                }
                            </thead>
                            <tbody>
                                {this.build_details()}
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col-md-6 col-lg-6 text-left">
                               
                                <button type="submit" className="btn btn-sm btn-outline-danger" id="showBtn" onClick={()=>this.props.closemodel()}>Close</button>
                                <button type="submit" className="btn btn-sm btn-outline-info ml-2" id="showBtn" onClick={this.rise_pr}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
        </Fragment>
    }
}


const mapStateToProps = state => ({
    free_form : state.free_form.responseList,
    fl_loading : state.free_form.loading,
    
    pr_loading: state.raise_pr.loading,
    pr_response: state.raise_pr.responseList
})

const mapDispatchToProps = dispatch => ({
    GetFreeFormDetails  : () => dispatch(GetFreeFormDetails()),
    RaisePR  : (values) => dispatch(RaisePR(values)),
})

const BuyerCatalogueHolder = connect(mapStateToProps, mapDispatchToProps)(BuyerCatalogue);

export default BuyerCatalogueHolder;
