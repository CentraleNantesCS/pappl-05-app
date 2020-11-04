import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './views/Home';
import Login from './views/Login';
import "./styles/App.scss"
import { useStateContext } from './utils/state';
import { ActionType } from './utils/reducer';



function App() {
  const { state, dispatch } = useStateContext();
  useEffect(() => {
    dispatch && dispatch!({ type: ActionType.GET_USER });
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
      <Router>
        <div className="App">
          <nav>
            <Link to="/">Home</Link>
            {!state.isAuthenticated && <Link to="/login">Login</Link>}
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
  );
}

export default App;
