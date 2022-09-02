import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch, useHistory} from 'react-router-dom';
import FirebaseContext from '../../firebase/Context';
// import EmployeeProfile from './employeeProfile/EmployeeProfile';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Employees.css';
import { Flex, ProgressCircle, TextField, Button} from '@adobe/react-spectrum';
// import Switch from '@spectrum-icons/workflow/Switch';
// import { Button as PrimeButton } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';



function Employees() {

    // const [employeeData, setEmployeeData] = useState([{id: 1, name: 'Rakesh'},{id: 2, name: 'JR'},{id: 3, name: 'Ravi'}]);
    const match = useRouteMatch();
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const [employees, setEmployees] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading,setIsLoading] = useState(true);

    const [columns] = useState([
        {field: 'employee', header: 'EMPLOYEE NAME'},
        {field: 'clients', header: 'CLIENTS'},
        {field: 'margin', header: 'MARGIN'},
        {field: 'chargeRate', header: 'CHARGE RATE'},
        {field: 'paymentRate', header: 'PAYMENT RATE'},
        {field: 'workAuthorization', header: 'IMMIGRATION STATUS'},
        {field: 'employeeType', header: 'EMPLOYEE TYPE'},
    ]);

    const [selectedColumns, setSelectedColumns] = useState(columns)

    useEffect(() => {
        // console.log('ComponentDidMount');
        getEmployees();
    }, []);


 
    
    const getEmployees = () => {
        firebase.employees().on("value", snapshot => {
        const employees =  snapshot.val();
        console.log(snapshot.val());



        const employeesList = Object.entries(employees).map(entry => {
            const employee = entry[1];
            const empId = entry[0];

            console.log(empId);

            const paymentRate = parseFloat(employee.rate === '' ? 0 : employee.rate);
            const chargeRate = !employee.projects ? 0 : employee.projects.map(project => { 
                return project.billingRate === '' ? 0 : project.billingRate}).reduce((acc, val) => { 
                return acc + val },0);
            const margin = chargeRate - paymentRate;
            // console.log(chargeRate);
            console.log(margin);
            console.log(paymentRate);
            console.log(chargeRate);

            return {
                ...employee,
                employee: employee.firstName + ' ' + employee.lastName,
                clients: !employee.projects ? '' : employee.projects.map(project =>  { return project.projectItenerary[0].organizationName + ', ' }),
                // paymentRate: `$${paymentRate.toFixed(2)}`,
                // chargeRate: `$${chargeRate.toFixed(2)}`,
                // margin: `$${margin.toFixed(2)}`,
                immigrationStatus: employee.workAuthorization,
                id: empId
            }
        })


        setEmployees(employeesList);
        setIsLoading(false);
        });
    }

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        setSelectedColumns(orderedSelectedColumns);
        // this.setState({ selectedColumns: orderedSelectedColumns });
    }

    const header = (
        <div className="table-header" style={{display: 'flex',justifyContent: 'space-between', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{ textAlign:'left' }}>
                <MultiSelect placeholder="Select Employee Fields to Display" value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{width:'20em'}}/>
            </div>
            <div>
            <TextField type="search" marginEnd="size-250" onChange={(value) => setGlobalFilter(value)} placeholder="Search..." />
            <Button variant="cta" UNSAFE_className="bugsy-action-button" onPress={() => 
                history.push(`/admin/employees/addemployee`)}>Add Employee</Button>
            </div>
        </div>
    );

    if (isLoading) {
        return <>
            <Flex alignItems="center" justifyContent="center" height="100%">
                <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
            </Flex>
        </>
    }


    console.log(employees)
    return (<>
            
            <div className="row" style={{marginTop: '30px'}}>
                <div className="data-table">
                    <DataTable 
                    selectionMode="single" 
                    value={employees} 
                    header={header}
                    paginator
                    // onRowClick={(rowData) => history.push(`${match.url}/${rowData.data.id}`)}
                    onRowClick={(rowData) => { history.push({pathname: `${match.url}/${rowData.data.id}`, state: rowData.data})}}

                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                    globalFilter={globalFilter}>
                        {/* <Column field="employee"  header="EMPLOYEE NAME"></Column>
                        <Column field="clients" header="CLIENTS"></Column>
                        <Column field="margin" header="MARGIN"></Column>
                        <Column field="chargeRate" header="CHARGE RATE"></Column>
                        <Column field="paymentRate" header="PAYMENT RATE"></Column>
                        <Column field="workAuthorization" header="IMMIGRATION STATUS"></Column>
                        <Column field="employeeType" header="EMPLOYEE TYPE"></Column> */}
                        {selectedColumns.map(col=> {
                            return <Column key={col.field} field={col.field} header={col.header} />;
                        })}
                    </DataTable>


                </div>
            </div>
    </>)
}

export default Employees
