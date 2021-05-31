import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import FrontPage from './components/front-page';
import MainContent from './components/create-poll';
//import Header from './components/header';
import DemoPoll from './components/demo-poll';
import New from './components/new';
import Poll from './components/poll';
import PollResult from './components/poll-result';
import PollAdmin from './components/poll-admin';
import EditPoll from './components/edit-poll';
import UserAccount from './components/useraccount';
import Test from './components/test';
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={FrontPage} />
          <Route path="/create-poll" component={MainContent} />
          <Route path="/useraccount" component={UserAccount} />
          <Route path="/demo-poll" component={DemoPoll} />
          <Route path="/new" component={New} />
          <Route path="/poll" component={Poll} />
          <Route path="/poll-result" component={PollResult} />
          <Route path="/poll-admin" component={PollAdmin} />
          <Route path="/edit-poll" component={EditPoll} />
          <Route path="/test" component={Test} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
