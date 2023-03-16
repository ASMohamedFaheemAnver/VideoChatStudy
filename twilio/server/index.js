const express = require("express");
const { generateToken } = require("./token");
const cors = require("cors");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.post("/video/token", (req, res) => {
  console.log(req.body);
  const identity = req.body.identity;
  const roomName = req.body.room;
  const token = generateToken(identity, roomName);
  res.send({ token: token });
});

app.listen(port, () => {
  console.log(`Server running in : ${port}`);
});
