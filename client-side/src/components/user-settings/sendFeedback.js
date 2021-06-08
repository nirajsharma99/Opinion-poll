import axios from 'axios';
import { useState } from 'react';

const SendFeedback = (props) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const sendFeedback = () => {
    const data = {
      username: props.username,
      subject: subject,
      message: message,
    };
    axios
      .post('/sendFeedback', data)
      .then((res) => {
        if (res.data.success) {
          props.setToast({
            snackbaropen: true,
            msg: 'Feedback sent!',
            not: 'success',
          });
          setSubject('');
          setMessage('');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="d-flex flex-column w-100 align-items-center">
      <input
        type="textarea"
        placeholder="Subject"
        className="feedback-subj mb-2 mt-5 bg-transparent px-2"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
        }}
      />
      <textarea
        rows="4"
        type="textarea"
        placeholder="Enter your feedback here.."
        className="feedback-msg bg-transparent px-2"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button
        className="p-2 mt-3 mb-5 feedback-btn"
        onClick={sendFeedback}
        disabled={!(subject || message)}
      >
        Submit
      </button>
    </div>
  );
};
export default SendFeedback;
