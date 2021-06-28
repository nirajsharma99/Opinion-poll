import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Loader2 from '../loader/loader2';

const DeleteAccount = (props) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const history = useHistory();
  const [loader, SetLoader] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const deleteAccount = () => {
    let data = { password: password, username: props.username };
    if (password.trim().length > 0) {
      SetLoader(true);
      axios.post('/deleteAccount', data).then((res) => {
        if (res.data.success) {
          localStorage.setItem(
            'notify',
            JSON.stringify({
              type: 'success',
              msg: 'Account deleted!',
            })
          );
          setPassword('');
          SetLoader(false);
          history.push('/');
        } else {
          SetLoader(false);
          setError(true);
          setDeleteAlert(false);
        }
      });
    } else {
      setError(true);
    }
  };
  const ShowDelete = () => (
    <div
      className="w-100 justify-content-center d-flex align-items-center position-fixed fixed-top"
      style={{
        height: '100%',
        zIndex: 1,
        backgroundColor: 'rgba(135,206,235 ,0.7)',
      }}
    >
      <div className="d-flex flex-column align-items-center bg-white rounded-lg">
        <div className="w-100 d-flex flex-column px-4 pt-4">
          <h5>Delete Account</h5>
          <span
            className="text-secondary"
            style={{ fontSize: '0.9rem', fontWeight: '600' }}
          >
            Are you sure you want to delete your Account?
          </span>
          <div className="px-3 py-3 d-flex justify-content-end">
            <button
              className="border-light rounded-lg shadow-lg px-4 py-2 "
              onClick={() => setDeleteAlert(false)}
            >
              Cancel
            </button>
            <button
              className="bg-danger border-0 rounded-lg shadow-lg text-light px-4 py-2 ml-3"
              onClick={deleteAccount}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="p-2 user-settings-bg">
      {loader ? <Loader2 /> : null}
      <span className="font-weight-bold p-3" style={{ color: 'purple' }}>
        Delete Account
      </span>
      <hr
        className="bg-secondary mt-2"
        style={{ opacity: '0.2', height: '1px' }}
      />
      <div className="d-flex flex-column w-100 align-items-center">
        <TextField
          error={error}
          helperText={error ? 'Incorrect password!' : null}
          type="password"
          label="Enter Password"
          variant="filled"
          className="resp-width-50 mb-3"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="btn p-2 bg-danger text-light w-50"
          onClick={() => setDeleteAlert(true)}
          disabled={!password}
        >
          Delete Account
        </button>
      </div>
      {deleteAlert ? <ShowDelete /> : null}
    </div>
  );
};
export default DeleteAccount;
