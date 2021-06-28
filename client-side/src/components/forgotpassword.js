import { TextField, MenuItem } from '@material-ui/core';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import {
  ErrorOutline,
  Cancel,
  Visibility,
  VisibilityOff,
  AccountCircle,
} from '@material-ui/icons/';
import { useState } from 'react';
import axios from 'axios';
import Loader2 from './loader/loader2';

const ShowBox = (props) => {
  const [resetPassword, setResetPassword] = useState({
    showPassword: false,
    password: '',
  });
  const [loader, setLoader] = useState(false);
  const [flash, setFlash] = useState({ show: false, type: '', msg: '' });
  const [resetCPassword, setResetCPassword] = useState({
    showPassword: false,
    password: '',
  });
  const [showSet, setShowSet] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [question, setQuestion] = useState(
    'When you were young, what did you want to be when you grew up?'
  );
  const [answer, setAnswer] = useState('');
  const questions = [
    {
      value: 'When you were young, what did you want to be when you grew up?',
      label: 'When you were young, what did you want to be when you grew up?',
    },
    {
      value: 'Who was your childhood hero?',
      label: 'Who was your childhood hero?',
    },
    {
      value: 'Where was your best family vacation as a kid?',
      label: 'Where was your best family vacation as a kid?',
    },
    {
      value: 'When was the best day of your life?',
      label: 'When was the best day of your life?',
    },
  ];
  const handleChange = (event) => {
    setQuestion(event.target.value);
  };
  const handleSubmit = () => {
    const data = {
      username: loginUsername,
      question: question,
      answer: answer,
    };
    if (loginUsername.trim().length === 0 || answer.trim().length === 0) {
      setFlash({
        show: true,
        type: 'danger',
        msg: 'Please fill all the fields!',
      });
    } else {
      setLoader(true);
      axios.post('/forgot-password', data).then((res) => {
        if (res.data.success) {
          setLoader(false);
          setShowSet(true);
          setFlash({ show: false, type: '', msg: '' });
        } else {
          setLoader(false);
          setFlash({ show: true, type: 'danger', msg: res.data.msg });
        }
      });
    }
  };
  const handleReset = () => {
    const data = { password: resetCPassword.password, username: loginUsername };
    if (
      resetCPassword.password.trim().length < 8 ||
      resetPassword.password.trim().length < 8
    ) {
      setFlash({
        show: true,
        type: 'danger',
        msg: 'Password must be minimum 8 characters!',
      });
    } else {
      if (resetCPassword.password === resetPassword.password) {
        axios
          .post('/resetPassword', data)
          .then((res) => {
            if (res.data.success) {
              setLoginUsername('');
              setResetCPassword({ ...resetCPassword, password: '' });
              setResetPassword({ ...resetPassword, password: '' });
              setFlash({ ...flash, show: false });
              props.setShow(false);
              props.setToast({
                snackbaropen: true,
                msg: 'Password reset!, please login..',
                not: 'success',
              });
            } else {
              setLoginUsername('');
              setResetCPassword({ ...resetCPassword, password: '' });
              setResetPassword({ ...resetPassword, password: '' });
              setFlash({ ...flash, show: false });
              props.setShow(false);
              props.setToast({
                snackbaropen: true,
                msg: 'Error occured!',
                not: 'error',
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setFlash({ show: true, type: 'danger', msg: 'Password mismatch!' });
      }
    }
  };
  return (
    <div
      className="w-100 justify-content-center d-flex align-items-center position-absolute "
      style={{
        height: '100%',
        zIndex: 20,
        backgroundColor: 'rgba(135,206,235 ,0.7)',
      }}
    >
      {loader ? <Loader2 /> : null}
      <div className="d-flex flex-column align-items-center bg-white rounded-lg resp-width-75">
        {showSet ? null : (
          <div className="w-75">
            <h5 className="text-left w-75 mt-4">Forgot Password</h5>
            <div className="w-100 d-flex flex-column px-4 pt-3">
              <p
                className={
                  'flash-message text-center py-1 rounded-lg text-' +
                  flash.type +
                  (flash.show ? '' : ' d-none')
                }
              >
                <ErrorOutline fontSize="small" className="mr-1" />
                {flash.msg}
              </p>
              <TextField
                required
                placeholder="username"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle style={{ color: 'rgb(128,0,128 )' }} />
                    </InputAdornment>
                  ),
                }}
                className="mb-3 w-100"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <TextField
                label="Question"
                select
                variant="outlined"
                value={question}
                onChange={handleChange}
                className="mt-3"
                style={{ width: '100%' }}
              >
                {questions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Your answer..."
                variant="filled"
                className="w-100 mt-3 mb-3"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <div className="px-3 py-3 d-flex justify-content-end">
                <button
                  className="border-light rounded-lg shadow-lg px-4 py-2 "
                  onClick={() => props.setShow(false)}
                >
                  Cancel
                </button>
                <button
                  className="border-0 rounded-lg shadow-lg text-light px-4 py-2 ml-3"
                  style={{ background: 'purple' }}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {showSet ? (
          <div className="w-100 position-relative">
            <button
              className="border-0 bg-transparent position-absolute"
              style={{ right: '0', color: 'purple' }}
              onClick={() => props.setShow(false)}
            >
              <Cancel />
            </button>

            <div className="d-flex flex-column align-items-center py-3 w-75 m-auto">
              <h5 className="text-left w-75 mt-2" style={{ color: 'purple' }}>
                Reset Password
              </h5>
              <p
                className={
                  'flash-message w-75 text-center py-1 rounded-lg text-' +
                  flash.type +
                  (flash.show ? '' : ' d-none')
                }
              >
                <ErrorOutline fontSize="small" className="mr-1" />
                {flash.msg}
              </p>
              <TextField
                helperText={
                  resetPassword.password.trim().length < 8 &&
                  resetPassword.password.trim().length !== 0
                    ? 'Minimum 8 characters'
                    : null
                }
                type={resetPassword.showPassword ? 'text' : 'password'}
                placeholder="new password"
                variant="outlined"
                size="small"
                className="mb-2 w-75"
                value={resetPassword.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        className="p-0 m-0"
                        onClick={() =>
                          setResetPassword({
                            ...resetPassword,
                            showPassword: !resetPassword.showPassword,
                          })
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {resetPassword.showPassword ? (
                          <Visibility style={{ color: 'purple' }} />
                        ) : (
                          <VisibilityOff style={{ color: 'purple' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  setResetPassword({
                    ...resetPassword,
                    password: e.target.value,
                  })
                }
              />
              <TextField
                helperText={
                  resetCPassword.password.trim().length < 8 &&
                  resetCPassword.password.trim().length !== 0
                    ? 'Minimum 8 characters'
                    : null
                }
                type={resetCPassword.showPassword ? 'text' : 'password'}
                placeholder="confirm new password"
                variant="outlined"
                size="small"
                className="mb-2 w-75"
                value={resetCPassword.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        className="p-0 m-0"
                        onClick={() =>
                          setResetCPassword({
                            ...resetCPassword,
                            showPassword: !resetCPassword.showPassword,
                          })
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {resetCPassword.showPassword ? (
                          <Visibility style={{ color: 'purple' }} />
                        ) : (
                          <VisibilityOff style={{ color: 'purple' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  setResetCPassword({
                    ...resetCPassword,
                    password: e.target.value,
                  })
                }
              />
              <button
                className="border-0 text-light w-25 px-2 py-1 rounded-lg"
                style={{ background: 'purple' }}
                onClick={handleReset}
              >
                Submit
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default ShowBox;
