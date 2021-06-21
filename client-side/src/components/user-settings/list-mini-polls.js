import { IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import HowToVoteIcon from '@material-ui/icons/HowToVote';

const ListMiniPolls = ({
  starredpolls,
  unstarredpolls,
  deletePoll,
  importance,
}) => {
  const history = useHistory();
  return (
    <>
      <tr hidden={!(starredpolls.length > 0)}>
        <td>
          <span className="style-tag font-weight-bold">Watchlist</span>
        </td>
      </tr>
      {starredpolls.length > 0
        ? starredpolls.map((poll, index) => (
            <div
              key={index}
              className="mt-3 mb-2 d-flex border position-relative"
            >
              <span
                className={poll.expired ? 'inactive-stats' : 'active-stats'}
              >
                {poll.expired ? 'Inactive' : 'Active'}
              </span>
              <div className="col-10 p-md-3 p-2">
                <button
                  onClick={() =>
                    history.push({
                      pathname: '/poll-admin',
                      state: {
                        pollid: poll.pollid,
                        key: poll.key,
                      },
                    })
                  }
                  className="text-dark font-weight-bold rounded-lg h4 border-0 bg-transparent"
                >
                  {poll.question}
                </button>
                <div className="d-block mt-3">
                  <p className="bg-light ui-1">
                    <span className="text-light bg-success ui-2">Created</span>
                    <span
                      className="text-secondary bg-light font-weight-bold"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {poll.time} || {poll.date}
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
                          {((poll.highest / poll.totalvotes) * 100).toFixed(0) +
                            '%'}
                        </span>
                        &nbsp;votes )
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-2 text-center d-flex flex-column py-2 mt-3">
                <IconButton
                  className={poll.starred ? 'text-warning' : 'text-secondary'}
                  onClick={() => importance(poll.starred, poll.key)}
                >
                  <StarIcon />
                </IconButton>
                {poll.totalvotes === 0 ? (
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
                    className="outline-none rounded  text-warning border-0 bg-transparent h5 mb-2"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                ) : null}
                <IconButton
                  className="border-0 bg-transparent outline-none h5 "
                  onClick={() => deletePoll(poll.key, poll.pollid)}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-danger" />
                </IconButton>
              </div>
            </div>
          ))
        : null}
      <tr hidden={!(unstarredpolls.length > 0)}>
        <td>
          <span className="style-tag font-weight-bold">All Polls</span>
        </td>
      </tr>
      {unstarredpolls.length > 0
        ? unstarredpolls.map((poll, index) => (
            <div
              key={index}
              className="mt-3 mb-2 d-flex border position-relative"
            >
              <span
                className={poll.expired ? 'inactive-stats' : 'active-stats'}
              >
                {poll.expired ? 'Inactive' : 'Active'}
              </span>
              <div className="col-10 p-md-3 p-2">
                <button
                  onClick={() =>
                    history.push({
                      pathname: '/poll-admin',
                      state: {
                        pollid: poll.pollid,
                        key: poll.key,
                      },
                    })
                  }
                  className="text-dark font-weight-bold rounded-lg h4 border-0 bg-transparent"
                >
                  {poll.question}
                </button>
                <div className="d-block mt-3">
                  <p className="bg-light ui-1">
                    <span className="text-light bg-success ui-2">Created</span>
                    <span
                      className="text-secondary bg-light font-weight-bold"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {poll.time} || {poll.date}
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
                          {((poll.highest / poll.totalvotes) * 100).toFixed(0) +
                            '%'}
                        </span>
                        &nbsp;votes )
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-2 text-center d-flex flex-column py-2 mt-3">
                <IconButton
                  className={poll.starred ? 'text-warning' : 'text-secondary'}
                  onClick={() => importance(poll.starred, poll.key)}
                >
                  <StarIcon />
                </IconButton>
                {poll.totalvotes === 0 ? (
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
                    className="outline-none rounded  text-warning border-0 bg-transparent h5 mb-2"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                ) : null}
                <IconButton
                  className="border-0 bg-transparent outline-none h5 "
                  onClick={() => deletePoll(poll.key, poll.pollid)}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-danger" />
                </IconButton>
              </div>
            </div>
          ))
        : null}
    </>
  );
};
export default ListMiniPolls;
