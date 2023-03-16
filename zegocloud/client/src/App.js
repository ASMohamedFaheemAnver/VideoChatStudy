import { useEffect, useRef } from "react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { v4 as uuid } from "uuid";
import config from "./config";

function App() {
  const appID = config.appID;
  const server = config.server;
  const zgRef = useRef();
  const startStreamVideoRef = useRef();
  const watchStreamVideoRef = useRef();
  const streamIDRef = useRef();
  const startStream = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/token/${config.userId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      const token = data.token;
      await zgRef.current.loginRoom(
        config.userId,
        token,
        { userID: config.userId, userName: config.userName },
        { userUpdate: true }
      );
      const localStartStream = await zgRef.current.createStream();
      startStreamVideoRef.current.srcObject = localStartStream;
      await zgRef.current.startPublishingStream(
        streamIDRef.current,
        localStartStream
      );
    } catch (e) {
      console.log({ e });
    }
  };
  const watchStream = async () => {
    try {
      const localWatchStream = await zgRef.current.startPlayingStream(
        streamIDRef.current
      );
      watchStreamVideoRef.current.srcObject = localWatchStream;
    } catch (e) {
      console.log({ e });
    }
  };
  useEffect(() => {
    const zg = new ZegoExpressEngine(appID, server);
    zgRef.current = zg;
    streamIDRef.current = uuid();
  }, [server, appID]);
  useEffect(() => {
    if (zgRef.current) {
      zgRef.current.on(
        "roomStateUpdate",
        (roomID, state, errorCode, extendedData) => {
          if (state === "DISCONNECTED") {
          }
          if (state === "CONNECTING") {
          }
          if (state === "CONNECTED") {
          }
        }
      );

      zgRef.current.on("roomUserUpdate", (roomID, updateType, userList) => {
        console.warn(
          `roomUserUpdate: room ${roomID}, user ${
            updateType === "ADD" ? "added" : "left"
          } `,
          JSON.stringify(userList)
        );
      });
      zgRef.current.on(
        "roomStreamUpdate",
        async (roomID, updateType, streamList, extendedData) => {
          if (updateType === "ADD") {
          } else if (updateType === "DELETE") {
          }
        }
      );

      zgRef.current.on("publisherStateUpdate", (result) => {});

      zgRef.current.on("publishQualityUpdate", (streamID, stats) => {});

      zgRef.current.on("playerStateUpdate", (result) => {});
      zgRef.current.on("playQualityUpdate", (streamID, stats) => {});
    }
  }, [zgRef]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        style={{ width: "50%", height: "50%" }}
        ref={startStreamVideoRef}
        autoPlay
        controls
        playsInline
        muted={true}
      ></video>
      <button
        onClick={() => {
          startStream()
            .then()
            .catch((e) => console.log({ e }));
        }}
      >
        Start Stream
      </button>
      <video
        style={{ width: "50%", height: "50%" }}
        ref={watchStreamVideoRef}
        autoPlay
        controls
        playsInline
        // muted={true}
      ></video>
      <button
        onClick={() => {
          watchStream()
            .then()
            .catch((e) => console.log({ e }));
        }}
      >
        Watch Stream
      </button>
    </div>
  );
}

export default App;
