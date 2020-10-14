import {STORE_USER_DETAIL, DELETE_USER_DETAIL} from '../Actions/Actions';
const initialstate = {
    authstatus:false,
    authmessage:'',
    token:'',
    loading:false,
}

let ProfileReducer = (state = initialstate, action) => {
    switch(action.type){

        case STORE_USER_DETAIL:
        console.log("profile_data1",action.payload)
        return Object.assign({},action.payload)

        case DELETE_USER_DETAIL:
        return Object.assign({}, state, {})

        default :
        return {...state};

    }
}
export default ProfileReducer;