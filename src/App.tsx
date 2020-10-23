import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './views/Home';
import Login from './views/Login';
import "./styles/App.scss"
import { StateProvider } from './utils/state';

function App() {
  return (
    <StateProvider>
      <Router>
        <div className="App">
          <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
          </nav>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>
        </div>
      </Router>
    </StateProvider>
  );
}

export default App;
