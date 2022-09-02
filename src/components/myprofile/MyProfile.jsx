import { ActionButton, Flex, Form, Item,Menu, MenuTrigger, TextField } from '@adobe/react-spectrum';
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import Layout from '../layout/Layout';
import userImage from '../../assets/svgs/badge.svg'
import './MyProfile.css';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import EmployeeProfile from '../employees/employeeProfile/EmployeeProfile';
import Employees from '../employees/Employees';
import FirebaseContext from '../../firebase/Context';
import Loading from '../loading/Loading';
import { setEmployeeProfileAsync, setFirebaseProfileImageURLAsync} from './myProfileSlice';

// My Profile Components
import Profile from './components/Profile';
import Timesheet from './components/Timesheet'
import { setTenantNameAsync } from '../login/loginSlice';
import ProjectHistory from './components/ProjectHistory';
import Immigration from './components/Immigration/Immigration';

const MyProfile = (props) => {

  // const count = useSelector((store) => store.auth.count);
  const [isFetching, setIsFetching] = useState(false);
  const employeeId = useSelector((store) => store.auth.employeeId);
  const tenantId = useSelector((store) => store.auth.tenantId);
  const profile = useSelector((store) => store.employee.profile);
  const [imageUrl, setImageUrl] = useState(userImage);
  const firebase = useContext(FirebaseContext);
  const dispatch = useDispatch();

  // Similar to componentDidMount
  useEffect(() => {

    if (!profile || (profile && (Object.keys(profile).length === 0))) {
      getEmployeeProfile();
      getTenantName();
    } 
    else {
      getProfileImage(profile)
      setIsFetching(false);
    }
  }, []);


  const getProfileImage = (employee) => {
    try{
    if (employee.imageUrl === '') {
      setIsFetching(false);
    } else {
      firebase.storage.ref(`${tenantId}/${employeeId}/images/${employee.imageUrl}`).getDownloadURL()
      .then(url=>{
        setImageUrl(url);
        dispatch(setFirebaseProfileImageURLAsync(url));
        setIsFetching(false);
      }).catch(error => {
        console.log(error)
        setIsFetching(false);
      });
    }
  }catch{
    console.log("first")
  }
    
  }

  const getTenantName = () => {
    firebase.tenants(tenantId)
    .once('value')
    .then(client=>{
        console.log(`Tenants for ${tenantId} `, client.val())
        dispatch(setTenantNameAsync(client.val().name));
    })
    .catch(error => {
      console.log('NEED TO CATCH ERROR', error);
    })
  }

  const getEmployeeProfile = () => {
    firebase.employees(employeeId).once("value").then(snapshot => {
      const employee =  snapshot.val();
      getProfileImage(employee);
      dispatch(setEmployeeProfileAsync(employee))
    }).catch(error => {
      console.log('NEED TO CATCH ERROR', error);
    })
  }


    return (
        <div>
          <Layout>
            { isFetching && <Loading/>}
            { !isFetching && profile &&
            <>
                <div className="container-employee">
                    <div className="hdr-employee container-fluid">
                        {console.log('IMAGEPROFILE', imageUrl)}
                        {/* { !profile.imageUrl ? 
                          <img src={userImage} alt="user" className="hdr-img"></img> : <img src={imageUrl} alt="user" className="hdr-img"></img>
                        } */}

                      <div onClick={() => { alert('Feature in Progress..')}} className="hdr-img-container" 
                                style={
                                        { backgroundImage: `url('${imageUrl}')` ,
                                          backgroundSize: "cover",
                                          backgroundPosition: "center"
                                          
                                         }
                                      }
                        >
                        <span className="hdr-img-tooltip-text">Click to Update</span>
                        <div className="hdr-img-overlay"></div>
                      </div>
                        
                        
                        
                        <div>

                            <table className="tbl-employee-name">
                              <thead>
                                <tr className="hdr-employee-name">
                                  {console.log('HEREYO', profile)}
                                    <td>{profile.firstName}</td>
                                    {!profile.middleInitial === '' ? <td>{profile.middleInitial}</td> : null}
                                    <td>{profile.lastName}</td>
                                </tr>
                                <tr className="hdr-employee-name-parts">
                                    <td>First Name</td>
                                    {!profile.middleInitial === '' ?  <td>M.I.</td> : null}
                                    <td>Last Name</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            
            
                <div style={{paddingLeft: '15%', paddingRight: '15%', marginTop: '30px'}}>
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                      <NavLink to="/myprofile/profile" style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}}  activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Profile</NavLink>
                      <NavLink to="/myprofile/timesheet" style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}}  activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Timesheet</NavLink>
                      <NavLink to="/myprofile/projecthistory" style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}} activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Project History</NavLink>
                      <NavLink to="/myprofile/compensation" style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}}  activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Compensation</NavLink>
                      <NavLink to="/myprofile/immigration" style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}}  activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Immigration</NavLink>
                  </div>
                <div style={{borderTop: '2px solid #dcdcdc', marginTop: '-2px'}}></div>

                  <Switch>
                    <Redirect from="/myprofile" to="/myprofile/profile" exact />

                    <Route path="/myprofile/profile" exact component={Profile}/>
                    <Route path="/myprofile/timesheet" component={Timesheet}/>
                    <Route path="/myprofile/projecthistory" component={ProjectHistory}/>
                    <Route path="/myprofile/compensation"  component={() => { return <div>COMPENSATION</div>}}/>
                    <Route path="/myprofile/immigration"  component={Immigration}/>

                  </Switch>
                </div>
            </>
              
              }
          </Layout>
        </div>
    )
}


export default MyProfile;
