import { ActionButton, Divider, Flex, Header, Text } from '@adobe/react-spectrum';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import FirebaseContext from '../../../../firebase/Context'
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import Alert from '@spectrum-icons/workflow/Alert';
import Circle from '@spectrum-icons/workflow/Circle';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import Back from '@spectrum-icons/workflow/BackAndroid';
import Questionnaires from '../../../employees/employeeProfile/EmployeeImmigrationWF/Questionnaires/Questionnaires';
import { TabPanel, TabView } from 'primereact/tabview';
import DocumentsUpload from '../../../employees/employeeProfile/EmployeeImmigrationWF/DocumentsUploaded/DocumentsUpload';

const ImmigrationCaseTable = (props) => {

    const [expandedRows, setExpandedRows]               = useState(null);
    const [columns]                                     = useState([
                                                            {field: 'caseNumber', header: 'CASE NUMBER'},
                                                            {field: 'caseType', header: 'CASE TYPE'},
                                                            {field: 'startDate', header: 'START DATE'},
                                                            {field: 'status', header: 'STATUS'},
                                                        ]);
    const [selectedColumns]                             = useState(columns);
    const history                                       = useHistory();
    const match                                         = useRouteMatch();

    return <div className="row" style={{marginTop: '15px'}}>       
    <div className="col-md-12">
    <Header id="management" marginTop="size-150" marginBottom="size-50">Case History</Header>
    <Divider size="M"/>
        <DataTable 
        selectionMode="single"
        onRowToggle={(e) => setExpandedRows(e.data)}
        // onRowClick={(caseData) => console.log(caseData)}
        onRowClick={(caseData) => { history.push({pathname: `${match.url}/${caseData.data.caseNumber}`, state: { case: caseData.data}}) }}
        expandedRows={expandedRows}
        rowExpansionTemplate={(data) => {
            // console.log(data)
            return <Flex justifyContent="center">
                {data.caseStatus.map(status => {
                    return <Flex direction="column" alignItems="center" margin="size-175" width="100px" UNSAFE_style={{textAlign: 'center'}}>
                    {status.stepStatus === 'completed' ? <CheckmarkCircle UNSAFE_style={{color: 'green'}}/>: <Circle UNSAFE_style={{color: 'lightgrey'}}/>}
                    <div>{status.stepDesc}</div>
                </Flex>
                })}
               
            </Flex>
        }}
        
        value={props.caseHistory} 
        >
         <Column expander style={{ width: '3em' }}/>
        {selectedColumns.map(col=> {
  
            return <Column key={col.field} field={col.field} header={col.header} />;

        })}

    </DataTable>
    </div>
    </div>
}

const ImmigrationCase = (props) => {
    console.log(props)
    const history = useHistory();
    const employee = useSelector((store) => { return store.employee.profile})
    // const firebase = useContext(FirebaseContext);

    useEffect(() => {
        console.log(history.location.state.case.caseNumber)
        console.log(history.location.state.case)
        console.log(employee)
        // console.log('${firebase.tenantId}_immigration/${props.employee.id}${props.caseNumber}/questionnaires`', props.caseNumber);
        //https://bugsy-crm.firebaseio.com/COVET_immigration/-covet0/21c-4e51-b95/questionnaires
        // console.log('useEffect',`${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/questionnaires`);
        // const questionnaireRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/questionnaires`;
        // // console.log('useEffect', props.questionnaires.applicants);

        // firebase.db.ref(questionnaireRef).on('value', res => {
        //     const applicantsNew =  res.val()?.applicants;
        //     if (applicantsNew) {
        //         setApplicantss(applicantsNew)
        //     }
        // });

    }, [])



    return (
        <div style={{marginTop: '20px', width: '100%'}}>

            <Flex direction="row" justifyContent="space-between">

            <ActionButton onPress={() => history.push('/myprofile/immigration')} isQuiet>
                <Back />
                <Text>Back to Case Case History</Text>
            </ActionButton>

            </Flex>

            <TabView>
                <TabPanel header="Questionnaires">
                    <Questionnaires questionnaires={[]} employee={employee}></Questionnaires>
                </TabPanel>
                <TabPanel header="Documents">
                    <DocumentsUpload employee={employee} caseNumber={history.location.state.case.caseNumber}></DocumentsUpload>
                </TabPanel>
            </TabView>
        </div>
    )
}


