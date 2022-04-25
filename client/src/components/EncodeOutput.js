import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function DecodeOutput(props) {
  const {outputFile, coverFilePath} = props;
  console.log("OUTPUT FILE EXIST"+outputFile);
  return (
    <Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item>
            <Typography gutterBottom variant="h5" component="div">
              Cover
            </Typography>
            <Card sx={{ maxWidth: 400 }}>
              {coverFilePath ? 
              <a href={coverFilePath} download> Click to download
              <CardMedia component="img" image={coverFilePath} alt="result" />
              </a>
              :null}
            </Card>
          </Grid>
          <Grid item>
          <Typography gutterBottom variant="h5" component="div">
              Stego
            </Typography>
            <Card sx={{ maxWidth: 400 }}>
           {outputFile ?
 <a href={outputFile} download> Click to download
           <CardMedia component="img" image={outputFile} alt="result" />
              </a>
           : null}   
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
