import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import Alert from '../../../../../Component/Modal/alert'
import { GetCountry} from '../../../../../Actions/Eadmin'
import {
  SearchBillingDeliveryAddress,
  AddBillingDeliveryAddress,
  DeleteAddress
} from '../../../../../Apis/SysAdmin'
import { State } from '../../../../../Apis/Eadmin'
import { ApiExtract } from '../../../../../Common/GetDatas'
class DashboardListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false,
            rendered: false,
            showCancel: false,
            title: '',
            message: '',
            show: false,
            confimation:false,
            searchBillingAddress:'',
            searchBillingAddressCode:'',
            searchBillingAddressState:'',
            searchBillingAddressCountry:'',
            searchBillingAddressCity:'',

            // billingAddress: [],
            billingAddressList: [],
            selectedItem: [],
            showBillingAdressTable: false,
            modifyAndDeleteDisable: true,
            billingAddressCode:'',
            billingAddress:'',
            billingAddressState:'',
            billingAddressCountry:'',
            billingAddressCity:'',
            countryList: [],
            stateList:[],
            selectedCountry: '--Select--',
            countrySelect: [],
            showAddAddressSection: false,
            addPostCode: '',
            addCity: '',
            addAddressLine1: '',
            addAddressLine2: '',
            addAddressLine3: '',
            addCode: '',
            addCodeDisable: false,

            addSelectedCountry: '---Select---',
            addSelectedState:'null',
            addBillingAddressState:"null",
            addBillingAddressCountry: "null",
            showModifyAddressSection: false,
            modifyPostCode: '',
            modifyCity: '',
            modifyAddressLine1: '',
            modifyAddressLine2: '',
            modifyAddressLine3: '',
            modifyCode: '',
            modifySelectedCountry: 'null',
            modifyBillingAddressCountry: 'null',
            modifyBillingAddressState: 'null',
            modifySelectedState:'null',
            billingAddress1:'',
            errModifyPostCode:null, errModifyCity:null, errModifySelectedState:null, errModifyAddressLine1:null, errModifyBillingAddressCountry:null,
            errAddCode:null, errAddPostCode:null, errAddCity:null, errAddAddressLine1:null, errAddBillingAddressCountry:null,errAddSelectedState:null
        }
        this.onRowSelectHandler = this.onRowSelectHandler.bind(this)
        this.selectAllHandler = this.selectAllHandler.bind(this)
        this.deleteAddress = this.deleteAddress.bind(this)
        this.onSearchHandler = this.onSearchHandler.bind(this)
        this.formValidator = this.formValidator.bind(this)
        this.resetAddData = this.resetAddData.bind(this)
        this.onClickCodeHeaderButton = this.onClickCodeHeaderButton.bind(this)

    }

    componentDidMount() {
        this.props.GetCountry();
        this.getStateList({"countryCode": "MY"});
    }

    componentDidUpdate(prevProps) {
        if(prevProps.country !== this.props.country){
            this.setState({
                countryList: this.props.country
            })
        }
    }
    closeModel() {
        this.setState({
            show: false,
            status: false,
            message: '',
            confimation: false,
            showCancel: false,
            showCancel:false
        })
    }

    onSearchHandler = async () =>{
        let companyID = JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"];
        this.setState({billingAddressList:[]})
        await this.onCountrySelected(this.state.searchBillingAddressCountry)

        let data = {
            "companyId": companyID,
            "addressType": "D",
            "code": this.state.searchBillingAddressCode,
            "address": this.state.searchBillingAddress,
            "city": this.state.searchBillingAddressCity,
            "state": this.state.searchBillingAddressState,
            "country": this.state.searchBillingAddressCountry
        };
        let response = await ApiExtract(SearchBillingDeliveryAddress, data);
        if (response && response.response) {
          let tempArray = response.response;
          let billingAddressList = [];
          for( let i=0; i<tempArray.length; i++) {

            let stateName = this.state.stateList.filter( state=> ( state.CODE_ABBR === tempArray[i].AM_STATE));
            let countryName = this.state.countryList.filter( country=> ( country.CODE_ABBR === tempArray[i].AM_COUNTRY))
            billingAddressList[i] = {
              "AM_ADDR_INDEX": tempArray[i].AM_ADDR_INDEX,
              "AM_COY_ID": tempArray[i].AM_COY_ID,
              "AM_ADDR_CODE": tempArray[i].AM_ADDR_CODE,
              "AM_ADDR_LINE1": tempArray[i].AM_ADDR_LINE1,
              "AM_ADDR_LINE2": tempArray[i].AM_ADDR_LINE2,
              "AM_ADDR_LINE3": tempArray[i].AM_ADDR_LINE3,
              "AM_ADDR_LINE": tempArray[i].AM_ADDR_LINE1 + ' ' + tempArray[i].AM_ADDR_LINE2 + ' ' + tempArray[i].AM_ADDR_LINE3,
              "AM_POSTCODE": tempArray[i].AM_POSTCODE,
              "AM_CITY": tempArray[i].AM_CITY,
              "AM_STATE": stateName && stateName[0] ? stateName[0].CODE_DESC : [],
              "AM_COUNTRY": countryName && countryName[0] ? countryName[0].CODE_DESC: [],
              "AM_ADDR_TYPE": tempArray[i].AM_ADDR_TYPE
            }
          }
          this.setState({
              // billingAddress: tempArray,
              billingAddressList,
              showBillingAdressTable: true,
              modifyAndDeleteDisable: false
          });
        }
    }

    onClearHandler = () =>{
        this.setState({
            selectedItem:[],
            searchBillingAddressCode:'',
            searchBillingAddress:'',
            searchBillingAddressState:'',
            searchBillingAddressCountry:'',
            searchBillingAddressCity:'',
            selectedCountry: '--Select--',
            selectedState: '--Select--',
            showAddAddressSection:false,
            showModifyAddressSection:false,
        });
    }

    onCountrySelected = async(_value) => {
        let tempArray = [];

        if(_value !== "null" && _value.length ) {
          tempArray = this.state.countryList.filter( ele =>(
              ele.CODE_DESC === _value
          ));
          if(this.state.showAddAddressSection){
            this.setState({
                addSelectedCountry: _value,
                addBillingAddressCountry:tempArray[0].CODE_ABBR
            });
          } else if(this.state.showModifyAddressSection) {
            this.setState({
                modifySelectedCountry: _value,
                modifyBillingAddressCountry:tempArray[0].CODE_ABBR
            });
          } else {
            this.setState({
                selectedCountry: _value,
                searchBillingAddressCountry: tempArray[0].CODE_ABBR
            });
          }
          await this.getStateList({"countryCode": tempArray[0].CODE_ABBR});
        } else {
          this.setState({
              searchBillingAddressCountry: '',
              billingAddressCountry: '',
              billingAddressState: '',
              selectedCountry:'---Search---',
              modifyBillingAddressCountry:'null',
              modifyBillingAddressState:'null',
              modifySelectedCountry:"null",
              modifySelectedState:'null',
              addBillingAddressCountry:"null"
          });
          await this.getStateList({"countryCode": 'MY'});
        }


    }

    onStateSelected = (e) => {
        let tempArray = [];

        if(e.target.value !== "null") {
          tempArray = this.state.stateList.filter( ele =>(
              ele.CODE_DESC === e.target.value
          ));

          if(this.state.showAddAddressSection){
            this.setState({
                addSelectedState: e.target.value,
                addBillingAddressState: tempArray[0].CODE_ABBR
            });
          } else if(this.state.showModifyAddressSection) {
            this.setState({
                modifyBillingAddressState: tempArray[0].CODE_ABBR,//e.target.value,
                modifySelectedState: e.target.value
            });
          } else {
            this.setState({
                selectedState: e.target.value,
                searchBillingAddressState: tempArray[0].CODE_ABBR
            });
          }
        } else {
          this.setState({
              searchBillingAddressState: '',
              selectedState: '---Select---',
              billingAddressState: '',
              modifySelectedState:'null',
              modifyBillingAddressState:'null',
              addBillingAddressState:"null"
          });
        }
    }

    getStateList = async (data) =>{
        let response = await ApiExtract(State, data);
        if (response && response.response) {
            this.setState({
                stateList: response.response,
            });
        }
    }

    onRowSelectHandler = (row, isSelected) => {
        let tempArray = this.state.selectedItem;
        if(isSelected){
            tempArray.push(row);
        } else {
            tempArray = tempArray.filter(function(ele){ return ele !== row; })
        }
        this.setState({
            selectedItem: tempArray
        })
    }

    selectAllHandler = (row,isSelected) =>{
        let tempArray = this.state.selectedItem;
        if(isSelected){
            tempArray = row
        } else {
            tempArray = [];
        }
        this.setState({
            selectedItem: tempArray
        })


    }

    onAddClickHandler = () =>{
        this.setState({
            showAddAddressSection: true
        })
    }

    onClickCodeHeaderButton = (code,state,country) =>{
        let tempArray = this.state.billingAddressList.filter( deliver =>(
          deliver.AM_ADDR_CODE === code
        ));
        let countryList = this.state.countryList.filter( ele =>(
              ele.CODE_DESC === tempArray[0].AM_COUNTRY
          ));
        let stateList = this.state.stateList.filter( ele =>(
              ele.CODE_DESC === tempArray[0].AM_STATE
          ));
        this.setState({
            modifyPostCode: tempArray[0].AM_POSTCODE,
            modifyCity: tempArray[0].AM_CITY,
            modifyAddressLine1: tempArray[0].AM_ADDR_LINE1,
            modifyAddressLine2: tempArray[0].AM_ADDR_LINE2,
            modifyAddressLine3: tempArray[0].AM_ADDR_LINE3,
            modifyCode: tempArray[0].AM_ADDR_CODE,
            showModifyAddressSection: true,
            modifySelectedState: state,
            modifySelectedCountry: country,
            modifyBillingAddressState:stateList[0].CODE_ABBR,
            modifyBillingAddressCountry: countryList[0].CODE_ABBR,
            selectedItem:tempArray
        })

    }

    onModifyClickHandler = () =>{
      debugger
      let selectedData = this.state.selectedItem;
      let message = '';
      if(selectedData.length < 1){
        message = 'Please make one selection!';
        this.setState({
          showCancel: false,
          message,
          show: true
        });
      } else if(selectedData.length === 1){
        let tempArray = this.state.billingAddressList.filter( deliver =>(
          deliver.AM_ADDR_CODE === selectedData[0].AM_ADDR_CODE
        ));
        let countryList = this.state.countryList.filter( ele =>(
              ele.CODE_DESC === tempArray[0].AM_COUNTRY
          ));
        let stateList = this.state.stateList.filter( ele =>(
              ele.CODE_DESC === tempArray[0].AM_STATE
          ));
        console.log(countryList)
        this.setState({
            modifyPostCode: tempArray[0].AM_POSTCODE,
            modifyCity: tempArray[0].AM_CITY,
            modifyAddressLine1: tempArray[0].AM_ADDR_LINE1,
            modifyAddressLine2: tempArray[0].AM_ADDR_LINE2,
            modifyAddressLine3: tempArray[0].AM_ADDR_LINE3,
            modifyCode: tempArray[0].AM_ADDR_CODE,
            modifySelectedState: selectedData[0].AM_STATE,
            modifySelectedCountry: selectedData[0].AM_COUNTRY,
            modifyBillingAddressState:stateList[0].CODE_ABBR,
            modifyBillingAddressCountry: countryList[0].CODE_ABBR,
            showModifyAddressSection: true,
        })
      } else {
        message = 'Please choose only one selection!';
        this.setState({
          showCancel: false,
          message,
          show: true,
          confimation: false
        });
      }
    }



    onDeleteClickHandler = () =>{
      let selectedData = this.state.selectedItem;
      let message = '';
      if(selectedData.length){
        message = 'Are you sure that you want to permanently delete this item(s)?';
        this.setState({
          message,
          showCancel: true,
          confimation:true,
        });
      } else {
        message = 'Please make at least on selection!';
        this.setState({
          message,
          showCancel: false,
          confimation:false,
        });
      }

      this.setState({
        show: true
      });
    }

    handleConfirmation = () => {
      this.closeModel();
      if(this.state.showCancel){
        let selectedData = this.state.selectedItem;
        let tempArray = [];
        selectedData.map((item,index)=>{
          tempArray.push(item.AM_ADDR_INDEX)
        })

        // selectedData.forEach((item, i) => {
        //   tempArray[i] = item.AM_ADDR_INDEX;
        // });
        let data = {
          "addressIds": tempArray
        }
        this.setState({
          selectedItem:[]
        })
        this.deleteAddress(data);
      }

    }

    resetAddData = () => {
      this.setState({
        addPostCode: '',
        addCity: '',
        addAddressLine1: '',
        addAddressLine2: '',
        addAddressLine3: '',
        addCode: '',
        addSelectedCountry: '---Select---',
        addBillingAddressState:"null",
        addBillingAddressCountry: "null",
        addSelectedState:"null",
        errAddCode:null, errAddPostCode:null, errAddCity:null, errAddAddressLine1:null, errAddBillingAddressCountry:null,errAddSelectedState:null

      })

    }

    addSaveHandle = async () => {
      let res = this.formValidator()
      if (res){
            let show,status,message
            let data = {
              "mod": "add",
              "addressId": 1,
              "addressType": "D",
              "code": this.state.addCode,
              "city": this.state.addCity,
              "state": this.state.addBillingAddressState,
              "postCode": this.state.addPostCode,
              "country": this.state.addBillingAddressCountry,
              "addressLine1": this.state.addAddressLine1,
              "addressLine2": this.state.addAddressLine2,
              "addressLine3": this.state.addAddressLine3
            };
            console.log("adddata",data)
            let response = await ApiExtract(AddBillingDeliveryAddress, data);
            if( response.status ) {
              show = true
              status = true
              message = 'Record saved.'
              this.resetAddData()
            } else if (!response.status) {
              show = true
              message = response.message === undefined ? "Unexpected error" : response.message
              }

            this.setState({
              show: show,
              status: status,
              message: message,
              // addCodeDisable: true
            })
      }
    }


    formValidator = () =>{
      if (this.state.showModifyAddressSection){
        let {modifyPostCode, modifyCity, modifyAddressLine1, modifyBillingAddressCountry, modifyBillingAddressState} = this.state
        if(modifyPostCode === '' || modifyCity === '' || modifyAddressLine1 === '' || modifyBillingAddressCountry === 'null' || modifyBillingAddressState === 'null' ){
          if(modifyPostCode === '' || !modifyPostCode.length){
            this.setState({
              errModifyPostCode:"Post Code is required."
            })
          }
          if(modifyCity === '' ||  !modifyCity.length){
            this.setState({
              errModifyCity:"City is required."
            })
          }
          if(modifyAddressLine1 === '' || !modifyAddressLine1.length){
            this.setState({
              errModifyAddressLine1:"Address is required."
            })
          }
          if(modifyBillingAddressCountry === 'null' ){
            this.setState({
              errModifyBillingAddressCountry:"Country is required."
            })
          }
          if(modifyBillingAddressState === 'null'){
            this.setState({
              errModifySelectedState:"State is required."
            })
          }
            return false
          }
          this.setState({
            errModifyPostCode:null, errModifyCity:null, errModifySelectedState:null, errModifyAddressLine1:null, errModifyBillingAddressCountry:null,
          })
          return true

        }
        if (this.state.showAddAddressSection) {
          let {addCode, addCity, addBillingAddressState, addPostCode, addBillingAddressCountry, addAddressLine1 } = this.state
          if(addCode === '' || addCity === '' || addBillingAddressState === 'null' || addPostCode === '' || addBillingAddressCountry === 'null' || addAddressLine1 ==='' ){
            if(addCode === '' || !addCode.length){
              this.setState({
                errAddCode:"Code is required."
              })
            }
            if(addPostCode === '' || !addPostCode.length){
              this.setState({
                errAddPostCode:"Post Code is required."
              })
            }
            if(addCity === '' ||  !addCity.length){
              this.setState({
                errAddCity:"City is required."
              })
            }
            if(addAddressLine1 === '' || !addAddressLine1.length){
              this.setState({
                errAddAddressLine1:"Address is required."
              })
            }
            if(addBillingAddressCountry === 'null' ){
              this.setState({
                errAddBillingAddressCountry:"Country is required."
              })
            }
            if(addBillingAddressState === 'null'){
              this.setState({
                errAddSelectedState:"State is required."
              })
            }
              return false
            }
            this.setState({
              errAddCode:null, errAddPostCode:null, errAddCity:null, errAddAddressLine1:null, errAddBillingAddressCountry:null,errAddSelectedState:null
            })
            return true

          }

      }


    modifySaveHandle = async () => {
      let res = this.formValidator()
      if(res){
            let show,status,message
            let data = {
              "mod": "update",
              "addressId": 1,
              "addressType": "D",
              "code": this.state.modifyCode,
              "city": this.state.modifyCity,
              "state": this.state.modifyBillingAddressState,
              "postCode": this.state.modifyPostCode,
              "country": this.state.modifyBillingAddressCountry,
              "addressLine1": this.state.modifyAddressLine1,
              "addressLine2": this.state.modifyAddressLine2,
              "addressLine3": this.state.modifyAddressLine3
            };
            console.log("modifydata",data)
            let response = await ApiExtract(AddBillingDeliveryAddress, data);
            if( response.status ) {
              show = true
              status = true
              message = 'Record saved.'

            } else if (!response.status) {
              show = true
              status = false
              message = response.message ===undefined? "Unexpected Error" : response.message
              }

            this.setState({
              show: show,
              status: status,
              message: message
            })
      }
    }

    deleteAddress = async (data) => {
      let response = await ApiExtract(DeleteAddress, data);
      if(response.status){
        let {showModifyAddressSection} = this.state
        if (showModifyAddressSection){
          this.setState({
            showModifyAddressSection: !showModifyAddressSection
          })
        }
        this.onSearchHandler()
      }
      else{
        this.setState({
          showCancel:false,
          message:'Unexpected error.',
          show:true,
          confimation:false
        })
      }
    }

    resetClickHandler = () => {
        let selectedData = this.state.selectedItem;
        let tempArray = this.state.billingAddressList.filter( deliver =>(
          deliver.AM_ADDR_CODE === selectedData[0].AM_ADDR_CODE
        ));
        this.onCountrySelected("null")
        this.setState({
            modifyPostCode: tempArray[0].AM_POSTCODE,
            modifyCity: tempArray[0].AM_CITY,
            modifyAddressLine1: tempArray[0].AM_ADDR_LINE1,
            modifyAddressLine2: tempArray[0].AM_ADDR_LINE2,
            modifyAddressLine3: tempArray[0].AM_ADDR_LINE3,
            modifyCode: tempArray[0].AM_ADDR_CODE,
            modifySelectedState: selectedData[0].AM_STATE,
            modifyBillingAddressState: selectedData[0].AM_STATE,
            modifySelectedCountry: selectedData[0].AM_COUNTRY,
            modifyBillingAddressCountry: selectedData[0].AM_COUNTRY,
            showModifyAddressSection: true
        })
    }

    isNumberKey = (e)=>{
      var charCode = (e.which) ? e.which : Event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57)){
         this.setState(
          {
            addPostCode: e.target.value =''
          })
        }
        else{
          this.setState(
            {
              addPostCode: e.target.value
            })
        }
        
    }
    isNumberKeyMod = (e)=>{
      var charCode = (e.which) ? e.which : Event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57)){
          this.state.modifyPostCode = e.target.value =''
        
          this.setState(
          {
            modifyPostCode: e.target.value =''
          })
        }
        else{
          this.setState(
            {
              modifyPostCode: e.target.value
            })
        }
        
    }

    render() {

        const _table_header =  [
            {name : "Code", id:"AM_ADDR_CODE", key:true, width:'50px',formatter: (cellContent, row) => {
                return <button className="btn btn-sm btn-outline-primary" type="button"
                  onClick={(e) => this.onClickCodeHeaderButton(row.AM_ADDR_CODE,row.AM_STATE,row.AM_COUNTRY)}>{row.AM_ADDR_CODE} </button >
            }},
            {name : "Address", id:"AM_ADDR_LINE", key:false, width:'300px'},
            {name : "City", id:"AM_CITY", key:false, width:'75px'},
            {name : "State", id:"AM_STATE", key:false, width:'75px'},
            {name : "Post Code", id:"AM_POSTCODE", key:false, width:'75px'},
            {name : "Country", id:"AM_COUNTRY", key:false, width:'75px'}
        ];

        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}
            <Alert
                title=""
                message={this.state.message}
                status={this.state.status}
                show={this.state.show}
                confimation={this.state.confimation}
                showCancel={this.state.showCancel}
                onCancel={() =>{this.closeModel()}}
                confirm={() =>{ this.handleConfirmation() }}/>
            {
                !this.state.showAddAddressSection && !this.state.showModifyAddressSection ? (
                <div className="show_list">
                <PageHeading
                    heading=""
                    subheading="Fill in the search criteria and click Search button to list the relevant delivery addresses. Click the Add button to add new delivery address."
                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                <form>
                    <div className="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label> Code : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="" type="text" className="form-control" placeholder=""
                                                value={this.state.searchBillingAddressCode}
                                                onChange={(evt)=>{this.setState({searchBillingAddressCode: evt.target.value})}}
                                            />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Address : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="" type="text" className="form-control" placeholder=""
                                                value={this.state.searchBillingAddress}
                                                onChange={(evt)=>{this.setState({searchBillingAddress: evt.target.value})}}
                                            />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label> City : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="" type="text" className="form-control" placeholder=""
                                                value={this.state.searchBillingAddressCity}
                                                onChange={(evt)=>{this.setState({searchBillingAddressCity: evt.target.value})}}
                                            />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>State : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.selectedState}
                                                onChange={(e)=>{this.onStateSelected(e)}}
                                            >
                                                <option value="null">--Select--</option>
                                                {
                                                    this.state.stateList &&
                                                    this.state.stateList.map((data)=>(
                                                        <option value={data.CODE_DESC}>{data.CODE_DESC}</option>
                                                    ))
                                                }
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>Country : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.selectedCountry}
                                                onChange={(e)=>{this.onCountrySelected(e.target.value)}}
                                            >
                                                <option value="null">--Select--</option>
                                                {
                                                    this.state.countryList &&
                                                    this.state.countryList.map((data)=>(
                                                        <option value={data.CODE_DESC}>{data.CODE_DESC}</option>
                                                    ))
                                                }
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12 text-right">
                                    <button type="button"
                                        className="btn btn-outline-success btn-sm"
                                        onClick={()=>{this.onSearchHandler()}}
                                    >Search</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2"
                                        onClick={()=>{this.onClearHandler()}}
                                    >Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.showBillingAdressTable ? (
                            <BootstrapCustomTable

                                table_header={_table_header}
                                table_body={this.state.billingAddressList}
                                select={true}
                                selectname={'pr_no'}
                                responsive={true}
                                click={false}
                                table_name="issue_grn"
                                pagination={true}
                                selectall={this.selectAllHandler}
                                products={this.onRowSelectHandler}
                            />
                        ) : null
                    }
                    <div className="col-12 col-md-6 mt-3 pl-1">
                        <div className="row mb-3">
                            <div className="col-12">
                                <button type="button" className="btn btn-outline-success btn-sm"
                                    onClick={()=>{ this.onAddClickHandler() }}
                                >Add</button>
                                <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                    onClick={()=>{ this.onModifyClickHandler() }}
                                    disabled={this.state.modifyAndDeleteDisable}
                                >Modify</button>
                                <button type="button" className="btn btn-outline-danger btn-sm ml-2"
                                    onClick={()=>{ this.onDeleteClickHandler() }}
                                    disabled={this.state.modifyAndDeleteDisable}
                                >Delete</button>
                            </div>
                        </div>
                    </div>
                </form>
                </div>
                ) : null
                }
                {
                    this.state.showAddAddressSection ? (
                    <div className="add_address_section">
                    <PageHeading
                        heading=""
                        subheading="Fill in the relevant info and click the Save button to save the address."
                    />
                    <TabHeading color={'bg-info text-white'}>Add Address</TabHeading>
                    <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label> Code<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control" placeholder=""
                                                  value={this.state.addCode}
                                                  onChange={(e)=>{ this.setState({addCode: e.target.value})}}
                                                  disabled={this.state.addCodeDisable}
                                                />
                                                <div className="text-danger">{this.state.errAddCode}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Address<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control mb-2" placeholder=""
                                                  value={this.state.addAddressLine1}
                                                  onChange={(e)=>{ this.setState({addAddressLine1: e.target.value})}}
                                                />
                                                <input name="" type="text" className="form-control mb-2" placeholder=""
                                                  value={this.state.addAddressLine2}
                                                  onChange={(e)=>{ this.setState({addAddressLine2: e.target.value})}}
                                                />
                                                <input name="" type="text" className="form-control mb-2" placeholder=""
                                                  value={this.state.addAddressLine3}
                                                  onChange={(e)=>{ this.setState({addAddressLine3: e.target.value})}}
                                                />
                                                <div className="text-danger">{this.state.errAddAddressLine1}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label> City<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control" placeholder=""
                                                  value={this.state.addCity}
                                                  onChange={(e)=>{ this.setState({addCity: e.target.value})}}
                                                />
                                                <div className="text-danger">{this.state.errAddCity}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>State<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <select className="form-control"
                                                    value={this.state.addSelectedState}
                                                    onChange={(e)=>{this.onStateSelected(e)}}
                                                >
                                                    <option value="null">--Select--</option>
                                                    {
                                                        this.state.stateList &&
                                                        this.state.stateList.map((data)=>(
                                                            <option value={data.CODE_DESC}>{data.CODE_DESC}</option>
                                                        ))
                                                    }
                                                  </select>
                                                <div className="text-danger">{this.state.errAddSelectedState}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Post Code<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="pincode" type="text"  className="form-control" placeholder="" pattern="^[0-9]{6}$" maxLength="6" onKeyUp={(e)=>this.isNumberKey(e)}
                                                  value={this.state.addPostCode}
                                                  onChange={(e)=>{ this.setState(
                                                    {
                                                        addPostCode: e.target.value
                                                      })}}
                                                />
                                                <div className="text-danger">{this.state.errAddPostCode}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Country<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.addSelectedCountry}
                                                onChange={(e)=>{this.onCountrySelected(e.target.value)}}
                                            >
                                                <option value="null">--Select--</option>
                                                {
                                                    this.state.countryList &&
                                                    this.state.countryList.map((data)=>(
                                                        <option value={data.CODE_DESC}>{data.CODE_DESC}</option>
                                                    ))
                                                }
                                            </select>
                                                <div className="text-danger">{this.state.errAddBillingAddressCountry}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-12">
                                                <p>Note-<span className="text-danger">*</span> indicates required field</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12 text-right">
                                        <button type="button" className="btn btn-outline-success btn-sm"
                                          onClick={()=>this.addSaveHandle()}
                                        >Save</button>
                                        <button type="button" className="btn btn-outline-success btn-sm ml-2">Add</button>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <strong style={{cursor: 'pointer', color: 'Blue'}}
                                        onClick={()=>{this.onSearchHandler();this.resetAddData();this.setState({showAddAddressSection: false,
                                          selectedItem:[]})
                                        }}
                                    >{'< Back'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : null
                }
                {
                    this.state.showModifyAddressSection ? (
                    <div className="modify_address_section">
                    <PageHeading
                        heading=""
                        subheading="Fill in the relevant info and click the Save button to save the address."
                    />
                    <TabHeading color={'bg-info text-white'}>Modify Address</TabHeading>
                    <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label> Code<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control"
                                                 value={this.state.modifyCode}
                                                 onChange={(e)=>e.target.value}
                                                 readOnly/>
                                                <div className="text-danger"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Address<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control mb-2" placeholder=""
                                                  value={this.state.modifyAddressLine1}
                                                  onChange={(e)=>{this.setState({modifyAddressLine1: e.target.value})}}
                                                />
                                                <input name="" type="text" className="form-control mb-2" placeholder=""
                                                  value={this.state.modifyAddressLine2}
                                                  onChange={(e)=>{this.setState({modifyAddressLine2: e.target.value})}}
                                                />
                                                <input name="" type="text" className="form-control mb-2" placeholder=""
                                                  value={this.state.modifyAddressLine3}
                                                  onChange={(e)=>{this.setState({modifyAddressLine3: e.target.value})}}
                                                />
                                                <div className="text-danger">{this.state.errModifyAddressLine1}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label> City<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control" placeholder=""
                                                  value={this.state.modifyCity}
                                                  onChange={(e)=>{this.setState({modifyCity: e.target.value})}}
                                                />
                                                <div className="text-danger">{this.state.errModifyCity}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>State<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <select className="form-control"
                                                    value={this.state.modifySelectedState}
                                                    onChange={(e)=>{this.onStateSelected(e)}}
                                                >
                                                    <option value="null">--Select--</option>
                                                    {
                                                        this.state.stateList &&
                                                        this.state.stateList.map((data)=>(
                                                            <option value={data.CODE_DESC}>{data.CODE_DESC}</option>
                                                        ))
                                                    }
                                                </select>
                                                <div className="text-danger">{this.state.errModifySelectedState}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Post Code<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                                <input name="" type="text" className="form-control" placeholder="" pattern="^-?[0-9]\d*\.?\d*$" maxLength="6" onKeyUp={(e)=>this.isNumberKeyMod(e)}
                                                  value={this.state.modifyPostCode}
                                                  onChange={(e)=>{this.setState({modifyPostCode: e.target.value})}}
                                                />
                                                <div className="text-danger">{this.state.errModifyPostCode}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-4"><label>Country<span className="text-danger">*</span> : </label></div>
                                            <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.modifySelectedCountry}
                                                onChange={(e)=>{this.onCountrySelected(e.target.value)}}
                                            >
                                                <option value="null">--Select--</option>
                                                {
                                                    this.state.countryList &&
                                                    this.state.countryList.map((data)=>(
                                                        <option value={data.CODE_DESC}>{data.CODE_DESC}</option>
                                                    ))
                                                }
                                            </select>
                                                <div className="text-danger">{this.state.errModifyBillingAddressCountry}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-12">
                                                <p>Note-<span className="text-danger">*</span> indicates required field</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12 text-right">
                                        <button type="button" className="btn btn-outline-success btn-sm"
                                          onClick={()=>this.modifySaveHandle()}
                                        >Save</button>
                                        <button type="button" className="btn btn-outline-danger btn-sm ml-2"  onClick={()=>this.onDeleteClickHandler()} >Delete</button>
                                        <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                          onClick={()=>this.resetClickHandler()}
                                        >Reset</button>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="row mb-3">
                                    <strong style={{cursor: 'pointer', color: 'Blue'}}
                                        onClick={()=>{this.onSearchHandler();this.setState({showModifyAddressSection: false,selectedItem:[]})}}
                                    >{'< Back'}</strong>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : null
                }
        </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing: state.dashboard_listing.responseList_2,
    loading: state.dashboard_listing.loading,
    fixed_roles: state.fixed_roles.responseList,
    country : state.ed_country.responseList,
    stateData : state.ed_state.responseList,
})

const mapDispatchToProps = dispatch => ({
    GetCountry : () => dispatch(GetCountry())
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
