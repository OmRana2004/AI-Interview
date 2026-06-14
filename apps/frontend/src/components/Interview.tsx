import { BACKEND_URL } from "@/lib/config";
import { useEffect, useRef } from "react"
import { useParams } from "react-router"
export function Interview() {
    const { interviewId } = useParams();
        const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        (async () => {
             // Peer connection
             const pc = new RTCPeerConnection();

            audioRef.current = document.createElement("audio");
            audioRef.current.autoplay = true;
            pc.ontrack = (e) =>(audioRef.current!.srcObject = e.streams[0]!);

            const ms = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })
            pc.addTrack(ms.getTracks()[0]!);

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log("hi Sir")

            const sdpResponse = await fetch(`${BACKEND_URL}/api/v1/session`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    "Connection-Type": "application/sdp"               
                },
            });

            console.log("hello sir")
            const answer = {
                type: "answer" as "answer",
                sdp: await sdpResponse.text(),
            };
            await pc.setRemoteDescription(answer);
        })()
    }, [interviewId])

    return <div>
        <audio autoPlay ref={audioRef}></audio>
        Interview
    </div>
}