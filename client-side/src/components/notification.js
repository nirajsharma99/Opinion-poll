import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';

function Notification(props) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={props.switcher}
      onClose={props.close}
      autoHideDuration={3000}
      action={[
        <IconButton arial-label="Close" color="inherit" onClick={props.close}>
          x
        </IconButton>,
      ]}
    >
      <Alert onClose={props.close} severity={props.nottype}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}
export default Notification;
