import {
    DEPARTMENT_APPROVEL_LIST_ACCESS,
    DEPARTMENT_APPROVEL_LIST_SUCCESS,
    DEPARTMENT_APPROVEL_LIST_FAILURE,
    DEPARTMENT_APPROVEL_LIST_ERROR,
  } from '../../Actions/Actions';
  const initialstate = {
    status: 'FAILURE',
    errMessage: '',
    responseList: [],
    loading: false,
  };

  let DepartmentSearchList = (state = initialstate, action) => {
    switch (action.type) {
      case DEPARTMENT_APPROVEL_LIST_ACCESS:
        return Object.assign({}, state, action.payload);

      case DEPARTMENT_APPROVEL_LIST_SUCCESS:
        debugger;
        return Object.assign({}, state, action.payload, { loading: false });

      case DEPARTMENT_APPROVEL_LIST_FAILURE:
        return { ...state, errMessage: action.payload };

      case DEPARTMENT_APPROVEL_LIST_ERROR:
        return { ...state, errMessage: action.payload };

      default:
        return { ...state };
    }
  };
  export default DepartmentSearchList;
