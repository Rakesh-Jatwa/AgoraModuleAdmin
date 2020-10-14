import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import Alert from '../../../../Component/Modal/alert'
import {GetDownloadFile } from '../../../../Actions/Approver'
import {GetVendorMapList, GetCountry, GetState, GetApplicationPackage, GetCurrency,  GetPaymentTerm, GetPaymentMethod} from '../../../../Actions/Eadmin'
import {VendorMapCode, CompanyDetailsList, SaveDetails} from '../../../../Apis/Eadmin'
import {GetDeleteFile} from '../../../../Actions/Vendor'
import {ApiExtract} from '../../../../Common/GetDatas'
import {UploadDocuments} from '../../../../Actions/Requester'
import {FromateDate_YY_MM_DD,CompareDate} from '../../../../Component/Dates'
import {reduxForm,  Field} from 'redux-form';
import {FromInputsParallelForCompany, FromSelectParallelForCompany,FromUplods, FormDatePickerParallelForCompany, TablePlainInput} from '../../../../Component/From/FromInputs'
import {ValidateCompanyDetails} from '../../../../validation/Eadmin'
import {CheckFileDetails} from '../../../../Actions/Common/Functions'
import {  Modal } from 'react-bootstrap';
import { DownloadFile} from '../../../../Apis/Approver';
import {Link} from 'react-router-dom'
import {UserDetails} from '../../../../Common/LocalStorage'


