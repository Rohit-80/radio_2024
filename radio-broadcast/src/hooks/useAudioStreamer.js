import { AudioStreamer } from "jnaudiostream";
import { useEffect, useRef } from "react";

const useAudioStreamer = (socket) => {
    const streamerRef = useRef(new AudioStreamer());
    socket.emit('cadd');
    useEffect(() => {
        const streamer = streamerRef.current;
        // console.log('media - buffer - ',streamer,streamer.mediaBuffer);

        socket.on("bufferHeader", (packet) => {
            if (streamer.mediaBuffer) {
                return;
            }

            streamer.setBufferHeader(packet);
            streamer.playStream();
        });

        socket.on("stream", (packet) => {
            if (!streamer.mediaBuffer) {
                return;
            }
            streamer.receiveBuffer(packet);
        });

        return () => {
            socket.off("bufferHeader");
            socket.off("stream");
            socket.emit('deladd')
        };
    },[socket]);
};

export default useAudioStreamer;
