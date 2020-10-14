import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
// import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin'
// import {ApiExtract} from '../../../../../Common/GetDatas'
import{ ApprovalProcessItemAssigment} from '../../../../../Actions/SysAdmin';

class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.onRowSelectHandler = this.onRowSelectHandler.bind(this)

        this.state = {
            group_types_list:[],
            approval_group_list:[],
            item_assignment_data:[],
            saveButtonDisable: true,
            itemCode:"",
            itemName:"",
            itemCodeType:"S",
            selectedItems:[],
            products:[],
            modal_body : '',
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

    componentDidUpdate(prevProps) {
        if(prevProps.approval_procss_item_assignment !== this.props.approval_procss_item_assignment){    
            let list = []
            let data = this.props.approval_procss_item_assignment.responseList
            console.log("approval_procss_item_assignment",data)    
            
            for( let i=0; i < data.length; i++) {
                list[i] = {
                  "ITEM_CODE": data[i].ITEM_CODE,
                  "ITEM_NAME": data[i].ITEM_NAME,
                  "COMMODITY_TYPE": data[i].COMMODITY_TYPE,
                  "UOM": data[i].UOM,
                  "STATUS": data[i].STATUS,                
                }
            }

            this.setState({
                item_assignment_data : list,
            });
        }

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

    handleSelect = (e) => {

        let _details = e.target.value;

        if (_details) {
          let _temp_details = this.state.search_object;
          _temp_details.role = _details;
          let data = { 
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
          };

          this.setState({
            saveButtonDisable: false
          });

          this.props.ApprovalProcessItemAssigment(data);
        } else {
          this.setState({
            resetButtonDisable: true,
          });

        }
  };

  onRowSelectHandler = (row, isSelected, e) => {
        let tempArray = this.state.selectedItems;
        if(isSelected){
            tempArray.push(row);

        } else {
            tempArray = tempArray.filter(function(ele){ return ele !== row;})
        }
        console.log(tempArray)
        this.setState({
            selectedItems: tempArray
        })
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
        const {group_types_list, approval_group_list} = this.props
        const {itemCode, itemName, itemCodeType} = this.state
        const {item_assignment_data} = this.state

        const _header =  [
            {name : "Item Code", id : "ITEM_CODE", key : true, sort: true},
            {name : "Item Name", id : "ITEM_NAME", key : false, sort: true},
            {name : " Commodity Type", id : "COMMODITY_TYPE", key : false, sort: true},
            {name : "UOM", id : "UOM", key : false, sort: true},
            {name : "Status", id : "STATUS", key : false, sort: true},
        ];

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              <div className="show_list">  
              <PageHeading 
                    heading=""
                    subheading="Step1: Create, delete or modify Approval Group"     
                />
                <PageHeading 
                    heading=""
                    subheading="Step2: Assign Approving Officer to the Selected Approval Group" 
                />
                <PageHeading
                    heading="" 
                    subheading="Step3: Assign User to the Selected Approval Group" 
                />
                 <PageHeading
                    heading="" 
                    subheading="Please select Approval Group Type and the related Approval Group" 
                />
                 <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                 <form>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Group Type : </label></div>
                                            <div className="col-12 col-md-8">
                                                <select className="form-control" onChange={(e) => this.handleSelect(e)}>
                                                   <option value="null">---Select---</option>
                                                    {
                                                        group_types_list || group_types_list.length ? group_types_list.map((id, index) => (
                                                            <option key={index} id={id.GROUP_ID} value={id.GROUP_ID}>{id.GROUP_NAME}</option>
                                                            ))
                                                            : 
                                                            null

                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Approval Group : </label></div>
                                            <div className="col-12 col-md-8">
                                                <select className="form-control">
                                                       <option value="null">---Select---</option>

                                                    {
                                                        approval_group_list || approval_group_list.length ? approval_group_list.map((id, index) => (
                                                            <option key={index} id={id.GROUP_ID} value={id.GROUP_ID}>{id.GROUP_NAME}</option>
                                                            ))
                                                            : 
                                                            null
                                                    }

                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Department : </label></div>
                                            <div className="col-12 col-md-8">
                                                    <label>Agency-Ipoh </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>IQC Type : </label></div>
                                            <div className="col-12 col-md-8">
                                                    <label> ST  </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Item Code : </label></div>
                                            <div className="col-12 col-md-8">
                                                    <input name="" type="text" value={itemCode} onChange={(e)=>this.setState({
                                                        itemCode:e.target.value 
                                                    })} className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Item Name : </label></div>
                                            <div className="col-12 col-md-8">
                                                    <input name="" type="text" value={itemName} onChange={(e)=>this.setState({
                                                        itemName:e.target.value 
                                                    })}  className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                    <div className="form-check form-check-inline">
                                        <input classNmae="form-check-input" 
                                            type="radio" 
                                            name="inlineRadioOptions" 
                                            id="inlineRadio1" 
                                            checked={itemCodeType === "A" ? "checked" : null }  
                                            value="A" 
                                            onChange={(e)=>this.setState({
                                                itemCodeType : e.target.value
                                            })}
                                            />
                                        
                                        <label className="form-check-label ml-2" for="inlineRadio1">Available Item Code</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input classNmae="form-check-input" 
                                            type="radio" 
                                            name="inlineRadioOptions" 
                                            id="inlineRadio2" 
                                            value="S"  
                                            checked={itemCodeType === "S" ? "checked" : null } 
                                            onChange={(e)=>this.setState({
                                                itemCodeType : e.target.value
                                            })}
                                            />
                                        <label className="form-check-label ml-2" for="inlineRadio2">Selected Item Code</label>
                                    </div>
                                    
                                    </div>
                                </div>

                                <div className="row mt-4">

                                    {
                                        item_assignment_data.length  && this.state.item_assignment_data ?
                                                        <BootstrapCustomTable
                                                                    table_header={_header}
                                                                    table_body={this.state.item_assignment_data}
                                                                    select={true}
                                                                    selectname={'pr_no'}
                                                                    responsive={true}
                                                                    click={false}
                                                                    table_name="issue_grn"
                                                                    pagination={true}
                                                                    products={this.onRowSelectHandler}
                                                                />
                                                                :
                                                                null
                                    }

                                   

                                    { /* <div className="table-responsive check_table">
                                                                        <table className="table table-striped table-hover table-bordered">
                                                                            <thead className="thead-primary">
                                                                                <th><input type="checkbox" /></th>
                                                                                <th>Item Code</th>
                                                                                <th>Item Name</th>
                                                                                <th>Commodity Type</th>
                                                                                <th>UOM</th>
                                                                                <th>Status</th>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="align-middle"><input type="checkbox" value="1" /></td>
                                                                                    <td className="align-middle">IV-QC0001  </td>
                                                                                    <td className="align-middle">  Inventory Item 
                                                                                    </td>
                                                                                    <td className="align-middle">PAMB General 
                                                                                    </td>
                                                                                    <td className="align-middle">Unit</td>
                                                                                    <td className="align-middle">Active</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="align-middle pl-2" colSpan="6"><p className="pl-2">7 record(s) found. <span>1 page(s) found.</span></p></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        
                                                                    </div>
                                                                    */}
                                </div>
                                    <div className="row mb-3 mt-3">
                                        <div className="col-12">
                                        <button
                                                type="button"
                                                className="btn btn-outline-success btn-sm"
                                                disabled={this.state.saveButtonDisable}
                                                >
                                                Save
                                                </button>

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
    fixed_roles : state.fixed_roles.responseList,
    group_types_list: state.group_types_list.responseList,
    approval_group_list: state.approval_group_list.responseList,
    approval_procss_item_assignment: state.approval_procss_item_assignment,
    

})
  
const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles  : (values) => dispatch(GetFixedRoles(values)),
    ApprovalProcessItemAssigment: (values) => dispatch(ApprovalProcessItemAssigment(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder