import React, { useEffect, useContext, useState } from 'react'
import { View, Flex, TextField, ActionButton, Button, Checkbox, Grid, Picker, Item, Text, TooltipTrigger, Tooltip } from "@adobe/react-spectrum"
import { CheckBox } from '@material-ui/icons'

import FirebaseContext from '../../../../../firebase/Context'

function SendToAttorney(props) {

   let firebase = useContext(FirebaseContext);
   let [applicants, setApplicants] = useState(props.questionnaires.applicants ?? []);
   let employeeId= props.employee.id
   let [documents, setDocuments]=useState([])
   let [attorneyOptions , setAttorneyOptions]=useState([])
   let [attorneySelected, setAttorneySelected]=useState({})
   

   useEffect(() => {
        // Reload applicants questionnaires
        const questionnairesRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/questionnaires`;
        firebase.db.ref(questionnairesRef).on('value', res => {
            console.log('questionnaires send to attorney', res.val())

            setApplicants(res.val().applicants)
        })
   }, [])

   useEffect(() => {
    console.log(props)
    // https://bugsy-crm.firebaseio.com/COVET_immigration/-covet0/21c-4e51-b95/documents
    const documentsRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/documents`;
    firebase.db.ref(documentsRef).on('value', res => {

        const documents = res.val();
        console.log(documents)
        setDocuments(documents)
    })
   }, [])

   useEffect(()=>{
    const attorneyRef =`${firebase.tenantId}_Attorney`
    firebase.db.ref(attorneyRef).once('value', response=>{
        let attorneyList=response.val().map((attorney, index)=>{
            return {id: index, ...attorney}
        })
        setAttorneyOptions(attorneyList)

    })

   }, [])

   let onSendToAttorney = ()=>{
       console.log("Sent to Attorney")
       console.log("Attorney Selected ", attorneyOptions[attorneySelected]);

       const caseRef = `${firebase.tenantId}_immigration/${props.employee.id}/${props.caseNumber}/caseStatus/5`;

       firebase.db.ref(caseRef).once('value', res => {
           const caseStatus = res.val();
           const newCaseStatus = {...caseStatus, stepStatus: 'completed', updatedAt: firebase.serverValue.TIMESTAMP};

           firebase.db.ref(caseRef).set(newCaseStatus).then(res => {
               
           }).catch(err => {
               console.log(err)
           })
       })

   }
   return(
       <Grid columns={["5fr", "1fr"]}>
        <Flex direction="row" wrap="wrap" UNSAFE_style={{marginLeft: "80px"}}>
        <View width="100%">
        <Text UNSAFE_style={{display: "block", fontSize: "1.25em"}}>Questionnaires</Text>
        <div style={{borderBottom: '2px solid #CCCCCC',  marginBottom: '20px' ,width:"70%"}} />
            {applicants.map((applicant,index)=>{
                    return(
                        <TooltipTrigger delay={0}>
                            <Checkbox UNSAFE_style={{width:"40%"}} key={index}>
                                {applicant.name} Questionnaire
                            </Checkbox>
                            <Tooltip>
                                Questionnaires
                            </Tooltip>
                        </TooltipTrigger>
                    )

            })}
        </View>
        <View marginTop="50px">
            <Text UNSAFE_style={{display: "block", fontSize:"1.25em"}}>Documents</Text>
            <div style={{borderBottom: '2px solid #CCCCCC',  marginBottom: '20px', width: "70%"}} />
            {documents.map((document, index)=>{
                return(
                    <TooltipTrigger delay={0}>
                        <Checkbox key={index} UNSAFE_style={{width:"30%"}}>{document.documentDesc??document.documentType}</Checkbox>
                        <Tooltip width="200px">
                            <Flex direction="column">
                                <Text UNSAFE_style={{width: "200px"}}>Document Type   :  {document.documentType}</Text>
                                <Text UNSAFE_style={{width: "200px"}}>Document Desc   :  {document.documentDesc}</Text>
                                <Text UNSAFE_style={{width: "200px"}}>Document Name   :  {document.documentName}</Text>
                                <Text UNSAFE_style={{width: "200px"}}>Document Expiry :{new Date(document.documentExpiry).toDateString()}</Text>
                            </Flex>
                        </Tooltip>
                    </TooltipTrigger>
                )
            })}
        </View>
    
       </Flex>


       <Flex direction="column">
           
       <ActionButton  UNSAFE_className="bugsy-action-button" UNSAFE_style={{color: 'white'}} onPress={() => onSendToAttorney()}>
                    <Text>Send To Attorney</Text>
        </ActionButton>

        
           
           <Picker 
                    UNSAFE_style={{marginTop:"20px"}} 
                    label="Select Attorney..." 
                    onSelectionChange={setAttorneySelected}
                    items={attorneyOptions}>
                
                    {(item)=><Item key={item.index}>{item.AttorneyName}</Item>}
            </Picker>
       </Flex>
       </Grid>
       
   )
   
}

export default SendToAttorney
