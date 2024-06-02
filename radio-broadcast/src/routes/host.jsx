import { useEffect, useRef, useState } from "react";
import MicrophoneButton from "../components/MicrophoneButton";
import MusicControls from "../components/MusicControls";
import { io } from "socket.io-client";
import { Radio } from "react-feather";
import { Already } from "./already";

const URL = "http://localhost:3000";

function Host() {
  const socketRef = useRef(null);
  const [vv, setVV] = useState(0);
  const [data, setData] = useState(true);
  const [loading, setLoading] = useState(true);


  window.addEventListener("beforeunload", () => {
    if (socketRef.current.id == localStorage.getItem("id")) {
      localStorage.removeItem("isHost");
      localStorage.removeItem("id");
    }
  });

  useEffect(() => {
    // Initialize socket connection once
    socketRef.current = io(URL);
    const socket = socketRef.current;
    let checkhost = localStorage.getItem("isHost");
    if (checkhost != "true") {

      setTimeout(() => {
        localStorage.setItem("isHost", true);
        localStorage.setItem("id", socketRef.current.id);
        setLoading(false);
        setData(true);
      }, 200);
      console.log(socketRef);
    } else {
      setTimeout(() => {
        console.log("else called");
        setData(false);
        setLoading(false);
      }, 200);
    }
    // Emit 'checkhost' event when the component mounts
    socket.emit("checkhost");

    // Setup socket event listeners
    socket.on("check", (isHost) => {
      let val = localStorage.getItem("isHost");
      if (val != "true") {
        socket.emit("makehost");
        setHo(false);
      } else {
        setHo(true);
      }
    });

 
    socket.on("hadd", (v) => {
      // setVV(localStorage.getItem('listener'));
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.emit("delhost");
      if (socketRef.current.id == localStorage.getItem("id")) {
        localStorage.removeItem("isHost");
        localStorage.removeItem("id");
      }
      socket.disconnect();
    };
  }, []);
  useEffect(()=>{
    setVV(localStorage.getItem('listener'))
  },[localStorage.getItem('listener')])

  function cls() {
    window.dispatchEvent(new Event("beforeunload"));
  }
  if (!data && !loading) return <Already></Already>;
  if (loading) return <div>Loading...</div>;
  if (!loading && data)
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="flex flex-col items-center h-full">
          <h1 className="text-5xl font-bold mb-5">
            <h1 className="flex flex-col items-center h-full"> WELCOME </h1>
            <h1 className="flex flex-col items-center h-full"> TO </h1>
            THE HOST PORT
          </h1>

          {/* <h1 className="text-5xl font-bold">Broadcast</h1> */}
          <Radio size={100} className="mb-4" />
          <MicrophoneButton socket={socketRef.current} />
          <MusicControls socket={socketRef.current} />
        </div>
      </div>
    );
}

export default Host;
