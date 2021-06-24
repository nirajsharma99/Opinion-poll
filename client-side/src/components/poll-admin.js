import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faPencilAlt,
  faPollH,
  faChartPie,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ErrorOutline } from '@material-ui/icons/';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Switch } from 'antd';
import '../../node_modules/antd/dist/antd.css';
import axios from 'axios';
import Chart from 'react-apexcharts';
import Notification from './notification';
import Loader from './loader/loader';
import randomColor from 'randomcolor';
import SocialShare from './social-share';
import Header from './header';
import UserIcon from './user-icon';
import { connect } from 'react-redux';
import { LogoutAction } from '../store/actions/LogoutAction';
import io from 'socket.io-client';
let socket;

const PollAdmin = (props) => {
  const ENDPOINT = 'https://opinion-poll-app.herokuapp.com/';
  const [toggle, setToggle] = useState(false);
  const [voted, setVoted] = useState(false);
  const [index, setIndex] = useState(2);
  const [username, setUsername] = useState(
    props.userDetails ? props.userDetails.username : null
  );
  const [loader, setLoader] = useState(true);
  const [chart, setChart] = useState({
    options: {
      chart: {
        width: '100%',
        type: 'pie',
      },
      legend: { position: 'bottom' },
      labels: [],
      responsive: [
        {
          breakpoint: '900',
          chart: { width: '100%' },
          options: { legend: { position: 'bottom' } },
        },
      ],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
          },
        },
      },
    },
    series: [],
    labels: [],
  });
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [key, setKey] = useState('');
  const [pollid, setPollid] = useState('');
  const [expired, setExpired] = useState({ expired: false, expiration: '' });
  const [showQR, setShowQR] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  let totalvotes = 0;
  options.map((x) => {
    return (totalvotes += x.count);
  });
  const history = useHistory();
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
    let series = [],
      labels = [];
    options.map((option) => {
      series.push(option.count);
      labels.push(option.options);
      return { series, labels };
    });
    setChart({
      options: { ...options, labels: labels },
      series: series,
      labels: labels,
    });
  }, [options]);
  useEffect(() => {
    if (!props.userDetails.username) {
      history.push('/');
    }
  }, [props, history]);

  var temp = JSON.parse(localStorage.getItem('notify'));
  useEffect(() => {
    if (temp) {
      setToast({ snackbaropen: true, msg: temp.msg, not: temp.type });
      localStorage.removeItem('notify');
    }
  }, [temp]);

  useEffect(() => {
    socket = io(ENDPOINT);
    var x = props.location.state;
    const id = x.pollid;
    setPollid(x.pollid);
    socket.emit('getPoll', { id: id, username: username });
    socket.on('receivePoll', (poll) => {
      if (poll) {
        let medium = [];
        const numbersToAddZeroTo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        setQuestion(poll.question);
        setVoted(poll.voted);
        setIndex(poll.index);
        setKey(poll.key);
        var retrieve = new Date(poll.expiration);
        const date =
          retrieve.getDate() +
          '/' +
          (retrieve.getMonth() + 1) +
          '/' +
          retrieve.getFullYear();
        const time =
          retrieve.getHours() +
          ':' +
          (numbersToAddZeroTo.includes(retrieve.getMinutes())
            ? `0${retrieve.getMinutes()}`
            : retrieve.getMinutes());
        setExpired({
          expired: poll.expired,
          expiration: date + ' ' + time,
        });
        poll.options.map((option) => {
          option.color = randomColor();
          medium.push(option);
          return medium;
        });
        setOptions(medium);
        setLoader(false);
      } else {
        setLoader(false);
      }
    });
  }, [props, ENDPOINT, username]);
  const deletePoll = () => {
    localStorage.removeItem(
      question.toLowerCase().trim().slice(0, 2) + pollid.slice(0, 4)
    );
    const data = { key: key };
    axios
      .post('/deletepoll', data)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem(
            'notify',
            JSON.stringify({ type: 'success', msg: 'Poll deleted!' })
          );
          history.push({
            pathname: '/useraccount',
            state: { activate: 'dashboard' },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const ShowDelete = () => (
    <div
      className="w-100 justify-content-center d-flex align-items-center position-fixed fixed-top"
      style={{
        height: '100%',
        zIndex: 1,
        backgroundColor: 'rgba(135,206,235 ,0.7)',
      }}
    >
      <div className="d-flex flex-column align-items-center bg-white rounded-lg">
        <div className="w-100 d-flex flex-column px-4 pt-4">
          <h5>Delete Poll</h5>
          <span className="text-secondary" style={{fontSize:"0.9rem",fontWeight:"600"}}>
            Are you sure you want to delete the poll?
          </span>
          <div className="px-3 py-3 d-flex justify-content-end">
            <button
              className="border-light rounded-lg shadow-lg px-4 py-2 "
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </button>
            <button
              className="bg-danger border-0 rounded-lg shadow-lg text-light px-4 py-2 ml-3"
              onClick={deletePoll}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  const QR = () => (
    <div
      className="w-100 justify-content-center d-flex align-items-center position-fixed fixed-top"
      onClick={() => {
        setShowQR(false);
      }}
      style={{
        height: '100%',
        zIndex: 1,
        backgroundColor: 'rgba(135,206,235 ,0.7)',
      }}
    >
      <div className="d-flex flex-column align-items-center bg-white">
        <span className="font-weight-bold ">Scan QR Code</span>
        <QRCode
          value={`https://opinion-poll-app.herokuapp.com/poll/${pollid}`}
          size={290}
          level={'H'}
          includeMargin={true}
        />
      </div>
    </div>
  );

  const ShowButton = () => (
    <button
      className={
        'text-decoration-none h5 font-weight-bold mb-5 px-2 py-3 rounded-lg text-center text-white border-0' +
        (expired.expired ? ' bg-secondary' : ' bg-success')
      }
      onClick={() => history.push('/poll/' + pollid)}
      disabled={expired.expired}
    >
      Submit your vote
    </button>
  );
  const ShowSelection = () => (
    <span
      className="bg-info w-100 text-decoration-none font-weight-bold mb-5 px-2 py-3 rounded-lg text-center text-white "
      style={{
        wordWrap: 'break-word',
      }}
    >
      You voted for {options.length > 0 ? options[index].options : null}
    </span>
  );
  const handleClick = () => {
    setToast({
      snackbaropen: true,
      msg: 'Copied to Clipboard!',
      not: 'info',
    });
  };

  return (
    <div>
      {loader ? <Loader /> : null}
      <Header />
      <UserIcon
        username={props.userDetails.username}
        logout={props.logoutAction}
      />
      <div className="ui-outer position-relative">
        <img
          src="4426.jpg"
          className="position-absolute d-md-block d-none"
          alt="opinion-background"
        />
        <div className="ui-container py-5">
          <div className="d-flex flex-column  flex-md-row justify-content-between align-items-md-center">
            <div className="d-flex flex-column mb-4 mb-md-0">
              <h2 className="heading-2">Manage your poll</h2>
              <p className="mt-4 text-secondary font-medium">
                You can only edit your poll if it has no votes!
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-around justify-content-md-center">
              {totalvotes > 0 ? null : (
                <button
                  aria-label="Edit Poll?"
                  onClick={() =>
                    history.push({
                      pathname: '/edit-poll',
                      state: {
                        pollid: pollid,
                        key: key,
                      },
                    })
                  }
                  className="text-primary-dark p-2 outline-none rounded hover-shadow text-warning border-0 bg-transparent"
                  style={{ fontSize: '1.5rem' }}
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              )}

              <button
                aria-label={'Delete Poll?'}
                role="alert"
                className="text-primary-dark p-2 outline-none rounded hover-shadow text-danger border-0 bg-transparent"
                style={{ fontSize: '1.5rem' }}
                onClick={() => setShowDelete(true)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
          <div className="mb-5 mb-md-5 pb-md-0 my-4">
            <h2
              className=" mb-5 heading resp-width-75 ml-auto mr-auto"
              style={{
                wordWrap: 'break-word',
              }}
            >
              {question}
            </h2>

            <div className="d-flex w-100 flex-md-row flex-column ">
              <div className="d-flex px-0 w-100 col-12 col-md-8 flex-column">
                <div className="d-block text-center p-3">
                  <div className=" m-auto switch-box">
                    <FontAwesomeIcon
                      icon={faPollH}
                      size="2x"
                      className="mr-2"
                      style={{ color: toggle ? 'purple' : 'white' }}
                    />
                    <Switch
                      size="default"
                      onClick={() => setToggle(!toggle)}
                      checked={toggle}
                      style={{
                        backgroundColor: 'purple',
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faChartPie}
                      size="2x"
                      className="ml-2"
                      style={{ color: toggle ? 'white' : 'purple' }}
                    />
                  </div>
                </div>
                <div className="position-relative">
                  <div hidden={toggle}>
                    {options.map((x, index) => (
                      <div
                        className="bg-white p-4 mb-3 rounded-lg position-relative scale1"
                        key={index}
                        style={{
                          border: x.count > 0 ? `3px solid ${x.color}` : null,
                          boxShadow:
                            x.count > 0
                              ? `0 7px 14px 0 ${x.color}`
                              : '0 7px 14px 0 rgba(0,0,0,0.7)',
                        }}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <div className="d-flex align-items-center">
                            <h2
                              className="options-text font-weight-bold text-primary-dark"
                              style={{
                                wordWrap: 'break-word',
                              }}
                            >
                              {x.options}
                            </h2>
                          </div>
                          <div className="d-lg-block d-none">
                            <span
                              className="px-2 text-primary-dark h4 shadow"
                              style={{
                                border: '1px solid rgba(0,0,0,0.3)',
                                borderRadius: '20px',
                              }}
                            >
                              {totalvotes === 0
                                ? 0
                                : ((x.count / totalvotes) * 100).toFixed(0)}
                              %
                            </span>
                          </div>
                          <div className="d-lg-none">
                            <span
                              className="px-2 text-primary-dark h4 shadow position-absolute"
                              style={{
                                top: '-15px',
                                right: '-15px',
                                background: 'white',
                                border:
                                  x.count > 0
                                    ? `3px solid ${x.color}`
                                    : `1px solid rgba(0,0,0,0.3)`,
                                borderRadius: '20px',
                              }}
                            >
                              {totalvotes === 0
                                ? 0
                                : ((x.count / totalvotes) * 100).toFixed(0)}
                              %
                            </span>
                          </div>
                        </div>
                        <div className="w-100 rounded-lg ">
                          <div
                            className="rounded-lg d-block mt-3"
                            style={{
                              width: `${
                                totalvotes === 0
                                  ? 0
                                  : (x.count / totalvotes) * 100
                              }%`,
                              height: '0.5rem',
                              backgroundColor: x.color,
                            }}
                          ></div>
                        </div>
                        <p
                          className="mt-3 mb-0 font-weight-bold h6"
                          style={{ color: x.count > 0 ? x.color : 'gray' }}
                        >
                          {x.count} Votes
                        </p>
                      </div>
                    ))}
                  </div>
                  <div hidden={!toggle}>
                    <Chart
                      options={chart.options}
                      series={chart.series}
                      labels={chart.labels}
                      type="pie"
                      width="100%"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column w-100 col-12 col-md-4 mb-0 rounded-lg ">
                <span
                  className="text-center mx-auto px-2 py-1 font-weight-bold mb-2"
                  style={{
                    color: expired.expired ? '#ff4444' : '#33b5e5',
                    borderRadius: '20px',
                    background: expired.expired
                      ? 'rgba(255, 68, 68, 0.2)'
                      : 'rgba(51, 181, 229, 0.2)',
                  }}
                >
                  <ErrorOutline fontSize="small" className="mr-2" />
                  {expired.expired
                    ? 'Sorry, the poll has expired!!'
                    : `Expires at ${expired.expiration}`}
                </span>
                <Notification
                  switcher={toast.snackbaropen}
                  close={snackbarclose}
                  message={toast.msg}
                  nottype={toast.not}
                />
                {voted ? <ShowSelection /> : <ShowButton />}
                <div className="w-100 bg-white d-flex flex-column border-t border-gray-300 border-top-0 rounded-lg self-start px-3 py-3 ">
                  <div className="d-flex flex-column justify-content-between">
                    <div className="">
                      <p className="font-weight-bold h5 text-secondary text-left mb-0 text-sm lg:text-base">
                        Total Votes
                      </p>
                      <h1 className=" font-weight-bold text-primary-dark">
                        {totalvotes}
                      </h1>
                    </div>
                    <div className="w-100 d-flex mb-3">
                      <CopyToClipboard
                        text={
                          'https://opinion-poll-app.herokuapp.com/poll/' +
                          pollid
                        }
                      >
                        <button
                          className="w-100 font-weight-bold px-0 py-1 mr-2 btn text-light"
                          style={{
                            borderRadius: '20px',
                            background: 'rgba(128,0,128,0.7)',
                          }}
                          onClick={handleClick}
                        >
                          <FontAwesomeIcon icon={faCopy} className="mr-2" />
                          Poll
                        </button>
                      </CopyToClipboard>
                      <CopyToClipboard
                        text={
                          'https://opinion-poll-app.herokuapp.com/poll-result/' +
                          pollid
                        }
                      >
                        <button
                          className="w-100 font-weight-bold px-0 py-1 btn text-light"
                          style={{
                            borderRadius: '20px',
                            background: 'rgba(128,0,128,0.7)',
                          }}
                          onClick={handleClick}
                        >
                          <FontAwesomeIcon icon={faCopy} className="mr-2" />
                          Poll Result
                        </button>
                      </CopyToClipboard>
                    </div>
                    <div className="d-flex flex-row flex-md-column justify-content-center ">
                      <p className="font-weight-bold d-none d-md-inline-block mt-2 mb-4 text-primary-secondary text-left">
                        Share
                      </p>

                      <button
                        className="bg-warning w-100 font-weight-bold mb-3 px-0 py-2 rounded-lg text-center border-0 text-white mr-3 "
                        onClick={() => {
                          setShowQR(true);
                        }}
                      >
                        <FontAwesomeIcon
                          className="ml-3 mr-3"
                          icon={faQrcode}
                        />
                        <span className="d-none d-md-inline-block ">
                          Share via QRcode
                        </span>
                      </button>
                      <SocialShare
                        url={
                          'https://opinion-poll-app.herokuapp.com/poll/' +
                          pollid
                        }
                        question={question}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showDelete ? <ShowDelete /> : null}
        {showQR ? <QR /> : null}
      </div>
      <Link to={{ pathname: '/team' }}>
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
const mapDispatchToProps = {
  logoutAction: LogoutAction,
};
export default connect(mapStatetoProps, mapDispatchToProps)(PollAdmin);
