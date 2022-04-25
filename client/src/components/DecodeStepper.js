import React, { useState, Fragment } from "react";
import { Stepper, Step, StepLabel, Container } from "@mui/material";
import DecodeFileUpload from "./DecodeFileUpload";
import DecodeResult from "./DecodeResult";
import DecodeOutput from "./DecodeOutput";

const steps = ["Insert encoded file", "Decode", "Result"];

export function DecodeStepper(props) {
  const [activeStep, setActiveStep] = useState(0);

  const [encodedFile, setEncodedFile] = useState("");
  const [decodedFile, setDecodedFile] = useState("");
  const [encodedFilePath, setEncodedFilePath] = useState("");

  const changeEncodedFile = (encodedFile) => {
    setEncodedFile(encodedFile);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const changeDecodedFile = (decodedFile) => {
    setDecodedFile(decodedFile);
  };

  const changeEncodedFilePath = (encodedFilePath) => {
    setEncodedFilePath(encodedFilePath);
  };

  function getStepContent(step) {
    const isLastStep = activeStep === steps.length - 1;
    switch (step) {
      case 0:
        return (
          <DecodeFileUpload
            changeEncodedFile={changeEncodedFile}
            changeEncodedFilePath={changeEncodedFilePath}
            isLastStep={isLastStep}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );

      case 1:
        return (
          <DecodeResult
            encodedFile={encodedFile}
            changeDecodedFile={changeDecodedFile}
            handleNext={handleNext}
          />
        );

      case 2:
        return (
          <DecodeOutput
            encodedFilePath={encodedFilePath}
            decodedFile={decodedFile}
            changeDecodedFile={changeDecodedFile}
            handleBack={handleBack}
          />
        );
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

export default DecodeStepper;