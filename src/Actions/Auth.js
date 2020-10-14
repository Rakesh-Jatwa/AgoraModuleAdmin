import * as Actions from './Actions';
import Apis from '../Apis';
import {UserDetails,UserDetailsMain, PutLocalstorage} from '../Common/LocalStorage';

const UserLogin = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.AUTH_START,  payload:{ loading:true}});
        Apis.UserLogin(values).then(
            (async (userdata)=>{
                let {responseList} = userdata;
                if(responseList.isPasswordExpired || responseList.isFirstTimeLogin){
                    localStorage.setItem('list_details',JSON.stringify({
                        "modes":"F",
                        "status":(responseList.isPasswordExpired) ? 'E' : (responseList.isFirstTimeLogin) ? 'F' : '',
                        "userId":values.userid,
                        "companyId":values.companyid
                    }))
                    window.location="/#/password_expired"
                }
                else{
                    if(userdata.status==="SUCCESS"){
                        
                        if(responseList.auth){
                            window.location="/#/dashboard" 
                            localStorage.setItem('token', responseList.accessToken)

                            let _details = await UserDetailsMain();
                            console.log("profile_data11",responseList)
                                
                            if(_details){

                                PutLocalstorage('profile', JSON.stringify(_details)) 
                                // window.location.reload();
                                console.log("profile_data",_details)
                                dispatch({type:Actions.STORE_USER_DETAIL, payload:_details});


                            }
                            dispatch({ type:Actions.AUTH_SUCCESS,  payload:{ authstatus:true, authmessage:'User Logged In', token:responseList.accessToken, loading:false}});
                        
                        }
                        else{
                            localStorage.removeItem('token');
                            dispatch({type:Actions.AUTH_FAILURE, payload:{ authstatus:false, authmessage:responseList.reason, token:responseList.accessToken, loading:false}})
                        }
                    }
                    else{
                        localStorage.removeItem('token');
                        dispatch({type:Actions.AUTH_ERROR, payload:responseList.reason})
                    }
                }
            }),
            ((failuer)=>{
                dispatch({type:Actions.AUTH_ERROR, payload:failuer.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.AUTH_ERROR, payload:error.message})
        })
    }
}

const Logout = (values) => {
    return (dispatch) => {
        window.location = "/#/login"
        dispatch({ type:Actions.AUTH_START,  payload:{ loading:true}})
        localStorage.removeItem('token')
        localStorage.removeItem('profile')
        localStorage.removeItem('contract')
        localStorage.clear();
        window.location.reload();
        dispatch({ type:Actions.AUTH_SUCCESS,  payload:{ authstatus:false, authmessage:'', token:'', loading:false}});
       
    }
}


const LogoutFront = (values) => {
        window.location = "/#/login"
        localStorage.removeItem('token')
        localStorage.removeItem('profile')
        localStorage.removeItem('contract')
        localStorage.clear();
        window.location.reload();
   
}

const UserLoading = () => {
    return (dispatch) => {
        dispatch({ type:Actions.AUTH_START,  payload:{ loading:false}});
    }
}

export { UserLogin, Logout, LogoutFront, UserLoading };