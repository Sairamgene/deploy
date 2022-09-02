import { ActionButton, Text, Flex, Picker, Item, Form, TextField } from '@adobe/react-spectrum'
import React, { useContext, useState}from 'react'
import FirebaseContext from '../../../../../firebase/Context';
import './Filed.css'

const Filed = (props) => {

    const [markOptions, setMarkOptions] = useState([
        {id: 0, key: 'FILED', name: 'Filed'},
        {id: 1, key: 'PENDING', name: 'Pending'},
        {id: 2, key: 'RESUBMIT', name: 'Resubmit'},
    ]);
    const [markSelected, setMarkSelected] = useState('FILED');
    const firebase = useContext(FirebaseContext);

    const onSave = () => {
        console.log(markSelected)
        const caseRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/caseStatus/6`;
        const caseStatusRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/status`;

        firebase.db.ref(caseStatusRef).set(markSelected).then(res => {
            console.log(res)
        }).catch(err => {

        })

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
        <div className="row">
            <div className="col-md-6">
        
                <Form isQuiet maxWidth="350px" marginStart="80px">
                    <Picker 
                        UNSAFE_className="filed-picker"
                        label="Mark As" 
                        labelPosition="side"
                        defaultSelectedKey={markSelected}
                        onSelectionChange={setMarkSelected}
                        items={markOptions}>
                        {(item)=><Item key={item.key}>{item.name}</Item>}
                    </Picker>
                    <TextField label="Receipt Number" UNSAFE_className="filed-textfield" labelPosition="side"/>
                </Form>


          
            </div>
            <div className="col-md-6">
                <Flex justifyContent="end">
                    <ActionButton  UNSAFE_className="bugsy-action-button" defaultSelectedKey={markSelected} UNSAFE_style={{color: 'white'}} onPress={() => onSave()}>
                        <Text>Save</Text>
                    </ActionButton>
                </Flex>
            </div>
        </div>
    )
}

export default Filed
