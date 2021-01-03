import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { useStateContext } from '../../utils/state';
import { ActionType } from '../../utils/reducer';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToApp from "@material-ui/icons/ExitToApp";
import SchoolIcon from '@material-ui/icons/School';
import EventIcon from '@material-ui/icons/Event';
import BookIcon from '@material-ui/icons/Book';
import LabelIcon from '@material-ui/icons/Label'
import { Redirect, Switch} from "react-router-dom";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import SettingsIcon from '@material-ui/icons/Settings';

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

  const menu = [
    {
      text: "Accueil",
      icon: HomeIcon,
      path: "/"
    },
    {
      text: "Matières",
      icon: SchoolIcon,
      path: "/subjects"
    },
    {
      text: "Options",
      icon: BookIcon,
      path: "/specialisations",
      divider: true
    },
    {
      text: "Emploi du temps",
      icon: EventIcon,
      path: "/calendars",
      divider: true
    },
    {
      text: "Types D'évènements",
      icon: LabelIcon,
      path: "/eventtypes",
    },
    {
      text: "Promotions",
      icon: ListIcon,
      path: "/promos"
    },
    {
      text: "Utilisateurs",
      icon: PersonIcon,
      path: "/users"
    }
  ]

  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Poppins'
    },
  });
  
  return (
    <div className="App">
      <nav>
        <AppBar position="static" className="flex-1">
            {state.isAuthenticated && (
                <Toolbar style={{ background: '#045d93' }} className="flex">
                  <IconButton edge="start" color="inherit" aria-label="menu"  onClick={toggleDrawer}>
                  <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" className="flex-1 text-4xl ">
                    <Link to="/">EDT Centrale Nantes</Link>
                  </Typography>
                  <Button color="inherit" onClick={logout} startIcon={<SettingsIcon /> }>
                    <Link to="/account">Mon compte</Link>
                  </Button>
                  <Button color="inherit" onClick={logout} startIcon={<ExitToApp /> }>
                    <Link to="/">Se déconnecter</Link>
                  </Button>
                </Toolbar>
            )}
        </AppBar>
      </nav>
      <Drawer open={sidebarOpen} onClose={toggleDrawer} >
        <List className="w-64 text-black-700 font-serif">
        <div className="flex items-center p-5 justify-end ">
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
          {state.isAuthenticated  && menu.map((menuItem) => {
            const Icon = menuItem.icon
            return (
              <ThemeProvider theme={theme}>
                <Link  to={menuItem.path} key={menuItem.text}>
                  <ListItem  button key={menuItem.text} >
                      {Icon && <ListItemIcon ><Icon /></ListItemIcon>}
                    <ListItemText primary={menuItem.text} />
                  </ListItem>
                  {menuItem?.divider && <div className="mx-20"><Divider variant="middle"/></div>}
                </Link>
              </ThemeProvider>
            )
          })}
        </List>
      </Drawer>
      <div className="flex flex-1 w-full h-full ">
        {props.children}
      </div>
    </div>
  );
}

export default App;
