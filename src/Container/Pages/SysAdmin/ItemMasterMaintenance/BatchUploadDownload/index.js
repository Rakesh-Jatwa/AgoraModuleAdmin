import React,{Component, Fragment} from 'react';
import axios from 'axios'; 
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {CheckFileDetails} from '../../../../../Actions/Common/Functions'
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
            selectedFile: null,
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

    onFileChange = event => { 
        this.setState({ selectedFile: event.target.files[0] }); 
    };

    
    FileUpload = (attachment) => {
        //  let _get_details  = attachment.target;
          let picture = this.state.picture         
  
          let req = {
              "pEnumUploadType": "12",
              "strDocType": "strDocType",
              "pEnumUploadForm": "1",
              "strDocNo": "PR",
              "blnTemp": "blnTemp",
              "strIndex": "",
              "seq": "",
              "pFrontOfficeSite": "",
              "AttachType": "",
              "ItemCode": "",
              "LineNo": "",
              "POLine": "",
              "modeType":  "New"
          }
  
          console.log('picture attachment',attachment);
        
       //   _file_name =  _get_details.getAttribute('data-name');
        
              this.props.UploadDocuments(this.state.picture, req);
             
              req.AttachType = '';
              this.setState({
                  modal_title: 'File Upload Validation',
                  title : 'File Upload Validation',
                  modal_body: 'Choose a File to Upload',
                  status : false,
                  model: true,
                  file_upload:true,
                  local_render : false,
                  file_upload:true
              })
      }
  
      SendUpload = (e) => {       
          let _details  = CheckFileDetails(e);
          if(_details.status){
              if(e.target.name=="picture"){
                  this.setState({
                      picture : e.target.files[0],
                      picture_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                  })
              }
              else if(e.target.name=="fileA"){
                  this.setState({
                      fileA : e.target.files[0],
                      fileA_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                  })
              }
          }
          else{
              this.setState({
                  model:true,
                  status:false,
                  modal_body:_details.message
              })
          }
      }
  
    
    // onFileUpload = () => { 
    //     const formData = new FormData(); 
       
    //     formData.append( 
    //       "myFile", 
    //       this.state.selectedFile, 
    //       this.state.selectedFile.name 
    //     ); 
       
    //     console.log(this.state.selectedFile); 
    //     axios.post("api/uploadfile", formData, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data'
    //         }
    //     }); 
    // };

    render(){

        const _table_header = [
            {name : "User Role", id:"DM_FIXED_ROLE_ID",  formatter: (cellContent, row) => {
                return (
                    <button type="button" className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.DM_FIXED_ROLE_ID}</button>
                )
            },
        },
        {name : "Dashboard Panel Name", id:"DM_PANEL_NAME", key:true}]

       

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              <div className="show_list">  
              <PageHeading 
                    heading="Batch Upload / Download-"	
                />
                <TabHeading color={'bg-info text-white'}>Batch Upload/Download </TabHeading>
                <div className="row mt-2">
                    <div className="col-12 col-md-4"><label><strong>File Location :</strong><br />
                            <span>Recommended file size is 10240 KB</span> </label></div>
                        <div className="col-12 col-md-3">
                            <div className="col-12 custom-file">
                                <input type="file" class="custom-file-input" id="customFile" onChange={this.onFileChange}/>  
                            </div>
                        </div>
                </div>
                    <div className="row mb-4 mt-4">
                        <div className="col-12 col-md-6">
                            <div className="row">
                            <p className="pl-3">Download Batch Upload/Download template -<a href="#"> ItemBIMTemplate.xls [68KB] </a> </p>
                            <p className="pl-3">Download UNSPSC commodity reference codeset -<a href="#"> UNSPSC v13.1201.xlsx [2MB] or UNSPSC_English_v13.1201_3.pdf [6MB]  </a> </p>
                            <p className="pl-3">Download Guide to UNSPSC (Segment or Category by Goods & Services Type) -<a href="#"> GUIDE TO UNSPSC (SEGMENT or CATEGORY BY GOODS & SERVICES TYPE).pdf [36KB]  </a> </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" onClick={this.onFileUpload} className="btn btn-outline-success btn-sm">Upload</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2">Download</button>
                                </div>
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