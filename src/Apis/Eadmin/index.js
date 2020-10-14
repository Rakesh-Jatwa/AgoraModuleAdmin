const base_url = process.env.REACT_APP_API_URL
const axios = require('axios');
const _token = localStorage.getItem('token')
const getToken = () =>{return localStorage.getItem('token')}
const PolicyList = () => {
    return axios.post(base_url+'eAdmin/policy/list',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
    
}
const PolicyListSave = (values) => {
    return axios.post(base_url+'eAdmin/policy/save',{
        method: 'POST',
        policyData: values,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
    
}
const UserGroupList = (values) => {
    return axios.post(base_url+'eAdmin/userGroup/list',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
    
}
const ApplicationPackage = (values) => {
    return axios.post(base_url+'eAdmin/applicationPackage',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
    
}

const FixedRoles = (values) => {
    return axios.post(base_url+'eAdmin/fixedRoles',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
    
}

const UserGroupSave = (values) => {
    return axios.post(base_url+'eAdmin/userGroup/save',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
     
}

const UserGroupDetails = (values) => {
    console.log('UserGroupDetails',values)
    return axios.post(base_url+'eAdmin/userGroup/getDetails',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
    
}

const SaveAccessRights = (values) => {
    return axios.post(base_url+'eAdmin/userGroup/saveAccessRights',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
    
}

const UserGroupDelete = (values) => {
    return axios.post(base_url+'eAdmin/userGroup/delete',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
    
}

const DashboardList = (values) => {
    return axios.post(base_url+'eAdmin/dashboard/list',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



const DashboardSave = (values) => {
    return axios.post(base_url+'eAdmin/dashboard/save',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const Country = (values) => {
    return axios.post(base_url+'eAdmin/getCountry',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const State = (values) => {
    return axios.post(base_url+'eAdmin/getState',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const HolidayList = (values) =>{
    return axios.post(base_url+'eAdmin/holiday/list',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const HolidaySave = (values) =>{
    return axios.post(base_url+'eAdmin/holiday/save',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const HolidayDelete = (values) =>{
    return axios.post(base_url+'eAdmin/holiday/delete',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const TaxCodeList = (values) =>{
    return axios.post(base_url+'eAdmin/taxCode/list',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const TaxCodeRate = (values) =>{
    return axios.post(base_url+'eAdmin/taxCode/rate',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const TaxCodeSave = (values) =>{
    return axios.post(base_url+'eAdmin/taxCode/save',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const TaxCodeDelete = (values) =>{
    return axios.post(base_url+'eAdmin/taxCode/delete',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const TaxCodeDetails = (values) =>{
    return axios.post(base_url+'eAdmin/taxCode/getDetails',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CompanyList = (values) =>{
    return axios.post(base_url+'eAdmin/company/list',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CompanyStatusAlter = (values) =>{
    return axios.post(base_url+'eAdmin/company/activeDeactive',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CompanyDelete = (values) =>{
    return axios.post(base_url+'eAdmin/company/delete',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const VendorMapList = (values) =>{
    return axios.post(base_url+'eAdmin/vendor/mappingList',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const VendorMapCode = (values) =>{
    return axios.post(base_url+'eAdmin/vendor/mapVendorCode',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const UserAccountList = (values) =>{
    return axios.post(base_url+'eAdmin/userAccount/list',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const UserAccountAlter = (values) =>{
    return axios.post(base_url+'eAdmin/userAccount/activeDeactive',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const UserAccountUnlock = (values) =>{
    return axios.post(base_url+'eAdmin/userAccount/unlock',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const UserAccountDelete = (values) =>{
    return axios.post(base_url+'eAdmin/userAccount/delete',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const UserAccountDetails= (values) =>{
    return axios.post(base_url+'eAdmin/userAccount/getDetails',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const UserAccountSave = (values) =>{
    return axios.post(base_url+'eAdmin/userAccount/save',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const UserValidateAdminLimit = (values) =>{
    return axios.post(base_url+'eAdmin/userAccount/validateAdminLimit',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GeneratePassword = (values) =>{
    return axios.post(base_url+'eAdmin/userAccount/generatePassword',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const MatrixList = (values) =>{
    return axios.post(base_url+'eAdmin/reports/matrixList',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const SaveMatrix = (values) =>{
    return axios.post(base_url+'eAdmin/reports/saveMatrix',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const SetGlobalCompany = (values) =>{
    console.log('SetGlobalCompany',values)
    return axios.post(base_url+'eAdmin/setGlobalCompany',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { console.log("setGlobalCompany",response); return response.data })
}

const CompanyDetailsList = (values) =>{
    return axios.post(base_url+'eAdmin/company/details',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const Currency = (values) =>{
    return axios.post(base_url+'eAdmin/getCurrency',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const ReportList = (values) =>{
    return axios.post(base_url+'eAdmin/reports/list',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const PaymentTerm = (values) =>{
    return axios.post(base_url+'eAdmin/getPaymentTerm',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const PaymentMethod = (values) =>{
    return axios.post(base_url+'eAdmin/getPaymentMethod',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const SaveDetails = (values) =>{
    return axios.post(base_url+'eAdmin/company/saveDetails',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const VendorDetailsList = (values) =>{
    return axios.post(base_url+'eAdmin/vendorItem/getDetails',values,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


export  {
    PolicyList, 
    PolicyListSave,
    UserGroupList,
    ApplicationPackage,
    FixedRoles,
    UserGroupSave,
    UserGroupDetails,
    SaveAccessRights,
    UserGroupDelete,
    DashboardList,
    DashboardSave,
    Country,
    State,
    HolidayList,
    HolidaySave,
    HolidayDelete,
    TaxCodeList,
    TaxCodeRate,
    TaxCodeSave,
    TaxCodeDelete,
    TaxCodeDetails,
    CompanyList,
    CompanyStatusAlter,
    CompanyDelete,
    VendorMapList,
    VendorMapCode,
    UserAccountList,
    UserAccountAlter,
    UserAccountUnlock,
    UserAccountDelete,
    UserAccountDetails,
    UserAccountSave,
    UserValidateAdminLimit,
    GeneratePassword,
    MatrixList,
    SaveMatrix,
    SetGlobalCompany,
    CompanyDetailsList,
    Currency,
    ReportList,
    PaymentTerm,
    PaymentMethod,
    SaveDetails,
    VendorDetailsList
};