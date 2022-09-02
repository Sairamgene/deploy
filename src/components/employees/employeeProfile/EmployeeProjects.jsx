import { ActionButton, ButtonGroup, Flex, Text, Button, Picker, Item, TextField, Tooltip, TooltipTrigger, Header, Divider} from '@adobe/react-spectrum'
import Back from '@spectrum-icons/workflow/BackAndroid'

import React, { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import Edit from '@spectrum-icons/workflow/Edit';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import ChevronUp from '@spectrum-icons/workflow/ChevronUp';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import DeleteOutline from '@spectrum-icons/workflow/DeleteOutline'
import AssetsAdded from '@spectrum-icons/workflow/AssetsAdded';

import ArrowDown from '@spectrum-icons/workflow/ArrowUp';
import './EmployeeProjects.css'
import { useSelector } from 'react-redux';
import FirebaseContext from '../../../firebase/Context';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

function uuidv4 () {
    return `xxx-4xxx-yxx`.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const compensationTypeOptions = [
    {key: 'SALARY', name: 'Salary'},
    {key: 'PERCENTAGE', name: 'Percentage'},
    {key: 'FIXEDRATE', name: 'Fixed Rate'},
];

const commissionTypeOptions = [
    {key: 'PERCENTAGE', name: 'Percentage'},
    {key: 'FIXEDRATE', name: 'Fixed Rate'},
];

const compensationScheduleOptions = [
    {key: 'WEEKLY', name: 'Weekly'},
    {key: 'BI-WEEKLY', name: 'Bi-Weekly'},
    {key: 'SEMI-MONTHLY', name: 'Semi-Monthly'},
    {key: 'MONTHLY', name: 'Monthly'},
];

const EmployeeProjects = (props) => {
    
    const employeeId = props.employee.id;
    const tenantName = useSelector((store) => { return store.auth.tenantId})

    const [activeProject, setActiveProject] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [selectedManager, setSelectedManager] = useState(null);

    const [activeHierarchy, setActiveHierarchy] = useState(0);
    const [projects, setProjects] = useState(props.employee.projects ?? 
        [
            {
              projectItenerary: [
                {
                  organizationName: tenantName,
                  role: '',
                  location: '',
                  locationId: '',
                  clientManager: '',
                  manager:'',
                  managerId:'',
                  netTerms: ''
                }
              ],
              projectId: uuidv4(),
              projectName: 'New Project',
              active: true,
              startDate: '',
              endDate: '',
              billingRate: '',

              compensationType: '',
              compensation: '',
              overtimeCompensation: '',
              compensationSchedule: ''
            }
        ]
    );

    const [isLoading, setIsLoading] = useState(false);
    const [formMode, setFormMode] = useState('fixed');
    const history = useHistory();    
    const firebase = useContext(FirebaseContext);
    const myToast = useRef(null);

    const [organizationOptions, setOrganizationOptions] = useState([]);
    const [commissionOptions, setCommissionOptions] = useState('');

    useEffect(() => {
        
        let firebaseEmployeesRef = `${firebase.tenantId}_employees`;

        firebase.db.ref(firebaseEmployeesRef).once('value').then(res => {
            const employees = res.val();
            const options = Object.keys(employees).map(employeeKey => {
                return {
                    label: employees[employeeKey].firstName + ' ' + employees[employeeKey].lastName + employeeKey,
                    key: employeeKey,
                }
            });

            const removeOption = { label: 'Remove Person', key: 'REMOVEPPERSON' };
            options.push(removeOption)

            setCommissionOptions(options);
        });
        
        let firebasePartnersRef = `${firebase.tenantId}_Partners`;
        firebase.db.ref(firebasePartnersRef).once('value').then(res => {
            const partners = res.val();
            // console.log('HERE', partners)
            const options = Object.keys(partners).map(partnerKey => {
                // console.log('JR', partners[partnerKey].OrganizationName)
                return {
                    label: partners[partnerKey].OrganizationName + ', ' + partnerKey,
                    name: partners[partnerKey].OrganizationName,
                    managers: partners[partnerKey].Managers ?? [],
                    Locations: partners[partnerKey].Locations ?? [],
                    key: partnerKey
                }
            });
            
            setOrganizationOptions(options);
            setSelectedProject(options.find(option => option.key === projects[activeProject]?.projectItenerary[0].organizationId))
        })
    }, []);
    
    const locationOptions = useMemo(() => {
        // console.log('organizationOptions', organizationOptions, projects[activeProject].projectItenerary[activeHierarchy].organizationName);
        // const selectedOrganization = projects[activeProject].projectItenerary[activeHierarchy].organizationName;
        // console.log("LOCATIONS ", selectedProject, organizationOptions)
        // const organization = organizationOptions.find(org => org.key === selectedProject?.key);
        const locations = selectedProject?.Locations ?? {};
        const locationOptions =  Object.keys(locations).map(locationKey => {
            return {
                label: locations[locationKey].AddressLine1 + ' ' + locations[locationKey].AddressLine2 + ' ' + locations[locationKey].City,
                name: locations[locationKey].AddressLine1 + ' ' + locations[locationKey].AddressLine2 + ' ' + locations[locationKey].City,
                key: locationKey
            }
        });

        const selectedLocationIdForhighlightedOrganization = projects[activeProject]?.projectItenerary[activeHierarchy]?.locationId
        const selectedLocationForhighlightedOrganization = locationOptions.find(option=> option.key == selectedLocationIdForhighlightedOrganization)
        // console.log('LOCATION OPTIONS ORGANIZATION ',  locationOptions)
        setSelectedLocation(selectedLocationForhighlightedOrganization)

        return locationOptions

    }, [projects[activeProject]?.projectItenerary?.[activeHierarchy]?.organizationName, organizationOptions, selectedProject])

    const managerOptions = useMemo(() => {
     
        const managers = selectedProject?.managers ?? {};
        const managerOptions =  Object.keys(managers).map(managerKey => {
            return {
                label: managers[managerKey].firstName + ' ' + managers[managerKey].LastName + ', ' + managerKey,
                name: managers[managerKey].firstName + ' ' + managers[managerKey].LastName,
                key: managerKey
            }
        });
 
        const selectedManagerIdForhighlightedOrganization = projects[activeProject]?.projectItenerary[activeHierarchy]?.managerId
        const selectedManagerForhighlightedOrganization = managerOptions.find(option=> option.key == selectedManagerIdForhighlightedOrganization)
        // console.log('LOCATION OPTIONS ORGANIZATION ',  locationOptions)
        setSelectedManager(selectedManagerForhighlightedOrganization)
        return managerOptions

    }, [projects[activeProject]?.projectItenerary?.[activeHierarchy]?.organizationName, organizationOptions, selectedProject])


    const netTermsOptions = [
        {value: 'NET15', label: 'Net 15'},
        {value: 'Net30', label: 'Net 30'},
        {value: 'Net45', label: 'Net 45'},
        {value: 'Net60', label: 'Net 60'},
        {value: 'Net90', label: 'Net 90'},

        {value: 'Due on Receipt', label: 'Due on Receipt'},
    ]


    
    const onOrgClick = (orgIndex, orgId, locationId) => { 
        console.log("ORG CLICK")
        setActiveHierarchy(orgIndex)
        const highlightedOrganization = organizationOptions.find(org => org.key==orgId)
        setSelectedProject(highlightedOrganization)
    };

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const onFormToggleMode = () => {
        if (formMode === 'edit') {
            setFormMode('fixed');
            setIsLoading(true);
      
            const changes = [...projects];

            console.log(employeeId);
            console.log('PROJECTS', changes);

            if (employeeId !== "") {
                console.log("Changed Project ", changes)
                firebase.employees(employeeId).set({ ...props.employee, projects: changes, updatedAt: firebase.serverValue.TIMESTAMP}).then((res) => {
                    setIsLoading(false);
                    showToast('success', 
                    'Sucesffully Saved', 
                    'Changes to Employee Details Saved')
                }).catch(error => {
                    showToast('error', 
                    'Saving Error', 
                    'Failed to Save Changes To Projects')
                })
            } else {
                setIsLoading(false);
                showToast('error', 
                'Saving Error', 
                'Failed to Save Changes To Projects')
            }
        } else if (formMode === 'fixed') {
            setFormMode('edit');
        }
    }

    const onChange = event => {
        const {name, value} = event.target; 
        
        setProjects(projects => {
            const projectsCP = JSON.parse(JSON.stringify(projects));
            const hierarchyCP = projectsCP[activeProject].projectItenerary[activeHierarchy];
            hierarchyCP[name] = value;
            return projectsCP;
        });
    }

    const onChangeManager = event => {
        // const {name, value} = event.target; 
        console.log('ONCHANGEMANAGER ',event.value)
        setSelectedManager(event.value)
        setProjects(projects => {
            const projectsCP = JSON.parse(JSON.stringify(projects));
            const hierarchyCP = projectsCP[activeProject].projectItenerary[activeHierarchy];
            hierarchyCP['managerId'] = event.value.key;
            hierarchyCP['manager'] = event.value.name
            return projectsCP;
        });
    }

    const onChangeLocation = (event)=>{
        console.log(event)
        setSelectedLocation(event.value)
        setProjects(projects=>{
            const projectsCP = JSON.parse(JSON.stringify(projects));
            const hierarchyCP = projectsCP[activeProject].projectItenerary[activeHierarchy];
            hierarchyCP['locationId'] = event.value.key;
            hierarchyCP['location']=event.value.name
            return projectsCP

        })
    }

    const onChangeOrganization = (event) => {
        // const {name, label} = event.target;  
        setSelectedProject(event.value)

        setProjects(projects => {
            const projectsCP = JSON.parse(JSON.stringify(projects));
            const hierarchyCP = projectsCP[activeProject].projectItenerary[activeHierarchy];
            hierarchyCP["organizationName"] = event.value.name;
            hierarchyCP['organizationId'] = event.value.key;
            return projectsCP;
        });
    }

    const onChangeCommission = (event, index) => {
        console.log(event, index);
        if (event.value.key === "REMOVEPPERSON") {
            setProjects(projects => {
                const projectsCP = JSON.parse(JSON.stringify(projects));
                const commissionsCP = projectsCP[activeProject].commissions;
                commissionsCP.splice(index, 1);
                return projectsCP
            })
        } else {
            setProjects(projects => {
                const projectsCP = JSON.parse(JSON.stringify(projects));
                const commissionCP = projectsCP[activeProject].commissions[index];
                commissionCP['employeeCommission'] = event.value;
                // console.log(projectsCP)
                return projectsCP;
            });
        }
    }

    const onChangeCommissionType = (value, index) => {
        setProjects(projects => {
            const projectsCP = JSON.parse(JSON.stringify(projects));
            const commissionCP = projectsCP[activeProject].commissions[index];
            commissionCP['commissionType'] = value;
            // console.log(projectsCP)
            return projectsCP;
        });
    }

    const onProjectChange = event => {
        setProjects(projects => {
            const { name, value} = event.target;
            console.log('onProjectChange', name, value);
            const projectsCP = JSON.parse(JSON.stringify(projects));
            projectsCP[activeProject][name] = value;
            return projectsCP
        });
    }

    const onProjectCompensationTypeChange = value => {
        setProjects(projects => {
            const projectsCP = JSON.parse(JSON.stringify(projects));
            console.log(value)
            projectsCP[activeProject]['compensationType'] = value;
            return projectsCP
        });
    }

    const onProjectCompensationScheduleChange = value => {
        setProjects(projects => {
            const projectsCP = JSON.parse(JSON.stringify(projects));
            projectsCP[activeProject]['compensationSchedule'] = value;
            return projectsCP;
        })
    }

    const onProjectStartDateChange = event => {
        setProjects(projects => {
            const { name, value} = event.target;
            console.log(name, value);
            const projectsCP = JSON.parse(JSON.stringify(projects));
            projectsCP[activeProject][name] = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
            console.log(projectsCP)
            return projectsCP
        });
    }

    const onProjectEndDateChange = event => {
        setProjects(projects => {
            const { name, value} = event.target;
            console.log(name, value);
            const projectsCP = JSON.parse(JSON.stringify(projects));
            projectsCP[activeProject][name] = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
            return projectsCP
        });
    }

    const onOrgChange = (orgIndex, type) => {
        // debugger;
        let newState =  JSON.parse(JSON.stringify(projects));
        const itenerary =  {
            location: "",
            locationId: "",
            manager: "",
            managerId: "",
            netTerms: "",
            organizationId: "",
            organizationName: "Select an Organization" ,
            role: '',
        };
        
        switch (type) {
            case 'child':
                newState[activeProject].projectItenerary.splice(orgIndex + 1, 0, itenerary);
                setSelectedProject( null)
                setActiveHierarchy(orgIndex+1)
                break;
            case 'parent':
                newState[activeProject].projectItenerary.splice(orgIndex, 0, itenerary);
                setSelectedProject(null)
                setActiveHierarchy(orgIndex)
                break;
            case 'remove':
                newState[activeProject].projectItenerary.splice(orgIndex, 1);
                break;
            default:
                break;
        }

        setProjects(newState);
    }

    const onDeleteProject = () => {
        console.log('onDeleteProject', projects);
        console.log('onDeleteProject', activeProject);
        let projectsCP = JSON.parse(JSON.stringify(projects));

        projectsCP.splice(activeProject, 1);
        console.log('projectsCP', projectsCP)
        setActiveProject(state => {
            return state - 1;
        });
        setProjects(projectsCP);


    }

    const onAddProject = () => {

        const newProject = {
            projectItenerary: [
                {
                    organizationName: tenantName,
                    role: '',
                    location: '',
                    locationId: '',
                    clientManager: '',
                    managerId:'',
                    manager:'',
                    netTerms: ''
                }
            ],
            projectId: uuidv4(),
            projectName: 'New Project',
            active: true,
            startDate: '',
            endDate: '',
            billingRate: '',

            compensationType: '',
            compensation: '',
            overtimeCompensation: '',
            compensationSchedule: ''
        }
        const newProjects = JSON.parse(JSON.stringify(projects));
        newProjects.push(newProject);
        setProjects(newProjects)
        setActiveProject(state => { return state + 1});
    }

    const onCancelEdit = () => {
        setProjects(props.employee.projects ?? 
            [
                {
                    projectItenerary: [
                        {
                            organizationName: tenantName,
                            role: '',
                            location: '',
                            locationId: '',
                            clientManager: '',
                            manager:'',
                            managerId:'',
                            netTerms: ''
                        }
                        ],
                        projectId: uuidv4(),
                        projectName: 'New Project',
                        active: true,
                        startDate: '',
                        endDate: '',
                        billingRate: '',
        
                        compensationType: '',
                        compensation: '',
                        overtimeCompensation: '',
                        compensationSchedule: ''
                }
            ]    
        )
        setFormMode('fixed');
        setActiveProject(0);
    }

    const onAddPersonCommission = () => {
        let newCommissionObj = {
            employeeCommission: '',
            commissionAmount: '',
            commissionType: 'PERCENTAGE',
        }
        const projectsCP = JSON.parse(JSON.stringify(projects));
        if (!projectsCP[activeProject]?.commissions) {
            console.log('NO COMMISSIONS PRESENT')
            
            projectsCP[activeProject]['commissions'] = [];
            projectsCP[activeProject]['commissions'].push(newCommissionObj);
            setProjects(projectsCP);

        } else {
            console.log('COMMISSIONS PRESENT');
            console.log(projectsCP)
            projectsCP[activeProject].commissions.push(newCommissionObj)
            setProjects(projectsCP);
        }
    }


    return (
        <div style={{padding: '20px', height: 'inherit'}}>

            <Toast ref={myToast} />
            <ActionButton onPress={() => history.push('/admin/employees')} isQuiet>
                <Back />
                <Text>Cancel</Text>
            </ActionButton>

            <Flex direction="row" justifyContent="end" >
                {formMode !== 'fixed' ?<ActionButton onPress={onCancelEdit} >
                    <Text>Cancel Edit</Text>
                </ActionButton> : null}
                {formMode !== 'fixed' ?<ActionButton onPress={onAddProject}  marginStart="size-175">
                    <AssetsAdded/>
                    <Text>Add Project</Text>
                </ActionButton>:null}
                {formMode !== 'fixed' ? 
                    <TooltipTrigger delay={0}>
                    <ActionButton variant="negative" onPress={onDeleteProject} marginStart="size-175" isDisabled={projects.length === 1}>
                        <DeleteOutline/>
                        <Text>Delete Project</Text>
                    </ActionButton>
                    <Tooltip>Deletes the selected project</Tooltip>
                    </TooltipTrigger> : null}
                {formMode === 'fixed' ?
                    <ActionButton onPress={() => onFormToggleMode()} marginStart="size-175" >
                        <Text>Edit</Text>
                    </ActionButton>
                : <ActionButton onPress={() => onFormToggleMode()} marginStart="size-175" >
                        <Text>Save</Text>
                  </ActionButton>}
            </Flex>

            <div>
                <div>
                    <nav className="nav-cmp-employee-projects">
                        <div className="spectrum-Tabs spectrum-Tabs--horizontal" style={{display: 'flex'}}>
                            { projects.map((proj, index) => {
                                return <div key={index} style={{marginLeft: '10px', marginRight: '10px'}} className={`spectrum-Tabs-item ${index === activeProject ? 'nav-active-style' : null}`} to="/admin" >
                                    {/* <span className="spectrum-Tabs-itemLabel" onClick={() => { setActiveProject(index)}}>Project {index + 1}</span> */}
                                    <span className="spectrum-Tabs-itemLabel" onClick={() => { setActiveProject(index)}}>{proj.projectName}</span>
                                </div>
                            })}
                        </div>
                    </nav>
                </div>

                <div className="project-container">
                    <div className="row">
                        <div className="col-md-6">
                            <form className="dataForm">

                                {/* Compensation */}
                                <Flex UNSAFE_className="employee-project-input-line">
                                    <Text 
                                        htmlFor="projectName" 
                                        UNSAFE_className="employee-project-labels">
                                        Projet Name
                                    </Text>
                                    <InputText 
                                        className="employee-projects-prime-react-input"
                                        name="projectName"
                                        value={projects[activeProject]?.projectName ?? ''} 
                                        onChange={(e) => onProjectChange(e)} />
                                </Flex>

                                {/* Start Date */}
                                <Flex UNSAFE_className="employee-project-input-line">
                                    <Text 
                                        htmlFor="compensation-rate" 
                                        UNSAFE_className="employee-project-labels">
                                        Start Date
                                    </Text>
                                    <Calendar 
                                        width="100%"
                                        name="startDate"
                                        disabled={formMode === 'fixed'}
                                        className="onboarding-calendar-input" 
                                        value={new Date(projects[activeProject]?.startDate)} 
                                        showIcon 
                                        onChange={(e) => onProjectStartDateChange(e)}  />
                                </Flex>

                                {/* End Date */}
                                <Flex UNSAFE_className="employee-project-input-line">
                                    <Text 
                                        htmlFor="compensation-rate" 
                                        UNSAFE_className="employee-project-labels">
                                        End Date
                                    </Text>
                                    <Calendar 
                                        width="100%"
                                        name="endDate"
                                        disabled={formMode === 'fixed'}
                                        className="onboarding-calendar-input" 
                                        value={new Date(projects[activeProject]?.endDate)} 
                                        showIcon 
                                        onChange={(e) => onProjectEndDateChange(e)}  />
                                </Flex>

                                <Flex UNSAFE_className="employee-project-input-line">
                                    <Text 
                                        htmlFor="compensation-rate" 
                                        UNSAFE_className="employee-project-labels">
                                        Billing Rate
                                    </Text>
                                    <InputNumber 
                                        id="compensation-rate" 
                                        name="billingRate"
                                        disabled={formMode === 'fixed'}
                                        className="employee-project-input-number prime-react-input-field"
                                        value={projects[activeProject]?.billingRate ?? ''} 
                                        onValueChange={(e) => onProjectChange(e)} 
                                        mode="decimal" 
                                        prefix="$"
                                        suffix=" /Hour"
                                        locale="en-US" 
                                        minFractionDigits={2}/>
                                </Flex>

                            
                            </form>
                        </div>

                        <div className="col-md-6">
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                <div style={{alignSelf: 'center', marginLeft: '28px'}}><b>Compensation </b></div>
                            </div>
                            
                            <form className="dataForm">

                                <Picker width="100%" 
                                    isDisabled={formMode === 'fixed'}
                                    maxWidth="500px" 
                                    defaultSelectedKey={projects[activeProject]?.compensationType ?? ''}
                                    UNSAFE_className={'details-picker'} 
                                    items={compensationTypeOptions}
                                    onSelectionChange={(value) => onProjectCompensationTypeChange(value)}
                                    label="Compensation Type" 
                                    labelPosition="side">
                                {(item) => <Item>{item.name}</Item>}
                                </Picker>

                                <Flex UNSAFE_className="employee-project-input-line" UNSAFE_style={{marginTop: '10px'}}>
                                    <Text 
                                        htmlFor="compensation-type" 
                                        UNSAFE_className="employee-project-labels">
                                        Compensation
                                    </Text>
                                    {
                                        projects[activeProject]?.compensationType === 'PERCENTAGE' ?
                                        <InputNumber 
                                            id="compensation" 
                                            disabled={formMode === 'fixed'}
                                            className="compensation-input-number prime-react-input-field"
                                            value={projects[activeProject]?.compensation ?? ''} 
                                            suffix="%"
                                            name="compensation"
                                            onValueChange={(e) => onProjectChange(e)} 
                                            minFractionDigits={2}/> :
                                            projects[activeProject]?.compensationType === 'FIXEDRATE' ? 
                                        <InputNumber 
                                            id="compensation-rate" 
                                            disabled={formMode === 'fixed'}
                                            className="compensation-input-number prime-react-input-field"
                                            value={projects[activeProject]?.compensation ?? ''} 
                                            onValueChange={(e) => onProjectChange(e)} 
                                            mode="decimal" 
                                            name="compensation"
                                            prefix="$"
                                            suffix=" /Hour"
                                            locale="en-US" 
                                            minFractionDigits={2}/> :
                                        <InputNumber 
                                            id="compensation-rate" 
                                            disabled={formMode === 'fixed'}
                                            name="compensation"
                                            className="compensation-input-number prime-react-input-field"
                                            value={projects[activeProject]?.compensation ?? ''} 
                                            onValueChange={(e) => onProjectChange(e)} 
                                            mode="decimal" 
                                            prefix="$"
                                            locale="en-US" 
                                            minFractionDigits={2}/>    
                                    }
                                </Flex>

                                <Flex>
                                    <Text 
                                        htmlFor="compensation-rate" 
                                        UNSAFE_className="employee-project-labels">
                                        Overtime Compensation
                                        </Text>
                                    <InputNumber 
                                        id="compensation-rate" 
                                        disabled={formMode === 'fixed'}
                                        className="compensation-input-number prime-react-input-field"
                                        name="overtimeCompensation"
                                        value={projects[activeProject]?.overtimeCompensation ?? ''} 
                                        onValueChange={(e) => onProjectChange(e)} 
                                        mode="decimal" 
                                        prefix="$"
                                        suffix=" /Hour"
                                        locale="en-US" 
                                        minFractionDigits={2}/>
                                </Flex>

                                <Picker width="100%" 
                                    isDisabled={formMode === 'fixed'}
                                    maxWidth="500px" 
                                    defaultSelectedKey={projects[activeProject]?.compensationSchedule ?? ''}
                                    UNSAFE_className={'details-picker'} 
                                    items={compensationScheduleOptions}
                                    onSelectionChange={(value) => onProjectCompensationScheduleChange(value)}
                                    label="Payroll Cycle" 
                                    labelPosition="side">
                                {(item) => <Item>{item.name}</Item>}
                                </Picker>

                            
                            </form>


                                {/* <div style={{textAlign: 'center', padding: '15px'}}>Commission </div>
                                <form className="dataForm" style={{paddingTop: '10px'}}>
                                    <Flex>
                                        <label className="textLabelProjects" style={{alignSelf: 'center', width: '200px'}}>Person</label>
                                        <Dropdown className="textLabelDropDowns" 
                                            value={selectedProject}
                                            options={commissionOptions} 
                                            name="organizationName" 
                                            filter 
                                            filterBy="label" 
                                            // dataKey="key"
                                            optionLabel="label"
                                            disabled={formMode === 'fixed'}
                                            onChange={onChangeCommission} 
                                            placeholder="Select A Person"/>
                                        </Flex>
                                    <Flex UNSAFE_className="employee-project-input-line" UNSAFE_style={{marginTop: '10px'}}>
                                        <Text 
                                            htmlFor="compensation-rate" 
                                            UNSAFE_className="employee-project-labels">
                                            Commission Amount
                                            </Text>
                                        <InputNumber 
                                            id="compensation-rate" 
                                            disabled={formMode === 'fixed'}
                                            className="compensation-input-number prime-react-input-field"
                                            name="overtimeCompensation"
                                            value={projects[activeProject]?.overtimeCompensation ?? ''} 
                                            onValueChange={(e) => onProjectChange(e)} 
                                            mode="decimal" 
                                            prefix="$"
                                            locale="en-US" 
                                            minFractionDigits={2}/>
                                    </Flex>
                                </form> */}
                            </div>
                    </div>

                    {/* Line Seperator */}
                    {/* <div style={{borderBottom: '2px solid #707070', marginTop: '20px', marginBottom: '20px'}} /> */}

                    <div className="row" style={{justifyContent: 'flex-end'}}>
                        <div className="col-md-6" style={{marginTop: '10px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{alignSelf: 'center', marginLeft: '28px'}}><b>Commission Per Project </b></div>
                                <div style={{alignSelf: 'center'}}><ActionButton onPress={onAddPersonCommission} isDisabled={formMode !== 'edit'}><Text>Add Person</Text></ActionButton></div>
                            </div>
                          
                        {
                            projects[activeProject]?.commissions?.map((commission, index) => {
                                return <>
                                    <form className="dataForm" style={{paddingTop: '10px'}}>
                                        <Flex>
                                            <label className="textLabelProjects" style={{alignSelf: 'center', width: '200px'}}>{`Person ${index + 1}`}</label>
                                            <Dropdown className="textLabelDropDowns" 
                                                value={commission.employeeCommission}
                                                options={commissionOptions} 
                                                name="employeeCommission" 
                                                filter 
                                                filterBy="label" 
                                                // dataKey="key"
                                                optionLabel="label"
                                                disabled={formMode === 'fixed'}
                                                onChange={(e) => onChangeCommission(e, index)} 
                                                placeholder="Select A Person"/>
                                            </Flex>
                                        <Flex>
                                        <Picker width="100%" 
                                            isDisabled={formMode === 'fixed'}
                                            maxWidth="500px" 
                                            defaultSelectedKey={commission.commissionType}
                                            UNSAFE_className={'details-picker'} 
                                            items={commissionTypeOptions}
                                            onSelectionChange={(value) => onChangeCommissionType(value, index)}
                                            label="Commission Type" 
                                            labelPosition="side">
                                        {(item) => <Item>{item.name}</Item>}
                                        </Picker>    
                                        </Flex>
                                        <Flex UNSAFE_className="employee-project-input-line" UNSAFE_style={{marginTop: '10px'}}>
                                            <Text 
                                                htmlFor="compensation-rate" 
                                                UNSAFE_className="employee-project-labels">
                                                Commission
                                            </Text>
                                            {
                                                commission.commissionType === 'PERCENTAGE' ?
                                                <InputNumber 
                                                    id="commissionAmount" 
                                                    disabled={formMode === 'fixed'}
                                                    className="compensation-input-number prime-react-input-field"
                                                    value={commission.commissionAmount} 
                                                    suffix="%"
                                                    name="commissionAmount"
                                                    // onValueChange={(e) => onProjectChange(e)} 
                                                    minFractionDigits={2}/> :
                                                <InputNumber 
                                                    id="compensation-rate" 
                                                    disabled={formMode === 'fixed'}
                                                    name="compensation"
                                                    className="compensation-input-number prime-react-input-field"
                                                    value={commission.commissionAmount} 
                                                    // onValueChange={(e) => onProjectChange(e)} 
                                                    mode="decimal" 
                                                    prefix="$"
                                                    locale="en-US" 
                                                    minFractionDigits={2}/>     
                                            }
                                        </Flex>
                                    </form>
                                    <Divider size="M"/>
                                </>
                            })
                        }
                        </div>
                    </div>


                    {/* Line Seperator */}
                    <div style={{borderBottom: '2px solid #707070', marginTop: '20px', marginBottom: '20px'}} />


                    <div className="row">
                        <div className="col-md-6">

                            <div style={{textAlign: 'center', padding: '15px'}}>Hierarchy</div>
                            
                            {
                                projects[activeProject]?.projectItenerary.map((itenerary, index) => {
                                    return <>
                                    <div key={index}>
                                        <div direction="row" style={{display: 'flex', flexDirection: 'row'}}>
                                            <div 
                                                
                                                style={{alignSelf: 'center', marginLeft: '20px', width: '40%', minWidth: '150px', maxWidth: '150px'}}
                                                onClick={() => { onOrgClick(index, itenerary.organizationId, itenerary.locationId)}}>
                                                    <div style={{
                                                        color: index === activeHierarchy ? '#36BFEC' : null,
                                                        textDecoration: index === activeHierarchy ? 'underline' : null,
                                                        textAlign: 'center'
                                                        }}>{itenerary.organizationName}</div>
                                            </div >
                                            <div style={{alignSelf: 'center', width: '60%'}}>
                                                <ButtonGroup>
                                                    <ActionButton marginEnd="size-175" variant="primary" isDisabled={formMode === 'fixed'} onPress={() =>  onOrgChange(index, 'parent')}><Text>+ Above</Text></ActionButton>
                                                    <ActionButton marginEnd="size-175" variant="secondary" isDisabled={formMode === 'fixed'} onPress={() => onOrgChange(index, 'child')}><Text>+ Below</Text></ActionButton>
                                                    <ActionButton isDisabled={projects[activeProject]?.projectItenerary.length === 1 || formMode === 'fixed'} variant="secondary" onPress={() => onOrgChange(index, 'remove')}>Delete</ActionButton>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </div>
                                    {index !== projects[activeProject]?.projectItenerary.length - 1? <div>
                                        <Flex justifyContent="center">
                                            {/* <div style={{height: '20px', width: '1px', background: 'black', marginLeft: '50px'}}></div> */}
                                            <div style={{border: '1px solid transparent', height: '30px', width: '100%'}}>
                                                <div style={{alignSelf: 'center', marginLeft: '20px', width: '40%', minWidth: '150px', maxWidth: '150px', display: 'flex', justifyContent: 'center'}}>
                                                    <div style={{color: 'lightgrey'}}><ArrowDown/></div>
                                                </div>
                                                <div style={{width: '60%'}}></div>
                                            </div>
                                        </Flex>
                                    </div>: null
                                    }
                                </>
                                })
                            }      
                    
                        </div>
                        <div className="col-md-6">

                            <div style={{textAlign: 'center', padding: '15px'}}>Selected Organization Information </div>
                            <form className="dataForm">
                                <div className="dataInput" >
                                    {/* <label className="textLabelProjects">Organization</label>
                                    <input className="textField" 
                                                 disabled={formMode === 'fixed'}
                                        type="text"
                                        name="organizationName"
                                        value={projects[activeProject].projectItenerary[activeHierarchy].organizationName}
                                        onChange={onChange}
                                    /> */}
                                        
                                        <Flex>
                                            <label className="textLabelProjects" style={{alignSelf: 'center'}}>Organization</label>
                                            <Dropdown className="textLabelDropDowns" 
                                            // value={projects[activeProject].projectItenerary[activeHierarchy].organizationName} 
                                            value={selectedProject}
                                            options={organizationOptions} 
                                            name="organizationName" 
                                            filter 
                                            filterBy="label" 
                                            // dataKey="key"
                                            optionLabel="label"
                                            disabled={formMode === 'fixed'}
                                            onChange={onChangeOrganization} 
                                            placeholder="Organization"/>
                                        </Flex>
                                </div>

                                <div className="dataInput" >
                                    <label className="textLabelProjects">Role</label>
                                    <input className="textField" 
                                                 disabled={formMode === 'fixed'}
                                        type="text"
                                        name="role"
                                        value={projects[activeProject]?.projectItenerary[activeHierarchy]?.role}
                                        onChange={onChange}
                                    />
                                </div>

                                <div className="dataInput" >
                                    {/* <label className="textLabelProjects">Location</label>
                                    <input className="textField" 
                                                 disabled={formMode === 'fixed'}
                                        type="text"
                                        name="location"
                                        value={projects[activeProject].projectItenerary[activeHierarchy].location}
                                        onChange={onChange}
                                    /> */}
                                    <Flex>
                                        <label className="textLabelProjects" style={{alignSelf: 'center'}}>Location</label>
                                        <Dropdown  className="textLabelDropDowns"  
                                        // value={projects[activeProject].projectItenerary[activeHierarchy].location} 
                                        value={selectedLocation}
                                        options={locationOptions} 
                                        disabled={formMode === 'fixed'}
                                        name="location" 
                                        filter 
                                        filterBy="label" 
                                        onChange={onChangeLocation} 
                                        placeholder="Location"/>
                                    </Flex>
                                </div>

                                <div className="dataInput" >
                                    {/* <label className="textLabelProjects">Client Manager</label>
                                    <input className="textField" 
                                                 disabled={formMode === 'fixed'}
                                        type="text"
                                        name="clientManager"
                                        value={projects[activeProject].projectItenerary[activeHierarchy].clientManager}
                                        onChange={onChange}
                                    /> */}
                                    <Flex>
                                        <label className="textLabelProjects" style={{alignSelf: 'center'}}>Manager</label>
                                        <Dropdown  className="textLabelDropDowns"  
                                        // value={projects[activeProject].projectItenerary[activeHierarchy].clientManager} 
                                        value={selectedManager}
                                        options={managerOptions} 
                                        disabled={formMode === 'fixed'}
                                        name="clientManager" 
                                        filter 
                                        filterBy="label" 
                                        optionLabel="label"
                                        onChange={onChangeManager} placeholder="Manager"/>
                                    </Flex>
                                </div>

                                <div className="dataInput" >
                                    {/* <label className="textLabelProjects">Net Terms</label>
                                    <input className="textField" 
                                                 disabled={formMode === 'fixed'}
                                        type="text"
                                        name="netTerms"
                                        value={projects[activeProject].projectItenerary[activeHierarchy].netTerms}
                                        onChange={onChange}
                                    /> */}
                                     <Flex>
                                        <label className="textLabelProjects" style={{alignSelf: 'center'}}>Net terms</label>
                                        <Dropdown  
                                        className="textLabelDropDowns"  
                                        value={projects[activeProject]?.projectItenerary[activeHierarchy]?.netTerms} 
                                        options={netTermsOptions} 
                                        disabled={formMode === 'fixed'}
                                        name="netTerms" 
                                        filter 
                                        filterBy="label" 
                                        onChange={(e) => {
                                            // console.log(e)
                                            onChange(e)
                                        }} placeholder="Net Terms"/>
                                    </Flex>
                                </div>
                                
                            
                            </form>
                        </div>
                    </div>

                </div>
                
            </div>

            

           
        
        </div>
    )
}

export default EmployeeProjects
