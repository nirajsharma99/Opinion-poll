import { useState } from 'react';
import Header from './header';
import UserIcon2 from './user-icon-settings';
import UserInfo from './user-info';
import { connect } from 'react-redux';
const UserAccount = (props) => {
  const [tabActive, setTabActive] = useState(props.location.state.activate);
  return (
    <div className="position-relative">
      <Header />
      <UserIcon2
        username={props.userDetails.username}
        tabActive={tabActive}
        setTabActive={setTabActive}
      />
      <div className=" account-info-container m-auto position-relative">
        <img src="4426.jpg" className="position-absolute d-sm-block d-none" />
        <div className="py-5 px-3 d-flex flex-xl-row flex-column m-auto">
          <div className=" account-info-btn d-flex flex-xl-column flex-row  ">
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
            userid={props.userDetails._id}
          />
        </div>
      </div>
    </div>
  );
};
const mapStatetoProps = (state) => {
  console.log('state(cp) -', state);
  return {
    userDetails: state.login.userDetails,
  };
};

export default connect(mapStatetoProps, null)(UserAccount);
