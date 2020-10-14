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

import {
    GetConfigureDropDownData,
} from '../../../../../Apis/SysAdmin'
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
            },
            configureData:[],
            ShowTablesData:false,
            data:{
                configuredrpData:''
            },
            changvalue:{
                radio:''
            },
            configure_Array:[
                    {Code:"John",id:1 ,Address:"Doe",City:"Indore",State:"MP",PostCode:"dhsddhhjd",Country:"India"},
            ],
            showCustomFields:false,

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
        this.props.GetFixedRoles();
        this.getCongifure_drowpDownData();



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

    catchValuesonChange = (e) =>{
        let name = e.target.name;
        let value = e.target.value;
        let data = this.state.data
        data[name] = value;
        this.setState({
            data
        },
        ()=>{
            console.log('==================>',this.state)
        })
        if(this.state.data.configuredrpData==="Billing Address"){
            this.setState({
               ShowTablesData:true,
               showCustomFields:false
              });

       }
       else if(this.state.data.configuredrpData==="Delivery Address"){
        this.setState({
           ShowTablesData:true,
           showCustomFields:false
          })
        }
        else if(this.state.data.configuredrpData==="Custom Field"){
            this.setState({
                showCustomFields:true,
                ShowTablesData:false,
               })
        }
   else{
    this.setState({
        ShowTablesData:false,
        showCustomFields:false
       })
   }

      }


      listSelectedCatalogue = (e) =>{
        let name = e.target.name;
        let value = e.target.value;
        let changvalue = this.state.changvalue
        changvalue[name] = value;
        this.setState({
            changvalue
        })

      }

    getCongifure_drowpDownData = async() =>{

        let response = await ApiExtract(GetConfigureDropDownData
            , {

                    "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
                    "userId": JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
                    "configureFor": "",
                    "module": "",
                    "customFieldName": ""
        });

        this.setState({
            configureData:response.response
        })
        if(response){
            console.log('getCongifure_drowpDownData*******----------->',response);


        }
    }


    render(){
        const _table_header2 =  [
                       {name : "Code", id:"CF_MODULE", key:true, width:'30px'},
                     {name : "Address", id:"", key:false, width:'100px'},
                  {name : "City", id:"", key:false, width:'50px'},
                {name : "State", id:"", key:false, width:'50px'},
              {name : "Post Code", id:"", key:false, width:'30px'},
            {name : "Country", id:"", key:false, width:'50px'},

];

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
                    subheading="To configure default setting, choose an option and click Save button"
                />
                 <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                 <form>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Configure for : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <select className="form-control" name="configuredrpData" value={this.state.configuredrpData} onChange={(e)=>this.catchValuesonChange(e)}>

                                                    {this.state.configureData.map(item => (
                                                    <option  value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                                    </select>
                                                </div>
                                            </div>

                                         {
                                         this.state.showCustomFields?
                                        <div>
                                                  <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Module : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <select className="form-control" name="configuredrpData" >
                                                    <option>PO</option>
                                                    <option>PR</option>

                                                    </select>
                                                </div>
                                          </div>

                                          <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Custom Field Name : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <select className="form-control" name="configuredrpData" >
                                                    <option>sdjfsdfjd</option>
                                                    <option>fjhsdjfhdsjfh</option>
                                                    <option>fjhsdjfhdsjfh</option>
                                                    </select>
                                                </div>
                                          </div>
                                        </div>
                                         :null}


                                    </div>



                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="table-responsive check_table">

                                     <div className='col-12 mt-3 pl-0'>
                                           {
                            this.state.ShowTablesData ? (

                                     <BootstrapCustomTable
                                    table_header={_table_header2}
                                    table_body={this.state.configure_Array}
                                    select={true}
                                    selectname={'pr_no'}
                                    responsive={true}
                                    click={false}
                                    table_name="issue_grn"
                                    pagination={true}
                                    // products={this.onCategoryCodeRowSelectHandler}
                                />
                             ):null}

                                </div>

                 </div>
                 {this.state.ShowTablesData?
                 <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm">Save</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Reset</button>
                                </div>
                            </div>
                        </div>
                        :null
                        }

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
