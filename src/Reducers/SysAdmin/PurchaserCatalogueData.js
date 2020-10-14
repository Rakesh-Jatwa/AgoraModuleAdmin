import {
    PURCHASE_CATALOGUE_DATA_ACCESS,
    PURCHASE_CATALOGUE_DATA_SUCCESS,
    PURCHASE_CATALOGUE_DATA_FAILURE,
    PURCHASE_CATALOGUE_DATA_ERROR,
  } from '../../Actions/Actions';
  const initialstate = {
    status: 'FAILURE',
    errMessage: '',
    responseList: [],
    loading: false,
  };
  
  let PurchaserCatalogueData = (state = initialstate, action) => {
    switch (action.type) {
      case PURCHASE_CATALOGUE_DATA_ACCESS:
        return Object.assign({}, state, action.payload);
  
      case PURCHASE_CATALOGUE_DATA_SUCCESS:
        return Object.assign({}, state, action.payload, { loading: false });
  
      case PURCHASE_CATALOGUE_DATA_FAILURE:
        return { ...state, errMessage: action.payload };
  
      case PURCHASE_CATALOGUE_DATA_ERROR:
        return { ...state, errMessage: action.payload };
  
      default:
        return { ...state };
    }
  };
  export default PurchaserCatalogueData;
  