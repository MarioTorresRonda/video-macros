import PrettyButton from "@/components/Commons/PrettyButton";
import { setIDVideo } from "@/http/video";
import { OptionContext } from "@/store/option-context";
import { useContext } from "react";

export default function SetIDButton( { selectedVideos, formatted, toUpload, com, handleVideoPathUpdate } ) {

    const { mainFolder, uploadFolder } = useContext( OptionContext );
    
    async function setIDVideos() {
        for( const video of selectedVideos ) {
            const params = {
                mainFolder : !toUpload ? mainFolder : uploadFolder,
                fileName : video,
                com : com ? 1 : 0
            };

            await setIDVideo( params, {} )
            handleVideoPathUpdate();
        }
    }

    return <PrettyButton
        onClick={setIDVideos}
        disabled={ formatted }    
    >
        Agregar ID { selectedVideos.length }
    </PrettyButton>
}