import {
    DEPARTMENT_SEARCH_ACCESS,
    DEPARTMENT_SEARCH_SUCCESS,
    DEPARTMENT_SEARCH_FAILURE,
    DEPARTMENT_SEARCH_ERROR,
  } from '../../Actions/Actions';
  const initialstate = {
    status: 'FAILURE',
    errMessage: '',
    responseList: [],
    loading: false,
  };

  let DepartmentSearchList = (state = initialstate, action) => {
    switch (action.type) {
      case DEPARTMENT_SEARCH_ACCESS:
        return Object.assign({}, state, action.payload);

      case DEPARTMENT_SEARCH_SUCCESS:
        return Object.assign({}, state, action.payload, { loading: false });

      case DEPARTMENT_SEARCH_FAILURE:
        return { ...state, errMessage: action.payload };

      case DEPARTMENT_SEARCH_ERROR:
        return { ...state, errMessage: action.payload };

      default:
        return { ...state };
    }
  };
  export default DepartmentSearchList;
