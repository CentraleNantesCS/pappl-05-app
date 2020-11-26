import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './views/Home';
import Calendar from './views/Calendar';
import Login from './views/Login';
import './styles/App.scss';
import { useStateContext } from './utils/state';
import { ActionType } from './utils/reducer';

import MainLayout from './components/layout/Main';
import Users from './views/Users';

function App() {
  const { dispatch } = useStateContext();

  useEffect(() => {
    dispatch && dispatch!({ type: ActionType.GET_USER });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <MainLayout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/calendar">
            <Calendar />
          </Route>
          <Route path="/users">
            <Users/>
          </Route>
        </Switch>
      </MainLayout>
    </Router>
  );
}

export default App;
