import { Flex, Heading, ProgressCircle, Button, ActionButton, DialogTrigger, AlertDialog} from '@adobe/react-spectrum';
import Snapshot from '@spectrum-icons/workflow/Snapshot';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, Switch, Route, Redirect, useRouteMatch, useParams, useHistory} from 'react-router-dom';
import FirebaseContext from '../../../firebase/Context';

import userImage from '../../../assets/svgs/badge.svg'
import './EmployeeProfile.css'

import EmployeeDetails from './EmployeeDetails';
import EmployeeCompensation from './EmployeeCompensation';
import EmployeeDocuments from './EmployeeDocuments';
import EmployeeProjects from './EmployeeProjects';
import EmployeeImmigration from './EmployeeImmigration';
import EmployeeImmigrationWF from './EmployeeImmigrationWF/EmployeeImmigrationWF';

import { Toast } from 'primereact/toast';

const EmployeeProfile = () => {

    const match = useRouteMatch()
    const params = useParams();
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(userImage);
    const tenantId = useSelector((store) => store.auth.tenantId);
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const myToast = useRef(null);

    useEffect(() => {
        const employeeId = params.employeeid; // will always have employeeID
        firebase.employees(employeeId).on('value', (res) => {
            const employee = {...res.val(), ...{id: employeeId}};
            setEmployee(employee);
            getProfileImage(employee)
        });
        
    }, []);

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const getProfileImage = (employee) => {
        firebase.storage.ref(`${tenantId}/${employee.id}/images/${employee.imageUrl}`).getDownloadURL()
          .then(url=>{
            setImageUrl(url);
            setIsLoading(false);
          }).catch(err => {
            console.log(err);
            setIsLoading(false);
          });   
      }

    if (isLoading || !employee) {
        return <>
            <Flex alignItems="center" justifyContent="center" height="100%">
                <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
            </Flex>
        </>
    }
    
    const  onDeleteEmployee =() => {

        // sample: https://bugsy-crm.firebaseio.com/COVET_employees/-MPkL-YSC4kWDVbaIUeN
        const employeeId = params.employeeid ?? employee.id; // will always have employeeID
        let employeeRef = `${firebase.tenantId}_employees/${employeeId}`;
        let employeeDeletedRef = `${firebase.tenantId}_employees_deleted/${employeeId}`;

        firebase.db.ref(employeeRef).once('value').then(res => {
            const employee =  res.val();
            const deletedEmployeeRecord = {
                ...employee,
                id: employeeId,
                updatedAt: firebase.serverValue.TIMESTAMP
            }

            firebase.db.ref(employeeDeletedRef).set(deletedEmployeeRecord).then(res => {
                firebase.db.ref(employeeRef).remove().then(res => {
                    showToast('success', 
                            'Sucesffully Deleted', 
                            `Sucesfully Deleted Employee ${employeeId}`);
                  
                    history.push('/admin/employees');
        
                }).catch(err => {
                    showToast('error', 
                    'Deleting Error', 
                    'Failed to Delete Employee')
                })
            }).catch(err => {
                console.log(err);
                showToast('error', 
                    'Deleting Error', 
                    'Failed to Delete Employee')
            })
        });
    }

    return (<>
            
            {/* SIDE NAVIGATION */}
            <div className="side-nav">
                <Toast ref={myToast} />
                <img src={imageUrl} alt="user" className="details-profile-image"></img> 
                
                <Heading level={3}>{`${employee.firstName} ${employee.lastName}`}</Heading>
                <div style={{padding: '10px'}}><NavLink to={`${match.url}/details`} style={{textDecoration: 'none', color: 'black'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}}>Employee Details</NavLink></div>
                    <div style={{padding: '10px'}}><NavLink to={`${match.url}/compensation`} style={{textDecoration: 'none', color: 'black'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}}>Compensation</NavLink></div>
                    <div style={{padding: '10px'}}><NavLink to={`${match.url}/projects`} style={{textDecoration: 'none', color: 'black'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}}>Projects</NavLink></div>
                    <div style={{padding: '10px'}}><NavLink to={`${match.url}/immigration`} style={{textDecoration: 'none', color: 'black'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}}>Immigration / E-Verify</NavLink></div>
                    <div style={{padding: '10px'}}><NavLink to={`${match.url}/documents`} style={{textDecoration: 'none', color: 'black'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}}>Documents</NavLink></div>
                   
                    <div style={{padding: '10px', marginTop: '100px'}}>
                    <DialogTrigger>
                        <ActionButton>Delete Employee</ActionButton>
                        <AlertDialog
                            title="Permanently Delete Employee"
                            variant="warning"
                            onPrimaryAction={onDeleteEmployee}
                            secondaryActionLabel="Cancel"
                            primaryActionLabel="Confirm">
                            Are you sure you want to permanently delete this employee?
                        </AlertDialog>
                    </DialogTrigger>
                </div>
            </div>

            <Switch>
                <Redirect from={`${match.path}`} to={`${match.path}/details`} exact />
                <Route path={`${match.path}/details`}><EmployeeDetails employee={employee}/> </Route>
                <Route path={`${match.path}/compensation`}><EmployeeCompensation employee={employee}/></Route>
                <Route path={`${match.path}/projects`}><EmployeeProjects employee={employee}/></Route>
                <Route path={`${match.path}/immigration/:caseNumber`}><EmployeeImmigrationWF/></Route>
                <Route path={`${match.path}/immigration`}><EmployeeImmigration employee={employee}/></Route>

                <Route path={`${match.path}/documents`}><EmployeeDocuments employee={employee}/></Route>
                
            </Switch>

    </>
    )
}

export default EmployeeProfile
