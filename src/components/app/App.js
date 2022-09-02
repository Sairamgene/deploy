import React, { useContext, useState } from 'react';
import { Switch, Route, NavLink, useHistory} from 'react-router-dom';
// Components
import Login from '../login/Login';
import Admin from '../admin/Admin';
import MyProfile from '../myprofile/MyProfile';
import Reports from '../reports/Reports';
import PageNotFound from '../pageNotFound/PageNotFound';
import Mail from '../mail/Mail'

import FirebaseContext from '../../firebase/Context';
import { Provider, useDispatch, useSelector, useStore } from 'react-redux';
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import { setAuthUserAsync, setCount, setTenantIdAsync, setRolesAsync, setEmployeeIdAsync } from '../login/loginSlice.js';
import 'bootstrap/dist/css/bootstrap-grid.css';

import Loading from '../loading/Loading';
import { setEmployeeProfileAsync } from '../myprofile/myProfileSlice';

import { Provider as SpectrumProvider, defaultTheme, lightTheme } from '@adobe/react-spectrum';

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import Compose from '../mail/components/compose';

import PrimeReact from 'primereact/utils';

PrimeReact.ripple = true;


const Navigation = () => {

  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const count = useSelector((store) => store.auth.count);
  const userRoles = useSelector((store) => store.auth.roles);
  const dispatch = useDispatch();

  return <div style={
    { 
      margin: 0, 
      padding: '10px',
      display: 'flex', 
      listStyle: 'none', 
      height: '60px',
      background: 'lightgrey',
      textDecoration: 'none'
    }}>
        <div style={{alignSelf: 'center', padding: '10px'}}>
          <NavLink hidden={!['USER'].every(role => userRoles.includes(role))} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}} to="/myprofile">My Profile</NavLink></div>
        <div style={{alignSelf: 'center', padding: '10px'}}>
          <NavLink hidden={!['ADMIN'].every(role => userRoles.includes(role))} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}} to="/admin">Admin</NavLink></div>
        <div style={{alignSelf: 'center', padding: '10px'}}>
          <NavLink hidden={!['ADMIN'].every(role => userRoles.includes(role))} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}} to="/reports">Reports</NavLink></div>
        <div style={{alignSelf: 'center', padding: '10px'}}>
          <NavLink hidden={!['ADMIN'].every(role => userRoles.includes(role))} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}} to="/mail">Email</NavLink></div>
        <div style={{alignSelf: 'center'}}><button onClick={() => 
        {
          firebase.doSignOut();
          dispatch(setAuthUserAsync(null))
          dispatch(setTenantIdAsync(""))
          history.push('/login')
        }
        }>LOGOUT</button></div>
        <div style={{alignSelf: 'center'}} onClick={() => dispatch(setCount(count + 1))}>Action to Store</div>
      </div>
}

function App() {

  const dispatch = useDispatch();
  const firebase = useContext(FirebaseContext);
  const history = useHistory();

  const [authUser, setAuthUser]= useState(localStorage.getItem('authUser'));
  const [tenantId, settenantid]= useState(localStorage.getItem('tenantId'));
  const [isUserSet, setIsUser] = useState(false);

  const colorScheme = useSelector((store) => { return store.app.colorScheme});
  
  // console.log('COLORSCHEME', colorScheme);
  
  if (tenantId && authUser) {

    const parsedTenantId = JSON.parse(tenantId).tenantId;
    const parsedAuthUser = JSON.parse(authUser);

    firebase.user(JSON.parse(authUser).user.uid)
    .once("value")
    .then(user => {
      // console.log('Users in User APP.js', user.val());
      if(user.val() && user.val().tenants[parsedTenantId]){

        // const userRoles = user.val().tenants.filter(tenant => {
        //   return tenant.tenantId === parsedTenantId
        // }).map(tenant => {
        //   return tenant.roles;
        // });
        const userRoles = Object.keys(user.val().tenants[parsedTenantId].roles)

        // console.log('USER ROLES', userRoles);
        // console.log(parsedTenantId)
        firebase.tenantId = parsedTenantId


        const employeeId =  user.val().tenants[parsedTenantId].employeeId

        firebase.tenants(parsedTenantId)
        .once('value')
        .then(client=>{
            // console.log(`Tenants for ${tenantId} `, client.val())
        })
        .catch(err=>{
            // console.log(`Error in reading ${tenantId} tenants `, err);
            // setError(err);
        })


        dispatch(setEmployeeIdAsync(employeeId));
        dispatch(setTenantIdAsync(parsedTenantId));
        dispatch(setAuthUserAsync(parsedAuthUser));
        dispatch(setRolesAsync(userRoles));
        setIsUser(true);

      } else {
        console.error("The Login id, password or tenantid is not valid");
        history.push('/login');
        setIsUser(true);
      }
    })
  } else {
    history.push('/login')
    return <>
    {/* <Navigation/> */}
    <SpectrumProvider theme={lightTheme} colorScheme={colorScheme}>
      <Switch>
        <ProtectedRoute path="/myprofile" roles={['USER']} component={MyProfile}/>
        <ProtectedRoute path="/admin"   roles={['ADMIN']}  component={Admin}/>
        <ProtectedRoute path="/reports"  roles={['ADMIN']}  component={Reports}/>
        <ProtectedRoute path="/mail"   roles={['ADMIN']}  component={Mail}/>
        <Route path={['/login', '/']} exact component={Login}/>  
        {/* <Route path='/mail/compose' component={Compose}></Route> */}
        {/* <Route path = "/mail" roles = {['ADMIN']} component = {<div>helloo</div>}/> */}
        <Route path="*" component={PageNotFound}/>
      </Switch>
    </SpectrumProvider>
    </>
  }

  if (!isUserSet) {
    return <Loading/>
  } 

  return <div className="App">
      <SpectrumProvider theme={lightTheme} colorScheme={colorScheme}>
      <Switch>
        <ProtectedRoute path="/myprofile" roles={['USER']} component={MyProfile}/>
        <ProtectedRoute path="/admin" roles={['ADMIN']}  component={Admin}/>
        <ProtectedRoute path="/reports" roles={['ADMIN']}  component={Reports}/>
        <ProtectedRoute path="/mail"   roles={['ADMIN']}  component={Mail}/>
        <Route path={['/login', '/']} exact component={Login}/>   
        {/* <Route path='/mail/compose' component={Compose}></Route> */}
        <Route path="*" component={PageNotFound}/>
      </Switch>
      </SpectrumProvider>
  </div>
}

export default App;
