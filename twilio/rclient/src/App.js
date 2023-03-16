import { useState } from "react";
import Twilio from "twilio-video";

function App() {
  const [roomName, setRoomName] = useState("");
  const [localVideoTrack, setLocalVideoTrack] = useState();

  const connectToRoom = async () => {
    const response = await fetch("http://192.168.1.100:5000/video/token", {
      method: "POST",
      body: JSON.stringify({
        identity: "YOUR_IDENTITY",
        room: roomName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const token = data.token;
    const room = await Twilio.connect(token, {
      name: roomName,
      audio: true,
      video: { width: 640, height: 640 },
    });
    room.on("participantConnected", (participant) => {
      console.log(`Participant ${participant.identity} connected.`);
    });
    const localTrack = await Twilio.createLocalVideoTrack();
    setLocalVideoTrack(localTrack);

    const localParticipant = room.localParticipant;
    localParticipant.publishTrack(localTrack);
  };

  return (
    <div>
      {localVideoTrack && (
        <video ref={(ref) => ref && localVideoTrack.attach(ref)} />
      )}
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={connectToRoom}>Join room</button>
    </div>
  );
}

export default App;
