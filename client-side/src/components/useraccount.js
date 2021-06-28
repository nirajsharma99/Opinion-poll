import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Header from './header';
import UserIcon2 from './user-icon-settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faHome,
  faPollH,
  faCog,
  faEnvelopeOpenText,
} from '@fortawesome/free-solid-svg-icons';
import UserInfo from './user-info';
import Notification from './notification';
import Loader from './loader/loader';
import { connect } from 'react-redux';

const UserAccount = (props) => {
  const history = useHistory();
  var activ = props.location.state
    ? props.location.state.activate
    : 'dashboard';
  const [tabActive, setTabActive] = useState(activ);
  const [loader, setLoader] = useState(true);
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
  var temp = JSON.parse(localStorage.getItem('notify'));
  useEffect(() => {
    if (!props.userDetails.username) {
      history.push('/');
    }
  }, [props, history]);
  useEffect(() => {
    if (temp) {
      setToast({ snackbaropen: true, msg: temp.msg, not: temp.type });
      localStorage.removeItem('notify');
    }
  }, [temp]);
  return (
    <div className="position-relative">
      <div className="navigator-btn">
        <div className=" account-info-btn-sm d-sm-none mx-auto">
          <button
            className={
              'accounts-btn-sm ' +
              (tabActive === 'dashboard' ? ' activTab-sm' : '')
            }
            onClick={() => setTabActive('dashboard')}
          >
            <FontAwesomeIcon icon={faHome} />
          </button>

          <button
            className={
              'accounts-btn-sm' +
              (tabActive === 'mypolls' ? ' activTab-sm' : '')
            }
            onClick={() => setTabActive('mypolls')}
          >
            <FontAwesomeIcon icon={faPollH} />
          </button>

          <button
            className={
              'accounts-btn-sm' +
              (tabActive === 'feedback' ? ' activTab-sm' : '')
            }
            onClick={() => setTabActive('feedback')}
          >
            <FontAwesomeIcon icon={faEnvelopeOpenText} />
          </button>

          <button
            className={
              'accounts-btn-sm' +
              (tabActive === 'settings' ? ' activTab-sm' : '')
            }
            onClick={() => setTabActive('settings')}
          >
            <FontAwesomeIcon icon={faCog} />
          </button>
        </div>
      </div>
      {loader ? <Loader /> : null}
      <Notification
        switcher={toast.snackbaropen}
        close={snackbarclose}
        message={toast.msg}
        nottype={toast.not}
      />
      <Header />
      <UserIcon2
        username={props.userDetails.username}
        tabActive={tabActive}
        setTabActive={setTabActive}
      />
      <div className=" account-info-container m-auto position-relative">
        <img
          src="4426.jpg"
          className="position-absolute d-sm-block d-none"
          alt="opinion-background"
        />
        <div className="py-md-5 px-3 d-flex flex-xl-row flex-column m-auto">
          <div className=" account-info-btn d-sm-flex d-none flex-xl-column flex-row  ">
            <li className="accounts-btn-li">
              <button
                className={
                  'accounts-btn' +
                  (tabActive === 'dashboard' ? ' activTab' : '')
                }
                onClick={() => setTabActive('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li className="accounts-btn-li">
              <button
                className={
                  'accounts-btn' + (tabActive === 'mypolls' ? ' activTab' : '')
                }
                onClick={() => setTabActive('mypolls')}
              >
                My polls
              </button>
            </li>
            <li className="accounts-btn-li ">
              <button
                className={
                  'accounts-btn' + (tabActive === 'settings' ? ' activTab' : '')
                }
                onClick={() => setTabActive('settings')}
              >
                Settings
              </button>
            </li>
            <li className="accounts-btn-li">
              <button
                className={
                  'accounts-btn' + (tabActive === 'feedback' ? ' activTab' : '')
                }
                onClick={() => setTabActive('feedback')}
              >
                Send feedback
              </button>
            </li>
          </div>
          <UserInfo
            username={props.userDetails.username}
            activate={tabActive}
            setLoader={setLoader}
          />
        </div>
      </div>
      <Link to={{ pathname: '/team' }} className="d-sm-block d-none">
        <p
          className="text-center font-weight-bold"
          style={{ fontSize: '1.3rem', color: 'purple' }}
        >
          Built with <FontAwesomeIcon icon={faHeart} /> by...
        </p>
      </Link>
    </div>
  );
};
const mapStatetoProps = (state) => {
  return {
    userDetails: state.login.userDetails,
  };
};

export default connect(mapStatetoProps, null)(UserAccount);
