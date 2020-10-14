import {
    COMMODITY_ACCESS,
    COMMODITY_SUCCESS,
    COMMODITY_FAILURE,
    COMMODITY_ERROR,
  } from '../../Actions/Actions';
  const initialstate = {
    status: 'FAILURE',
    errMessage: '',
    responseList: [],
    loading: false,
  };
  
  let GetAddItemCommodity = (state = initialstate, action) => {
    switch (action.type) {
      case COMMODITY_ACCESS:
        return Object.assign({}, state, action.payload);
  
      case COMMODITY_SUCCESS:
        debugger;
        return Object.assign({}, state, action.payload, { loading: false });
  
      case COMMODITY_FAILURE:
        return { ...state, errMessage: action.payload };
  
      case COMMODITY_ERROR:
        return { ...state, errMessage: action.payload };
  
      default:
        return { ...state };
    }
  };
  export default GetAddItemCommodity;
  