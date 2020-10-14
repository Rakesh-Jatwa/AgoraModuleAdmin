import {COUNTRY_ACCESS,COUNTRY_SUCCESS,COUNTRY_FAILURE,COUNTRY_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let Country = (state = initialstate, action) => {
    switch(action.type){

        case COUNTRY_ACCESS:
        return Object.assign({}, state, action.payload)

        case COUNTRY_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case COUNTRY_FAILURE:
        return {...state, errMessage:action.payload}

        case COUNTRY_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default Country;