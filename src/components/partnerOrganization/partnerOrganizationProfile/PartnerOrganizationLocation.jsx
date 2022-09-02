import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom';
import FirebaseContext from '../../../firebase/Context';
import { Toast } from 'primereact/toast';
import { ActionButton, Divider, Flex, Form, Heading, Text, TextField, View } from '@adobe/react-spectrum';
import Back from '@spectrum-icons/workflow/BackAndroid';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';
import { Phone } from '@material-ui/icons';

function uuidv4 () {
    return `xxx-4xxx-yxx`.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const ParternOrganizationLocation = (props) => {
    console.log(props);
    const [partnerId] = useState(props.partner.id ?? '');
    // const [newLocationEntry, setNewLocationEntry] = useState({
    //     AddressLine1: "",
    //     AddressLine2: "",
    //     City: "",
    //     email: "",
    //     Contact: "",
    //     phone: "",
    // });
    
    const [AddressLine1, setAddressLine1] = useState('');
    const [AddressLine2, setAddressLine2] = useState('');
    const [City, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [Contact, setContact] = useState('');
    const [phone, setPhone] = useState('');
    const [fax, setfax] = useState('');
    const [locationId, setLocationId] = useState('');

    const [Locations, setLocations] = useState(props.partner.Locations ?? {});

    // const [Locations, setLocations] = useState(() => {

    //     if (props.partner.Locations) {
    //         return Object.keys(props.partner.Locations).map(LocationKey => {
                
    //             return {
    //                 id: LocationKey,
    //                 ...props.partner.Locations[LocationKey]
    //             }
    //         });
    //     } else {
    //         return [];
    //     }

    // }, [props.partner]);


    const [isLoading, setIsLoading] = useState(false);
    const [formMode, setFormMode] = useState('fixed')
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const myToast = useRef(null);
    
    const [columns] = useState([
        {field: 'AddressLine1', header: 'ADDRESS'},
        {field: 'AddressLine2', header: 'ADDRESS'},
        {field: 'City', header: 'City'},
        {field: 'Contact', header: 'Contact'},
        {field: 'phone', header: 'PHONE'},
        {field: 'email', header: 'EMAIL'},
        {field: 'fax', header: 'FAX'},
    ]);

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const onCancelEdit = () => {
        setAddressLine1('');
        setAddressLine2('');
        setCity('');
        setEmail('');
        setContact('');
        setPhone('');
        setfax('');
        setLocationId('');
        setFormMode('fixed');
    }

    const onFormToggleMode = () => {

        // Save To Firebase
        if (formMode === 'edit') {
            setFormMode('fixed');   
            setIsLoading(true);
            console.log(partnerId);

            const newLocation = {       
                AddressLine1: AddressLine1,
                AddressLine2: AddressLine2,
                City: City,
                email: email,
                Contact: Contact,
                phone: phone,
                fax: fax
            }

            if (partnerId !== "") {
                // console.log(newLocation);
                // console.log(Locations);
                let newLocationId = uuidv4();
                let LocationsCP = {...Locations, [newLocationId]: newLocation}
                // LocationsCP.push(newLocation);
                setLocations(LocationsCP);

                let partnerRef = `${firebase.tenantId}_Partners/${partnerId}/Locations/${newLocationId}`
                firebase.db.ref(partnerRef).set(newLocation).then((res) => {
                    setIsLoading(false);
                    showToast('success', 
                    'Sucesffully Saved', 
                    'Changes to Employee Details Saved')
                });
                setIsLoading(false)
            } else {
                setIsLoading(false);
                showToast('error', 
                'Saving Error', 
                'Failed to save changes to DB, missing ID')
            }

        } else if (formMode === 'fixed') {
            setFormMode('edit');
        } else if (formMode === 'edit-existing') {
            
            setFormMode('fixed');   
            setIsLoading(true);
            console.log(partnerId);

            const changesToLocation = {       
                AddressLine1: AddressLine1,
                AddressLine2: AddressLine2,
                City: City,
                email: email,
                Contact: Contact,
                phone: phone,
                fax: fax,
                id: locationId
            }

            if (locationId !== "" || locationId !== null) {

                let LocationsCP = {...Locations};
                LocationsCP[locationId] = changesToLocation

                setLocations(LocationsCP);
                let partnerRef = `${firebase.tenantId}_Partners/${partnerId}/Locations/${locationId}`
                firebase.db.ref(partnerRef).set(changesToLocation).then((res) => {
                    setIsLoading(false);
                    showToast('success', 
                    'Sucesffully Saved', 
                    'Changes to Employee Details Saved');
                    // load 
                });
                setIsLoading(false)
            } else {
                setIsLoading(false);
                showToast('error', 
                'Saving Error', 
                'Failed to save changes to DB, missing ID')
            }
        }
    }

    // const onAddLocation = () => {
        
    // }

    // const onFormChange = (e) => {
    //     // console.log(e.target.name, e.target.value);
    //     let newLocation = {
    //         AddressLine1: "",
    //         AddressLine2: "",
    //         City: "",
    //         email: "",
    //         Contact: "",
    //         phone: "",
    //         ...newLocationEntry
    //     }

    //     newLocation[e.target.name] = e.target.value;
    //     setNewLocationEntry(newLocation);
    //     // setLocations((state) => {
    //     //     console.log(state)
    //     //     let Locations = [...state];
    //     //     Locations.push()
    //     //     return state
    //     // })
    // }

    const onEditLocation = (rowData) => {
        // console.log(rowData);
        setFormMode('edit-existing');
        setAddressLine1(rowData.AddressLine1);
        setAddressLine2(rowData.AddressLine2);
        setCity(rowData.City);
        setEmail(rowData.email);
        setContact(rowData.Contact);
        setPhone(rowData.phone);
        setfax(rowData.fax);
        setLocationId(rowData.id)

    }

    const onDeleteLocation = (rowData) => {
        const locationId = rowData.id;
        
        let locationsCP = {...Locations};
        delete locationsCP[locationId];

        setLocations(locationsCP);

        let partnerRef = `${firebase.tenantId}_Partners/${partnerId}/Locations/${locationId}`
        firebase.db.ref(partnerRef).remove().then((res) => {
            setIsLoading(false);
            showToast('success', 
            'Sucesffully Saved', 
            'Changes to Employee Details Saved');
            // load 
        });
        
    }
 
    const actionButtons = (rowData) => {
        // console.log(rowData);
        return <Flex direction="column">
            <ActionButton
                onPress={() => onEditLocation(rowData)}
                marginBottom="size-100" 
                UNSAFE_className={'bugsy-edit-button'}>
                <Edit/>
                <Text>Edit</Text>
            </ActionButton>
            <ActionButton 
                onPress={() => onDeleteLocation(rowData)}
                UNSAFE_className={'bugsy-delete-button'}>
                <Delete/>
                <Text>Delete</Text>
            </ActionButton>
        </Flex>
    }

    if (isLoading) {
        return <div>Loading Details</div> // Implement Better Loading Screen
    }

    // console.log(Locations);
    return (<>
         <div style={{padding: '20px', height: 'inherit'}}>

            <Toast ref={myToast} />


            <Flex direction="row" justifyContent="space-between">

                <ActionButton onPress={() => history.push('/admin/partners')} isQuiet>
                    <Back />
                </ActionButton>

                <View>
                    { formMode !== 'fixed' ?  <ActionButton  marginEnd="size-175" onPress={onCancelEdit}>Cancel</ActionButton>: null}
                    {/* { formMode !== 'fixed' ?  <ActionButton  marginEnd="size-175" onPress={onAddLocation}>Add Location</ActionButton>: null} */}
                    <ActionButton  onPress={() => onFormToggleMode()} isDisabled={false}>
                   
                        <Text>{formMode === 'fixed' ? 'Add Location' : 'Save'}</Text>
                    </ActionButton>
              
                </View>
            </Flex>

            {/* Form Components */}
            
            {formMode !== 'fixed' || formMode === 'edit-existing' ? <><Heading>Add Location</Heading><Flex justifyContent="space-between" UNSAFE_style={{flexWrap: 'wrap', marginTop: '30px', marginBottom: '50px'}}>
                
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="AddressLine1" onChange={setAddressLine1} value={AddressLine1} labelPosition="side" label="AddressLine1"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="AddressLine2" onChange={setAddressLine2}  value={AddressLine2} labelPosition="side" label="AddressLine2"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="Contact" onChange={setContact}  value={Contact} labelPosition="side" label="Contact"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="City" onChange={setCity}  value={City} labelPosition="side" label="City"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="phone" type="phone" onChange={setPhone}  value={phone} labelPosition="side" label="Phone"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="email" type="email" onChange={setEmail}  value={email} labelPosition="side" label="Email"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="fax" type="fax" onChange={setfax}  value={fax} labelPosition="side" label="Fax"></TextField>
                
            </Flex></> : null}

            {/* <Divider size="M" /> */}
            <Heading>Locations</Heading>
            {console.log('DT', Locations)}
            <div className="data-table" style={{marginTop: '10px'}}>
                <DataTable 
                selectionMode="single" 
                value={Object.keys(Locations).map(LocationKey => {
                
                    return {
                        id: LocationKey,
                        ...Locations[LocationKey]
                    }
                })?? []} 
    
                paginator
                // onRowClick={(rowData) => { history.push({pathname: `${match.url}/${rowData.data.id}`, state: rowData.data})}}
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                >
                    {columns.map(col=> {
                        return <Column key={col.field} field={col.field} header={col.header} />;
                    })}
                    <Column style={{width: '150px'}} header="ACTIONS" body={actionButtons} />
                </DataTable>

            </div>

         </div>
    </>)
}

export default ParternOrganizationLocation
