import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Header from './header';
function DemoPoll() {
  return (
    <div>
      <Header />
      <div className="ui-container py-5 px-5">
        <div>
          <h2 className=" mb-5 heading">What kind of movies do you like?</h2>
          <div className="flex flex-column w-75 mr-auto ml-auto">
            <div className="py-3 w-100 mb-4 shadow-lg hover-zoom px-2  rounded bg-white">
              <div className="flex align-items-center">
                <input
                  type="radio"
                  id="option1"
                  name="option"
                  value="adventure"
                  className="d-inline-block ml-3 mr-3"
                />
                <h4 className=" font-weight-bold text-primary-dark d-inline-block">
                  Adventure
                </h4>
              </div>
            </div>
            <div className="py-3 w-100 mb-4 shadow-lg hover-zoom px-2  rounded bg-white">
              <div className="flex align-items-center ">
                <input
                  type="radio"
                  id="option2"
                  name="option"
                  value="scifi"
                  className="d-inline-block ml-3 mr-3"
                />
                <h4 className=" font-weight-bold text-primary-dark d-inline-block">
                  Sci-Fi
                </h4>
              </div>
            </div>
            <div className="py-3 w-100 mb-4 shadow-lg hover-zoom px-2  rounded bg-white">
              <div className="flex align-items-center ">
                <input
                  type="radio"
                  id="option3"
                  name="option"
                  value="thriller"
                  className="d-inline-block ml-3 mr-3"
                />
                <h4 className=" font-weight-bold text-primary-dark d-inline-block">
                  Thriller
                </h4>
              </div>
            </div>
            <div className="py-3 w-100 mb-4 shadow-lg hover-zoom px-2  rounded bg-white">
              <div className="flex align-items-center ">
                <input
                  type="radio"
                  id="option4"
                  name="option"
                  value="scary"
                  className="d-inline-block ml-3 mr-3"
                />
                <h4 className=" font-weight-bold text-primary-dark d-inline-block">
                  Scary
                </h4>
              </div>
            </div>
            <div className="mt-5  ">
              <button className="focus-outline-none d-inline-block py-3 font-weight-bold focus-shadow  text-lg w-25 w-md-auto bg-success text-white px-2 shadow-lg hover-shadow-lg to-green-500 rounded-lg">
                Submit your vote
              </button>
              <div className="mb-4 d-inline-block"></div>
              <a className="" href="/">
                <h5 className=" mr-2 d-inline-block display-8 float-right text-secondary font-weight-normal">
                  View Results <FontAwesomeIcon icon={faChevronRight} />
                </h5>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DemoPoll;
