import {GSAP_SUCCESS,GSAP_FAILURE,GSAP_ERROR, GSAP_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let GetSaveApprovePerson = (state = initialstate, action) => {
    switch(action.type){

        case GSAP_ACCESS:
        return Object.assign({}, state, action.payload)

        case GSAP_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GSAP_FAILURE:
        return {...state, errMessage:action.payload}

        case GSAP_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default GetSaveApprovePerson;