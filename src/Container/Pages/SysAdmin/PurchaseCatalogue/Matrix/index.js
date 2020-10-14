import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin'
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
            show_roles:false,
            status:false,
            show:false,
            search_object : {
                "frm":"matrix",
                "role":""
            }
        }
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
        this.props.GetFixedRoles()
    }

    componentDidUpdate(){
        let _details = this.props.get_role()
        let {search_object} = this.state
        if(_details && _details.role_id && _details.render){
            this.props.block_render()
            this.handleSelect(_details.role_id);
            search_object.role = _details.role_id
            this.setState({
                search_object : search_object
            })
        }
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

    handleSelect = (e) =>{
        let _details = e;
        if(_details){
            let _temp_details = this.state.search_object
            _temp_details.role = _details
           
            this.setState({
                show_roles:true,
                rendered:false
            })
            this.props.GetDashboardList(_temp_details)
        }
       
    }

    render(){
    
        const _table_header = [
            {name : "Dashboard Panel Name", id:"dm_panel_name", key:true},
            {name : "Allow View", id:"dm_fixed_role_id", width:'136px', formatter: (cellContent, row) => {
                return(
                   <input type="checkbox" />
                )
            }},
        ]

       

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              <div className="show_list">  
              <PageHeading 
                    heading=""
                    subheading="Step 1: Create user defined Purchase Catalogue" 
                />
                <PageHeading 
                    subheading="Step 2: Assign item master to Purchaser Catalogue" 
                />
                <PageHeading 
                    subheading="Step 3: Assign purchaser to Purchaser Catalogue" 
                />
                <PageHeading 
                    subheading="The system comes with the Default Purchaser Catalogue which can be immediately assigned to the Purchaser."
                />
                <PageHeading 
                    subheading="Note: Default Purchaser Catalogue consists of all items in the Item Master that have been created in the system. " 
                />
                 <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                 <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="row">
                                <div className="col-12 col-md-3 "><label>Purchaser Catalogue: </label></div>
                                <div className="col-12 col-md-9">
                                    <select className="form-control" onChange={(e)=>this.handleSelect(e)}>
                                        <option value="">--select--</option>
                                    </select>
                                </div>
                            </div>
                          
                        </div>
                    </div>
                    <div className="table-responsive check_table">
                        <table className="table table-striped table-hover table-bordered">
                            <thead className="thead-primary">
                                <th ><input type="checkbox" /></th>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Commodity Type</th>
                                <th>UOM</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="align-middle"><input type="checkbox" value="1" /></td>
                                    <td className="align-middle"> AP0001 </td>
                                    <td className="align-middle">Microwave Oven</td>
                                    <td className="align-middle">PAMB General</td>
                                    <td className="align-middle">Unit</td>
                                </tr>
                                <tr>
                                <td className="align-middle"><input type="checkbox" value="1" /></td>
                                    <td className="align-middle"> AP0001 </td>
                                    <td className="align-middle">Microwave Oven</td>
                                    <td className="align-middle">PAMB General</td>
                                    <td className="align-middle">Unit</td>
                                </tr>
                                <tr>
                                <td className="align-middle"><input type="checkbox" value="1" /></td>
                                    <td className="align-middle"> AP0001 </td>
                                    <td className="align-middle">Microwave Oven</td>
                                    <td className="align-middle">PAMB General</td>
                                    <td className="align-middle">Unit</td>
                                </tr>
                                <tr>
                                    <td className="align-middle pl-2" colSpan="5"><p className="pl-2">7 record(s) found. <span>1 page(s) found.</span></p></td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                    <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.Search()}>Add</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Remove</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 pl-3">
                            <div className="row mb-2">
                                <div className="col-12">
                                    <ol className="pl-1 ml-0">
                                        <li>Click Add button to add new item master to the selected user defined Purchaser Catalogue (Not applicable to Default Purchaser Catalogue).</li>
                                        <li>Click Remove button to delete item master from the selected user defined Purchaser Catalogue (Not applicable to Default Purchaser Catalogue). </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                   
                </div>
        
                 
     </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing : state.dashboard_listing.responseList_1,
    loading : state.dashboard_listing.loading,
    fixed_roles : state.fixed_roles.responseList
})
  
const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles  : (values) => dispatch(GetFixedRoles(values)),
})

const DashboardMasterHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardMaster);
export default DashboardMasterHolder