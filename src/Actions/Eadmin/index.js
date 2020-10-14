import * as Actions from '../Actions';
import {PolicyList, UserGroupList, ApplicationPackage, FixedRoles, UserGroupDetails, 
    DashboardList, Country, State, HolidayList, TaxCodeList, TaxCodeRate, CompanyList, 
    VendorMapList, UserAccountList, UserValidateAdminLimit, MatrixList, Currency, 
    ReportList, PaymentTerm, PaymentMethod,VendorDetailsList} from '../../Apis/Eadmin';
const GetPolicyList = () => {
    return (dispatch) => {
        dispatch({ type:Actions.ED_POLICY_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PolicyList().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.ED_POLICY_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.ED_POLICY_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.ED_POLICY_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.ED_POLICY_FAILURE, payload:error.message})
        })
    }
}


const GetUserGroupList = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.UG_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        UserGroupList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.UG_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.UG_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.UG_LIST_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.UG_LIST_FAILURE, payload:error.message})
        })
    }
}


const GetApplicationPackage = () => {
    return (dispatch) => {
        dispatch({ type:Actions.APP_PACK_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ApplicationPackage().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.APP_PACK_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.APP_PACK_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.APP_PACK_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.APP_PACK_FAILURE, payload:error.message})
        })
    }
}


const GetFixedRoles = () => {
    return (dispatch) => {
        dispatch({ type:Actions.FR_ACCESS, payload:{loading:true, errMessage:'loading'}});
        FixedRoles().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.FR_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.FR_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.FR_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.FR_FAILURE, payload:error.message})
        })
    }
}


const GetUserGroupDetails = (values) => {
  
    return (dispatch) => {
        dispatch({ type:Actions.UGD_ACCESS, payload:{loading:true, errMessage:'loading'}});
        UserGroupDetails(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.UGD_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.UGD_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.UGD_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.UGD_FAILURE, payload:error.message})
        })
    }
}


const GetDashboardList = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.DL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        DashboardList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    if(values.frm=="master"){
                        dispatch({ type:Actions.DL_SUCCESS,  payload:receiveddata});
                    }
                    else if(values.frm=="matrix"){
                        dispatch({ type:Actions.DL_MX_SUCCESS,  payload:receiveddata});
                    }
                    else{
                        dispatch({ type:Actions.DL_LST_SUCCESS,  payload:receiveddata});
                    }
                }
                else{
                    dispatch({type:Actions.DL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DL_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DL_FAILURE, payload:error.message})
        })
    }
}






const GetCountry = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.COUNTRY_ACCESS, payload:{loading:true, errMessage:'loading'}});
        Country(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.COUNTRY_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.COUNTRY_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.COUNTRY_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.COUNTRY_FAILURE, payload:error.message})
        })
    }
}


const GetState = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.STATE_ACCESS, payload:{loading:true, errMessage:'loading'}});
        State(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.STATE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.STATE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.STATE_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.STATE_FAILURE, payload:error.message})
        })
    }
}

const GetHolidayList = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.HOLIDAY_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        HolidayList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.HOLIDAY_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.HOLIDAY_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.HOLIDAY_LIST_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.HOLIDAY_LIST_FAILURE, payload:error.message})
        })
    }
}

const GetTaxCodeList = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.TAXCODE_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        TaxCodeList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.TAXCODE_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.TAXCODE_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.TAXCODE_LIST_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.TAXCODE_LIST_FAILURE, payload:error.message})
        })
    }
}

const GetTaxCodeRate = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.TAXCODE_RATE_ACCESS, payload:{loading:true, errMessage:'loading'}});
        TaxCodeRate(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.TAXCODE_RATE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.TAXCODE_RATE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.TAXCODE_RATE_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.TAXCODE_RATE_FAILURE, payload:error.message})
        })
    }
}

