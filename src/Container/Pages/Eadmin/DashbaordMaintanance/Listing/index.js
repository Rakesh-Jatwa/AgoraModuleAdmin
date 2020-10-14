import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin'
import {DashboardList} from '../../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../../Common/GetDatas'
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
            search_object : {
                "frm":"listing",
                "role" : "",
                "panelName":""
            }
        }
    }

    static getDerivedStateFromProps(props,state){
        if(props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList){

            const fixed_roles =  props.dashboard_listing.responseList.sort(function(a, b){
                if(a.DM_FIXED_ROLE_ID < b.DM_FIXED_ROLE_ID) return -1;
                if(a.DM_FIXED_ROLE_ID > b.DM_FIXED_ROLE_ID) return 1;
                return 0;
            })

            return {
                products: fixed_roles,
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

        console.log('search_object ',search_object);

        if(search_object){
            this.props.GetDashboardList(this.state.search_object)
        }

    }

    handleSelect = (e) =>{
        let _details = e.target.value;
      //  if(_details)
        {
            let _temp_details = this.state.search_object
            _temp_details.role = _details
        }
        this.setState({userRole: _details});
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

    sort_fixed_role = (fixed_roles) => {
        return fixed_roles =  fixed_roles && fixed_roles.length  ?  fixed_roles.sort(function(a, b){
            //compare two values
            if(a.FR_ROLE_ID < b.FR_ROLE_ID) return -1;
            if(a.FR_ROLE_ID > b.FR_ROLE_ID) return 1;
            return 0;

        }) :[];
    }

    ClearAll = async () =>{


       let search_object = {
        "frm":"listing",
        "role" : "",
        "panelName":""
    }
       this.props.GetDashboardList(search_object);

       await this.setState({userRole:"",panelName:'',search_object});
    }

    render(){

        const _table_header = [
            {name : "User Role", id:"DM_FIXED_ROLE_ID",  formatter: (cellContent, row) => {
                return (
                    <button type="button" className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.DM_FIXED_ROLE_ID}</button>
                )
            },
        },
        {name : "Dashboard Panel Name", id:"DM_PANEL_NAME", key:true}]

        const fixed_roles = this.sort_fixed_role(this.props.fixed_roles);

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }

              <div className="show_list">
                 <PageHeading  heading="Dashboard Listing" subheading="Fill the serach criteria and click search button to list the relevant dashboard."  />
                 <TabHeading>Dashboard Search</TabHeading>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="row mt-2">
                                <div className="col-12 col-md-4 "><label>User Role :</label></div>
                                <div className="col-12 col-md-8">
                                    <select className="form-control" value={this.state.userRole} onChange={(e)=>this.handleSelect(e)}>
                                        <option value="">--Select--</option>
                                        {( fixed_roles && fixed_roles.length) ? fixed_roles.map((list)=>{
                                            return <option value={list.FR_ROLE_ID}>{list.FR_ROLE_ID}</option>
                                        }) :''}
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div className="col-12 col-md-6">
                            <div className="row mt-2">
                                <div className="col-12 col-md-4"><label>Dashboard Panel Name :</label></div>
                                <div className="col-12 col-md-8">
                                    <input type="text" className="form-control" value={this.state.panelName} onChange={(e)=>this.handleInput(e)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4 mt-3">
                        <div className="col-12 text-right">
                            <button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.Search()}>Search</button>
                            <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={()=>this.ClearAll()}>Reset</button>
                        </div>
                    </div>
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
                </div>


     </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing : state.dashboard_listing.responseList_2,
    loading : state.dashboard_listing.loading,
    fixed_roles : state.fixed_roles.responseList
})

const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles  : (values) => dispatch(GetFixedRoles(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
