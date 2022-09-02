import { ActionButton, Divider, Flex, View } from '@adobe/react-spectrum';
import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../../../../../firebase/Context';

const QuestionnaireVerified = (props) => {
    console.log('Questionnaire Verified', props);
    const [timelineEvents, setTimelineEvents] = useState(props.timelineEvents ?? []);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        //https://bugsy-crm.firebaseio.com/COVET_immigration/-covet0/21c-4e51-b95/timelineEvents
        const timelineRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/timelineEvents`;
        firebase.db.ref(timelineRef).on('value', res => {
            console.log(res.val())
            setTimelineEvents(res.val() ?? [])
        });
    },[])

    // useEffect(() => {
    //     const activeStepRef = `${firebase.tenantId}_immigration/${props.employee.id}/$`
    // })

    const onVerify = () => {
        const caseRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/caseStatus/2`;

        firebase.db.ref(caseRef).once('value', res => {
            const caseStatus = res.val();
            const newCaseStatus = {...caseStatus, stepStatus: 'completed', updatedAt: firebase.serverValue.TIMESTAMP};

            firebase.db.ref(caseRef).set(newCaseStatus).then(res => {
                
            }).catch(err => {
                console.log(err)
            })
        })

    }

    return (
        <>
        <Flex justifyContent="end"><ActionButton UNSAFE_style={{color: 'white'}} UNSAFE_className="bugsy-action-button" onPress={() => onVerify()}>Verified</ActionButton></Flex>

       <Flex UNSAFE_style={{padding: '40px'}} direction="column-reverse" alignItems="center">{timelineEvents.map((ele, index) => {
            
        return (<>
            
            <Flex key={index} direction="column" alignItems="center" UNSAFE_style={{padding: '5px'}}>
                  
                <View maxWidth="375px" UNSAFE_style={{fontWeight: 600, textAlign: 'center'}}>{ele.message}</View>
                <View>  {new Date(ele.timestamp).toLocaleDateString()} {new Date(ele.timestamp).toLocaleTimeString()}</View>
            </Flex>
            {timelineEvents.length !== index + 1 ?  <Flex width="100%" justifyContent="center"><Divider orientation="vertical" size="M" height="60px"></Divider></Flex>  : null}
            </>
        )
        })}</Flex>
        </>
    )
}

export default QuestionnaireVerified
