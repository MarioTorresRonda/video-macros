import PrettyButton from "@/components/Commons/PrettyButton";
import { moveVideo } from "@/http/video";
import { OptionContext } from "@/store/option-context";
import { useContext } from "react";

export default function MoveUploadButton( { selectedVideos, toUpload, handleVideoPathUpdate } ) {

    const { mainFolder, uploadFolder } = useContext( OptionContext );

    async function handleOnClickMove() {
        for( const video of selectedVideos ) {
            const params = {
                dirPath : mainFolder,
                newDirPath: uploadFolder,
                fileName : video
            }

            await moveVideo( params, {} );
        }

        handleVideoPathUpdate();
    }

    return <PrettyButton
        onClick={handleOnClickMove}
        disabled={toUpload}    
    >
        Mover a Subir { selectedVideos.length }
    </PrettyButton>
}