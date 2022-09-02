import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch, useHistory} from 'react-router-dom';
import FirebaseContext from '../../firebase/Context';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './PartnerOrganization.css';
import { Flex, ProgressCircle, TextField, Button} from '@adobe/react-spectrum';
import { MultiSelect } from 'primereact/multiselect';

function PartnerOrganization() {

    const match = useRouteMatch();
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const [partners, setPartners] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading,setIsLoading] = useState(true);

    const [columns] = useState([
        {field: 'OrganizationName', header: 'ORGANIZATION'},
        {field: 'directVendor', header: 'DIRECT VENDOR'},
        {field: 'directClient', header: 'DIRECT CLIENT'},
        {field: 'contact', header: 'CONTACT'},
        {field: 'email', header: 'EMAIL'},
        {field: 'phone', header: 'NUMBER'}
    ]);

    const [selectedColumns, setSelectedColumns] = useState(columns)

    useEffect(() => {
        getPartners();
    }, []);
    
    const getPartners = () => {

        let partnerRef = `${firebase.tenantId}_Partners`;
        firebase.db.ref(partnerRef).on('value', (res) => {
            const partnersObjs = res.val();
            const partners = Object.keys(partnersObjs).map(partnerKey => {
                return {
                    id: partnerKey,
                    ...partnersObjs[partnerKey]
                }
            });
            setPartners(partners)
        });

        setIsLoading(false);
        
    }

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        setSelectedColumns(orderedSelectedColumns);

    }

    const header = (
        <div className="table-header" style={{display: 'flex',justifyContent: 'space-between', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{ textAlign:'left' }}>
                <MultiSelect placeholder="Select Employee Fields to Display" value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{width:'20em'}}/>
            </div>
            <div>
            <TextField type="search" marginEnd="size-250" onChange={(value) => setGlobalFilter(value)} placeholder="Search..." />
            <Button variant="cta" UNSAFE_className="bugsy-action-button" onPress={() => 
                history.push(`/admin/partners/addpartner`)}>Add Partner</Button>
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


    console.log(partners)
    return (<>
            
            <div className="row" style={{marginTop: '30px'}}>
                <div className="data-table">
                    <DataTable 
                    selectionMode="single" 
                    value={partners} 
                    header={header}
                    paginator
                    onRowClick={(rowData) => { history.push({pathname: `${match.url}/${rowData.data.id}`, state: rowData.data})}}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                    globalFilter={globalFilter}>
                        {selectedColumns.map(col=> {
                            return <Column key={col.field} field={col.field} header={col.header} />;
                        })}
                    </DataTable>

                </div>
            </div>
    </>)
}

export default PartnerOrganization
