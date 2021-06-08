import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadCry } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

const NoPolls = () => {
  const history = useHistory();
  return (
    <div className="w-100 h-25 p-5 d-flex flex-column align-items-center justify-content-center">
      <span className="display-2 text-purple">
        No polls yet...
        <FontAwesomeIcon icon={faSadCry} />
      </span>
      <button
        className="text-light bg-purple border-0 px-3 py-2 mt-3"
        style={{ borderRadius: '20px' }}
        onClick={() => history.push('/create-poll')}
      >
        Create one ?
      </button>
    </div>
  );
};

export default NoPolls;
