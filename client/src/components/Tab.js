import * as React from "react";
import {Card,Tabs,Tab} from '@mui/material';
import EncodeStepper from "./EncodeStepper";
import DecodeStepper from "./DecodeStepper";

export default function CenteredTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{ bgcolor: "background.paper", m: 25, width: "80%" }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Encode">
            <EncodeStepper />
          </Tab>
          <Tab label="Decode">
            <DecodeStepper />
          </Tab>
        </Tabs>
        {value === 0 && <EncodeStepper />}
        {value === 1 && <DecodeStepper />}
      </Card>
    </>
  );
}
