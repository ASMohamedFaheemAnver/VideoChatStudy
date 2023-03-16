const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const zego = require("./offline_modules/zegoServerAssistant");
const fs = require("fs");

app.use(cors());
app.use(bodyParser.json());

app.get("/token/:userId", async (req, res, next) => {
  const appId = process.env.appId;
  const userId = req.params.userId;
  const secret = process.env.secret;
  // 2 Min live
  const effectiveTimeInSeconds = 2 * 60;
  // Privilege
  const payloadObject = {
    // I don't know the use case for now
    room_id: userId,
    // 1 true, 0 false
    privilege: {
      1: 1, // loginRoom
      2: 0, // publishStream
    },
    stream_id_list: null,
  };
  try {
    const token = zego.generateToken04(
      +appId,
      userId,
      secret,
      effectiveTimeInSeconds,
      payloadObject
    );
    res.json({ token });
  } catch (e) {
    console.log({ e });
    res.json({ e: e?.errorMessage });
  }
});

app.get("/stream/session", async (req, res, next) => {
  try {
    const db = JSON.parse(fs.readFileSync("stream.json", "utf-8"));
    console.log({ db });
    res.json({ sessionId: db?.sessionId });
  } catch (e) {
    res.json({ msg: "no live" });
  }
});

app.listen(port, () => {
  console.log(`Server running in : ${port}`);
});
