import { ActionButton, Flex, ButtonGroup, Button, View, Divider} from '@adobe/react-spectrum'
import React, { PureComponent } from 'react'

class EmployeeImmigration extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {...this.props.employeeImmigration, 
            
        }

    }

    onOrgClick = (orgIndex) => {
        this.setState({activeHierarchy: orgIndex});
    }

    // insertAt = (array, index, newItenerary) => {
    //     return array.splice(index, 0, newItenerary);
    // }

    onChange = event =>{
    
        this.setState({[event.target.name]: event.target.value})
    }

   

    render() {
        
        return (
            <div>

                <div className="row">
                    <div className="col-md-6">
                        <form className="dataForm" onSubmit={this.onSubmit}>
                            <div className="dataInput" >
                                <label className="textLabel">workAuthorization</label>
                                <input className="textField" 
                                    type="text"
                                    name="workAuthorization"
                                    value={this.state.workAuthorization}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="dataInput" >
                                <label className="textLabel">i94Expiry</label>
                                <input className="textField" 
                                    type="date"
                                    name="i94Expiry"
                                    value={this.state.i94Expiry}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="dataInput" >
                                <label className="textLabel">visaExpiry</label>
                                <input className="textField" 
                                    type="date"
                                    name="visaExpiry"
                                    value={this.state.visaExpiry}
                                    onChange={this.onChange}
                                />
                            </div>

                        </form>

                    </div>
                </div>


               <Flex UNSAFE_className="actionButtons">
                    <ActionButton UNSAFE_className="global-action-btn" isDisabled={this.props.activeStep === 0} onPress={() => this.props.handleBack()}>Back</ActionButton>
                    <div>
                        <ActionButton UNSAFE_className="global-action-btn" onPress={()=>this.props.onAddMoreEmployee({...this.state})}>Add More</ActionButton>
                        <ActionButton UNSAFE_className="global-action-btn" onPress={()=>this.props.handleNext({...this.state})}>Save</ActionButton>
                        <ActionButton UNSAFE_className="global-action-btn" onPress={()=>this.props.handleNext({...this.state})}>Save&Go</ActionButton>
                    </div>
                </Flex>
            </div>
        )
    }
}

export default EmployeeImmigration