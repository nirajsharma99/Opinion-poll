import { useState } from 'react';
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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Notification from './notification';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

function SocialShare(props) {
  const [toast, setToast] = useState({
    snackbaropen: false,
    msg: '',
    not: '',
  });
  const snackbarclose = (event) => {
    setToast({
      snackbaropen: false,
    });
  };
  const handleClick = () => {
    setToast({
      snackbaropen: true,
      msg: 'Copied to Clipboard!',
      not: 'info',
    });
  };
  return (
    <div className="d-flex flex-row flex-md-column">
      <Notification
        switcher={toast.snackbaropen}
        close={snackbarclose}
        message={toast.msg}
        nottype={toast.not}
      />
      <CopyToClipboard text={props.url}>
        <button
          className="font-weight-bold w-100 mb-3 mr-2 py-2 rounded-lg text-center text-white border-0"
          style={{
            background: 'skyblue',
          }}
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faCopy} className="mx-3" />
          <span className="d-none d-md-inline-block">Copy Link</span>
        </button>
      </CopyToClipboard>
      <TwitterShareButton
        url={props.url}
        title={JSON.stringify(props.question)}
        via="opinion poll"
        className="bg-primary text-decoration-none font-weight-bold w-100 mb-3 mr-2 py-2 rounded-lg text-center text-white "
      >
        <FontAwesomeIcon className="mx-3" icon={faTwitter} />
        <span className="d-none d-md-inline-block">Share on Twitter</span>
      </TwitterShareButton>

      <WhatsappShareButton
        url={props.url}
        title={JSON.stringify(props.question)}
        className="bg-success text-decoration-none font-weight-bold w-100 mb-3 mr-2 py-2 rounded-lg text-center  text-white "
      >
        <FontAwesomeIcon className="mx-3" icon={faWhatsapp} />
        <span className="d-none d-md-inline-block">Share on Whatsapp</span>
      </WhatsappShareButton>

      <TelegramShareButton
        url={props.url}
        title={JSON.stringify(props.question)}
        className="bg-info text-decoration-none font-weight-bold w-100 mb-3 mr-2 py-2 rounded-lg text-center  text-white "
      >
        <FontAwesomeIcon className="mx-3" icon={faTelegramPlane} />
        <span className="d-none d-md-inline-block">Share on Telegram</span>
      </TelegramShareButton>

      <LinkedinShareButton
        url={props.url}
        title={JSON.stringify(props.question)}
        summary="Opinion poll is a poll app made using react.js. You have been invited to vote! "
        className="bg-primary text-decoration-none font-weight-bold w-100 mb-3 mr-0 py-2 rounded-lg text-center text-white "
      >
        <FontAwesomeIcon className="mx-3" icon={faLinkedin} />
        <span className="d-none d-md-inline-block">Share on LinkedIn</span>
      </LinkedinShareButton>
    </div>
  );
}
export default SocialShare;
