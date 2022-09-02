import React , {useState }  from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SearchBar from "material-ui-search-bar";
import Button from '@material-ui/core/Button';
import { NavLink, Redirect, Route, Router, Switch ,useRouteMatch, useHistory} from 'react-router-dom';


const drawerWidth = 200;
// const match = useRouteMatch();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },

  drawerSearch: {
    width : 500
  },

  drawerHeader: {
    display: 'flex',
    // width : 200,
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-middle',
  },
  content: {
      flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const [component, setComponent] = useState('inbox');
  const classes = useStyles();
  // const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const handleClick = () => history.push('/mail/compose');

  const handleFields = (i) => {
  
    switch (i){
      case 'Inbox' : 
      history.push('/mail/inbox')
      return;
      case 'Starred': 
      history.push('/mail/starred')
      
      return;
      case 'Send email': 
      history.push('/mail/sendEmail')
    
      return;
      case 'Drafts': 
      history.push('/mail/drafts')
      
      return;
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar > 
          <Typography variant="h6"  className = {classes.drawerHeader} noWrap>
            <SearchBar className = {classes.drawerSearch}
      onChange={() => console.log('onChange')}
      onRequestSearch={() => console.log('onRequestSearch')}
    />
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={true}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        
        <div className={classes.drawerHeader}>
        <Button className = {classes.drawerPaper} variant="outlined" onClick={handleClick}>Compose</Button>          {/* <IconButton >
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton> */}
        </div>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text} onClick = {() => handleFields(text)}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} ></ListItemText>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {/* <Typography>Search</Typography> */
        
        }
       
      </main>
    </div>
  );
}