class CompanyDetails extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.state = {
            products:[],
            modal_body : '',
            modal : false,
            status : false,
            modal : false,
            rendered: false,
            title:'',
            message:'',
            status:false,
            show:false,
            user_status:'A',
            BCMSetting : '0',
            fin_dep_mode : 'Y',
            attachment: [],
            inv_payment_approval : 'Y',
            MultiInvAppr : 'Y',
            BACanPO : 'N',
            strApp : [],
            type:'',
            coyLogoName:"",
            Actual_TC_Name:"",
            TC_Name: "",
            companyDetails : {
                "CoyId":"",
                "CoyName":"",
                "ParentCoy":"",
                "AccountNo":"",
                "BankCode":"",
                "BranchCode":"",
                "Currency":"",
                "Address1":"",
                "Address2":"",
                "Address3":"",
                "City":"",
                "State":"",
                "PostCode":"",
                "Country":"",
                "Phone":"",
                "Fax":"",
                "Email":"",
                "CoyLogo":"",
                "BusinessRegNo":"",
                "TaxRegNo":"",
                "GSTDateLastStatus":"",
                "TaxCalBy":"",
                "PaymentMethod":"",
                "PaymentTerm":"",
                "PwdDuration":"",
                "Status":"",
                "CoyType":"",
                "BCMSetting":"",
                "BCMStart":null,
                "BCMEnd":null,
                "FinDeptMode":"",
                "InvAppr":"",
                "MultiInvAppr":"",
                "BACanPO":"",
                "PrivLabeling":"N",
                "TrainDemo":"N",
                "Skins":"1",
                "Actual_TC":"",
                "TC":"",
                "LicenseUsers":"",
                "Package":"",
                "SKU":1,
                "TransNo":null,
                "ContactPerson":"",
                "ReportUsers":"",
                "isResident":"Y",
                "CoyLongName":"",
                "WebSites":"",
                "OrgCode":"",
                "BankName":"",
                "strApp":[]
             },
            search_object : {
                "frm":"master",
                "role":""
            },
            delete:false,

        }
    }

    static getDerivedStateFromProps(props,state){

        console.log('getDerivedStateFromProps ');
        if((!state.file_upload) &&  props.vendor_map_list && props.vendor_map_list.length && !state.render){
            return {
                products: props.vendor_map_list,
                rendered : true
            }
        }
         else if( (state.file_upload) && props.upload_document && state.coyLogoBool && !state.render){
            console.log('props.upload_document ',props.upload_document);
            debugger;
            return {
                coyLogoName : (props.upload_document && props.upload_document.displayAttachFile && props.upload_document.displayAttachFile.attachFileList) ? props.upload_document.displayAttachFile.attachFileList: [],

            }
         }

         else if( (state.file_upload) && props.upload_document && state.TCBool && !state.render  && (!state.delete)){
            const actualfileNameArr= props.upload_document.displayAttachFile.attachFileList;

            let actualfileName = actualfileNameArr[actualfileNameArr.findIndex(todo => todo.strFile1 == props.upload_document.fileName)].strFile;

            return {
                Actual_TC_Name: actualfileName,
                TC_Name : props.upload_document.fileName
            }
         } else if(state.rendered && state.delete ){
             return {
                 coyLogoName :  (props.get_delete_file && props.get_delete_file.displayAttachFile && props.get_delete_file.displayAttachFile.attachFileList && props.get_delete_file.displayAttachFile.attachFileList.length>0) ? props.get_delete_file.displayAttachFile.attachFileList : []
              }
        }

         console.log('props derived',props);
         return {props, state}
    }

    async  componentDidMount(){
        this.props.GetCountry();
        this.props.GetState();
        this.props.GetCurrency();
        this.props.GetApplicationPackage();
        this.props.GetPaymentTerm();
        this.props.GetPaymentMethod();
        console.log('_componentDidMount', this.props)
        let {search} = this.props.location;


        console.log('datas ',this.props.location.search);

        if (search !="?new_company%20"){
            this.setState({
                type : 'modify'
            })
           await this.LoadDetails()
        }
        else{
            this.setState({
                type : 'new'
            })
        }
    }


    async LoadDetails(){
        this.setState({loading:true})
        let _status = await ApiExtract(CompanyDetailsList, {});
        if(_status){
            if(_status.status){
                let {companyDetails} = _status.response
                console.log('companyDetails',companyDetails)

                    this.setState({
                        loading:false,
                        CoyId:companyDetails && companyDetails.CoyId,
                        user_status:companyDetails && companyDetails.Status,
                        BCMSetting :companyDetails && companyDetails.BCMSetting,
                        fin_dep_mode :companyDetails && companyDetails.FinDeptMode,
                        inv_payment_approval :companyDetails && companyDetails.InvAppr,
                        MultiInvAppr : companyDetails && companyDetails.MultiInvAppr,
                        BACanPO : companyDetails && companyDetails.BACanPO,
                    //  start_data : companyDetails.BCMStart,
                    //   end_data : companyDetails.BCMEnd,
                        vendorType: companyDetails && companyDetails.CoyType,
                        strApp:  companyDetails ? companyDetails.strApp:[],
                        companyDetails : companyDetails,
                        coyLogo: this.state.CoyLogo
                    })
                    this.props.initialize(companyDetails)
                    this.DownloadDocumentsForLogo({strFile:companyDetails && companyDetails.CoyLogo,strFile1:companyDetails && companyDetails.CoyLogo,CDA_DOC_TYPE:'CoyLogo'})
                }

        }
    }


    DownloadDocumentsForLogo = (nternal_file) =>{
        let _this= this;       // const GetDownloadFile = (values) => {
      //      return (dispatch) => {
             //   dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
                DownloadFile(nternal_file).then(
                    ((receiveddata)=>{
                        let blob = new Blob([receiveddata], { type: "octet/stream" });
                        var fileURL = window.URL.createObjectURL(blob);
                        _this.setState({coyLogoURL: fileURL});
                //        var fileLink = document.createElement('a');
                 //       fileLink.href = fileURL;
                 //       fileLink.setAttribute('download', nternal_file.strFile);
                //        document.body.appendChild(fileLink);
                 //       fileLink.click();
                   //     dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});

                    })

                )
    }

    handleChange = (e) =>{
        this.props.GetState({countryCode : e})
    }

    closeModel (details){
        this.setState({
            show : false,
            rendered : false
        })

    }


    ChangeValue = async(values, props) =>{
        let {products} = this.state;
        let _details = [];
        if(products && products.length){
            _details =  await products.map( (list_item, index)=>{
                if(list_item.CM_COY_ID == props.CM_COY_ID){
                    list_item.VM_VENDOR_MAPPING = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            products : _details
        })
    }

    Save = async() =>{
        let {products} = this.state;
        if(products && products.length){
            this.setState({loading:true})
            let _status = await ApiExtract(VendorMapCode, {mapData:products});
            if(_status){
                this.setState({
                    loading:false,
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
        }
        else{
            this.setState({
                loading:false,
                show:true,
                title : '',
                status :false,
                message : 'No master item to save',
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({products: nextProps.vendor_map_list});
    }

    Reset = async() =>{
        this.coyLogo.value = "";
        this.tc.value = "";
        this.props.reset('CompanyDetailsHolder');
        if(this.state.CoyId)
            await this.LoadDetails();
        await this.props.GetVendorMapList(this.state.search_object)
        this.setState({
            products : [],
            rendered : false,
            CoyLogo:''
        })
    }

    handleDate = (name, date) =>{
        if(name=="start_date"){
            this.setState({
                start_data:date,
                end_data:date
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:date
            })
       }
    }

    handleCheckbox = (e, list) => {
        let {strApp} = this.state;
        if(e.checked){
            strApp.push(list.AP_APP_ID)
        }
        else{
            strApp = strApp.filter((lists)=>lists!=list.AP_APP_ID)
        }
        this.setState({
            strApp : strApp
        })
    }

    FileUpload = (attachment) => {
        let _get_details  = attachment.target;
        let CoyLogo = this.state.CoyLogo
        let strDocType ='';

 //       _file_name =  _get_details.getAttribute('data-name');
        if(attachment == "coyLogo"){
            this.setState({coyLogoBool: true, TCBool: false});
            strDocType= "CoyLogo";
        }else if(attachment == "TC"){
            this.setState({coyLogoBool: false, TCBool: true});
            strDocType= "TC";
        }


        let req = {
            "pEnumUploadType": "0",
            "strDocType": strDocType,
            "pEnumUploadForm": "1",
            "strDocNo": "",
            "blnTemp": "false",
            "strIndex": "",
            "seq": "",
            "pFrontOfficeSite": "",
            "AttachType": "",
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
            "modeType":  "New"
        }

        if(attachment == "coyLogo"){
            this.coyLogo.value = "";
            this.props.UploadDocuments(this.state.CoyLogo, req);
            this.setState({coyLogoBool: true, TCBool: false});
            strDocType= "CoyLogo";
        }else if(attachment == "TC"){
            this.tc.value = "";
            this.props.UploadDocuments(this.state.TC, req);
            this.setState({coyLogoBool: false, TCBool: true});
            strDocType= "TC";
        }
          console.log('_file_name ',attachment);
            req.AttachType = '';
            this.setState({
                modal_title: 'File Upload Validation',
                title : 'File Upload Validation',
                modal_body: 'Choose a File to Upload',
                status : false,
                model: true,
                local_render : false,
                file_upload:true,
                delete:false,
            })
    }

    SendUpload = (e) => {
        console.log('e SendUpload',e);

        let _details  = CheckFileDetails(e);
        if(_details.status){

            if(e.target.name=="coyLogo"){
                this.setState({
                    CoyLogo : e.target.files[0],
                    CoyLogo_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
           }
           else if(e.target.name=="TC"){
            this.setState({
                TC : e.target.files[0],
                TC_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
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

    handlefromsubmit= async(values={}) =>{
        let {type, companyDetails, strApp} = this.state
        if(values){

            console.log('attachment ',this.state.attachment);

            let _temp = Object.assign({}, companyDetails, values)

            console.log('_temp.ReportUsers ',_temp.ReportUsers);

            console.log('_temp ',_temp);

            console.log('_temp.ReportUsers ',parseInt(_temp.LicenseUsers) < parseInt(_temp.ReportUsers));


            if(parseInt(_temp.LicenseUsers) < parseInt(_temp.ReportUsers)){
                    this.setState({
                    loading:false,
                    show: true,
                    title : '',
                    status : false,
                    message : "Report User can not more than License"
                })
            }else if(this.state.start_data && this.state.end_data && !CompareDate(this.state.start_data, this.state.end_data)){
                this.setState({
                    loading:false,
                    show: true,
                    title : '',
                    status : false,
                    message : "End date should be greater than or equal to Start date"
                })
            }else{
                _temp.GSTDateLastStatus = (_temp.GSTDateLastStatus) ? FromateDate_YY_MM_DD(_temp.GSTDateLastStatus):   "2019-04-27"
                _temp.strApp = strApp
                _temp.BCMStart = (_temp.BCMStart) ? FromateDate_YY_MM_DD(_temp.BCMStart):   null;
                _temp.BCMEnd = (_temp.BCMEnd) ? FromateDate_YY_MM_DD(_temp.BCMEnd):   null;

                if(this.state.coyLogoName)
                   _temp.CoyLogo = this.state.coyLogoName;
                if(this.state.Actual_TC_Name)
                  _temp.Actual_TC = this.state.Actual_TC_Name;
                if(this.state.TC_Name)
                  _temp.TC = this.state.TC_Name;

                if(strApp && strApp.length){
                    let _temp_details = {
                        modeType : type,
                        companyDetails : _temp
                    }
                    this.setState({loading:true})
                    let _status = await ApiExtract(SaveDetails, _temp_details);

                    console.log(_status);

                    if(_status){
                        this.setState({
                            loading:false,
                            show:true,
                            title : '',
                            file_upload: false,
                            status :_status.status,
                            message : (_status.message) ? _status.message :'Company Detail saved',
                        })
                    }
                    if(!_status.message)
                        await this.LoadDetails();
               }else{
                this.setState({
                    loading:false,
                    show: true,
                    title : '',
                    status : false,
                    message : "Choose Atleast One Application Package"
                })
            }
            }}
     }

     handleChangeCoyType = (e) => {
        this.setState({vendorType :  e.target.value});
     }



    DownloadDocuments  = (nternal_file) =>{
        this.props.GetDownloadFile(nternal_file)
    }

    stopBubble = (e) => {
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    }

    showPreviewModal=()=> {
        if(this.state.CoyLogo)
            this.setState({
                previewfile: window.URL.createObjectURL(this.state.CoyLogo)
            })
        this.setState({
            show_modal: true
        })
    }


    closePreviewModal = () => {
        this.setState({
            show_modal : false
        })
    }

    delete_file = (details) =>{

        let _user_details = UserDetails();

        details.CDA_ATTACH_FILENAME = details.strFile;

        details.CDA_ATTACH_INDEX = details.ID;

        details.CDA_DOC_NO =  (this.state.rfqNo) ? this.state.rfqNo : ""

        details.CDA_FILESIZE = details.Text

        details.CDA_HUB_FILENAME = details.strFile1

        details.CDA_COY_ID = _user_details.UM_COY_ID

        details.CDA_STATUS = '';

        this.setState({
            delete:true,
        })

        details.AttachType = '';

        details.modeType =  "New"

        this.props.GetDeleteFile(details)

    }



    render(){
        const { handleSubmit } = this.props
        let {country, pro_state, applicaton_package, currency, payment_method, payment_term} = this.props
        let imgPreview;
        if (this.state.previewfile) {
            imgPreview = <img src={this.state.previewfile} alt='' />;
        }

        let {coyLogoName} = this.state;

        return <Fragment>
              {(this.props.file_upload_ld) ? <Loader /> : '' }
             {(this.props.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
            <div className="show_list">
                <PageHeading heading="Company Details" subheading=""  />
                <TabHeading color={'bg-info text-white'}>{this.state.type =='new' ? "Add company" : "Modify company"}</TabHeading>
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row mt-2">
                        <div className='col-12 col-sm-6 col-md-10'>
                             <div className="row mt-2">
                                <Field type="text" name="CoyId" readonly={this.state.CoyId? true: false} component={FromInputsParallelForCompany} className="form-control" placeholder="Company ID" label="Company ID" value={this.state.CoyId} rem={true}/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="CoyName" component={FromInputsParallelForCompany} className="form-control" placeholder="Company Name" label="Company Name" rem={true}/>
                             </div>
                             <div className="row mt-3">
                                <div class="col-12 col-md-10">
                                    <div class="row">
                                        <div class="col-12 col-md-4"><label>Status :</label></div>
                                        <div class="col-12 col-md-8">
                                            <div className="status_checked">
                                                <Field
                                                    onClick={() => {this.setState((prevState) => { return {user_status: (prevState.user_status=='A') ? 'I' :'A'};});}}
                                                    name="Status"
                                                    component="input"
                                                    type="radio"
                                                    checked={(this.state.user_status=='A' ? true :false )}
                                                    value={'A'}
                                                /> Active
                                            </div>
                                            <div  className="status_checked">
                                            <Field
                                                    onClick={() => {this.setState((prevState) => {return {user_status: (prevState.user_status=='A') ? 'I' :'A'};});}}
                                                    name="Status"
                                                    component="input"
                                                    type="radio"
                                                    checked={(this.state.user_status=='I' ? true :false )}
                                                    value={'I'}
                                                /> Inactive
                                            </div>

                                        </div>
                                    </div>
                                </div>
                             </div>
                             <hr/>
                             <div className="row mt-2">
                                <Field name="CoyType" className="form-control mb-3" onChange={this.handleChangeCoyType} component={FromSelectParallelForCompany} label={"Company Type"} rem={true}>
                                    <option selected="selected" value="NONE">---Select---</option>
                                    <option value="BUYER">Buyer</option>
                                    <option value="VENDOR">Vendor</option>
                                </Field>
                             </div>
                             <div className="row mt-2">
                                <Field name="isResident" className="form-control mb-3" component={FromSelectParallelForCompany} label={"Resident Type"}>
                                    <option value="Y">Resident</option>
                                    <option value="N">Non-Resident</option>
                                </Field>
                             </div>
                             <div className="row mt-2">
                                <Field name="Package" className="form-control mb-3" component={FromSelectParallelForCompany} label={"Package"}>
                                    <option selected="selected" value="">---Select---</option>
                                </Field>
                             </div>
                             <div className="row mt-3">
                                <div class="col-12 col-md-10">
                                    <div class="row">
                                        <div class="col-12 col-md-4"><label> Application Package <span className="text-danger">*</span></label></div>
                                        <div class="col-12 col-md-8">
                                            {applicaton_package.map((list_details)=>{
                                               return <div className="status_checked_checkbox">
                                                    <input type="checkbox" className="" name="strApp[]" value={list_details.AP_APP_ID} onClick={(e)=>this.handleCheckbox(e.target, list_details)} checked={this.state.strApp.includes(list_details.AP_APP_ID)}/>  {list_details.AP_APP_NAME}
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="LicenseUsers" component={FromInputsParallelForCompany} className="form-control" placeholder="User License" label="User License" rem={true}/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="ReportUsers" component={FromInputsParallelForCompany} className="form-control" placeholder="Report User" label="Report User"/>
                             </div>
                             <div className="row mt-2">
                                        <Field type="text" name="BCMStart" selected={this.state.start_data}  component={FormDatePickerParallelForCompany} className="form-control" placeholder="Subscription Start Date " label="Subscription Start Date " dateFormat="dd/mm/yyyy" onChange={this.handleDate.bind(this, 'start_date')} />
                             </div>
                            <div className="row mt-2">
                                <Field type="text" name="BCMEnd" selected={this.state.end_data} component={FormDatePickerParallelForCompany} className="form-control" placeholder="Subscription End Date " label="Subscription End Date " onChange={this.handleDate.bind(this, 'end_date')} />
                             </div>
                             <hr/>
                             <div className="row mt-2">
                                <div class="col-12 col-md-10">
                                    <div class="row">
                                        <div class="col-md-4"><label>Address :<span className="text-danger">*</span></label></div>
                                        <div class="col-md-8 text_details_address">
                                            <Field type="text" name="Address1" component={TablePlainInput} className="form-control" placeholder="Address 1" label="Address 1" />
                                            <Field type="text" name="Address2" component={TablePlainInput} className="form-control" placeholder="Address 2" label="Address 2" />
                                            <Field type="text" name="Address3" component={TablePlainInput} className="form-control" placeholder="Address 3" label="Address 2" />
                                        </div>
                                    </div>
                                </div>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="City" component={FromInputsParallelForCompany} className="form-control" placeholder="City" label="City" rem={true}/>
                             </div>
                             <div className="row mt-2">
                                <Field name="State" className="form-control mb-3" component={FromSelectParallelForCompany} label={"State"} rem={true}>
                                    <option selected="selected" value="">---Select---</option>
                                    {pro_state.map((list)=>{
                                           return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                                    })}
                                </Field>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="PostCode" component={FromInputsParallelForCompany} className="form-control" placeholder="Post Code" label="Post Code" rem={true}/>
                             </div>
                             <div className="row mt-2">
                                <Field name="Country"  onChange={(e)=>this.handleChange(e.target.value)} className="form-control mb-3" component={FromSelectParallelForCompany} label={"Country"} rem={true}>
                                    <option selected="selected" value="">---Select---</option>
                                    {country.map((list)=>{
                                           return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                                    })}
                                </Field>
                             </div>

                             <div className="row mt-2">
                                <Field type="text" name="Phone" component={FromInputsParallelForCompany} className="form-control" placeholder="Phone" label="Phone" rem={true}/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="Fax" component={FromInputsParallelForCompany} className="form-control" placeholder="Fax" label="Fax" rem={true}/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="Email" component={FromInputsParallelForCompany} className="form-control" placeholder="Email" label="Email" rem={true}/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="BusinessRegNo" component={FromInputsParallelForCompany} className="form-control" placeholder="Business Registration No." label="Business Registration No." rem={true}/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="ContactPerson" component={FromInputsParallelForCompany} className="form-control" placeholder="Contact Person" label="Contact Person" rem={false}/>
                             </div>
                             <hr/>
                             <div className="row mt-2">
                                <Field type="text" name="BankName" component={FromInputsParallelForCompany} className="form-control" placeholder="Bank Name" label="Bank Name"/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="AccountNo" component={FromInputsParallelForCompany} className="form-control" placeholder="Bank Account No." label="Bank Account No."/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="BankCode" component={FromInputsParallelForCompany} className="form-control" placeholder="Bank Code" label="Bank Code" rem={false}/>
                             </div>
                             <div className="row mt-2">
                                <Field type="text" name="BranchCode" component={FromInputsParallelForCompany} className="form-control" placeholder="Bank Branch Code" label="Bank Branch Code"/>
                             </div>
                             <div className="row mt-2">
                                <Field name="Currency" className="form-control mb-3" component={FromSelectParallelForCompany} label={"Currency"} rem={true}>
                                    <option selected="selected" value="">---Select---</option>
                                    {currency.map((list)=>{
                                           return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                                    })}
                                </Field>
                             </div>
                             <div className="row mt-3">
                                <div className="col-12 col-md-4"><label> Current Company Logo :</label></div>
                                <div className="col-12 col-md-6 logo">
                                 <div> {this.state.coyLogoURL ? <img src={ this.state.coyLogoURL  } alt="logo"/>:'No Logo'}  </div>
                                </div>
                             </div>
                             <div className="row mt-2">

                                <div className="col-12 col-md-10">
                                  <div className="form-group">
                                    <div className="row">
                                      <div className="col-12 col-md-4"><label for="pwd"> Company Logo:</label></div>
                                        <div className="col-md-4"><input type="file" className="custom-file-input " id='CoyLogo' ref={ref=> this.coyLogo = ref} onChange={this.SendUpload} name="coyLogo" aria-describedby="inputGroupFileAddon01" />
                                          Recommended dimension is 130(W) x 70(H) pixels
                                        </div>
                                        <div className="col-md-4">
                                          <button type="button" type="button" className="btn btn-outline-primary btn-sm mr-2" value="Upload" data-name={this.state.CoyLogo} onClick={() => this.FileUpload('coyLogo')} id="">Upload</button>
                                          <button type="button" type="button" className="btn btn-outline-primary btn-sm " onClick={this.showPreviewModal} id="">Preview Image</button></div>
                                        </div>
                                      </div>
                                    </div>
                               {/* <FromUplods name="CoyLogo" id ="CoyLogo" decs=" Recommended dimension is 130(W) x 70(H) pixels" label="Company Logo" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.CoyLogo}/>  */}
                              </div>

                              <div className="row mt-3">
                               <div className="col-12 col-sm-12 col-md-8">
                                 <div className="row">
                                   <label className="col-12 col-sm-6 col-md-5">External File Attached : </label>
                                   <div className="col-12 col-sm-6 col-md-6">
                                       {
                                         (coyLogoName && coyLogoName.length) ? coyLogoName.map((list)=>{
                                           if(list.Text!=='No Files Attached' && list.CDA_DOC_TYPE == "CoyLogo"){
                                             return <p className="download-files"><u><span onClick={() => this.DownloadDocuments(list)}>{list.strFile} ({list.Text} KB) &nbsp;&nbsp;</span></u> <span ><i onClick={(e)=>this.delete_file(list)} className="fa fa-trash" aria-hidden="true"></i></span></p>
                                           }
                                         }):''
                                       }
                                   </div>
                                 </div>
                               </div>
                              </div>
                             <div className="row mt-3">
                                <div className="col-12 col-md-10">
                                    <div className="form-group">
                                        <div className="row">
                                        <div className="col-12 col-md-4"><label for="pwd"> T&C Document Upload:</label></div>
                                            <div className="col-md-4"><input type="file" className="custom-file-input " id='TC' ref={ref=> this.tc = ref} onChange={this.SendUpload} name="TC" aria-describedby="inputGroupFileAddon01" />
                                               Recommended file size is 10240 KB
                                            </div>
                                            <div className="col-md-2"><button type="button" type="button" className="btn btn-outline-primary btn-sm " value="Upload" data-name={this.state.TC} onClick={() => this.FileUpload('TC')} id="">Upload</button></div>
                                            <p className="col-md-2"><span onClick={() => this.DownloadDocuments({strFile: this.state.companyDetails ? this.state.companyDetails.Actual_TC :'',strFile1:this.state.companyDetails ? this.state.companyDetails.TC :'',CDA_DOC_TYPE:'TermAndCond'})}><Link>{this.state.companyDetails ? this.state.companyDetails.Actual_TC:''}</Link></span></p>
                                        </div>
                                        </div>
                                    </div>
                             </div>
                             <div className="row mt-3">
                                <Field type="text" name="TaxRegNo" component={FromInputsParallelForCompany} className="form-control" placeholder="SST Registration No" label="SST Registration No" />
                             </div>
                             { this.state.vendorType  &&  this.state.vendorType =="BUYER" ? <>
                             <div className="row mt-3">
                                <div class="col-12 col-md-10">
                                    <div class="row">
                                        <div class="col-12 col-md-4"><label> BCM Setting <span className="text-danger">*</span> :</label></div>
                                        <div class="col-12 col-md-8">
                                            <div className="status_checked">
                                                <Field
                                                    onClick={() => {this.setState((prevState) => { return {BCMSetting: (prevState.BCMSetting=='0') ? '1' :'0'};});}}
                                                    name="BCMSetting"
                                                    component="input"
                                                    type="radio"
                                                    checked={(this.state.BCMSetting=='1' ? true :false )}
                                                    value={'Y'}
                                                /> On
                                            </div>
                                            <div  className="status_checked">
                                                <Field
                                                    onClick={() => {this.setState((prevState) => { return {BCMSetting: (prevState.BCMSetting=='0') ? '1' :'0'};});}}
                                                    name="BCMSetting"
                                                    component="input"
                                                    type="radio"
                                                    checked={(this.state.BCMSetting=='0' ? true :false )}
                                                    value={'N'}
                                                /> Off
                                            </div>

                                        </div>
                                    </div>
                                </div>
                             </div>
                             <div className="row mt-3">
                                <div class="col-12 col-md-10">
                                    <div class="row">
                                        <div class="col-12 col-md-4"><label> Finance Dept. Mode  {this.state.fin_dep_mode}  <span className="text-danger">*</span> :</label></div>
                                        <div class="col-12 col-md-8">

                                            <div className="status_checked">
                                                <Field
                                                    onClick={() => {this.setState((prevState) => { return {fin_dep_mode: (prevState.fin_dep_mode=='N') ? 'Y' :'N'};});}}
                                                    name="FinDeptMode"
                                                    component="input"
                                                    type="radio"
                                                    checked={(this.state.fin_dep_mode=='Y' ? true :false )}
                                                    value={'Y'}
                                                /> On
                                            </div>
                                            <div  className="status_checked">
                                                <Field
                                                    onClick={() => {this.setState((prevState) => { return {fin_dep_mode: (prevState.fin_dep_mode=='N') ? 'Y' :'N'};});}}
                                                    name="FinDeptMode
                                                    "
                                                    component="input"
                                                    type="radio"
                                                    checked={(this.state.fin_dep_mode=='N' ? true :false )}
                                                    value={'N'}
                                                /> Off
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                             <div className="row mt-3">
                                <div class="col-12 col-md-10">
                                    <div class="row">
                                        <div class="col-12 col-md-4"><label>  Invoice & Payment Approval  <span className="text-danger">*</span> :</label></div>
                                        <div class="col-12 col-md-8">
                                        <div className="status_checked">
                                                <Field
                                                    onClick={() => {this.setState((prevState) => { return {inv_payment_approval: (prevState.inv_payment_approval=='N') ? 'Y' :'N'};});}}
                                                    name="InvAppr"
                                                    component="input"
                                                    type="radio"
                                                    checked={(this.state.inv_payment_approval=='Y' ? true :false )}
                                                    value={'Y'}
                                                /> On
                                            </div>
                                            <div  className="status_checked">
                                                <Field
                                                    onClick={() => {this.setState((prevState) => { return {inv_payment_approval: (prevState.inv_payment_approval=='N') ? 'Y' :'N'};});}}
                                                    name="InvAppr"
                                                    component="input"
                                                    type="radio"
                                                    checked={(this.state.inv_payment_approval=='N' ? true :false )}

                                                    value={'N'}
                                                /> Off
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                             <div className="row mt-3">
                                <div class="col-12 col-md-10">
                                    <div class="row">
                                        <div class="col-12 col-md-4"><label> PR To Multiple POs <span className="text-danger">*</span> :</label></div>
                                        <div class="col-12 col-md-8">
                                            <div className="status_checked">
                                                    <Field
                                                        onClick={() => {this.setState((prevState) => { return {MultiInvAppr: (prevState.MultiInvAppr=='N') ? 'Y' :'N'};});}}
                                                        name="MultiInvAppr"
                                                        component="input"
                                                        type="radio"
                                                        checked={(this.state.MultiInvAppr=='Y' ? true :false )}
                                                        value={'Y'}
                                                    /> On
                                                </div>
                                                <div  className="status_checked">
                                                    <Field
                                                        onClick={() => {this.setState((prevState) => { return {MultiInvAppr: (prevState.MultiInvAppr=='N') ? 'Y' :'N'};});}}
                                                        name="MultiInvAppr"
                                                        component="input"
                                                        type="radio"
                                                        checked={(this.state.MultiInvAppr=='N' ? true :false )}
                                                        value={'N'}
                                                    /> Off
                                                </div>

                                        </div>
                                    </div>
                                </div>
                             </div>
                             <div className="row mt-3">
                                <div class="col-12 col-md-10">
                                    <div class="row">
                                        <div class="col-12 col-md-4"><label> Buyer Admin Cancel POs  <span className="text-danger">*</span> :</label></div>
                                        <div class="col-12 col-md-8">
                                             <div className="status_checked">
                                                    <Field
                                                        onClick={() => {this.setState((prevState) => { return {BACanPO: (prevState.BACanPO=='N') ? 'Y' :'N'};});}}
                                                        name="BACanPO"
                                                        component="input"
                                                        type="radio"
                                                        checked={(this.state.BACanPO=='Y' ? true :false )}
                                                        value={'Y'}
                                                    /> On
                                                </div>
                                                <div  className="status_checked">
                                                    <Field
                                                        onClick={() => {this.setState((prevState) => { return {BACanPO: (prevState.BACanPO=='N') ? 'Y' :'N'};});}}
                                                        name="BACanPO"
                                                        component="input"
                                                        type="radio"
                                                        checked={(this.state.BACanPO=='N' ? true :false )}
                                                        value={'N'}
                                                    /> Off
                                                </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                             </> : null}
                            { this.state.vendorType  &&  this.state.vendorType =="VENDOR"?  <div className="row mt-2">
                                <Field type="text" name="TransNo" component={FromInputsParallelForCompany}  className="form-control" placeholder="No Of Transaction" label="No Of Transaction" rem={true}/>
                             </div>  : null }
                             { this.state.vendorType  &&  this.state.vendorType =="BUYER"? <div>
                             <div className="row mt-2">
                                <Field name="PaymentTerm" className="form-control mb-3" component={FromSelectParallelForCompany} label={"Payment Terms"} rem={true}>
                                    <option  value="">---Select---</option>
                                    {payment_term.map((list)=>{
                                           return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                                    })}
                                </Field>
                             </div>
                             <div className="row mt-2">
                                <Field name="PaymentMethod" className="form-control mb-3" component={FromSelectParallelForCompany} label={"Payment Method"} rem={true}>
                                    <option value="">---Select---</option>
                                    {payment_method.map((list)=>{
                                           return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                                    })}
                                </Field>
                             </div></div>:null}
                             <div className="row mt-2">
                                <Field type="text" name="PwdDuration" component={FromInputsParallelForCompany} className="form-control" placeholder="Password Duration(Days)" label="Password Duration(Days)" rem={true}/>
                            </div>
                             <div className="row mt-2">
                                <Alert
                                    message={this.state.message}
                                    status={this.state.status}
                                    show={this.state.show}
                                    confirm={this.closeModel}
                                />

                   <Modal show={this.state.show_modal}  >
                        <Modal.Header >
                          <Modal.Title> </Modal.Title>
                        <button type="button" className="close ml-2 mb-1" onClick={this.closePreviewModal}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
                        </Modal.Header>
                        <Fragment>

                          <div className="col-12 col-md-12 modelLogo">
                                 <div>{imgPreview }</div>
                                </div>
                        </Fragment>
                        <Modal.Footer><button type="button" className="close ml-2 mb-1 btn btn-sm cstm_close" onClick={this.closePreviewModal}>Close</button></Modal.Footer>
                   </Modal>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-lg-auto col-md"><button type="submit" className="btn btn-outline-success btn-sm">Save</button><button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={()=>this.Reset()}>Reset</button> </div>
                    </div>
                </form>
            </div>
     </Fragment>
    }
}


const mapStateToProps = state => ({

    applicaton_package : state.applicaton_package.responseList,
    loading : state.applicaton_package.loading,

    currency : state.currency.responseList,
    cr_loading : state.currency.loading,

    pro_state : state.ed_state.responseList,
    st_loading : state.ed_state.loading,

    payment_term : state.payment_term.responseList,
    pt_loading : state.payment_term.loading,

    payment_method : state.payment_method.responseList,
    pm_loading : state.payment_method.loading,

    vendor_map_list : state.vendor_map_list.responseList,
    loading : state.vendor_map_list.loading,
    country : state.ed_country.responseList,

    upload_document : state.file_upload_external.responseList,
    file_upload_ld : state.file_upload_external.loading
})

const mapDispatchToProps = dispatch => ({
    GetVendorMapList  : (values) => dispatch(GetVendorMapList(values)),
    GetCountry : () => dispatch(GetCountry()),
    GetState : (values) => dispatch(GetState(values)),
    UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    GetApplicationPackage : () => dispatch(GetApplicationPackage()),
    GetCurrency : () => dispatch(GetCurrency()),
    GetPaymentTerm : () => dispatch(GetPaymentTerm()),
    GetPaymentMethod : () => dispatch(GetPaymentMethod()),
    GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
})


const CompanyDetailsHolder = connect(mapStateToProps, mapDispatchToProps)(CompanyDetails);
export default reduxForm({
    form:'CompanyDetailsHolder',

    validate : ValidateCompanyDetails,

})(CompanyDetailsHolder);
