import {MENU_ACCESS,MENU_SUCCESS,MENU_FAILURE, MENU_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let UserMenu = (state = initialstate, action) => {
    switch(action.type){

        case MENU_ACCESS:
        return Object.assign({}, state, action.payload)

        case MENU_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case MENU_FAILURE:
        return {...state, errMessage:action.payload}

        case MENU_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default UserMenu;