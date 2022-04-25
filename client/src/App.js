import React, { useCallback } from "react";
import "./App.css";
import { Container, Box, Button, Typography, CardContent, FormControlLabel, CardActions, Card, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material';
import LSBSlider from './components/LSB';
import { useDropzone } from 'react-dropzone'
import axios from "axios";

const App = (props) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const cover = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  const onSubmit = async (e) => {
    console.log(acceptedFiles);
    const formData = new FormData();
    formData.append("file", JSON.stringify(acceptedFiles));
    // formData.append("file", acceptedFiles);
    try {
      const res = await axios.post("/encode", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      if (err.message.status === 500) {
        console.log("api errror");
      }
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Card >
        <React.Fragment>
          <CardContent sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <section className="container">
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag and drop cover image here</p>
              </div>
              <aside>
                <p>Files</p>
                <ul>{cover}</ul>
              </aside>
            </section>


          </CardContent>
          <CardContent >
            <FormControl component="fieldset" sx={{ display: 'inline-block', verticalAlign: 'top' }}>
              <FormLabel component="legend">Select</FormLabel>
              <RadioGroup
                aria-label="Select"
                name="controlled-radio-buttons-group"
              >
                <FormControlLabel value="Encode" control={<Radio />} label="Encode" />
                <FormControlLabel value="Decode" control={<Radio />} label="Decode" />
              </RadioGroup>
            </FormControl>
          </CardContent>
          <CardContent >
            <LSBSlider />
          </CardContent>
          <CardActions maxWidth="sm">
            <Button
              variant="contained"
              color="primary"
              disabled={false}
              sx={{ mr: 1 }}
              onClick={onSubmit}
            >
              Encode
            </Button>
          </CardActions>
        </React.Fragment>
      </Card>
    </Container>
  )
};

export default App;
