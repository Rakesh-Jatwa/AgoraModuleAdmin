import * as Actions from './Actions';
import Apis from '../Apis';
let ActionCreators = {
    UserLogin(values){
        return (dispatch) => {
            Apis.UserLogin(values).then(
             
                ((userdata)=>{
                    if(userdata.status==="SUCCESS"){
                     
                        ActionCreators.StoreLogin(userdata.token);
                        dispatch(ActionCreators.authSuccess(userdata.token));
                    }
                    else{
                        ActionCreators.RemoveLogin();
                        ActionCreators.UserLogout();
                        dispatch({type:Actions.TOKEN_EXPIRED, payload:userdata.statusText})
                    }
                }),
                ((failuer)=>{
                    dispatch({type:Actions.AUTH_FAILURE, payload:failuer.message})
                }),
            )
            .catch((error)=>{
                dispatch({type:Actions.AUTH_FAILURE, payload:error.message})
            })
        }
    },

    UserRegister(values){
        return (dispatch) => {
            Apis.UserRegister(values).then(
                ((userdetails)=>{
                    if(userdetails.status===200){
                        const expirationDate = new Date(new Date().getTime() + 600 * 1000);
                        ActionCreators.StoreLogin(userdetails.token);
                        dispatch(ActionCreators.authSuccess(userdetails.token));
                        dispatch(ActionCreators.checkAuthTimeout(600));
                    }
                    else{
                        dispatch({type:Actions.AUTH_FAILURE, payload:userdetails.statusText})
                    }
                }),
                ((failure)=>{
                    dispatch({type:Actions.AUTH_FAILURE, payload:failure.message})
                }),
            )
            .catch((error)=>{
                dispatch({type:Actions.AUTH_FAILURE, payload:error.message})
            })
        }
    },

    StoreLogin(userdata){
        localStorage.setItem('token', userdata)
    },

    RemoveLogin(){
        localStorage.removeItem('token')
    },

    authSuccess(token){
        return {
                type:Actions.AUTH_SUCCESS, 
                payload:{
                    authstatus:true,
                    authmessage:'User Logged In',
                    token:token,
                }
                
            }
    },

    UserLogout(){
        localStorage.clear();
        localStorage.removeItem('token');
        return {
            type:Actions.AUTH_LOGOUT
        }
    },

    checkAuthTimeout(expirationTime){
        return dispatch => {
            setTimeout(() => {
                dispatch(ActionCreators.UserLogout());
            }, expirationTime * 1000);
        };
    },

    UserAutoLogin(){
        let _token = localStorage.getItem('token');  
        return (dispatch) => {
            if(_token){
                ActionCreators.StoreLogin(_token);
                dispatch(ActionCreators.authSuccess(_token));
            }
           
        }
    },

    UserList(token){
        return (dispatch) => {
            Apis.UserList(token).then(
                ((user_list) => {
                
                    if(user_list.status===200){

                        dispatch({type:Actions.USER_LIST_FULL, payload:{userlist:user_list.datas,statusText:user_list.statusText}})
                    }
                    else{
                        dispatch({type:Actions.USER_LIST_EMPTY, payload:{userlist:[],statusText:user_list.statusText}})
                    }

                }),
                ((failure)=>{
                    dispatch({type:Actions.USER_LIST_ERROR, payload:failure.message})
                })
            )
            .catch((error)=>{
                dispatch({type:Actions.USER_LIST_ERROR, payload:error.message})
            })
        }
    },

    UserRemove(token,email){
        return (dispatch) => {
            Apis.RemoveUser(token,email).then(
                ((success)=>{
                    if(success.status===200){
                        dispatch(ActionCreators.UserList(token));
                        dispatch({type:Actions.USER_REMOVE_SUCCESS, payload:success.statusText})
                    }
                    else{
                        dispatch({type:Actions.USER_REMOVE_SUCCESS,payload:success.statusText})
                    }
                }),
                ((failure)=>{
                    dispatch({type:Actions.USER_REMOVE_ERROR, payload:failure.message})
                })
            )
            .catch((error)=>{
                    dispatch({type:Actions.USER_REMOVE_ERROR, payload:error.message})
            })
        }
    },

    UploadImage(token,formdata){
        return (dispatch)=>{
            Apis.UploadFile(token,formdata).then(
                ((file_upload)=>{
                    if(file_upload.status===200){
                        dispatch({type:Actions.FILE_UPLOAD, payload:file_upload.statusText})
                    }
                    else{
                        dispatch({type:Actions.FILE_FILED,payload:file_upload.message})
                    }
                }),
                ((failure)=>{
                    dispatch({type:Actions.FILE_FILED, payload:failure.message})
                }),
            )
            .catch((error)=>{
                dispatch({type:Actions.FILE_FILED, payload:error.message})
            })
        }
    }

    
}
export default ActionCreators;