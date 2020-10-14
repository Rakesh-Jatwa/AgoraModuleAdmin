import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList} from '../../../../../Actions/Eadmin'
import {DashboardSave} from '../../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../../Common/GetDatas'
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

    static getDerivedStateFromProps(props,state){
        if(props.dashboard_listing && (!state.rendered) && props.dashboard_listing.length){
            return {
                products: props.dashboard_listing,
                rendered : true
            }
        }
    }


    componentDidMount(){
        this.props.GetDashboardList(this.state.search_object)
    }

    closeModel (details){
        this.setState({
            show : false,
        })
    }

    ChangeValue = async(values, props) =>{
        let {products} = this.state;
        let _details = [];
        if(products && products.length){
            _details =  await products.map( (list_item, index)=>{
                if(list_item.dm_dashboard_id == props.dm_dashboard_id){
                    list_item.dm_panel_name = values
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
            let _temp_details ={
                frm:"master",
                dashboardData : products
            }
            this.setState({loading:true})
            let _status = await ApiExtract(DashboardSave, _temp_details);
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
    render(){
    
        const _table_header = [
            {name : "Panel ID", id:"dm_dashboard_id", width:'10px', key:true},
            {name : "Panel Name", id:"dm_panel_name", width:'136px', formatter: (cellContent, row) => {
                return(
                    <input type="input" data-name={'1'} className="form-control" name={`name[${row.dm_dashboard_id}]`} onChange={(e)=>this.ChangeValue(e.target.value, row)} value={row.dm_panel_name} />
                )
            }},
        ]

       

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              <div className="show_list">  
                <PageHeading 
                    heading="Dashboard Master"
                    subheading="Fill in the dashboard panel name and click Save button to modify the dashboard panel name." 
                />
                    <div className="row mt-2">    
                        <div className='col-12'>   
                            <BootstrapCustomTable 
                                table_header={_table_header} 
                                table_body={this.state.products} 
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
                        <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.Save()}>Save</button> </div>
                    </div>
                </div>
        
                 
     </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing : state.dashboard_listing.responseList,
    loading : state.dashboard_listing.loading,
})
  
const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
})

const DashboardMasterHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardMaster);
export default DashboardMasterHolder