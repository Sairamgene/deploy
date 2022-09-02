import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import FirebaseContext from '../../firebase/Context';
import Approvals from '../approvals/Approvals';
import AddEmployee from '../employees/addEmployee/AddEmployee';
import EmployeeProfile from '../employees/employeeProfile/EmployeeProfile';

import Employees from '../employees/Employees';
import Layout from '../layout/Layout';
import Loading from '../loading/Loading';
import { setTenantNameAsync } from '../login/loginSlice';
import { setEmployeeProfileAsync, setFirebaseProfileImageURLAsync } from '../myprofile/myProfileSlice';

import PartnerOrganization from '../partnerOrganization/PartnerOrganization';
import PartnerOrganizationProfile from '../partnerOrganization/partnerOrganizationProfile/PartnerOrganizationProfile';

const Admin = () => {

    const authUser = useSelector((store) => { return store.auth.authUser});
    const firebase = useContext(FirebaseContext);
    const profile = useSelector((store) => { return store.employee.profile});
    const [isFetching, setIsFetching] = useState(true);
    const dispatch = useDispatch();
    const tenantId = useSelector((store) => store.auth.tenantId);
    const [imageUrl, setImageUrl] = useState(null);
    const employeeId = useSelector((store) => { return store.auth.employeeId});

      // Similar to componentDidMount
    useEffect(() => {
        if (!profile || (profile && (Object.keys(profile).length === 0))) {
        // console.log('FETCH YES')
        getEmployeeProfile();
        getTenantName();
        } else {
        getProfileImage(profile)
        setIsFetching(false);
        }
    }, []);

    const getProfileImage = (employee) => {
      if(employee !== null){
      firebase.storage.ref(`${tenantId}/${employeeId}/images/${employee.imageUrl}`).getDownloadURL()
        .then(url=>{
          console.log("Download Image URL ", url)
          setImageUrl(url);
          dispatch(setFirebaseProfileImageURLAsync(url));
          setIsFetching(false);
        });
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
        firebase.employees(employeeId).on("value",async snapshot => {
        const employee = await snapshot.val();
        getProfileImage(employee);

        dispatch(setEmployeeProfileAsync(employee))
        setIsFetching(false);
        });
    }

    return (
        <>
            <Layout>
            { isFetching && <Loading/>}
            { !isFetching && 
            <>
                <div className="container-employee">
                    <div className="hdr-employee container-fluid">
                    </div>
                </div>

                <div style={{paddingLeft: '15%', paddingRight: '15%', marginTop: '30px', height: '90%'}}>
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                      <NavLink to="/admin/approvals"  style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}}  activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Approvals</NavLink>
                      <NavLink to="/admin/employees" style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}}  activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Employees</NavLink>
                      <NavLink to="/admin/partners" style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}} activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Partners</NavLink>
                      <NavLink to="/admin/immigration" style={{padding: '10px', textDecoration: 'none', color: 'var(--spectrum-alias-title-text-color)'}}  activeStyle={{padding: '10px', borderBottom: '2px solid #36BFEC', color:'#36BFEC'}}>Immigration</NavLink>
                  </div>
                <div style={{borderTop: '2px solid #dcdcdc', marginTop: '-2px'}}></div>

                  <Switch>
                    <Redirect from="/admin" to="/admin/employees" exact />

                    <Route path="/admin/employees/addemployee" exact component={AddEmployee}/>
                    <Route path="/admin/partners/addpartner" exact component={PartnerOrganizationProfile}/>

                    {/* <Route path="/myprofile/profile" exact component={() => { return <div>PROFILE</div>}}/> */}
                    <Route path="/admin/employees/:employeeid" component={EmployeeProfile}/>
                    <Route path="/admin/employees" component={Employees}/>
                    
                    <Route path="/admin/approvals" component={Approvals}/>
                    {/* <Route path="/admin/partners/addpartner" exact component={PartnerOrganizationProfile}/> */}
                    <Route path="/admin/partners/:partnerId" component={PartnerOrganizationProfile}/>
                    <Route path="/admin/partners" component={PartnerOrganization}/>
                    <Route path="/admin/immigration" />
        
                  </Switch>
                </div>
            </>}
            </Layout>

        </>
    )
}

export default Admin
