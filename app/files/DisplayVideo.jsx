import { useFetch } from "@/hooks/useFetch";
import { displayVideo } from "@/http/video";
import { useEffect, useRef } from "react";

export default function DisplayVideo( { url, ...props } ) {

    const videoRef = useRef(null)

    useEffect(() => {
        if( videoRef.current ) {
            console.log( url );
            videoRef.current.src = `/api/video/display?videoPath=${encodeURIComponent(url)}`;
        }
    }, [url, videoRef])
    
    if ( url == "" ) {
        return <div> Select video </div>
    }

    return <video ref={videoRef} controls {...props}/>
}