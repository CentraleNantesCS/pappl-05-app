import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { UisBars } from '@iconscout/react-unicons-solid';
import { useStateContext } from '../../utils/state';
import { ActionType } from '../../utils/reducer';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';

function App(props: { children: React.ReactNode }) {
  const { state, dispatch } = useStateContext();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    dispatch && dispatch!({ type: ActionType.GET_USER });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    /// haha logout go brrrr
    dispatch && dispatch({ type: ActionType.SIGN_OUT });
  };

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen)
  }
  return (
    <div className="App">
      <nav>
        <AppBar position="static" className="flex-1">
          <Toolbar className="flex">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <UisBars color="#fff" />
            </IconButton>
            <Typography variant="h6" className="flex-1 text-4xl">
              <Link to="/">PAPPL 05</Link>
            </Typography>
            <Typography variant="subtitle1">
              <Link to="/calendar">Calendar</Link>
            </Typography>
            {!state.isAuthenticated && (
              <Button color="inherit">
                <Link to="/login">Login</Link>
              </Button>
            )}
            {state.isAuthenticated && (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </nav>
      <Drawer open={sidebarOpen} onClose={toggleDrawer}>
        sss
      </Drawer>
      <div className="flex flex-1 w-full h-full">
        {props.children}
      </div>
    </div>
  );
}

export default App;
