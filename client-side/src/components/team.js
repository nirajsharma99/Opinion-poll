import team1 from '../team/team1.jpg';
import team2 from '../team/team2.jpg';
import team3 from '../team/team3.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLinkedin,
  faTelegramPlane,
} from '@fortawesome/free-brands-svg-icons';
const Team = () => {
  return (
    <div className="d-flex flex-md-row flex-column App justify-content-around align-items-center w-75 m-auto">
      <div className="d-flex flex-column align-items-center px-3 py-5 col-lg-4 team-anim-1">
        <img
          src={team1}
          width="150px"
          height="150px"
          alt="niraj-profile-pic"
          style={{ borderRadius: '50%' }}
        />
        <span className="profile-name mt-3">Niraj Sharma</span>
        <span className="profile-desc mt-2">A web-dev enthusiast&#10084;</span>
        <div className="h4 d-flex flex-content-around mt-3">
          <a className="text-secondary p-2" href="https://t.me/bazoooka99">
            <FontAwesomeIcon icon={faTelegramPlane} />
          </a>
          <a
            className="text-secondary p-2"
            href="https://www.linkedin.com/in/niraj-sharma-40132b165"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center px-3 py-5 col-lg-4 team-anim-2">
        <img
          src={team2}
          width="150px"
          height="150px"
          alt="pratik-profile-pic"
          style={{ borderRadius: '50%' }}
        />
        <span className="profile-name mt-3">Pratik Sahoo</span>
        <span className="profile-desc mt-2">
          Hi, i'm an android app developer
        </span>
        <div className="h4 d-flex flex-content-around mt-3">
          <a className="text-secondary p-2" href="https://t.me/Iampratiksahoo">
            <FontAwesomeIcon icon={faTelegramPlane} />
          </a>
          <a
            className="text-secondary p-2"
            href="https://www.linkedin.com/in/pratik-sahoo-8821ab1b9"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center px-3 py-5 col-lg-4 team-anim-2">
        <img
          src={team3}
          width="150px"
          height="150px"
          alt="niraj-profile-pic"
          style={{ borderRadius: '50%' }}
        />
        <span className="profile-name mt-3">Aarushi Agarwal</span>
        <span className="profile-desc mt-2">Hi, i'm a content writer</span>
        <div className="h4 d-flex flex-content-around mt-3">
          <a className="text-secondary p-2" href="https://t.me/aarushi03">
            <FontAwesomeIcon icon={faTelegramPlane} />
          </a>
          <a
            className="text-secondary p-2"
            href="https://www.linkedin.com/in/aarushi-agarwal-0219601b5"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </div>
    </div>
  );
};
export default Team;
