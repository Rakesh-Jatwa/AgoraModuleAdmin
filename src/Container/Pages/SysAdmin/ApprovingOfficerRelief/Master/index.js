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
            return {
                products:props.dashboard_listing.responseList,
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
        if(search_object){
            this.props.GetDashboardList(this.state.search_object)
        }

    }

    handleSelect = (e) =>{
        let _details = e.target.value;
        if(_details){
            let _temp_details = this.state.search_object
            _temp_details.role = _details
        }
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

    render(){

        const _table_header = [
            {name : "Catalogue", id:"DM_FIXED_ROLE_ID",  formatter: (cellContent, row) => {
                return (
                    <button type="button" className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.DM_FIXED_ROLE_ID}</button>
                )
            },
        },
        {name : "Purchaser", id:"DM_PANEL_NAME", key:true}]

       

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              <div className="show_list">  
              <PageHeading 
                    heading=""
                    subheading="" 	
                />
                 <TabHeading color={'bg-info text-white'}>For Approving Officer</TabHeading>
                 <form>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> Start Date<span classNmae="text-danger">*</span> : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="date" className="form-control" value="2011-08-19" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>End Date<span classNmae="text-danger">*</span> : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="date" className="form-control" value="2011-08-19" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div> 
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-12">
                                                    <p>Note - <span className="text-danger">*</span> indicates required field</p>
                                                </div>
                                            </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm">Save</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Cancel</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Etend</button>
                                </div>
                            </div>
                        </div>
                    </form>                  
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