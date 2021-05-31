import SubjectIcon from '@material-ui/icons/Subject';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import NotificationsOffOutlinedIcon from '@material-ui/icons/NotificationsOffOutlined';
const Dashboard = (props) => {
  var total = 0,
    inactive = 0;
  props.polls.map((poll) => {
    total += 1;
    if (poll.expired) {
      inactive += 1;
    }
    return total, inactive;
  });
  return (
    <div className="d-flex flex-md-row flex-column m-auto w-75">
      <div className="dashboard shadow">
        <div
          className="dashboard-icon"
          style={{ background: 'rgba(91, 192, 222, 0.3)' }}
        >
          <SubjectIcon style={{ fontSize: '2rem' }} className="text-info" />
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
            className="text-success"
          />
        </div>
        <span className="display-2">{total - inactive}</span>
        <span className="text-secondary mb-3">Active Polls</span>
      </div>
      <div className="dashboard shadow">
        <div
          className="dashboard-icon"
          style={{ background: 'rgba(240, 173, 78,0.2)' }}
        >
          <NotificationsOffOutlinedIcon
            style={{ fontSize: '2rem' }}
            className="text-warning"
          />
        </div>
        <span className="display-2">{inactive}</span>
        <span className="text-secondary mb-3">Inactive Polls</span>
      </div>
    </div>
  );
};
export default Dashboard;
