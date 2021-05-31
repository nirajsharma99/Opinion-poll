import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import LoginReducer from './reducers/LoginReducer';
import { AES, enc } from 'crypto-js';
const ConfigureStore = () => {
  var intialState = {};
  var decryptedObject = {};
  try {
    intialState = window.localStorage.getItem('master_class')
      ? window.localStorage.getItem('master_class')
      : {};
    const decrypted = AES.decrypt(intialState, 'q1w2e3r4').toString(enc.Utf8);
    console.log(decrypted);
    decryptedObject = decrypted ? JSON.parse(decrypted) : {};
  } catch (error) {
    console.log('getError', error);
  }
  const saver = (store) => (next) => (action) => {
    let result = next(action);
    let stateToSave = store.getState();
    const encrypted = AES.encrypt(
      JSON.stringify(stateToSave),
      'q1w2e3r4'
    ).toString();
    window.localStorage.setItem('master_class', encrypted);
    return result;
  };
  const rootReducer = combineReducers({ login: LoginReducer });
  return createStore(
    rootReducer,
    decryptedObject,
    applyMiddleware(thunk, saver)
  );
};
export default ConfigureStore;
