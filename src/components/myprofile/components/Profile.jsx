import { Divider, Form, Header, TextField } from '@adobe/react-spectrum'
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Profile.css';

const Profile = () => {

    const profile = useSelector((store) => { return store.employee.profile })

    useEffect(() => {
        // console.log('COMPONENT DID MOUNT')
        // console.log(profile);
    }, [])


    return (
        <div className="row" style={{marginTop: '50px'}}>
            <div className="col-md-6">

            <Form isQuiet aria-label="Quiet example">
                <TextField labelPosition="side" UNSAFE_className={'text-field'} label="First Name" value={profile.firstName}/>
                <TextField labelPosition="side" UNSAFE_className={'text-field'} label="Last Name" value={profile.lastName}/>
                <TextField labelPosition="side" UNSAFE_className={'text-field'} label="Middle Initial" type="text" maxLength={1} value={profile.middleInitial}/>
                <TextField labelPosition="side" UNSAFE_className={'text-field'} inputMode="tel" type="tel" label="Phone" value={profile.phone}/>
                <TextField labelPosition="side" UNSAFE_className={'text-field'} inputMode="tel" type="tel" label="Mobile" value={profile.mobile}/>
                <TextField labelPosition="side" UNSAFE_className={'text-field'} label="Address" value={profile.address}/>
                <TextField labelPosition="side" UNSAFE_className={'text-field'} inputMode="email" type="email" label="email" value={profile.email}/>
            </Form>
            </div>

            <div className="col-md-6">
                <Header id="management" marginTop="size-150" marginBottom="size-50">Management</Header>
                <Divider size="M"/>
                <Form isQuiet aria-label="Quiet example">
                    <TextField labelPosition="side" UNSAFE_className={'text-field'} label="Manager"  value={profile.manager}/>
                    <TextField labelPosition="side" UNSAFE_className={'text-field'} label="Department"  value={profile.department}/>
                    
                </Form>
                <Header id="management" marginTop="size-150" marginBottom="size-50">Project Details</Header>
                <Divider size="M"/>
                <Form isQuiet aria-label="Quiet example">
                    <TextField labelPosition="side" UNSAFE_className={'text-field'} label="Current Project" />
                    <TextField labelPosition="side" UNSAFE_className={'text-field'} label="Project Role"   />
                    <TextField labelPosition="side" UNSAFE_className={'text-field'} label="Project Location" type="address" />
                </Form>
            </div>
        </div>
    )
}

export default Profile
