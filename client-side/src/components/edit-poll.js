import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faBookmark,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import short from 'short-uuid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import UserIcon from './user-icon';
import TextField from '@material-ui/core/TextField';
import Header from './header';
import { connect } from 'react-redux';
import io from 'socket.io-client';
let socket;

function EditPoll(props) {
  const ENDPOINT = 'localhost:5000';
  const history = useHistory();
  const [pollid, setPollid] = useState('');
  const [key, setKey] = useState('');
  const [questions, setQuestion] = useState({
    question: '',
    error: false,
    expiration: '',
    expirationError: false,
  });
  const [inputFields, setInputFields] = useState([]);
  const [toast, setToast] = useState({
    snackbaropen: false,
    snackbar2open: false,
  });
  useEffect(() => {
    if (!props.userDetails.username) {
      history.push('/');
    }
  }, [props, history]);
  useEffect(() => {
    var totalvotes;
    socket = io(ENDPOINT);
    var x = props.location.state;
    const id = x.pollid;
    if (totalvotes > 0) {
      history.push({
        pathname: '/poll-admin',
        state: { pollid: x.pollid, key: x.key },
      });
    }
    setPollid(x.pollid);
    setKey(x.key);
    socket.emit('getPollToEdit', id);
    socket.on('receivePollToEdit', (poll) => {
      let medium = [];
      setQuestion({
        ...questions,
        question: poll.question,
        expiration: poll.expiration,
      });
      poll.options.map((option) => {
        totalvotes += option.count;
        medium.push(option);
        return medium;
      });
      setInputFields(medium);
    });
  }, [props, setQuestion, history, ENDPOINT]);

  const snackbarclose = (event) => {
    setToast({
      snackbaropen: false,
      snackbar2open: false,
    });
  };
  const showError = (value, error) => value.trim().length === 0 && error;

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
          question: questions.question,
          expiration: questions.expiration,
          options: inputFields,
          pollid: pollid,
          key: key,
        };
        axios
          .post('http://localhost:5000/editpoll', data)
          .then(function (response) {
            if (response.data.success) {
              localStorage.setItem(
                'notify',
                JSON.stringify({
                  type: 'success',
                  msg: 'Changes saved!',
                })
              );
              history.push({
                pathname: '/poll-admin',
                state: {
                  pollid: pollid,
                  key: key,
                },
              });
            }
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

  const handleAddfields = () => {
    setInputFields([
      ...inputFields,
      { id: short.generate(), options: '', error: false, count: 0 },
    ]);
    setToast({ snackbar2open: true });
  };
  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  return (
    <div>
      <Header />
      <UserIcon
        username={props.userDetails.username}
        logout={props.logoutAction}
      />
      <div className="ui-outer">
        <div className="ui-container py-5 px-5">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mx-auto">
              <div className="d-flex justify-content-between flex-row align-items-baseline">
                <div>
                  <h3>Edit Poll</h3>
                  <p className="mt-4 mb-0 text-large text-secondary font-medium">
                    Edit below fields as you need.
                  </p>
                </div>
                <Link
                  to={{ pathname: '/poll-admin', state: { pollid: pollid } }}
                >
                  <span className="text-light bg-danger align-self-end font-weight-bold rounded-lg px-4 py-2">
                    Cancel
                  </span>
                </Link>
              </div>
              <div className="mt-4">
                <div className="flex flex-column question">
                  <label className="mb-3 w-100 font-weight-bold content-text">
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
                    className="textareastyle w-100 py-4 rounded-lg px-3 outline-none  border border-gray "
                    placeholder="What's you favorite TV Show?"
                    defaultValue={questions.question}
                    onChange={(e) =>
                      setQuestion({ ...questions, question: e.target.value })
                    }
                  />
                </div>
                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  open={toast.snackbaropen}
                  onClose={snackbarclose}
                  autoHideDuration={2000}
                  action={[
                    <IconButton
                      arial-label="Close"
                      color="inherit"
                      onClick={snackbarclose}
                    >
                      x
                    </IconButton>,
                  ]}
                >
                  <MuiAlert onClose={snackbarclose} severity="success">
                    Success, poll submitted!
                  </MuiAlert>
                </Snackbar>

                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  open={toast.snackbar2open}
                  onClose={snackbarclose}
                  autoHideDuration={2000}
                  action={[
                    <IconButton
                      arial-label="Close"
                      color="inherit"
                      onClick={snackbarclose}
                    >
                      x
                    </IconButton>,
                  ]}
                >
                  <MuiAlert onClose={snackbarclose} severity="info">
                    Added another field!
                  </MuiAlert>
                </Snackbar>

                {inputFields.map((inputField, index) => (
                  <div className="options mt-2 flex-column" key={inputField.id}>
                    <div className="flex align-items-center mb-3">
                      <div className="flex flex-column">
                        <label className="mb-3 w-100 content-text font-weight-bold">
                          Option {index + 1}
                        </label>
                        <div className="flex align-items-center justify-content-between">
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
                            className=" py-3 rounded-lg px-3 textareastyle inputfield focus-shadow transition-all duration-200 text-gray-700 focus-outline-none  border border-gray-300 focus:shadow-outline"
                            placeholder={'Option' + (index + 1)}
                            value={inputField.options}
                            onChange={(event) =>
                              handleChangeInput(inputField.id, event)
                            }
                          />
                          <button
                            hidden={inputFields.length === 2}
                            onClick={() => handleRemoveFields(inputField.id)}
                            className=" delete ml-2"
                          >
                            <FontAwesomeIcon
                              className=" text-danger"
                              icon={faTrashAlt}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddfields}
                  className="px-5 py-3 border-0  bg-dark rounded-lg font-weight-bold flex align-items-center justify-content-between text-white"
                >
                  <span className="mr-3">
                    Add another option
                    <FontAwesomeIcon className="ml-2" icon={faPlus} />
                  </span>
                </button>
                <label className="mt-3 w-100 content-text font-weight-bold">
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
              </div>
              <div className="flex justify-content-center mt-5 pt-3 ">
                <button
                  type="submit"
                  /*onClick={handleSubmit}*/
                  className="px-5 py-3 bg-success border-0 text-white font-weight-bold rounded-lg"
                >
                  <FontAwesomeIcon className="mr-2" icon={faBookmark} />
                  Save changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const mapStatetoProps = (state) => {
  return {
    userDetails: state.login.userDetails,
  };
};

export default connect(mapStatetoProps, null)(EditPoll);
