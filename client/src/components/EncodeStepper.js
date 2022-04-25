import React, { useState, Fragment } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Container from "@mui/material/Container";
import LSB from "./LSB";
import CoverFileUpload from "./CoverFileUpload";
import PayloadFileUpload from "./PayloadFileUpload";
import Result from "./Result";
import EncodeOutput from "./EncodeOutput";

const steps = [
  "Select number of LSBs to cover",
  "Upload cover object",
  "Insert payload",
  "Encode",
  "Result",
];

export function EncodeStepper(props) {
  const [activeStep, setActiveStep] = useState(0);

  const [value, setValue] = useState(1);
  const [coverFile, setCoverFile] = useState("");
  const [payloadFile, setPayloadFile] = useState("");
  const [outputFile, setOutputFile] = useState("");
  const [coverFilePath, setCoverFilePath] = useState("");

  const changeValue = (value) => {
    setValue(value);
  };

  const changeCoverFile = (coverFile) => {
    setCoverFile(coverFile);
  };

  const changePayloadFile = (payloadFile) => {
    setPayloadFile(payloadFile);
  };
  const changeOutputFile = (outputFile) => {
    setOutputFile(outputFile);
  };
  const changeCoverFilePath = (coverFilePath) => {
    setCoverFilePath(coverFilePath);
  };

  const handleNext = () => {
    console.log(value);
    console.log(coverFile);
    console.log(payloadFile);
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    const isLastStep = activeStep === steps.length - 1;
    switch (step) {
      case 0:
        return (
          <LSB
            changeValue={changeValue}
            isLastStep={isLastStep}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <CoverFileUpload
            changeCoverFile={changeCoverFile}
            changeCoverFilePath={changeCoverFilePath}
            isLastStep={isLastStep}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <PayloadFileUpload
            changePayloadFile={changePayloadFile}
            isLastStep={isLastStep}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );

      case 3:
        return (
          <Result
            changeOutputFile={changeOutputFile}
            coverFile={coverFile}
            payloadFile={payloadFile}
            value={value}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );

      case 4:
        return <EncodeOutput
        coverFilePath={coverFilePath}
        outputFile={outputFile}
        coverFile={coverFile} />;
    }
  }

  return (
    <Container>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Fragment>
        {activeStep === steps.length ? (
          <p>You're done!</p>
        ) : (
          <Fragment> {getStepContent(activeStep)} </Fragment>
        )}
      
      </Fragment>
    </Container>
  );
}

export default EncodeStepper;
