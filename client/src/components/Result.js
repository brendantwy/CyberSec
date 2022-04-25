import React, {  useState } from "react";
import {Button,Container,Alert} from "@mui/material";
import axios from "axios";

export default function Result(props) {
  const { value, coverFile, payloadFile, handleNext,changeOutputFile,handleBack } = props;
  console.log(coverFile);
  console.log(payloadFile);
  console.log(value);
  const [outputFile, setOutputFile] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const encode = async (e) => {
    
    const formData = new FormData();
    formData.append("file", coverFile);
    formData.append("file", payloadFile);
    formData.append("value", value);
    

    try {
      const res = await axios.post("/encode", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { consoleMessage, fileName, filePath } = res.data;
      // console.log('RESPONSE DATA! '+ JSON.stringify(res.data));
      if(consoleMessage.trim()==="Success"){
        setSuccessMessage(consoleMessage);
        setErrorMessage(false);
        console.log("Successful!!!!!")
      }
      else{
        console.log('ERRORRRRRRR')
        setSuccessMessage(false);
        setErrorMessage(consoleMessage);
      }
      setOutputFile({ fileName, filePath });
      changeOutputFile(filePath);
     
      
    } catch (err) {
      if (err.message.status === 500) {
        console.log("api errror");
      }
    }
    return false;
  };
 
  return (
    <Container>
      <Button variant="contained" color="primary" onClick={handleBack}>
        Back
      </Button>

    <Button variant="contained" onClick={(encode)}>
      Encode
    </Button>
  
  
    {errorMessage? 
    <Alert variant="outlined" severity="error">{errorMessage}</Alert>
: null}
{successMessage? 
   <Button variant="contained" onClick={(handleNext)}  sx={{ml:80}}>
   Next
   </Button>
: null}
 
    
    </Container>
    
  );
}
