import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default (state = initialState.common, action) => {
  switch (action.type) {
    case types.LOAD_PROPERTIES_CATEGORY_REQUEST:
      return { ...state, loading: true };
    case types.LOAD_PROPERTIES_CATEGORY_SUCCESS:
      return { ...state, loading: false, success: action.properties };
    case types.LOAD_PROPERTIES_CATEGORY_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};
