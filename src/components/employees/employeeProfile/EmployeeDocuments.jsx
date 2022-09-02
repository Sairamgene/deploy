import { ActionButton, ButtonGroup, Content, Button, Dialog, DialogTrigger, Divider, Flex, Heading, Text, IllustratedMessage, View} from '@adobe/react-spectrum'
import Back from '@spectrum-icons/workflow/BackAndroid'

import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Edit from '@spectrum-icons/workflow/Edit';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';

import Upload from '@spectrum-icons/illustrations/Upload';

function EmployeeDocuments() {
    const [formMode, setFormMode] = useState('fixed')
    const history = useHistory();

    const onFormToggleMode = () => {

    }

    return (
        <div style={{padding: '20px', height: 'inherit'}}>
            <ActionButton onPress={() => history.push('/admin/employees')} isQuiet>
                <Back />
                <Text>Cancel</Text>
            </ActionButton>

            <Flex direction="row" justifyContent="end" maxWidth="100%">
                <ActionButton onPress={() => onFormToggleMode()} isQuiet>
                   {formMode === 'fixed' ?  <Edit /> :  <SaveFloppy />}
                    <Text>{formMode === 'fixed' ? 'Edit' : 'Save'}</Text>
                </ActionButton>
                {/* <ActionButton onPress={() => onFormToggleMode()} isQuiet>
                    <Upload/>
                    <Text>Upload Document</Text>
                </ActionButton> */}
                <DialogTrigger>
                <ActionButton isQuiet>Upload</ActionButton>
                {(close) => (
                    <Dialog>
                       
                        {/* <Heading>Upload file</Heading>
                        <Divider /> */}
                        <Content>
                        <Heading>Upload file(s)</Heading>
                 
                            <IllustratedMessage>
                            <Upload />
                            <Heading>Drag and Drop your file</Heading>
                            <Content>
                                Select File(s) from your computer
                               <br/>
                               <input type="file" id="myfile" name="myfile"/>
                            </Content>
                            </IllustratedMessage>  
                        </Content>
                        <ButtonGroup>
                            {/* <Button type="upload" variant="secondary" onPress={() => {console.log('browse')}} children={ <input type="file" id="myfile" name="myfile"/>}>
                                
                            </Button> */}
                            <Button variant="secondary" onPress={close}>
                            Cancel
                            </Button>
                            <Button variant="cta" onPress={close} autoFocus>
                            Confirm
                            </Button>
                        </ButtonGroup>
                    </Dialog>
                )}
                </DialogTrigger>
            </Flex>

           
        
        </div>
    )
}

export default EmployeeDocuments
