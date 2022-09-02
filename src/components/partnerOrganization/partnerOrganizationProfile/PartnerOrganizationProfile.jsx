import { Flex, Heading, ProgressCircle, Button, DialogTrigger, ActionButton, AlertDialog} from '@adobe/react-spectrum';
import Snapshot from '@spectrum-icons/workflow/Snapshot';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, Switch, Route, Redirect, useRouteMatch, useParams, useHistory} from 'react-router-dom';
import FirebaseContext from '../../../firebase/Context';

import userImage from '../../../assets/svgs/badge.svg'
import './PartnerOrganizationProfile.css'
import PartnerOrganizationDetails from './PartnerOrganizationDetails';
import PartnerOrganizationManagers from './ParternOrganizationManagers';
import PartnerOrganizationLocation from './PartnerOrganizationLocation';
import { Toast } from 'primereact/toast';

// import EmployeeDetails from './EmployeeDetails';
// import EmployeeCompensation from './EmployeeCompensation';
// import EmployeeDocuments from './EmployeeDocuments';
// import EmployeeProjects from './EmployeeProjects';
// import EmployeeImmigration from './EmployeeImmigration';
// import EmployeeImmigrationWF from './EmployeeImmigrationWF/EmployeeImmigrationWF';

const PartnerOrganizationProfile = () => {

    const match = useRouteMatch()
    const params = useParams();
    const [partner, setPartner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(userImage);
    const tenantId = useSelector((store) => store.auth.tenantId);
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const myToast = useRef(null);

    useEffect(() => {
        
        const partnerId = params.partnerId; // will always have partnerId if clicked from table
        
        if (partnerId) {
            // means clicked from table, load partnerId
            let partnerRef = `${firebase.tenantId}_Partners/${partnerId}`;
            console.log(partnerRef);
            firebase.db.ref(partnerRef).on('value', (res) => {
                const partner = res.val();
                setPartner({
                    ...partner,
                    id: partnerId
                })
            }, [])

        } else {
            setPartner({
                OrganizationName: '',
                AddressLine1: '',
                AddressLine2: '',
                City: '',
                Fax: '',
                Locations: {},
                Managers: {},
                consumer: 0,
                contact: '',
                directClient: 0,
                directVendor: 0,
                email: '',
                id: null,
                phone: '',
                provider: '',
            });
        }

        setIsLoading(false)
        
    }, []);

    if (isLoading || !partner) {
        return <>
            <Flex alignItems="center" justifyContent="center" height="100%">
                <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
            </Flex>
        </>
    }

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }


    const  onDeletePartner =() => {

        // sample: https://bugsy-crm.firebaseio.com/COVET_employees/-MPkL-YSC4kWDVbaIUeN
        const partnerId = params.partnerId ?? partner.id; // will always have employeeID
        let partnerRef = `${firebase.tenantId}_Partners/${partnerId}`;
        
        firebase.db.ref(partnerRef).remove().then(res => {
            showToast('success', 
                    'Sucesffully Deleted', 
                    `Sucesfully Deleted Partner ${partnerId}`);
          
            history.push('/admin/partners');

        }).catch(err => {
            showToast('error', 
            'Deleting Error', 
            'Failed to Delete Employee')
        })
    }
    
    return (<>
            
            {/* SIDE NAVIGATION */}
            <div className="side-nav">
                <Toast ref={myToast} />
                <img src={imageUrl} alt="user" className="details-profile-image"></img> 
                
                <Heading level={3}>{`${partner.OrganizationName}`}</Heading>
                <div style={{padding: '10px'}}>   <NavLink to={`${match.url}/details`} style={{textDecoration: 'none', color: 'black'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}}>Details</NavLink></div>
                    <div style={{padding: '10px'}}><NavLink to={`${match.url}/managers`} style={{textDecoration: 'none', color: 'black'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}}>Managers</NavLink></div>
                    <div style={{padding: '10px'}}><NavLink to={`${match.url}/locations`} style={{textDecoration: 'none', color: 'black'}} activeStyle={{borderBottom: '3px solid #36BFEC', color: '#36BFEC'}}>Locations</NavLink></div>
                    <div style={{padding: '10px', marginTop: '100px'}}>
                    <DialogTrigger>
                        <ActionButton isDisabled={partner.id === null ? true : false}>Delete Partner</ActionButton>
                        <AlertDialog
                            title="Permanently Delete Partner"
                            variant="warning"
                            onPrimaryAction={onDeletePartner}
                            secondaryActionLabel="Cancel"
                            primaryActionLabel="Confirm">
                            Are you sure you want to permanently delete this Partner?
                        </AlertDialog>
                    </DialogTrigger>
                </div>
            </div>

            <Switch>
                <Redirect from={`${match.path}`} to={`${match.path}/details`} exact />
                <Route path={`${match.path}/details`}><PartnerOrganizationDetails partner={partner}/></Route>
                <Route path={`${match.path}/managers`}><PartnerOrganizationManagers partner={partner}/></Route>
                <Route path={`${match.path}/locations`}><PartnerOrganizationLocation partner={partner}/></Route>
                {/* <Route path={`${match.path}/details`}><EmployeeDetails employee={employee}/> </Route>
                <Route path={`${match.path}/compensation`}><EmployeeCompensation employee={employee}/></Route>
                <Route path={`${match.path}/projects`}><EmployeeProjects employee={employee}/></Route>
                <Route path={`${match.path}/immigration/:caseNumber`}><EmployeeImmigrationWF/></Route>
                
                <Route path={`${match.path}/immigration`}><EmployeeImmigration employee={employee}/></Route>

                <Route path={`${match.path}/documents`}><EmployeeDocuments employee={employee}/></Route> */}
                
            </Switch>

    </>
    )
}

export default PartnerOrganizationProfile
