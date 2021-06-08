import { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import axios from 'axios';
import Loader from './loader/loader';

const Report = ({ setReport, pollid, owner, setToast }) => {
  const [value, setValue] = useState("It's spam");
  const [loader, setLoader] = useState(false);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const data = { report: value, pollid: pollid, owner: owner };
    axios.post('/reportPoll', data).then((res) => {
      if (res.data.success) {
        setToast({ snackbaropen: true, msg: 'Reported', not: 'success' });
        setReport(false);
        setLoader(false);
      } else {
        setToast({
          snackbaropen: true,
          msg: 'Failed to report!',
          not: 'error',
        });
        setReport(false);
        setLoader(false);
      }
    });
  };
  return (
    <div
      className="w-100 justify-content-center d-flex align-items-center position-fixed fixed-top"
      style={{
        height: '100%',
        zIndex: 1,
        backgroundColor: 'rgba(135,206,235 ,0.7)',
      }}
    >
      {loader ? <Loader /> : null}
      <div className="d-flex flex-column align-items-center bg-white rounded-lg">
        <div className="w-100 d-flex flex-column px-4 pt-4">
          <h5>Report poll</h5>
          <FormControl component="fieldset">
            <FormLabel component="legend">Reason</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="It's spam"
                control={<Radio />}
                label="It's spam"
              />
              <FormControlLabel
                value="Sexual harassment"
                control={<Radio />}
                label="Sexual harassment"
              />

              <FormControlLabel value="Scam" control={<Radio />} label="Scam" />
              <FormControlLabel
                value="Doxing"
                control={<Radio />}
                label="Doxing"
              />
              <FormControlLabel
                value="Inappropriate"
                control={<Radio />}
                label="Inappropriate"
              />
            </RadioGroup>
          </FormControl>
          <div className="px-3 py-3 d-flex justify-content-end">
            <button
              className="border-light rounded-lg shadow-lg px-4 py-2 "
              onClick={() => setReport(false)}
            >
              Cancel
            </button>
            <button
              className="bg-info border-0 rounded-lg shadow-lg text-light px-4 py-2 ml-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Report;
