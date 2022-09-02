import React, { useContext, useEffect, useState } from "react";
// import SideBar from "./sidenavBar";
import "./inbox.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import "@material/react-icon-button/dist/icon-button.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
// import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
// import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import { gapi } from 'gapi-script';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100ch",
    },
  },
}));

const Compose = (props) => {
  const [addCC, setCC] = useState([]);
  const [addBCC, setBCC] = useState([]);

  const [isCCAdded, setCCAdded] = useState(false);
  const [isBCCAdded, setBCCAdded] = useState(false);
  const [selectedFile, setselectedFile] = useState('');
  const [toEmailId , setToEmail] = useState('');
  const [subject, setsubject] = useState('');
  const [body, setbody] = useState('');
  

  const sendEmailApi = () => {
    
  const formData = new FormData();
  for (let img in selectedFile[0]) {
    // formData.append('imgCollection', imgCollection[0][img])
    formData.append("upload", selectedFile[0][img]);
}
 
  if (addCC.length !== 0){
    formData.append("cc", addCC[0].cc);
  }
  if (addBCC.length !== 0){
    formData.append('bcc',addBCC[0].bcc)
  }
  
  
  formData.append("toEmail", toEmailId);
  formData.append("subject", subject);
  formData.append("msg", body);
  formData.append('fromEmail','mehak@abcgenesi.com')
    const pdfData = {
      method: 'POST',
      body: formData
    }
    fetch('http://localhost:5000/api/upload', pdfData)
      .then((res) => {
        if (res.ok) {
          console.log("res", res);
          alert("email sent successfully");
          clearText();
        } else if (res.status == 401) {
          alert("Oops! ");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const clearText = () =>{
    setselectedFile('');
    setBCCAdded(false);
    setCCAdded(false);
    setBCC([]);
    setCC([]);
    setbody('')
    setsubject('')
    setToEmail('')
  }
  const handleSubmit = async e => {
    e.preventDefault();

    console.log("fileeeeeeeeeeeeeee", selectedFile);
    sendEmailApi();
  };

  const handleCCInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...addCC];
    // console.log(list);
    list[index][name] = value;
    setCC(list);
  };
  const handleAddCC = () => {
    setCC([...addCC,  { cc: "" }]);
    setCCAdded(true);
  };

  const handleBCCInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...addBCC];
    // console.log(list);
    list[index][name] = value;
    setBCC(list);
  };

  const handleAddBCC = () => {
    setBCC([...addBCC,  { bcc: "" }]);
    setBCCAdded(true);
  };

  
  const onFileChange = (files) => {
    let items = files.map(fileItem => fileItem.file)
    setselectedFile([...selectedFile, items])
}

  const classes = useStyles();

  return (
    <div>
     
      <span className="inboxStyle">
        {/*<TextField required id="filled-required" label="to email Id"     //   defaultValue="Hello World" variant="filled"
        />*/}
        <form onSubmit={handleSubmit}
          className={classes.root}
          style={{  paddingLeft: 255, }}  noValidate
        >
          <TextField id="standard-name" label="To" value={toEmailId} onChange = {e => setToEmail(e.target.value)} />
          {isCCAdded ? null : <IconButton onClick={handleAddCC}>CC</IconButton>}
          {isBCCAdded ? null : (
            <IconButton onClick={handleAddBCC}>BCC</IconButton>
          )}

          {addCC.map((x, i) => {
            return (
              <TextField
                id="standard-name"
                label="CC"
                value={x.cc}
                name="cc"
                onChange={(e) => handleCCInput(e, i)}
              />
            );
          })}

          {addBCC.map((x, i) => {
            return (
              <TextField
                id="standard-name"
                label="BCC"
                value={x.cc}
                name="bcc"
                onChange={(e) => handleBCCInput(e, i)}
              />
            );
          })}
          <TextField id="standard-name" label="Subject" value={subject}  onChange = {e=> setsubject(e.target.value)}/>
          <br />
          <br />
          <TextareaAutosize
          value = {body}
            aria-label="minimum height"
            rowsMin={15}
            placeholder="type message here..."
            style={{ width: "100ch" }}
            onChange = {(e) => setbody(e.target.value)}
          />

          
        <br /><br />
        {/* <input type="file" onChange={e => { setselectedFile(e.target.files[0])}} /> */}
        <FilePond 
  files={selectedFile}
  allowMultiple={true}
  server={null}
  instantUpload={false}
  onupdatefiles={(fileItems) => onFileChange(fileItems)}>
</FilePond>
        <br /><br />
        <input type="submit" value="Submit" />
        </form>
      </span>
    </div>
  );
};

export default Compose;
