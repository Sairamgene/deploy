import { Divider, Flex, View } from '@adobe/react-spectrum';
import React, { useState } from 'react'

const ImmigrationStart = (props) => {
    console.log('Immigrartion Start', props)
    const [timelineEvents] = useState(props.timelineEvents ?? []);
    return (
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
    )
}

export default ImmigrationStart
