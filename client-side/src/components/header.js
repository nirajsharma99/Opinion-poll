import '../App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrayingHands } from '@fortawesome/free-solid-svg-icons';
function Header() {
  return (
    <header className="App-header">
      <div className="header">
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex align-items-baseline">
            <a className="text-dark font-3" href="/">
              Opinion Poll
            </a>
          </div>
          <p className="mt-2 mb-0 font-italic" style={{ fontSize: '1.125rem' }}>
            Create anonymous polls for free
          </p>
        </div>
      </div>
    </header>
  );
}
export default Header;
