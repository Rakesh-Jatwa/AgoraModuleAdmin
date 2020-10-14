import {
    PURCHASE_CAT_DATA_ACCESS,
    PURCHASE_CAT_DATA_SUCCESS,
    PURCHASE_CAT_DATA_FAILURE,
    PURCHASE_CAT_DATA_ERROR,
  } from '../../Actions/Actions';
  const initialstate = {
    status: 'FAILURE',
    errMessage: '',
    responseList: [],
    loading: false,
  };
  
  let GetPurchaseCatelogueData = (state = initialstate, action) => {
    switch (action.type) {
      case PURCHASE_CAT_DATA_ACCESS:
        return Object.assign({}, state, action.payload);
  
      case PURCHASE_CAT_DATA_SUCCESS:
        return Object.assign({}, state, action.payload, { loading: false });
  
      case PURCHASE_CAT_DATA_FAILURE:
        return { ...state, errMessage: action.payload };
  
      case PURCHASE_CAT_DATA_ERROR:
        return { ...state, errMessage: action.payload };
  
      default:
        return { ...state };
    }
  };
  export default GetPurchaseCatelogueData;
  