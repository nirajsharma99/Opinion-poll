import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import FrontPage from './components/front-page';
import MainContent from './components/create-poll';
//import Header from './components/header';
import Poll from './components/poll';
import PollResult from './components/poll-result';
import PollAdmin from './components/poll-admin';
import EditPoll from './components/edit-poll';
import UserAccount from './components/useraccount';
import Team from './components/team';
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={FrontPage} />
          <Route path="/create-poll" exact component={MainContent} />
          <Route path="/useraccount" exact component={UserAccount} />
          <Route path="/poll/:id" exact component={Poll} />
          <Route path="/poll-result/:id" exact component={PollResult} />
          <Route path="/poll-admin" exact component={PollAdmin} />
          <Route path="/edit-poll" exact component={EditPoll} />
          <Route path="/team" exact component={Team} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
