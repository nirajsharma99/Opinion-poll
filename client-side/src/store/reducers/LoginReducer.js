import { LOGIN_ACTION_KEY, LOGOUT_ACTION_KEY } from '../constant';
const initial_state = {
  userDetails: {},
};
const LoginReducer = (state = initial_state, action) => {
  switch (action.type) {
    case LOGIN_ACTION_KEY:
      return { ...state, userDetails: { ...action.payload } };
    case LOGOUT_ACTION_KEY:
      return { ...state, userDetails: { ...action.payload } };
    default:
      return state;
  }
};
export default LoginReducer;
