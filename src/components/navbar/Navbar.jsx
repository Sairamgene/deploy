import { ActionButton, Heading, Item, MenuTrigger, Menu, View } from '@adobe/react-spectrum'
// import MoreSmallList from '@spectrum-icons/workflow/MoreSmallList';
import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import userBadge from '../../assets/svgs/badge.svg';
import bugsyLogo from '../../assets/svgs/bugsy.svg';

import FirebaseContext from '../../firebase/Context';
import { toggleColorSchemeAction } from '../app/appSlice';
import { setAuthUserAsync, setEmployeeIdAsync, setRolesAsync, setTenantIdAsync, setTenantNameAsync } from '../login/loginSlice';
import { setEmployeeProfileAsync, setFirebaseProfileImageURLAsync } from '../myprofile/myProfileSlice';
import './Navbar.css'

const Navbar = (props) => {

    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const colorScheme = useSelector((store) => { return store.app.colorScheme});
    const profile = useSelector((store) => { return store.employee.profile});
    const roles = useSelector((store) => { return store.auth.roles});
    const imageUrl = useSelector((store) => { return store.employee.profileImageURL});
    const tenantName = useSelector((store) => { return store.auth.tenantName});
    // console.log(firebase)

    const onBadgeMenuClick = (key) => {
        switch(key) {
            case 'theme': 
                dispatch(toggleColorSchemeAction())
                break;
            case 'logout':
                firebase.doSignOut();
                // clear redux store
                dispatch(setAuthUserAsync(null));
                dispatch(setEmployeeIdAsync(''));
                dispatch(setRolesAsync([]));
                dispatch(setTenantIdAsync(''));
                dispatch(setTenantNameAsync(''));
                dispatch(setEmployeeProfileAsync(null));
                dispatch(setFirebaseProfileImageURLAsync(''));
                history.push('/login');
                break;
            default: 
                // console.log('uncaught')
                break;
        }

    }

    // useEffect(() => {
    //     console.log('Navbar', imageUrl);
    // }, [imageUrl]) 

    return (
        <>
           <nav className="nav flex-container">
                <div className="flex-container">
                        <div className="logo-container">
                           <img alt="LOGO" style={{height: '35px'}} src={bugsyLogo}></img>
                        </div>
                        <div className="navlinks-container">
                            <div style={{display: 'flex'}}>
                    
                                <div style={{padding: '10px'}}><NavLink style={{color: '#3c3c3c', textDecoration: 'none'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}} to={'/myprofile'}>MyProfile</NavLink></div>
                                {roles.includes('ADMIN') ? <div style={{padding: '10px'}}><NavLink style={{color: '#3c3c3c', textDecoration: 'none'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}} to={'/admin'}>Admin</NavLink></div> : null}
                                {/* {roles.includes('ADMIN') ? <div style={{padding: '10px'}}><NavLink style={{color: '#3c3c3c', textDecoration: 'none'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}} to={'/mail'}>Email</NavLink></div> : null} */}
                            
                            </div>
                        </div>
                </div>
                        <div className="flex-container d-none d-md-block">
                    <View alignSelf="center" UNSAFE_style={{position: 'absolute', right: '45%'}}><Heading level={3}>{props.tenantName}</Heading></View>
                        </div>

                        <div className="flex-container">

                            {/* <div onClick={() => { setMobileMenuOn((prevState) => ({ mobileMenuOn: !prevState.mobileMenuOn}))}} style={{padding: '14px', alignSelf: 'center'}} className="d-lg-none">
                                <View alignSelf="center">
                                    <span ><MoreSmallList></MoreSmallList></span>
                                </View>
                            </div> */}

                            <div style={{position: 'absolute', alignSelf: 'center', width: '100px', left: '50%', right: '50%'}}>
                                {tenantName}
                            </div>

                            <View alignSelf="center">
                               { profile === null ? null : `${profile.firstName} ${profile.lastName}`}
                               {/* {console.log("PROFILE", profile)} */}
                            </View>
                        
                            
                            <div style={{padding: '14px', alignSelf: 'center'}}>
                                    <MenuTrigger closeOnSelect={false}>
                                        <ActionButton UNSAFE_style={{border: 0, background: 'transparent'}} 
                                        aria-label="Profile"> 
                                            {
                                                 <img alt="BADGE" src={imageUrl === ""? userBadge: imageUrl} style={{height: '28px', borderRadius: '50%'}} className="badge-nav-button"></img>
                                            }
                                           
                                        
                                        </ActionButton>
                                            <Menu onAction={(key) => onBadgeMenuClick(key)} >
                                                <Item key="profile">{ profile === null ? <div>Loading name..</div> : `${profile.firstName} ${profile.lastName}`}</Item>
                                                <Item key="settings">Settings</Item>
                                                <Item key="theme">
                                                    {colorScheme === 'light' ? 'Switch To Dark Mode' : 'Switch To Light Mode'}
                                                </Item>                                            
                                                <Item key="logout">Logout</Item>
                                            </Menu>
                                    </MenuTrigger>
                            </div>
                        </div>
            </nav>
        </>
    )
}

export default Navbar
