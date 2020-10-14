import {
  CCC_ACCESS,
  CCC_SUCCESS,
  CCC_FAILURE,
  CCC_ERROR,
} from '../Actions/Actions';
const initialstate = {
  status: 'FAILURE',
  errMessage: '',
  responseList: [],
};

let DeliveryAddress = (state = initialstate, action) => {
  switch (action.type) {
    case CCC_ACCESS:
      return Object.assign({}, state, action.payload);

    case CCC_SUCCESS:
      return Object.assign({}, state, action.payload, { loading: false });

    case CCC_FAILURE:
      return { ...state, errMessage: action.payload };

    case CCC_ERROR:
      return { ...state, errMessage: action.payload };

    default:
      return { ...state };
  }
};
export default DeliveryAddress;
