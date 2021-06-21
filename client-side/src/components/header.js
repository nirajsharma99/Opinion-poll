import '../App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

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
          <p className="mb-0" style={{ fontSize: '1rem', fontWeight: '600' }}>
            Create anonymous polls for free
          </p>
        </div>
      </div>
    </header>
  );
}
export default Header;
