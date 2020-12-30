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
import { Redirect, Switch} from "react-router-dom";
import LockOpenIcon from '@material-ui/icons/LockOpen';

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
      text: "Utilisateurs",
      icon: PersonIcon,
      path: "/users"
    }
  ]
  const guestMenu = [

    {
      text: "Se connecter",
      icon: LockOpenIcon,
      path: "/login"
    },
  ]
  return (
    <div className="App">
      <nav>
        <AppBar position="static" className="flex-1">
          <Toolbar className="flex bg-purple-800">
            <IconButton edge="start" color="inherit" aria-label="menu"  onClick={toggleDrawer}>
            <MenuIcon />
            </IconButton>
            <Typography variant="h6" className="flex-1 text-4xl ">
              <Link to="/">EDT Centrale Nantes</Link>
            </Typography>
            {!state.isAuthenticated && (
              <Button color="inherit" startIcon={<LockOpenIcon />}>
                <Link to="/login">Se connecter</Link>
              </Button>
            )}
            {state.isAuthenticated && (
              <Button color="inherit" onClick={logout} startIcon={<ExitToApp /> }>
                <Link to="/">Se déconnecter</Link>
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </nav>
      <Drawer open={sidebarOpen} onClose={toggleDrawer} >
        <List className="w-64">
        <div className="flex items-center py-2 justify-end ">
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
          {state.isAuthenticated  && menu.map((menuItem) => {
            const Icon = menuItem.icon
            return (
              <Link to={menuItem.path} key={menuItem.text}>
                <ListItem button key={menuItem.text}>
                    {Icon && <ListItemIcon><Icon /></ListItemIcon>}
                  <ListItemText primary={menuItem.text} />
                </ListItem>
                {menuItem?.divider && <div className="my-4"><Divider variant="middle"/></div>}
              </Link>
            )
          })}
          {!state.isAuthenticated  && guestMenu.map((menuItem) => {
            const Icon = menuItem.icon
            return (
              <Link to={menuItem.path} key={menuItem.path}>
                <ListItem button key={menuItem.path}>
                    {Icon && <ListItemIcon key={menuItem.path}><Icon /></ListItemIcon>}
                  <ListItemText primary={menuItem.text} key={menuItem.path} />
                </ListItem>
              </Link>
            )
          })}
        </List>
      </Drawer>
      <div className="flex flex-1 w-full h-full">
        {props.children}
      </div>
    </div>
  );
}

export default App;