const GetCompanyList  = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.COMPANY_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        CompanyList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.COMPANY_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.COMPANY_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.COMPANY_LIST_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.COMPANY_LIST_FAILURE, payload:error.message})
        })
    }
}

const GetVendorMapList  = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VENDOR_MAP_ACCESS, payload:{loading:true, errMessage:'loading'}});
        VendorMapList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VENDOR_MAP_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VENDOR_MAP_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VENDOR_MAP_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VENDOR_MAP_FAILURE, payload:error.message})
        })
    }
}



const GetUserAccountList  = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.USER_ACCOUNT_ACCESS, payload:{loading:true, errMessage:'loading'}});
        UserAccountList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.USER_ACCOUNT_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.USER_ACCOUNT_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.USER_ACCOUNT_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.USER_ACCOUNT_FAILURE, payload:error.message})
        })
    }
}


const GetUserValidateAdminLimit  = () => {
    return (dispatch) => {
        dispatch({ type:Actions.USER_VALIDATE_ACCESS, payload:{loading:true, errMessage:'loading'}});
        UserValidateAdminLimit().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.USER_VALIDATE_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.USER_VALIDATE_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.USER_VALIDATE_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.USER_VALIDATE_FAILURE, payload:error.message})
        })
    }
}

const GetMatrixList  = () => {
    return (dispatch) => {
        dispatch({ type:Actions.MATRIX_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        MatrixList().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.MATRIX_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.MATRIX_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.MATRIX_LIST_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.MATRIX_LIST_FAILURE, payload:error.message})
        })
    }
}



const GetCurrency  = () => {
    return (dispatch) => {
        dispatch({ type:Actions.CURRENCY_ACCESS, payload:{loading:true, errMessage:'loading'}});
        Currency().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.CURRENCY_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.CURRENCY_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.CURRENCY_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.CURRENCY_FAILURE, payload:error.message})
        })
    }
}

const GetReportList  = () => {
    return (dispatch) => {
        dispatch({ type:Actions.REPORT_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
        ReportList().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.REPORT_LIST_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.REPORT_LIST_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.REPORT_LIST_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.REPORT_LIST_FAILURE, payload:error.message})
        })
    }
}

const GetPaymentTerm  = () => {
    return (dispatch) => {
        dispatch({ type:Actions.PAYMENT_TERM_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PaymentTerm().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PAYMENT_TERM_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PAYMENT_TERM_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PAYMENT_TERM_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PAYMENT_TERM_FAILURE, payload:error.message})
        })
    }
}

const GetPaymentMethod  = () => {
    return (dispatch) => {
        dispatch({ type:Actions.PAYMENT_METHOD_ACCESS, payload:{loading:true, errMessage:'loading'}});
        PaymentMethod().then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.PAYMENT_METHOD_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.PAYMENT_METHOD_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.PAYMENT_METHOD_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.PAYMENT_METHOD_FAILURE, payload:error.message})
        })
    }
}

const GetVendorDetail  = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.VENDOR_DETAIL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        VendorDetailsList(values).then(
            ((receiveddata)=>{
                if(receiveddata.status==="SUCCESS"){
                    dispatch({ type:Actions.VENDOR_DETAIL_SUCCESS,  payload:receiveddata});
                }
                else{
                    dispatch({type:Actions.VENDOR_DETAIL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.VENDOR_DETAIL_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.VENDOR_DETAIL_ERROR, payload:error.message})
        })
    }
}



export { 
    GetPolicyList,
    GetUserGroupList,
    GetApplicationPackage,
    GetFixedRoles,
    GetUserGroupDetails,
    GetDashboardList,
    GetState,
    GetCountry,
    GetHolidayList,
    GetTaxCodeList,
    GetTaxCodeRate,
    GetCompanyList,
    GetVendorMapList,
    GetUserAccountList,
    GetUserValidateAdminLimit,
    GetMatrixList,
    GetCurrency,
    GetReportList,
    GetPaymentTerm,
    GetPaymentMethod,
    GetVendorDetail
};