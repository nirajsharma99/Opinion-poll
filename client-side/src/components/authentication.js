import axios from 'axios';

function Authentication(props) {
  axios.get('/getUserData').then((res) => {
    props.setUsername(res.data.username);
  });

  return null;
}
export default Authentication;
