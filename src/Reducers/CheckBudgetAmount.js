import {BUDGET_AMOUNT_ACCESS,BUDGET_AMOUNT_SUCCESS,BUDGET_AMOUNT_FAILURE, BUDGET_AMOUNT_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:0,
}

let CheckBudgetAmount = (state = initialstate, action) => {
    switch(action.type){

        case BUDGET_AMOUNT_ACCESS:
        return Object.assign({}, state, action.payload)

        case BUDGET_AMOUNT_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case BUDGET_AMOUNT_FAILURE:
        return {...state, errMessage:action.payload}

        case BUDGET_AMOUNT_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default CheckBudgetAmount;