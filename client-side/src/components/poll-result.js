import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode,
  faPollH,
  faChartPie,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { ErrorOutline } from '@material-ui/icons/';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import queryString from 'query-string';
import Notification from './notification';
import PollDeleted from './user-settings/no-polls/polldeleted';
import Loader from './loader/loader';
import randomColor from 'randomcolor';
import SocialShare from './social-share';
import Report from './reportPoll';
import Header from './header';
import { Switch } from 'antd';
import '../../node_modules/antd/dist/antd.css';
import Chart from 'react-apexcharts';
import io from 'socket.io-client';
let socket;

function PollResult({ location }) {
  const ENDPOINT = 'https://opinion-poll-app.herokuapp.com';
  //console.clear();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(true);
  const [report, setReport] = useState(false);
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
  const [owner, setOwner] = useState('');
  const [pollid, setPollid] = useState('');
  const [expired, setExpired] = useState({ expired: false, expiration: '' });
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [showQR, setShowQR] = useState(false);
  let totalvotes = 0;
  options.map((x) => {
    return (totalvotes += x.count);
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
  var cache = JSON.parse(
    localStorage.getItem(
      question.toLowerCase().trim().slice(0, 2) + pollid.slice(0, 4)
    )
  );
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
    if (cache != null && cache.id === pollid && cache.show === 0) {
      setToast({
        snackbaropen: true,
        msg: 'Thankyou for voting!',
        not: 'success',
      });
      localStorage.setItem(
        question.toLowerCase().trim().slice(0, 2) + pollid.slice(0, 4),
        JSON.stringify({ id: cache.id, selected: cache.selected, show: 1 })
      );
    }
  }, [question, pollid, cache]);

  useEffect(() => {
    socket = io(ENDPOINT);
    var x = queryString.parse(location.search);
    const id = x.id;
    setPollid(id);
    socket.emit('getPoll', id);
    socket.on('receivePoll', (poll) => {
      if (poll) {
        let medium = [];
        const numbersToAddZeroTo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        setQuestion(poll.question);
        setOwner(poll.username);
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
  }, [ENDPOINT, location]);

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
          value={`https://opinion-poll-app.herokuapp.com/poll/?id=${pollid}`}
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
        'text-decoration-none h6 font-weight-bold mb-5 px-2 py-3 rounded-lg text-center text-white border-0 btn' +
        (expired.expired ? ' bg-secondary' : ' bg-success')
      }
      onClick={() => history.push('/poll/?id=' + pollid)}
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
      You voted for {cache.selected}
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
      {report ? (
        <Report
          setReport={setReport}
          pollid={pollid}
          owner={owner}
          setToast={setToast}
        />
      ) : null}
      <Header />
      {options.length > 0 ? null : <PollDeleted />}
      <div className="ui-outer position-relative">
        <img
          src="4426.jpg"
          className="position-absolute d-md-block d-none"
          alt="opinion-background"
        />
        <div
          className="ui-container py-5 position-relative"
          hidden={!(options.length > 0)}
        >
          <div className="mb-5 mb-md-5 pb-md-0 my-4 ">
            <h2
              className=" mb-5 heading w-100"
              style={{
                wordWrap: 'break-word',
              }}
            >
              {question}
            </h2>
            <div className="d-flex flex-column flex-md-row">
              <div className="d-flex w-100 col-12 col-md-8 flex-column">
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
                <div className=" position-relative">
                  <div hidden={toggle}>
                    {options.map((x) => (
                      <div
                        className="py-0 bg-white px-3 mb-3 rounded-lg position-relative scale1"
                        key={x.id}
                        style={{
                          border: x.count > 0 ? `3px solid ${x.color}` : null,
                          boxShadow:
                            x.count > 0
                              ? `0 7px 14px 0 ${x.color}`
                              : '0 5px 14px 0 rgba(0,0,0,0.7)',
                        }}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <div
                            className="d-flex align-items-center"
                            style={{ width: '88%' }}
                          >
                            <h2
                              className=" font-weight-bold text-primary-dark"
                              style={{
                                wordWrap: 'break-word',
                                width: '80%',
                              }}
                            >
                              {x.options}
                            </h2>
                          </div>
                          <div className="mt-2">
                            <span
                              className="px-2 text-primary-dark h5 shadow"
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
                              backgroundColor: `${x.color}`,
                            }}
                          >
                            &nbsp;
                          </div>
                        </div>
                        <p className="mt-3 text-green">{x.count} Votes</p>
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
                  className="text-center w-75 mx-auto py-1 font-weight-bold mb-2"
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
                {cache != null ? (
                  cache.id === pollid ? (
                    <ShowSelection />
                  ) : (
                    <ShowButton />
                  )
                ) : (
                  <ShowButton />
                )}
                <div className="w-100 bg-white d-flex flex-column border-t border-gray-300 border-top-0 rounded-lg self-start px-3 py-3 ">
                  <div className="d-flex flex-column justify-content-between">
                    <div className="">
                      <p className="font-weight-normal h5 text-secondary text-left mb-0 text-sm lg:text-base">
                        Total Votes
                      </p>
                      <h1 className="font-weight-bold text-primary-dark">
                        {totalvotes}
                      </h1>
                    </div>
                    <div className="w-100 d-flex mb-3">
                      <CopyToClipboard
                        text={
                          'https://opinion-poll-app.herokuapp.com/poll?id=' +
                          pollid
                        }
                      >
                        <button
                          className="w-100 px-0 py-1 mr-2 btn text-light"
                          style={{
                            borderRadius: '20px',
                            background: 'rgba(128,0,128,0.7)',
                          }}
                          onClick={handleClick}
                          disabled={expired.expired}
                        >
                          <FontAwesomeIcon icon={faCopy} className="mr-2" />
                          Poll
                        </button>
                      </CopyToClipboard>
                      <CopyToClipboard
                        text={
                          'https://opinion-poll-app.herokuapp.com/poll-result?id=' +
                          pollid
                        }
                      >
                        <button
                          className="w-100 px-0 py-1 btn text-light"
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
                    <div className="d-flex flex-row flex-md-column">
                      <p className="font-weight-bold d-none d-md-inline-block mt-2 mb-4 text-primary-secondary text-left">
                        Share
                      </p>
                      <button
                        className="bg-warning font-weight-bold w-100 mb-3 px-0 py-2 rounded-lg text-center border-0 text-white mr-3 "
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
                          'https://opinion-poll-app.herokuapp.com/poll/?id=' +
                          pollid
                        }
                        question={question}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button
                    className="w-50 mt-3 font-weight-bold px-2 py-1 rounded-lg border bg-secondary text-light"
                    onClick={() => setReport(true)}
                  >
                    Report Poll
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
}
export default PollResult;
