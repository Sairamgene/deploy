import React, { useContext, useEffect, useState } from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId, hashById } from './event-utils'
import { Button, ButtonGroup, Content, Dialog, DialogContainer, Text, TextField, Divider, Header, Heading, Picker, Item, Checkbox, Form, RadioGroup, Radio, View, Flex, ActionButton } from '@adobe/react-spectrum'
import FirebaseContext from '../../../firebase/Context'
import { useSelector } from 'react-redux'
// import { TextField } from '@material-ui/core'
// import Text from '@spectrum-icons/workflow/Text'
import { InputNumber } from 'primereact/inputnumber';


import './Timesheet.css'
import { CenterFocusWeakRounded } from '@material-ui/icons'
import { red } from '@material-ui/core/colors'

const Timesheet = () => {
    // console.log(INITIAL_EVENTS);
    const [weekendsVisible, setWeekendsVisible] = useState(true);
    // const [currentEvents, setCurrentEvents] = useState([]);
    let [isOpen, setIsOpen] = useState(false);
    let [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

    const [initialEvents, setInitialEvents] = useState([
        // {
        //     eventType: "timesheet",
        //     hours: 1,
        //     id: "241-4332-819",
        //     projectId: "124",
        //     start: "2020-11-30",
        //     title: "RTB Dashboard - 1hrs"
        // },
        // {
        //     eventType: "timesheet",
        //     hours: 1,
        //     id: "1e8-4264-b21",
        //     projectId: "123",
        //     start: "2020-12-02",
        //     title: "Onboarding System - 1hrs"
        // }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const [projects, setProjects] = useState([]);
    const [timeOffOptions] = useState([
        {id: 'sickleave', name: 'Sick Leave'},
        {id: 'pto', name: 'Paid Time Off (PTO)'},
        {id: 'uto', name: 'Unpaid Time Off (UTO)'}
    ])
    const [selectedTimeOff, setSelectedTimeOff] = useState(null);

    const [hours, setHours] = useState(0);

    const [selectedProject, setSelectedProject] = useState('');
    const [eventType, setEventType] = useState('timesheet');
    const [selectedInfo, setSelectedInfo] = useState(null);

    const [firstDateOfCalendarView, setFirstDateOfCalendarView] = useState(() => {
        return new Date();
    });

    const [showCalendar, setShowCalendar]=useState(true);

    const firebase = useContext(FirebaseContext);
    const employeeId = useSelector((store) => store.auth.employeeId);
    const employeeName = useSelector((store)=> store.employee.profile.firstName + ' '+ store.employee.profile.lastName)
 

    useEffect(() => {
        // CALL FOR EXISTING USER PROJECTS
        // https://bugsy-crm.firebaseio.com/COVET_employees/-covet0/projects
        const projRef = `${firebase.tenantId}_employees/${employeeId}/projects`;
        firebase.db.ref(projRef).on('value', res => {
            const projects = res.val() ?? [];
            setProjects(projects.map(project => {
                return {
                    id: project.projectId,
                    name: project.projectName,
                    active: project.active
                }
            }).filter(proj => proj.active)
            )
        })
    }, [])

    const renderSidebar = () => {
        return (
        <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
            {/* <h2>Instructions</h2>
            <ul>
                <li>Select dates and you will be prompted to create a new event</li>
                <li>Drag, drop, and resize events</li>
                <li>Click an event to delete it</li>
            </ul> */}
            </div>
            <div className='demo-app-sidebar-section'>
            <label>
                <input
                type='checkbox'
                checked={weekendsVisible}
                onChange={handleWeekendsToggle}
                ></input>
                toggle weekends
            </label>
            </div>
            <div className='demo-app-sidebar-section'>
            {/* <h2>All Events ({currentEvents.length})</h2>
            <ul>
                {currentEvents.map(renderSidebarEvent)}
            </ul> */}
            </div>
        </div>
        )
    }

    const handleWeekendsToggle = () => {
        // this.setState({
        // weekendsVisible: !this.state.weekendsVisible
        // })

        setWeekendsVisible(!weekendsVisible)
    }

    const handleDateSelect = (selectInformation) => {
        // setIsLoading(true);
        console.log(selectInformation, selectedProject)
        console.log('JR');
        // let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInformation.view.calendar

        calendarApi.unselect() // clear date selection

        const localHours = hours
        console.log("Start : handleDateSelect ", selectedInfo.startStr)

        
        if (selectedProject && selectedInfo) {
            selectInformation['title']=`${projects.filter(project => project.id == selectedProject)[0].name} - ${localHours}hrs`
            calendarApi.addEvent({
                // id: createEventId(),
                title: `${projects.filter(project => project.id == selectedProject)[0].name} - ${localHours}hrs`,
                start: selectInformation.startStr,
                end: selectInformation.endStr,
                allDay: selectInformation.allDay,
                hours: selectInformation.hours,
                projectId: selectInformation.projectId,
                projectName: `${projects.filter(project => project.id == selectedProject)[0].name}`,
                eventType: selectInformation.eventType,
                status: 'FILLED'     
            }, true);
            
        }
        setHours(0);
        setIsOpen(false);
        // window.location.reload();
    }

    const onEditSave = (selectInformation) => {
        
        console.log('EDIT SAVE', selectInformation)
        const eventId = selectInformation.event.id
         
        const [year, month, day]=selectInformation.event.startStr.toString().split('-').map(part=>parseInt(part))
        selectInformation.event.remove();
        let calendarApi = selectInformation.view.calendar;
        

        calendarApi.unselect();



       const calendarRef = `${firebase.tenantId}_calendar/${employeeId}/YEAR${year}/MONTH${month}/DAY${day}/${eventId}`;
       console.log('FB URL', calendarRef)
        firebase.db.ref(calendarRef).remove().then((response)=>{
            console.log("DELETED")
            let updatedEvents = {...initialEvents}
            delete updatedEvents[eventId]
            setInitialEvents(updatedEvents)
        }).catch(err=>{
            console.log('ERROR IN DELETION ', err)
        })
       

        setHours(0);
        setIsSelectOpen(false);
        // window.location.reload()
        
    }


    const renderSidebarEvent = (event) => {
        return (
            <li key={event.id}>
            <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
            <i>{event.title}</i>
            </li>
        )
    }
   

    const onEventAddListener = (event) => {
        console.log("Event : onEventAddListener: ",event)
        console.log('JR')
        const newEventId=createEventId();
        const newEvent = {
            id: newEventId,
            title: `${projects.filter(project => project.id == selectedProject)[0].name} - ${hours}hrs`,
            start: event.event.start.toISOString(),
            eventType: eventType,
            projectId: selectedProject,
            hours: hours,
            status: 'FILLED',
            backgroundColor: 'yellow',
            borderColor: 'black'
                       
        }

        const newEvents = {...initialEvents, [newEventId]: newEvent};

        // console.log('HERE-Rakesh', {...initialEvents, newEvent});

        const year = event.event.start.getFullYear();
        const month = event.event.start.getMonth() + 1;
        const day = event.event.start.getDate();

      
        const calendarRef = `${firebase.tenantId}_calendar/${employeeId}/YEAR${year}/MONTH${month}/DAY${day}/${newEventId}`;


            firebase.db.ref(calendarRef).set(newEvent).then(res => {
                console.log('SAVED!!')
                setInitialEvents(newEvents)
                // setIsLoading(false);
                setHours(0);
                setSelectedInfo(null);
                setSelectedProject(null);
            }).catch(err => {
    
            })
        // })
        
    }

    const onEventDeleteListener = (event) => {
        console.log("Event : onEventDeleteListener")
        
    }

    if (isLoading) {
        return <div>Loading..</div>
    }

   const getEventsfromDatabase = (startDate)=>{

    console.log("Get Events from Database ", startDate)
    setShowCalendar(true)   
    const firstMonth = startDate.getMonth() + 1;
    const firstMonthYear = startDate.getFullYear();

    const secondMonth = (firstMonth + 1) > 12 ? 1 : (firstMonth + 1);
    const secondMonthYear = (firstMonth + 1 ) > 12 ? firstMonthYear + 1 : firstMonthYear;

    const thirdMonth = (secondMonth + 1) > 12 ? 1 : (secondMonth + 1);
    const thidMonthYear = (secondMonth + 1 ) > 12 ? secondMonthYear + 1 : secondMonthYear;

    const calendarRefFirstMonth = `${firebase.tenantId}_calendar/${employeeId}/YEAR${firstMonthYear}/MONTH${firstMonth}`;
    const calendarRefSecondMonth = `${firebase.tenantId}_calendar/${employeeId}/YEAR${secondMonthYear}/MONTH${secondMonth}`;
    const calendarRefThirdMonth = `${firebase.tenantId}_calendar/${employeeId}/YEAR${thidMonthYear}/MONTH${thirdMonth}`

    firebase.db.ref(calendarRefFirstMonth).once('value', res => {
        firebase.db.ref(calendarRefSecondMonth).once('value', res2 => {
                firebase.db.ref(calendarRefThirdMonth).once('value', res3 => {

                    let eventArrayForCalendar = [];
                    const firstMonthEvents = res.val() ?? {};
                    const secondMonthEvents = res2.val() ?? {};
                    const thirdMonthEvents = res3.val() ?? {};

                    Object.keys(firstMonthEvents).forEach(day => {
                        Object.keys(firstMonthEvents[day]).forEach(eventKey => {
                            eventArrayForCalendar.push(firstMonthEvents[day][eventKey]);
                        })
                    })

                    Object.keys(secondMonthEvents).forEach(day => {
                        Object.keys(secondMonthEvents[day]).forEach(eventKey => {
                            eventArrayForCalendar.push(secondMonthEvents[day][eventKey]);
                        })
                    })

                    Object.keys(thirdMonthEvents).forEach(day => {
                        Object.keys(thirdMonthEvents[day]).forEach(eventKey => {
                            eventArrayForCalendar.push(thirdMonthEvents[day][eventKey]);
                        })
                    })

                    // console.log(eventArrayForCalendar)

                    const newEvents = {}
                    eventArrayForCalendar.forEach(event=>{
                        let eventBackgroundColor = 
                                        event.status=='SUBMITTED'?'#007bff' :
                                        event.status=='FILLED'? 'white': // '#e09013': 
                                        event.status=='APPROVED' ?'#09b32f': 
                                        event.status=='REJECTED' ? '#eb3e1e' : '';
                        let eventBorderColor= event.status=='SUBMITTED'?'#007bff' :
                        event.status == 'FILLED'? 'white': //#e09013': 
                            event.status=='APPROVED' ?'#09b32f': event.status== 'REJECTED' ? '#eb3e1e' : '';
                        
                        let eventTextColor= event.status==='FILLED'?'black': 'white'
                        newEvents[event.id]={
                            id: event.id,
                            title: event.title,
                            start: new Date(event.start).toISOString().replace(/T.*$/, ''),
                            eventType: event.eventType,
                            projectId: event.projectId,
                            hours: event.hours,
                            status: event.status,
                            backgroundColor: eventBackgroundColor,
                            borderColor: eventBorderColor,
                            textColor: eventTextColor
                                                                                                                                                                                                                                                                                                                    ,
                        }
                    })
                    

                    // const newEvents = eventArrayForCalendar.map(event => {
                    //     return {
                    //         id: event.id,
                    //         title: event.title,
                    //         start: new Date(event.start).toISOString().replace(/T.*$/, ''),
                    //         eventType: event.eventType,
                    //         projectId: event.projectId,
                    //         hours: event.hours
                    //     }
                    // });
                    
                    setInitialEvents(()=> {setShowCalendar(true); return newEvents});
                    
                });
            })
        })
    }

    const handleSubmitConfirm = () => {
        console.log('confirmed sbumission');
        const eventsToUpdate = Object.keys(initialEvents).map(eventKey => {
            const event = initialEvents[eventKey];
            // console.log(event, selectedProject)
            if (event.status === 'FILLED' && event.eventType === 'timesheet' && event.projectId === selectedProject) {
                return initialEvents[eventKey]
            }
        }).filter(event => event !== undefined);

        //Create a Timesheet Submission Entry
        const managerId = 'admin' //It will be pulled from userProfile
        let timesheet_db_ref= `${firebase.tenantId}_Timesheet_Submission/${managerId}`
        let submission_events = {}
        eventsToUpdate.forEach(event =>{
            submission_events[event.id]={
                date: event.start.split('T')[0],
                hours: event.hours
            }
        })

        let submission_request={
            employeeId: employeeId,
            employeeName: employeeName,
            approverId  : managerId,
            projectId   : selectedProject,
            projectName : projects.find(project=> project.id==selectedProject).name,
            totalHours  : eventsToUpdate.reduce((sumOfHours, event)=> sumOfHours+parseInt(event.hours),0),
            status      : 'SUBMITTED',
            approverId  : '',
            submission_events
        }

        console.log('Rakesh Submission request ',submission_request, eventsToUpdate, projects, selectedProject)
        firebase.db.ref(timesheet_db_ref).push().set(submission_request);


        let eventCount = 0;
        const eventUpdateCount = () => { eventCount += 1;
            if(eventCount === eventsToUpdate.length) {
                window.location.reload()
            }
        };
              
        eventsToUpdate.forEach(event => {
          
            const dateParts = event.start.split('-').map(part=>parseInt(part))
            const [year, month, day] = dateParts
            console.log("Dateparts ", dateParts)
            const updatedEvent = {
                ...event,
                status: 'SUBMITTED'
            }

            // ex: https://bugsy-crm.firebaseio.com/COVET_calendar/-covet0/YEAR2020/MONTH12/DAY2/0be-4699-a94
            const eventRef = `${firebase.tenantId}_calendar/${employeeId}/YEAR${year}/MONTH${month}/DAY${day}/${event.id}`;
            // console.log(updatedEvent);
            firebase.db.ref(eventRef).set(updatedEvent).then(res => {
                console.log('SUCCESSFULLY UPDATE', res);
                eventUpdateCount()
            }).catch(err => {
                console.log('FAILED');
                eventUpdateCount()
            })

        });


        window.location.reload();
    }

    return (
   
        <div className='demo-app' style={{marginTop: '20px'}}>

        {/* TimeSheet Submit */}
        <DialogContainer>
        {isSubmitDialogOpen && 
          <Dialog>
                <Heading>Submit Hours</Heading>
                {/* <Header>Connection status: Connected</Header> */}
                <Divider />
                <Content>
                   <Form>
                        {
                            <Flex direction="column">
                                <Picker
                                    width="100%"
                                    label="Project"
                                    labelPosition="top"
                                    defaultSelectedKey={''}
                                    onSelectionChange={setSelectedProject}
                                    items={projects}>
                                    {(item) => {
                                        return <Item key={item.id}>{item.name}</Item>
                                    }}
                                </Picker>
                            </Flex>    
                        }

                        {
                            Object.keys(initialEvents).map(eventKey => {
                                const event = initialEvents[eventKey];
                                // console.log(event, selectedProject)
                                if (event.status === 'FILLED' && event.eventType === 'timesheet' && event.projectId === selectedProject) {
                                    return <Text>{event.start} - {event.title}</Text>
                                }
                            })
                        }

                        
                   </Form>

                </Content>
                <ButtonGroup>
                    <Button variant="secondary" onPress={() => {
                        setIsSubmitDialogOpen(false);
                    }} >
                    Cancel
                    </Button>
                    <Button variant="cta" onPress={() => handleSubmitConfirm()}>
                    Confirm
                    </Button>
                </ButtonGroup>
            </Dialog>
            }
        </DialogContainer>
        {/* End Timesheet */}
        
        <DialogContainer>
        {isOpen && 
          <Dialog>
                <Heading>Add Hours / Leave</Heading>
                {/* <Header>Connection status: Connected</Header> */}
                <Divider />
                <Content>
                   <Form>
                        <RadioGroup value={eventType} onChange={setEventType}>
                            <Radio value="timeoff">Time Off</Radio>
                            <Radio value="timesheet">Time Sheet</Radio>
                        </RadioGroup>
                        {/* {console.log(currentEvents, selectedInfo)} */}
                        {
                            eventType === 'timesheet' ? 
                            <Flex direction="column">
                                <Picker
                                    width="100%"
                                    label="Project"
                                    labelPosition="top"
                                    defaultSelectedKey={''}
                                    onSelectionChange={setSelectedProject}
                                    items={projects}>
                                    {(item) => {
                                        return <Item key={item.id}>{item.name}</Item>
                                    }}
                                </Picker>
                                <Text marginTop="size-175">Hours</Text>
                                <InputNumber value={hours} onChange={e => { console.log("Setting hours"); setHours(e.value)}} max={24} min={0} showButtons mode="decimal" />

                                {/* <TextField type="number" labelPosition="side" label="Hours"/> */}
                            </Flex> :
                            <Picker
                                label="Time Off Type"
                                labelPosition="side"
                                defaultSelectedKey={selectedTimeOff}
                                onSelectionChange={setSelectedTimeOff}
                                items={timeOffOptions}>
                                {(item) => {
                                    return <Item key={item.id}>{item.name}</Item>
                                }}
                            </Picker>
                        }
                   </Form>

                </Content>
                <ButtonGroup>
                    <Button variant="secondary" onPress={() => {
                        setIsOpen(false);
                        setSelectedInfo(null);
                    }} >
                    Cancel
                    </Button>
                    <Button variant="cta" onPress={() => handleDateSelect({...selectedInfo, hours: hours, projectId: selectedProject, eventType: eventType})}>
                    Confirm
                    </Button>
                </ButtonGroup>
        </Dialog>
        }
      </DialogContainer>
        <DialogContainer>
        {isSelectOpen && 
          <Dialog>
                <Heading>Edit Hours / Leave</Heading>
                {/* <Header>Connection status: Connected</Header> */}
                <Divider />
                <Content>
                <Form>
                        <RadioGroup value={eventType} onChange={setEventType}>
                            <Radio value="timeoff">Time Off</Radio>
                            <Radio value="timesheet">Time Sheet</Radio>
                        </RadioGroup>
                        {
                            eventType === 'timesheet' ? 
                            <Flex direction="column">
                                <Picker
                                    defaultSelectedKey={selectedProject}
                                    width="100%"
                                    label="Project"
                                    labelPosition="top"
                                    onSelectionChange={setSelectedProject}
                                    items={projects}>
                                    {(item) => {
                                        return <Item key={item.id}>{item.name}</Item>
                                    }}
                                </Picker>
                                <Text marginTop="size-175">Hours</Text>
                                <InputNumber value={hours} onValueChange={(e) => setHours(e.value)} max={24} min={0} showButtons mode="decimal" />

                                {/* <TextField type="number" labelPosition="side" label="Hours"/> */}
                            </Flex> :
                            <Picker
                                label="Time Off Type"
                                defaultSelectedKey={selectedTimeOff}
                                labelPosition="side"
                                onSelectionChange={setSelectedTimeOff}
                                items={timeOffOptions}>
                                {(item) => {
                                    return <Item key={item.id}>{item.name}</Item>
                                }}
                            </Picker>
                        }
                   </Form>
                
                </Content>
                <ButtonGroup>
                    <Button variant="secondary" onPress={() => {
                        setIsSelectOpen(false);
                        setSelectedInfo(null);
                    }} >
                    Cancel
                    </Button>
                    
                    {<Button isDisabled={initialEvents[selectedInfo.event.id].status=='APPROVED'} variant="negative" onPress={() => onEditSave({...selectedInfo, hours: hours, projectId: selectedProject, eventType: eventType, timeOff: selectedTimeOff})} >
                    Delete
                    </Button>}
                </ButtonGroup>
        </Dialog>
        }
      </DialogContainer>
    
      <div style={{width:"100%", justifyContent:"center", display: 'flex'}}>
        <div style={{width: "20px", height:"20px",textAlign:"center", backgroundColor: 'white', border:".5px solid grey" ,
                            borderRadius:'50%', display:'inline-block', color:'white'}}></div>
        <span style={{marginLeft: "2px"}}>Filled &nbsp; &nbsp; &nbsp;&nbsp;</span>
        <div style={{width: "20px",height:"20px",marginLeft: "30px", textAlign:"center", backgroundColor: '#007bff', border:".5px solid grey" ,
                            borderRadius:'50%',   display:'inline-block', color:'white'}}></div>
        <span style={{marginLeft: "2px"}}>Submitted</span>
        <div style={{width: "20px",height:"20px",marginLeft: "30px",textAlign:"center",backgroundColor: '#09b32f',  border:".5px solid grey" , 
                            borderRadius:'50%', display:'inline-block', color:'white'}}></div>
        <span style={{marginLeft: "2px"}}>Approved</span>
        <div style={{width: "20px",height:"20px",marginLeft: "30px", textAlign:"center", backgroundColor: '#eb3e1e', border:".5px solid grey" ,
                            borderRadius:'50%',   display:'inline-block', color:'white'}}></div>
        <span style={{marginLeft: "2px"}}>Rejected</span>
      </div>
      
        <div className='timesheet-profile'>
            { showCalendar &&  <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            customButtons={{
                submitButton: {
                    text: 'Submit',
                    click: () => {
                        setIsSubmitDialogOpen(true);
                    },
                },
            }}
            headerToolbar={{
                left: 'prev,next,today',
                center: 'title',
                right: 'submitButton dayGridMonth'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekendsVisible}
            // initialEvents={initialEvents} // alternatively, use the `events` setting to fetch from a feed
            datesSet={(info) => getEventsfromDatabase(info.start)}
            events={ Object.keys(initialEvents).map(eventId=>{
                return initialEvents[eventId]
            })} // gets called multiplke times
            // events={initialEvents}
            eventStartEditable={false}
            
            select={(selectedInfo) => {
                // console.log(selectedInfo)
                setSelectedInfo(selectedInfo);
                setIsOpen(true);
                // const {eventType, hours, projectId} = selectedInfo.event._def.extendedProps;
                // setSelectedInfo(selectedInfo);
                // setSelectedInfo({...selectedInfo, hours: hours, projectId: projectId, eventType: eventType});
                // setIsOpen(true);
                // console.log(selectedInfo, currentEvents)
                // const {eventType, hours, projectId} = selectedInfo.event._def.extendedProps;
                // setEventType(eventType);
                // setHours(hours);
                // setSelectedProject(projectId);
                // setSelectedInfo({...selectedInfo, hours: hours, projectId: projectId, eventType: eventType});
                // setIsSelectOpen(true);
            }}
            // eventContent={renderEventContent} // custom render function
            eventClick={(selectedInfo) => {
                // console.log(selectedInfo, currentEvents)
                const {eventType, hours, projectId} = selectedInfo.event._def.extendedProps;
                setEventType(eventType);
                setHours(hours);
                setSelectedProject(projectId);
                setSelectedInfo({...selectedInfo, hours: hours, projectId: projectId, eventType: eventType});
                setIsSelectOpen(true);
            }}
            // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
           eventRemove={(event) => onEventDeleteListener(event)} // Callback when calendarApi removed an event
           eventAdd={(event) => onEventAddListener(event)} // Callback when calendarApi adds an event
        /> }
        </div>
        </div>
    )


}

export default Timesheet;