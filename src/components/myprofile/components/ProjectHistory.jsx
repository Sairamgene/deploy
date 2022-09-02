import { Flex, StatusLight, View } from '@adobe/react-spectrum';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import FirebaseContext from '../../../firebase/Context'
import ChevronDoubleRight from '@spectrum-icons/workflow/ChevronLeft';

const ProjectHistory = () => {

    const [projects, setProjects] = useState([]);
    const firebase = useContext(FirebaseContext);
    const employeeId = useSelector((store) => { return store.auth.employeeId});
    const [expandedRows, setExpandedRows] = useState(null);

    const [columns] = useState([
        {field: 'projectId', header: 'ID'},
        {field: 'active', header: 'STATUS'},
        {field: 'projectName', header: 'PROJECT NAME'},
        {field: 'startDate', header: 'START DATE'},
        {field: 'endDate', header: 'END DATE'},
        // {field: 'chargeRate', header: 'CHARGE RATE'},
        // {field: 'paymentRate', header: 'PAYMENT RATE'},
        // {field: 'workAuthorization', header: 'IMMIGRATION STATUS'},
        // {field: 'employeeType', header: 'EMPLOYEE TYPE'},
    ]);

    const [selectedColumns, setSelectedColumns] = useState(columns)

    useEffect(() => {
        const projectHistoryRef = `${firebase.tenantId}_employees/${employeeId}/projects`;
        console.log(projectHistoryRef);
        if(employeeId && firebase.tenantId) {
            firebase.db.ref(projectHistoryRef).on('value', res => {
         
                const projects = res.val();
                console.log(projects);
                setProjects(projects)
            })
        }
    }, [])

    return (
        <View marginTop="size-200">
            <div className="data-table">
                <DataTable
                    selectionMode="single"
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    // onRowExpand={}
                    // onRowCollapse={}
                    value={projects}
                    paginator
                    rowExpansionTemplate={(data) => {

                        return <Flex justifyContent="center" UNSAFE_style={{padding: '12px', paddingBottom: '5px', color: 'white', background: `${data.active ? '#33ac83' : '#747474'}`}}>
                            {data.projectItenerary.map((ite, index) => {
                                return <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <div>{ite.organizationName}</div>
                                        {index == (data.projectItenerary.length - 1) ? null : <div style={{marginTop:'-3px', marginLeft: '0px'}}><ChevronDoubleRight></ChevronDoubleRight></div>}
                                    </div>
                            })}

                        </Flex>
                    }}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                >
                    <Column expander style={{ width: '3em' }}/>

                    {selectedColumns.map(col=> {
                            if (col.field === 'active') {
                                return <Column key={col.field} field={col.field} header={col.header} body={(rowData) => {
                                    console.log(rowData.active)
                                    // return <span className="p-badge p-badge-xl p-badge-warning">New</span>
                                return <StatusLight variant={rowData.active ? 'positive' : 'neutral'}>{rowData.active ? 'Current' : 'Completed'}</StatusLight>
                                }}/>;
                            } else {
                                return <Column key={col.field} field={col.field} header={col.header} />;
                            }
                
                        })}
                </DataTable>
            </div>
        </View>

    )   
}

export default ProjectHistory
