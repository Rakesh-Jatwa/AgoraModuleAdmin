import {
  PURCHASE_CAT_ACCESS,
  PURCHASE_CAT_SUCCESS,
  PURCHASE_CAT_FAILURE,
  PURCHASE_CAT_ERROR,
} from '../../Actions/Actions';
const initialstate = {
  status: 'FAILURE',
  errMessage: '',
  responseList: [],
  loading: false,
};

let PurchaseCatelogueMaint = (state = initialstate, action) => {
  switch (action.type) {
    case PURCHASE_CAT_ACCESS:
      return Object.assign({}, state, action.payload);

    case PURCHASE_CAT_SUCCESS:
      return Object.assign({}, state, action.payload, { loading: false });

    case PURCHASE_CAT_FAILURE:
      return { ...state, errMessage: action.payload };

    case PURCHASE_CAT_ERROR:
      return { ...state, errMessage: action.payload };

    default:
      return { ...state };
  }
};
export default PurchaseCatelogueMaint;
