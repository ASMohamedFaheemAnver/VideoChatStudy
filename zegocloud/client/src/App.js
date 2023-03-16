import { useEffect, useRef } from "react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import config from "./config";

function App() {
  const appID = config.appID;
  const server = config.server;
  const zgRef = useRef();
  const startStreamVideoRef = useRef();
  const watchStreamVideoRef = useRef();

  const login = async (userOne = true) => {
    try {
      const userId = userOne ? config.userId : config.userId2;
      const token = userOne ? config?.token : config?.token2;
      const userName = userOne ? config.userName : config?.userName2;
      const response = await fetch(
        `http://${config.localhost}:5000/token/${userId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      const serverToken = data.token;
      console.log({ serverToken });
      await zgRef.current.loginRoom(
        userId,
        token,
        { userID: userId, userName: userName },
        { userUpdate: true }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const getSessionId = async () => {
    const res = await fetch(`http://${config.localhost}:5000/stream/session`);
    const json = await res?.json();
    const sessionId = json?.sessionId;
    return sessionId;
  };

  const startStream = async () => {
    try {
      await login();
      const sessionId = await getSessionId();
      const localStartStream = await zgRef.current.createStream();
      startStreamVideoRef.current.srcObject = localStartStream;
      await zgRef.current.startPublishingStream(sessionId, localStartStream);
    } catch (e) {
      console.log({ e });
    }
  };
  const watchStream = async () => {
    try {
      await login(false);
      const sessionId = await getSessionId();
      const localWatchStream = await zgRef.current.startPlayingStream(
        sessionId
      );
      watchStreamVideoRef.current.srcObject = localWatchStream;
    } catch (e) {
      console.log({ e });
    }
  };
  useEffect(() => {
    const zg = new ZegoExpressEngine(appID, server);
    zgRef.current = zg;
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
        // controls
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
        // controls
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
