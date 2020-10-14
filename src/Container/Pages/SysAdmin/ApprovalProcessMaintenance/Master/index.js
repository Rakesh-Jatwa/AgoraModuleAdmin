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
                    heading="Steps-"
                    subheading="=> 1-Create, delete or modify Approval Group" 	
                />
                <PageHeading 
                    heading=""
                    subheading="2-Assign Approving Officer to the Selected Approval Group" 
                />
                <PageHeading
                    heading="" 
                    subheading="3-Assign User to the Selected Approval Group" 
                />
                 <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                 <form>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Group Type : </label></div>
                                            <div className="col-12 col-md-6">
                                                <select className="form-control">
                                                    <option value="">--select--</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Approval Group : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" name="" className="form-control" placeholder="" />
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12 mt-2 text-right"><button type="submit" className="btn btn-sm btn-outline-success">Search</button>
                                    <button type="reset" className="btn btn-sm btn-outline-danger ml-2">Clear</button></div>
                                </div>
                                <div className="row mt-4">
                                    <div className="table-responsive check_table">
                                    <table className="table table-striped table-hover table-bordered">
                                        <thead className="thead-primary">
                                            <th><input type="checkbox" /></th>
                                            <th>Approval Group</th>
                                            <th>Approving Officer / Alternative Approving Officer</th>
                                            <th>Buyer</th>
                                            <th>Department</th>
                                            <th>Type</th>
                                            <th>Residence</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="align-middle"><input type="checkbox" value="1" /></td>
                                                <td className="align-middle"> HPDNBO-PD-NewBnk&OthERERE </td>
                                                <td className="align-middle"> 1.Wen Han / Lee Ee <br />
                                                    2.Edmund / -<br />
                                                    3.Bernard / -<br />
                                                    4.Ahmad N / -<br />
                                                    5.Ng Sim / - 
                                                </td>
                                                <td className="align-middle">Kelly L<br />
                                                    Tin Ya <br />
                                                    June Ta<br />
                                                    Nor Far<br />
                                                    Chai Ch   
                                                </td>
                                                <td className="align-middle">Dept-PD-New Bank & Others</td>
                                                <td className="align-middle">PR</td>
                                                <td className="align-middle"></td>
                                            </tr>
                                            <tr>
                                                <td className="align-middle"><input type="checkbox" value="1" /></td>
                                                <td className="align-middle"> HPDNBO-PD-NewBnk&OthERERE </td>
                                                <td className="align-middle"> 1.Wen Han / Lee Ee <br />
                                                    2.Edmund / -<br />
                                                    3.Bernard / -<br />
                                                    4.Ahmad N / -<br />
                                                    5.Ng Sim / - 
                                                </td>
                                                <td className="align-middle">Kelly L<br />
                                                    Tin Ya <br />
                                                    June Ta<br />
                                                    Nor Far<br />
                                                    Chai Ch   
                                                </td>
                                                <td className="align-middle">Dept-PD-New Bank & Others</td>
                                                <td className="align-middle">PR</td>
                                                <td className="align-middle"></td>
                                            </tr>
                                            <tr>
                                                <td className="align-middle"><input type="checkbox" value="1" /></td>
                                                <td className="align-middle"> HPDNBO-PD-NewBnk&OthERERE </td>
                                                <td className="align-middle"> 1.Wen Han / Lee Ee <br />
                                                    2.Edmund / -<br />
                                                    3.Bernard / -<br />
                                                    4.Ahmad N / -<br />
                                                    5.Ng Sim / - 
                                                </td>
                                                <td className="align-middle">Kelly L<br />
                                                    Tin Ya <br />
                                                    June Ta<br />
                                                    Nor Far<br />
                                                    Chai Ch   
                                                </td>
                                                <td className="align-middle">Dept-PD-New Bank & Others</td>
                                                <td className="align-middle">PR</td>
                                                <td className="align-middle"></td>
                                            </tr>
                                            <tr>
                                                <td className="align-middle pl-2" colSpan="7"><p className="pl-2">7 record(s) found. <span>1 page(s) found.</span></p></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12 py-2 px-2 text-success">
                                        <p>Note - Deleted or Inactive user is displayed in red colour</p>
                                    </div>
                                 </div>
                                        <div className="row mb-3 mt-3">
                                            <div className="col-12">
                                                <button type="button" className="btn btn-outline-success btn-sm">Add</button>
                                                <button type="button" className="btn btn-outline-success btn-sm ml-2">Modify</button>
                                                <button type="button" className="btn btn-outline-danger btn-sm ml-2">Delete</button>
                                            </div>
                                        </div>  
                                 <div className="row mb-2">
                                <div>
                                    <ul className="pl-1 ml-0 list_style">
                                        <li>a) The system comes with two pre-defined Approval Group i.e. Purchasing Manager to Approving Officer Approval and Purchasing Officer to Approving Officer Approval</li>
                                        <li>b) Click Add button to add new user defined Approval Group</li>
                                        <li>c) Click Modify button to modify the system pre-defined Approval Group and user defined Approval Group</li>
                                        <li>d) Click Delete button to delete the system pre-defined Approval Group and user defined Approval Group</li>
                                        <li>e) Click Approval Officer Assignment to add Approving Officer to Approval Group</li>
                                        <li>f) Click 'User Assignment' to assign User to Approval Group</li>
                                    </ul>
                                </div>
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