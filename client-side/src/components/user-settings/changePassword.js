import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useState } from 'react';
import Notification from '../notification';
const ChangePassword = (props) => {
  const [oldpass, setOldPass] = useState({
    oldpass: '',
    error: false,
    msg: '',
  });
  const [newpass, setNewPass] = useState({
    newpass: '',
    error: false,
    msg: '',
  });
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
  const showError = (value, error) => value.trim().length === 0 && error;
  const changepassword = (e) => {
    e.preventDefault();
    if (
      oldpass.oldpass.trim().length > 0 &&
      newpass.newpass.trim().length > 0
    ) {
      let data = {
        oldpass: oldpass.oldpass,
        newpass: newpass.newpass,
        username: props.username,
      };
      axios.post('/changePass', data).then((res) => {
        if (res.data.success) {
          setToast({
            snackbaropen: true,
            msg: 'Password Changed!',
            not: 'success',
          });
          setOldPass({ ...oldpass, oldpass: '', error: false, msg: '' });
          setNewPass({ ...newpass, newpass: '', error: false, msg: '' });
        } else {
          setOldPass({ ...oldpass, error: true, msg: 'Incorrect Password!' });
        }
      });
    } else {
      setOldPass({ ...oldpass, error: true, msg: 'Required' });
      setNewPass({ ...newpass, error: true, msg: 'Required' });
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
        Change Password
      </span>
      <hr
        className="bg-secondary mt-2"
        style={{ opacity: '0.2', height: '1px' }}
      />
      <div className="d-flex flex-column w-100 align-items-center">
        <TextField
          {...(showError(oldpass.oldpass, oldpass.error) && {
            ...{
              error: oldpass.error,
              helperText: oldpass.msg,
            },
          })}
          /*error={error}
          helperText={error ? 'Incorrect password' : null}*/
          type="password"
          label="Old Password"
          variant="filled"
          className="resp-width-50 mb-3"
          value={oldpass.oldpass}
          onChange={(e) => setOldPass({ ...oldpass, oldpass: e.target.value })}
        />
        <TextField
          {...(showError(newpass.newpass, newpass.error) && {
            ...{
              error: newpass.error,
              helperText: newpass.msg,
            },
          })}
          type="password"
          label="New Password"
          variant="filled"
          className="resp-width-50 mb-3"
          value={newpass.newpass}
          onChange={(e) => setNewPass({ ...newpass, newpass: e.target.value })}
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
