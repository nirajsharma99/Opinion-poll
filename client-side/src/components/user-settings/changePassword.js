import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useState } from 'react';
import Notification from '../notification';
const ChangePassword = (props) => {
  const [oldpass, setOldPass] = useState('');
  const [newpass, setNewPass] = useState('');
  const [error, setError] = useState(false);
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
  const changepassword = (e) => {
    e.preventDefault();
    let data = { oldpass: oldpass, newpass: newpass, userID: props.userID };
    axios.post('/changePass', data).then((res) => {
      if (res.data.success) {
        setToast({
          snackbaropen: true,
          msg: 'Password Changed!',
          not: 'success',
        });
        setOldPass('');
        setNewPass('');
      } else {
        setError(true);
      }
    });
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
        Change Password
      </span>
      <hr
        className="bg-secondary mt-2"
        style={{ opacity: '0.2', height: '1px' }}
      />
      <div className="d-flex flex-column w-100 align-items-center">
        <TextField
          error={error}
          helperText={error ? 'Incorrect password' : null}
          type="password"
          label="Old Password"
          variant="filled"
          className="w-50 mb-3"
          value={oldpass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <TextField
          type="password"
          label="New Password"
          variant="filled"
          className="w-50 mb-3"
          value={newpass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button
          className="btn p-2 bg-primary text-light w-50"
          onClick={(e) => changepassword(e)}
        >
          Change password
        </button>
      </div>
    </div>
  );
};
export default ChangePassword;
