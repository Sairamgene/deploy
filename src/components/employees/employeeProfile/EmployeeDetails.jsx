import { ActionButton, Button, Flex, Form, Item, Picker, Text, TextField, View } from '@adobe/react-spectrum';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory} from 'react-router-dom';
import Back from '@spectrum-icons/workflow/BackAndroid';
import Edit from '@spectrum-icons/workflow/Edit';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import { Toast } from 'primereact/toast';
import * as utils from '../../../utils';

import './EmployeeDetails.css';
import FirebaseContext from '../../../firebase/Context';

import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Calendar } from 'primereact/calendar';

const EmployeeDetails = (props) => {

    console.log('employee details', props)

    const [employeeId]                      = useState(props.employee.id);
    const [firstName, setFirstName]          = useState(props.employee.firstName ?? '');
    const [lastName, setLastName]           = useState(props.employee.lastName ?? '');
    const [middleInitial, setMiddleInitial] = useState(props.employee.middleInitial ?? '');
    const [phone, setPhone]                 = useState(props.employee.phone ?? '');
    const [mobile, setMobile]               = useState(props.employee.mobile ?? '');
    const [address, setAddress]             = useState(props.employee.address ?? '');
    const [email, setEmail]                 = useState(props.employee.email ?? '');
    const [ssn, setSSN]                     = useState(props.employee.ssn ?? '');

    const [employeeType, setEmployeeType]     = useState(props.employee.employeeType ?? 'FULLTIME');
    const [startDate, setStartDate]           = useState(props.employee.startDate ?? '');
    const [employeeStatus, setEmployeeStatus] = useState(props.employee.employeeStatus ?? '');
    const [profileTitle, setProfileTitle]       = useState(props.employee.profileTitle ?? null);
    const [maritalStatus, setMaritalStatus]   = useState(props.employee.maritalStatus ?? 'SINGLE');
    // const [currentLocation, setCurrentLocation] = useState(props.employee.currentLocation);
    const [dob, setDob]                         = useState(props.employee.dob ?? '');

    let employeeTypes = [
        {key: 'FULLTIME', name: 'Full Time'},
        {key: 'VENDOR', name: 'Vendor'},
        {key: 'INDIVIDUAL', name: 'Individual/Conractor'},
      ];

      let maritalStatusTypes = [
        {key: 'SINGLE', name: 'Single'},
        {key: 'MARRIED', name: 'Married'},
      ];


    const [isLoading, setIsLoading] = useState(false);
    const [formMode, setFormMode] = useState('fixed')
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const myToast = useRef(null);

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const onCancelEdit = () => {
        setFirstName(props.employee.firstName ?? '');
        setLastName(props.employee.lastName ?? '');
        setMiddleInitial(props.employee.middleInitial ?? '');
        setPhone(props.employee.phone ?? '');
        setMobile(props.employee.mobile ?? '');
        setAddress(props.employee.address ?? '');
        setEmail(props.employee.email ?? '');
        setSSN(props.employee.ssn ?? '')
        setEmployeeType(props.employee.employeeType ?? 'FULLTIME');
        setStartDate(props.employee.startDate ?? '');
        setEmployeeStatus(props.employee.employeeStatus ?? '');
        setProfileTitle(props.employee.profileTitle ?? '');
        setMaritalStatus(props.employee.maritalStatus ?? 'SINGLE');
        // setCurrentLocation(props.employee.currentLocation);
        setDob(props.employee.dob);
        setFormMode('fixed');
    }

    const onFormToggleMode = () => {

        // Save To Firebase
        if (formMode === 'edit') {
            setFormMode('fixed');   
            setIsLoading(true);
            console.log(employeeId);

            const changes = {       
                firstName: firstName,
                lastName: lastName,
                middleInitial: middleInitial,
                phone: phone,
                mobile: mobile,
                address: address,
                email: email,
                ssn: ssn,

                startDate: startDate,
                employeeStatus: employeeStatus,
                profileTitle: profileTitle,
                maritalStatus: maritalStatus,
                // currentLocation: currentLocation,
                dob: dob
            }

            if (employeeId !== "") {
                firebase.employees(employeeId).set({...props.employee, ...changes, updatedAt: firebase.serverValue.TIMESTAMP}).then((res) => {
                    setIsLoading(false);
                    showToast('success', 
                    'Sucesffully Saved', 
                    'Changes to Employee Details Saved')
                });
            } else {
                setIsLoading(false);
                showToast('error', 
                'Saving Error', 
                'Failed to save changes to DB, missing ID')
            }

        } else if (formMode === 'fixed') {
            setFormMode('edit');
        }
    }

    if (isLoading) {
        return <div>Loading Details</div> // Implement Better Loading Screen
    }

    const buttonDisabled = () => {
        return !utils.validate_email(email) ||
         !utils.validate_firstName(firstName) || 
         !utils.validate_lastName(lastName)
    }
    
    return (<>
        <div style={{padding: '20px', height: 'inherit'}}>

            <Toast ref={myToast} />

            <Flex direction="row" justifyContent="space-between">

                <ActionButton onPress={() => history.push('/admin/employees')} isQuiet>
                    <Back />
                    <Text>Cancel</Text>
                </ActionButton>

                <View>
                    { formMode !== 'fixed' ?  <ActionButton  marginEnd="size-175" onPress={onCancelEdit}>Cancel</ActionButton>: null}
                    <ActionButton  onPress={() => onFormToggleMode()} isDisabled={buttonDisabled()}>
                        <Text>{formMode === 'fixed' ? 'Edit' : 'Save'}</Text>
                    </ActionButton>
                </View>

            </Flex>

        <Flex>
            <Form isQuiet marginTop="20px" direction="column" maxWidth="500px" minWidth="50%">

                <TextField validationState={utils.validate_firstName(firstName) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} isRequired inputMode="text"  name="firstName" onChange={setFirstName} label="First Name" labelPosition="side" value={firstName} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_lastName(lastName) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} isRequired name="lastName" onChange={setLastName} label="Last Name" labelPosition="side" value={lastName}  isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_middleInitial(middleInitial) ? 'valid' : 'invalid'} maxLength={1} UNSAFE_className={'details-text-field'} name="middleInitial" onChange={setMiddleInitial} label="M.I." labelPosition="side" value={middleInitial} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_phone(phone) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} name="phone" 
                 onChange={setPhone} label="Phone" type="telephone" labelPosition="side" value={phone} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_phone(mobile) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} name="mobile" onChange={setMobile} label="Mobile" labelPosition="side" value={mobile} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_address(address) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} name="address" onChange={setAddress} label="Address" labelPosition="side" value={address} isReadOnly={formMode === 'fixed'}/>
                
                <TextField UNSAFE_className={'details-text-field'} name="email" 
                validationState={utils.validate_email(email) ? 'valid' : 'invalid'} 
                onChange={setEmail} label="Email" labelPosition="side" 
                value={email} isReadOnly={formMode === 'fixed'}/>
                
                <TextField validationState={utils.validate_ssn(ssn) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} name="ssn" onChange={setSSN} label="SSN" labelPosition="side" value={ssn} isReadOnly={formMode === 'fixed'}/>

             

            </Form>
            {/* NEW FIELDS */}
            <Form isQuiet marginTop="20px" direction="column" maxWidth="500px" minWidth="50%" marginStart="15px">
            <Picker
                    UNSAFE_className="onboarding-details-picker"
                    label="Employee Type"
                    isDisabled={formMode === 'fixed'}
                    labelPosition="side"
                    defaultSelectedKey={employeeType}
                    items={employeeTypes}
                    onSelectionChange={setEmployeeType}>
                    {(item) => <Item>{item.name}</Item>}
                </Picker>

                <Flex UNSAFE_className="details-calendar-input">
                        <label htmlFor="startDate">Start Date</label>
                        <Calendar 
                            width="100%"
                            id="startDate" 
                            disabled={formMode === 'fixed'}
                            className="onboarding-calendar-input" 
                            value={new Date(startDate)} 
                            showIcon 
                            onChange={(e) => setStartDate(new Date(e.value).toISOString())}  />
                </Flex>

                <TextField labelPosition="side"    isDisabled={formMode === 'fixed'}  UNSAFE_className="onboarding-details-text-field" 
                    label="Profile Title" inputMode="text" onChange={setProfileTitle} defaultValue={profileTitle}/>



                <Flex UNSAFE_className="details-calendar-input">
                        <label htmlFor="dob">Date of Birth</label>
                        <Calendar yearNavigator disabled={formMode === 'fixed'}   yearRange="1910:2021" width="100%" id="dob" className="onboarding-calendar-input" value={new Date(dob)} showIcon onChange={(e) => setDob(new Date(e.value).toISOString())}  />
                    </Flex>

                    <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Marital Status"
                        labelPosition="side"
                        isDisabled={formMode === 'fixed'}
                        defaultSelectedKey={maritalStatus}
                        items={maritalStatusTypes}
                        onSelectionChange={setMaritalStatus}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker>

                    <TextField labelPosition="side"  
                    isDisabled={formMode === 'fixed'}
                    UNSAFE_className="onboarding-details-text-field" 
                    label="Employee Status" inputMode="text" onChange={setEmployeeStatus} defaultValue={employeeStatus}/>

                {/* <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Current Location" inputMode="text" onChange={setCurrentLocation} defaultValue={currentLocation}/> */}

 

            </Form>
        </Flex>
        
        </div>
        
    </>
    )
}

export default EmployeeDetails
