import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  VisibilityOff,
  Visibility,
  AccountCircle,
  ErrorOutline,
} from '@material-ui/icons/';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoginAction } from '../store/actions/LoginAction';
import { connect } from 'react-redux';
import axios from 'axios';
import Notification from './notification';
import ShowBox from './forgotpassword';
import Loader from './loader/loader';
import Loader2 from './loader/loader2';

function FrontPage(props) {
  const history = useHistory();
  const [signing, setSigning] = useState(true);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState({ loader1: false, loader2: false });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState({
    showPassword: false,
    password: '',
  });
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState({
    showPassword: false,
    password: '',
  });
  const [registerCPassword, setRegisterCPassword] = useState({
    showPassword: false,
    password: '',
  });
  const [flash, setFlash] = useState({ show: false, type: '', msg: '' });
  const [loginFlash, setLoginFlash] = useState({
    show: false,
    type: '',
    msg: '',
  });
  const [toast, setToast] = useState({
    snackbaropen: false,
    msg: '',
    not: '',
  });
  const snackbarclose = (event) => {
    setToast({
      snackbaropen: false,
    });
  };
  const register = () => {
    //console.log(registerUsername.trim().length > 0);
    if (
      registerUsername.trim().length > 0 &&
      registerPassword.password.trim().length > 0 &&
      registerCPassword.password.trim().length > 0
    ) {
      if (
        registerPassword.password === registerCPassword.password &&
        registerCPassword.password.trim().length >= 8
      ) {
        setLoader({ ...loader, loader2: true });
        axios({
          method: 'POST',
          data: {
            username: registerUsername,
            password: registerCPassword.password,
          },
          withCredentials: true,
          url: '/register',
        }).then((res) => {
          setLoader({ ...loader, loader2: false });
          if (res.data.success) {
            setToast({
              snackbaropen: true,
              msg: res.data.msg,
              not: 'success',
            });
            setRegisterUsername('');
            setRegisterPassword({ ...registerPassword, password: '' });
            setRegisterCPassword({ ...registerCPassword, password: '' });
            setSigning(!signing);
          } else if (!res.data.success) {
            setFlash({
              show: true,
              type: 'danger',
              msg: 'Username already exists!',
            });
          }
        });
      } else {
        setFlash({
          show: true,
          type: 'danger',
          msg: 'Password mismatch!',
        });
      }
    } else {
      setFlash({
        show: true,
        type: 'danger',
        msg: 'Please fill all the fields!',
      });
    }
  };
  //console.log(error);
  const login = () => {
    if (
      loginUsername.trim().length > 0 &&
      loginPassword.password.trim().length > 0
    ) {
      setLoader({ ...loader, loader1: true });
      let payload = {
        username: loginUsername,
        password: loginPassword.password,
      };
      // window.localStorage.setItem('isAuthenticated', res.data.isAuthenticated);
      props.loginAction(payload).then((result) => {
        setLoader({ ...loader, loader1: true });
        if (result.success) {
          history.push({
            pathname: '/useraccount',
            state: { activate: 'dashboard' },
          });
        }
        if (!result.success) {
          setLoginFlash({
            show: true,
            type: 'danger',
            msg: result.error,
          });
          setLoader({ ...loader, loader1: false });
        }
      });
    } else {
      setLoginFlash({
        show: true,
        type: 'danger',
        msg: 'Please fill all the fields!!',
      });
    }
  };
  //const showError = (value, error) => value.trim().length === 0 && error;

  return (
    <div className="container-1 d-flex flex-md-row flex-column">
      {loader.loader1 ? <Loader /> : null}
      {loader.loader2 ? <Loader2 /> : null}
      <Notification
        switcher={toast.snackbaropen}
        close={snackbarclose}
        message={toast.msg}
        nottype={toast.not}
      />
      <div className="logo py-5 align-items-center justify-content-center d-flex">
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex align-items-baseline">
            <a className="text-dark font-2" href="/">
              Opinion Poll
            </a>
          </div>
          <p className="mt-0 mb-0 font-italic" style={{ fontSize: '1.125rem' }}>
            Create anonymous polls for free
          </p>
        </div>
      </div>
      <div className="logging d-flex justify-content-center align-items-center">
        <div className={'container-2 '} hidden={!signing}>
          <div className="wave-container">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
          <div>
            <div className=" d-flex mx-auto flex-column justify-content-center align-items-center">
              <img src="4428.jpg" className="front-images" alt="login-page" />
              <p
                className={
                  'flash-message w-75 text-center py-1 rounded-lg text-' +
                  loginFlash.type +
                  (loginFlash.show ? '' : ' d-none')
                }
              >
                <ErrorOutline fontSize="small" className="mr-1" />
                {loginFlash.msg}
              </p>
              <TextField
                placeholder="username"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle style={{ color: 'purple' }} />
                    </InputAdornment>
                  ),
                }}
                className="mb-3 w-75"
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <TextField
                type={loginPassword.showPassword ? 'text' : 'password'}
                placeholder="password"
                variant="outlined"
                size="small"
                className=" w-75 mb-3"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        className="p-0 m-0"
                        onClick={() =>
                          setLoginPassword({
                            ...loginPassword,
                            showPassword: !loginPassword.showPassword,
                          })
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {loginPassword.showPassword ? (
                          <Visibility style={{ color: 'purple' }} />
                        ) : (
                          <VisibilityOff style={{ color: 'purple' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={loginPassword.password}
                onChange={(e) =>
                  setLoginPassword({
                    ...loginPassword,
                    password: e.target.value,
                  })
                }
              />
              <button
                className="border-0 w-75"
                style={{
                  color: 'purple',
                  background: 'transparent',
                }}
                onClick={() => setShow(!show)}
              >
                forgot password?
              </button>
              <button className="signin mb-2" onClick={login}>
                SIGN IN
              </button>
              <button
                className="signup mb-3"
                onClick={() => setSigning(!signing)}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>

        <div className={'container-2 '} hidden={signing}>
          <div className="wave-container-2">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
          <div className=" d-flex mx-auto flex-column justify-content-center align-items-center ">
            <img src="4457.jpg" className="front-images" alt="register-page" />
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
              placeholder="username"
              variant="outlined"
              size="small"
              className="mb-2 w-75"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle style={{ color: 'purple' }} />
                  </InputAdornment>
                ),
              }}
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <TextField
              helperText={
                registerPassword.password.trim().length < 8 &&
                registerPassword.password.trim().length !== 0
                  ? 'Minimum 8 characters'
                  : null
              }
              type={registerPassword.showPassword ? 'text' : 'password'}
              placeholder="password"
              variant="outlined"
              size="small"
              className="mb-2 w-75"
              value={registerPassword.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="toggle password visibility"
                      className="p-0 m-0"
                      onClick={() =>
                        setRegisterPassword({
                          ...registerPassword,
                          showPassword: !registerPassword.showPassword,
                        })
                      }
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {registerPassword.showPassword ? (
                        <Visibility style={{ color: 'purple' }} />
                      ) : (
                        <VisibilityOff style={{ color: 'purple' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                setRegisterPassword({
                  ...registerPassword,
                  password: e.target.value,
                })
              }
            />
            <TextField
              helperText={
                registerCPassword.password.trim().length < 8 &&
                registerCPassword.password.trim().length !== 0
                  ? 'Minimum 8 characters'
                  : null
              }
              type={registerCPassword.showPassword ? 'text' : 'password'}
              placeholder="confirm password"
              variant="outlined"
              size="small"
              className="mb-2 w-75"
              value={registerCPassword.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="toggle password visibility"
                      className="p-0 m-0"
                      onClick={() =>
                        setRegisterCPassword({
                          ...registerCPassword,
                          showPassword: !registerCPassword.showPassword,
                        })
                      }
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {registerCPassword.showPassword ? (
                        <Visibility style={{ color: 'purple' }} />
                      ) : (
                        <VisibilityOff style={{ color: 'purple' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                setRegisterCPassword({
                  ...registerCPassword,
                  password: e.target.value,
                })
              }
            />
            <button className="signin mb-2" onClick={register}>
              SIGN UP
            </button>
            <button
              className="signup mb-3"
              onClick={() => setSigning(!signing)}
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
      {show ? (
        <ShowBox show={show} setShow={setShow} setToast={setToast} />
      ) : null}
    </div>
  );
}
const mapStatetoProps = (state) => {
  return {
    userDetails: state.login.userDetails,
  };
};
const mapDispatchToProps = {
  loginAction: LoginAction,
};
export default connect(mapStatetoProps, mapDispatchToProps)(FrontPage);
