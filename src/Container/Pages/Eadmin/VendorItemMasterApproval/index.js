import React,{Component, Fragment} from 'react';
import {Field, reduxForm } from 'redux-form';
import Loader from '../../../../Component/Loader'
import TabHeading from '../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {connect} from 'react-redux'
import { CompanyDetailsList} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import {GetVendorDetail} from '../../../../Actions/Eadmin'
import Alert from '../../../../Component/Modal/alert'
import {FromInputsParallel} from '../../../../Component/From/FromInputs'
class Report extends Component{
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this)
        this.getProducts = this.getProducts.bind(this);
        this.state = {
            products:[],
            modal_body : '',
            modal : false,
            status : false,
            modal : false,
            rendered: false,
            title:'',
            message:'',
            status:false,
            show:false,
            render:false,
            selected_row : [],
            strApp:[],
            search_object : {
                "status":"" ,
                "strApp":[],
                "strVendorItemCode": "",
                "strDesc":"" ,
                "type": "A"
            }
        }
    }

    componentDidMount(){
        this.props.GetVendorDetail(this.state.search_object)
        this.LoadDetails();
    }

    static getDerivedStateFromProps(props, state){
        if((!state.rendered) && (props.report_list) && (props.report_list.length > 0)){
            return {
                rendered:true,
                products : [...props.report_list]
            }
        }
        return false
    }

    async LoadDetails(){
        this.setState({loading:true})
        let _status = await ApiExtract(CompanyDetailsList, {});
        if(_status){
            if(_status.status){
                let {companyDetails} = _status.response

                    this.setState({
                        loading:false,
                        // CoyId:companyDetails && companyDetails.CoyId,
                        // vendorType: companyDetails && companyDetails.CoyType,
                    })

                //    console.log('companyDetails.CoyType ',companyDetails.CoyType);
                    if(companyDetails && companyDetails.CoyType == 'BUYER'){
                        this.setState({
                            loading:false,
                            show:true,
                            title : '',
                            status :false,
                            message : 'List Price Catalogue Approval can only be done only for Vendor Company',
                        })
                    }
            }
        }
    }

    componentDidUpdate(){
        if(!this.state.render && this.props.matrix_list && this.props.matrix_list.length>0){
            let {matrix_list} = this.props
            let _selected_row = matrix_list.map((list_details, index)=>{
                return (list_details.CHK==1) ? list_details.RM_REPORT_NAME : null
            })
            _selected_row = _selected_row.filter(list=>list!=null)
            this.setState({
                selected_row : _selected_row,
                render : true
            })
        }
    }

    handleCheckbox = (e, list) => {
        let {strApp} = this.state;
        if(e.target.checked){
            strApp.push(list)
        }
        else{
            strApp = strApp.filter((lists)=>lists!=list)
        }
        this.setState({
            strApp : strApp
        })
    }

    closemodel = () =>{
          this.setState({
            show : false
        })
        this.props.history.push('/')
    }

    handlefromsubmit= async(values) =>{
        let {search_object} = this.state
        console.log('values ',values);
        let _values  = Object.assign({}, values)

        console.log('_values ',_values);
        _values.strApp = this.state.strApp;
        _values.type = "A";
        if(1){
             this.props.GetVendorDetail(_values)
             this.setState({
                 show_table : true,
                 search_object : _values
             })

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
    ClearAll = () =>{
        this.setState({
            strApp : []
        })
        this.props.reset('ReportHolder')
    }

    SelectAll = () => {
        this.setState({
            strApp : ["1","2","3"]
        })
    }

    Add = () =>{
    }

    Modify = () =>{
    }

    Delete = () =>{
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
            let _products = this.state.products.filter((fieldValue, index) => fieldValue.PM_PRODUCT_INDEX != values.PM_PRODUCT_INDEX);
             await this.setState({
                products : _products
            })
        }
    }

    get_details = (row) =>{
        if(row){
        }
        else{
        }
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Item Code", id:"PM_VENDOR_ITEM_CODE", width:'100px', key:true, formatter: (cellContent, row) => {
                      return (
                          <span className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.PM_VENDOR_ITEM_CODE}</span>
                      )
                  },
            },
            {name : "Item Name", id:"PM_PRODUCT_DESC", width:'100px'},
            {name : "Currency", id:"PM_CURRENCY_CODE", width:'50px'},
            {name : "Price", id:"PM_UNIT_COST", width:'100px', formatter: (cellContent, row) => {
                return (
                    <div style={{"text-align": "right"}}>{row.PM_UNIT_COST.toPrecision(6)}</div>
            )},},
            {name : "UOM", id:"PM_UOM", width:'40px'},
            {name : "Remarks", id:"PM_REMARK", width:'100px'},
            {name : "Submission Date", id:"PM_ENT_DT", width:'100px'},
            {name : "Action", id:"PM_ACTION", width:'40px', formatter: (cellContent, row) => {
                return (
                    <div >{row.PM_ACTION == 'N'? 'New' : ''}</div>
            )},},
            {name : "Status", id:"STATUS_DESC", width:'100px'},
        ];
        let {products} = this.state
        let {vendor_detail_list} = this.props
        console.log('working')
        return <Fragment>
               {(this.props.loading) ? <Loader /> : '' }
               {(this.state.loading) ? <Loader /> : '' }
              <div className="show_list">
                    <TabHeading color={'bg-info text-white margin-bottom-none'}> Search Criteria</TabHeading>
                    <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className='row'>
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <Field type="text" name="strVendorItemCode" component={FromInputsParallel} className="form-control" placeholder="Vendor Item Code" label="Vendor Item Code" />
                                <Field type="text" name="strDesc" component={FromInputsParallel} className="form-control" placeholder="Item Name" label="Item Name" />
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 col-sm-9">
                                    <div className="row">
                                        <div className="col-12 col-sm-3 col-md-2">
                                            Status :
                                        </div>
                                        <div className="col-12 col-sm-9">
                                                <div class="checkbox-inline-block">
                                                    <input type="checkbox" className="" name="strApp[]" value={"1"} onClick={(e)=>this.handleCheckbox(e, "1")} checked={this.state.strApp.includes("1")}/>  Pending For Approval
                                                </div>
                                                <div class="checkbox-inline-block">
                                                    <input type="checkbox" className="" name="strApp[]" value={"2"} onClick={(e)=>this.handleCheckbox(e, "2")} checked={this.state.strApp.includes("2")}/>  Rejected By Hub Admin
                                                </div>
                                                <div class="checkbox-inline-block">
                                                    <input type="checkbox" className="" name="strApp[]" value={"3"} onClick={(e)=>this.handleCheckbox(e, "3")} checked={this.state.strApp.includes("3")}/>  Approved By Hub Admin
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 mt-2 text-right">
                                    <button type="submit" className="btn btn-sm btn-outline-success" >Search</button>
                                    <button type="button" className="btn btn-sm btn-outline-primary ml-2"  onClick={()=>this.SelectAll()}>Select All</button>
                                    <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.ClearAll()}>Clear</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>

                <div className='col-12'>
                       <BootstrapCustomTable
                           table_header={_table_header}
                           table_body={(vendor_detail_list) ? vendor_detail_list : []}
                           products={this.getProducts}
                           select={true}
                           selectname={'pr_no'}
                           responsive={true}
                           click={false}
                           table_name="issue_grn"
                           selectall={this.getProductsall}
                       />
                   </div>
                </div>
                <Alert
                                    confirm={this.closemodel}
                                    message={this.state.message}
                                    status={this.state.status}
                                    show={this.state.show}
                 />
     </Fragment>
    }
}


const mapStateToProps = state => ({
    vendor_detail_list : state.vendor_detail_list.responseList,
    loading : state.vendor_detail_list.loading,
})

const mapDispatchToProps = dispatch => ({
    GetVendorDetail  : (values) => dispatch(GetVendorDetail(values)),
})

const ReportHolder = connect(mapStateToProps, mapDispatchToProps)(Report);
export default reduxForm({
    form:'ReportHolder',
})(ReportHolder);
