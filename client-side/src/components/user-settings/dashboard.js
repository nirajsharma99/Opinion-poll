import SubjectIcon from '@material-ui/icons/Subject';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import NotificationsOffOutlinedIcon from '@material-ui/icons/NotificationsOffOutlined';
import { useHistory } from 'react-router-dom';
import NoPolls from './no-polls/no-polls';

const Dashboard = (props) => {
  const history = useHistory();
  const top3 = props.polls ? props.polls.slice(0, 3) : null;
  var total = 0,
    inactive = 0;
  props.polls.map((poll) => {
    total += 1;
    if (poll.expired) {
      inactive += 1;
    }
    return { total, inactive };
  });
  return (
    <div>
      <div className="d-flex flex-md-row flex-column m-auto w-75">
        <div className="dashboard shadow">
          <div
            className="dashboard-icon"
            style={{ background: 'rgba(91, 192, 222, 0.3)' }}
          >
            <SubjectIcon
              style={{ fontSize: '2rem' }}
              className="text-info icon-anim"
            />
          </div>
          <span className="display-2">{total}</span>
          <span className="text-secondary mb-3">Polls created</span>
        </div>
        <div className="dashboard shadow">
          <div
            className="dashboard-icon"
            style={{ background: 'rgba(92, 184, 92,0.2)' }}
          >
            <NotificationsActiveOutlinedIcon
              style={{ fontSize: '2rem' }}
              className="text-success icon-anim"
            />
          </div>
          <span className="display-2">{total - inactive}</span>
          <span className="text-secondary mb-3">Active Polls</span>
        </div>
        <div className="dashboard shadow">
          <div
            className="dashboard-icon"
            style={{ background: 'rgba(217, 83, 79, 0.2)' }}
          >
            <NotificationsOffOutlinedIcon
              style={{ fontSize: '2rem' }}
              className="text-danger icon-anim"
            />
          </div>
          <span className="display-2">{inactive}</span>
          <span className="text-secondary mb-3">Inactive Polls</span>
        </div>
      </div>
      <div>
        {top3.length === 0 ? (
          <NoPolls />
        ) : (
          <>
            <span className="style-tag font-weight-bold">New Polls</span>
            <div className="d-flex flex-column">
              {top3.map((top, index) => (
                <div
                  key={index}
                  className="border position-relative resp-width-75 mx-auto my-3 rounded-lg shadow div-hover-effect"
                  style={{ background: 'rgba(255,255,255,0.6)' }}
                >
                  <span
                    className={top.expired ? 'inactive-stats' : 'active-stats'}
                  >
                    {top.expired ? 'Inactive' : 'Active'}
                  </span>
                  <button
                    className="text-dark font-weight-bold rounded-lg h3 border-0 bg-transparent w-100 px-3 pt-4 pb-2 "
                    onClick={() =>
                      history.push({
                        pathname: '/poll-admin',
                        state: {
                          pollid: top.pollid,
                          key: top.key,
                        },
                      })
                    }
                  >
                    {top.question}
                  </button>
                  <p className="bg-transparent ui-3 mt-0 d-inline-flex">
                    <span className="text-light bg-success ui-4">Created</span>
                    <span
                      className="text-secondary bg-transparent font-weight-bold p-0"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {top.time} || {top.date}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
