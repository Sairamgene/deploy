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

const ParternOrganizationManagers = (props) => {

    const [partnerId] = useState(props.partner.id ?? '');
    
    const [Department, setDepartment] = useState('');
    const [Designation, setDesignation] = useState('');
    const [LastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [phone, setPhone] = useState('');
    const [managerId, setManagerId] = useState('');

    // const [managers, setManagers] = useState(() => {

    //     if (props.partner.Managers) {
    //         return Object.keys(props.partner.Managers).map(managerKey => {
    //             return {
    //                 id: managerKey,
    //                 ...props.partner.Managers[managerKey]
    //             }
    //         });
    //     } else {
    //         return [];
    //     }

    // }, [props.partner]);
    const [managers, setManagers] = useState(props.partner.Managers ?? {});
    console.log(managers);

    const [isLoading, setIsLoading] = useState(false);
    const [formMode, setFormMode] = useState('fixed')
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const myToast = useRef(null);
    
    const [columns] = useState([
        {field: 'Department', header: 'DEPARTMENT'},
        {field: 'Designation', header: 'DESIGNATION'},
        {field: 'LastName', header: 'LAST NAME'},
        {field: 'firstName', header: 'FIRST NAME'},
        {field: 'phone', header: 'PHONE'},
        {field: 'email', header: 'EMAIL'},
    ]);

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const onCancelEdit = () => {
        setDepartment('');
        setDesignation('');
        setLastName('');
        setEmail('');
        setFirstName('');
        setPhone('');
        setManagerId('');
        setFormMode('fixed');
    }

    const onFormToggleMode = () => {

        // Save To Firebase
        if (formMode === 'edit') {
            setFormMode('fixed');   
            setIsLoading(true);
            console.log(partnerId);

            const newManager = {       
                Department: Department,
                Designation: Designation,
                LastName: LastName,
                email: email,
                firstName: firstName,
                phone: phone,
            }

            if (partnerId !== "") {
                let newManagerId = uuidv4();
                let managersCP = {...managers, [newManagerId]: newManager};
                setManagers(managersCP);

                let partnerRef = `${firebase.tenantId}_Partners/${partnerId}/Managers/${newManagerId}`
                firebase.db.ref(partnerRef).set(newManager).then((res) => {
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

            const changesToManager = {       
                Department: Department,
                Designation: Designation,
                LastName: LastName,
                email: email,
                firstName: firstName,
                phone: phone,
                id: managerId
            }

            if (managerId !== "" || managerId !== null) {

                let managersCP = {...managers};
                managersCP[managerId] = changesToManager;
                // let changesToManagers = managersCP.map(manager => {
                //     console.log(manager.id, changesToManager.id)
                //     if (manager.id === changesToManager.id) {
                //         return changesToManager
                //     } else {
                //         return manager
                //     }
                // });

                setManagers(managersCP);
                let partnerRef = `${firebase.tenantId}_Partners/${partnerId}/Managers/${managerId}`
                firebase.db.ref(partnerRef).set(changesToManager).then((res) => {
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

    // const onAddManager = () => {
        
    // }

    // const onFormChange = (e) => {
    //     // console.log(e.target.name, e.target.value);
    //     let newManager = {
    //         Department: "",
    //         Designation: "",
    //         LastName: "",
    //         email: "",
    //         firstName: "",
    //         phone: "",
    //         ...newManagerEntry
    //     }

    //     newManager[e.target.name] = e.target.value;
    //     setNewManagerEntry(newManager);
    //     // setManagers((state) => {
    //     //     console.log(state)
    //     //     let managers = [...state];
    //     //     managers.push()
    //     //     return state
    //     // })
    // }

    const onEditManager = (rowData) => {
        // console.log(rowData);
        setFormMode('edit-existing');
        setDepartment(rowData.Department);
        setDesignation(rowData.Designation);
        setLastName(rowData.LastName);
        setEmail(rowData.email);
        setFirstName(rowData.firstName);
        setPhone(rowData.phone);
        setManagerId(rowData.id);

    }

    const onDeleteManager = (rowData) => {
        const managerId = rowData.id;

        console.log(managerId);
        // let managersCP = [...managers];
        // let changesToManagers = managersCP.filter(manager => manager.id !== rowData.id);
        let managersCP = {...managers};
        delete managersCP[managerId];
        console.log(managersCP)
        setManagers(managersCP);
        
        let partnerRef = `${firebase.tenantId}_Partners/${partnerId}/Managers/${managerId}`
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
                onPress={() => onEditManager(rowData)}
                marginBottom="size-100" 
                UNSAFE_className={'bugsy-edit-button'}>
                <Edit/>
                <Text>Edit</Text>
            </ActionButton>
            <ActionButton 
                onPress={() => onDeleteManager(rowData)}
                UNSAFE_className={'bugsy-delete-button'}>
                <Delete/>
                <Text>Delete</Text>
            </ActionButton>
        </Flex>
    }

    if (isLoading) {
        return <div>Loading Details</div> // Implement Better Loading Screen
    }

    // console.log(managers);
    return (<>
         <div style={{padding: '20px', height: 'inherit'}}>

            <Toast ref={myToast} />


            <Flex direction="row" justifyContent="space-between">

                <ActionButton onPress={() => history.push('/admin/partners')} isQuiet>
                    <Back />
                </ActionButton>

                <View>
                    { formMode !== 'fixed' ?  <ActionButton  marginEnd="size-175" onPress={onCancelEdit}>Cancel</ActionButton>: null}
                    {/* { formMode !== 'fixed' ?  <ActionButton  marginEnd="size-175" onPress={onAddManager}>Add Manager</ActionButton>: null} */}
                    <ActionButton  onPress={() => onFormToggleMode()} isDisabled={false}>
                   
                        <Text>{formMode === 'fixed' ? 'Add Manager' : 'Save'}</Text>
                    </ActionButton>
              
                </View>
            </Flex>

            {/* Form Components */}
            
            {formMode !== 'fixed' || formMode === 'edit-existing' ? <><Heading>Add Manager</Heading><Flex justifyContent="space-between" UNSAFE_style={{flexWrap: 'wrap', marginTop: '30px', marginBottom: '50px'}}>
                
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="Department" onChange={setDepartment} value={Department} labelPosition="side" label="Department"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="Designation" onChange={setDesignation}  value={Designation} labelPosition="side" label="Designation"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="firstName" onChange={setFirstName}  value={firstName} labelPosition="side" label="First Name"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="LastName" onChange={setLastName}  value={LastName} labelPosition="side" label="Last Name"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="phone" type="phone" onChange={setPhone}  value={phone} labelPosition="side" label="Phone"></TextField>
                    <TextField  width="50%" isQuiet UNSAFE_className={'details-text-field'}  name="email" type="email" onChange={setEmail}  value={email} labelPosition="side" label="Email"></TextField>
                
            </Flex></> : null}

            {/* <Divider size="M" /> */}
            <Heading>Managers</Heading>

            <div className="data-table" style={{marginTop: '10px'}}>
                <DataTable 
                selectionMode="single" 
                value={Object.keys(managers).map(managerKey => {
                        return {
                            id: managerKey,
                            ...managers[managerKey]
                        }
                    })} 
                
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

export default ParternOrganizationManagers
