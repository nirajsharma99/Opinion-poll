import { useState } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Notification from '../notification';
import axios from 'axios';
const SecurityQuestion = (props) => {
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
  const [password, setPassword] = useState({ password: '', error: false });
  const [question, setQuestion] = useState(
    'When you were young, what did you want to be when you grew up?'
  );
  const [answer, setAnswer] = useState({ answer: '', error: false });
  const questions = [
    {
      value: 'When you were young, what did you want to be when you grew up?',
      label: 'When you were young, what did you want to be when you grew up?',
    },
    {
      value: 'Who was your childhood hero?',
      label: 'Who was your childhood hero?',
    },
    {
      value: 'Where was your best family vacation as a kid?',
      label: 'Where was your best family vacation as a kid?',
    },
    {
      value: 'When was the best day of your life?',
      label: 'When was the best day of your life?',
    },
  ];
  const handleChange = (event) => {
    setQuestion(event.target.value);
  };
  const handleSubmit = () => {
    const emptyAnswer = answer.answer.trim().length > 0;
    const emptyPassword = password.password.trim().length > 0;
    if (emptyAnswer) {
      if (emptyPassword) {
        const data = {
          username: props.userDetails.username,
          question: question,
          answer: answer.answer,
          password: password.password,
        };
        axios
          .post('/security-question', data)
          .then((res) => {
            if (res.data.success) {
              setToast({
                snackbaropen: true,
                msg: 'Success!',
                not: 'success',
              });
              setAnswer({ answer: '', error: false });
              setPassword({ password: '', error: false });
            } else {
              setPassword({ ...password, error: true });
            }
          })
          .catch((err) => console.log(err));
      } else {
        setPassword({ ...password, error: true });
      }
    } else {
      setAnswer({ ...answer, error: true });
    }
  };
  return (
    <div className="p-2 user-settings-bg">
      <Notification
        switcher={toast.snackbaropen}
        close={snackbarclose}
        message={toast.msg}
        nottype={toast.not}
      />
      <span className="font-weight-bold p-3" style={{ color: 'purple' }}>
        Security Question
      </span>
      <hr
        className="bg-secondary mt-2"
        style={{ opacity: '0.2', height: '1px' }}
      />
      <div className="d-flex flex-column w-100 align-items-center">
        <span className="text-secondary">
          <FontAwesomeIcon icon={faInfoCircle} />
          &nbsp; Note: It's important to set the security question, it will help
          you recover your password.
        </span>
        <TextField
          label="Question"
          select
          variant="outlined"
          value={question}
          onChange={handleChange}
          className="resp-width-50 mt-3"
        >
          {questions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          error={answer.error}
          helperText={answer.error ? 'Required!' : null}
          label="Your answer..."
          variant="filled"
          className="resp-width-50 my-3"
          value={answer.answer}
          onChange={(e) => setAnswer({ ...answer, answer: e.target.value })}
        />
        <TextField
          error={password.error}
          helperText={password.error ? 'Incorrect password!' : null}
          type="password"
          label="Enter Password"
          variant="filled"
          className="resp-width-50 mb-3"
          value={password.password}
          onChange={(e) => {
            setPassword({ ...password, password: e.target.value });
          }}
        />
        <button
          className="btn p-2 bg-info text-light w-50"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
const mapStatetoProps = (state) => {
  return {
    userDetails: state.login.userDetails,
  };
};

export default connect(mapStatetoProps, null)(SecurityQuestion);
