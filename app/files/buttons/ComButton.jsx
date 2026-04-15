import PrettyButton from "@/components/Commons/PrettyButton";
import { comVideo, moveVideo } from "@/http/video";
import { OptionContext } from "@/store/option-context";
import { useContext } from "react";

export default function ComButton( { selectedVideos, toUpload, com, handleVideoPathUpdate } ) {

    const { mainFolder } = useContext( OptionContext );
    
    async function comVideos() {
        for( const video of selectedVideos ) {
            const params = {
                mainFolder,
                fileName : video,
            };

            await comVideo( params, {} )
            handleVideoPathUpdate();
        }
    }

    return <PrettyButton
        onClick={comVideos}
        disabled={ !(toUpload && !com) }    
    >
        Crear fichero COM { selectedVideos.length }
    </PrettyButton>
}