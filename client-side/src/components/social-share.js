import {
  faLinkedin,
  faTelegramPlane,
  faTwitter,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
} from 'react-share';
function SocialShare(props) {
  return (
    <div className="d-flex flex-row flex-md-column">
      <TwitterShareButton
        url={props.url}
        title={JSON.stringify(props.question)}
        via="opinion poll"
        className="bg-primary text-decoration-none font-weight-bold w-100 mb-3 mr-2 py-2 rounded-lg text-center text-white "
      >
        <FontAwesomeIcon className="ml-3 mr-3" icon={faTwitter} />
        <span className="d-none d-md-inline-block">Share on Twitter</span>
      </TwitterShareButton>

      <WhatsappShareButton
        url={props.url}
        title={JSON.stringify(props.question)}
        separator=" "
        className="bg-success text-decoration-none font-weight-bold w-100 mb-3 mr-2 py-2 rounded-lg text-center  text-white "
      >
        <FontAwesomeIcon className="ml-3 mr-3" icon={faWhatsapp} />
        <span className="d-none d-md-inline-block">Share on Whatsapp</span>
      </WhatsappShareButton>

      <TelegramShareButton
        url={props.url}
        title={JSON.stringify(props.question)}
        className="bg-info text-decoration-none font-weight-bold w-100 mb-3 mr-2 py-2 rounded-lg text-center  text-white "
      >
        <FontAwesomeIcon className="ml-3 mr-3" icon={faTelegramPlane} />
        <span className="d-none d-md-inline-block">Share on Telegram</span>
      </TelegramShareButton>

      <LinkedinShareButton
        url={props.url}
        title={JSON.stringify(props.question)}
        summary="Opinion poll is a poll app made using react.js. You have been invited to vote! "
        className="bg-primary text-decoration-none font-weight-bold w-100 mb-3 mr-2 py-2 rounded-lg text-center  text-white "
      >
        <FontAwesomeIcon className="ml-3 mr-3" icon={faLinkedin} />
        <span className="d-none d-md-inline-block">Share on LinkedIn</span>
      </LinkedinShareButton>
    </div>
  );
}
export default SocialShare;
