import axios from 'axios';
import { LOGIN_ACTION_KEY } from '../constant';

export const LoginAction = (payload) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      data: {
        username: payload.username,
        password: payload.password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      url: '/login',
    }).then((res) => {
      localStorage.setItem('isAuthenticated', res.data.isAuthenticated);
      let result = { ...payload };
      result._id = res.data.ID;
      result.username = res.data.username;
      result.password = undefined;
      dispatch({ type: LOGIN_ACTION_KEY, payload: result });
      resolve({ success: res.data.isAuthenticated, error: res.data.msg });
    });
  });
};
