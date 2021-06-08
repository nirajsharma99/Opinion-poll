import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { Link, useHistory } from 'react-router-dom';
import Notification from './notification';
import PollDeleted from './user-settings/no-polls/polldeleted';
import Header from './header';
import io from 'socket.io-client';
import Report from './reportPoll';
import Loader from './loader/loader';
let socket;

function Poll({ location }) {
  const ENDPOINT = 'localhost:5000';
  const history = useHistory();
  const [expired, setExpired] = useState(false);
  const [report, setReport] = useState(false);
  const [loader, setLoader] = useState(true);
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
  const [verifier, setVerifier] = useState({ id: '', selected: '', show: 0 });
  const snackbarclose = (event) => {
    setToast({
      snackbaropen: false,
    });
  };
  var cache = JSON.parse(
    localStorage.getItem(
      question.toLowerCase().trim().slice(0, 2) + pollid.slice(0, 4)
    )
  );

  useEffect(() => {
    if (cache != null) {
      if (cache.id === pollid) {
        history.push('/poll-result?id=' + pollid);
      }
    }
  }, [pollid, history, cache]);

  useEffect(() => {
    socket = io(ENDPOINT);
    var x = queryString.parse(location.search);
    const id = x.id;
    setPollid(id);
    socket.emit('getPoll', id);
    socket.on('receivePoll', (poll) => {
      if (poll) {
        setLoader(false);
        if (poll.expired) {
          history.push('/poll-result?id=' + poll.pollid);
        } else {
          let medium = [];
          //const data = response.data;
          setOwner(poll.username);
          setQuestion(poll.question);
          setKey(poll.key);
          setExpired(poll.expired);
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
  }, [question, pollid, expired, history, location, ENDPOINT]);

  function settingResponse({ option }, index) {
    setResponse({
      id: option.id,
      options: option.options,
      count: option.count + 1,
      pollid: pollid,
      key: key,
      index: index,
    });
    setVerifier({ id: pollid, selected: option.options, show: 0 });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (response.options.length > 0) {
      e.preventDefault();
      setToast({
        snackbaropen: true,
        msg: 'Thankyou for your vote!, vote submitted!',
        not: 'success',
      });
      localStorage.setItem(
        question.toLowerCase().trim().slice(0, 2) + pollid.slice(0, 4),
        JSON.stringify(verifier)
      );
      axios
        .post('http://localhost:5000/submitresponse', response)
        .then(function (res) {
          console.log(res);
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
  };
  console.clear();
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
              <div className="flex flex-column w-75 w-sm-100 m-auto">
                <form>
                  {options.map((option, index) => (
                    <div
                      className="py-3 w-100 mb-4 shadow-lg hover-zoom px-2  rounded bg-white  radio-label"
                      key={option.id}
                    >
                      <div className="d-flex align-items-center">
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
                          className=" font-weight-bold  text-primary-dark d-inline-block h3"
                          style={{
                            wordWrap: 'break-word',
                            width: '93%',
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

                  <div className="mt-5 d-flex flex-column flex-md-row">
                    <div className="col-0 col-md-8 d-flex px-0 justify-content-center justify-content-md-start">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="focus-outline-none py-3 font-weight-bold focus-shadow w-50 bg-success border-0 text-white px-2 shadow-lg hover-shadow-lg rounded-lg"
                      >
                        Submit your vote
                      </button>
                    </div>
                    <div className="col-0 col-md-4 mt-4 px-0">
                      <Link to={'/poll-result/?id=' + pollid}>
                        <h5 className=" display-8 float-right text-secondary font-weight-normal">
                          View Results <FontAwesomeIcon icon={faChevronRight} />
                        </h5>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
              <div className="d-block" style={{ textAlign: 'right' }}>
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
export default Poll;
