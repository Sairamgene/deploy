import { ActionButton, Flex, View, Text, Form, TextField, Picker} from '@adobe/react-spectrum';
import { Toast } from 'primereact/toast';
import React, { useContext, useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import FirebaseContext from '../../../firebase/Context';
import Back from '@spectrum-icons/workflow/BackAndroid';

const PartnerOrganizationDetails = (props) => {
    
    const [partnerId] = useState(() => {
        if (props.partner.id === 'addpartner') {
            return ''
        } else {
            return props.partner.id ?? ''
        }

    });
    const [OrganizationName, setOrganizationName] = useState(props.partner.OrganizationName ?? '');
    const [AddressLine1, setAddressLine1] = useState(props.partner.AddressLine1 ?? '');
    const [AddressLine2, setAddressLine2] = useState(props.partner.AddressLine2 ?? '');
    const [City, setCity] = useState(props.partner.City ?? '');
    const [Fax, setFax] = useState(props.partner.Fax ?? '');
    const [Locations, setLocations] = useState(props.partner.Locations ?? {}) ;
    const [Managers, setManagers] = useState(props.partner.Managers ?? {});
    const [consumer, setConsumer] = useState(props.partner.consumer ?? '');
    const [contact, setContact] = useState(props.partner.contact ?? '');
    const [directClient, setDirectClient] = useState(props.partner.directClient ?? 0);
    const [directVendor, setDirectVendor] = useState(props.partner.directVendor ?? 0);
    const [email, setEmail] = useState(props.partner.email ?? '');
    const [id, setId] = useState(props.partner.id ?? null);
    const [phone, setPhone] = useState(props.partner.phone ?? '');
    const [provider, setProvider] = useState(props.partner.provider ?? 0);

    const [isLoading, setIsLoading] = useState(false);
    const [formMode, setFormMode] = useState('fixed')
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const myToast = useRef(null);

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    // useEffect(() => {
    //     console.log('history', history);
    //     console.log('history', partnerId)
    // }, [partnerId])

    const onCancelEdit = () => {
         setOrganizationName(props.partner.OrganizationName ?? '');
         setAddressLine1(props.partner.AddressLine1 ?? '');
         setAddressLine2(props.partner.AddressLine2 ?? '');
         setCity(props.partner.City ?? '');
         setFax(props.partner.Fax ?? '');
         setLocations(props.partner.Locations ?? {}) ;
         setManagers(props.partner.Managers ?? {});
         setConsumer(props.partner.consumer ?? '');
         setContact(props.partner.contact ?? '');
         setDirectClient(props.partner.directClient ?? 0);
         setDirectVendor(props.partner.directVendor ?? 0);
         setEmail(props.partner.email ?? '');
         setId(props.partner.id ?? null);
         setPhone(props.partner.phone ?? '');
         setProvider(props.partner.provider ?? 0);
         setFormMode('fixed');
    }


    const uuidv4 = () => {
        return `xxx-4xxx-yxx`.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    const onFormToggleMode = () => {

        // Save To Firebase
        if (formMode === 'edit') {
            setFormMode('fixed');   
            setIsLoading(true);
            // console.log(employeeId);

            const changes = {       
                OrganizationName: OrganizationName,
                AddressLine1: AddressLine1,
                AddressLine2: AddressLine2,
                City: City,
                Fax: Fax,
                Locations: Locations,
                Managers: Managers,
                consumer: consumer,
                contact: contact,
                directClient: directClient,
                directVendor: directVendor,
                email: email,
                id: id,
                phone: phone,
                provider: provider,
            }

            if (partnerId !== "") {
                console.log(changes)
                let partnerRef = `${firebase.tenantId}_Partners/${partnerId}`;
                firebase.db.ref(partnerRef).set({...changes}).then(res => {
                    setIsLoading(false);
                        showToast('success', 
                        'Sucesffully Saved', 
                        'Changes to Employee Details Saved')
                })
                // firebase.employees(partnerId).set({...props.employee, ...changes, updatedAt: firebase.serverValue.TIMESTAMP}).then((res) => {
                //     setIsLoading(false);
                //     showToast('success', 
                //     'Sucesffully Saved', 
                //     'Changes to Employee Details Saved')
                // });
            } else {
                setIsLoading(false);
                console.log(changes);
                const id = uuidv4();
                const newPartner = {
                    [id] : {       
                        OrganizationName: OrganizationName,
                        AddressLine1: AddressLine1,
                        AddressLine2: AddressLine2,
                        City: City,
                        Fax: Fax,
                        Locations: Locations,
                        Managers: Managers,
                        consumer: consumer,
                        contact: contact,
                        directClient: directClient,
                        directVendor: directVendor,
                        email: email,
                        phone: phone,
                        provider: provider,
                    }
                }

                
                let partnersRef = `${firebase.tenantId}_Partners/`;
                firebase.db.ref(partnersRef).once('value').then(res => {
                    console.log(res.val())
                    const partners = {...res.val(), ...newPartner };
                    console.log(partners);

                    let partnerRef = `${firebase.tenantId}_Partners/`;
                    firebase.db.ref(partnerRef).set({...partners}).then(res => {
                    setIsLoading(false);
                        showToast('success', 
                        'Sucesffully Saved', 
                        'Changes to Employee Details Saved')
                        history.push(`/admin/partners/${id}/details`);
                        window.location.reload();
                        // history.push('/admin/partners')
                        
                    })

                })
                
                // showToast('error', 
                // 'Saving Error', 
                // 'Failed to save changes to DB, missing ID')
            }

        } else if (formMode === 'fixed') {
            setFormMode('edit');
        }
    }

    if (isLoading) {
        return <div>Loading Details</div> // Implement Better Loading Screen
    }


    // console.log(props.partner);
    return (<>
            <div style={{padding: '20px', height: 'inherit'}}>

                    <Toast ref={myToast} />

                    {/* <ActionButton onPress={() => history.push('/admin/employees')} isQuiet>
                        <Back />
                    </ActionButton> */}

                <Flex direction="row" justifyContent="space-between">

                    <ActionButton onPress={() => history.push('/admin/partners')} isQuiet>
                        <Back />
                    </ActionButton>

                    <View>
                        { formMode !== 'fixed' ?  <ActionButton  marginEnd="size-175" onPress={onCancelEdit}>Cancel</ActionButton>: null}
                        <ActionButton  onPress={() => onFormToggleMode()} isDisabled={false}>
                        {/* {formMode === 'fixed' ?  <Edit /> :  <SaveFloppy />} */}
                            <Text>{formMode === 'fixed' ? 'Edit' : 'Save'}</Text>
                        </ActionButton>
                    </View>
                </Flex>
                <Flex>
                    <Form isQuiet marginTop="20px" direction="column" maxWidth="500px" minWidth="50%">
                        <TextField UNSAFE_className={'details-text-field'} isRequired inputMode="text"  name="organizationName" onChange={setOrganizationName} label="Organization Name" labelPosition="side" value={OrganizationName} isReadOnly={formMode === 'fixed'}/>
                        <TextField UNSAFE_className={'details-text-field'} isRequired name="AddressLine1" onChange={setAddressLine1} label="Address Line 1" labelPosition="side" value={AddressLine1}  isReadOnly={formMode === 'fixed'}/>
                        <TextField UNSAFE_className={'details-text-field'} isRequired name="AddressLine2" onChange={setAddressLine2} label="Address Line 2" labelPosition="side" value={AddressLine2}  isReadOnly={formMode === 'fixed'}/>
                        <TextField UNSAFE_className={'details-text-field'} isRequired name="City" onChange={setCity} label="City" labelPosition="side" value={City}  isReadOnly={formMode === 'fixed'}/>
                        
                        <TextField UNSAFE_className={'details-text-field'} isRequired name="contact" onChange={setContact} label="Contact" labelPosition="side" value={contact}  isReadOnly={formMode === 'fixed'}/>
                        <TextField UNSAFE_className={'details-text-field'} name="email" 
                        onChange={setEmail} label="Email" labelPosition="side" 
                        value={email} isReadOnly={formMode === 'fixed'}/>


                        <TextField UNSAFE_className={'details-text-field'} name="phone" 
                        onChange={setPhone} label="Phone" type="telephone" labelPosition="side" value={phone} isReadOnly={formMode === 'fixed'}/>

<TextField UNSAFE_className={'details-text-field'} name="Fax" onChange={setFax} label="Fax" labelPosition="side" value={Fax} isReadOnly={formMode === 'fixed'}/>
                        
                    </Form>

                </Flex>

            </div>
    </>)
}

export default PartnerOrganizationDetails
