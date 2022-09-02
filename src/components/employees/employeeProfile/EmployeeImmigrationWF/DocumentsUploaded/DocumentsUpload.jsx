import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Flex, ActionButton, Text, DialogTrigger, Dialog, Heading, Divider, ButtonGroup, Button, Content, Form, TextField, Picker, Item, View } from '@adobe/react-spectrum';
import { FileUpload } from 'primereact/fileupload';
import FirebaseContext from '../../../../../firebase/Context';
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';

const DocumentsUpload = (props) => {
    console.log('JR', props)
    const [documents, setDocuments] = useState([
        // {type: 'I-94', documentName: 'Kelly.jpg', uploadDate: new Date().toLocaleDateString(), uploadedBy: 'Kelly M Johnson'},
        // {type: 'I-94', documentName: 'Kelly.jpg', uploadDate: new Date().toLocaleDateString(), uploadedBy: 'Kelly M Johnson'}
    ])
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState('File');
    const uploadedByEmployeeId = useSelector((store) => {return store.auth.employeeId});
    const uploaderdByEmployeeName = useSelector((store) => {return `${store.employee.profile.firstName} ${store.employee.profile.lastName}`})
    const firebase = useContext(FirebaseContext);
    const myToast                                               = useRef(null);

    // const storage = firebase.storage();

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    useEffect(() => {
        // https://bugsy-crm.firebaseio.com/COVET_immigration/-covet0/21c-4e51-b95/documents
        const documentsRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/documents`;
        firebase.db.ref(documentsRef).on('value', res => {

            const documents = res.val();

            setDocuments(documents ?? [])
        })
    }, [])

    const onDocumentVerify = (row, index) => {
        console.log('VERIFY DOCUMENT', row);
        //https://bugsy-crm.firebaseio.com/COVET_immigration/-covet0/21c-4e51-b95/documents/0/status
        const verifyRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/documents/${index}/status`;
        firebase.db.ref(verifyRef).set('VERIFIED').then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    const onVerifyAll = () => {
        console.log('VERIFY ALL');
        const documentsRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/documents`;
        firebase.db.ref(documentsRef).on('value', res => {
            const documents = res.val();
            // console.log(documents)
            if (documents) {
                documents.forEach(document => {
                    document.status = 'VERIFIED'
                });

                firebase.db.ref(documentsRef).set(documents).then(res => {
                    showToast('success', 
                    'Sucesffully Verified', 
                    'Sucessfully Verified Documents');
                    const caseRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/caseStatus/3`;
                    firebase.db.ref(caseRef).once('value', res => {
                        const caseStatus = res.val();
                        const newCaseStatus = {...caseStatus, stepStatus: 'completed', updatedAt: firebase.serverValue.TIMESTAMP};
                        firebase.db.ref(caseRef).set(newCaseStatus).then(res => {
    
                        }).catch(err => {
                           console.log(err)
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })


            }

            console.log(documents)
        })
    }

    const onDocumentDelete = (row, index) => {

    }

    const onDownloadAsPDF = (row, index) => {
        console.log(row)
        const fileRef = `${firebase.tenantId}/${props.employee.id}/documents/${props.caseNumber}/${row.documentSuffixed}`;
     
        firebase.storage.ref(fileRef).getDownloadURL().then((url) => {
            console.log(url);
            
            fetch(url, { 
                method: 'GET'
            }).then(response => {
                console.log(response);
                return response.blob()
            })
            .then(blob => {
                console.log(blob)
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = row.documentSuffixed;
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();    
                a.remove();  //afterwards we remove the element again         
            }).catch(err => {
                console.log(err)
            })
            
            // const element = document.createElement('a');
            // const file = new Blob(
            //     [ url ],
            //     {type: '*/*'}
            // );

            // element.href = URL.createObjectURL(file);
            // element.download = row.documentName
            // element.click()


        })

    }

    const actionBodyTemplate = (row, index) => {
        console.log(row, index.rowIndex)
        return (
            <Flex direction="row" justifyContent="end">
                {row.status !== 'VERIFIED' ? <ActionButton marginStart="10px" type="button" icon="pi pi-cog" className="p-button-secondary" onPress={() => onDocumentVerify(row, index.rowIndex)}>Verify</ActionButton> : <div style={{alignSelf: 'center', width: '59px'}}>Verified</div>}
                <ActionButton marginStart="10px" type="button" icon="pi pi-cog" className="p-button-secondary" onPress={() => onDocumentDelete(row, index.rowIndex)}>Delete</ActionButton>
                <ActionButton marginStart="10px" type="button" icon="pi pi-cog" className="p-button-secondary" onPress={() => onDownloadAsPDF(row, index.rowIndex)}>Download</ActionButton>
            </Flex>
        );
    }

    const onFileSelect = (file) => {
        console.log(file)
        setFile(file[0]);
        setFileName(file[0].name);
    }

    const onAddFile = (close) => {

        const count = documents.filter(doc => doc.documentName === fileName).length;
        const [name, extension] = fileName.split('.');
        const tempFilename = count === 0 ? fileName : `${name}_${count}.${extension}`;
        console.log(count);
        const newDocument = {
            documentExpiry: new Date().toISOString(),
            documentSuffixed: tempFilename,
            documentName: fileName,
            documentType: documentType,
            status: '',
            sent: [{
                sendDate: '',
                to: ''
            }],
            uploadDate: firebase.serverValue.TIMESTAMP,
            uploadedById: uploadedByEmployeeId,
            uploadedByName: uploaderdByEmployeeName
        };

        console.log(newDocument)

        const fileRef = `${firebase.tenantId}/${props.employee.id}/documents/${props.caseNumber}/${tempFilename}`;
        const documentRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/documents`;

        firebase.storage.ref(fileRef).put(file).then(snapshot => {
            
            firebase.db.ref(documentRef).once('value', res => {
                console.log(res.val())
                let newDocuments = [newDocument];

                if (res.val()) {
                    newDocuments = [...res.val(), newDocument];
                }
               
                firebase.db.ref(documentRef).set(newDocuments).then(resp => {
                    console.log(resp);
                    close()
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err);
        });
    }


    return (<>

            <Toast ref={myToast} />

            <Flex justifyContent="end" marginBottom="size-175">
                {/* <ActionButton onPress={() => onNewUpload()}>
                    <Text>New Upload</Text>
                </ActionButton> */}
                <DialogTrigger>
                <ActionButton>Upload</ActionButton>
                {(close) => (
                    <Dialog>
                    <Heading>Add New Document</Heading>
                    <Divider/>
                    <ButtonGroup>
                        <Button variant="secondary" onPress={close}>
                        Cancel
                        </Button>
                        <Button autoFocus variant="cta" onPress={() => onAddFile(close)}>
                        Add
                        </Button>
                    </ButtonGroup>
                    <Content height="500px">
                        <Form>
                        {/* <TextField label="File Name" isRequired onChange={setFileName}/> */}

                            <Picker label="Dependent Type" isRequired defaultSelectedKey={documentType} onSelectionChange={setDocumentType}>
                                <Item key="I-94">I-94</Item>
                                <Item key="File">File</Item>
                                <Item key="Other">Other</Item>
                            </Picker>
                            
                        </Form>
                        <View marginTop="size-175">
                        <Text>Select File from your computer</Text>
                        <br/>
                        <input className="p-button" style={{width: '100%'}} type="file" id="myfile" accept="*" name="myfile" onChange={(event) => onFileSelect(event.target.files)}/>
                        {/* <FileUpload name="demo[]" url="./upload.php" onUpload={console.log()} multiple accept="*" maxFileSize={1000000}
                        emptyTemplate={<p className="p-m-0">Drag and drop files to here to upload.</p>} /> */}

                        </View>
                    </Content>
                    </Dialog>
                )}
            </DialogTrigger>

                <ActionButton marginStart="13px" marginEnd="13px" UNSAFE_className="bugsy-action-button" UNSAFE_style={{color: 'white'}} onPress={() => onVerifyAll()}>
                    <Text>Verify All</Text>
                </ActionButton>
           </Flex>
  
        <div className="card">
            <DataTable value={documents}>
               
                <Column field="documentType" header="TYPE"></Column>
                <Column field="documentName" header="DOCUMENT NAME"></Column>
                <Column field="uploadedByName" header="UPLOADED BY"></Column>
                <Column body={(row, i) => actionBodyTemplate(row, i)} headerStyle={{width: '350px', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
            </DataTable>
        </div>

    </>)
}

export default DocumentsUpload
