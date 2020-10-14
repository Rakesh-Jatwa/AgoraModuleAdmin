import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {Field,reduxForm } from 'redux-form';
import {FormDatePickerParallel} from '../../../../../Component/From/FromInputs'
import {connect} from 'react-redux'
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
                 <PageHeading  heading="" subheading=" Fill in the search criteria and click on Search button to list the relevant File Recovery.  "  />
                 <TabHeading>  Search Criteria</TabHeading> 
                
                    <div className="col-12 col-md-12">
                        <div className="row mt-2">

                        <Field type="text" name="cndn_search.start_date" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Payment Start Date : " />
                     
                        <Field type="text" name="cndn_search.end_date" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallel} className="form-control" placeholder="End Date" label="Payment End Date : " minDate={this.state.start_data}   /> 
               
                        <Field type="text" name="cndn_search.start_date" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Recovery Start Date : " />
                     
                        <Field type="text" name="cndn_search.end_date" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallel} className="form-control" placeholder="End Date" label="Recovery End Date : " minDate={this.state.start_data}   /> 
               

                    </div>
                    </div>
                    <div className="col-12">
                            <div className="text-right mt-2 row">
                                <div className="col-12">
                                    <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>                                  
                                    <button type="reset" className="ml-4  btn btn-outline-danger btn-sm">Clear</button>
                                </div>
                            </div>
                    </div>
                    <div className="col-12 col-md-12">
                                <div className="row">
                                   <div className="col-12 col-md-2">Payment Date</div>
                                   <div className="col-12 col-md-2">Recovery Date</div>
                                   <div className="col-12 col-md-2">No of Record</div>
                                   <div className="col-12 col-md-2">Total Debit</div>
                                   <div className="col-12 col-md-2">Total Credit</div>
                                </div>
                    </div>
                            {/* <div className="col-12 col-md-3 "><label>User Role : {this.state.search_object.role} </label></div> */}
                            {/* <div className="col-12 col-md-9">
                                
                                <select className="form-control" onChange={(e)=>this.handleSelect(e.target.value)} disable_input={(this.state.modeType=="rights") ? true : false} value={this.state.search_object.role}>
                                    <option value="">--Select--</option>
                                    {( this.props.fixed_roles && this.props.fixed_roles.length) ? this.props.fixed_roles.map((list)=>{
                                        return <option value={list.FR_ROLE_ID}>{list.FR_ROLE_ID}</option>  
                                    }) :''}
                                </select>
                            </div> */}
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

export default reduxForm({
    form:'DashboardMasterHolder',
})(DashboardMasterHolder);
