import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import Notification from './notification';
import PollDeleted from './user-settings/no-polls/polldeleted';
import Header from './header';
import io from 'socket.io-client';
import Report from './reportPoll';
import Loader from './loader/loader';
import UserIcon from './user-icon';
import { connect } from 'react-redux';
import { LogoutAction } from '../store/actions/LogoutAction';
import { ErrorOutline } from '@material-ui/icons/';
let socket;

function Poll(props) {
  const ENDPOINT = 'https://opinion-poll-app.herokuapp.com';
  const history = useHistory();
  const [username, setUsername] = useState(
    props.userDetails ? props.userDetails.username : null
  );
  const [voted, setVoted] = useState(false);
  const [expired, setExpired] = useState(false);
  const [report, setReport] = useState(false);
  const [loader, setLoader] = useState(true);
  const [flash, setFlash] = useState(false);
  const [available, setAvailable] = useState(true);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ id: '', options: '', count: 0 }]);
  const [pollid, setPollid] = useState('');
  const [owner, setOwner] = useState('');
  const [key, setKey] = useState('');
  const [response, setResponse] = useState({
    id: '',
    options: '',
    count: 0,
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

  useEffect(() => {
    if (voted) {
      history.push('/poll-result/' + pollid);
    }
  }, [pollid, history, voted]);

  useEffect(() => {
    socket = io(ENDPOINT);
    var x = props.match.params.id;
    const id = x;
    setPollid(id);
    socket.emit('getPoll', { id: id, username: username });
    socket.on('receivePoll', (poll) => {
      if (poll) {
        setLoader(false);
        if (poll.expired) {
          localStorage.setItem(
            'notify',
            JSON.stringify({
              type: 'error',
              msg: 'Sorry, the poll has expired!',
            })
          );
          history.push('/poll-result/' + poll.pollid);
        } else {
          let medium = [];
          //const data = response.data;
          setOwner(poll.username);
          setQuestion(poll.question);
          setKey(poll.key);
          setExpired(poll.expired);
          setVoted(poll.voted);
          poll.options.map((option) => {
            medium.push(option);
            return medium;
          });
          setOptions(medium);
        }
      } else {
        setLoader(false);
        setAvailable(false);
      }
    });
  }, [question, pollid, expired, history, props, ENDPOINT]);

  function settingResponse({ option }, index) {
    setResponse({
      id: option.id,
      options: option.options,
      count: option.count + 1,
      pollid: pollid,
      key: key,
      index: index,
      username: username,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      if (response.options.length > 0) {
        e.preventDefault();
        axios
          .post('/submitresponse', response)
          .then(function (res) {
            if (res.data.success) {
              localStorage.setItem(
                'notify',
                JSON.stringify({
                  type: 'success',
                  msg: 'Thankyou, for voting!',
                })
              );
              history.push('/poll-result/' + pollid);
            } else {
              console.log('Error submitting response');
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        setToast({
          snackbaropen: true,
          msg: 'Please, select a option!',
          not: 'error',
        });
      }
      setFlash(false);
    } else {
      setFlash(true);
    }
  };
  return (
    <div>
      {loader ? <Loader /> : null}
      {report ? (
        <Report
          setReport={setReport}
          pollid={pollid}
          owner={owner}
          setToast={setToast}
        />
      ) : null}
      <Header />
      {username ? (
        <UserIcon username={username} logout={props.logoutAction} />
      ) : null}
      <div className="ui-outer-2">
        <div className="ui-container pt-5 pb-5">
          {available > 0 ? (
            <div className="">
              <h2
                className="mb-5 w-100 heading"
                style={{
                  wordWrap: 'break-word',
                }}
              >
                {question}
              </h2>
              <div className="d-flex flex-column resp-width-75 m-auto">
                <form>
                  {options.map((option, index) => (
                    <div
                      className={
                        'w-100 mb-4 shadow-lg rounded bg-white radio-label' +
                        (response.options === option.options
                          ? ' selected'
                          : ' ')
                      }
                      key={option.id}
                      tabIndex="1"
                    >
                      <div className="d-flex align-items-center radio-customised position-relative">
                        <input
                          type="radio"
                          id={option.id}
                          name="option"
                          value={option.options}
                          checked={response.options === option.options}
                          onChange={() => settingResponse({ option }, index)}
                          className="d-inline-block ml-3 mr-3"
                        />
                        <label
                          htmlFor={option.id}
                          className="py-3 font-weight-bold w-100 mb-0 text-primary-dark d-inline-block poll-options"
                          style={{
                            wordWrap: 'break-word',
                            cursor: 'pointer',
                          }}
                        >
                          {option.options}
                        </label>
                      </div>
                    </div>
                  ))}
                  <Notification
                    switcher={toast.snackbaropen}
                    close={snackbarclose}
                    message={toast.msg}
                    nottype={toast.not}
                  />
                  {flash ? (
                    <div className="d-flex justify-content-center">
                      <span
                        className="text-center  mx-md-auto py-1 px-3 font-weight-bold mb-2"
                        style={{
                          color: '#ff4444',
                          borderRadius: '20px',
                          background: 'rgba(255, 68, 68, 0.2)',
                        }}
                      >
                        <ErrorOutline fontSize="small" className="mr-2" />
                        Please, Sign in to vote!, click{' '}
                        <button
                          className="bg-transparent text-info border-0 px-0 font-weight-bold"
                          onClick={() =>
                            history.push({
                              pathname: '/',
                              state: { pollid: pollid },
                            })
                          }
                        >
                          here
                        </button>
                      </span>
                    </div>
                  ) : null}
                  <div className="mt-3 d-flex flex-column flex-md-row">
                    <div className="col-0 col-md-8 d-flex px-0 justify-content-center justify-content-md-start">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="h5 focus-outline-none py-3 font-weight-bold focus-shadow r-w-50 bg-success border-0 text-white px-2 shadow-lg hover-shadow-lg rounded-lg"
                      >
                        Submit your vote
                      </button>
                    </div>
                    <div className="col-0 col-md-4 my-md-auto my-3 px-0">
                      <Link
                        to={'/poll-result/' + pollid}
                        className="d-flex justify-content-end"
                      >
                        <h4 className=" mb-0 text-secondary font-weight-normal">
                          View Results <FontAwesomeIcon icon={faChevronRight} />
                        </h4>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
              <div className="d-block mb-3" style={{ textAlign: 'right' }}>
                <button
                  className="font-weight-bold px-2 py-1 rounded-lg border bg-secondary text-light"
                  onClick={() => setReport(true)}
                >
                  Report Poll
                </button>
              </div>
            </div>
          ) : (
            <PollDeleted />
          )}
        </div>
      </div>
    </div>
  );
}
const mapStatetoProps = (state) => {
  return {
    userDetails: state.login.userDetails,
  };
};
const mapDispatchToProps = {
  logoutAction: LogoutAction,
};
export default connect(mapStatetoProps, mapDispatchToProps)(Poll);
