import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@material-ui/core';
import RadioButtonCheckedOutlinedIcon from '@material-ui/icons/RadioButtonCheckedOutlined';
import StarIcon from '@material-ui/icons/Star';
import ChangePassword from './user-settings/changePassword';
import DeleteAccount from './user-settings/deleteAccount';
import SecurityQuestion from './user-settings/securityQuestion';
import Notification from './notification';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Dashboard from './user-settings/dashboard';
import ListPolls from './user-settings/list-polls';

function UserInfo(props) {
  const history = useHistory();
  const [polls, setPolls] = useState([]);
  const [unstarredPolls, setUnstarredPolls] = useState([]);
  const [starredPolls, setStarredPolls] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
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
    var temporary = [];
    if (window.localStorage.getItem('isAuthenticated') === false || null) {
      history.push('/');
    }
    axios.post('/getPolls', { userid: props.userid }).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        var highest = 0,
          sum = 0,
          mostvoted;
        res.data[i].options.map((x) => {
          sum += x.count;
          if (x.count >= highest) {
            highest = x.count;
            mostvoted = x.options;
            return highest, mostvoted;
          }
        });
        var retrieve = new Date(res.data[i].date);
        const date =
          retrieve.getDate() +
          '/' +
          retrieve.getMonth() +
          '/' +
          retrieve.getFullYear();
        const time = retrieve.getHours() + ':' + retrieve.getMinutes();
        const expire = new Date(res.data[i].expiration) - new Date();

        temporary = [
          ...temporary,
          {
            question: res.data[i].question,
            date: date,
            time: time,
            highest: highest,
            mostvoted: mostvoted,
            pollid: res.data[i].pollid,
            key: res.data[i]._id,
            totalvotes: sum,
            expired: expire < 0 ? true : false,
            starred: res.data[i].starred,
          },
        ];
      }
      setPolls(temporary);
      let starred = [],
        unstarred = [];
      temporary.map((x) => {
        if (!x.starred) {
          unstarred = [...unstarred, x];
        } else {
          starred = [...starred, x];
        }
        return unstarred;
      });
      setUnstarredPolls(unstarred);
      setStarredPolls(starred);
    });
  }, []);

  const sendFeedback = () => {
    const data = {
      username: props.username,
      subject: subject,
      message: message,
    };
    axios
      .post('/sendFeedback', data)
      .then((res) => {
        if (res.data.success) {
          setToast({
            snackbaropen: true,
            msg: 'Feedback sent!',
            not: 'success',
          });
          setSubject('');
          setMessage('');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePoll = (key) => {
    const data = { key: key };
    axios
      .post('http://localhost:5000/deletepoll', data)
      .then((res) => {
        if (res.data.success) {
          setToast({
            snackbaropen: true,
            msg: 'Poll deleted!',
            not: 'success',
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //console.log(polls);
  return (
    <div className="account-info w-100 ml-xl-3 ml-0 mr-3 mb-5 shadow">
      <Notification
        switcher={toast.snackbaropen}
        close={snackbarclose}
        message={toast.msg}
        nottype={toast.not}
      />
      <div
        className={'w-100' + (props.activate === 'settings' ? '' : ' d-none')}
      >
        <SecurityQuestion userID={props.userid} />
        <ChangePassword userID={props.userid} />
        <DeleteAccount userID={props.userid} />
      </div>
      <div
        className={'w-100' + (props.activate === 'feedback' ? '' : ' d-none')}
      >
        <div className="d-flex flex-column w-100 align-items-center">
          <input
            type="textarea"
            placeholder="Subject"
            className="feedback-subj mb-2 mt-5"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          />
          <textarea
            rows="4"
            type="textarea"
            placeholder="Enter your feedback here.."
            className="feedback-msg "
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button className="p-2 mt-3 mb-5 feedback-btn" onClick={sendFeedback}>
            Submit
          </button>
        </div>
      </div>
      <div className={'p-2' + (props.activate === 'mypolls' ? '' : ' d-none')}>
        <Dashboard polls={polls} />
        <table
          className="d-sm-block d-none"
          style={{ background: 'rgba(255,255,255,0.8)' }}
        >
          <tbody>
            <tr>
              <th></th>
              <th className=" text-center p-2">
                <p className="text-light bg-primary rounded-lg table-heading">
                  Question
                </p>
              </th>
              <th className="text-center">
                <p className="text-light bg-success rounded-lg table-heading">
                  <AccessTimeIcon fontSize="small" className="mr-2 " />
                  Created
                </p>
              </th>
              <th className="text-center">
                <p className="text-light bg-dark rounded-lg table-heading w-100 ">
                  Status
                </p>
              </th>
              <th className="text-center" style={{ width: '100px' }}>
                <p className="text-light bg-dark rounded-lg table-heading w-100 ">
                  Total votes
                </p>
              </th>
              <th className={'text-center'}>
                <p className="text-light bg-dark rounded-lg table-heading">
                  <HowToVoteIcon fontSize="small" className="mr-2 " />
                  Most Voted
                </p>
              </th>
              <th></th>
              <th></th>
            </tr>
            {starredPolls.map((poll, index) => (
              <ListPolls
                poll={poll}
                index={index}
                deletePoll={deletePoll}
                key={index}
              />
            ))}
            {unstarredPolls.map((poll, index) => (
              <ListPolls
                poll={poll}
                index={index}
                deletePoll={deletePoll}
                key={index}
              />
            ))}
          </tbody>
        </table>
        <div className="d-sm-none d-block">
          {polls.map((poll, index) => (
            <div key={index} className="mt-3 d-flex border position-relative">
              <span
                className={
                  'mini-poll-status text-light font-weight-bold px-3 py-1 ' +
                  (poll.expired ? 'bg-secondary' : 'bg-success')
                }
              >
                {poll.expired ? 'Inactive' : 'Active'}
              </span>
              <div className="col-10 p-3">
                <a
                  //href={'/poll-admin?id=' + poll.pollid + '&key=' + poll.key}
                  onClick={() =>
                    history.push({
                      pathname: '/poll-admin',
                      state: {
                        pollid: poll.pollid,
                        key: poll.key,
                      },
                    })
                  }
                  className="text-dark font-weight-bold rounded-lg h4"
                >
                  {index + 1 + '.'}
                  {poll.question}
                </a>
                <div className="d-block mt-3">
                  <p className="bg-light ui-1">
                    <span className="text-light bg-success ui-2">Created</span>
                    <span
                      className="text-secondary bg-light font-weight-bold"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {poll.date} || {poll.time}
                    </span>
                  </p>
                  <br />
                  <p className="bg-light ui-1">
                    <span className="text-light bg-dark ui-2">Total votes</span>
                    <span
                      className="text-secondary bg-light font-weight-bold"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {poll.totalvotes}
                    </span>
                  </p>

                  <br />
                  <p className=" bg-light ui-1">
                    <span className="text-light bg-dark ui-2">
                      <HowToVoteIcon fontSize="small" className="mr-2 " />
                      Most Voted
                    </span>
                    <span className="font-weight-bold">
                      {poll.totalvotes === 0 ? (
                        <span className="text-secondary">'No votes!'</span>
                      ) : (
                        poll.mostvoted
                      )}
                      <span
                        className={
                          'mx-auto p-1 text-dark text-center rounded-lg' +
                          (poll.totalvotes === 0 ? ' d-none' : '')
                        }
                        style={{ fontSize: 'normal' }}
                      >
                        (
                        <span className="text-success font-weight-bold">
                          {(poll.highest / poll.totalvotes) * 100 + '%'}
                        </span>
                        &nbsp;votes )
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-2 text-center d-flex flex-column py-2">
                <IconButton
                  className={poll.starred ? 'text-warning' : 'text-secondary'}
                >
                  <StarIcon />
                </IconButton>
                {poll.totalvotes === 0 ? (
                  <a
                    aria-label="Edit Poll?"
                    href={'/edit-poll/?id=' + poll.pollid + '&key=' + poll.key}
                    className="outline-none rounded  text-warning border-0 bg-transparent h5 mb-2"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </a>
                ) : null}
                <IconButton
                  className="border-0 bg-transparent outline-none h5 "
                  onClick={() => deletePoll(poll.key)}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-danger" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default UserInfo;
