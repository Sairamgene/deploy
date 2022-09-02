import { ActionButton, Flex, ButtonGroup, Button, View, Divider} from '@adobe/react-spectrum'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import './EmployeeProjects.css'
class EmployeeProjects extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {...this.props.employeeProjects, 
            activeProject: 0, 
            activeHierarchy: 0,
        }
    }

    onOrgClick = (orgIndex) => {
        this.setState({activeHierarchy: orgIndex});
    }

    onChange = event =>{
    
        let newState =  JSON.parse(JSON.stringify(this.state));
        newState.projects[this.state.activeProject].projectItenerary[this.state.activeHierarchy][event.target.name] = event.target.value;
        this.setState({...newState});
    }

    onProjectChange = event => {
        let newState =  JSON.parse(JSON.stringify(this.state));
        newState.projects[this.state.activeProject][event.target.name] = event.target.value;
        this.setState({...newState});
    }

    onOrgChange = (orgIndex, type) => {

        console.log(orgIndex);
        let newState =  JSON.parse(JSON.stringify(this.state));
        const itenerary =  {
            organizationName: 'Organization Name',
            role: '',
            location: '',
            clientManager: '',
            netTerms: ''
        };
        
        switch (type) {
            case 'child':
                newState.projects[this.state.activeProject].projectItenerary.splice(orgIndex + 1, 0, itenerary);
                break;
            case 'parent':
                newState.projects[this.state.activeProject].projectItenerary.splice(orgIndex, 0, itenerary);
                break;
            case 'remove':
                newState.projects[this.state.activeProject].projectItenerary.splice(orgIndex, 1);
                break;
            default:
                break;
        }

        console.log(newState);

        this.setState({...newState});

        
    }

    onAddProject = () =>{
        const newProject = {
            projectItenerary: [
                {
                    organizationName: this.props.tenantName,
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
        let newState =  JSON.parse(JSON.stringify(this.state));
        let currentActiveProjects = this.state.activeProject;
        newState.projects.push(newProject);
        this.setState({...newState, activeProject: currentActiveProjects + 1});
    }
    

    render() {
        
        return (
            <div>
                <div>
                    <nav className="nav-cmp-employee-projects">
                        <div className="spectrum-Tabs spectrum-Tabs--horizontal">
                            { this.state.projects.map((proj, index) => {
                                return <div  className={`spectrum-Tabs-item ${index === this.state.activeProject ? 'nav-active-style' : null}`} to="/admin" >
                                    <span className="spectrum-Tabs-itemLabel" onClick={() => { this.setState({activeProject: index})}} >Project {index + 1}</span>
                                </div>
                            })}
                            <div  className="spectrum-Tabs-item" to="/admin">
                                <span className="spectrum-Tabs-itemLabel" onClick={() => this.onAddProject()}>Add Project</span>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="project-container">
                    <div className="row">
                        <div className="col-md-6">
                            <form className="dataForm" onSubmit={this.onSubmit}>
                                <div className="dataInput" >
                                    <label className="textLabel">Start Date</label>
                                    <input className="textField" 
                                        type="date"
                                        name="startDate"
                                        value={this.state.projects[this.state.activeProject].startDate}
                                        onChange={this.onProjectChange}
                                    />
                                </div>

                                <div className="dataInput" >
                                    <label className="textLabel">End Date</label>
                                    <input className="textField" 
                                        type="date"
                                        name="endDate"
                                        value={this.state.projects[this.state.activeProject].endDate}
                                        onChange={this.onProjectChange}
                                    />
                                </div>

                                <div className="dataInput" >
                                    <label className="textLabel">Billing Rate</label>
                                    <input className="textField" 
                                        type="text"
                                        name="billingRate"
                                        value={this.state.projects[this.state.activeProject].billingRate}
                                        onChange={this.onProjectChange}
                                    />
                                </div>

                            </form>

                        </div>
                    </div>


                    {/* Line Seperator */}
                    <div style={{borderBottom: '2px solid #707070', marginTop: '20px', marginBottom: '20px'}} />


                    <div className="row">
                        <div className="col-md-6">

                            <div style={{textAlign: 'center', padding: '15px'}}>Hierarchy</div>
                            
                            {
                                this.state.projects[this.state.activeProject].projectItenerary.map((itenerary, index) => {
                                    return <>
                                    <div>
                                        <div direction="row" style={{display: 'flex', flexDirection: 'row'}}>
                                            <div 
                                                
                                                style={{alignSelf: 'center', marginLeft: '20px', width: '40%', minWidth: '100px'}}
                                                onClick={() => { this.onOrgClick(index)}}>
                                                    <div style={{
                                                        color: index === this.state.activeHierarchy ? '#36BFEC' : null,
                                                        textDecoration: index === this.state.activeHierarchy ? 'underline' : null,
                                                        }}>{itenerary.organizationName}</div>
                                            </div >
                                            <div style={{alignSelf: 'center', width: '60%', minWidth: '500px'}}>
                                                <ButtonGroup>
                                                    <Button variant="primary" onPress={() =>  this.onOrgChange(index, 'parent')}>+ Parent</Button>
                                                    <Button variant="secondary" onPress={() => this.onOrgChange(index, 'child')}>+ Child</Button>
                                                    <Button variant="secondary" isDisabled={this.state.projects[this.state.activeProject].projectItenerary.length === 1} onPress={() => this.onOrgChange(index, 'remove')}>Delete</Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </div>
                                    {index !== this.state.projects[this.state.activeProject].projectItenerary.length - 1? <div>
                                        <Flex>
                                            <div style={{height: '20px', width: '2px', background: 'black', marginLeft: '50px'}}></div>
                                        </Flex>
                                    </div>: null
                                    }
                                </>
                                })
                            }      
                    
                        </div>
                        <div className="col-md-6">

                            <div style={{textAlign: 'center', padding: '15px'}}>Selected Organization Information </div>
                            <form className="dataForm" onSubmit={this.onSubmit}>
                                <div className="dataInput" >
                                    <label className="textLabel">Organization</label>
                                    <input className="textField" 
                                        type="text"
                                        name="organizationName"
                                        value={this.state.projects[this.state.activeProject].projectItenerary[this.state.activeHierarchy].organizationName}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className="dataInput" >
                                    <label className="textLabel">Role</label>
                                    <input className="textField" 
                                        type="text"
                                        name="role"
                                        value={this.state.projects[this.state.activeProject].projectItenerary[this.state.activeHierarchy].role}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className="dataInput" >
                                    <label className="textLabel">Location</label>
                                    <input className="textField" 
                                        type="text"
                                        name="location"
                                        value={this.state.projects[this.state.activeProject].projectItenerary[this.state.activeHierarchy].location}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className="dataInput" >
                                    <label className="textLabel">Client Manager</label>
                                    <input className="textField" 
                                        type="text"
                                        name="clientManager"
                                        value={this.state.projects[this.state.activeProject].projectItenerary[this.state.activeHierarchy].clientManager}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className="dataInput" >
                                    <label className="textLabel">Net Terms</label>
                                    <input className="textField" 
                                        type="text"
                                        name="netTerms"
                                        value={this.state.projects[this.state.activeProject].projectItenerary[this.state.activeHierarchy].netTerms}
                                        onChange={this.onChange}
                                    />
                                </div>
                                
                            
                            </form>
                        </div>
                    </div>

                </div>

                {/* Action Buttons */}
                {/* <Flex UNSAFE_className="actionButtons">
                    <ActionButton UNSAFE_className="global-action-btn" isDisabled={this.props.activeStep === 0} onPress={() => this.props.handleBack()}>Back</ActionButton>
                    <div>
                        <ActionButton UNSAFE_className="global-action-btn" onPress={()=>this.props.handleNext({...this.state})}>Save</ActionButton>
                        <ActionButton UNSAFE_className="global-action-btn" onPress={()=>this.props.handleNext({...this.state})}>Save & Next</ActionButton>
                    </div>
                </Flex> */}
                <div className="row">
                    <div className="col-md-12">
                        <div style={{width: '100%', height: '100px', background: 'transparent', display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{alignSelf: 'center', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <ActionButton UNSAFE_className="global-action-btn" isDisabled={this.props.activeStep === 0} onPress={() => this.props.handleBack()}>Back</ActionButton>
                                <div>
                                    <ActionButton UNSAFE_className="global-action-btn" onPress={()=>this.props.handleNext({...this.state})}>Save</ActionButton>
                                    <ActionButton UNSAFE_className="global-action-btn" onPress={()=>this.props.handleNext({...this.state})} marginStart="size-250">Save & Next</ActionButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps (state) {
    return {
        tenantName: state.auth.tenantName
    }
}

export default connect(mapDispatchToProps, null)(EmployeeProjects);