import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import ChangePassword from './user-settings/changePassword';
import DeleteAccount from './user-settings/deleteAccount';
import SecurityQuestion from './user-settings/securityQuestion';
import Notification from './notification';
import Dashboard from './user-settings/dashboard';
import ListPolls from './user-settings/list-polls';
import io from 'socket.io-client';
import SendFeedback from './user-settings/sendFeedback';
import NoPolls from './user-settings/no-polls/no-polls';
import ListMiniPolls from './user-settings/list-mini-polls';
let socket;

function UserInfo(props) {
  const ENDPOINT = 'localhost:5000';
  const history = useHistory();
  const [polls, setPolls] = useState([]);
  const [unstarredPolls, setUnstarredPolls] = useState([]);
  const [starredPolls, setStarredPolls] = useState([]);
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
    socket = io(ENDPOINT);
    var temporary = [];
    if (window.localStorage.getItem('isAuthenticated') === false || null) {
      history.push('/');
    }
    const username = props.username;
    socket.emit('getPolls', username);
    socket.on('receivePolls', (data) => {
      //console.log(data.length);
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let highest = 0,
            sum = 0,
            mostvoted;
          data[i].options.map((x) => {
            sum += x.count;
            if (x.count >= highest) {
              highest = x.count;
              mostvoted = x.options;
            }
            return { highest, mostvoted };
          });
          var retrieve = new Date(data[i].created);
          const date =
            retrieve.getDate() +
            '/' +
            (retrieve.getMonth() + 1) +
            '/' +
            retrieve.getFullYear();
          const time = retrieve.getHours() + ':' + retrieve.getMinutes();
          const expire = new Date(data[i].expiration) - new Date();

          temporary = [
            ...temporary,
            {
              question: data[i].question,
              date: date,
              time: time,
              highest: highest,
              mostvoted: mostvoted,
              pollid: data[i].pollid,
              key: data[i].key,
              totalvotes: sum,
              expired: expire < 0 ? true : false,
              starred: data[i].starred,
            },
          ];
        }
        setPolls(temporary);
        props.setLoader(false);
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
        temporary = [];
      } else {
        props.setLoader(false);
      }
    });
  }, [props, history, ENDPOINT]);

  const deletePoll = (key, pollid) => {
    const data = { key: key, pollid: pollid };
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
  const importance = (starred, key) => {
    //console.log(starred, key);
    const data = { starred: !starred, key: key };
    axios
      .post('/importance', data)
      .then((res) => {
        //console.log(res.data.success);
      })
      .catch((err) => console.log(err));
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
      <div className="w-100" hidden={!(props.activate === 'dashboard')}>
        <Dashboard polls={polls} />
      </div>
      <div className="w-100" hidden={!(props.activate === 'settings')}>
        <SecurityQuestion username={props.username} />
        <ChangePassword username={props.username} />
        <DeleteAccount username={props.username} />
      </div>
      <div className="w-100" hidden={!(props.activate === 'feedback')}>
        <SendFeedback username={props.username} setToast={setToast} />
      </div>
      <div className="p-2" hidden={!(props.activate === 'mypolls')}>
        {polls.length === 0 ? <NoPolls /> : null}
        <table
          className="d-sm-block d-none"
          style={{ background: 'rgba(255,255,255,0.8)' }}
          hidden={!(polls.length > 0)}
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
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
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
            <tr hidden={!(starredPolls.length > 0)}>
              <td>
                <span className="style-tag">Watchlist</span>
              </td>
            </tr>
            {starredPolls.map((poll, index) => (
              <ListPolls
                poll={poll}
                index={index}
                deletePoll={deletePoll}
                key={index}
                importance={importance}
              />
            ))}
            <tr>
              <td>
                <span
                  className="style-tag"
                  hidden={!(unstarredPolls.length > 0)}
                >
                  All Polls
                </span>
              </td>
            </tr>
            {unstarredPolls.map((poll, index) => (
              <ListPolls
                poll={poll}
                index={index}
                deletePoll={deletePoll}
                key={index}
                importance={importance}
              />
            ))}
          </tbody>
        </table>
        <div className="d-sm-none d-block" hidden={!(polls.length > 0)}>
          <span className="style-tag" hidden={!(starredPolls.length > 0)}>
            Watchlist
          </span>
          {starredPolls.map((poll, index) => (
            <ListMiniPolls
              index={index}
              poll={poll}
              key={index}
              deletePoll={deletePoll}
              importance={importance}
            />
          ))}
          <span className="style-tag" hidden={!(unstarredPolls.length > 0)}>
            All Polls
          </span>
          {unstarredPolls.map((poll, index) => (
            <ListMiniPolls
              index={index}
              poll={poll}
              key={index}
              deletePoll={deletePoll}
              importance={importance}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default UserInfo;
