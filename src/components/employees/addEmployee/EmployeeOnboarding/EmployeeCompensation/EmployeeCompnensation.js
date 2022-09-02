import React, { useState } from 'react';
import { TextField, Form, ActionButton, Picker, Item } from '@adobe/react-spectrum'
import * as utils from '../../../../../utils';

import "./EmployeeCompensation.css";

const netTermsOptions = [
    {key: 'NET15', name: 'Net 15'},
    {key: 'Net30', name: 'Net 30'},
    {key: 'NetEOM10', name: 'Net EOM 10'},
    {key: '1/10Net30', name: '1/10 Net 30'},
    {key: '2/10Net30', name: '2/10 Net 30'},
    {key: '1/1060', name: '1/10 60'},
    {key: '2/10Net60', name: '2/10 Net 60'}
];

const EmployeeDetails = (props) => {

    const [compType, setCompType] = useState(props.employeeCompensation.compType);
    const [rate, setRate] = useState(props.employeeCompensation.rate);
    const [netTerms, setNetTerms] = useState(props.employeeCompensation.netTerms);
  
    const buttonDisabled = () => {
        console.log(compType, rate, compType.length === 0, rate.length === 0);
        return compType.length === 0 || rate.length === 0;
    }


    return (<>
        <div className="row">
            <div className="col-md-6">
                <Form isQuiet marginTop="20px" direction="column" width="100%">
                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field" 
                    label="Compensation Type" isRequired inputMode="text" onChange={setCompType} defaultValue={compType}/>

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Rate" isRequired inputMode="text" onChange={setRate} defaultValue={rate}/>

                    <Picker width="100%" 
                    defaultSelectedKey={netTerms}
                    UNSAFE_className={'onboarding-details-picker'} 
                    items={netTermsOptions}
                    onSelectionChange={(value) => setNetTerms(value)}
                    label="Net Terms" 
                    labelPosition="side">
                    {(item) => <Item>{item.name}</Item>}
                    </Picker>

                </Form>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <div style={{width: '100%', height: '100px', background: 'transparent', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{alignSelf: 'center', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <ActionButton UNSAFE_className="global-action-btn" isDisabled={props.activeStep === 0} onPress={() => props.handleBack()}>Back</ActionButton>
                        <div>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={buttonDisabled()} onPress={()=> props.handleNext({...{
                                compType, rate, netTerms,
                                }})}>Save</ActionButton>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={buttonDisabled()} onPress={()=> props.handleNext({...{
                                compType, rate, netTerms,
                            }})} marginStart="size-250">Save & Next</ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
    
}

export default EmployeeDetails;