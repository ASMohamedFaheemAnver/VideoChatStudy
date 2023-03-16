const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server running in : ${port}`);
});
