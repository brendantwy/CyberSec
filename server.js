const express = require("express");
const fileUpload = require("express-fileupload");
const { exec } = require("child_process"); //to execute python files


const app = express();

app.use(fileUpload());
app.use(express.static('public'));
app.use('/images', express.static('images'));
var bigFileType = "";

function setFileType(fileType) {
  bigFileType = fileType;
  return bigFileType;
}
var returnMessage = "";

function setReturnMessage(message) {
  returnMessage = message;
  return message;
}
function cleanDir() {
  console.log("Directory cleaned!");
  exec(
    `rm -r ./public/images/Objects/*`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}


// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  exec(`mkdir .\\public\\images\\Decoded`);
  exec(`mkdir .\\public\\images\\Encoded`);
  exec(`mkdir .\\public\\images\\Objects`);

  const file = req.files.file;

  file.mv(`${__dirname}/public/images/Objects/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `http://localhost:5000/images/Objects/${file.name}` });
  });
});

app.post("/encode", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const coverFile = req.files.file[0];
  const payloadFile = req.files.file[1];
  const value = req.body.value;
  // console.log(coverFile);
  // console.log(coverFile.name.split('.'));
  if (coverFile.name.split('.')[1] === 'png' || coverFile.name.split('.')[1] === 'bmp') {
    exec(
      `python IMAGE_STEGA.py encode ./public/images/Objects/${coverFile.name} ./public/images/Objects/${payloadFile.name} ${value}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        setReturnMessage(stdout);
        console.log(`stdout: ${stdout}`);
      }
    );
  }
  else if (coverFile.name.split('.')[1] === 'wav') {
    exec(
      `python AUDIO_STEGA.py encode ./public/images/Objects/${coverFile.name} ./public/images/Objects/${payloadFile.name} ${value}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        setReturnMessage(stdout);
        console.log(`stdout: ${stdout}`);
      }
    );
  }
  else if (coverFile.name.split('.')[1] === 'xlsx' || coverFile.name.split('.')[1] === 'docx' || coverFile.name.split('.')[1] === 'txt' || coverFile.name.split('.')[1] === 'pdf') {
    exec(
      `python DOCUMENT_STEGA.py encode ./public/images/Objects/${coverFile.name} ./public/images/Objects/${payloadFile.name} ${value}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        setReturnMessage(stdout);
        console.log(`stdout: ${stdout}`);
      }
    );
  }
  setTimeout(function(){
  res.json({ consoleMessage:returnMessage,fileName: `encoded.${coverFile.name.split('.')[1]}`, filePath: `http://localhost:5000/images/Encoded/encoded.${coverFile.name.split('.')[1]}` });
  // res.json({ fileName: 'encoded.png', filePath: `${__dirname}/public/images/Encoded/encoded.png` });


  },5000 );

});

app.post("/decode", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
 
  var fileType = "";

  const encodedFile = req.files.file;
  if (
    encodedFile.name.split(".")[1] === "png" ||
    encodedFile.name.split(".")[1] === "bmp"
  ) {
    exec(
      `python IMAGE_STEGA.py decode ./public/images/Objects/${encodedFile.name}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log("FUCKING STDOUT" + stdout)
        
        fileType = stdout.split(" ")[1];
        setFileType(fileType);
        setReturnMessage(stdout);
      }
    );
  } else if (encodedFile.name.split(".")[1] === "wav") {
    exec(
      `python AUDIO_STEGA.py decode ./public/images/Objects/${encodedFile.name}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        fileType = stdout.split(" ")[1];
        setFileType(fileType);
        setReturnMessage(stdout);
      }
    );
  } else if (
    encodedFile.name.split(".")[1] === "xlsx" ||
    encodedFile.name.split(".")[1] === "docx" ||
    encodedFile.name.split(".")[1] === "pdf" ||
    encodedFile.name.split(".")[1] === "txt"
  ) {
    exec(
      `python DOCUMENT_STEGA.py decode ./public/images/Objects/${encodedFile.name}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        fileType = stdout.split(" ")[1];
        setFileType(fileType);
        setReturnMessage(stdout);
      }
    );
  }

  setTimeout(function () {
    res.json({
      consoleMessage:returnMessage,
      fileName: `decoded.${bigFileType}`,
      filePath: `http://localhost:5000/images/Decoded/decoded.${bigFileType}`,
    });
  }, 10000);
});
app.get("/");

app.listen(5000, () => console.log("Server Started..."));