const Immigration = () => {

    const firebase = useContext(FirebaseContext);
    const employeeId = useSelector((store) => { return store.auth.employeeId});
    const [isLoading, setIsLoading] = useState(true);

    const [workAuthorization, setWorkAuthorization]     = useState('');
    const [formI94Expiry, setFormI94Expiry]             = useState('');
    const [visaExpiry, setVisaExpiry]                   = useState('');
    // const [employeeImmigration, setEmployeeImmigration] = useState(null);
    const [caseHistory, setCaseHistory]                 = useState([]);

    // const history                                       = useHistory();
    // const match                                         = useRouteMatch()
    

    // const [expandedRows, setExpandedRows] = useState(null);
    // const [columns] = useState([
    //     {field: 'caseNumber', header: 'CASE NUMBER'},
    //     {field: 'caseType', header: 'CASE TYPE'},
    //     {field: 'startDate', header: 'START DATE'},
    //     {field: 'status', header: 'STATUS'},
    // ]);
    // const [selectedColumns, setSelectedColumns] = useState(columns)

    useEffect(() => { 
        const immigrationRef = `${firebase.tenantId}_immigration/${employeeId}`;
        console.log(immigrationRef)
        if (firebase.tenantId && employeeId) {
            firebase.db.ref(immigrationRef).on('value', res => {
                let resVal = res.val();
                console.log(resVal);

                if (resVal) {
                    // setEmployeeImmigration(resVal)
                    setWorkAuthorization(resVal.workAuthorization)
                    setFormI94Expiry(resVal.I94expiry)
                    setVisaExpiry(resVal.visaExpiry);
                    setIsLoading(false);
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
                    console.log(caseHistory);
                    setCaseHistory(caseHistory);
                }
            })
        }
    }, []);

    // console.log(caseHistory)

    return (
        <div style={{padding: '20px', height: 'inherit'}}>
            <div className="row">
                <div className="col-md-6">
                    <Header id="management" marginTop="size-150" marginBottom="size-50">Immigration Profile</Header>
                    <Divider size="M"/>
                    <Flex justifyContent="space-between"><span>Work Authorization</span><span>{workAuthorization}</span></Flex>
                    {
                        !['CITIZEN'].includes(workAuthorization) ?
                        <>
                             <Flex justifyContent="space-between"><span>I-94 Expiry</span><span>{new Date(formI94Expiry).toLocaleDateString()}</span></Flex>
                            <Flex justifyContent="space-between"><span>Visa Expiry</span><span>{new Date(visaExpiry).toLocaleDateString()}</span></Flex>
                        </>
                        :
                        null
                    }

                        

                </div>
            </div>
            <div className="row" style={{marginTop: '15px'}}>
                {
                    <Switch>
                        <Route path="/myprofile/immigration/:casenumber" component={() => <ImmigrationCase/>}/>
                        <Route path="/myprofile/immigration" component={() => <ImmigrationCaseTable caseHistory={caseHistory}/>}/>
           
                    </Switch>
                }
            </div>
            {/* <div className="row" style={{marginTop: '15px'}}>       
                        <div className="col-md-12">
                        <Header id="management" marginTop="size-150" marginBottom="size-50">Case History</Header>
                        <Divider size="M"/>
                            <DataTable 
                            selectionMode="single"
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            onRowClick={(caseData) => console.log(caseData)}
                            expandedRows={expandedRows}
                            rowExpansionTemplate={(data) => {
                                console.log(data)
                                return <Flex justifyContent="center">
                                    {data.caseStatus.map(status => {
                                        return <Flex direction="column" alignItems="center" margin="size-175" width="100px" UNSAFE_style={{textAlign: 'center'}}>
                                        {status.stepStatus === 'completed' ? <CheckmarkCircle UNSAFE_style={{color: 'green'}}/>: <Circle UNSAFE_style={{color: 'lightgrey'}}/>}
                                        <div>{status.stepDesc}</div>
                                    </Flex>
                                    })}
                                   
                                </Flex>
                            }}
                            
                            value={caseHistory} selectionMode="single">
                             <Column expander style={{ width: '3em' }}/>
                            {selectedColumns.map(col=> {
                      
                                return <Column key={col.field} field={col.field} header={col.header} />;
                
                            })}

                        </DataTable>
                        </div>
            </div> */}
        </div>
    )
}

export default Immigration
