import React, { useState } from 'react';
import { TextField, Form, ActionButton, Picker, Item, Flex } from '@adobe/react-spectrum'

import * as utils from '../../../../../utils';


import "./EmployeeDetails.css"
import { Calendar } from 'primereact/calendar';

const EmployeeDetails = (props) => {
    // state= this.props.employeeDetails
    const [firstName, setFirstName]            = useState(props.employeeDetails.firstName);
    const [lastName, setLastName]             = useState(props.employeeDetails.lastName);
    const [middleInitial, setMiddleInitial]   = useState(props.employeeDetails.middleInitial);
    const [phone, setPhone]                   = useState(props.employeeDetails.phone);
    const [mobile, setMobile]                 = useState(props.employeeDetails.mobile);
    const [address, setAddress]               = useState(props.employeeDetails.address);
    const [email, setEmail]                   = useState( props.employeeDetails.email);
    const [ssn, setSSN]                       = useState(props.employeeDetails.ssn);
    const [vendor, setVendor]                 = useState(props.employeeDetails.vendor);
    const [vendorLocation, setVendorLocation] = useState(props.employeeDetails.vendorLocation);
    const [vendorContact, setVendorContact]   = useState(props.employeeDetails.vendorContact);
    
    const [employeeType, setEmployeeType]     = useState(props.employeeDetails.employeeType);
    const [startDate, setStartDate]           = useState(props.employeeDetails.startDate);
    const [employeeStatus, setEmployeeStatus] = useState(props.employeeDetails.employeeStatus);
    const [profileTitle, setProfileTitle]       = useState(props.employeeDetails.profileTitle);
    const [maritalStatus, setMaritalStatus]   = useState(props.employeeDetails.maritalStatus);
    const [currentLocation, setCurrentLocation] = useState(props.employeeDetails.currentLocation);
    const [dob, setDob]                         = useState(props.employeeDetails.dob);

    let employeeTypes = [
        {key: 'FULLTIME', name: 'Full Time'},
        {key: 'VENDOR', name: 'Vendor'},
        {key: 'INDIVIDUAL', name: 'Individual/Conractor'},
      ];

      let maritalStatusTypes = [
        {key: 'SINGLE', name: 'Single'},
        {key: 'MARRIED', name: 'Married'},
      ];



    const buttonDisabled = () => {
        return !utils.validate_email(email) ||
         !utils.validate_firstName(firstName) || 
         !utils.validate_lastName(lastName)
    }

    return (<>
        <div className="row">
            <div className="col-md-6">
                <Form isQuiet marginTop="20px" direction="column" width="100%">

                    <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Employee Type"
                        labelPosition="side"
                        defaultSelectedKey={employeeType}
                        items={employeeTypes}
                        onSelectionChange={setEmployeeType}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker>

                    <Flex UNSAFE_className="details-calendar-input">
                        <label htmlFor="visaExpiry">Start Date</label>
                        <Calendar width="100%" id="visaExpiry" className="onboarding-calendar-input" value={new Date(startDate)} showIcon onChange={(e) => setStartDate(new Date(e.value).toISOString())}  />
                    </Flex>

                    <TextField labelPosition="side" validationState={utils.validate_firstName(firstName) ? 'valid' : 'invalid'} UNSAFE_className="onboarding-details-text-field" 
                    label="First Name" isRequired inputMode="text" onChange={setFirstName} defaultValue={firstName}/>

                    <TextField labelPosition="side" validationState={utils.validate_lastName(lastName) ? 'valid': 'invalid'} UNSAFE_className="onboarding-details-text-field" 
                    label="Last Name" isRequired inputMode="text" onChange={setLastName} defaultValue={lastName}/>

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Middle Initial" inputMode="text" onChange={setMiddleInitial} defaultValue={middleInitial}/>

                    <Flex UNSAFE_className="details-calendar-input">
                        <label htmlFor="dob">Date of Birth</label>
                        <Calendar yearNavigator yearRange="1910:2021" width="100%" id="dob" className="onboarding-calendar-input" value={new Date(dob)} showIcon onChange={(e) => setDob(new Date(e.value).toISOString())}  />
                    </Flex>


                    {/* <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Marital Status" inputMode="text" onChange={setMaritalStatus} defaultValue={maritalStatus}/> */}
                    <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Marital Status"
                        labelPosition="side"
                        defaultSelectedKey={maritalStatus}
                        items={maritalStatusTypes}
                        onSelectionChange={setMaritalStatus}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker>

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field" 
                    label="Phone" inputMode="text" onChange={setPhone} defaultValue={phone}/>

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field" 
                    label="Mobile" inputMode="text" onChange={setMobile} defaultValue={mobile}/>

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Address" inputMode="text" onChange={setAddress} defaultValue={address}/>

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Employee Status" inputMode="text" onChange={setEmployeeStatus} defaultValue={employeeStatus}/>

                  

                </Form>
            </div>
            <div className="col-md-6">
                <Form isQuiet marginTop="20px" direction="column" width="100%">
                <TextField labelPosition="side" validationState={utils.validate_email(email) ? 'valid' : 'invalid'} UNSAFE_className="onboarding-details-text-field" 
                    label="Email" inputMode="text" isRequired onChange={setEmail} defaultValue={email}/>

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="SSN" inputMode="text" onChange={setSSN} defaultValue={ssn}/>

                    { employeeType === 'VENDOR' ?
                        <>
                           <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field" 
                    label="Vendor" inputMode="text" onChange={setVendor} defaultValue={vendor}/>

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field" 
                    label="Vendor Location" inputMode="text" onChange={setVendorLocation} defaultValue={vendorLocation}/>

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Vendor Contact" inputMode="text" onChange={setVendorContact} defaultValue={vendorContact}/>

                        </> : null
                    }

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Profile Title" inputMode="text" onChange={setProfileTitle} defaultValue={profileTitle}/>

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Current Location" inputMode="text" onChange={setCurrentLocation} defaultValue={currentLocation}/>

 
                

                </Form>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <div style={{width: '100%', height: '100px', background: 'transparent', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{alignSelf: 'center', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <ActionButton UNSAFE_className="global-action-btn" isDisabled={props.activeStep === 0} onPress={() => props.handleBack()}>Back</ActionButton>
                        <div>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={buttonDisabled()} onPress={()=> props.handleNext({...{
                                firstName, lastName, middleInitial,
                                phone, mobile, address, 
                                email, ssn, vendor, 
                                vendorLocation, vendorContact,
                                startDate, employeeStatus, profileTitle,
                                maritalStatus, currentLocation,
                                dob
                                }})}>Save</ActionButton>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={buttonDisabled()} onPress={()=> props.handleNext({...{
                                firstName, lastName, middleInitial,
                                phone, mobile, address, 
                                email, ssn, vendor, 
                                vendorLocation, vendorContact, 
                                startDate, employeeStatus, profileTitle,
                                maritalStatus, currentLocation,
                                dob
                            }})} marginStart="size-250">Save & Next</ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>);
    
}

export default EmployeeDetails;