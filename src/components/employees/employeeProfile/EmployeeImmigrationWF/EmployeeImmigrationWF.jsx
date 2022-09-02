// import { ActionButton, Text} from '@adobe/react-spectrum';
// import Back from '@spectrum-icons/workflow/BackAndroid';
// import React from 'react'
// import { useHistory } from 'react-router-dom';

// const EmployeeImmigrationWF = () => {

//     const history = useHistory();
//     return (
//         <div style={{padding: '20px', height: 'inherit'}}>
//             <ActionButton onPress={() => history.goBack()} isQuiet>
//                 <Back />
//                 <Text>Cancel</Text>
//             </ActionButton>



            
//         </div>
//     )
// }

// export default EmployeeImmigrationWF

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom'

import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';

// Components
// import EmployeeDetails from './EmployeeDetails/EmployeeDetails';
// import EmployeeCompnensation from './EmployeeCompensation/EmployeeCompnensation';
// import EmployeeProjects from './EmployeeProjects/EmployeeProjects';
// import EmployeeImmigration from './EmployeeImmigration/EmployeeImmigration';

import Accepted from './Accepted/Accepted';
import DocumentsUpload from './DocumentsUploaded/DocumentsUpload';
import ImmigrationStart from './ImmigrationStart/ImmigrationStart';
import DocumentVerified from './DocumentsVerified/DocumentsVerified';
import Filed from './Filed/Filed';
import Questionnaires from './Questionnaires/Questionnaires';
import QuestionnaireVerfied from './QuestionnaireVerified/QuestionnaireVerified';
import SendToAttorney from './SendToAttorney/SendToAttorney';

// import { withFirebase } from '../../../../firebase/Firebase'

import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Custom Icons
// import EmployeeIcon from '../../../../assets/svgs/employee-details-icon.svg';
// import CompensationIcon from '../../../../assets/svgs/compensation-icon.svg';
// import ProjectsIcon from '../../../../assets/svgs/projects-icon.svg';
// import ImmigrationIcon from '../../../../assets/svgs/immigration-verify-icon.svg';
import { ActionButton, Divider, Header, Text} from '@adobe/react-spectrum';
import Back from '@spectrum-icons/workflow/BackAndroid';

// import ArrowLeftMedium from '@adobe/spectrum-css/icons/medium/ArrowLeftMedium.svg';
import FirebaseContext from '../../../../firebase/Context';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';
import DocumentsVerified from './DocumentsVerified/DocumentsVerified';



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



const returnComponent =()=>{
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
 return <ColorlibConnector />
}


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
     
    // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    boxShadow: '0 0 15px 7px #30ABD3',
    border: '2px solid white'
  },
  completed: {
    backgroundImage:
    'linear-gradient(to bottom, #30ABD3 0%, #18566A 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

//   const icons = {
//     1: <img src={EmployeeIcon} alt='Employee Details'></img>,
//     2: <img src={CompensationIcon} alt='Compensation'></img>,
//     3: <img src={ProjectsIcon} alt='Projects'></img>,
//     4: <img src={ImmigrationIcon} alt='Immigration'></img>,
//   };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {/* {icons[String(props.icon)]} */}
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
  return [
      'Initiated', 
      'Questionnaires Completed', 
      'Questionnaires Verified', 
      'Documents Uploaded',
      'Documents Verified',
      'Send To Attorney',
      'Filed',
      'Accepted'];
}

// function getStatus(){
//   return ["completed", "completed", "completed", "completed", null , null , null, null]
// }

function maxStepCompleted(caseStatus){

  for(let i in caseStatus)
    if(caseStatus[i].stepStatus === "null")
       return parseInt(i)
}

