import React, { useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';

// Components
import EmployeeDetails from './EmployeeDetails/EmployeeDetails';
import EmployeeCompnensation from './EmployeeCompensation/EmployeeCompnensation';
import EmployeeProjects from './EmployeeProjects/EmployeeProjects';
import EmployeeImmigration from './EmployeeImmigration/EmployeeImmigration';
// import { withFirebase } from '../../../../firebase/Firebase'

import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Custom Icons
import EmployeeIcon from '../../../../assets/svgs/employee-details-icon.svg';
import CompensationIcon from '../../../../assets/svgs/compensation-icon.svg';
import ProjectsIcon from '../../../../assets/svgs/projects-icon.svg';
import ImmigrationIcon from '../../../../assets/svgs/immigration-verify-icon.svg';
import { ActionButton, Text} from '@adobe/react-spectrum';
import Back from '@spectrum-icons/workflow/BackAndroid';

// import ArrowLeftMedium from '@adobe/spectrum-css/icons/medium/ArrowLeftMedium.svg';
import FirebaseContext from '../../../../firebase/Context';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';



const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};



const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient(to bottom, #30ABD3 0%, #18566A 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient(to bottom, #30ABD3 0%, #18566A 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient(to bottom, #30ABD3 0%, #18566A 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
    'linear-gradient(to bottom, #30ABD3 0%, #18566A 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <img src={EmployeeIcon} alt='Employee Details'></img>,
    2: <img src={CompensationIcon} alt='Compensation'></img>,
    3: <img src={ProjectsIcon} alt='Projects'></img>,
    4: <img src={ImmigrationIcon} alt='Immigration'></img>,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Employee Details', 'Compensation', 'Projects', 'Immigration/E-Verify'];
}

function getStepContent(step, handleNext, employeeOnboardingData, handleBack, onAddMoreEmployee) {
  const { employeeDetails, employeeCompensation, employeeProjects, employeeImmigration } = employeeOnboardingData
  console.log('GetStepContent ', employeeOnboardingData)
  switch (step) {
    case 0:
      return <EmployeeDetails 
        activeStep={step}
        handleBack={() => handleBack()}
        handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
        employeeDetails={employeeDetails}
        />;
    case 1:
      return <EmployeeCompnensation 
        activeStep={step}
        handleBack={() => handleBack()}
        handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
        employeeCompensation={employeeCompensation}
        />;
    case 2:
      return <EmployeeProjects
        activeStep={step}
        handleBack={() => handleBack()}
        handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
        employeeProjects={employeeProjects}
      />
    case 3:
      return <EmployeeImmigration
        activeStep={step}
        handleBack={() => handleBack()}
        handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
        onAddMoreEmployee={(data)=>onAddMoreEmployee(data, employeeOnboardingData)}
        employeeImmigration={employeeImmigration}
        />
    default:
      return 'Unknown step';
  }
}

