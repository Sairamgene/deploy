import React, { useContext, useEffect, useRef, useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

import { TabView,TabPanel } from 'primereact/tabview';
import { ActionButton, Flex, Form, TextField, Text, Radio, RadioGroup, Header, CheckboxGroup, Checkbox, DialogTrigger, Dialog, Heading, Divider, ButtonGroup, Button, Content, Picker, Item, TextArea} from '@adobe/react-spectrum';

import './Questionnaires.css'
import Add from '@spectrum-icons/workflow/Add';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import Delete from '@spectrum-icons/workflow/Delete';
import FirebaseContext from '../../../../../firebase/Context';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';


// Questionnaires
const Questionnaires = (props) => {
    console.log('Questionnaires', props.questionnaires)
    const [activeApplicant, setActiveApplicant]                 = useState(0);
    const [activeQuestionGroup, setActiveQuestionGroup]         = useState(0);
    const [dependentFirstName, setDependentFirstName]           = useState('');
    const [dependentMiddleInitial, setDependentMiddleInitial]   = useState('');
    const [dependentLastName, setDependentLastName]             = useState('');
    const [dependentRelationship, setDependentRelationship]     = useState('');
    const firebase                                               = useContext(FirebaseContext);
    const myToast                                               = useRef(null);


    const [applicantss, setApplicantss] = useState(props.questionnaires.applicants ?? [
        {
            name: props.employee.firstName,
            applicantType: 'Principal Application',
            // H1B
            questionnaires: [
                {
                    group: 'H-1B Employer information ', 
                    questions: [
                        {type: 'text', question: 'H1B Employer Name', answer: props.employee.firstName},
                        {type: 'text', question: 'W-2 Employee Count (Current)', answer: props.employee.lastName},
                        {type: 'text', question: 'H1B Employee Count (Current):', answer: ''},
                        // {type: 'text', question: 'Clan or Tribe name (if applicable):', answer: ''},
                        // {type: 'text', question: 'List all Professional, Social and Charitable Organizations to which you belong(ed) or contribute(ed) or with which you work(ed):', answer: ''},
                        // {type: 'seperator', label: 'Please answer Yes or N on the the following'},
                        // {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Have you ever held J-1 visa status and been subject to the two year home residence requirement? ', answer: ''},
                        // {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Have you ever held H or L status in the past six (6) years? ', answer: ''},
                        // {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Have you ever been denied H-1B status? ', answer: ''},
                        // {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Are dependent family members changing to H-4 status or extending H-4 status? ', answer: ''},
                        // {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Are you currently in exclusion or deportation proceedings?  ', answer: ''},
                        // {type: 'checkbox', options: [{key: 'Permanent Labor Certification Application (e.g. PERM)', label: 'Permanent Labor Certification Application (e.g. PERM)'}, 
                        // {key: 'Immigrant Petition for Alien Work (i.e. I-140) ', label: 'Immigrant Petition for Alien Work (i.e. I-140) '},
                        // {key: 'Immigrant Petition for Alien Relative (i.e. I-130) ', label: 'Immigrant Petition for Alien Relative (i.e. I-130) '}
                        // ], question: 'Please check if you have been the direct beneficiary of any of the following applications and provide a copy of the USCIS or Department of Labor receipt: ', answer: ['']},
                        // {type: 'checkbox', options: [{key: 'Application to Adjust to Permanent Resident Status (i.e. I-485) ', label: 'Application to Adjust to Permanent Resident Status (i.e. I-485) '}, 
                        // {key: 'Immigrant visa application with National Visa Center/US Consulate ', label: 'Immigrant visa application with National Visa Center/US Consulate '},
                        // ], question: 'Please check if you have filed any of the following applications and provide documentation:', answer: ['']},
                    ]
                },
                {
                    group: 'H-1B Employee and Process Request Information ', 
                    questions: [
                        {type: 'dropdown', options: [{key: 'TRANSFER', label: 'Transfer'}, {key: 'EXTENSION', label: 'Extension'}, {key: 'AMENDMENT', label: 'Amendment'}, {key: 'CHANGE OF STATUS', label: 'Change Of Status'}] ,question: 'Type of filing', answer: ''},
                        {type: 'calendar', question: 'Anticipated H-1B Start Date', answer: ''},
                        {type: 'dropdown', options: [{key: 'MR', label: 'Mr.'}, {key: 'MRS', label: 'Mrs.'}, {key: 'MS', label: 'Ms'}, {key: 'DR', label: 'Dr.'}], question: 'Mr./Mrs./Ms./Dr.', answer: ''},
                        {type: 'text', question: 'First Name', answer: ''},
                        {type: 'text', question: 'Middle Name', answer: ''},
                        {type: 'text', question: 'Last Name ', answer: ''},
                        {type: 'dropdown', options: [{key: 'MALE', label: 'Male'}, {key: 'FEMALE', label: 'Female'}], question: 'Gender', answer: ''},
                        {type: 'dropdown',  options: [{key: 'H1B', label: 'H-1B'}, {key: 'H4', label: 'H4'}, {key: 'F1', label: 'F1'}], question: 'Current Nonimmigrant Status ', answer: ''},
                        {type: 'calendar', question: 'Current I-94 Expiration ', answer: ''},
                        {type: 'text', question: 'Bachelors degree field of study (if applicable)', answer: ''},
                        {type: 'text', question: 'Masters degree field of study (if applicable)', answer: ''},
                        {type: 'text', question: 'Phone Number', answer: ''},
                        {type: 'text', question: 'Email Address', answer: ''},
                        {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'H-4 Dependent Filing Required?', answer: ''},
                    ]
                },
                {
                    group: 'H-1B Employment Information', 
                    questions: [
                        {type: 'text', question: 'Job Title', answer: ''},
                        {type: 'textarea', question: 'Job Duties/summary:  We will need to provide a detailed job description for the filing, but for the purposes of this, we will require a basic job summary.  Please include job duties if you have them available as well as details regarding the actual application and role of the H-1Bs services as they relate to an end-product or service. ', answer: ''},
                        {type: 'text', question: 'Salary?', answer: ''},
                        {type: 'text', question: 'Worksite Address', answer: ''},

                    ]
                },
                {
                    group: 'Off-site Employment Details (If applicable)', 
                    questions: [
                        {type: 'text', question: 'End Client ', answer: ''},
                        {type: 'text', question: 'Primary Vendor (Tier 1)', answer: ''},
                        {type: 'text', question: 'Vendor (Tier 2)', answer: ''},
                        {type: 'text', question: 'Vendor (Tier 3) ', answer: ''},
                    ]
                }
            ]
        }
    ]);


    useEffect(() => {

        const questionnaireRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/questionnaires`;

        // Get Questionnaires based on existing

        console.log('Questionnaires', props.caseType);

        console.log('Questionnaires', questionnaireRef);
        // Get Existing Case
        firebase.db.ref(questionnaireRef).on('value', res => {
            const applicantsNew =  res.val()?.applicants;
            console.log('Questionnaires', applicantsNew);
            if (applicantsNew) {
                setApplicantss(applicantsNew)
            } else {

            }
        });

    }, [])

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }
    
    const onFormQuestionChange = (e) => {
 
        const question = e.target.name;
        const answer = e.target.value;

        // console.log(`Active Applicant: ${activeApplicant} , Active Panel: ${activeQuestionGroup}, Q: ${e.target.name} A: ${e.target.value}`);
        const applicantsCP = [...applicantss];
        const questions = [...applicantss[activeApplicant].questionnaires[activeQuestionGroup].questions];
        const questionsAnswered = questions.map(qObj => {
            if (qObj.question === question) {
                return { ...qObj, answer: answer }
            } else {
                return qObj;
            }
        });
        applicantsCP[activeApplicant].questionnaires[activeQuestionGroup].questions = questionsAnswered;
        setApplicantss(applicantsCP);
    }
    
    const onAddDependent = (close) => {
        console.log('On Add Dependent');

        let applicantsCP = JSON.parse(JSON.stringify(applicantss));
        let newForm = {
            name: dependentFirstName,
            applicantType: dependentRelationship,
            questionnaires: [
                {
                    group: 'Personal Information', 
                    questions: [
                        {type: 'text', question: 'First Name', answer: dependentFirstName},
                        {type: 'text', question: 'Last Name',  answer: dependentLastName},
                        {type: 'text', question: 'National Identification Number (if applicable):', answer: ''},
                        {type: 'text', question: 'Clan or Tribe name (if applicable):', answer: ''},
                        {type: 'text', question: 'List all Professional, Social and Charitable Organizations to which you belong(ed) or contribute(ed) or with which you work(ed):', answer: ''},

                        {type: 'seperator', label: 'Please answer Yes or N on the the following'},

                        {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Have you ever held J-1 visa status and been subject to the two year home residence requirement? ', answer: ''},
                        {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Have you ever held H or L status in the past six (6) years? ', answer: ''},
                        {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Have you ever been denied H-1B status? ', answer: ''},
                        {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Are dependent family members changing to H-4 status or extending H-4 status? ', answer: ''},
                        {type: 'radio', options: [{key: 'Y', label: 'Yes'}, {key: 'N', label: 'No'}], question: 'Are you currently in exclusion or deportation proceedings?  ', answer: ''},
                        {type: 'checkbox', options: [{key: 'Permanent Labor Certification Application (e.g. PERM)', label: 'Permanent Labor Certification Application (e.g. PERM)'}, 
                        {key: 'Immigrant Petition for Alien Work (i.e. I-140) ', label: 'Immigrant Petition for Alien Work (i.e. I-140) '},
                        {key: 'Immigrant Petition for Alien Relative (i.e. I-130) ', label: 'Immigrant Petition for Alien Relative (i.e. I-130) '}
                        ], question: 'Please check if you have been the direct beneficiary of any of the following applications and provide a copy of the USCIS or Department of Labor receipt: ', answer: ['']},
                        {type: 'checkbox', options: [{key: 'Application to Adjust to Permanent Resident Status (i.e. I-485) ', label: 'Application to Adjust to Permanent Resident Status (i.e. I-485) '}, 
                        {key: 'Immigrant visa application with National Visa Center/US Consulate ', label: 'Immigrant visa application with National Visa Center/US Consulate '},
                        ], question: 'Please check if you have filed any of the following applications and provide documentation:', answer: ['']},
                    ]
                },
                {
                    group: 'Travel Information', 
                    questions: [
                        {type: 'text', question: 'National Identification Number (if applicable):', answer: ''},
                        {type: 'text', question: 'Clan or Tribe name (if applicable):', answer: ''},
                    ]
                },
                {
                    group: 'Visa Information', 
                    questions: [
                        {type: 'text', question: 'National Identification Number (if applicable):', answer: ''},
                        {type: 'text', question: 'Clan or Tribe name (if applicable):', answer: ''},
                    ]
                }
            ]
        };
        applicantsCP.push(newForm);
        setApplicantss(applicantsCP);
        setDependentLastName('');
        setDependentFirstName('');
        setDependentMiddleInitial('');
        setDependentRelationship('');
        close();
    }

    const onSaveDisabled = () => {
        return !dependentFirstName.length > 0 &&
        !dependentLastName.length > 0 && !dependentRelationship.length > 0;
    }

    const onDelete = () => {

        if (activeApplicant !== 0) {
            console.log(applicantss);
            setApplicantss(state => {
                const applicantsCP = JSON.parse(JSON.stringify(state));
                applicantsCP.splice(activeApplicant, 1);
                setActiveApplicant(activeApplicant - 1);
                return applicantsCP;
            })
        } 
    }

    const onSaveClick = () => {
        console.log(applicantss);
        console.log(props.caseNumber, props.employee);
        firebase.immigrationQuestionnaire(props.employee.id, props.caseNumber).set({applicants: [...applicantss], status: 'saved', updatedAt: firebase.serverValue.TIMESTAMP}).then(res => {
            showToast('success', 
                    'Sucesffully Saved', 
                    'Changes to Questionnaires Saved')
        }).catch(err => {
            console.log(err);
        });
    }

    const onSubmit = () => {

        const caseRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/caseStatus/1`;

        // GET SPECIFIC STEP
        firebase.db.ref(caseRef).once('value', res => {
            const caseStatus = res.val();
            const newCaseStatus = {...caseStatus, stepStatus: 'completed', updatedAt: firebase.serverValue.TIMESTAMP};
         
            // UPDATE SPECIFIC STEP
            firebase.db.ref(caseRef).set(newCaseStatus).then(res => {
                //UPDATE QUESTIONNAIRE
                firebase.immigrationQuestionnaire(props.employee.id, props.caseNumber).set({applicants: [...applicantss], status: 'submitted', updatedAt: firebase.serverValue.TIMESTAMP}).then(res => {
                    // GET CASE TIMELINE
                    firebase.immigrationTimelineEvents(props.employee.id, props.caseNumber).once('value', response => {
                        const currentTimelineEvents = response.val();
                        const newEvent = {message: `Confirmation sent to Admin / Attorney via Email and Portal`, timestamp: firebase.serverValue.TIMESTAMP};
                        // UPDATE CASE TIMELINE
                        firebase.immigrationTimelineEvents(props.employee.id, props.caseNumber).set([...currentTimelineEvents, newEvent ]).then(res => {
                            showToast('success', 
                            'Sucesffully Submitted', 
                            'Changes to Questionnaires Saved')
                        }).catch(err => {
                            console.log(err);
                        })
                    })
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err)
            })

        });

 



    }

    // console.log('useEffect', applicantss)
    return (<>

        <Flex justifyContent="space-between" marginBottom="size-175">
            
            <Toast ref={myToast} />
            
            <DialogTrigger>
                <ActionButton>Add Dependent</ActionButton>
                {(close) => (
                    <Dialog>
                    <Heading>Add Dependent</Heading>
                    <Divider/>
                    <ButtonGroup>
                        <Button variant="secondary" onPress={close}>
                        Cancel
                        </Button>
                        <Button autoFocus variant="cta" isDisabled={onSaveDisabled()} onPress={() => onAddDependent(close)}>
                        Add
                        </Button>
                    </ButtonGroup>
                    <Content>
                        <Form>
                        <TextField label="First Name" isRequired onChange={setDependentFirstName}/>
                        <TextField label="Middle Name" onChange={setDependentMiddleInitial}/>
                        <TextField label="Last Name" isRequired onChange={setDependentLastName}/>
                            <Picker label="Dependent Type" isRequired onChange={setDependentRelationship}>
                                <Item key="Spouse">Spouse</Item>
                                <Item key="Child">Child</Item>
                            </Picker>
                        </Form>
                    </Content>
                    </Dialog>
                )}
            </DialogTrigger>

           <Flex>
                <ActionButton isDisabled={activeApplicant === 0} onPress={() => onDelete()}>
                    <Delete />
                    <Text>Delete</Text>
                </ActionButton>
                <ActionButton marginStart="size-175" onPress={() => onSaveClick()}>
                    <SaveFloppy />
                    <Text>Save</Text>
                </ActionButton>

                <ActionButton marginStart="size-175" UNSAFE_className="bugsy-action-button" UNSAFE_style={{color: 'white'}} onPress={onSubmit}>
                    <Text>Submit</Text>
                </ActionButton>
           </Flex>
        </Flex>
       
        <TabView activeIndex={activeApplicant} onTabChange={(e) => setActiveApplicant(e.index)}>
            {
                applicantss.map((applicant, index) => {
                    return <TabPanel key={index} header={applicant.name}>
                        <Accordion activeIndex={activeQuestionGroup} onTabChange={(e) => setActiveQuestionGroup(e.index)}>
                            {applicant.questionnaires.map(questionnaire => {
                                // console.log(questionnaire)
                                return <AccordionTab key={questionnaire.group} header={questionnaire.group} >
                                    <Form isQuiet>
                                    {questionnaire.questions.map((q, index) => {
                                        switch (q.type) {
                                            case 'radio':
                                                return <RadioGroup 
                                                            key={`${questionnaire.group}${q.question}${index}`} 
                                                            label={q.question} 
                                                            defaultValue={q.answer}
                                                            orientation="horizontal" 
                                                            labelPosition="side" 
                                                            onChange={(e) => onFormQuestionChange({target: { name: q.question, value: e}})}
                                                            UNSAFE_style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    {q.options.map(option => {
                                                        return <Radio 
                                                            key={index}
                                                            value={option.key} 
                                                            defaultValue={q.answer}>{option.label}
                                                        </Radio>
                                                    })}
                                                </RadioGroup>
                                            case 'text':
                                                return <TextField 
                                                            key={`${questionnaire.group}${q.question}${index}`} 
                                                            labelPosition={q.question.length > 127 ? 'top' : 'side'} 
                                                            defaultValue={q.answer}
                                                            name={q.question} 
                                                            label={q.question} 
                                                            UNSAFE_className={q.question.length < 127 ? "textfield-questionnaire" : ""}
                                                            onInput={(e) => {onFormQuestionChange(e)}}/>
                                            case 'dropdown':
                                                return <Picker 
                                                            key={`${questionnaire.group}${q.question}${index}`} 
                                                            maxWidth="100%"
                                                            defaultSelectedKey={q.answer}
                                                            UNSAFE_className={"dropdown-questionnaire"}
                                                            labelPosition={q.question.length > 127 ? 'top' : 'side'}
                                                            onSelectionChange={(e) => {onFormQuestionChange({target: { name: q.question, value: e}})}}
                                                            label={q.question}>
                                                                {
                                                                    q.options?.map(option => {
                                                                        return <Item key={option.key}>{option.label}</Item>
                                                                    })
                                                                }
                                                        </Picker>
                                            case 'calendar':
                                                console.log(q.answer)
                                                return <div style={{display: 'flex'}} key={`${questionnaire.group}${q.question}${index}`} >
                                                    <div style={{width: '30%'}}><label htmlFor="i94Expiry">{q.question}</label></div>
                                                    <div> <Calendar 
                                                        // disabled={formMode === 'fixed'} 
                                                        width="100%" id="i94Expiry" 
                                                        value={new Date(q.answer)} 
                                                        onChange={(e) => onFormQuestionChange({target: { name: q.question, value: new Date(e.value).toISOString()}})}  
                                                        /></div>
                                                </div>
                                            case 'textarea':
                                                return <TextArea 
                                                key={`${questionnaire.group}${q.question}${index}`} 
                                                labelPosition={q.question.length > 127 ? 'top' : 'side'} 
                                                defaultValue={q.answer}
                                                name={q.question} 
                                                label={q.question} 
                                                UNSAFE_className={q.question.length < 127 ? "textfield-questionnaire" : ""}
                                                onInput={(e) => {onFormQuestionChange(e)}}/>
                                            case 'checkbox':
                                                return <CheckboxGroup  
                                                        key={`${questionnaire.group}${q.question}${index}`} 
                                                        label={q.question} 
                                                        onChange={(e) => onFormQuestionChange({target: { name: q.question, value: e}})}>
                                                    {q.options.map(option => {
                                                        return <Checkbox 
                                                                key={`${questionnaire.group}${q.question}${index}`} 
                                                                value={option.key}>{option.label}
                                                            </Checkbox>
                                                    })}
                                                </CheckboxGroup>
                                            case 'seperator':
                                                return <Header marginTop="static-size-300" marginBottom="static-size-300">{q.label}</Header>
                                            default:
                                                break;
                                        }
                                    })}
                                    </Form>
                      
                                </AccordionTab>
                            })}
                        </Accordion>
                    </TabPanel>
                })
            }
            
            
        </TabView>

        

    </>)
}

export default Questionnaires
