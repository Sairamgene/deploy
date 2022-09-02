import { ActionButton, Button, Flex, Item, Picker, Text, Form, TextField, Header, Divider, View, DialogTrigger, Dialog, Heading, Content, Footer} from '@adobe/react-spectrum'
import Back from '@spectrum-icons/workflow/BackAndroid'

import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
// import Edit from '@spectrum-icons/workflow/Edit';
// import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import { Calendar } from 'primereact/calendar';


import './EmployeeImmigration.css';

import FirebaseContext from '../../../firebase/Context';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonGroup } from '@material-ui/core';

  
const EmployeeImmigration = (props) => {
    console.log(props)
    const [employeeId]                                  = useState(props.employee.id);
    const [employeeImmigration, setEmployeeImmigration] = useState(null);
    const [workAuthorization, setWorkAuthorization]     = useState('');
    const [formI94Expiry, setFormI94Expiry]             = useState('');
    const [visaExpiry, setVisaExpiry]                   = useState('');
    const [eVerified, setEverified]                       = useState(false);
    const firebase                                       = useContext(FirebaseContext);
    const [isLoading, setIsLoading]                     = useState(true);
    const [error, setError]                             = useState(null);
    const [caseHistory, setCaseHistory]                 = useState([]);
    const myToast                                       = useRef(null);

    const [newCaseType, setNewCaseType]                 = useState('');

    const [formMode, setFormMode]                       = useState('fixed');

    const history                                       = useHistory();
    const match                                         = useRouteMatch()

    const caseTypeOptions = [
        {key: 'H1B RENEWAL', name: 'H-1B Renewal'},
        {key: 'I94 RENEWAL', name: 'I94 Renewal'},
    ];

    const workAuthOptions = [
        {key: 'CITIZEN', name: 'United States Citizen'},
        {key: 'GREENCARD', name: 'Permanent Resident'},
        {key: 'H1B', name: 'H-1B Specialty Occupation'},
        {key: 'L1', name: 'L-1 Intracompany Transferee'},
        {key: 'O1', name: 'O-1 Extraordinary Ability'},
        {key: 'TN', name: 'TN Visa'},
        {key: 'E1', name: 'E-1 Treaty Visas'},
        {key: 'E2', name: 'E-2 Treaty Visas'},
        {key: 'E3', name: 'E-3 Australian Specialty Occupation'}
    ];

    useEffect(() => {
        console.log('useEffect Employee Immigration mounted');
        console.log(employeeId)
        firebase.immigration(employeeId)
        .on('value', res => {
            let resVal = res.val();
            console.log(resVal);

            if (resVal) {
                // NEED TO CATCH FOR EMPLOYEES WITHOUT IMMIGRATION
                setEmployeeImmigration(resVal);
                setFormI94Expiry(resVal.I94expiry);
                setVisaExpiry(resVal.visaExpiry);
                setWorkAuthorization(resVal.workAuthorization);
                setEverified(resVal.eVerified);
                let caseHistory = Object.keys(resVal).map(key => {
                    if (!['I94expiry', 'eVerified', 'updatedAt', 
                    'visaExpiry', 'workAuthorization'].includes(key)) {
                        console.log(resVal[key]);
                        return {
                            caseNumber: key,
                            ...resVal[key],
                            startDate: new Date(resVal[key].startDate).toLocaleDateString()
                        }
                    } else return null;
                }).filter(ele => ele !== null);
                console.log(caseHistory)
                setCaseHistory(caseHistory);
                setIsLoading(false);

            } else {
                setIsLoading(false);
                return;
            }

 
        })
        
    }, []);
    

    const onFormToggleMode = () => {
        if (formMode === 'edit') {
            setFormMode('fixed');
            console.log('save triggered');
            const changes = {
                workAuthorization: workAuthorization,
                visaExpiry: workAuthorization === 'CITIZEN' ? '' : visaExpiry,
                eVerified: workAuthorization === 'CITIZEN' ? '' : eVerified,
                I94expiry: workAuthorization === 'CITIZEN' ? '' : formI94Expiry,
            }
            setIsLoading(true);
            // console.log(changes);
            firebase.immigration(employeeId).set({...employeeImmigration, ...changes, updatedAt: firebase.serverValue.TIMESTAMP}).then(res => {
                console.log(res)
                setIsLoading(false);
                showToast('success', 
                    'Sucesffully Saved', 
                    'Changes to Employee Immigration Saved')
            }).catch(error => {
                console.log(error);
                setIsLoading(false);
                setError(error);
                showToast('error', 
                'Saving Error', 
                'Failed to save changes to DB')
            })


        } else if (formMode === 'fixed') {
            setFormMode('edit');
        }
    }

    const uuidv4 = () => {
        return `xxx-4xxx-yxx`.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    const onCancelEdit = () => { setFormMode('fixed')}

    const onStartImmigrationProcess = (close) => {
        console.log('STARTING IMMIGRATION PROCESS', newCaseType);
        console.log('SEND STATUS AND ADD TO TIMELINEEVENTS')
        const newCaseNumber = uuidv4();
        const newCase = {
            [newCaseNumber]: {
                caseType: newCaseType,
                startDate: firebase.serverValue.TIMESTAMP,
                status: 'INITIATED',
                receiptNumber: '',
                documents: [],
                caseStatus: [
                    {stepDesc: 'Initiated', stepStatus: 'completed', updatedAt: firebase.serverValue.TIMESTAMP},
                    {stepDesc: 'Questionnaires Completed', stepStatus: "null", updatedAt: firebase.serverValue.TIMESTAMP },
                    {stepDesc: 'Questionnaires Verified', stepStatus: "null", updatedAt: firebase.serverValue.TIMESTAMP },
                    {stepDesc: 'Documents Uploaded', stepStatus: "null", updatedAt: firebase.serverValue.TIMESTAMP },
                    {stepDesc: 'Documents Verified', stepStatus: "null", updatedAt: firebase.serverValue.TIMESTAMP },
                    {stepDesc: 'Send to Attorney', stepStatus: "null", updatedAt: firebase.serverValue.TIMESTAMP },
                    {stepDesc: 'Filed', stepStatus: "null", updatedAt: firebase.serverValue.TIMESTAMP },
                    {stepDesc: 'Accepted', stepStatus: "null", updatedAt: firebase.serverValue.TIMESTAMP }
                ],
                questionnaires: {},
                timelineEvents: [
                    {message: `Confirmation sent to ${props.employee.firstName} via Email and Portal`, timestamp: firebase.serverValue.TIMESTAMP},
                    {message: `${newCaseType} Questionnaire sent to ${props.employee.firstName} via Portal`, timestamp: firebase.serverValue.TIMESTAMP},
                    {message: `Requested the following documents from ${props.employee.firstName}. I-797, I-94, Client Letter, 
                    Passport Copies, Previous H1B Documents, and Visa`, timestamp: firebase.serverValue.TIMESTAMP},
                ]
            }
        }
        console.log(newCase);

        setIsLoading(true);
        firebase.immigration(employeeId).set({...employeeImmigration, ...newCase, updatedAt: firebase.serverValue.TIMESTAMP}).then(response => {
            console.log(response);
            setIsLoading(false);
            showToast('success', 
            'Sucesffully Created New Case', 
            'Added New Case to User');

        }).catch(error => {
            console.log(error);
            setIsLoading(false);
            setError(error);
            showToast('error', 
            'Saving Error', 
            'Failed to save changes to DB')
        })

        close();
    }

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    return (
        <div style={{padding: '20px', height: 'inherit'}}>

            <Toast ref={myToast} />

            <ActionButton onPress={() => history.push('/admin/employees')} isQuiet>
                <Back />
                <Text>Cancel</Text>
            </ActionButton>

            <Flex direction="row" justifyContent="end">
            { formMode !== 'fixed' ?  <Button marginEnd="size-250" onPress={(onCancelEdit)}>Cancel</Button>: null}
                <Button onPress={() => onFormToggleMode()}>
                   {/* {formMode === 'fixed' ?  <Edit /> :  <SaveFloppy />} */}
                    <Text>{formMode === 'fixed' ? 'Edit' : 'Save'}</Text>
                </Button>
            </Flex>

            {isLoading && <div>Loading....</div>}

            {!isLoading && !error && 
                <>
                    <div className="row">

                        <div className="col-md-6">
                        <Header id="management" marginTop="size-150" marginBottom="size-50">Immigration Profile</Header>
                        <Divider size="M"/>
                            <Form isQuiet >
                                <Picker width="100%" 
                                    isDisabled={formMode === 'fixed'}
                                    selectedKey={workAuthorization}
                                    UNSAFE_className={'details-picker-immigration'} 
                                    items={workAuthOptions}
                                    onSelectionChange={(value) => setWorkAuthorization(value)}
                                    label="Work Authorization" 
                                    labelPosition="side">
                                    {(item) => <Item>{item.name}</Item>}
                                </Picker>
                                {
                                    !['CITIZEN'].includes(workAuthorization) ?
                                    <>
                                        <Flex UNSAFE_className="details-calendar-input ">
                                            <label htmlFor="i94Expiry">Form I-94 Expiry</label>
                                            <Calendar disabled={formMode === 'fixed'} width="100%" id="i94Expiry" value={new Date(formI94Expiry)} onChange={(e) => setFormI94Expiry(new Date(e.value).toISOString())}  />
                                        </Flex>
                                        <Flex UNSAFE_className="details-calendar-input ">
                                            <label htmlFor="visaExpiry">Visa Expiry</label>
                                            <Calendar disabled={formMode === 'fixed'} width="100%" id="visaExpiry" value={new Date(visaExpiry)} onChange={(e) => setVisaExpiry(new Date(e.value).toISOString())}  />
                                        </Flex>
                                    </> : null
                                }

                                {/* <ActionButton isDisabled={formMode === 'fixed'} isQuiet={false} marginTop="size-300">
                                    <Text>Start Immigration Process</Text>
                                </ActionButton> */}
                                <DialogTrigger>
                                    <ActionButton isDisabled={formMode === 'fixed'} isQuiet={false} marginTop="size-300">
                                        <Text>Start Immigration Process</Text>
                                    </ActionButton>
                                    {(close) => (
                                        <Dialog>
                                        <Heading>
                                            <Flex alignItems="center" gap="size-100">
                                            <Text>Start Immigration Process</Text>
                                            </Flex>
                                        </Heading>
                                        <Header>
                                        
                                        </Header>
                                        <Divider />
                                        <Content>
                                            <Form>
                                                <Picker width="100%" 
                                                isDisabled={formMode === 'fixed'}
                                                selectedKey={newCaseType}
                                                UNSAFE_className={'details-picker-immigration'} 
                                                items={caseTypeOptions}
                                                onSelectionChange={(value) => setNewCaseType(value)}
                                                label="Case Type" 
                                                labelPosition="side">
                                                {(item) => <Item>{item.name}</Item>}
                                                </Picker>
                                            </Form>
                                        </Content>
                                        <Footer>
                                            <Flex width="100%">
                                            <ButtonGroup>
                                                <Button variant="secondary" onPress={close}>
                                                    Cancel
                                                </Button>
                                                <Button isDisabled={newCaseType.length === 0} marginStart="size-300" variant="cta" onPress={() => onStartImmigrationProcess(close)}>
                                                    Start
                                                </Button>
                                            </ButtonGroup>
                                            </Flex>
                                        </Footer>
                        
                                        </Dialog>
                                    )}
                                </DialogTrigger>

                            </Form>
                        </div>
                        <div className="col-md-6">
                            <View marginTop="35px">
                            <ActionButton isDisabled={formMode === 'fixed'} isQuiet={false} width="100%">
                                <Text>E-Verify</Text>
                            </ActionButton>
                            <ActionButton isDisabled={formMode === 'fixed'} isQuiet={false} width="100%" marginTop="size-300">
                                <Text>Send To Attorney</Text>
                            </ActionButton>
                            </View>
                        </div>
                        </div>


                        <div className="row" style={{marginTop: '15px'}}>
                        <div className="col-md-6">
                        <Header id="management" marginTop="size-150" marginBottom="size-50">Case History</Header>
                        <Divider size="M"/>
                        <DataTable 
                            onRowClick={(caseData) => { history.push({pathname: `${match.url}/${caseData.data.caseNumber}`, state: { case: caseData.data, employee: props.employee}}) }}
                            value={caseHistory} selectionMode="single">
                            <Column field="caseNumber"  header="CASE NUMBER"></Column>
                            <Column field="caseType" header="CASE TYPE"></Column>
                            <Column field="startDate" header="START DATE"></Column>
                            <Column field="status" header="STATUS"></Column>

                        </DataTable>
                        </div>
                    </div>
                </>
            }
           
        
        </div>
    )
}

export default EmployeeImmigration
