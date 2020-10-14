import {HOLIDAY_LIST_ACCESS,HOLIDAY_LIST_SUCCESS,HOLIDAY_LIST_FAILURE,HOLIDAY_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let HolidayList = (state = initialstate, action) => {
    switch(action.type){

        case HOLIDAY_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case HOLIDAY_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case HOLIDAY_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case HOLIDAY_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default HolidayList;