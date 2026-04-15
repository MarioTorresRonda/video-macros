import PrettyButton from "@/components/Commons/PrettyButton";
import { deleteVideo } from "@/http/video";
import { OptionContext } from "@/store/option-context";
import { useContext } from "react";

export default function DeleteButton( { selectedVideos, toUpload, com, handleVideoPathUpdate } ) {

    const { mainFolder, uploadFolder } = useContext( OptionContext );
    
    async function comVideos() {
        for( const video of selectedVideos ) {
            const params = {
                mainFolder : toUpload ? uploadFolder : mainFolder,
                fileName : video,
                com : com ? 1 : 0
            };

            await deleteVideo( params, {} )
            handleVideoPathUpdate();
        }
    }

    return <PrettyButton
        onClick={comVideos}
    >
        Borrar video { selectedVideos.length }
    </PrettyButton>
}