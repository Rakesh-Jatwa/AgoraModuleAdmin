import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
// import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin'
// import {ApiExtract} from '../../../../../Common/GetDatas'
import{ ApprovalProcessUserAssigment} from '../../../../../Actions/SysAdmin';

class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleAvailablePurchaserSelect = this.handleAvailablePurchaserSelect.bind(this);
        this.handleSelectedPurchaserSelect = this.handleSelectedPurchaserSelect.bind(this);
        this.onAssignClick = this.onAssignClick.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onResetClick = this.onResetClick.bind(this);



        this.state = {
            resetButtonDisable: true,
            saveButtonDisable: true,
            group_types_list:[],
            approval_group_list:[],
            available_user_assignment_data:[],
            selected_user_assignment_data:[],
            selectedItemToAssign: [],
            selectedItemToRemove: [],

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
        if(prevProps.approval_process_user_assignment !== this.props.approval_process_user_assignment){
            console.log("this.props.approval_process_user_assignment",this.props.approval_process_user_assignment)
            this.setState({
                available_user_assignment_data : this.props.approval_process_user_assignment.availablePurchasers,
                selected_user_assignment_data : this.props.approval_process_user_assignment.selectedPurchasers,
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

    // handleSelect = (e) =>{
    //     let _details = e.target.value;
    //     if(_details){
    //         let _temp_details = this.state.search_object
    //         _temp_details.role = _details
    //     }
    // }


  handleSelect = (e) => {

    let _details = e.target.value;

    if (_details !== "null") {
      let _temp_details = this.state.search_object;
      _temp_details.role = _details;
      let data = { 
        "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
      };

      this.setState({
        cboCatalogueBuyer: parseInt(_details, 10),
        saveButtonDisable: false
      });

      this.props.ApprovalProcessUserAssigment(data);
    } else {

      this.setState({
        resetButtonDisable: true,
        saveButtonDisable: true,
        available_user_assignment_data:[],
        selected_user_assignment_data:[]
      });

    }
  };



  handleAvailablePurchaserSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = this.state.available_user_assignment_data.findIndex(ele =>
        ele.GROUP_ID ===  selectedOptions[i].value
      );
      tempArray.push(this.state.available_user_assignment_data[itemIndex]);
    }
    this.setState({
      selectedItemToAssign: tempArray
    });
  };

  handleSelectedPurchaserSelect = (evt) => {
    let selectedOptions = evt.target.selectedOptions;
    let tempArray = [];
    for(let i=0; i<selectedOptions.length; i++){
      let itemIndex = this.state.selected_user_assignment_data.findIndex(ele =>
        ele.GROUP_ID ===  selectedOptions[i].value
      );
      tempArray.push(this.state.selected_user_assignment_data[itemIndex]);
    }
    this.setState({
      selectedItemToRemove: tempArray
    });
  };


  onAssignClick = () => {
    let tempArray = this.state.available_user_assignment_data;
    tempArray = tempArray.filter(e => !this.state.selectedItemToAssign.includes(e));
    this.setState({
      selected_user_assignment_data: this.state.selected_user_assignment_data.concat(this.state.selectedItemToAssign),
      available_user_assignment_data: tempArray,
      selectedItemToAssign: [],
      resetButtonDisable: false,
    })
  };

  onRemoveClick = () => {
    let selectedTempArray = this.state.selected_user_assignment_data;
    selectedTempArray = selectedTempArray.filter(e => !this.state.selectedItemToRemove.includes(e))
    let availableTempArray = this.state.available_user_assignment_data.concat(this.state.selectedItemToRemove);
    this.setState({
      available_user_assignment_data: availableTempArray,
      selected_user_assignment_data: selectedTempArray,
      selectedItemToRemove: [],
      resetButtonDisable: false,
    })
  };

  onResetClick = () => {
    this.setState({
      available_user_assignment_data: this.props.approval_process_user_assignment.availablePurchasers,
      selected_user_assignment_data: this.props.approval_process_user_assignment.selectedPurchasers,
      selectedItemToAssign: [],
      selectedItemToRemove: []
    })
  };


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

        const {available_user_assignment_data, selected_user_assignment_data} = this.state
        const {group_types_list, approval_group_list} = this.props
        
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
                    subheading="=>Step3: Assign User to the Selected Approval Group" 
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
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Group Type : </label></div>
                                            <div className="col-12 col-md-6">
                                                <select className="form-control" onChange={(e) => this.handleSelect(e)}>

                                                    <option value="null">---Select---</option>
                                                    {
                                                        group_types_list || group_types_list.length ? group_types_list.map((id, index) => (
                                                            <option key={index} id={id.GROUP_ID} value={id.GROUP_ID}>{id.GROUP_NAME}</option>
                                                            ))
                                                            : 
                                                            null

                                                    }


                                                    {/*
                                                      this.props.purchase_cate_data &&
                                                        this.props.purchase_cate_data.map((data, index) => (
                                                          <option value={data.BCM_CAT_INDEX} key={index}>
                                                            {data.BCM_GRP_DESC}
                                                          </option>
                                                      ))

                                                    */
                                                    }


                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Approval Group : </label></div>
                                            <div className="col-12 col-md-6">
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
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Department : </label></div>
                                            <div className="col-12 col-md-6">
                                                    <label>Department Name </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                <div className="table-responsive select_cstm">
                                        <table className="table">
                                            <thead className="thead-primary">
                                                <th>Available Purchasers </th>
                                                <th className="align-middle"><span className="invisible">Assign/Remove Value</span></th>
                                                <th>Selected Purchasers </th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="align-middle">
                                                    {
                                                      available_user_assignment_data && available_user_assignment_data.length  ?
                                                      (
                                                        <select
                                                          className="form-control"
                                                          multiple={true}
                                                          onChange={(e) => this.handleAvailablePurchaserSelect(e)}
                                                          style={{
                                                            'height': '150px',
                                                            'width': '100%',
                                                            'resize': 'none',
                                                            'padding': '10px 25px',
                                                            'marginTop': 25,
                                                          }}
                                                        >
                                                        {
                                                          available_user_assignment_data.map((data, index) => (
                                                            <option key={index} value={data.GROUP_ID}>{data.GROUP_NAME}</option>
                                                          ))
                                                        }
                                                      </select>
                                                    )
                                                      :
                                                        <textarea disabled></textarea>

                                                  }



                                                    
                                                    </td>
                                                    <td className="align-middle text-center btn_md">
                                                        <div className="col-12">
                                                            <button
                                                            type="button"
                                                            className="btn btn-outline-success btn-sm"
                                                            onClick={()=>{this.onAssignClick()}}
                                                            >
                                                            Assign
                                                            </button>
                                                            <br/>
                                                          <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm mt-2"
                                                            onClick={()=>{this.onRemoveClick()}}
                                                          >
                                                            Remove
                                                          </button>


                                                        </div>
                                                    </td>
                                                    <td className="align-middle">
                                                      {
                                                          selected_user_assignment_data && selected_user_assignment_data.length  ?
                                                          (
                                                            <select
                                                              className="form-control"
                                                              onChange={(e) => this.handleSelectedPurchaserSelect(e)}
                                                              multiple={true}
                                                              style={{
                                                                'height': '150px',
                                                                'width': '100%',
                                                                'resize': 'none',
                                                                'padding': '10px 25px',
                                                                'marginTop': 25,
                                                              }}
                                                            >
                                                            {
                                                              selected_user_assignment_data.map((data, index) => (
                                                                <option key={index} value={data.GROUP_ID}>{data.GROUP_NAME}</option>
                                                              ))
                                                            }
                                                          </select>
                                                        )
                                                          :
                                                        <textarea disabled></textarea>
                                                      }
                                                    


                                                    
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        
                                    </div>
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
                                             <button
                                               type="button"
                                               className="btn btn-outline-danger btn-sm ml-2"
                                               onClick={()=>{this.onResetClick()}}
                                               disabled={this.state.resetButtonDisable}
                                             >
                                               Reset
                                             </button>

                                        </div>
                                    </div>
                                 <div className="row mb-2">
                                <div>
                                    <ul className="pl-1 ml-0 list_style">
                                        <li>a) To assign Purchasers to the Approval Group, choose the name from 'Available Purchasers' and click Assign button</li>
                                        <li>b) To remove/unassign purchaser from the Approval Group, choose the 'Selected Purchasers' and click Remove button</li>
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
    fixed_roles : state.fixed_roles.responseList,
    group_types_list: state.group_types_list.responseList,
    approval_group_list: state.approval_group_list.responseList,
    approval_process_user_assignment: state.approval_process_user_assignment.responseList,
})
  
const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles  : (values) => dispatch(GetFixedRoles(values)),
    ApprovalProcessUserAssigment: (values) => dispatch(ApprovalProcessUserAssigment(values)),

})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder