import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import PageHeading from '../../../../Component/Heading/PageHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Alert from '../../../../Component/Modal/alert'
import {GetVendorMapList} from '../../../../Actions/Eadmin'
import {VendorMapCode} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
class DashboardMaster extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
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
            search_object : {
                "frm":"master",
                "role":""
            }
        }
    }

    getDerivedStateFromProps = () => {     
        
        if(this.props.vendor_map_list && (!this.state.rendered) && this.props.vendor_map_list.length){
            console.log('state.rendered ',this.state.rendered);
            this.setState({
                products: this.props.vendor_map_list,
                rendered : true
            })
        }
    }


    componentDidMount(){
        this.props.GetVendorMapList(this.state.search_object)
        this.getDerivedStateFromProps();
    }

    closeModel (details){
        this.setState({
            show : false,
            rendered : false
        })
    }

    ChangeValue = async(values, props) =>{
        let {products} = this.state;
        let _details = [];
        if(products && products.length){
            _details =  await products.map( (list_item, index)=>{
                if(list_item.CM_COY_ID == props.CM_COY_ID){
                    list_item.VM_VENDOR_MAPPING = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            products : _details
        })
    }   

    Save = async() =>{
        let {products} = this.state;
        if(products && products.length){
            this.setState({loading:true})
            let _status = await ApiExtract(VendorMapCode, {mapData:products});
            if(_status){
                this.setState({
                    loading:false,
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
        }
        else{
            this.setState({
                loading:false,
                show:true,
                title : '',
                status :false,
                message : 'No master item to save',
            })
        }
    }


    componentWillReceiveProps(nextProps) {     
        this.setState({products: nextProps.vendor_map_list});
    }

    Reset = async () =>{     
        await this.props.GetVendorMapList(this.state.search_object)       
        this.setState((prevState, props) => {
            return {products: []};
          })
          this.setState((prevState, props) => {
            return {rendered : false};
          })
    }

    render(){
    
        const _table_header = [
            {name : "Company ID", id:"CM_COY_ID", width:'30px', key:true},
            {name : "Company Name", id:"CM_COY_NAME", width:'30px'},
            {name : "External Vendor Code", id:"VM_VENDOR_MAPPING", width:'136px', formatter: (cellContent, row) => {
                return(
                    <input type="input" data-name={'1'} className="form-control" name={`name[${row.CM_COY_ID}]`} onChange={(e)=>this.ChangeValue(e.target.value, row)} value={row.VM_VENDOR_MAPPING} />
                )
            }},
        ]

      

        const {products}= this.state;

        console.log('reset ',products);

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              <div className="show_list">  
                <PageHeading 
                    heading="Vendor Mapping"
                    subheading="" 
                />
                    <div className="row mt-2">    
                        <div className='col-12'>   
                            <BootstrapCustomTable 
                                table_header={_table_header} 
                                table_body={products} 
                                products={this.getProducts} 
                                select={false} 
                                click={false}
                                responsive={true} 
                                selectall={this.getProductsall}
                                change={true}
                                getInputs={this.handleTableInputs}
                            />
                             <Alert 
                                message={this.state.message}
                                status={this.state.status} 
                                show={this.state.show} 
                                confirm={this.closeModel}
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.Save()}>Save</button><button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={()=>this.Reset()}>Reset</button> </div>
                    </div>
                </div>
        
                 
     </Fragment>
    }
}


const mapStateToProps = state => ({
    vendor_map_list : state.vendor_map_list.responseList,
    loading : state.vendor_map_list.loading,
})
  
const mapDispatchToProps = dispatch => ({
    GetVendorMapList  : (values) => dispatch(GetVendorMapList(values)),
})

const DashboardMasterHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardMaster);
export default DashboardMasterHolder