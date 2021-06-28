import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faBolt,
  faTrashAlt,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import short from 'short-uuid';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Notification from './notification';
import Header from './header';
import UserIcon from './user-icon';
import { Switch } from 'antd';
import '../../node_modules/antd/dist/antd.css';
import { connect } from 'react-redux';
import { LogoutAction } from '../store/actions/LogoutAction';

function MainContent(props) {
  const history = useHistory();
  const [openVote, setOpenVote] = useState(true);
  const [questions, setQuestion] = useState({
    id: short.generate(),
    question: '',
    error: false,
    expiration: '',
    expirationError: false,
  });
  const [inputFields, setInputFields] = useState([
    { id: short.generate(), options: '', error: false, count: 0 },
    { id: short.generate(), options: '', error: false, count: 0 },
  ]);
  const [toast, setToast] = useState({
    snackbaropen: false,
    msg: '',
    not: '',
    Transition: Slide,
  });
  const snackbarclose = (event) => {
    setToast({
      snackbaropen: false,
    });
  };
  const showError = (value, error) => value.trim().length === 0 && error;
  var temp = JSON.parse(localStorage.getItem('notify'));
  useEffect(() => {
    if (!props.userDetails.username) {
      history.push('/');
    }
  }, [props, history]);
  useEffect(() => {
    if (temp) {
      setToast({ snackbaropen: true, msg: temp.msg, not: temp.type });
      localStorage.removeItem('notify');
    }

    if (localStorage.getItem('isAuthenticated') === false) {
      console.log('working');
    }
  }, [temp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyQuestion = questions.question.trim().length > 0;
    const emptyOptions = inputFields.every((obj) => {
      return obj.options.length > 0;
    });
    const emptyExpiration = questions.expiration;
    if (!emptyQuestion) {
      setQuestion({ ...questions, error: true });
    }
    if (!emptyOptions) {
      setInputFields(
        [...inputFields].map((object) => {
          if (object.options === '') {
            return {
              ...object,
              error: true,
            };
          } else return object;
        })
      );
    } else {
      if (emptyExpiration) {
        const data = {
          question: questions,
          options: inputFields,
          username: props.userDetails.username,
          expiration: questions.expiration,
          openvote: openVote,
        };
        axios
          .post('/api', data)
          .then((response) => {
            handleClick(slideTransition);
            window.localStorage.setItem(
              'notify',
              JSON.stringify({
                type: 'success',
                msg: 'Poll created!',
              })
            );
            history.push({
              pathname: '/poll-admin',
              state: {
                pollid: response.data.pollid,
              },
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        setQuestion({ ...questions, expirationError: true });
      }
    }
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });
    setInputFields(newInputFields);
  };
  const handleQuestion = (id, event) => {
    setQuestion({ ...questions, id: id, question: event.target.value });
  };

  const handleAddfields = () => {
    setInputFields([
      ...inputFields,
      { id: short.generate(), options: '', error: false, count: 0 },
    ]);
    setToast({ snackbaropen: true, msg: 'Added another field!', not: 'info' });
  };
  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };
  const slideTransition = (props) => {
    return <Slide {...props} direction="down" />;
  };
  const handleClick = (Transition) => () => {
    setToast({
      snackbaropen: true,
      msg: 'Success, poll submitted!',
      not: 'success',
      Transition,
    });
  };

  return (
    <div className="position-relative">
      <Header />
      <UserIcon
        username={props.userDetails.username}
        logout={props.logoutAction}
      />

      <div className="ui-outer position-relative">
        <img
          src="4426.jpg"
          className="position-absolute d-md-block d-none"
          alt="opinion-background"
        />
        <div className="ui-container py-4 px-md-5">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mx-auto">
              <div className="d-flex justify-content-between flex-column flex-md-row align-items-baseline">
                <div>
                  <h3>Create Poll</h3>
                  <p
                    className="mt-4 mb-3 h5 text-secondary"
                    style={{ opacity: 0.7 }}
                  >
                    Complete the fields below to create a poll
                  </p>
                </div>
                <Link
                  to="/poll/6UXfyHc3ne7JuBBLHZbe3C"
                  className="text-decoration-none"
                >
                  <span
                    className=" align-self-end font-weight-normal"
                    style={{ fontSize: '1.2rem' }}
                  >
                    View a Demo Poll
                  </span>
                </Link>
              </div>
              <div className="mt-4">
                <div className="d-flex flex-column ">
                  <label className="mb-3 font-weight-bold content-text ">
                    Poll Question
                  </label>
                  <TextField
                    {...(showError(questions.question, questions.error) && {
                      ...{
                        error: questions.error,
                        helperText: 'Enter the question.',
                      },
                    })}
                    id={questions.id}
                    name="question"
                    multiline={true}
                    rows={3}
                    className=" w-100 py-4 bg-light rounded-lg px-3 outline-none  border border-gray "
                    placeholder="What's you favorite TV Show?"
                    value={questions.question}
                    onChange={(event) => handleQuestion(questions.id, event)}
                  />
                </div>
                <Notification
                  switcher={toast.snackbaropen}
                  close={snackbarclose}
                  message={toast.msg}
                  nottype={toast.not}
                />

                {inputFields.map((inputField, index) => (
                  <div
                    className="options mt-2 flex-column "
                    key={inputField.id}
                  >
                    <div className=" mb-3">
                      <div className="d-flex flex-column">
                        <label className="mb-3 content-text font-weight-bold">
                          Option {index + 1}
                        </label>
                        <div className="d-flex">
                          <TextField
                            {...(showError(
                              inputField.options,
                              inputField.error
                            ) && {
                              ...{
                                error: inputField.error,
                                helperText: 'Enter atleast 2 options',
                              },
                            })}
                            id={inputField.id}
                            name="options"
                            className=" py-3 rounded-lg px-2 bg-light w-100 focus-shadow  focus-outline-none  border "
                            placeholder={'Option' + (index + 1)}
                            value={inputField.options}
                            onChange={(event) =>
                              handleChangeInput(inputField.id, event)
                            }
                          />
                          {inputFields.length === 2 ? null : (
                            <button
                              onClick={() => handleRemoveFields(inputField.id)}
                              className="delete"
                            >
                              <FontAwesomeIcon
                                className=" text-danger"
                                icon={faTrashAlt}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddfields}
                  className="px-5 py-3 d-block bg-dark rounded-lg font-weight-bold  border-0 text-white "
                >
                  <span className="mr-3">
                    Add another option
                    <FontAwesomeIcon className="ml-2" icon={faPlus} />
                  </span>
                </button>
                <label className="mt-3 d-block content-text font-weight-bold">
                  Set Poll Expiration
                </label>
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  error={questions.expirationError}
                  helperText={questions.expirationError ? 'Required!' : null}
                  className="bg-light"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={questions.expiration}
                  onChange={(e) =>
                    setQuestion({ ...questions, expiration: e.target.value })
                  }
                />
                <div className="mt-3">
                  <div className="voting-style d-inline-flex align-items-center">
                    <label className="my-auto ml-md-3">Allow open voting</label>
                    <Switch
                      size="default"
                      onClick={() => setOpenVote(!openVote)}
                      checked={openVote}
                      className="mx-3"
                      style={{
                        backgroundColor: openVote ? 'purple' : 'gray',
                      }}
                    />
                  </div>
                  <br />
                  <span className="note-voting">
                    Note: Open voting will allow users to vote without signing
                    in
                  </span>
                </div>
              </div>
              <div className=" mt-5 pt-3 ">
                <button
                  type="submit"
                  /*onClick={handleSubmit}*/
                  className=" create-poll-btn rounded-lg"
                >
                  <FontAwesomeIcon className="mr-2" icon={faBolt} />
                  Create your poll
                </button>
              </div>
            </div>
          </form>
        </div>
        <Link to={{ pathname: '/team' }}>
          <p
            className="text-center font-weight-bold"
            style={{ fontSize: '1.3rem', color: 'purple' }}
          >
            Built with <FontAwesomeIcon icon={faHeart} /> by...
          </p>
        </Link>
      </div>
    </div>
  );
}
const mapStatetoProps = (state) => {
  return {
    userDetails: state.login.userDetails,
  };
};
const mapDispatchToProps = {
  logoutAction: LogoutAction,
};
export default connect(mapStatetoProps, mapDispatchToProps)(MainContent);
