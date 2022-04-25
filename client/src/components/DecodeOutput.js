import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function DecodeOutput(props) {
  const { decodedFile, encodedFilePath } = props;
  return (
    <Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item>
            <Typography gutterBottom variant="h5" component="div">
              Your Input
            </Typography>
            <Card sx={{ maxWidth: 400 }}>
              {encodedFilePath ? (
                <a href={encodedFilePath} download>
                  {" "}
                  Click to download
                  <CardMedia
                    component="img"
                    image={encodedFilePath}
                    alt="encoded"
                  />
                </a>
              ) : null}
            </Card>
          </Grid>
          <Grid item>
            <Typography gutterBottom variant="h5" component="div">
              Your Message
            </Typography>
            <Card sx={{ maxWidth: 400 }}>
              {decodedFile ? (
                <a href={decodedFile} download>
                  {" "}
                  Click to download
                  <CardMedia
                    component="img"
                    image={decodedFile}
                    alt="message"
                  />
                </a>
              ) : null}
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}