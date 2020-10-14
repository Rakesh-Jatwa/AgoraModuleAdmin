import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import Alert from '../../../../../Component/Modal/alert'
import {
    GetGlCategorySearchCodeData,
    AddGLCategoryCodeData,
    UpdateGlCategoryCode,
    DeleteGlCategoryCode,
} from '../../../../../Apis/SysAdmin'
import {ApiExtract} from '../../../../../Common/GetDatas'
class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.state = {
            title:'',
            message:'',
            show_roles:false,
            status:false,
            selectedOption: 'glCode',
            glCodeList:[],
            categoryCodeList: [],
            glCodeValue: '',
            categoryCodeValue: '',
            glcodevalueforassignment:'',
            showGlCodeTable: false,
            showGlCodeAdd: false,
            glCodeItem: '',
            glDescriptionItem: '',
            showCategoryCodeAdd: false,
            showCategoryCodeTable: false,
            categoryCodeItem: '',
            glCodeSelectedItem: [],
            categoryCodeSelectedItem: [],
            alertMessage: '',
            openAlert: false,
            showCancel: false,
            showModifySection: false,
            glAddCodeItem: '',
            glAddDescriptionValue: '',
            glModifyCode: '',
            glModifyDescription: '',
            glAdddesc:"",
            showAddGlCodeAssignments:false,
            GLCODEASSIGNMENT:''
        }

        this.addInput = React.createRef();
        this.modifyInput = React.createRef();
    }

    componentDidUpdate(prevProps, prevState){
      if(!prevState.showGlCodeAdd && this.state.showGlCodeAdd){
        this.addInput.current.focus();
      }
      if(!prevState.showModifySection && this.state.showModifySection){
        this.modifyInput.current.focus();
      }
    }

    handleOptionChange = (e) => {
        this.setState({
            selectedOption: e.target.value,
            glCodeList:[],
            categoryCodeList: [],
            glCodeValue: '',
            showGlCodeTable: false,
            showGlCodeAdd: false,
            showModifySection: false,
            showCategoryCodeAdd: false,
            glModifyCode: '',
            glModifyDescription: '',
            glCodeItem: '',
            glDescriptionItem: '',
            categoryCodeValue: '',
            glCodeSelectedItem: [],
            categoryCodeSelectedItem: [],
            showCategoryCodeTable: false,
            glAddCodeItem: '',
            glAddDescriptionValue: '',
            glAdddesc:''
        });
    }

    searchClickHandler = () => {
        this.setState({
            showGlCodeAdd: false,
            glCodeSelectedItem:[],
            showModifySection: false,
            showCategoryCodeAdd: false,
            glModifyCode: '',
            glModifyDescription: '',
            glCodeItem: '',
            glDescriptionItem: '',
            categoryCodeItem: '',
            glAddCodeItem: '',
            glAdddesc: '',
            showAddGlCodeAssignments: false,
           
        });
        if(this.state.selectedOption === 'glCode') {
            if(this.state.glCodeValue) {
                let tempArray = this.state.glCodeList.filter( ele =>(
                    ele.CBG_B_GL_CODE === this.state.glCodeValue
                ));
                this.setState({
                    glCodeList: tempArray,
                    showGlCodeTable: true,
                    showCategoryCodeTable: false,
                    showAddGlCodeAssignments:false
                });
            } else {
                this.GetGlSearchResult();
            }
        }
        if(this.state.selectedOption === 'categoryCode'){
            if(this.state.categoryCodeValue) {
                let tempArray = this.state.categoryCodeList.filter( ele =>(
                    ele.CBC_B_CATEGORY_CODE === this.state.categoryCodeValue
                ));
                this.setState({
                    categoryCodeList: tempArray,
                    showGlCodeTable: false,
                    showCategoryCodeTable: true,
                    showAddGlCodeAssignments:false
                });
            } else {
                this.GetCategorySearchResult();
            }
        }
    //   if(this.state.selectedOption==='glCategoryCode'){
    //       this.setState({
    //           showAddGlCodeAssignments:false,

    //       })
    //   }
      console.log('==============>',this.state.selectedOption);
    }

    GetGlSearchResult = async (e) =>{
        let response = await ApiExtract(GetGlCategorySearchCodeData, {
            "criteria": "glRadioBtn",
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"]
        });
        if (response && response.response) {
            this.setState({
                glCodeList: response.response,
                showGlCodeTable: true,
                showGlCodeAdd: false
            });
        }
    }

    GetCategorySearchResult =  async (e) =>{
        let response = await ApiExtract(GetGlCategorySearchCodeData, {
            "criteria": "catCodeRadioBtn",
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"]
        });
        if (response && response.response) {
            this.setState({
                categoryCodeList: response.response,
                showCategoryCodeTable: true,
                showCategoryCodeAdd: false
            });
        }
    }

    clearClickHandler = () => {
     
        this.setState({
            glCodeValue: '',
            categoryCodeValue: '',
        });
    }

    handleAddSection = () => {
        if(this.state.selectedOption === 'glCode'){
            this.setState({
                showGlCodeAdd: true,
                showModifySection: false,
                showAddGlCodeAssignments:false
                
            });
        }
        if(this.state.selectedOption === 'categoryCode'){
            this.setState({ 
                showGlCodeAdd: false,
                showAddGlCodeAssignments:false,
                showCategoryCodeAdd: true,
               
            });
        }
        if(this.state.selectedOption === 'glCategoryCode'){
            this.setState({
                 showAddGlCodeAssignments: true,
                 showGlCodeAdd: false,
                 showCategoryCodeAdd: false,
                });
        }
    }

    handleGlCodeSave = () => {
     if((this.state.glAddCodeItem==='') || (this.state.glAdddesc==='')){
           if(this.state.glAddCodeItem==='' || !this.state.glAddCodeItem.length){
            this.setState({
                errorglAddCodeItem:"GL code required",
            })
         }
         if(this.state.glAdddesc==='' ||!this.state.glAdddesc.length){
            this.setState({
                errorglAddDescriptionValue:"GL Description is required"
            })
         }
         return false
      }
        else{
            this.setState({
                errorglAddCodeItem:"",
                errorglAddDescriptionValue:""
            })
        }
          
        let data ={
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "criteria": "glRadioBtn",
            "txtAddGLCode": this.state.glAddCodeItem,
            "txtGLCodeDescription": this.state.glAdddesc
        };
        this.setState({ showGlCodeTable: false});
        this.AddGLCategory(data);
    }

    handleCategoryCodeSave = () => {
        let data ={
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "criteria": "catCodeRadioBtn",
            "txtAddGLCode": this.state.categoryCodeItem,
            "txtGLCodeDescription": this.state.glAdddesc,
        };
        this.AddGLCategory(data);
    }

    AddGLCategory = async (data) =>{
        let message ='';
        let response = await ApiExtract(AddGLCategoryCodeData, data);
        if(response.status===true){
            message = 'Record saved.'
         this.setState({
              openAlert:true,
              alertMessage:message,
              status:true,
              showCancel: false,
          })
          this.searchClickHandler();
      }
      if(response.status===false){
        message = 'Duplicate Record Found.'
     this.setState({
          openAlert:true,
          alertMessage:message,
          status:true,
          showCancel: false,
      })
      this.searchClickHandler();
  }
    }

    onGlCodeRowSelectHandler = (row, isSelected, e) => {
        let tempArray = this.state.glCodeSelectedItem;
        if(isSelected){
            tempArray.push(row);
        } else {
            tempArray = tempArray.filter(function(ele){ return ele !== row; })
        }
        this.setState({
            glCodeSelectedItem: tempArray
        })
    }

    onCategoryCodeRowSelectHandler = (row, isSelected, e) => {
        let tempArray = this.state.categoryCodeSelectedItem;
        if(isSelected){
            tempArray.push(row);
        } else {
            tempArray = tempArray.filter(function(ele){ return ele !== row; })
        }
        this.setState({
            categoryCodeSelectedItem: tempArray
        })
    }

    handleDeleteSection = () => {
        let message = '';
        if(this.state.glCodeSelectedItem.length > 0 || this.state.categoryCodeSelectedItem.length > 0){
          message = 'Are you sure that you want to permanently delete this item(s)?';
          this.setState({ showCancel: true});
        } else if (this.state.glCodeSelectedItem.length === 0 || this.state.categoryCodeSelectedItem.length === 0){
          message = 'Please make at least on selection!';
          this.setState({ showCancel: false});
        }

        this.setState({
          alertMessage: message,
          openAlert: true
        });
    };

    handleConfirmation = () => {
        let selectedGlCode = this.state.glCodeSelectedItem;
        let selectedGLData = [];
        let selectedCategoryCode = this.state.categoryCodeSelectedItem;
        let selectedCategorydata = [];
        if(this.state.selectedOption === 'glCode'){
            for(let i=0; i<selectedGlCode.length; i++) {
                selectedGLData[i] = selectedGlCode[i].CBG_B_GL_CODE;
            }
        }
       
        if(this.state.selectedOption === 'categoryCode'){
            for(let i=0; i<selectedCategoryCode.length; i++) {
                selectedCategorydata[i] = selectedCategoryCode[i].CBC_B_CATEGORY_CODE;
            }
        }

        let data = {
            "criteria": this.state.selectedOption === 'glCode'? 'glRadioBtn': 'catCodeRadioBtn',
            "glCode": selectedGLData,
            "categoryCode": selectedCategorydata
        }
        this.setState({
          openAlert: false
        });
        if(this.state.showCancel){
          this.setState({
            showGlCodeTable: false
          });
          this.DeleteGlCategoryCodeData(data);
        }
    }

    handleModifySection = () => {
        let message = '';
        if(this.state.glCodeSelectedItem.length === 0){
          message = 'Please make one selection!';
          this.setState({
            showCancel: false,
            alertMessage: message,
            openAlert: true
          });
        } else if(this.state.glCodeSelectedItem.length > 1){
            message = 'Please choose only one selection!';
            this.setState({
              showCancel: false,
              alertMessage: message,
              openAlert: true
            });
        } else {
          this.setState({
            showGlCodeAdd: false,
            showModifySection: !this.state.showModifySection,
            glModifyCode: this.state.glCodeSelectedItem[0].CBG_B_GL_CODE,
            glModifyDescription: this.state.glCodeSelectedItem[0].CBG_B_GL_DESC
          });
        }
    };

    handleModifySave = () => {
        if(this.state.glModifyCode==='' ||!this.state.glModifyCode.length){
            this.setState({
                errorglModifyCode:"GL code required"
            })
            return false
        }
        else if(!this.state.glModifyCode==='' ||this.state.glModifyCode.length){
            this.setState({
                errorglModifyCode:""
            })
        }
        if(this.state.glModifyDescription==='' ||!this.state.glModifyDescription.length || this.state.glModifyDescription ===undefined){
            this.setState({
                errorglModifyDescription:"GL Description is required"
            })
            return false
        }
        else if(!this.state.glModifyDescription==='' ||this.state.glModifyDescription.length){ 
            this.setState({
                errorglModifyDescription:""
            })
        }
        let data ={
            "criteria": "catCodeRadioBtn",
            "glCode": this.state.glModifyCode,
            "glDescription": this.state.glModifyDescription
        }
        this.UpdateGlCodeData(data);
        this.setState({showGlCodeTable: false});
    }

    UpdateGlCodeData = async(data) => {
        let message = '';
        let response = await ApiExtract(UpdateGlCategoryCode, data);
       
        if(response){
            console.log('=========*************>>>>>>>>',response);
        }
        if(response.status===true){
             
              message = 'Record saved.'
          
            this.setState({
                openAlert:true,
                alertMessage:message,
                status:true
            })
            this.searchClickHandler();
        }
    }

    DeleteGlCategoryCodeData = async (data) => {
        let response = await ApiExtract(DeleteGlCategoryCode, data);
        if (response) {
            this.searchClickHandler();
        }
    }

    onCancel = () => {
        this.setState({
          openAlert: false
        });
    }

    handleGlCodeClear = () => {
      this.setState({
        glAddCodeItem: '',
        glAddDescriptionValue: '',
        glAdddesc:''
      });
    }
    setonchangegladddescvaluee = (e) =>{
             this.setState({
                glAdddesc: e.target.value
              });
    }

    render(){

        const _table_header =  [
            {name : "GL Code", id:"CBG_B_GL_CODE", key:true, width:'150px'},
            {name : "GL Description", id:"CBG_B_GL_DESC", key:false, width:'150px'}
        ];

        const _table_header2 =  [
            {name : "Category Code", id:"CBC_B_CATEGORY_CODE", key:true, width:'300px'}
        ];



        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             <Alert
                title=""
                message={this.state.alertMessage}
                status={this.state.status}
                show={this.state.openAlert}
                confimation={false}
                showCancel={this.state.showCancel}
                onCancel={() =>{this.onCancel()}}
                confirm={() =>{ this.handleConfirmation() }}/>
              <div className="show_list">
              <PageHeading
                    subheading="Fill in the search criteria and click Search button to list the relevant GL Code(s). Click Add button to add new GL Code. Select GL Code and click Modify button to modify"
                />
                 <form>
                        <div className="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-3">
                                    <div className="col-12 col-md-6">
                                            <div className="row">
                                                <div className="col-12 col-md-12">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="glCode"
                                                            checked={this.state.selectedOption === 'glCode'}
                                                            onChange={(e)=>{this.handleOptionChange(e)}}
                                                        />
                                                        <label className="form-check-label ml-2" htmlFor="inlineRadio2">GL Code</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="categoryCode"
                                                            checked={this.state.selectedOption === 'categoryCode'}
                                                            onChange={(e)=>{this.handleOptionChange(e)}}
                                                        />
                                                        <label className="form-check-label ml-2" htmlFor="inlineRadio2">Category Code</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="glCategoryCode"
                                                            checked={this.state.selectedOption === 'glCategoryCode'}

                                                            onChange={(e)=>{this.handleOptionChange(e)}}
                                                        />
                                                        <label className="form-check-label ml-2" htmlFor="inlineRadio2">GL Code - Category Code Assignment</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="glsearch">
                                        <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12 col-md-6">
                                            {
                                                this.state.selectedOption === 'glCode' ? (
                                                <div className="row">
                                                    <div className="col-12 col-md-3 pl-0"><label>GL Code: </label></div>
                                                    <div className="col-12 col-md-6">
                                                        <input name="" className="form-control"
                                                            value={this.state.glCodeValue}
                                                            onChange={(e) =>{
                                                                this.setState({
                                                                    glCodeValue: e.target.value
                                                                });
                                                            }}
                                                        />
                                                        <div className="text-danger"></div>
                                                    </div>
                                                </div>
                                                ) : null
                                            }
                                            {
                                                this.state.selectedOption === 'categoryCode' ?
                                                <div className="row">
                                                    <div className="col-12 col-md-3 pl-0"><label>Category Code: </label></div>
                                                    <div className="col-12 col-md-6 pl-1">
                                                        <input name="" className="form-control"
                                                            value={this.state.categoryCodeValue}
                                                            onChange={(e) =>{
                                                                this.setState({
                                                                    categoryCodeValue: e.target.value
                                                                });
                                                            }}
                                                        />
                                                        <div className="text-danger"></div>
                                                    </div>
                                                </div> : null
                                            }
                                            
                                        </div>
                                        </div>
                                     <div className="row">
                                        <div className="col-12">
                                            {
                                                this.state.selectedOption === 'glCategoryCode' ?(
                                                <div className="row">
                                                    <div className="col-12 col-md-6">
                                                    <div className="row">
                                                    <div className="col-12 col-md-3 pl-0"><label>GL Code: </label></div>
                                                    <div className="col-12 col-md-6">
                                                        <input name="" className="form-control"
                                                         placeholder="" value=""/>
                                                        <div className="text-danger"></div>
                                                    </div>
                                                    </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="row">
                                                    <div className="col-12 col-md-3 pl-0"><label>Category Code: </label></div>
                                                    <div className="col-12 col-md-6">
                                                        <input name="" className="form-control" placeholder="" value="" />
                                                        <div className="text-danger"></div>
                                                    </div>
                                                    </div>
                                                </div>
                                                </div>
                                                ) : null
                                            }
                                            </div>
                                    </div>

                               <div className="row mt-2">
                                    <div className="col-12 col-md-12 mt-2 text-right">
                                        <button type="submit" className="btn btn-sm btn-outline-success"
                                            onClick={()=>{this.searchClickHandler()}}
                                        >Search</button>
                                        <button type="button" className="btn btn-sm btn-outline-danger ml-2"
                                            onClick={()=>{this.clearClickHandler()}}
                                        >Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    {
                        this.state.showGlCodeAdd ? (
                        <>
                        {' '}
                        <TabHeading color={'bg-info text-white'}>
                            Please add the following value
                        </TabHeading>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className="col-12 col-md-3 ">
                                        <label>GL Code: </label>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <input
                                            className="form-control"
                                            name="addItem"
                                            value={this.state.glAddCodeItem}
                                            onChange={(e) => {this.setState({glAddCodeItem: e.target.value})}}
                                            ref={this.addInput}
                                        />
                                    </div>
                                   <div className="text text-danger">{this.state.errorglAddCodeItem}</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className="col-12 col-md-3 ">
                                        <label>GL Description: </label>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <input
                                            className="form-control"
                                            name="addItem"
                                            value={this.state.glAdddesc}
                                            onChange={(e) => { this.setState({glAdddesc: e.target.value})}}
                                            // ref={this.addInput}
                                        />
                                       
                                    </div>
                                         {/* <div className="text text-danger">{this.state.errorglAddDescriptionValue}</div> */}
                                         <div className="text text-danger">{this.state.errorglAddDescriptionValue}</div>
                                </div>
                                
                            </div>
                            </div>
                            <div className="row mt-3">
                            <div className="col-12 col-md-12">
                            <div className="row mb-4">
                                <div className="col-12 text-right">
                                <button type="button"
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() =>{this.handleGlCodeSave()}}
                                >
                                    Save
                                </button>

                                <button type="button"
                                    className="btn btn-outline-danger btn-sm ml-2"
                                    onClick={() =>{this.handleGlCodeClear()}}
                                >
                                    Clear
                                </button>
                                <button type="button"
                                    className="btn btn-outline-danger btn-sm ml-2"
                                    onClick={()=>{ this.setState({
                                      showGlCodeAdd: false,
                                      glAddCodeItem: '',
                                      glAddDescriptionValue: '',
                                      glAdddesc:''
                                    })}}
                                >
                                    Cancel
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </>
                    ) : null
                    }
                    {
                        this.state.showCategoryCodeAdd ? (
                        <>
                        {' '}
                        <TabHeading color={'bg-info text-white'}>
                            Please add the following value
                        </TabHeading>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className="col-12 col-md-3 ">
                                        <label>Category Code: </label>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <input
                                            className="form-control"
                                            name="addItem"
                                            value={this.state.categoryCodeItem}
                                            onChange={(e) => {this.setState({categoryCodeItem: e.target.value})}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                            <div className="row mb-4">
                                <div className="col-12 text-right">
                                <button type="button"
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() =>{this.handleCategoryCodeSave()}}
                                >
                                    Save
                                </button>

                                <button type="button"
                                    className="btn btn-outline-danger btn-sm ml-2"
                                    onClick={() =>{this.setState({categoryCodeItem: ''})}}
                                >
                                    Clear
                                </button>
                                <button type="button"
                                    className="btn btn-outline-danger btn-sm ml-2"
                                    onClick={()=>{ this.setState({showCategoryCodeAdd: false})}}
                                >
                                    Cancel
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </>
                    ) : null
                    }
                    {
                        this.state.showModifySection ?
                        (
                        <>
                            {' '}
                            <TabHeading color={'bg-info text-white'}>
                            Please add the following value
                            </TabHeading>
                            <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="row">
                                <div className="col-12 col-md-3 ">
                                    <label>GL Code: </label>
                                </div>
                                <div className="col-12 col-md-6">
                                    <input
                                    className="form-control"
                                    name="addItem"
                                    value={this.state.glModifyCode}
                                    disabled={true}
                                    />
                                </div>
                                <div className="text text-danger">{this.state.errorglModifyCode}</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row">
                                <div className="col-12 col-md-3 ">
                                    <label>GL Description: </label>
                                </div>
                                <div className="col-12 col-md-6">
                                    <input
                                    className="form-control"
                                    name="addItem"
                                    value={this.state.glModifyDescription}
                                    onChange={(e) => { this.setState({glModifyDescription: e.target.value})}}
                                    ref={this.modifyInput}
                                    />
                                </div>
                                      <div className="text text-danger">{this.state.errorglModifyDescription}</div>
                                </div>
                            </div>
                            </div>
                            <div className="row mt-3">
                            <div className="col-12 col-md-12">
                                <div className="row mb-4">
                                <div className="col-12 text-right">
                                    <button
                                    type="button"
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() =>{this.handleModifySave()}}
                                    >
                                    Save
                                    </button>

                                    <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm ml-2"
                                    onClick={() =>{this.handleReset()}}
                                    >
                                    Reset
                                    </button>
                                    <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm ml-2"
                                    onClick={() => {this.setState({showModifySection: false})}}
                                    >
                                    Cancel
                                    </button>
                                </div>
                                </div>
                            </div>
                            </div>
                        </>
                        ) : null
                    }

                     {/* <div></div> */}
                            {
                                       this.state.showAddGlCodeAssignments?(
                                        <>
                                        {' '}
                                        <TabHeading color={'bg-info text-white'}>
                                        Add GL Code - Category Code 
                                        </TabHeading>
                                        <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="row">
                                            <div className="col-12 col-md-3 ">
                                                <label>GL Code: </label>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <input
                                                className="form-control"
                                                name="addItem"
                                                value={this.state.GLCODEASSIGNMENT}
                                               
                                                />
                                            </div>
                                            <div className="text text-danger">{this.state.errorglModifyCode}</div>
                                            </div>
                                        </div>
                                     
                                        </div>
                                        <div className="row mt-3">
                                        <div className="col-12 col-md-12">
                                            <div className="row mb-4">
                                            <div className="col-12 text-right">
                                                <button
                                                type="button"
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() =>{this.handleModifySave()}}
                                                >
                                                Save
                                                </button>
            
                                                <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm ml-2"
                                                onClick={() =>{this.handleReset()}}
                                                >
                                                Reset
                                                </button>
                                                <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm ml-2"
                                                onClick={() => {this.setState({showAddGlCodeAssignments: false})}}
                                                >
                                                Cancel
                                                </button>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </>
                                       ):null
                                  }
          {/* <div></div> */}

                    <div className='col-12 mt-3 pl-0'>
                        {
                            this.state.showGlCodeTable ? (
                                <BootstrapCustomTable
                                    table_header={_table_header}
                                    table_body={this.state.glCodeList}
                                    select={true}
                                    selectname={'pr_no'}
                                    responsive={true}
                                    click={false}
                                    table_name="issue_grn"
                                    pagination={true}
                                    products={this.onGlCodeRowSelectHandler}
                                />
                            ) : null
                        }
                        {
                            this.state.showCategoryCodeTable ? (
                                <BootstrapCustomTable
                                    table_header={_table_header2}
                                    table_body={this.state.categoryCodeList}
                                    select={true}
                                    selectname={'pr_no'}
                                    responsive={true}
                                    click={false}
                                    table_name="issue_grn"
                                    pagination={true}
                                    products={this.onCategoryCodeRowSelectHandler}
                                />
                            ) : null
                        }
                    </div>
                    <div className="col-12 col-md-6 mt-3 pl-1">
                        <div className="row mb-3">
                        <div className="col-12">
                            <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() =>{this.handleAddSection()}}
                            >
                            Add
                            </button>
                            {
                                this.state.glCodeList.length > 0 ? (
                                    <button
                                    type="button"
                                    className="btn btn-outline-success btn-sm ml-2"
                                    onClick={() => {this.handleModifySection()}}
                                    >
                                    Modify
                                    </button>
                               ) : null
                            }
                            {
                                this.state.glCodeList.length > 0 || this.state.categoryCodeList.length > 0 ? (
                                    <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm ml-2"
                                    onClick={() => {this.handleDeleteSection()}}
                                    >
                                    Delete
                                    </button>
                                ) : null
                            }
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
})

const mapDispatchToProps = dispatch => ({
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
