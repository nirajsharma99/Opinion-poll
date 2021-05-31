import { LOGOUT_ACTION_KEY } from '../constant';
export const LogoutAction = (payload) => (dispatch, getState) => {
  return (resolve, reject) => {
    let result = { ...payload };
    result._id = '';
    result.username = '';
    dispatch({ type: LOGOUT_ACTION_KEY, payload: result });
  };
};
