import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@material-ui/core';
import RadioButtonCheckedOutlinedIcon from '@material-ui/icons/RadioButtonCheckedOutlined';
import StarIcon from '@material-ui/icons/Star';
const ShowSearch = ({ poll, index, deletePoll, importance }) => {
  const history = useHistory();
  return (
    <tr key={index}>
      <td className="text-center p-2">
        <IconButton
          className={poll.starred ? 'text-warning' : 'text-secondary'}
          onClick={() => importance(poll.starred, poll.key)}
        >
          <StarIcon />
        </IconButton>
      </td>
      <td className="w-50 ">
        <button
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
          className="text-decoration-none border-0 bg-transparent btn"
        >
          <div className="text-light bg-info rounded-lg p-2 d-inline-block div-hover-effect">
            {poll.question}
          </div>
        </button>
      </td>
      <td className="text-dark text-center">
        {poll.date}
        <br />
        {poll.time}
      </td>
      <td className="text-center">
        <RadioButtonCheckedOutlinedIcon
          className={poll.expired ? 'text-danger' : 'text-success'}
        />
      </td>
      <td className="text-center">{poll.totalvotes}</td>
      <td className="text-center">
        {poll.totalvotes === 0 ? (
          <p className="text-secondary">'No votes!'</p>
        ) : (
          poll.mostvoted
        )}
        <p
          className="mx-auto p-1 bg-success text-light text-center rounded-lg"
          hidden={poll.totalvotes === 0}
          style={{ fontSize: 'xx-small', width: '40px' }}
        >
          {((poll.highest / poll.totalvotes) * 100).toFixed(0) + '%'}
        </p>
      </td>
      <td className="p-0 m-0 text-center">
        <button
          aria-label="Edit Poll?"
          onClick={() =>
            history.push({
              pathname: '/edit-poll',
              state: {
                pollid: poll.pollid,
                key: poll.key,
              },
            })
          }
          hidden={!(poll.totalvotes === 0)}
          className="outline-none rounded  text-warning border-0 bg-transparent h5 m-auto"
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </td>
      <td className="p-0 m-0 text-center">
        <button
          className="border-0 bg-transparent outline-none h5 m-auto"
          onClick={() => deletePoll(poll.key, poll.pollid)}
        >
          <FontAwesomeIcon icon={faTrash} className="text-danger" />
        </button>
      </td>
    </tr>
  );
};
export default ShowSearch;
