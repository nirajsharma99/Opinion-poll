import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadCry } from '@fortawesome/free-solid-svg-icons';
const PollDeleted = () => {
  return (
    <div className="w-100 h-25 p-5 d-flex flex-column align-items-center justify-content-center">
      <span className="display-2 text-purple">
        Oops, the poll has been deleted...
        <FontAwesomeIcon icon={faSadCry} />
      </span>
    </div>
  );
};
export default PollDeleted;
