import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPollH,
  faUserCog,
  faSignOutAlt,
  faChevronDown,
  faChevronUp,
  faBars,
  faPencilAlt,
  faComment,
  faLaughBeam,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { connect } from 'react-redux';
import { LoginAction } from '../store/actions/LoginAction';
import { LogoutAction } from '../store/actions/LogoutAction';
const UserIcon2 = (props) => {
  const history = useHistory();
  const [userIcon, setUserIcon] = useState(false);
  const [slider, setSlider] = useState(false);
  const [activ, setActiv] = useState('');
  const logOut = () => {
    axios.get('/logout').then((res) => {
      if (res.data.success) {
        localStorage.removeItem('master_class');
        localStorage.setItem('isAuthenticated', false);
        let payload = { username: '', password: '' };
        props.logoutAction(payload);
        history.push('/');
      }
    });
  };
  return (
    <div>
      <div className="user-widget d-md-block d-none">
        <div className="user-container">
          <div className="d-flex flex-rows">
            <div className="user-icon-holder">
              <button
                className="user-icon"
                onClick={() => setUserIcon(!userIcon)}
              >
                <img src="owl.ico" width="60px" height="60px" />
              </button>
            </div>
            <div className="ml-4 my-auto d-flex">
              <span className="text-light font-weight-bold">
                @{props.userDetails.username}
              </span>
            </div>
          </div>
        </div>

        <div className={'options-widget' + (slider ? '' : ' d-none')}>
          <div className="d-flex x">
            <button
              className="link"
              onClick={() => props.setTabActive('mypolls')}
            >
              <FontAwesomeIcon icon={faPollH} className="text-primary icons" />
            </button>
            <button
              className="link"
              onClick={() => props.setTabActive('settings')}
            >
              <FontAwesomeIcon
                icon={faUserCog}
                className=" icons"
                style={{ color: '#2A1B3D' }}
              />
            </button>
            <button className="link" onClick={logOut}>
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="icons"
                style={{ color: 'red' }}
              />
            </button>
          </div>
        </div>
        <div className="circle position-absolute">
          <button className="arrow-down" onClick={() => setSlider(!slider)}>
            <FontAwesomeIcon
              icon={slider ? faChevronUp : faChevronDown}
              className="text-light "
            />
          </button>
        </div>
      </div>
      <div className="d-block d-md-none">
        <div className="user-icon-holder-2 ">
          <button
            className="user-icon-2"
            onClick={() => setUserIcon(!userIcon)}
          >
            <FontAwesomeIcon icon={faBars} size="3x" />
          </button>
        </div>
        <div className="user-widget-2 d-flex flex-column align-items-center">
          <div className={'user-menu'} hidden={!userIcon}>
            <button className="close-btn">
              <FontAwesomeIcon
                icon={faTimes}
                size="3x"
                onClick={() => setUserIcon(!userIcon)}
              />
            </button>
            <div className="slide-option-image d-flex flex-column">
              <div className="slide-image-holder">
                <button className="user-icon">
                  <img src="owl.ico" width="100px" height="100px" />
                </button>
              </div>
              <span className="mt-3 mb-0 text-light h5">@{props.username}</span>
            </div>
            <li className="user-options-2">
              <button
                className="link"
                onClick={() =>
                  history.push({
                    pathname: '/create-poll',
                  })
                }
              >
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  size="1x"
                  className="mr-2"
                />
                <span>Create poll</span>
              </button>
            </li>
            <hr />

            <span className="text-secondary ml-3">Accounts</span>
            <li className="user-options-2">
              <button
                className="link"
                onClick={() =>
                  history.push({
                    pathname: '/useraccount',
                    state: {
                      activate: 'mypolls',
                    },
                  })
                }
              >
                <FontAwesomeIcon icon={faPollH} size="1x" className="mr-2" />
                <span>My polls</span>
              </button>
            </li>

            <li className="user-options-2">
              <button
                className="link"
                onClick={() =>
                  history.push({
                    pathname: '/useraccount',
                    state: {
                      activate: 'settings',
                    },
                  })
                }
              >
                <FontAwesomeIcon icon={faUserCog} size="1x" className="mr-2" />
                <span>Settings</span>
              </button>
            </li>

            <hr />
            <span className="text-secondary ml-3">Communicate</span>
            <li className="user-options-2">
              <button
                className="link"
                onClick={() =>
                  history.push({
                    pathname: '/useraccount',
                    state: {
                      activate: 'feedback',
                    },
                  })
                }
              >
                <FontAwesomeIcon icon={faComment} size="1x" className="mr-2" />
                <span>Send feedback</span>
              </button>
            </li>
            <li className="user-options-2">
              <button
                className="link"
                onClick={() =>
                  history.push({
                    pathname: '/our-team',
                  })
                }
              >
                <FontAwesomeIcon
                  icon={faLaughBeam}
                  size="1x"
                  className="mr-2"
                />
                <span>Our team</span>
              </button>
            </li>
            <li className="user-options-2">
              <button className="link" onClick={logOut}>
                <span>Sign out</span>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  size="1x"
                  className="ml-2"
                />
              </button>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStatetoProps = (state) => {
  return {
    userDetails: state.login.userDetails,
  };
};
const mapDispatchToProps = {
  loginAction: LoginAction,
  logoutAction: LogoutAction,
};
export default connect(mapStatetoProps, mapDispatchToProps)(UserIcon2);