const CustomizedSteppers=(props)=>{
  const myToast = useRef(null);
  const firebase = useContext(FirebaseContext);
  const classes = useStyles();
  const tenantName = useSelector((store) => { return store.auth.tenantName})
  const [activeStep, setActiveStep] = React.useState(0);
  const [employeeDetails, setEmployeeDetails]= React.useState({
    id: "",
    firstName: "",
    middleInitial:  "",
    lastName: "",
    phone: "",
    mobile: "",
    address: "",
    email: "",
    ssn: "",
    employeeType: "VENDOR",
    vendor: "",
    vendorLocation: "",
    vendorContact: "",
    backgroundChecked: false,
    imageUrl: "",

    startDate: new Date().toISOString(),
    employeeStatus: '',
    profileTitle: '',
    // visaTitle: '',
    maritalStatus: '',
    currentLocation: '',
    dob: '',
    

    // Employee Status(String), (What is emploee status)
    // Profile Title(String),
    // Visa Status(String),
    // Marital Status,
    // Current Location (Is it same as address?)
  


})
  const [employeeCompensation, setEmployeeCompensation]=React.useState({
      compType: "HOURLY",
      rate: "",
      netTerms: "NET15"
  });
  const [employeeProjects, setEmployeeProjects]=React.useState({
    
    projects: [
      {
        projectItenerary: [
          {
            organizationName: tenantName,
            role: '',
            location: '',
            clientManager: '',
            netTerms: ''
          }
        ],
        startDate: '',
        endDate: '',
        billingRate: '',
      }
    ]
 })
  
  const [employeeImmigration , setEmployeeImmigration]=React.useState({
      workAuthorization: "H1B",
      i94Expiry: "",
      visaExpiry: ""
   })
  const steps = getSteps();

  const showToast = (severityValue, summaryValue, detailValue) => {  
    myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
}

  const handleNext = (data, state,  activeStep) => {
    

    
    // console.log('Handle Next ' , activeStep, data)
    switch(activeStep){
      case 0:
        console.log('Updating EmployeeDetails  ', data)
        if (data.id){
          firebase.employees(data.id).set({...data, ...state.employeeCompensation, updatedAt: firebase.serverValue.TIMESTAMP}).then(
            response=>{
              console.log('SUCCESS IN POSTING EMPLOYEE DETAILS')
              showToast('success', 
              'Sucesffully Saved', 
              `Details for ${data.firstName} ${data.lastName} has been saved!`)
            } 
          ).catch(err => {
            showToast('error', 
                'Saving Error', 
                `${data.firstName} ${data.lastName} Details has NOT been saved!`)
          })
          setEmployeeDetails({...data})
    
        }else{
        
        firebase.employees().push({...data, createdAt: firebase.serverValue.TIMESTAMP, onBoardingComplete: false}).then(
          response=>{
            console.log('Response Path ',response.path)
            showToast('success', 
            'Sucesffully Saved', 
            `Details for ${data.firstName} ${data.lastName} has been saved!`)
            setEmployeeDetails({...state.employeeDetails, ...data, id: response.path.pieces_[1]})
          } 
        ).catch(err => {
          showToast('error', 
          'Saving Error', 
          `${data.firstName} ${data.lastName} Details has NOT been saved!`)
        })
        }
        
        break;
      case 1:
        firebase.employees(state.employeeDetails.id).set({...state.employeeDetails, ...data}).then(
          response=>{
            console.log('Updated one id')
          } 
        )
        setEmployeeCompensation({...data})
        break;
      case 2:
        firebase.employees(state.employeeDetails.id).set({...state.employeeCompensation, ...state.employeeDetails, ...data}).then(
          response=>{
            console.log('Updated one id')
          } 
        )
        setEmployeeProjects({...data})
        break;
        case 3:
          firebase.employees(state.employeeDetails.id).set({...state.employeeCompensation, ...state.employeeDetails,...state.employeeProjects,  ...data}).then(
            response=>{
              console.log('Updated one id')
            } 
          )
          setEmployeeImmigration({...data})
          props.history.push("/admin/employees")
          break;
      default:
        console.log("Going in default")
    }
      
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // const handleSave = (data)=>{

  // }

  const onAddMoreEmployee=(data, state)=>{
        firebase.employees(state.employeeDetails.id).set({...state.employeeCompensation, ...state.employeeDetails,...state.employeeProjects,  ...data}).then(
          response=>{
            console.log('Updated one id')
          } 
        )
        
        setEmployeeDetails({
          id: "",
          firstName: "",
          middleInitial:  "",
          lastName: "",
          phone: "",
          mobile: "",
          address: "",
          email: "",
          ssn: "",
          employeeType: "VENDOR",
          vendor: "",
          vendorLocation: "",
          vendorContact: "",
          backgroundChecked: false,
          imageUrl: "",

          startDate: '',
          employeeStatus: '',
          profileTitle: '',
          maritalStatus: '',
          currentLocation: '',
          dob: ''
          })
        setEmployeeCompensation({
          compType: "HOURLY",
          rate: "",
          netTerms: "Net15"
          });
        setEmployeeProjects({
            projects: [
              {
                projectItenerary: [
                  {
                    organizationName: tenantName,
                    role: '',
                    location: '',
                    clientManager: '',
                    netTerms: ''
                  },
                ],
                startDate: '',
                endDate: '',
                billingRate: '',
              }
            ]
        })
        setEmployeeImmigration({
          workAuthorization: "H1B",
          i94Expiry: "",
          visaExpiry: ""
       })
       setActiveStep(0)

  }
 
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // const actionButtons = 
  //   (<div style={{display: 'flex', justifyContent: 'space-between'}}>
  //       <ActionButton UNSAFE_className="global-action-btn" isDisabled={activeStep === 0} onPress={() => handleBack()}>Back</ActionButton>
  //       <div>
  //         <ActionButton UNSAFE_className="global-action-btn" onPress={() => console.log('SAVE')} marginEnd="20px">Save</ActionButton>
  //         <ActionButton UNSAFE_className="global-action-btn" onPress={() => console.log('SAVE AND NEXT')}> {activeStep === steps.length - 1 ? 'Finish' : 'Save and Next'}</ActionButton>
  //       </div>
  //   </div>)
  

  return (
    <div className={classes.root}>

<Toast ref={myToast} />

       <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <div>
                                {/* <ActionButton 
                                    isQuiet 
                                    onPress={() => props.onAddEmployeeCancel()}>
                                    <img src={ArrowLeftMedium} alt="" style={{padding: '8px'}}/>
                                    <Text>
                                        Cancel
                                    </Text>
                                </ActionButton> */}
                                            {/* <ActionButton onPress={() => props.onAddEmployeeCancel()} isQuiet>
                                                <Back />
                                                <Text>Cancel</Text>
                                            </ActionButton> */}
                            </div>
                            {/* <div>
                                <ActionButton 
                                    UNSAFE_className="global-action-btn" 
                                    onPress={() => console.log('SUBMIT')}>Save
                                </ActionButton>
                            </div> */}
                        </div>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />} style={{background: 'transparent'}}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep, handleNext, { employeeDetails, employeeCompensation, employeeProjects, employeeImmigration }, handleBack, onAddMoreEmployee)}</Typography>
           
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(CustomizedSteppers)