function getStepContent(step, timelineEvents, questionnaires, employee, caseNumber, caseType) {
 
  switch (step) {
    case 0:
      return <ImmigrationStart 
        activeStep={step}
        timelineEvents={timelineEvents}
        // handleBack={() => handleBack()}
        // handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
 
        />;
    case 1:
      return <Questionnaires 
        activeStep={step}
        questionnaires={questionnaires}
        employee={employee}
        caseNumber={caseNumber}
        caseType={caseType}
        // handleBack={() => handleBack()}
        // handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
      
        />;
    case 2:
      return <QuestionnaireVerfied
        activeStep={step}
        employee={employee}
        caseNumber={caseNumber}
        // handleBack={() => handleBack()}
        // handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
       
      />
    case 3:
      return <DocumentsUpload
        activeStep={step}
        employee={employee}
        caseNumber={caseNumber}
        // handleBack={() => handleBack()}
        // handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 

        />
    case 4: 
        return <DocumentsVerified
        activeStep={step}
        employee={employee}
        caseNumber={caseNumber}
        // handleBack={() => handleBack()}
        // handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
        />
    case 5:
        return <SendToAttorney
        activeStep={step}
        employee={employee}
        caseNumber={caseNumber}
        questionnaires={questionnaires}
        // handleBack={() => handleBack()}
        // handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
        />
    case 6: 
        return <Filed
        activeStep={step}
        employee={employee}
        caseNumber={caseNumber}
        // handleBack={() => handleBack()}
        // handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
        />
    case 7:
        return <Accepted
        activeStep={step}
        // handleBack={() => handleBack()}
        // handleNext={(data)=>handleNext(data, employeeOnboardingData, step)} 
        />
    default:
      return 'Unknown step';
  }
}

const EmployeeImmigrationWF = (props)=>{

  // console.log(props.location);

  const myToast                     = useRef(null);
  const history                     = useHistory()
  const firebase                     = useContext(FirebaseContext);
  const classes                     = useStyles();
  const tenantName                  = useSelector((store) => { return store.auth.tenantName})

  const steps                       = getSteps();
  // const status                      = getStatus();

  const [employee]                  = useState(props.location.state.employee);

  const [caseNumber]                = useState(props.location.state.case.caseNumber);
  const [caseType]                  = useState(props.location.state.case.caseType);
  const [timelineEvents]            = useState(props.location.state.case.timelineEvents);
  const [documents]                 = useState(props.location.state.case.documents);
  const [questionnaires]            = useState(props.location.state.case.questionnaires ?? []);

  const [caseStatus, setCaseStatus] = useState([])
  const [activeStep, setActiveStep] = useState(0);

  useEffect(()=>{
    console.log("Use Effect Immig workflow")
    const caseStatusRef = `${firebase.tenantId}_immigration/${employee.id}/${caseNumber}/caseStatus`
    firebase.db.ref(caseStatusRef).on("value", response=>{
      console.log("Case Status ", response.val())
        setCaseStatus(response.val());
        setActiveStep(maxStepCompleted(response.val()))

    })
  },[])

  const showToast = (severityValue, summaryValue, detailValue) => {  
    myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

  const handleNext = (data, state,  activeStep) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };


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
  
  console.log(caseStatus, activeStep)
  return (
    <div className={classes.root} style={{margin: '20px'}}>

         <div style={{marginBottom: '20px', height: 'inherit'}}>
             <ActionButton onPress={() => history.goBack()} isQuiet>
                 <Back />
                 <Text>Cancel</Text>
             </ActionButton>
            
         </div>

         <Header marginBottom="size-175">
            Case Profile - <Text>{props.location.state.case.caseNumber}</Text>
         </Header>
         <Divider size="M"/>

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
      <Stepper alternativeLabel activeStep={activeStep} connector={returnComponent()} style={{background: 'transparent'}}>
        {steps.map((label, index) => (
          <Step 
            key={label}
            onClick={() => index <= maxStepCompleted(caseStatus) ? setActiveStep(index): null}
          >
            <StepLabel StepIconComponent={ColorlibStepIcon} StepIconProps={{active: index == activeStep, completed: caseStatus?.[index]?.stepStatus=="completed" && index!=activeStep}}>{label}</StepLabel>
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
            <Typography className={classes.instructions}>{getStepContent(activeStep, timelineEvents, questionnaires, employee, caseNumber, caseType)}</Typography>
           
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(EmployeeImmigrationWF)

