import { ActionButton, Flex, Form, Item, Picker, Text } from '@adobe/react-spectrum';
import React, { useContext, useRef, useState } from 'react'
import { useHistory} from 'react-router-dom';
import Back from '@spectrum-icons/workflow/BackAndroid';
import './EmployeeCompensation.css';
import FirebaseContext from '../../../firebase/Context';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';

const compensationTypeOptions = [
    {key: 'SALARY', name: 'Salary'},
    {key: 'PERCENTAGE', name: 'Percentage'},
    {key: 'FIXEDRATE', name: 'Fixed Rate'},
];

const EmployeeCompensation = (props) => {
    
    const [compensationType, setCompensationType]  = useState(props.employee.compensationType ?? null);
    const [compensation, setCompensation]          = useState(props.employee.compensation ?? null);
    const [overtimeCompensation, setOvertimeCompensation] = useState(props.employee.overtimeCompensation ?? null);

    const [isLoading, setIsLoading]                = useState(true);
    const [formMode, setFormMode]                  = useState('fixed')
    const history                                  = useHistory();
    const firebase                                  = useContext(FirebaseContext);

    const myToast                                  = useRef(null);

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }


    const onFormToggleMode = () => {

        if (formMode === 'edit') {
            setFormMode('fixed');
            setIsLoading(true);
            const compChanges = {
                compensationType: compensationType,
                compensation: compensation,
                overtimeCompensation: overtimeCompensation
            }

            const changes = {...props.employee, ...compChanges};
        
            if (changes.id !== null || changes.id !== '' || changes.id !== undefined) {
                console.log('employeeid', changes);

                firebase.employees(changes.id).set({...changes, updatedAt: firebase.serverValue.TIMESTAMP}).then((res) => {
                    setIsLoading(false);
                    showToast('success', 
                    'Sucesffully Saved', 
                    'Changes to Employee Compensation Saved')
                }).catch(() => {
                    showToast('error', 
                    'Saving Error', 
                    'Failed to save changes to DB')
                })
            }
          
        } else if (formMode === 'fixed') {
            setFormMode('edit');
        }
    }

    const onCancelEdit = () => {
        setCompensationType(props.employee.compensationType ?? null);
        setCompensation(props.employee.compensation ?? null);
        setOvertimeCompensation(props.employee.overtimeCompensation ?? null);
        setFormMode('fixed')
    }

    return (<>
        
        <div style={{padding: '20px', height: 'inherit'}}>

        <Toast ref={myToast} />

            <ActionButton onPress={() => history.push('/admin/employees')} isQuiet>
                <Back />
                <Text>Cancel</Text>
            </ActionButton>

            <Flex direction="row" justifyContent="end" >
               { formMode !== 'fixed' ? <ActionButton marginEnd="size-250" onPress={onCancelEdit}>
                    <Text>Cancel Edit</Text>
                </ActionButton> : null}

                <ActionButton onPress={() => onFormToggleMode()}>
                    <Text>{formMode === 'fixed' ? 'Edit' : 'Save'}</Text>
                </ActionButton>
            </Flex>

            <Form isQuiet marginTop="20px" direction="column" maxWidth="500px">
                
                <Picker width="100%" 
                    isDisabled={formMode === 'fixed'}
                    maxWidth="500px" 
                    defaultSelectedKey={compensationType ?? ''}
                    UNSAFE_className={'details-picker'} 
                    items={compensationTypeOptions}
                    onSelectionChange={(value) => setCompensationType(value)}
                    label="Compensation Type" 
                    labelPosition="side">
                   {(item) => <Item>{item.name}</Item>}
                </Picker>
          
                <Flex>
                    <Text 
                        htmlFor="compensation-rate" 
                        UNSAFE_className="compensation-labels">
                        Compensation
                    </Text>
                    {
                        compensationType === 'PERCENTAGE' ?
                        <InputNumber 
                            id="compensation-rate" 
                            disabled={formMode === 'fixed'}
                            className="compensation-input-number prime-react-input-field"
                            value={compensation ?? ''} 
                            suffix="%"
                            onValueChange={(e) => setCompensation(e.value)} 
                            minFractionDigits={2}/> :
                        compensationType === 'FIXEDRATE' ? 
                        <InputNumber 
                            id="compensation-rate" 
                            disabled={formMode === 'fixed'}
                            className="compensation-input-number prime-react-input-field"
                            value={compensation ?? ''} 
                            onValueChange={(e) => setCompensation(e.value)} 
                            mode="decimal" 
                            prefix="$"
                            suffix=" /Hour"
                            locale="en-US" 
                            minFractionDigits={2}/> :
                        <InputNumber 
                            id="compensation-rate" 
                            disabled={formMode === 'fixed'}
                            className="compensation-input-number prime-react-input-field"
                            value={compensation ?? ''} 
                            onValueChange={(e) => setCompensation(e.value)} 
                            mode="decimal" 
                            prefix="$"
                            locale="en-US" 
                            minFractionDigits={2}/>    
                    }
                </Flex>
                <Flex>
                    <Text 
                        htmlFor="compensation-rate" 
                        UNSAFE_className="compensation-labels">
                        Overtime Compensation
                        </Text>
                    <InputNumber 
                        id="compensation-rate" 
                        disabled={formMode === 'fixed'}
                        className="compensation-input-number prime-react-input-field"
                        value={overtimeCompensation ?? ''} 
                        onValueChange={(e) => setOvertimeCompensation(e.value)} 
                        mode="decimal" 
                        prefix="$"
                        suffix=" /Hour"
                        locale="en-US" 
                        minFractionDigits={2}/>
                </Flex>


            </Form>


        
        </div>
    </>
    )
}

export default EmployeeCompensation
