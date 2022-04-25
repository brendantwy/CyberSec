import React, { useState } from "react";
import { Button, Container,Alert } from "@mui/material";
import axios from "axios";

export default function DecodeResult(props) {
  const { encodedFile, handleNext, changeDecodedFile } = props;
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const decode = async (e) => {
    const formData = new FormData();
    formData.append("file", encodedFile);

    try {
      const res = await axios.post("/decode", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { filePath,consoleMessage } = res.data;

      if(consoleMessage.trim().split(' ')[0] === "Payload"){
        setSuccessMessage(consoleMessage);
        setErrorMessage(false);
        console.log("Successful!!!!!")  
       
      }
      else{
        setSuccessMessage(false);
        setErrorMessage(consoleMessage);
        console.log('ERRORRRRRRR')
  
      }
      console.log(res.data);
      changeDecodedFile(filePath);
    } catch (err) {
      if (err.message.status === 500) {
        console.log("api errror");
      }
    }

    return false;
  };
  return (
    <Container>
      <Button variant="contained" onClick={decode}>
        Decode
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