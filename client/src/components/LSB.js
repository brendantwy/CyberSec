import React from "react";
import Container from "@mui/material/Container";
import Slider from "@mui/material/Slider";
import axios from "axios";
import Button from "@mui/material/Button";

export default function LSBSlider(props) {
  const marks = [
    {
      value: 1,
      label: "1 LSB",
    },
    {
      value: 2,
      label: "2 LSB",
    },
    {
      value: 3,
      label: "3 LSB",
    },
    {
      value: 4,
      label: "4 LSB",
    },
    {
      value: 5,
      label: "5 LSB",
    },
    {
      value: 6,
      label: "6 LSB",
    },
    {
      value: 7,
      label: "7 LSB",
    },
    {
      value: 8,
      label: "8 LSB",
    },
  ];

  const { handleNext, changeValue } = props;
  const [value, setValue] = React.useState(1);

  const handleChange = async (e, value) => {
    setValue(value);
    changeValue(value);
  };

  return (
    <Container sx={{ mt: 10, mb: 10 }}>
      <Slider
        aria-label="LSBs"
        defaultValue={1}
        valueLabelDisplay="auto"
        step={1}
        marks={marks}
        min={1}
        max={8}
        value={value}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" onClick={handleNext}>
        Next
      </Button>
    </Container>
  );
}
