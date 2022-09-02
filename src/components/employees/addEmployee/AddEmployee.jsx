import { ActionButton, Text } from '@adobe/react-spectrum'
import Back from '@spectrum-icons/workflow/BackAndroid'

import React from 'react'
import { useHistory } from 'react-router-dom';
import EmployeeOnboarding from './EmployeeOnboarding/EmployeeOnboarding';

const AddEmployee = () => {

    const history = useHistory();

    return (
        <div style={{padding: '20px', height: 'inherit'}}>
            <ActionButton onPress={() => history.push('/admin/employees')} isQuiet>
                <Back />
                <Text>Cancel</Text>
            </ActionButton>
            
            <EmployeeOnboarding/>

        </div>
    )
}

export default AddEmployee
