import React, { Component, Fragment } from 'react';
import Loader from '../../../../../../Component/Loader'
import PageHeading from '../../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux'
import BootstrapCustomTable from '../../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../../Component/Modal/alert'
import { FromInputs} from '../../../../../../Component/From/FromInputs'
import { GetAccountData, GetCategoryCode, Getuom,GetAddCommodity } from '../../../../../../Actions/SysAdmin'
import { CheckFileDetails } from '../../../../../../Actions/Common/Functions'
import {
  AddUpdateItemMaster,
  GetItemById,
  CommoditySearchResult,
  getAdduom
} from '../../../../../../Apis/SysAdmin'
import { ApiExtract } from '../../../../../../Common/GetDatas'
import Modal from '../../../../../../Component/Modal'
import {Field, reduxForm } from 'redux-form';

import {UploadDocuments} from '../../../../../../Actions/Requester'
import {GetDownloadFile } from '../../../../../../Actions/Approver'


class ItemMaster extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal_body: '',
            rendered: false,
            title: '',
            account_data: [],
            category_code: [],
            uom: [],
            message: '',
            show_roles: false,
            status: false,
            show: false,
            commodity_rendered: false,
            modal_add_commodity:false,
            vendor_array : [],
            showVendor: true,
            showItemSpecification: true,
            commoditySearchList: [],
            uomListData: [],
            itemCodeValidation: '',
            itemNameValidation: '',
            commodityTypeValidation: '',
            UOMValidation: '',
            picture_name: '',
            fileA_name: '',
            itemMasterDetails : {
                "itemCode":"",
                "itemName":"",
                "itemType":"1",
                "qcVerification": "1",
                "referenceNo":"",
                "description":"",
                "categoryCode":"",
                "accountCode":"",
                "uom":"",
                "safetyLevelMinInventory": parseFloat(0).toFixed(2),
                "orderQuantityMin": parseFloat(0).toFixed(2),
                "orderQuantityMax": parseFloat(0).toFixed(2),
                "categoryCode":"",
                "reorderQuantityLevel": parseFloat(0).toFixed(2),
                "budgetPrice":"",
                "iqcTestType":"",
                "eoq":"",
                "ratio":"",
                "oversea":"",
                "partialDeliveryCd":"",
 // Item Specification
                "brand":"",
                "model":"",
                "drawingNumber":"",
                "versionNo":"",
                "grossWeight":"",
                "netWeight":"",
                "length":"",
                "width":"",
                "height":"",
                "volume":null,
                "colorInfo":null,
                "hsCode":"",
                "remarks":"",
                "deleted":false,
                "entBy":"",

                "manufacturer":"",
                "manufacturer2":"",
                "manufacturer3":"",
                "specification1":"",
                "specification2":"",
                "specification3":"",
                "packingType":"",
                "packingQuantity":"",
                "sectionCode":"",
                "locationCode":"",
                "iqcInd":"",
                "invQtyMax":"",
                "newItemCode":""
             },
            search_object: {
                "frm": "listing",
                "role": "",
                "panelName": ""
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        console.log(props.location);

        if ((!state.file_upload) &&  props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList) {
            return {
                products: props.dashboard_listing.responseList,
                rendered: true,
            }
        } else if( (state.file_upload) && props.upload_document && state.pictureBool){
            console.log('props.upload_document ',props.upload_document);
            return {
                pictureName : state.picture_name
            }
         }

         else if( (state.file_upload) && props.upload_document && state.fileABool){
            return {
                fileAName : state.fileA_name
            }
         }
         console.log('props derived',props);
         return {props, state}
    }

    componentDidMount() {
        console.log('item master mode inside component',localStorage.getItem('itemObj'));
        let state = this.props.location.state;
        let itemMaster={};
        if(state)
            itemMaster=  state.itemMaster;
        else{
            let itemMasterDetail= localStorage.getItem('itemObj') ;
             console.log('itemMasterDetail ',itemMasterDetail);
        }

        this.props.GetAccountData({
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"]
        })
        this.props.GetCategoryCode()
        this.props.Getuom();
        if(this.props.location.mode == 'modify'  )
            this.getItemMasterDetail(itemMaster);
        else if(localStorage.getItem('itemObj')!= undefined){
            itemMaster['PM_PRODUCT_CODE']= localStorage.getItem('itemObj');
            this.getItemMasterDetail(itemMaster);
        }
        this.getCommodityTypeList("");
        this.getUomdataList();
    }

    getUomdataList = async()=> {
      let response = await ApiExtract(getAdduom, {});

      if (response && response.response) {
          this.setState({
            uomListData: response.response
          });
      }
    }

    getCommodityTypeList = async (selectedOption) => {
        console.log("selectedOption", selectedOption);
        let response = await ApiExtract(
          CommoditySearchResult,
          { searchCommodity: selectedOption }
        );

        if (response && response.response) {
            this.setState({
                selectedOption,
                commoditySearchList: response.response.map((item) => {
                  let obj = {};
                  obj.value = item.CT_ID;
                  obj.label = item.CT_NAME;
                  return obj;
                }),
            });
        }
    }

    componentWillUnmount(){
        localStorage.removeItem('itemObj')
    }
    async getItemMasterDetail(itemMaster){
    //    let itemObj = {"itemCode": itemMaster.PM_PRODUCT_CODE,'mode':'mod'};
        localStorage.setItem('itemObj',itemMaster.PM_PRODUCT_CODE)
   //     this.setState({loading:true})
        let _status = await ApiExtract(GetItemById, { "itemCode": itemMaster.PM_PRODUCT_CODE,
        "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"]});

        console.log('status ',_status);

        if(_status){
            if(_status.status){
                let itemDetails = _status.response[0];

                console.log('itemDetails ',itemDetails);
                  debugger;
                   let itemMasterDetails = {
                     "itemCode":itemDetails.PM_VENDOR_ITEM_CODE,
                    "itemName":itemDetails.PM_PRODUCT_DESC,
                    "productCode": itemDetails.PM_PRODUCT_CODE,
                    "itemType":itemDetails.PM_PRODUCT_TYPE === null ? '1' : itemDetails.PM_PRODUCT_TYPE,
                    "referenceNo":itemDetails.PM_REF_NO,
                    "description":itemDetails.PM_LONG_DESC,
                    "categoryCode":itemDetails.PM_CATEGORY_NAME,
                    "accountCode":itemDetails.PM_ACCT_CODE,
                    "uom":itemDetails.PM_UOM,
                    "safetyLevelMinInventory":parseFloat(itemDetails.PM_SAFE_QTY).toFixed(2),
                    "orderQuantityMin":parseFloat(itemDetails.PM_ORD_MIN_QTY).toFixed(2),
                    "orderQuantityMax":parseFloat(itemDetails.PM_ORD_MAX_QTY).toFixed(2),
                  //  "categoryCode":"",
                    "reorderQuantityLevel":itemDetails.PM_REORDER_QTY !== null ? parseFloat(itemDetails.PM_ORD_MAX_QTY).toFixed(2) : parseFloat(0).toFixed(2),
                    "budgetPrice":itemDetails.PM_BUDGET_PRICE,
                    "iqcTestType":itemDetails.PM_IQC_TYPE,
                    "eoq":itemDetails.PM_EOQ,
                    "ratio":itemDetails.PM_RATIO,
                    "oversea":itemDetails.PM_OVERSEA,
                    "partialDeliveryCd":itemDetails.PM_PARTIAL_CD,
     // Item Specification
                    "brand":itemDetails.PM_PRODUCT_BRAND,
                    "model":itemDetails.PM_PRODUCT_MODEL,
                    "drawingNumber":itemDetails.PM_DRAW_NO,
                    "versionNo":itemDetails.PM_VERS_NO,
                    "grossWeight":itemDetails.PM_GROSS_WEIGHT,
                    "netWeight":itemDetails.PM_NET_WEIGHT,
                    "length":itemDetails.PM_LENGHT,
                    "width":itemDetails.PM_WIDTH,
                    "height":itemDetails.PM_HEIGHT,
                    "volume":itemDetails.PM_VOLUME,
                    "colorInfo":itemDetails.PM_COLOR_INFO,
                    "hsCode":itemDetails.PM_HSC_CODE,
                    "remarks":itemDetails.PM_REMARKS,
                    "deleted":false,
                    "entBy":itemDetails.PM_ENT_BY,

                    "manufacturer":itemDetails.PM_MANUFACTURER,
                    "manufacturer2":itemDetails.PM_MANUFACTURER2,
                    "manufacturer3":itemDetails.PM_MANUFACTURER3,
                    "specification1":itemDetails.PM_SPEC1,
                    "specification2":itemDetails.PM_SPEC2,
                    "specification3":itemDetails.PM_SPEC3,
                    "packingType":itemDetails.PM_PACKING_TYPE,
                    "packingQuantity":itemDetails.PM_PACKING_QTY,
                    "sectionCode":itemDetails.PM_SECTION,
                    "locationCode":itemDetails.PM_LOCATION,
                    "iqcInd":itemDetails.PM_IQC_IND,
                    "invQtyMax":itemDetails.PM_MAX_INV_QTY,
                    "newItemCode":itemDetails.PM_NEW_ITEM_CODE,
                    "preferSCoyId": itemDetails.PM_PREFER_S_COY_ID_TAX_ID,
                    "sCoyId1": itemDetails.PM_1ST_S_COY_ID,
                    "sCoyId2": itemDetails.PM_2ND_S_COY_ID,
                    "sCoyId3": itemDetails.PM_3RD_S_COY_ID,
                    "sCoyIdTaxId": itemDetails.PM_PREFER_S_COY_ID_TAX_ID,
                    "sCoyTaxId1": itemDetails.PM_1ST_S_COY_ID_TAX_ID,
                    "sCoyTaxId2": itemDetails.PM_2ND_S_COY_ID_TAX_ID,
                    "sCoyTaxId3": itemDetails.PM_3RD_S_COY_ID_TAX_ID,
                    "packingReq": itemDetails.PM_PACKING_REQ,
                    "modeBy": itemDetails.BCM_MOD_BY,
                }

                if(itemDetails.files && itemDetails.files.length > 0){
                    if(itemDetails.files.length == 1){
                        let files = itemDetails.files[0];
                        if(files.PA_TYPE == 'I')
                            this.setState({pictureName : files.PA_ATTACH_FILENAME});
                        else{
                            this.setState({fileAName : files.PA_ATTACH_FILENAME});
                        }
                    }
                    if(itemDetails.files.length == 2){
                     //   let files = itemDetails.files[0];
                        if(itemDetails.files[0].PA_TYPE == 'I')
                        this.setState({pictureName : itemDetails.files[0].PA_ATTACH_FILENAME,
                         fileAName : itemDetails.files[1].PA_ATTACH_FILENAME});
                         else{
                        this.setState({fileAName : itemDetails.files[0].PA_ATTACH_FILENAME,
                            pictureName: itemDetails.files[1].PA_ATTACH_FILENAM});
                        }
                    }
                }
                if(itemDetails.commodityTypes){
                    this.setState({commodityName : itemDetails.commodityTypes.CT_NAME});
                }

                this.setState({
                    loading:false,
                    strMode:"mod",
                    itemMasterDetails: itemMasterDetails,

                });
               // this.props.initialize(companyDetails)
            }
        }
    }

    componentDidUpdate() {
        if (this.state.account_data && this.state.account_data.length === 0
            && this.props.account_data && this.props.account_data.length > 0) {
            this.setState({
                account_data: this.props.account_data
            })
        }
        if (this.state.category_code && this.state.category_code.length === 0
            && this.props.category_code && this.props.category_code.length > 0) {
            this.setState({
                category_code: this.props.category_code
            })
        }
        if (this.state.uom && this.state.uom.length === 0
            && this.props.uom && this.props.uom.length > 0) {
            this.setState({
                uom: this.props.uom
            })
        }
    }

    closeModel(details) {
        this.setState({
            show: false,
        })
    }


    get_details = (row) => {

      this.setState({commodityType: row.CT_ID, commodityName: row.CT_NAME, model : false,
        modal_add_commodity :false });
    }

    backButtonHandler = () => {
        this.props.history.push('/item_master_maint');
    }

    FileUpload = (attachment) => {
        let picture = this.state.picture
        let strDocType ='',blnTemp='',uploadType='';

        if(attachment == "picture"){
            this.setState({pictureBool: true, fileABool: false});
            strDocType= "picture";
            blnTemp = false;
            uploadType = '1';
        }else if(attachment == "fileA"){
            this.setState({fileABool: false, pictureBool: true});
            strDocType= "fileA";
            blnTemp= true;
            uploadType = '3';
        }


        let req = {
            "pEnumUploadType": uploadType,
            "strDocType": strDocType,
            "pEnumUploadForm": "1",
            "strDocNo": "",
            "blnTemp": blnTemp,
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

        if(attachment == "picture"){
            this.props.UploadDocuments(this.state.picture, req);
            this.setState({pictureBool: true, fileABool: false});
            strDocType= "picture";
        }else if(attachment == "fileA"){
            this.props.UploadDocuments(this.state.fileA, req);
            this.setState({fileABool: false, pictureBool: true});
            strDocType= "fileA";
        }
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

    sendUpload = (e) => {
      debugger;
        let _details  = CheckFileDetails(e);
        if(_details.status){
            if(e.target.name === "picture"){
                this.setState({
                    picture : e.target.files[0],
                    picture_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }
            else if(e.target.name === "fileA"){
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


    DownloadDocuments  = (nternal_file) =>{
        this.props.GetDownloadFile(nternal_file)
    }

    handlefromsubmit= async(values={}) =>{
        let { itemMasterDetails} = this.state
        console.log('values ',itemMasterDetails);
        if(itemMasterDetails){
            let _temp = Object.assign({}, itemMasterDetails, itemMasterDetails)
         _temp.companyId= this.state.companyId;
         _temp.vendor =[];

        if(this.state.vendorType1 || this.state.leadTime1 || this.state.vendorCode1){
            _temp.vendor.push({
                                "vendorType":this.state.vendorType1,
                                "coyId":"pamb",
                                "leadTime":this.state.leadTime1,
                                "vendorCode":this.state.vendorCode1,
                                "deliveryTerm":"DT",
                                "suppCode":"SC",
                                "paymentCode":"PC",
                                "currency":"CU",
                                "purchaserSpecNo":"PSN",
                                "revision":"RV",
                                "entBy":"sysAdmin",
                                "blnGST":true,
                                "taxId":0
                    });
        }
        if(this.state.vendorType2 || this.state.leadTime2 || this.state.vendorCode2){
            _temp.vendor.push({
                             "vendorType":this.state.vendorType2,
                             "coyId":"pamb",
                             "leadTime":this.state.leadTime2,
                             "vendorCode":this.state.vendorCode2,
                             "deliveryTerm":"DT",
                             "suppCode":"SC",
                             "paymentCode":"PC",
                             "currency":"CU",
                             "purchaserSpecNo":"PSN",
                             "revision":"RV",
                             "entBy":"sysAdmin",
                             "blnGST":true,
                             "taxId":0
                 });
        }

        if(this.state.vendorType3 || this.state.leadTime3 || this.state.vendorCode3){
            _temp.vendor.push({
                            "vendorType":this.state.vendorType1,
                            "coyId":"pamb",
                            "leadTime":this.state.leadTime1,
                            "vendorCode":this.state.vendorCode1,
                            "deliveryTerm":"DT",
                            "suppCode":"SC",
                            "paymentCode":"PC",
                            "currency":"CU",
                            "purchaserSpecNo":"PSN",
                            "revision":"RV",
                            "entBy":"sysAdmin",
                            "blnGST":true,
                            "taxId":0
                });
        }

        if(this.state.vendorType4 || this.state.leadTime4 || this.state.vendorCode4){
            _temp.vendor.push({
                            "vendorType":this.state.vendorType4,
                            "coyId":"pamb",
                            "leadTime":this.state.leadTime4,
                            "vendorCode":this.state.vendorCode4,
                            "deliveryTerm":"DT",
                            "suppCode":"SC",
                            "paymentCode":"PC",
                            "currency":"CU",
                            "purchaserSpecNo":"PSN",
                            "revision":"RV",
                            "entBy":"sysAdmin",
                            "blnGST":true,
                            "taxId":0
                });
        }


         _temp.strMode = this.state.strMode == 'mod'? 'mod':'add';
         _temp.entBy= "sysadmin";
         _temp.commodityType = this.state.commodityType;
            if(1){
                this.setState({loading:true})
                let _status = await ApiExtract(AddUpdateItemMaster, _temp);
                if(_status){
                    this.setState({
                        loading:false,
                        show:true,
                        title : '',
                        status :_status.status,
                        message : (_status.message) ? _status.message :'Item Master saved',
                    })
                }
            }
            else{
                this.setState({
                    loading:false,
                    show: true,
                    title : '',
                    status : false,
                    message : "Choose Atleast One Application Package"
                })
            }

        }

     }

    closemodel = () => {
        this.setState({
            model : false,
            modal_add_commodity :false ,
            show : false
        })
        if(this.state.submit_type=="Submit"){
            window.location.reload();
        }
    }

    handlePopupCommodity = (e) => {
        console.log('e.target.name ',[e.target.name]);
        console.log('e.target.value ',e.target.value);
        this.setState({[e.target.name]:e.target.value});
    }

    handlepopformsubmit = (values) =>{
        console.log('this.state.commodityTypeS ',this.state.commodityTypeS);

        let _values = values
        if(this.state.commodityTypeS)
            this.props.GetAddCommodity ({
                "searchCommodity": this.state.commodityTypeS || '',
            })

        this.setState({
          commodity_rendered :true
        })
    }

    onPopOpen = () => {
        this.setState({ modal_add_commodity : true,
            modal_add_title:'Commodity Search'
        })
    }


    handleChange(keyName,e){

        let key = this.state[keyName];
        key[e.target.name]= e.target.value;
        this.setState({[keyName] : key});
    }

    handleVendorChange = (e,index) => {
        this.setState({[e.target.name]:e.target.value});
        // vendor_array.push({
        //     "vendorType":"1",
        //     "coyId":"pamb",
        //     "leadTime":1,
        //     "vendorCode":"VC",
        //     "deliveryTerm":"DT",
        //     "suppCode":"SC",
        //     "paymentCode":"PC",
        //     "currency":"CU",
        //     "purchaserSpecNo":"PSN",
        //     "revision":"RV",
        //     "entBy":"sysAdmin2",
        //     "blnGST":false,
        //     "taxId":101});
      }

      handleCommodityChange = (selectedOption) => {
          this.setState({
            commodityName: selectedOption.value,
            commodityType: selectedOption
           });
          console.log(`Option selected:`, selectedOption);
      }

      saveHandler = ()=> {
        this.setState({
          itemCodeValidation: this.state.itemMasterDetails.itemCode.length > 0 ? '' : 'Item Code is required',
          itemNameValidation: this.state.itemMasterDetails.itemName.length > 0 ? '' : 'Item Name is required',
          commodityTypeValidation: this.state.commodityName.length > 0 ? '' : 'Commodity Type is required',
          UOMValidation: this.state.itemMasterDetails.uom.length > 0 ? '' : 'Unit of Measurement is required'
        })
      }


    render() {

        const { handleSubmit } = this.props

        const _table_commodity_header = [
                {name : "UNSPSC Code", id:"CT_CODE", width:'50px', key:true, key:true,
                formatter: (cellContent, row) => {
                    return (
                        <a className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.CT_CODE}</a>
                )}},
                {name : "Level 1 Description", id:"CT_LEVEL_1", width:'50px'},
                {name : "Level 2 Description", id:"CT_LEVEL_2", width:'50px'},
                {name : "Level 3 Description", id:"CT_LEVEL_3", width:'50px'},
                {name : "Level 4 Description", id:"CT_LEVEL_4", width:'50px'}
        ];


        const {itemMasterDetails}= this.state;
        let vendorActive = this.state.showVendor? '': ' active';
        let itemSpecificationActive = this.state.showItemSpecification? '': ' active';

        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}

            <div className="show_list">
                <PageHeading
                    heading=""
                    subheading="Fill in the required field(s) and click the Add button to add new item or Save button to save the changes."
                />
                <TabHeading color={'bg-info text-white'}> <span>Item Information</span></TabHeading>
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Item Code <span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="itemCode" type="text" value={itemMasterDetails.itemCode} onChange={this.handleChange.bind(this,"itemMasterDetails")} className="form-control" />
                                            <div className="text-danger">{this.state.itemCodeValidation}</div>
                                        </div>

                                        <div className="col-12 col-md-2">
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="checkbox" name="itemType" id="check" checked="checked" />
                                                <label className="form-check-label ml-2" for="inlineRadio2">Active</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Item Name <span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="itemName" value={itemMasterDetails.itemName} onChange={this.handleChange.bind(this,"itemMasterDetails")} type="text" className="form-control" />
                                            <div className="text-danger">{this.state.itemNameValidation}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> Reference No. : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="referenceNo" value={itemMasterDetails.referenceNo} onChange={this.handleChange.bind(this,"itemMasterDetails")} type="text" className="form-control"/>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Item Type : </label></div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="radio" name="itemType" id="radio"
                                                  value={1}
                                                  onChange={this.handleChange.bind(this,"itemMasterDetails")}
                                                  checked={this.state.itemMasterDetails.itemType === '1'}
                                                />
                                                <label className="form-check-label ml-2" for="inlineRadio2">Spot (Non-Inventoried item)</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="radio" name="itemType" id="radio2"
                                                  value={2}
                                                  onChange={this.handleChange.bind(this,"itemMasterDetails")}
                                                  checked={this.state.itemMasterDetails.itemType === '2'}
                                                />
                                                <label className="form-check-label ml-2" for="inlineRadio2">Stock (Direct material - Inventoried item)</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="radio" name="itemType" id="radio3"
                                                  value={3}
                                                  onChange={this.handleChange.bind(this,"itemMasterDetails")}
                                                  checked={this.state.itemMasterDetails.itemType === '3'}
                                                />
                                                <label className="form-check-label ml-2" for="inlineRadio2">MRO, M&E and IT (Inventoried item)</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> Need QC/Verification : </label></div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="radio" name="qcVerification" id="radio3"
                                                  value="1"
                                                  checked={this.state.itemMasterDetails.qcVerification === '1'}
                                                  onChange={this.handleChange.bind(this,"itemMasterDetails")}
                                                  disabled={this.state.itemMasterDetails.itemType === '1'}
                                                />
                                                <label className="form-check-label ml-2" for="inlineRadio2">No</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input classNmae="form-check-input" type="radio" name="qcVerification" id="radio2"
                                                  value="2"
                                                  checked={this.state.itemMasterDetails.qcVerification === '2'}
                                                  onChange={this.handleChange.bind(this,"itemMasterDetails")}
                                                  disabled={this.state.itemMasterDetails.itemType === '1'}
                                                />
                                                <label className="form-check-label ml-2" for="inlineRadio2">Yes</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> Description : </label></div>
                                        <div className="col-12 col-md-6">
                                            <textarea name="description" value={itemMasterDetails.description} onChange={this.handleChange.bind(this,"itemMasterDetails")} className="form-control" id="ctm-textar"></textarea>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0"><label> Commodity Type<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <div class="input-group">
                                                <select
                                                    className="form-control w-50"
                                                    name="selectedOption"
                                                    value={this.state.commodityName}
                                                    onChange={(e) => this.handleCommodityChange(e.target)}
                                                >
                                                  <option value="">--Select--</option>
                                                  {
                                                    this.state.commoditySearchList.length > 0 && this.state.commoditySearchList.map(data=>(
                                                      <option value={data.value}>
                                                        {data.label}
                                                      </option>
                                                    ))
                                                  }
                                                </select>
                                                <div class="input-group-append">
                                                    <button className="btn btn-sm btn-outline-success" onClick={this.onPopOpen.bind(this)} type="button">Search</button>
                                                </div>
                                            </div>
                                            <div className="text-danger">{this.state.commodityTypeValidation}</div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0"><label>Account Code : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select name="accountCode"
                                              value={itemMasterDetails.accountCode}
                                              onChange={this.handleChange.bind(this,"itemMasterDetails")}
                                              className="form-control"
                                            >
                                                <option value="">N/A</option>
                                                {this.state.account_data.map((data) => (
                                                    <option>{data.CBG_B_GL_CODE}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0"><label>Category Code : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select name="categoryCode" className="form-control" value={itemMasterDetails.categoryCode} onChange={this.handleChange.bind(this,"itemMasterDetails")}>
                                                <option value="">N/A</option>
                                                {this.state.category_code.map((data,index) => (
                                                    <option value={index+1}>{data.CBC_B_CATEGORY_CODE}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> UOM<span className="text-danger">*</span> : </label></div>
                                        <div className="col-12 col-md-6">
                                            <select name="uom"
                                              value={itemMasterDetails.uom}
                                              className="form-control"
                                              onChange={this.handleChange.bind(this,"itemMasterDetails")}
                                            >
                                                <option value="">--Select--</option>
                                                {this.state.uomListData.map((data) => (
                                                    <option value={data.CODE_ABBR}>{data.CODE_DESC}</option>
                                                ))}
                                            </select>
                                            <div className="text-danger">{this.state.UOMValidation}</div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0"><label> Order Quantity (Min) : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="orderQuantityMin" type="number" value={itemMasterDetails.orderQuantityMin} onChange={this.handleChange.bind(this,"itemMasterDetails")} className="form-control right" placeholder="" />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0"><label>Order Quantity (Max) : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="orderQuantityMax" type="number" className="form-control right" placeholder="" value={itemMasterDetails.orderQuantityMax} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0"><label> Safety Level (Min Inventory : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="safetyLevelMinInventory" type="number" className="form-control right" placeholder="" value={itemMasterDetails.safetyLevelMinInventory} onChange={this.handleChange.bind(this,"itemMasterDetails")}  />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0"><label> Max Inventory Quantity : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="reorderQuantityLevel" type="number" className="form-control right" placeholder="" value={itemMasterDetails.reorderQuantityLevel} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0 hint">
                                            <label>Picture Attachment : </label>
                                            <p>Recommended file size is 10240 KB (JPG & GIF) </p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <input type="file"
                                              accept="image/jpg,image/jpeg,image/gif"
                                              ref={ref=> this.picture = ref}
                                              onChange={this.sendUpload}
                                              name="picture"
                                              className="form-control"
                                            />
                                            <div className="text-danger"></div>
                                        </div>
                                        <div className="col-md-2">
                                        <button type="button" type="button" className="btn btn-outline-primary btn-sm "
                                          value="Upload"
                                          data-name={this.state.TC}
                                          onClick={() => this.FileUpload("picture")}
                                          disabled={this.state.picture_name === ""}
                                        >Upload</button>
                                      </div>

                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0 hint">
                                            <label>Picture Attached : </label>
                                        </div>
                                        <div className="col-12 col-md-6 logo">
                                            <a onClick={() => this.DownloadDocuments({strFile: '',strFile1:'',CDA_DOC_TYPE:'TermAndCond'})} className="text-primary"> {this.state.pictureName ?  this.state.pictureName : 'No Files Attached'} </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0 hint">
                                            <label>File Attachment : </label>
                                            <p>Recommended file size is 10240 KB</p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <input name=""
                                              type="file"
                                              accept=".doc, .docx, .xls, .xlsx"
                                              ref={ref=> this.fileA = ref}
                                              onChange={this.sendUpload}
                                              name="fileA"
                                              className="form-control"
                                            />
                                            <div className="text-danger"></div>
                                        </div>
                                        <div className="col-md-2">
                                          <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            value="Upload"
                                            data-name={this.state.fileA}
                                            onClick={() => this.FileUpload('fileA')}
                                            disabled={this.state.fileA_name === ""}
                                          >Upload</button>
                                        </div>

                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4 pl-0 hint">
                                            <label>File Attached : :</label>
                                        </div>
                                        <div className="col-12 col-md-6 logo">
                                            <a hre="#" className="text-primary">{this.state.fileAName ?  this.state.fileAName :'No Files Attached'} </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TabHeading color={'bg-info text-white btn-up' + itemSpecificationActive}
                      onClick={()=>{this.setState({showItemSpecification: !this.state.showItemSpecification})}}
                    > <span> Item Specification </span> </TabHeading>
                    {
                      this.state.showItemSpecification ? (
                      <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Brand : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="brand" type="text" className="form-control" value={itemMasterDetails.brand} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Manufacturer Name : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="manufacturer" type="text" className="form-control" value={itemMasterDetails.manufacturer} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Drawing Number : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="drawingNumber" type="text" className="form-control" value={itemMasterDetails.drawingNumber} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Model : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="model" type="text" className="form-control" value={itemMasterDetails.model} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> Gross Weight (kg) : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="grossWeight" type="text" className="form-control" value={itemMasterDetails.grossWeight} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Net Weight (kg) : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="netWeight" type="text" className="form-control" value={itemMasterDetails.netWeight} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Length (meter) : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="length" type="text" className="form-control" value={itemMasterDetails.length} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Version No. : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="versionNo" type="text" className="form-control" value={itemMasterDetails.versionNo} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Packing Specification : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="specification1" type="text" className="form-control" value={itemMasterDetails.specification1} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> Width (meter) : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="width" type="text" className="form-control" value={itemMasterDetails.width} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Color Info : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="colorInfo" type="text" className="form-control" value={itemMasterDetails.colorInfo} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> Volume (liter) : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="volume" type="text" className="form-control" value={itemMasterDetails.volume} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>HS Code : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="hsCode" type="text" className="form-control" value={itemMasterDetails.hsCode} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Height (meter) : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="height" type="text" className="form-control" value={itemMasterDetails.height} onChange={this.handleChange.bind(this,"itemMasterDetails")} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-12">
                                    <div className="row">
                                        <div className="col-12 col-md-2 pl-0"><label>Remark : </label></div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="remarks" class="form-control" value={itemMasterDetails.remarks} onChange={this.handleChange.bind(this,"itemMasterDetails")} id="ctm-textar"></textarea>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ): null
                  }
                    <TabHeading color={'bg-info text-white btn-up' + vendorActive}
                      onClick={()=>{this.setState({showVendor: !this.state.showVendor})}}
                    >
                    <span>Vendor</span> </TabHeading>
                    {
                      this.state.showVendor ? (
                      <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"></div>
                                        <div className="col-12 col-md-8">
                                            <label>Use type ahead feature to select vendor</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Order Lead Time(Days)</label></div>
                                        <div className="col-12 col-md-6">
                                            <label>Vendor Item Code</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>Preferred Vendor :</label></div>
                                        <div className="col-12 col-md-8">
                                            <input name="vendorType1" type="text" className="form-control" value={this.state.vendorType1} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0">
                                            <input name="leadTime1" type="text" className="form-control" value={this.state.leadTime1} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <input name="vendorCode1" type="text" className="form-control" value={this.state.vendorCode1} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label>1<sup>st</sup> Alternative Vendor  :</label></div>
                                        <div className="col-12 col-md-8">
                                            <input name="vendorType2" type="text" className="form-control" value={this.state.vendorType2} onChange={this.handleVendorChange.bind(this)}/>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0">
                                            <input name="leadTime2" type="text" className="form-control" value={this.state.leadTime2} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <input name="vendorCode2" type="text" className="form-control" value={this.state.vendorCode2} onChange={this.handleVendorChange.bind(this)}/>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> 2<sup>nd</sup> Alternative Vendor  :</label></div>
                                        <div className="col-12 col-md-8">
                                            <input name="vendorType3" type="text" className="form-control" value={this.state.vendorType3} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0">
                                            <input name="leadTime3" type="text" className="form-control" value={this.state.leadTime3} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <input name="vendorCode3" type="text" className="form-control" value={this.state.vendorCode3} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0"><label> 3<sup>rd</sup> Alternative Vendor :</label></div>
                                        <div className="col-12 col-md-8">
                                            <input name="vendorType4" type="text" className="form-control" value={this.state.vendorType4} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-4 pl-0">
                                            <input name="leadTime4" type="text" className="form-control" value={this.state.leadTime4} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <input name="vendorCode4" type="text" className="form-control" value={this.state.vendorCode4} onChange={this.handleVendorChange.bind(this)} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  ) : null
                }

                <div className="row mt-2">
                    <div className="col-12 col-md-12">
                        <p>Note- <span className="text-danger">*</span> indicatesrequired field</p>
                    </div>
                </div>
                <div className="col-12 col-md-6 mt-3 pl-1">
                    <div className="row mb-3">
                        <div className="col-12">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={this.backButtonHandler}>Back</button>
                            <button type="submit" className="btn btn-outline-success btn-sm ml-2"
                              onClick={()=>{this.saveHandler()}}
                            >Save</button>
                            <button type="submit" className="btn btn-outline-success btn-sm ml-2">Add</button>
                        </div>
                    </div>
                </div>
                </form>
            </div>

            <Modal size={'lg'} open={this.state.modal_add_commodity} header ={true} title ={this.state.modal_add_title} closemodel={this.closemodel} footer={false} footercontent={<Fragment>
                        <button type='button' className='btn btn-sm btn-outline-info' >Save</button>
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                    <Fragment>
                        <form >
                        <div className="row">
                            <div className="col-md-12">


                                <div className="row mt-2 ml-0">
                                         <div className="col-12 col-md-12 pl-0">
                                           <p>Please enter at least 3 character </p>
                                        </div>

                                </div>
                                <div className="row mt-2 ml-0">
                                         <div className="col-12 col-md-12 pl-0">
                                         <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                                        </div>

                                </div>
                                <div className="row mt-2">

                                        <div className="col-12 col-md-3">
                                        <label> commodity Type<span className="text-danger">*</span> : </label>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div class="input-group">
                                                <input type="text" name="commodityTypeS" onChange={this.handlePopupCommodity.bind(this)} className="form-control" placeholder="commodity Type" />
                                                <div class="input-group-append">
                                                    <button className="btn btn-sm btn-outline-success" onClick={this.handlepopformsubmit.bind(this)} type="button">Search</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-2">
                                           <button type="button" className="btn btn-sm btn-outline-success">Clear</button>
                                        </div>
                                </div>

                            </div>
                            <div className="col-6">

                                <div className="row mt-2">
                                </div>
                            </div>

                        </div>
                                <div className="mt-2">
                               {
                                 this.state.commodity_rendered ?
                                    <BootstrapCustomTable
                                      input_values = {this.state.table_inputs}
                                      change={true}
                                      getInputs={this.handleTableInputs}
                                      table_header={_table_commodity_header}
                                      table_body={this.props.commodity_data}
                                      products={this.getProducts}
                                      select={false}
                                      selectname={'itemcode'}
                                    />: null
                                  }
                                     <div className="row">
                                         <div className="col-12 mt-4">
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={this.closemodel}>Close</button>
                                         </div>
                                     </div>
                                </div>
                        </form>
                    </Fragment>
              </Modal>

                <Alert
                    confirm={this.closemodel}
                    title={this.state.title}
                    message={this.state.message}
                    status={this.state.status}
                    show={this.state.show}
                />
        </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing: state.dashboard_listing.responseList_2,
    loading: state.dashboard_listing.loading,
    fixed_roles: state.fixed_roles.responseList,
    account_data: state.account_data.responseList,
    category_code: state.category_code.responseList,
    uom: state.uom.responseList,
    commodity_data:  state.get_add_commodity.responseList,

    upload_document : state.file_upload_external.responseList,
    file_upload : state.file_upload_external.loading
})

const mapDispatchToProps = dispatch => ({
    GetAccountData: (values) => dispatch(GetAccountData(values)),
    GetCategoryCode: (values) => dispatch(GetCategoryCode(values)),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    Getuom: (values) => dispatch(Getuom(values)),
    GetAddCommodity: (values) => dispatch(GetAddCommodity(values)),
    UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values))
})

const ItemMasterHolder = connect(mapStateToProps, mapDispatchToProps)(ItemMaster);
export default reduxForm({
    form:'ItemMaster',
})(ItemMasterHolder);
